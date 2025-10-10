const express = require('express')
const router = express.Router()
const fs = require('fs').promises
const path = require('path')
const config = require('../config')

// Parse subagent content from markdown
function parseSubagentFromMarkdown(content) {
  const lines = content.split('\n')
  const subagent = {
    title: '',
    description: '',
    whyMatters: '',
    whenToUse: [],
    whatToDoNext: [],
    exampleCode: ''
  }

  let currentSection = ''
  let codeBlock = false
  let currentList = []

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('# ')) {
      subagent.title = trimmed.replace('# ', '').trim()
    } else if (trimmed.startsWith('## Description')) {
      currentSection = 'description'
    } else if (trimmed.startsWith('## Why')) {
      currentSection = 'why'
      currentList = []
    } else if (trimmed.startsWith('## When to')) {
      currentSection = 'when'
      currentList = []
    } else if (trimmed.startsWith('## What to')) {
      currentSection = 'what'
      currentList = []
    } else if (trimmed.startsWith('```')) {
      codeBlock = !codeBlock
      if (!codeBlock) {
        subagent.exampleCode = subagent.exampleCode.trim()
      }
    } else if (codeBlock) {
      subagent.exampleCode += line + '\n'
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const item = trimmed.replace(/^[-*]\s+/, '')
      currentList.push(item)
    } else if (trimmed && currentSection === 'description') {
      subagent.description += (subagent.description ? ' ' : '') + trimmed
    } else if (trimmed && currentSection === 'why') {
      subagent.whyMatters += (subagent.whyMatters ? ' ' : '') + trimmed
    }
  }

  // Handle list items that might be for different sections
  if (currentSection === 'when') {
    subagent.whenToUse = currentList.filter(Boolean)
  } else if (currentSection === 'what') {
    subagent.whatToDoNext = currentList.filter(Boolean)
  }

  return subagent
}

// Format subagent for display
function formatForDisplay(subagent) {
  return {
    title: subagent.title || 'Untitled Subagent',
    description: subagent.description || 'No description available.',
    whyMatters: subagent.whyMatters || 'This subagent helps streamline development workflows.',
    whenToUse: Array.isArray(subagent.whenToUse) ? subagent.whenToUse : [],
    whatToDoNext: Array.isArray(subagent.whatToDoNext) ? subagent.whatToDoNext : [],
    exampleCode: subagent.exampleCode || '# Example code not available'
  }
}

// Get repository status
router.get('/status', async (req, res) => {
  try {
    const logger = require('../logger')
    const GitManager = require('../git-manager')
    const scheduler = require('../scheduler')

    const gitManager = new GitManager()

    // Check if repository exists and get status
    const updateCheck = await gitManager.hasUpdates()
    let repoInfo = null

    try {
      repoInfo = await gitManager.getRepositoryInfo()
    } catch (error) {
      logger.warn('Could not get repository info', { error: error.message })
    }

    const schedulerStatus = scheduler.getStatus ? scheduler.getStatus() : null

    res.json({
      success: true,
      data: {
        repository: updateCheck,
        info: repoInfo,
        scheduler: schedulerStatus,
        lastUpdate: schedulerStatus?.lastUpdateTime || null
      }
    })
  } catch (error) {
    const logger = require('../logger')
    logger.error('Failed to get subagent status', { error: error.message })

    res.status(500).json({
      success: false,
      error: 'Failed to get subagent status',
      message: error.message
    })
  }
})

// Get all subagents
router.get('/', async (req, res) => {
  try {
    const logger = require('../logger')
    const GitManager = require('../git-manager')

    const gitManager = new GitManager()
    const repoPath = gitManager.repoPath

    // Check if repository exists
    try {
      await fs.access(repoPath)
    } catch (error) {
      return res.json({
        success: true,
        data: {
          subagents: [],
          repositoryExists: false,
          message: 'Repository not yet cloned. Please update first.'
        }
      })
    }

    // Scan for markdown files
    const subagents = []
    const files = await gitManager.getRepositoryFiles()
    const mdFiles = files.filter(file => file.name.endsWith('.md'))

    logger.info(`Found ${mdFiles.length} markdown files`, { count: mdFiles.length })

    for (const file of mdFiles) {
      try {
        const filePath = path.join(repoPath, file.path)
        const content = await fs.readFile(filePath, 'utf8')

        // Skip if content is too small or doesn't look like a subagent
        if (content.length < 100) continue

        const parsed = parseSubagentFromMarkdown(content)
        const formatted = formatForDisplay(parsed)

        subagents.push({
          ...formatted,
          filename: file.name,
          path: file.path,
          source: 'awesome-claude-code-subagents'
        })
      } catch (error) {
        logger.warn('Failed to parse subagent file', {
          filename: file.name,
          error: error.message
        })
      }
    }

    logger.info(`Successfully parsed ${subagents.length} subagents`, { count: subagents.length })

    res.json({
      success: true,
      data: {
        subagents,
        repositoryExists: true,
        totalCount: subagents.length,
        lastUpdate: new Date().toISOString()
      }
    })
  } catch (error) {
    const logger = require('../logger')
    logger.error('Failed to get subagents', { error: error.message })

    res.status(500).json({
      success: false,
      error: 'Failed to get subagents',
      message: error.message
    })
  }
})

// Force update
router.post('/update', async (req, res) => {
  try {
    const logger = require('../logger')
    const GitManager = require('../git-manager')
    const scheduler = require('../scheduler')

    logger.info('Force update requested via API')

    const gitManager = new GitManager()
    const updateResult = await scheduler.forceUpdate(gitManager)

    res.json({
      success: true,
      data: updateResult
    })
  } catch (error) {
    const logger = require('../logger')
    logger.error('Force update failed', { error: error.message })

    res.status(500).json({
      success: false,
      error: 'Force update failed',
      message: error.message
    })
  }
})

// Get repository info
router.get('/info', async (req, res) => {
  try {
    const logger = require('../logger')
    const GitManager = require('../git-manager')

    const gitManager = new GitManager()

    try {
      const repoInfo = await gitManager.getRepositoryInfo()

      res.json({
        success: true,
        data: repoInfo
      })
    } catch (error) {
      res.json({
        success: true,
        data: {
          exists: false,
          error: error.message,
          message: 'Repository not yet available'
        }
      })
    }
  } catch (error) {
    const logger = require('../logger')
    logger.error('Failed to get repository info', { error: error.message })

    res.status(500).json({
      success: false,
      error: 'Failed to get repository info',
      message: error.message
    })
  }
})

// Search subagents
router.get('/search', async (req, res) => {
  try {
    const logger = require('../logger')
    const { q: query } = req.query

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters'
      })
    }

    // Get all subagents first
    const GitManager = require('../git-manager')
    const gitManager = new GitManager()

    try {
      const repoPath = gitManager.repoPath
      await fs.access(repoPath)

      const files = await gitManager.getRepositoryFiles()
      const mdFiles = files.filter(file => file.name.endsWith('.md'))

      const searchResults = []
      const lowercaseQuery = query.toLowerCase()

      for (const file of mdFiles) {
        try {
          const filePath = path.join(repoPath, file.path)
          const content = await fs.readFile(filePath, 'utf8')

          if (content.toLowerCase().includes(lowercaseQuery)) {
            const parsed = parseSubagentFromMarkdown(content)
            const formatted = formatForDisplay(parsed)

            searchResults.push({
              ...formatted,
              filename: file.name,
              path: file.path,
              source: 'awesome-claude-code-subagents'
            })
          }
        } catch (error) {
          logger.warn('Failed to search in file', {
            filename: file.name,
            error: error.message
          })
        }
      }

      res.json({
        success: true,
        data: {
          query,
          results: searchResults,
          totalCount: searchResults.length
        }
      })
    } catch (error) {
      res.json({
        success: true,
        data: {
          query,
          results: [],
          totalCount: 0,
          repositoryExists: false
        }
      })
    }
  } catch (error) {
    const logger = require('../logger')
    logger.error('Search failed', { error: error.message })

    res.status(500).json({
      success: false,
      error: 'Search failed',
      message: error.message
    })
  }
})

module.exports = router