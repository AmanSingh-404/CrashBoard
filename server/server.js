require('./src/config/env')
const http = require('http')
const { Server } = require('socket.io')
const app        = require('./app')
const connectDB  = require('./src/config/db')

const PORT       = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

// ── Connect to MongoDB
connectDB()

// ── Create HTTP server
const httpServer = http.createServer(app)

// ── Attach Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
  },
})

// ── Make io accessible in controllers via req.app.get('io')
app.set('io', io)

// ── Socket events
io.on('connection', (socket) => {
  console.log(` Socket connected: ${socket.id}`)

  // frontend joins a room for their project
  // so live errors only go to the right dashboard
  socket.on('join_project', (projectId) => {
    socket.join(projectId)
    console.log(` Socket ${socket.id} joined project: ${projectId}`)
  })

  socket.on('disconnect', () => {
    console.log(` Socket disconnected: ${socket.id}`)
  })
})

// ── Start server
httpServer.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`)
  console.log(` Socket.io ready`)
  console.log(` Health: http://localhost:${PORT}/api/health`)
})