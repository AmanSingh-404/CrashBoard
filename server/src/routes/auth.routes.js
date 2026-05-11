const express = require('express')
const router  = express.Router()

const { register, login, getMe } = require('../controllers/auth.controller')
const { protect } = require('../middleware/auth')

// public routes — no token needed
router.post('/register', register)
router.post('/login',    login)

// protected route — token required
router.get('/me', protect, getMe)

module.exports = router