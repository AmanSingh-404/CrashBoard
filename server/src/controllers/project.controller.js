const Project        = require('../models/Project.models')
const generateApiKey = require('../utils/generateApiKey')

// ── CREATE PROJECT
const createProject = async (req, res, next) => {
  try {
    const { name, description, platform } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required',
      })
    }

    const project = await Project.create({
      name,
      description,
      platform,
      owner:   req.user._id,
      apiKey:  generateApiKey(),
      members: [{ user: req.user._id, role: 'admin' }],
    })

    res.status(201).json({ success: true, project })
  } catch (error) {
    next(error)
  }
}

// ── GET ALL MY PROJECTS
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id },
      ],
    })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, count: projects.length, projects })
  } catch (error) {
    next(error)
  }
}

// ── GET SINGLE PROJECT
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email')

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    const isMember = project.members.some(
      m => m.user._id.toString() === req.user._id.toString()
    )
    const isOwner = project.owner._id.toString() === req.user._id.toString()

    if (!isMember && !isOwner) {
      return res.status(403).json({ success: false, message: 'You do not have access to this project' })
    }

    res.status(200).json({ success: true, project })
  } catch (error) {
    next(error)
  }
}

// ── UPDATE PROJECT
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the project owner can update it' })
    }

    const { name, description, platform } = req.body
    if (name)        project.name        = name
    if (description) project.description = description
    if (platform)    project.platform    = platform

    await project.save()

    res.status(200).json({ success: true, project })
  } catch (error) {
    next(error)
  }
}

// ── DELETE PROJECT
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the project owner can delete it' })
    }

    await project.deleteOne()

    res.status(200).json({ success: true, message: 'Project deleted successfully' })
  } catch (error) {
    next(error)
  }
}

// ── REGENERATE API KEY
const regenerateApiKey = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the project owner can regenerate the API key' })
    }

    project.apiKey = generateApiKey()
    await project.save()

    res.status(200).json({ success: true, message: 'API key regenerated', apiKey: project.apiKey })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  regenerateApiKey,
}