const express = require('express')
const subagentRoutes = require('./routes/subagents')

const app = express()
app.use(express.json())

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  if (err.stack) {
    console.error('Stack:', err.stack)
  }
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  })
})

// Use subagent routes
app.use('/api/subagents', subagentRoutes)

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Test server is working', timestamp: new Date().toISOString() })
})

// Test route listing
app.get('/routes', (req, res) => {
  const routes = []
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      })
    }
  })
  res.json({ routes })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`)
  console.log(`Test: http://localhost:${PORT}/test`)
  console.log(`Routes: http://localhost:${PORT}/routes`)
  console.log(`Subagents: http://localhost:${PORT}/api/subagents/filter?limit=1`)
})