const jwt  = require('jsonwebtoken')
const User = require('../models/User.models')
const { JWT_SECRET } = require('../config/env')

// helper — creates a signed JWT for a user
const signToken = (userId) => {
  return jwt.sign(
    { id: userId },
    JWT_SECRET,
    { expiresIn: '7d' } // token lasts 7 days
  )
}

// ── REGISTER
// POST /api/auth/register
// body: { name, email, password }
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // check all fields are present
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password',
      })
    }

    // check if email is already taken
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      })
    }

    // create the user — password is auto-hashed by the model's pre-save hook
    const user = await User.create({ name, email, password })

    // generate token
    const token = signToken(user._id)

    res.status(201).json({
      success: true,
      token,
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

// ── LOGIN
// POST /api/auth/login
// body: { email, password }
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      })
    }

    // find user and explicitly include password (it's select:false by default)
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // compare entered password with hashed one in DB
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    const token = signToken(user._id)

    res.status(200).json({
      success: true,
      token,
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

// ── GET ME
// GET /api/auth/me
// requires: Bearer token in Authorization header
const getMe = async (req, res) => {
  // req.user is already attached by the protect middleware
  res.status(200).json({
    success: true,
    user: req.user,
  })
}

module.exports = { register, login, getMe }