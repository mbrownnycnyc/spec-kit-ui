const fs = require('fs').promises
const path = require('path')
const crypto = require('crypto')

class SubagentCache {
  constructor() {
    this.cacheDir = path.join(__dirname, '.cache')
    this.indexCacheFile = path.join(this.cacheDir, 'subagent-index.json')
    this.filterCacheDir = path.join(this.cacheDir, 'filters')
    this.contentCacheFile = path.join(this.cacheDir, 'content-cache.json')
    this.categoriesFile = path.join(this.cacheDir, 'categories.json')
    this.technologiesFile = path.join(this.cacheDir, 'technologies.json')

    this.indexCache = null
    this.contentCache = new Map()
    this.filterCache = new Map()
    this.categories = null
    this.technologies = null
    this.lastUpdate = null

    this.initializeCache()
  }

  async initializeCache() {
    try {
      // Ensure cache directory exists
      await fs.mkdir(this.cacheDir, { recursive: true })
      await fs.mkdir(this.filterCacheDir, { recursive: true })

      // Load existing cache if available
      await this.loadCache()
    } catch (error) {
      console.error('Failed to initialize cache:', error.message)
    }
  }

  async loadCache() {
    try {
      // Load index cache
      if (await this.fileExists(this.indexCacheFile)) {
        const indexData = await fs.readFile(this.indexCacheFile, 'utf8')
        this.indexCache = JSON.parse(indexData)
        this.lastUpdate = this.indexCache.lastUpdate
      }

      // Load categories cache
      if (await this.fileExists(this.categoriesFile)) {
        const categoriesData = await fs.readFile(this.categoriesFile, 'utf8')
        this.categories = JSON.parse(categoriesData)
      }

      // Load technologies cache
      if (await this.fileExists(this.technologiesFile)) {
        const technologiesData = await fs.readFile(this.technologiesFile, 'utf8')
        this.technologies = JSON.parse(technologiesData)
      }

      // Load filter cache
      const filterFiles = await fs.readdir(this.filterCacheDir)
      for (const file of filterFiles) {
        const filePath = path.join(this.filterCacheDir, file)
        const filterData = await fs.readFile(filePath, 'utf8')
        this.filterCache.set(file.replace('.json', ''), JSON.parse(filterData))
      }
    } catch (error) {
      console.warn('Failed to load cache:', error.message)
    }
  }

  async saveCache() {
    try {
      // Save index cache
      if (this.indexCache) {
        await fs.writeFile(this.indexCacheFile, JSON.stringify(this.indexCache, null, 2))
      }

      // Save categories cache
      if (this.categories) {
        await fs.writeFile(this.categoriesFile, JSON.stringify(this.categories, null, 2))
      }

      // Save technologies cache
      if (this.technologies) {
        await fs.writeFile(this.technologiesFile, JSON.stringify(this.technologies, null, 2))
      }

      // Save filter cache
      for (const [key, data] of this.filterCache.entries()) {
        const filePath = path.join(this.filterCacheDir, `${key}.json`)
        await fs.writeFile(filePath, JSON.stringify(data, null, 2))
      }
    } catch (error) {
      console.error('Failed to save cache:', error.message)
    }
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  }

  createFilterHash(filters) {
    const filterString = JSON.stringify(filters, Object.keys(filters).sort())
    return crypto.createHash('md5').update(filterString).digest('hex')
  }

  async setIndex(indexData) {
    this.indexCache = {
      ...indexData,
      lastUpdate: new Date().toISOString()
    }
    this.lastUpdate = this.indexCache.lastUpdate
    await this.saveCache()
  }

  async getIndex() {
    return this.indexCache
  }

  async setCategories(categories) {
    this.categories = categories
    await this.saveCache()
  }

  async getCategories() {
    return this.categories
  }

  async setTechnologies(technologies) {
    this.technologies = technologies
    await this.saveCache()
  }

  async getTechnologies() {
    return this.technologies
  }

  async setFilteredSubagents(filters, result) {
    const hash = this.createFilterHash(filters)
    this.filterCache.set(hash, {
      ...result,
      filters,
      cachedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
    })
    await this.saveCache()
  }

  async getFilteredSubagents(filters) {
    const hash = this.createFilterHash(filters)
    const cached = this.filterCache.get(hash)

    if (cached) {
      // Check if cache is still valid
      const now = new Date()
      const expiresAt = new Date(cached.expiresAt)

      if (now < expiresAt) {
        return cached
      } else {
        // Remove expired cache
        this.filterCache.delete(hash)
        await this.saveCache()
      }
    }

    return null
  }

  async setContent(subagentId, content) {
    this.contentCache.set(subagentId, {
      content,
      cachedAt: new Date().toISOString()
    })
  }

  async getContent(subagentId) {
    return this.contentCache.get(subagentId)
  }

  async hasContent(subagentId) {
    return this.contentCache.has(subagentId)
  }

  async clearCache() {
    this.indexCache = null
    this.contentCache.clear()
    this.filterCache.clear()
    this.categories = null
    this.technologies = null
    this.lastUpdate = null

    // Clear cache files
    try {
      const files = await fs.readdir(this.cacheDir)
      for (const file of files) {
        const filePath = path.join(this.cacheDir, file)
        await fs.unlink(filePath)
      }
    } catch (error) {
      console.warn('Failed to clear cache files:', error.message)
    }
  }

  isStale(maxAge = 60 * 60 * 1000) { // 1 hour default
    if (!this.lastUpdate) return true
    const now = Date.now()
    const lastUpdateMs = new Date(this.lastUpdate).getTime()
    return (now - lastUpdateMs) > maxAge
  }

  getCacheStats() {
    return {
      indexCache: !!this.indexCache,
      contentCacheSize: this.contentCache.size,
      filterCacheSize: this.filterCache.size,
      categoriesCache: !!this.categories,
      technologiesCache: !!this.technologies,
      lastUpdate: this.lastUpdate,
      isStale: this.isStale()
    }
  }

  async cleanupExpiredCache() {
    const now = new Date()
    let cleanedCount = 0

    // Clean up expired filter cache entries
    for (const [key, data] of this.filterCache.entries()) {
      const expiresAt = new Date(data.expiresAt)
      if (now >= expiresAt) {
        this.filterCache.delete(key)
        cleanedCount++
      }
    }

    if (cleanedCount > 0) {
      await this.saveCache()
      console.log(`Cleaned up ${cleanedCount} expired cache entries`)
    }

    return cleanedCount
  }
}

module.exports = SubagentCache