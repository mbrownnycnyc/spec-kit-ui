const fs = require('fs').promises
const path = require('path')
const config = require('./config')

class Logger {
  constructor() {
    this.logLevels = {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      DEBUG: 3
    }

    this.currentLevel = this.logLevels[config.LOG_LEVEL.toUpperCase()] || this.logLevels.INFO
    this.logFile = path.join(__dirname, config.LOG_FILE)
  }

  // Safely serialize objects that might contain circular references
  safeStringify(obj) {
    const cache = new Set()
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          // Circular reference found, return a placeholder
          return '[Circular Reference]'
        }
        cache.add(value)
      }
      return value
    })
  }

  async writeLog(level, message, meta = {}) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...meta
    }

    // Console output
    const consoleMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`
    if (meta && Object.keys(meta).length > 0) {
      console.log(consoleMessage, meta)
    } else {
      console.log(consoleMessage)
    }

    // File output - use safeStringify to handle circular references
    try {
      const logLine = this.safeStringify(logEntry) + '\n'
      await fs.appendFile(this.logFile, logLine)
    } catch (error) {
      console.error('Failed to write to log file:', error.message)
    }
  }

  async error(message, meta = {}) {
    if (this.currentLevel >= this.logLevels.ERROR) {
      await this.writeLog('ERROR', message, meta)
    }
  }

  async warn(message, meta = {}) {
    if (this.currentLevel >= this.logLevels.WARN) {
      await this.writeLog('WARN', message, meta)
    }
  }

  async info(message, meta = {}) {
    if (this.currentLevel >= this.logLevels.INFO) {
      await this.writeLog('INFO', message, meta)
    }
  }

  async debug(message, meta = {}) {
    if (this.currentLevel >= this.logLevels.DEBUG) {
      await this.writeLog('DEBUG', message, meta)
    }
  }

  // Convenience method for structured logging
  async logOperation(operation, success, details = {}) {
    const level = success ? 'info' : 'error'
    const message = `Operation ${operation} ${success ? 'completed' : 'failed'}`

    await this[level](message, {
      operation,
      success,
      ...details
    })
  }
}

module.exports = new Logger()