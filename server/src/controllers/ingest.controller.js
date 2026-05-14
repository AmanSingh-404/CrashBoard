const ErrorModel              = require('../models/Error')
const { generateFingerprint } = require('../services/fingerprint.service')
const { parseUserAgent }      = require('../utils/parseUserAgent')

// POST /api/ingest/:apiKey
// called by crashboard-sdk every time an error is captured
const ingestError = async (req, res, next) => {
  try {
    const project = req.project  // attached by validateApiKey middleware
    const io      = req.app.get('io')  // Socket.io instance

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

    // ── Step 1: generate fingerprint for deduplication
    const fingerprint = generateFingerprint(type, message, stack)

    // ── Step 2: parse browser and OS from user agent
    const { browser, os } = parseUserAgent(userAgent)

    // ── Step 3: check if this exact error already exists for this project
    const existingError = await ErrorModel.findOne({
      project:     project._id,
      fingerprint,
    })

    let savedError

    if (existingError) {
      // ── DUPLICATE — just increment counters and update lastSeenAt
      existingError.occurrences += 1
      existingError.affectedUsers += 1
      existingError.lastSeenAt = new Date()

      // add new breadcrumbs to the existing record
      if (breadcrumbs.length > 0) {
        existingError.breadcrumbs = breadcrumbs
      }

      await existingError.save()
      savedError = existingError

      console.log(`📊 Duplicate error grouped: ${type} (${existingError.occurrences} times)`)
    } else {
      // ── NEW ERROR — create a fresh record
      savedError = await ErrorModel.create({
        project:     project._id,
        type,
        message,
        stack,
        fingerprint,
        environment,
        userAgent,
        browser,
        os,
        url,
        breadcrumbs,
        webVitals,
        firstSeenAt: new Date(),
        lastSeenAt:  new Date(),
      })

      console.log(`🚨 New error captured: ${type} — ${message}`)
    }

    // ── Step 4: broadcast to the project's Socket.io room
    // anyone viewing this project's dashboard gets the update instantly
    io.to(project._id.toString()).emit('new_error', {
      error:      savedError,
      projectId:  project._id,
      isNew:      !existingError,
    })

    // ── Step 5: send back a success response to the SDK
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