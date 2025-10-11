import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'

const execAsync = promisify(exec)

class SubagentGitManager {
  constructor() {
    this.repoUrl = 'https://github.com/VoltAgent/awesome-claude-code-subagents.git'
    this.localPath = path.join(process.cwd(), 'external-subagents')
    this.commitHashFile = path.join(this.localPath, '.last-commit-hash')
  }

  async ensureRepoExists() {
    try {
      await fs.access(this.localPath)
      return true
    } catch {
      return false
    }
  }

  async cloneRepo() {
    try {
      console.log('Cloning awesome-claude-code-subagents repository...')
      await execAsync(`git clone ${this.repoUrl} "${this.localPath}"`)
      const hash = await this.getLatestCommitHash()
      await this.saveCommitHash(hash)
      return true
    } catch (error) {
      console.error('Failed to clone repository:', error.message)
      return false
    }
  }

  async getLatestCommitHash() {
    try {
      const { stdout } = await execAsync('git rev-parse HEAD', { cwd: this.localPath })
      return stdout.trim()
    } catch (error) {
      console.error('Failed to get commit hash:', error.message)
      return null
    }
  }

  async getRemoteCommitHash() {
    try {
      const { stdout } = await execAsync('git ls-remote origin HEAD', { cwd: this.localPath })
      return stdout.split('\t')[0].trim()
    } catch (error) {
      console.error('Failed to get remote commit hash:', error.message)
      return null
    }
  }

  async saveCommitHash(hash) {
    try {
      await fs.writeFile(this.commitHashFile, hash)
    } catch (error) {
      console.error('Failed to save commit hash:', error.message)
    }
  }

  async getLastSavedHash() {
    try {
      const hash = await fs.readFile(this.commitHashFile, 'utf8')
      return hash.trim()
    } catch {
      return null
    }
  }

  async hasUpdates() {
    const remoteHash = await this.getRemoteCommitHash()
    const localHash = await this.getLastSavedHash()
    return remoteHash && localHash && remoteHash !== localHash
  }

  async pullUpdates() {
    try {
      console.log('Pulling updates from awesome-claude-code-subagents...')
      await execAsync('git pull origin main', { cwd: this.localPath })
      const hash = await this.getLatestCommitHash()
      await this.saveCommitHash(hash)
      return true
    } catch (error) {
      console.error('Failed to pull updates:', error.message)
      return false
    }
  }

  async updateIfNeeded() {
    const exists = await this.ensureRepoExists()

    if (!exists) {
      return await this.cloneRepo()
    }

    if (await this.hasUpdates()) {
      return await this.pullUpdates()
    }

    return true
  }

  async getSubagentFiles() {
    try {
      const files = []
      const items = await fs.readdir(this.localPath, { withFileTypes: true })

      for (const item of items) {
        if (item.isFile() && item.name.endsWith('.md')) {
          const filePath = path.join(this.localPath, item.name)
          const content = await fs.readFile(filePath, 'utf8')
          files.push({
            name: item.name,
            path: filePath,
            content
          })
        }
      }

      return files
    } catch (error) {
      console.error('Failed to read subagent files:', error.message)
      return []
    }
  }
}

export default SubagentGitManager