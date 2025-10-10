import { useSubagentGit } from '../hooks/useSubagentGit.js'

class SubagentService {
  constructor() {
    this.hook = null
    this.listeners = []
    this.subagents = []
    this.loading = false
    this.error = null
  }

  initialize(hookInstance) {
    this.hook = hookInstance
    this.subagents = hookInstance.subagents
    this.loading = hookInstance.loading
    this.error = hookInstance.error

    if (this.hook && this.hook.loadSubagents) {
      this.hook.loadSubagents()
    }
  }

  getSubagents() {
    return this.subagents
  }

  getSubagentByTitle(title) {
    return this.subagents.find(subagent =>
      subagent.title.toLowerCase().includes(title.toLowerCase())
    )
  }

  searchSubagents(query) {
    if (this.hook && this.hook.searchSubagents) {
      return this.hook.searchSubagents(query)
    }
    return []
  }

  onUpdate(callback) {
    this.listeners.push(callback)
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.subagents))
  }

  getStatus() {
    return {
      loading: this.loading,
      error: this.error,
      lastUpdate: this.hook?.lastUpdate || null
    }
  }

  forceRefresh() {
    if (this.hook && this.hook.forceRefresh) {
      return this.hook.forceRefresh()
    }
  }
}

const subagentService = new SubagentService()
export default subagentService
export { SubagentService }