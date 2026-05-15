const express           = require('express')
const router            = express.Router()
const { validateApiKey } = require('../middlewares/validateApiKey')
const { ingestError }   = require('../controllers/ingest.controller.js')

// POST /api/ingest/:apiKey
// public route — no JWT needed, only API key validation
// this is what the SDK calls
router.post('/:apiKey', validateApiKey, ingestError)

module.exports = router