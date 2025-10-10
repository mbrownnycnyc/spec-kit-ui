class BackendSubagentService {
  constructor() {
    this.baseUrl = 'http://localhost:3001/api'
    this.cache = null
    this.cacheTimestamp = null
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Backend operation failed')
      }

      return data.data
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Backend server is not running. Please start the backend server first.')
      }
      throw error
    }
  }

  async getSubagents() {
    // Check cache first
    if (this.cache && this.cacheTimestamp &&
        (Date.now() - this.cacheTimestamp) < this.cacheTimeout) {
      return this.cache
    }

    try {
      const data = await this.request('/subagents')

      if (!data.repositoryExists) {
        throw new Error('Repository not yet available. Please update first.')
      }

      this.cache = data.subagents
      this.cacheTimestamp = Date.now()

      return data.subagents
    } catch (error) {
      console.error('Failed to get subagents from backend:', error)
      throw error
    }
  }

  async getSubagentByTitle(title) {
    const subagents = await this.getSubagents()
    return subagents.find(subagent =>
      subagent.title.toLowerCase().includes(title.toLowerCase())
    )
  }

  async searchSubagents(query) {
    if (!query || query.trim().length < 2) {
      return []
    }

    try {
      const data = await this.request(`/subagents/search?q=${encodeURIComponent(query)}`)
      return data.results
    } catch (error) {
      console.error('Backend search failed, falling back to client-side search:', error)

      // Fallback to client-side search
      const subagents = await this.getSubagents()
      const lowercaseQuery = query.toLowerCase()
      return subagents.filter(subagent =>
        subagent.title.toLowerCase().includes(lowercaseQuery) ||
        subagent.description.toLowerCase().includes(lowercaseQuery) ||
        subagent.whyMatters.toLowerCase().includes(lowercaseQuery)
      )
    }
  }

  async getStatus() {
    try {
      const data = await this.request('/subagents/status')
      return {
        loading: false,
        error: null,
        lastUpdate: data.lastUpdate,
        repositoryExists: data.repository.accessible,
        needsUpdate: data.repository.needsUpdate,
        scheduler: data.scheduler
      }
    } catch (error) {
      return {
        loading: false,
        error: error.message,
        lastUpdate: null,
        repositoryExists: false
      }
    }
  }

  async forceRefresh() {
    try {
      // Clear cache
      this.cache = null
      this.cacheTimestamp = null

      // Trigger backend update
      const data = await this.request('/subagents/update', {
        method: 'POST'
      })

      // After update, get fresh subagents
      return await this.getSubagents()
    } catch (error) {
      console.error('Failed to force refresh:', error)
      throw error
    }
  }

  async getRepositoryInfo() {
    try {
      return await this.request('/subagents/info')
    } catch (error) {
      console.error('Failed to get repository info:', error)
      throw error
    }
  }

  async healthCheck() {
    try {
      return await this.request('/health')
    } catch (error) {
      console.error('Health check failed:', error)
      throw error
    }
  }

  clearCache() {
    this.cache = null
    this.cacheTimestamp = null
  }

  isBackendAvailable() {
    return this.healthCheck().then(() => true).catch(() => false)
  }
}

const backendSubagentService = new BackendSubagentService()
export default backendSubagentService
export { BackendSubagentService }