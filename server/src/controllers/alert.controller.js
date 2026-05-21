const Alert   = require('../models/Alert')
const Project = require('../models/Project.models')

// ── CREATE ALERT
// POST /api/alerts/:projectId
const createAlert = async (req, res, next) => {
  try {
    const { projectId } = req.params
    const {
      threshold,
      timeWindow,
      errorType,
      emailEnabled,
      emailTo,
      slackEnabled,
      slackWebhook,
      cooldownMinutes,
    } = req.body

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    // only owner can create alerts
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only project owner can create alerts' })
    }

    const alert = await Alert.create({
      project: projectId,
      threshold:       threshold       || 5,
      timeWindow:      timeWindow      || 10,
      errorType:       errorType       || 'any',
      emailEnabled:    emailEnabled    ?? true,
      emailTo:         emailTo         || req.user.email,
      slackEnabled:    slackEnabled    || false,
      slackWebhook:    slackWebhook    || '',
      cooldownMinutes: cooldownMinutes || 30,
    })

    res.status(201).json({ success: true, alert })
  } catch (error) {
    next(error)
  }
}

// ── GET ALL ALERTS FOR A PROJECT
// GET /api/alerts/:projectId
const getAlerts = async (req, res, next) => {
  try {
    const { projectId } = req.params

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    const alerts = await Alert.find({ project: projectId }).sort({ createdAt: -1 })
    res.status(200).json({ success: true, alerts })
  } catch (error) {
    next(error)
  }
}

// ── UPDATE ALERT
// PUT /api/alerts/:projectId/:alertId
const updateAlert = async (req, res, next) => {
  try {
    const { projectId, alertId } = req.params

    const alert = await Alert.findOneAndUpdate(
      { _id: alertId, project: projectId },
      req.body,
      { new: true }
    )

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' })
    }

    res.status(200).json({ success: true, alert })
  } catch (error) {
    next(error)
  }
}

// ── DELETE ALERT
// DELETE /api/alerts/:projectId/:alertId
const deleteAlert = async (req, res, next) => {
  try {
    const { projectId, alertId } = req.params

    await Alert.findOneAndDelete({ _id: alertId, project: projectId })
    res.status(200).json({ success: true, message: 'Alert deleted' })
  } catch (error) {
    next(error)
  }
}

// ── TOGGLE ALERT ON/OFF
// PATCH /api/alerts/:projectId/:alertId/toggle
const toggleAlert = async (req, res, next) => {
  try {
    const { projectId, alertId } = req.params

    const alert = await Alert.findOne({ _id: alertId, project: projectId })
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' })
    }

    alert.isActive = !alert.isActive
    await alert.save()

    res.status(200).json({ success: true, alert, message: `Alert ${alert.isActive ? 'enabled' : 'disabled'}` })
  } catch (error) {
    next(error)
  }
}

module.exports = { createAlert, getAlerts, updateAlert, deleteAlert, toggleAlert }