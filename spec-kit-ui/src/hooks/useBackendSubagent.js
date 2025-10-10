import { useState, useCallback, useEffect } from 'react'
import backendSubagentService from '../services/backendSubagentService.js'

export const useBackendSubagent = () => {
  const [subagents, setSubagents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [repositoryStatus, setRepositoryStatus] = useState({
    repositoryExists: false,
    needsUpdate: false,
    scheduler: null
  })

  const loadSubagents = useCallback(async (force = false) => {
    if (isLoaded && !force) {
      return subagents
    }

    setLoading(true)
    setError(null)

    try {
      const newSubagents = await backendSubagentService.getSubagents()
      setSubagents(newSubagents)
      setLastUpdate(Date.now())
      setIsLoaded(true)

      // Also get repository status
      const status = await backendSubagentService.getStatus()
      setRepositoryStatus({
        repositoryExists: status.repositoryExists,
        needsUpdate: status.needsUpdate,
        scheduler: status.scheduler
      })

      return newSubagents
    } catch (err) {
      setError(err.message)
      console.error('Failed to load subagents:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [isLoaded, subagents])

  const searchSubagents = useCallback(async (query) => {
    if (!isLoaded) {
      // Load subagents first if not already loaded
      await loadSubagents()
    }

    try {
      return await backendSubagentService.searchSubagents(query)
    } catch (err) {
      console.error('Search failed:', err)
      // Fallback to client-side search
      const lowercaseQuery = query.toLowerCase()
      return subagents.filter(subagent =>
        subagent.title.toLowerCase().includes(lowercaseQuery) ||
        subagent.description.toLowerCase().includes(lowercaseQuery) ||
        subagent.whyMatters.toLowerCase().includes(lowercaseQuery)
      )
    }
  }, [isLoaded, loadSubagents, subagents])

  const getSubagentByTitle = useCallback(async (title) => {
    if (!isLoaded) {
      await loadSubagents()
    }

    try {
      return await backendSubagentService.getSubagentByTitle(title)
    } catch (err) {
      console.error('Get subagent by title failed:', err)
      // Fallback to client-side search
      return subagents.find(subagent =>
        subagent.title.toLowerCase().includes(title.toLowerCase())
      )
    }
  }, [isLoaded, loadSubagents, subagents])

  const forceRefresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const newSubagents = await backendSubagentService.forceRefresh()
      setSubagents(newSubagents)
      setLastUpdate(Date.now())
      setIsLoaded(true)

      // Update repository status
      const status = await backendSubagentService.getStatus()
      setRepositoryStatus({
        repositoryExists: status.repositoryExists,
        needsUpdate: status.needsUpdate,
        scheduler: status.scheduler
      })

      return newSubagents
    } catch (err) {
      setError(err.message)
      console.error('Failed to force refresh:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getStatus = useCallback(async () => {
    try {
      const status = await backendSubagentService.getStatus()
      setRepositoryStatus({
        repositoryExists: status.repositoryExists,
        needsUpdate: status.needsUpdate,
        scheduler: status.scheduler
      })

      return {
        loading,
        error,
        lastUpdate,
        isLoaded,
        count: subagents.length,
        ...status
      }
    } catch (err) {
      console.error('Failed to get status:', err)
      return {
        loading,
        error: err.message,
        lastUpdate,
        isLoaded,
        count: subagents.length,
        repositoryExists: false
      }
    }
  }, [loading, error, lastUpdate, isLoaded, subagents])

  const checkBackendAvailability = useCallback(async () => {
    try {
      await backendSubagentService.healthCheck()
      return true
    } catch (error) {
      console.error('Backend not available:', error)
      return false
    }
  }, [])

  // Auto-load subagents on first mount
  useEffect(() => {
    loadSubagents()
  }, [])

  // Periodic status updates
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isLoaded) {
        await getStatus()
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [isLoaded, getStatus])

  return {
    subagents,
    loading,
    error,
    lastUpdate,
    isLoaded,
    repositoryStatus,
    loadSubagents,
    searchSubagents,
    getSubagentByTitle,
    forceRefresh,
    getStatus,
    checkBackendAvailability
  }
}