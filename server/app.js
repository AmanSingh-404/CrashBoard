const express      = require('express')
const cors         = require('cors')
const helmet       = require('helmet')
const morgan       = require('morgan')
const errorHandler = require('./middleware/errorHandler')

const app = express()

// ── Security & logging
app.use(helmet())
app.use(morgan('dev'))

// ── CORS — allow React frontend
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

// ── Body parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CrashBoard API is running 🚀' })
})

// ── Routes
app.use('/api/auth',     require('./routes/auth.routes'))
app.use('/api/projects', require('./routes/project.routes'))
app.use('/api/ingest',   require('./routes/ingest.routes'))
app.use('/api/errors',   require('./routes/error.routes'))
app.use('/api/alerts',   require('./routes/alert.routes'))
app.use('/api/team',     require('./routes/team.routes'))

// ── Global error handler (must be last)
app.use(errorHandler)

module.exports = app