const express = require('express')
const cors = require('cors')
const path = require('path')
const config = require('./config')
const logger = require('./logger')
const GitManager = require('./git-manager')
const Scheduler = require('./scheduler')

// Import routes
const healthRoutes = require('./routes/health')
const subagentRoutes = require('./routes/subagents')

class SubagentGitServer {
  constructor() {
    this.app = express()
    this.server = null
    this.gitManager = null
    this.scheduler = null

    this.setupMiddleware()
    this.setupRoutes()
    this.setupErrorHandling()
  }

  setupMiddleware() {
    // CORS configuration
    this.app.use(cors({
      origin: config.CORS_ORIGIN,
      credentials: true
    }))

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }))
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }))

    // Request logging
    this.app.use((req, res, next) => {
      logger.info('Request received', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      })
      next()
    })

    // Rate limiting middleware
    const requestCounts = new Map()

    this.app.use((req, res, next) => {
      const clientId = req.ip
      const now = Date.now()
      const windowStart = now - config.RATE_LIMIT_WINDOW

      // Clean old entries
      for (const [id, data] of requestCounts.entries()) {
        if (data.windowStart < windowStart) {
          requestCounts.delete(id)
        }
      }

      // Get or create client data
      let clientData = requestCounts.get(clientId)
      if (!clientData) {
        clientData = { count: 0, windowStart: now }
        requestCounts.set(clientId, clientData)
      }

      // Reset window if needed
      if (clientData.windowStart < windowStart) {
        clientData.count = 0
        clientData.windowStart = now
      }

      // Check rate limit
      if (clientData.count >= config.RATE_LIMIT_MAX) {
        return res.status(429).json({
          success: false,
          error: 'Too many requests',
          message: `Rate limit exceeded. Max ${config.RATE_LIMIT_MAX} requests per ${config.RATE_LIMIT_WINDOW / 1000 / 60} minutes.`
        })
      }

      clientData.count++
      next()
    })
  }

  setupRoutes() {
    // API routes
    this.app.use('/api/health', healthRoutes)
    this.app.use('/api/subagents', subagentRoutes)

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        data: {
          name: 'Subagent Git Manager',
          version: '1.0.0',
          description: 'Backend service for managing awesome-claude-code-subagents repository',
          endpoints: {
            health: '/api/health',
            subagents: {
              status: '/api/subagents/status',
              list: '/api/subagents',
              update: '/api/subagents/update',
              info: '/api/subagents/info',
              search: '/api/subagents/search?q=query'
            }
          },
          uptime: process.uptime(),
          timestamp: new Date().toISOString()
        }
      })
    })

    // 404 handler - catch-all for unmatched routes
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Route ${req.method} ${req.originalUrl} not found`
      })
    })
  }

  setupErrorHandling() {
    // Global error handler
    this.app.use((error, req, res, next) => {
      logger.error('Unhandled error', {
        error: error.message,
        stack: error.stack,
        method: req.method,
        url: req.url,
        ip: req.ip
      })

      res.status(error.status || 500).json({
        success: false,
        error: error.name || 'Internal Server Error',
        message: error.message || 'An unexpected error occurred'
      })
    })

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Promise Rejection', {
        reason: reason.toString(),
        promise: promise.toString()
      })
    })

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', {
        error: error.message,
        stack: error.stack
      })

      // Graceful shutdown
      this.gracefulShutdown()
    })

    // Handle termination signals
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received')
      this.gracefulShutdown()
    })

    process.on('SIGINT', () => {
      logger.info('SIGINT received')
      this.gracefulShutdown()
    })
  }

  async start() {
    try {
      logger.info('Starting Subagent Git Manager', {
        port: config.SERVER_PORT,
        nodeEnv: config.NODE_ENV,
        repoUrl: config.REPO_URL,
        repoPath: config.REPO_PATH
      })

      // Initialize git manager
      this.gitManager = new GitManager()

      // Initialize scheduler
      this.scheduler = new Scheduler()

      // Start scheduler
      this.scheduler.start(this.gitManager, logger)

      // Start server
      this.server = this.app.listen(config.SERVER_PORT, () => {
        logger.info('Server started successfully', {
          port: config.SERVER_PORT,
          pid: process.pid
        })

        console.log(`🚀 Subagent Git Manager running on port ${config.SERVER_PORT}`)
        console.log(`📊 Health check: http://localhost:${config.SERVER_PORT}/api/health`)
        console.log(`📦 Repository: ${config.REPO_URL}`)
        console.log(`📁 Target path: ${config.REPO_PATH}`)
      })

      // Set server timeout
      this.server.timeout = 30000 // 30 seconds

      return this.server
    } catch (error) {
      logger.error('Failed to start server', {
        error: error.message,
        stack: error.stack
      })
      throw error
    }
  }

  async gracefulShutdown() {
    logger.info('Starting graceful shutdown')

    try {
      // Stop accepting new connections
      if (this.server) {
        this.server.close(async () => {
          logger.info('HTTP server closed')

          try {
            // Stop scheduler
            if (this.scheduler) {
              this.scheduler.stop()
              logger.info('Scheduler stopped')
            }

            logger.info('Graceful shutdown completed')
            process.exit(0)
          } catch (error) {
            logger.error('Error during shutdown', { error: error.message })
            process.exit(1)
          }
        })
      } else {
        process.exit(0)
      }
    } catch (error) {
      logger.error('Graceful shutdown failed', { error: error.message })
      process.exit(1)
    }
  }

  getStatus() {
    return {
      server: {
        running: !!this.server,
        port: config.SERVER_PORT,
        uptime: process.uptime()
      },
      scheduler: this.scheduler ? this.scheduler.getStatus() : null,
      gitManager: {
        repoUrl: config.REPO_URL,
        repoPath: config.REPO_PATH
      }
    }
  }
}

// Start server if this file is run directly
if (require.main === module) {
  const server = new SubagentGitServer()
  server.start().catch(error => {
    console.error('Failed to start server:', error)
    process.exit(1)
  })
}

module.exports = SubagentGitServer