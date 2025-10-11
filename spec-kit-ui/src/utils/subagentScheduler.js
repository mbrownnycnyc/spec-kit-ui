import SubagentGitManager from './subagentGitManager.js'

class SubagentScheduler {
  constructor() {
    this.gitManager = new SubagentGitManager()
    this.intervalId = null
    this.lastUpdateFile = '.last-subagent-update'
  }

  async getLastUpdateTime() {
    try {
      const fs = await import('fs/promises')
      const content = await fs.readFile(this.lastUpdateFile, 'utf8')
      return parseInt(content.trim())
    } catch {
      return 0
    }
  }

  async saveLastUpdateTime() {
    try {
      const fs = await import('fs/promises')
      await fs.writeFile(this.lastUpdateFile, Date.now().toString())
    } catch (error) {
      console.error('Failed to save last update time:', error.message)
    }
  }

  shouldUpdateDaily() {
    const now = Date.now()
    const dayInMs = 24 * 60 * 60 * 1000
    return now - this.lastUpdateTime >= dayInMs
  }

  async startDailyUpdates() {
    const updateSubagents = async () => {
      try {
        const lastUpdate = await this.getLastUpdateTime()
        this.lastUpdateTime = lastUpdate

        if (this.shouldUpdateDaily()) {
          console.log('Checking for subagent updates...')
          const updated = await this.gitManager.updateIfNeeded()
          if (updated) {
            await this.saveLastUpdateTime()
            this.lastUpdateTime = Date.now()
            console.log('Subagents updated successfully')
            this.onUpdate?.()
          }
        }
      } catch (error) {
        console.error('Error during subagent update:', error.message)
      }
    }

    await updateSubagents()
    this.intervalId = setInterval(updateSubagents, 60 * 60 * 1000)
  }

  stopUpdates() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  onUpdate(callback) {
    this.onUpdate = callback
  }
}

export default SubagentScheduler