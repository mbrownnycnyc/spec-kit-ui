require('dotenv').config()

const config = {
  // Repository Configuration
  REPO_URL: process.env.REPO_URL || 'https://github.com/VoltAgent/awesome-claude-code-subagents.git',
  REPO_PATH: process.env.REPO_PATH || './external-subagents',

  // Server Configuration
  SERVER_PORT: process.env.SERVER_PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Scheduling Configuration
  CHECK_INTERVAL: parseInt(process.env.CHECK_INTERVAL) || 60 * 60 * 1000, // 1 hour
  MAX_DAILY_INTERVAL: parseInt(process.env.MAX_DAILY_INTERVAL) || 24 * 60 * 60 * 1000, // 24 hours

  // Logging Configuration
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // Security Configuration
  API_KEY: process.env.API_KEY || 'your-secret-api-key',

  // File paths
  LAST_UPDATE_FILE: '.last-git-update',
  LOG_FILE: 'git-manager.log',

  // API Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: 100 // requests per window
}

module.exports = config