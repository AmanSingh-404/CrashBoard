const jwt = require('jsonwebtoken')
const User = require('../models/User.models')
const { JWT_SECRET } = require('../config/env')

const protect = async (req, res, next) => {
  try {
    // get token from Authorization header
    // header looks like: "Bearer eyJhbGci..."
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please log in.',
      })
    }

    const token = authHeader.split(' ')[1]

    // verify the token — throws if expired or invalid
    const decoded = jwt.verify(token, JWT_SECRET)

    // attach the user to the request so any controller can use req.user
    req.user = await User.findById(decoded.id).select('-password')

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.',
      })
    }

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    })
  }
}

module.exports = { protect }