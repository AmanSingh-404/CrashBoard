const crypto             = require('crypto')
const Project            = require('../models/Project')
const User               = require('../models/User')
const Comment            = require('../models/Comment')
const ErrorModel         = require('../models/Error')
const { sendInviteEmail } = require('../services/alert.service')

// store pending invites in memory
// in production you'd store these in Redis or MongoDB
const pendingInvites = new Map()

// ── INVITE TEAM MEMBER
// POST /api/team/:projectId/invite
// body: { email }
const inviteMember = async (req, res, next) => {
  try {
    const { projectId } = req.params
    const { email }     = req.body

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    const project = await Project.findById(projectId)
      .populate('owner', 'name email')
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    // only owner or admin can invite
    const isOwner = project.owner._id.toString() === req.user._id.toString()
    const isAdmin = project.members.some(
      m => m.user.toString() === req.user._id.toString() && m.role === 'admin'
    )
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Only admins can invite members' })
    }

    // check if user is already a member
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      const alreadyMember = project.members.some(
        m => m.user.toString() === existingUser._id.toString()
      )
      if (alreadyMember) {
        return res.status(400).json({ success: false, message: 'User is already a member' })
      }
    }

    // generate invite token
    const token     = crypto.randomBytes(32).toString('hex')
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000  // 24 hours

    pendingInvites.set(token, { email, projectId, expiresAt })

    // send email
    await sendInviteEmail(
      email,
      req.user.name,
      project.name,
      token,
    )

    res.status(200).json({
      success: true,
      message: `Invitation sent to ${email}`,
    })
  } catch (error) {
    next(error)
  }
}

// ── ACCEPT INVITE
// POST /api/team/accept-invite
// body: { token }
const acceptInvite = async (req, res, next) => {
  try {
    const { token } = req.body

    const invite = pendingInvites.get(token)
    if (!invite) {
      return res.status(400).json({ success: false, message: 'Invalid or expired invite link' })
    }

    if (Date.now() > invite.expiresAt) {
      pendingInvites.delete(token)
      return res.status(400).json({ success: false, message: 'Invite link has expired' })
    }

    const project = await Project.findById(invite.projectId)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    // add the accepting user as a member
    const alreadyMember = project.members.some(
      m => m.user.toString() === req.user._id.toString()
    )

    if (!alreadyMember) {
      project.members.push({ user: req.user._id, role: 'member' })
      await project.save()
    }

    pendingInvites.delete(token)

    res.status(200).json({
      success: true,
      message: `You've joined ${project.name}!`,
      project,
    })
  } catch (error) {
    next(error)
  }
}

// ── GET TEAM MEMBERS
// GET /api/team/:projectId/members
const getMembers = async (req, res, next) => {
  try {
    const { projectId } = req.params

    const project = await Project.findById(projectId)
      .populate('owner',          'name email')
      .populate('members.user',   'name email')

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    res.status(200).json({
      success: true,
      owner:   project.owner,
      members: project.members,
    })
  } catch (error) {
    next(error)
  }
}

// ── REMOVE TEAM MEMBER
// DELETE /api/team/:projectId/members/:userId
const removeMember = async (req, res, next) => {
  try {
    const { projectId, userId } = req.params

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    // only owner can remove members
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the owner can remove members' })
    }

    project.members = project.members.filter(
      m => m.user.toString() !== userId
    )
    await project.save()

    res.status(200).json({ success: true, message: 'Member removed' })
  } catch (error) {
    next(error)
  }
}

// ── ADD COMMENT TO AN ERROR
// POST /api/team/:projectId/errors/:errorId/comments
// body: { text }
const addComment = async (req, res, next) => {
  try {
    const { projectId, errorId } = req.params
    const { text } = req.body

    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' })
    }

    // verify error exists
    const error = await ErrorModel.findOne({ _id: errorId, project: projectId })
    if (!error) {
      return res.status(404).json({ success: false, message: 'Error not found' })
    }

    const comment = await Comment.create({
      error:   errorId,
      project: projectId,
      author:  req.user._id,
      text:    text.trim(),
    })

    // populate author info for the response
    await comment.populate('author', 'name email')

    // broadcast new comment to dashboard via Socket.io
    const io = req.app.get('io')
    io.to(projectId).emit('new_comment', { comment, errorId })

    res.status(201).json({ success: true, comment })
  } catch (error) {
    next(error)
  }
}

// ── GET COMMENTS FOR AN ERROR
// GET /api/team/:projectId/errors/:errorId/comments
const getComments = async (req, res, next) => {
  try {
    const { projectId, errorId } = req.params

    const comments = await Comment.find({
      error:   errorId,
      project: projectId,
    })
      .populate('author', 'name email')
      .sort({ createdAt: 1 })  // oldest first

    res.status(200).json({ success: true, comments })
  } catch (error) {
    next(error)
  }
}

// ── DELETE COMMENT
// DELETE /api/team/:projectId/errors/:errorId/comments/:commentId
const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params

    const comment = await Comment.findById(commentId)
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' })
    }

    // only author can delete their comment
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only delete your own comments' })
    }

    await comment.deleteOne()
    res.status(200).json({ success: true, message: 'Comment deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  inviteMember,
  acceptInvite,
  getMembers,
  removeMember,
  addComment,
  getComments,
  deleteComment,
}