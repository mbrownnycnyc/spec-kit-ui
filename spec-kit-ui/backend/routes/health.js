const express = require('express')
const router = express.Router()

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    const logger = require('../logger')
    const scheduler = require('../scheduler')

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      },
      scheduler: scheduler.getStatus ? scheduler.getStatus() : null
    }

    res.json({
      success: true,
      data: healthData
    })
  } catch (error) {
    const logger = require('../logger')
    logger.error('Health check failed', { error: error.message })

    res.status(500).json({
      success: false,
      error: 'Health check failed',
      message: error.message
    })
  }
})

// Detailed health endpoint with repository status
router.get('/detailed', async (req, res) => {
  try {
    const logger = require('../logger')
    const scheduler = require('../scheduler')
    const GitManager = require('../git-manager')

    const gitManager = new GitManager()

    // Get repository status
    let repoStatus = { accessible: false }
    try {
      repoStatus = await gitManager.hasUpdates()
      repoStatus.accessible = true
    } catch (error) {
      repoStatus.error = error.message
    }

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      },
      scheduler: scheduler.getStatus ? scheduler.getStatus() : null,
      repository: repoStatus,
      statistics: scheduler.getStatistics ? scheduler.getStatistics() : null
    }

    res.json({
      success: true,
      data: healthData
    })
  } catch (error) {
    const logger = require('../logger')
    logger.error('Detailed health check failed', { error: error.message })

    res.status(500).json({
      success: false,
      error: 'Detailed health check failed',
      message: error.message
    })
  }
})

module.exports = router