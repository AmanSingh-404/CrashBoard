const Project = require('../models/Project')

// validates the API key from the URL and attaches the project to req
// used by the ingest endpoint: POST /api/ingest/:apiKey
const validateApiKey = async (req, res, next) => {
  try {
    const { apiKey } = req.params

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key is required',
      })
    }

    const project = await Project.findOne({ apiKey, isActive: true })

    if (!project) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or inactive API key',
      })
    }

    // attach project to request so the controller can use it
    req.project = project
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = { validateApiKey }