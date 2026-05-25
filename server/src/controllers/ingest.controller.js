const ErrorModel              = require('../models/Error.models.js')
const { generateFingerprint } = require('../services/fingerprint.service')
const { parseUserAgent }      = require('../utils/parseUserAgent')
const { checkAndFireAlerts }  = require('../services/alert.service')

const ingestError = async (req, res, next) => {
  try {
    const project = req.project
    const io      = req.app.get('io')

    const {
      type        = 'Error',
      message     = 'Unknown error',
      stack       = '',
      environment = 'production',
      userAgent   = '',
      url         = '',
      breadcrumbs = [],
      webVitals   = {},
    } = req.body

    const fingerprint        = generateFingerprint(type, message, stack)
    const { browser, os }   = parseUserAgent(userAgent)
    const existingError      = await ErrorModel.findOne({ project: project._id, fingerprint })

    let savedError

    if (existingError) {
      existingError.occurrences  += 1
      existingError.affectedUsers += 1
      existingError.lastSeenAt    = new Date()
      if (breadcrumbs.length > 0) existingError.breadcrumbs = breadcrumbs
      await existingError.save()
      savedError = existingError
      console.log(`Duplicate error grouped: ${type} (${existingError.occurrences} times)`)
    } else {
      savedError = await ErrorModel.create({
        project: project._id,
        type, message, stack, fingerprint,
        environment, userAgent, browser, os, url,
        breadcrumbs, webVitals,
        firstSeenAt: new Date(),
        lastSeenAt:  new Date(),
      })
      console.log(`New error captured: ${type} — ${message}`)
    }

    // broadcast live to dashboard
    io.to(project._id.toString()).emit('new_error', {
      error:     savedError,
      projectId: project._id,
      isNew:     !existingError,
    })

    // check and fire alerts
    await checkAndFireAlerts(project, savedError)

    res.status(200).json({
      success: true,
      message: existingError ? 'Error grouped with existing' : 'Error captured',
      errorId: savedError._id,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { ingestError }