const ErrorModel = require('../models/Error.models.js')
const Project    = require('../models/Project.models.js')

// helper — checks if user has access to a project
const hasAccess = (project, userId) => {
  const isOwner  = project.owner.toString() === userId.toString()
  const isMember = project.members.some(m => m.user.toString() === userId.toString())
  return isOwner || isMember
}

// ── GET ALL ERRORS FOR A PROJECT
// GET /api/errors/:projectId
// supports filters: ?status=open&type=TypeError&page=1&limit=20
const getErrors = async (req, res, next) => {
  try {
    const { projectId } = req.params
    const {
      status,
      type,
      environment,
      page  = 1,
      limit = 20,
    } = req.query

    // verify project exists and user has access
    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }
    if (!hasAccess(project, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }

    // build filter object dynamically
    const filter = { project: projectId }
    if (status)      filter.status      = status
    if (type)        filter.type        = type
    if (environment) filter.environment = environment

    const skip  = (parseInt(page) - 1) * parseInt(limit)
    const total = await ErrorModel.countDocuments(filter)

    const errors = await ErrorModel.find(filter)
      .sort({ lastSeenAt: -1 })   // most recently seen first
      .skip(skip)
      .limit(parseInt(limit))
      .populate('assignedTo', 'name email')

    res.status(200).json({
      success: true,
      total,
      page:    parseInt(page),
      pages:   Math.ceil(total / parseInt(limit)),
      errors,
    })
  } catch (error) {
    next(error)
  }
}

// ── GET SINGLE ERROR
// GET /api/errors/:projectId/:errorId
const getError = async (req, res, next) => {
  try {
    const { projectId, errorId } = req.params

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }
    if (!hasAccess(project, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }

    const error = await ErrorModel.findOne({ _id: errorId, project: projectId })
      .populate('assignedTo', 'name email')

    if (!error) {
      return res.status(404).json({ success: false, message: 'Error not found' })
    }

    res.status(200).json({ success: true, error })
  } catch (error) {
    next(error)
  }
}

// ── UPDATE ERROR STATUS
// PATCH /api/errors/:projectId/:errorId/status
// body: { status: 'resolved' | 'ignored' | 'open' }
const updateErrorStatus = async (req, res, next) => {
  try {
    const { projectId, errorId } = req.params
    const { status } = req.body

    if (!['open', 'resolved', 'ignored'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' })
    }

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }
    if (!hasAccess(project, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }

    const error = await ErrorModel.findOneAndUpdate(
      { _id: errorId, project: projectId },
      { status },
      { new: true }  // return the updated document
    )

    if (!error) {
      return res.status(404).json({ success: false, message: 'Error not found' })
    }

    // broadcast status change to dashboard via Socket.io
    const io = req.app.get('io')
    io.to(projectId).emit('error_updated', { errorId, status })

    res.status(200).json({ success: true, error })
  } catch (error) {
    next(error)
  }
}

// ── ASSIGN ERROR TO A TEAM MEMBER
// PATCH /api/errors/:projectId/:errorId/assign
// body: { userId: '...' }
const assignError = async (req, res, next) => {
  try {
    const { projectId, errorId } = req.params
    const { userId } = req.body

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }
    if (!hasAccess(project, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }

    const error = await ErrorModel.findOneAndUpdate(
      { _id: errorId, project: projectId },
      { assignedTo: userId },
      { new: true }
    ).populate('assignedTo', 'name email')

    if (!error) {
      return res.status(404).json({ success: false, message: 'Error not found' })
    }

    res.status(200).json({ success: true, error })
  } catch (error) {
    next(error)
  }
}

// ── DELETE ERROR
// DELETE /api/errors/:projectId/:errorId
const deleteError = async (req, res, next) => {
  try {
    const { projectId, errorId } = req.params

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    // only owner can delete errors
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only project owner can delete errors' })
    }

    await ErrorModel.findOneAndDelete({ _id: errorId, project: projectId })

    res.status(200).json({ success: true, message: 'Error deleted' })
  } catch (error) {
    next(error)
  }
}

// ── GET ANALYTICS FOR A PROJECT
// GET /api/errors/:projectId/analytics
const getAnalytics = async (req, res, next) => {
  try {
    const { projectId } = req.params

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }
    if (!hasAccess(project, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }

    // run all analytics queries in parallel for speed
    const [
      totalErrors,
      openErrors,
      resolvedErrors,
      ignoredErrors,
      topErrors,
      browserBreakdown,
      errorsByDay,
    ] = await Promise.all([

      // total error count
      ErrorModel.countDocuments({ project: projectId }),

      // by status
      ErrorModel.countDocuments({ project: projectId, status: 'open' }),
      ErrorModel.countDocuments({ project: projectId, status: 'resolved' }),
      ErrorModel.countDocuments({ project: projectId, status: 'ignored' }),

      // top 5 most occurring errors
      ErrorModel.find({ project: projectId })
        .sort({ occurrences: -1 })
        .limit(5)
        .select('type message occurrences affectedUsers status'),

      // browser breakdown
      ErrorModel.aggregate([
        { $match: { project: project._id } },
        { $group: { _id: '$browser', count: { $sum: 1 } } },
        { $sort:  { count: -1 } },
      ]),

      // errors per day for last 7 days
      ErrorModel.aggregate([
        {
          $match: {
            project:   project._id,
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id:   { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ])

    res.status(200).json({
      success: true,
      analytics: {
        total:    totalErrors,
        open:     openErrors,
        resolved: resolvedErrors,
        ignored:  ignoredErrors,
        resolutionRate: totalErrors > 0
          ? Math.round((resolvedErrors / totalErrors) * 100)
          : 0,
        topErrors,
        browserBreakdown,
        errorsByDay,
      },
    })
  } catch (error) {
    next(error)
  }
}

const { explainError } = require('../services/gemini.service')

// ── AI EXPLAIN ERROR
// POST /api/errors/:projectId/:errorId/explain
const explainErrorAI = async (req, res, next) => {
  try {
    const { projectId, errorId } = req.params

    // check project access
    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }
    if (!hasAccess(project, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }

    // find the error
    const error = await ErrorModel.findOne({ _id: errorId, project: projectId })
    if (!error) {
      return res.status(404).json({ success: false, message: 'Error not found' })
    }

    // if AI already explained this error, return cached result
    // no need to call Gemini API again and waste quota
    if (error.aiExplanation?.cause) {
      console.log('[AI] Returning cached explanation')
      return res.status(200).json({
        success:     true,
        cached:      true,
        explanation: error.aiExplanation,
      })
    }

    // call Gemini API
    console.log('[AI] Calling Gemini for:', error.type, error.message)
    const explanation = await explainError(error.type, error.message, error.stack)

    // save explanation to DB so we don't call API again
    error.aiExplanation = explanation
    await error.save()

    res.status(200).json({
      success:     true,
      cached:      false,
      explanation,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getErrors,
  getError,
  updateErrorStatus,
  assignError,
  deleteError,
  getAnalytics,
  explainErrorAI,
}