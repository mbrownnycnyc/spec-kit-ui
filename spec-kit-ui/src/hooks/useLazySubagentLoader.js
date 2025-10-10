import { useState, useCallback, useMemo, useRef } from 'react'

class BrowserSubagentManager {
  constructor() {
    this.repoUrl = 'https://github.com/VoltAgent/awesome-claude-code-subagents.git'
    this.rawUrl = 'https://raw.githubusercontent.com/VoltAgent/awesome-claude-code-subagents/main/'
    this.lastUpdateKey = 'subagent-last-update'
    this.subagentCacheKey = 'subagent-cache'
  }

  getLastUpdateTime() {
    const time = localStorage.getItem(this.lastUpdateKey)
    return time ? parseInt(time) : 0
  }

  saveLastUpdateTime() {
    localStorage.setItem(this.lastUpdateKey, Date.now().toString())
  }

  shouldUpdateDaily() {
    const now = Date.now()
    const dayInMs = 24 * 60 * 60 * 1000
    return now - this.getLastUpdateTime() >= dayInMs
  }

  async fetchWithFallback(url) {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return response
    } catch (error) {
      console.warn(`Failed to fetch ${url}:`, error.message)
      return null
    }
  }

  async getSubagentFiles() {
    try {
      const response = await this.fetchWithFallback(
        'https://api.github.com/repos/VoltAgent/awesome-claude-code-subagents/contents'
      )

      if (!response) return this.getCachedSubagents()

      const files = await response.json()
      const subagentFiles = files
        .filter(file => file.name.endsWith('.md') && file.type === 'file')
        .map(file => ({
          name: file.name,
          download_url: file.download_url,
          path: file.path
        }))

      const subagents = []
      for (const file of subagentFiles) {
        const contentResponse = await this.fetchWithFallback(file.download_url)
        if (contentResponse) {
          const content = await contentResponse.text()
          const parsed = this.parseSubagentFromMarkdown(content)
          const formatted = this.formatForDisplay(parsed)

          subagents.push({
            ...formatted,
            filename: file.name,
            source: 'awesome-claude-code-subagents'
          })
        }
      }

      this.cacheSubagents(subagents)
      this.saveLastUpdateTime()
      return subagents
    } catch (error) {
      console.error('Failed to fetch subagents:', error.message)
      return this.getCachedSubagents()
    }
  }

  parseSubagentFromMarkdown(content) {
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

    subagent.whenToUse = currentList.filter(Boolean)
    subagent.whatToDoNext = currentList.filter(Boolean)

    return subagent
  }

  formatForDisplay(subagent) {
    return {
      title: subagent.title || 'Untitled Subagent',
      description: subagent.description || 'No description available.',
      whyMatters: subagent.whyMatters || 'This subagent helps streamline development workflows.',
      whenToUse: Array.isArray(subagent.whenToUse) ? subagent.whenToUse : [],
      whatToDoNext: Array.isArray(subagent.whatToDoNext) ? subagent.whatToDoNext : [],
      exampleCode: subagent.exampleCode || '# Example code not available'
    }
  }

  cacheSubagents(subagents) {
    try {
      localStorage.setItem(this.subagentCacheKey, JSON.stringify({
        subagents,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.warn('Failed to cache subagents:', error.message)
    }
  }

  getCachedSubagents() {
    try {
      const cached = localStorage.getItem(this.subagentCacheKey)
      if (cached) {
        const { subagents, timestamp } = JSON.parse(cached)
        const hoursInMs = 24 * 60 * 60 * 1000
        if (Date.now() - timestamp < hoursInMs) {
          return subagents
        }
      }
    } catch (error) {
      console.warn('Failed to load cached subagents:', error.message)
    }
    return []
  }

  async updateIfNeeded() {
    if (this.shouldUpdateDaily()) {
      console.log('Checking for subagent updates...')
      return await this.getSubagentFiles()
    }
    return this.getCachedSubagents()
  }
}

export const useLazySubagentLoader = () => {
  const [subagents, setSubagents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const managerRef = useRef(null)
  if (!managerRef.current) {
    managerRef.current = new BrowserSubagentManager()
  }

  const manager = useMemo(() => managerRef.current, [])

  const loadSubagents = useCallback(async (force = false) => {
    if (isLoaded && !force) {
      return subagents
    }

    setLoading(true)
    setError(null)

    try {
      const newSubagents = await manager.updateIfNeeded()
      setSubagents(newSubagents)
      setLastUpdate(Date.now())
      setIsLoaded(true)
      return newSubagents
    } catch (err) {
      setError(err.message)
      console.error('Failed to load subagents:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [manager, isLoaded, subagents])

  const searchSubagents = useCallback((query) => {
    if (!isLoaded) return []
    const lowercaseQuery = query.toLowerCase()
    return subagents.filter(subagent =>
      subagent.title.toLowerCase().includes(lowercaseQuery) ||
      subagent.description.toLowerCase().includes(lowercaseQuery) ||
      subagent.whyMatters.toLowerCase().includes(lowercaseQuery)
    )
  }, [subagents, isLoaded])

  const getSubagentByTitle = useCallback((title) => {
    if (!isLoaded) return null
    return subagents.find(subagent =>
      subagent.title.toLowerCase().includes(title.toLowerCase())
    )
  }, [subagents, isLoaded])

  const forceRefresh = useCallback(async () => {
    localStorage.removeItem(manager.subagentCacheKey)
    localStorage.removeItem(manager.lastUpdateKey)
    setIsLoaded(false)
    return await loadSubagents(true)
  }, [manager, loadSubagents])

  const getStatus = useCallback(() => {
    return {
      loading,
      error,
      lastUpdate,
      isLoaded,
      count: subagents.length
    }
  }, [loading, error, lastUpdate, isLoaded, subagents])

  return {
    subagents,
    loading,
    error,
    lastUpdate,
    isLoaded,
    loadSubagents,
    searchSubagents,
    getSubagentByTitle,
    forceRefresh,
    getStatus
  }
}