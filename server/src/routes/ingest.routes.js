const express           = require('express')
const router            = express.Router()
const { validateApiKey } = require('../middleware/validateApiKey')
const { ingestError }   = require('../controllers/ingest.controller')

// POST /api/ingest/:apiKey
// public route — no JWT needed, only API key validation
// this is what the SDK calls
router.post('/:apiKey', validateApiKey, ingestError)

module.exports = router