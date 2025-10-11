const express = require('express')
const router = express.Router()
const fs = require('fs').promises
const path = require('path')
const config = require('../config')

// Import enhanced parser and cache
const {
  parseEnhancedSubagent,
  getAllCategories,
  getAllAvailableTechnologies,
  formatForAPI
} = require('../subagent-parser')
const SubagentCache = require('../subagent-cache')
const SubagentValidator = require('../subagent-validator')

// Initialize validator and cache
const validator = new SubagentValidator()
const cache = new SubagentCache()

// Load filter configuration for backward compatibility
let filterConfig = null
try {
  filterConfig = require('../subagent-filter-config')
} catch (error) {
  console.warn('Could not load subagent filter config, using validator defaults:', error.message)
  filterConfig = { description: 'No config loaded' }
}

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

// Enhanced filtering endpoint
router.get('/filter', async (req, res) => {
  try {
    const logger = require('../logger')
    const GitManager = require('../git-manager')

    const {
      categories,
      technologies,
      experienceLevels,
      complexities,
      search,
      sortBy = 'relevance',
      sortOrder = 'asc',
      limit = 20,
      offset = 0,
      expand = false
    } = req.query

    const filters = {
      categories: categories ? (Array.isArray(categories) ? categories : [categories]) : [],
      technologies: technologies ? (Array.isArray(technologies) ? technologies : [technologies]) : [],
      experienceLevels: experienceLevels ? (Array.isArray(experienceLevels) ? experienceLevels : [experienceLevels]) : [],
      complexities: complexities ? (Array.isArray(complexities) ? complexities : [complexities]) : [],
      search: search || '',
      sortBy,
      sortOrder,
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0,
      expand: expand === 'true'
    }

    // Check cache first
    const cachedResult = await cache.getFilteredSubagents(filters)
    if (cachedResult) {
      logger.debug('Returning cached filter result', { filters, resultCount: cachedResult.subagents.length })
      return res.json({
        success: true,
        data: cachedResult
      })
    }

    const gitManager = new GitManager()
    const repoPath = gitManager.repoPath
    let indexData

    // Try to use GitManager first, fall back to direct file scanning
    try {
      // Check if repository exists
      await fs.access(repoPath)

      // Get or build index
      indexData = await cache.getIndex()
      if (!indexData || cache.isStale()) {
        logger.info('Building subagent index...')
        indexData = await buildSubagentIndex(gitManager, logger)
        await cache.setIndex(indexData)
      }
    } catch (error) {
      // Fall back to direct file scanning if git operations fail
      logger.info('Git operations failed, using direct file scanning', { error: error.message })
      indexData = await buildSubagentIndexDirect(logger)
      await cache.setIndex(indexData)
    }

    // Apply filters
    let filteredSubagents = indexData.subagents.filter(subagent => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(subagent.category.id)) {
        return false
      }

      // Technology filter
      if (filters.technologies.length > 0) {
        const hasMatchingTech = filters.technologies.some(tech =>
          subagent.technologies.some(subagentTech =>
            subagentTech.toLowerCase().includes(tech.toLowerCase())
          )
        )
        if (!hasMatchingTech) return false
      }

      // Experience level filter
      if (filters.experienceLevels.length > 0 && !filters.experienceLevels.includes(subagent.experienceLevel)) {
        return false
      }

      // Complexity filter
      if (filters.complexities.length > 0 && !filters.complexities.includes(subagent.complexity)) {
        return false
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const searchableText = [
          subagent.title,
          subagent.description,
          subagent.whyMatters,
          ...subagent.keywords,
          ...subagent.technologies,
          ...subagent.integrations,
          ...subagent.useCases
        ].join(' ').toLowerCase()

        if (!searchableText.includes(searchLower)) {
          return false
        }
      }

      return true
    })

    // Sort results
    filteredSubagents = sortSubagents(filteredSubagents, filters.sortBy, filters.sortOrder, filters.search)

    // Apply pagination
    const totalCount = filteredSubagents.length
    const paginatedSubagents = filteredSubagents.slice(filters.offset, filters.offset + filters.limit)

    // Get full content if requested
    let resultSubagents = paginatedSubagents
    if (filters.expand) {
      resultSubagents = await getFullSubagentContent(paginatedSubagents, gitManager, logger)
    } else {
      resultSubagents = paginatedSubagents.map(formatForAPI)
    }

    // Build response
    const result = {
      subagents: resultSubagents,
      totalCount,
      filteredCount: filteredSubagents.length,
      categories: indexData.categories,
      availableFilters: {
        categories: buildFilterOptions(indexData.subagents, 'category'),
        technologies: buildFilterOptions(indexData.subagents, 'technologies'),
        experienceLevels: buildFilterOptions(indexData.subagents, 'experienceLevel'),
        complexities: buildFilterOptions(indexData.subagents, 'complexity')
      },
      pagination: {
        limit: filters.limit,
        offset: filters.offset,
        hasNext: filters.offset + filters.limit < totalCount,
        hasPrev: filters.offset > 0
      }
    }

    // Cache the result
    await cache.setFilteredSubagents(filters, result)

    logger.info(`Filter query completed`, {
      filters,
      resultCount: result.subagents.length,
      totalCount,
      cacheStats: cache.getCacheStats()
    })

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    const logger = require('../logger')
    logger.error('Filter query failed', { error: error.message, stack: error.stack })

    res.status(500).json({
      success: false,
      error: 'Filter query failed',
      message: error.message
    })
  }
})

// Get categories endpoint
router.get('/categories', async (req, res) => {
  try {
    const logger = require('../logger')
    const GitManager = require('../git-manager')

    // Check cache first
    let categories = await cache.getCategories()
    if (!categories) {
      categories = getAllCategories()
      await cache.setCategories(categories)
    }

    res.json({
      success: true,
      data: categories
    })
  } catch (error) {
    const logger = require('../logger')
    logger.error('Failed to get categories', { error: error.message })

    res.status(500).json({
      success: false,
      error: 'Failed to get categories',
      message: error.message
    })
  }
})

// Get all subagents (legacy endpoint)
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

        // Apply validation using the validator
        if (!shouldIncludeFile(file.name, file.path, content)) {
          continue
        }

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

// Clear cache endpoint
router.post('/clear-cache', async (req, res) => {
  try {
    const logger = require('../logger')

    // Clear all cache data
    await cache.clearCache()

    logger.info('Cache cleared successfully')

    res.json({
      success: true,
      data: {
        message: 'All cache data cleared successfully',
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    const logger = require('../logger')
    logger.error('Failed to clear cache', { error: error.message })

    res.status(500).json({
      success: false,
      error: 'Failed to clear cache',
      message: error.message
    })
  }
})

// Validation statistics endpoint
router.get('/validation-stats', async (req, res) => {
  try {
    const logger = require('../logger')
    const GitManager = require('../git-manager')

    const gitManager = new GitManager()
    const repoPath = gitManager.repoPath

    try {
      await fs.access(repoPath)

      // Get all markdown files
      const files = await gitManager.getRepositoryFiles()
      const mdFiles = files.filter(file => file.name.endsWith('.md'))

      // Validate all files
      const validationResults = []

      for (const file of mdFiles) {
        try {
          const filePath = path.join(repoPath, file.path)
          const content = await fs.readFile(filePath, 'utf8')

          const validation = validator.validate(file.name, file.path, content)
          validationResults.push({
            fileName: file.name,
            filePath: file.path,
            valid: validation.valid,
            reason: validation.reason,
            category: validation.category,
            metadata: validation.metadata
          })
        } catch (error) {
          validationResults.push({
            fileName: file.name,
            filePath: file.path,
            valid: false,
            reason: `Error reading file: ${error.message}`,
            category: 'file_error'
          })
        }
      }

      // Calculate statistics
      const stats = {
        total: validationResults.length,
        valid: validationResults.filter(r => r.valid).length,
        invalid: validationResults.filter(r => r.valid === false).length,
        byCategory: {},
        byReason: {}
      }

      validationResults.forEach(result => {
        if (!result.valid) {
          stats.byCategory[result.category] = (stats.byCategory[result.category] || 0) + 1
          stats.byReason[result.reason] = (stats.byReason[result.reason] || 0) + 1
        }
      })

      res.json({
        success: true,
        data: {
          stats,
          files: validationResults,
          summary: {
            excludedFiles: validationResults.filter(r => !r.valid && r.category === 'file_exclusion'),
            validSubagents: validationResults.filter(r => r.valid),
            issuesFound: Object.keys(stats.byReason).length > 0
          }
        }
      })
    } catch (error) {
      res.json({
        success: true,
        data: {
          stats: { total: 0, valid: 0, invalid: 0 },
          files: [],
          summary: { issuesFound: false, error: error.message }
        }
      })
    }
  } catch (error) {
    const logger = require('../logger')
    logger.error('Failed to get validation stats', { error: error.message })

    res.status(500).json({
      success: false,
      error: 'Failed to get validation stats',
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

          // Apply validation first
          if (!shouldIncludeFile(file.name, file.path, content)) {
            continue
          }

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

// Helper functions for file filtering (using new validator)
function shouldIncludeFile(fileName, filePath, content) {
  const validation = validator.validate(fileName, filePath, content)
  // Debug: log first few validation results
  if (fileName === 'api-designer.md') {
    console.log('DEBUG: Validation for api-designer.md:', {
      fileName,
      filePath,
      valid: validation.valid,
      reason: validation.reason,
      category: validation.category
    })
  }
  return validation.valid
}

// Helper functions for filtering and indexing
async function buildSubagentIndex(gitManager, logger) {
  try {
    const files = await gitManager.getRepositoryFiles()
    const mdFiles = files.filter(file => file.name.endsWith('.md'))

    logger.info(`Building index for ${mdFiles.length} markdown files`)

    const subagents = []
    const categoryCounts = {}
    const technologyCounts = {}
    let filteredCount = 0

    for (const file of mdFiles) {
      try {
        const filePath = path.join(gitManager.repoPath, file.path)
        const content = await fs.readFile(filePath, 'utf8')

        // Apply filtering logic using the configuration
        if (!shouldIncludeFile(file.name, file.path, content)) {
          filteredCount++
          continue
        }

        const subagent = parseEnhancedSubagent(content, filePath)
        if (!subagent) continue

        // Count categories
        if (!categoryCounts[subagent.category.id]) {
          categoryCounts[subagent.category.id] = 0
        }
        categoryCounts[subagent.category.id]++

        // Count technologies
        subagent.technologies.forEach(tech => {
          if (!technologyCounts[tech]) {
            technologyCounts[tech] = 0
          }
          technologyCounts[tech]++
        })

        subagents.push(formatForAPI(subagent))
      } catch (error) {
        logger.warn('Failed to parse subagent file', {
          filename: file.name,
          error: error.message
        })
      }
    }

    logger.info(`Filtered out ${filteredCount} files that didn't meet criteria`)

    // Update category counts
    const categories = getAllCategories().map(cat => ({
      ...cat,
      count: categoryCounts[cat.id] || 0
    }))

    logger.info(`Built index with ${subagents.length} subagents`)

    return {
      subagents,
      categories,
      technologies: Object.keys(technologyCounts).sort(),
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    logger.error('Failed to build subagent index', { error: error.message })
    throw error
  }
}

function sortSubagents(subagents, sortBy, sortOrder, searchQuery) {
  const sorted = [...subagents]

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => {
        const comparison = a.title.localeCompare(b.title)
        return sortOrder === 'desc' ? -comparison : comparison
      })

    case 'category':
      return sorted.sort((a, b) => {
        const comparison = a.category.order - b.category.order
        return sortOrder === 'desc' ? -comparison : comparison
      })

    case 'experienceLevel':
      const levelOrder = { junior: 1, intermediate: 2, senior: 3, expert: 4 }
      return sorted.sort((a, b) => {
        const aLevel = levelOrder[a.experienceLevel] || 0
        const bLevel = levelOrder[b.experienceLevel] || 0
        const comparison = aLevel - bLevel
        return sortOrder === 'desc' ? -comparison : comparison
      })

    case 'updated':
      return sorted.sort((a, b) => {
        const aTime = new Date(a.lastUpdated).getTime()
        const bTime = new Date(b.lastUpdated).getTime()
        const comparison = aTime - bTime
        return sortOrder === 'desc' ? -comparison : comparison
      })

    case 'relevance':
    default:
      if (searchQuery) {
        return sorted.sort((a, b) => {
          // Simple relevance scoring based on search term matches
          const aScore = calculateRelevanceScore(a, searchQuery)
          const bScore = calculateRelevanceScore(b, searchQuery)
          const comparison = bScore - aScore // Higher score first
          return sortOrder === 'desc' ? -comparison : comparison
        })
      }
      return sorted
  }
}

function calculateRelevanceScore(subagent, searchQuery) {
  const searchLower = searchQuery.toLowerCase()
  let score = 0

  // Title matches get highest score
  if (subagent.title.toLowerCase().includes(searchLower)) {
    score += 10
  }

  // Description matches
  if (subagent.description.toLowerCase().includes(searchLower)) {
    score += 5
  }

  // Technology matches
  subagent.technologies.forEach(tech => {
    if (tech.toLowerCase().includes(searchLower)) {
      score += 3
    }
  })

  // Category matches
  if (subagent.category.name.toLowerCase().includes(searchLower)) {
    score += 2
  }

  // Keyword matches
  subagent.keywords.forEach(keyword => {
    if (keyword.includes(searchLower)) {
      score += 1
    }
  })

  return score
}

function buildFilterOptions(subagents, field) {
  const values = new Set()

  subagents.forEach(subagent => {
    let value
    switch (field) {
      case 'category':
        value = subagent.category.id
        break
      case 'technologies':
        subagent.technologies.forEach(tech => values.add(tech))
        return Array.from(values).sort()
      case 'experienceLevel':
        value = subagent.experienceLevel
        break
      case 'complexity':
        value = subagent.complexity
        break
      default:
        return []
    }

    if (value) {
      values.add(value)
    }
  })

  return Array.from(values).sort()
}

async function getFullSubagentContent(subagents, gitManager, logger) {
  const fullSubagents = []

  for (const subagent of subagents) {
    try {
      // Check cache first
      const cached = await cache.getContent(subagent.id)
      if (cached) {
        fullSubagents.push({
          ...subagent,
          ...cached.content
        })
        continue
      }

      // Load from file
      const filePath = path.join(gitManager.repoPath, subagent.path)
      const content = await fs.readFile(filePath, 'utf8')
      const fullSubagent = parseEnhancedSubagent(content, subagent.path)

      if (fullSubagent) {
        // Cache the full content
        await cache.setContent(subagent.id, { content: fullSubagent })
        fullSubagents.push({
          ...subagent,
          ...fullSubagent
        })
      }
    } catch (error) {
      logger.warn('Failed to load full subagent content', {
        subagentId: subagent.id,
        error: error.message
      })
      // Return basic subagent data
      fullSubagents.push(subagent)
    }
  }

  return fullSubagents
}

// Direct file scanning fallback for when git operations fail
async function buildSubagentIndexDirect(logger) {
  try {
    const basePath = path.resolve(__dirname, '../external-subagents')
    logger.info(`Building direct index from ${basePath}`)

    const subagents = []
    const categoryCounts = {}
    const technologyCounts = {}
    let filteredCount = 0

    async function scanDirectory(dir, relativePath = '') {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true })

        for (const entry of entries) {
          const entryPath = path.join(dir, entry.name)
          const relativeEntryPath = path.join(relativePath, entry.name)

          if (entry.isDirectory() && !entry.name.startsWith('.')) {
            await scanDirectory(entryPath, relativeEntryPath)
          } else if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.startsWith('.')) {
            try {
              const content = await fs.readFile(entryPath, 'utf8')

              // Apply filtering logic using the configuration
              if (!shouldIncludeFile(entry.name, relativeEntryPath, content)) {
                filteredCount++
                continue
              }

              const subagent = parseEnhancedSubagent(content, path.relative(basePath, entryPath))
              if (!subagent) continue

              // Count categories
              if (!categoryCounts[subagent.category.id]) {
                categoryCounts[subagent.category.id] = 0
              }
              categoryCounts[subagent.category.id]++

              // Count technologies
              subagent.technologies.forEach(tech => {
                if (!technologyCounts[tech]) {
                  technologyCounts[tech] = 0
                }
                technologyCounts[tech]++
              })

              subagents.push(formatForAPI(subagent))
            } catch (error) {
              logger.warn('Failed to parse subagent file', {
                filename: entry.name,
                error: error.message
              })
            }
          }
        }
      } catch (error) {
        logger.warn('Failed to scan directory', { dir, error: error.message })
      }
    }

    await scanDirectory(basePath)
    logger.info(`Direct scan filtered out ${filteredCount} files that didn't meet criteria`)

    // Update category counts
    const categories = getAllCategories().map(cat => ({
      ...cat,
      count: categoryCounts[cat.id] || 0
    }))

    logger.info(`Built direct index with ${subagents.length} subagents`)

    return {
      subagents,
      categories,
      technologies: Object.keys(technologyCounts).sort(),
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    logger.error('Failed to build direct subagent index', { error: error.message })
    throw error
  }
}

module.exports = router