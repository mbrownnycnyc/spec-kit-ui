const fs = require('fs').promises
const path = require('path')
const logger = require('./logger')
const config = require('./config')

class Scheduler {
  constructor() {
    this.intervalId = null
    this.isRunning = false
    this.lastUpdateTime = 0
    this.updateCount = 0
    this.errorCount = 0
    this.startTime = new Date()
  }

  async getLastUpdate(lastUpdateFile = config.LAST_UPDATE_FILE) {
    try {
      const data = await fs.readFile(lastUpdateFile, 'utf8')
      const timestamp = parseInt(data.trim())

      if (isNaN(timestamp)) {
        logger.warn('Invalid timestamp in last update file', { lastUpdateFile, data })
        return 0
      }

      logger.debug('Retrieved last update time', {
        lastUpdateFile,
        timestamp,
        date: new Date(timestamp).toISOString()
      })

      return timestamp
    } catch (error) {
      if (error.code === 'ENOENT') {
        logger.debug('Last update file does not exist', { lastUpdateFile })
        return 0
      }

      logger.error('Failed to read last update file', {
        lastUpdateFile,
        error: error.message
      })
      return 0
    }
  }

  async saveLastUpdate(lastUpdateFile = config.LAST_UPDATE_FILE) {
    try {
      const now = Date.now()
      await fs.writeFile(lastUpdateFile, now.toString())

      this.lastUpdateTime = now

      logger.debug('Saved last update time', {
        lastUpdateFile,
        timestamp: now,
        date: new Date(now).toISOString()
      })

      return now
    } catch (error) {
      logger.error('Failed to save last update time', {
        lastUpdateFile,
        error: error.message
      })
      throw error
    }
  }

  shouldPull(lastUpdate) {
    const now = Date.now()
    const timeSinceUpdate = now - lastUpdate

    // Maximum 24 hour interval
    const maxInterval = config.MAX_DAILY_INTERVAL
    const shouldUpdate = timeSinceUpdate >= maxInterval

    logger.debug('Checking if pull should occur', {
      lastUpdate,
      now,
      timeSinceUpdate,
      maxInterval,
      shouldUpdate,
      hoursSinceUpdate: timeSinceUpdate / (1000 * 60 * 60)
    })

    return shouldUpdate
  }

  async checkForUpdates(gitManager, force = false) {
    if (this.isRunning && !force) {
      logger.debug('Update check already in progress, skipping')
      return { pulled: false, reason: 'already_running' }
    }

    this.isRunning = true

    try {
      logger.info('Starting update check', { force })

      const lastUpdate = await this.getLastUpdate()

      // Check if we should pull (either force or time-based)
      if (!force && !this.shouldPull(lastUpdate)) {
        const timeSinceUpdate = Date.now() - lastUpdate
        const hoursUntilNext = (config.MAX_DAILY_INTERVAL - timeSinceUpdate) / (1000 * 60 * 60)

        logger.info('Skipping update check - within 24h window', {
          lastUpdate: new Date(lastUpdate).toISOString(),
          hoursSinceUpdate: timeSinceUpdate / (1000 * 60 * 60),
          hoursUntilNext
        })

        return {
          pulled: false,
          reason: 'within_24h',
          hoursUntilNext: Math.max(0, hoursUntilNext)
        }
      }

      // Check if repository has updates
      const updateCheck = await gitManager.hasUpdates()

      if (!updateCheck.needsUpdate) {
        logger.info('No updates available', {
          localHash: updateCheck.localHash,
          remoteHash: updateCheck.remoteHash
        })

        // Still update the last check time to prevent excessive checking
        await this.saveLastUpdate()

        return {
          pulled: false,
          reason: 'no_updates',
          localHash: updateCheck.localHash,
          remoteHash: updateCheck.remoteHash
        }
      }

      logger.info('Updates detected, performing pull operation', {
        reason: updateCheck.reason,
        localHash: updateCheck.localHash,
        remoteHash: updateCheck.remoteHash
      })

      // Perform the update
      const updateResult = await gitManager.ensureRepository()

      if (updateResult.success) {
        await this.saveLastUpdate()
        this.updateCount++

        logger.info('Update completed successfully', {
          action: updateResult.action,
          updated: updateResult.updated,
          totalUpdates: this.updateCount
        })

        return {
          pulled: true,
          action: updateResult.action,
          updated: updateResult.updated,
          totalUpdates: this.updateCount
        }
      } else {
        this.errorCount++
        logger.error('Update failed', {
          error: updateResult.error,
          totalErrors: this.errorCount
        })

        return {
          pulled: false,
          error: updateResult.error,
          totalErrors: this.errorCount
        }
      }
    } catch (error) {
      this.errorCount++
      logger.error('Update check failed', {
        error: error.message,
        stack: error.stack,
        totalErrors: this.errorCount
      })

      return {
        pulled: false,
        error: error.message,
        totalErrors: this.errorCount
      }
    } finally {
      this.isRunning = false
    }
  }

  start(gitManager, logger) {
    if (this.intervalId) {
      logger.warn('Scheduler already started')
      return
    }

    logger.info('Starting scheduler', {
      checkInterval: config.CHECK_INTERVAL,
      maxDailyInterval: config.MAX_DAILY_INTERVAL
    })

    // Check immediately on start
    this.checkForUpdates(gitManager, false).catch(error => {
      logger.error('Initial update check failed', { error: error.message })
    })

    // Set up periodic checks
    this.intervalId = setInterval(async () => {
      try {
        await this.checkForUpdates(gitManager, false)
      } catch (error) {
        logger.error('Scheduled update check failed', { error: error.message })
      }
    }, config.CHECK_INTERVAL)

    logger.info('Scheduler started successfully', {
      intervalId: this.intervalId,
      checkIntervalMs: config.CHECK_INTERVAL
    })
  }

  stop() {
    if (!this.intervalId) {
      return
    }

    clearInterval(this.intervalId)
    this.intervalId = null

    logger.info('Scheduler stopped', {
      runningTime: Date.now() - this.startTime.getTime(),
      totalUpdates: this.updateCount,
      totalErrors: this.errorCount
    })
  }

  getStatus() {
    const uptime = Date.now() - this.startTime.getTime()

    return {
      isRunning: !!this.intervalId,
      isChecking: this.isRunning,
      uptime,
      startTime: this.startTime.toISOString(),
      lastUpdateTime: this.lastUpdateTime ? new Date(this.lastUpdateTime).toISOString() : null,
      updateCount: this.updateCount,
      errorCount: this.errorCount,
      checkInterval: config.CHECK_INTERVAL,
      maxDailyInterval: config.MAX_DAILY_INTERVAL
    }
  }

  async forceUpdate(gitManager) {
    logger.info('Force update requested')
    return await this.checkForUpdates(gitManager, true)
  }

  getStatistics() {
    const uptime = Date.now() - this.startTime.getTime()
    const uptimeHours = uptime / (1000 * 60 * 60)

    return {
      uptime,
      uptimeHours,
      startTime: this.startTime.toISOString(),
      lastUpdateTime: this.lastUpdateTime ? new Date(this.lastUpdateTime).toISOString() : null,
      updateCount: this.updateCount,
      errorCount: this.errorCount,
      successRate: this.updateCount + this.errorCount > 0
        ? (this.updateCount / (this.updateCount + this.errorCount)) * 100
        : 100,
      averageUpdateFrequency: uptimeHours > 0 ? this.updateCount / uptimeHours : 0
    }
  }
}

module.exports = Scheduler