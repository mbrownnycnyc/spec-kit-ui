const simpleGit = require('simple-git')
const fs = require('fs').promises
const path = require('path')
const { execSync } = require('child_process')
const logger = require('./logger')
const config = require('./config')

class GitManager {
  constructor() {
    this.repoUrl = config.REPO_URL
    this.repoPath = path.resolve(config.REPO_PATH)
  }

  async cloneRepository(repoUrl = this.repoUrl, targetPath = this.repoPath) {
    try {
      logger.info('Starting repository clone', { repoUrl, targetPath })

      // Remove existing directory if it exists and might be corrupted
      try {
        await fs.access(targetPath)
        logger.warn('Target directory exists, removing before clone', { targetPath })
        await fs.rm(targetPath, { recursive: true, force: true })
      } catch (error) {
        // Directory doesn't exist, which is fine
      }

      // Ensure parent directory exists
      const parentDir = path.dirname(targetPath)
      await fs.mkdir(parentDir, { recursive: true })

      // Clone fresh repository
      const git = simpleGit()
      await git.clone(repoUrl, targetPath)

      // Verify clone success
      await this.validateRepository(targetPath)

      logger.info('Repository cloned successfully', { targetPath })
      return true
    } catch (error) {
      logger.error('Repository clone failed', {
        repoUrl,
        targetPath,
        error: error.message,
        stack: error.stack
      })
      throw error
    }
  }

  async validateRepository(repoPath = this.repoPath) {
    try {
      const git = simpleGit(repoPath)
      await git.status()
      logger.debug('Repository validation successful', { repoPath })
      return true
    } catch (error) {
      logger.error('Repository validation failed', {
        repoPath,
        error: error.message
      })
      throw new Error(`Repository validation failed: ${error.message}`)
    }
  }

  async getLocalCommitHash(repoPath = this.repoPath) {
    try {
      const git = simpleGit(repoPath)
      const log = await git.log({ maxCount: 1 })

      if (!log.latest || !log.latest.hash) {
        throw new Error('No commits found in repository')
      }

      logger.debug('Retrieved local commit hash', {
        repoPath,
        commitHash: log.latest.hash
      })
      return log.latest.hash
    } catch (error) {
      logger.error('Failed to get local commit hash', {
        repoPath,
        error: error.message
      })
      throw error
    }
  }

  async getRemoteCommitHash(repoUrl = this.repoUrl) {
    try {
      logger.debug('Fetching remote commit hash', { repoUrl })

      // Use git ls-remote to get the HEAD commit hash
      const result = execSync(`git ls-remote ${repoUrl} HEAD`, {
        encoding: 'utf8',
        timeout: 30000 // 30 second timeout
      })

      const lines = result.trim().split('\n')
      if (lines.length === 0 || !lines[0]) {
        throw new Error('No response from git ls-remote')
      }

      const remoteHash = lines[0].split('\t')[0].trim()

      if (!remoteHash || remoteHash.length !== 40) {
        throw new Error('Invalid commit hash format from remote')
      }

      logger.debug('Retrieved remote commit hash', {
        repoUrl,
        commitHash: remoteHash
      })
      return remoteHash
    } catch (error) {
      logger.error('Failed to get remote commit hash', {
        repoUrl,
        error: error.message
      })
      throw error
    }
  }

  async hasUpdates(repoPath = this.repoPath, repoUrl = this.repoUrl) {
    try {
      logger.debug('Checking for repository updates', { repoPath, repoUrl })

      // First check if repository exists
      try {
        await fs.access(repoPath)
      } catch (error) {
        logger.info('Repository does not exist, needs clone', { repoPath })
        return { needsUpdate: true, reason: 'repository_missing' }
      }

      // Compare commit hashes
      const localHash = await this.getLocalCommitHash(repoPath)
      const remoteHash = await this.getRemoteCommitHash(repoUrl)

      const hasUpdates = localHash !== remoteHash

      logger.debug('Update check completed', {
        repoPath,
        localHash,
        remoteHash,
        hasUpdates
      })

      return {
        needsUpdate: hasUpdates,
        reason: hasUpdates ? 'commits_differ' : 'up_to_date',
        localHash,
        remoteHash
      }
    } catch (error) {
      logger.error('Update check failed', {
        repoPath,
        repoUrl,
        error: error.message
      })

      // If we can't check, assume we need to try cloning/pulling
      return {
        needsUpdate: true,
        reason: 'check_failed',
        error: error.message
      }
    }
  }

  async pullUpdates(repoPath = this.repoPath, branch = 'main') {
    try {
      logger.info('Starting repository pull', { repoPath, branch })

      const git = simpleGit(repoPath)

      // Get current commit before pull
      const beforeHash = await this.getLocalCommitHash(repoPath)

      // Pull updates
      await git.pull('origin', branch)

      // Get new commit hash
      const afterHash = await this.getLocalCommitHash(repoPath)

      const updated = beforeHash !== afterHash

      logger.info('Repository pull completed', {
        repoPath,
        branch,
        beforeHash,
        afterHash,
        updated
      })

      return {
        success: true,
        updated,
        beforeHash,
        afterHash
      }
    } catch (error) {
      logger.error('Repository pull failed', {
        repoPath,
        branch,
        error: error.message,
        stack: error.stack
      })

      // If pull fails, we might need to reclone
      if (error.message.includes('not a git repository') ||
          error.message.includes('fatal:')) {
        logger.info('Pull failed critically, will attempt reclone', { repoPath })
        return {
          success: false,
          needsReclone: true,
          error: error.message
        }
      }

      return {
        success: false,
        error: error.message
      }
    }
  }

  async ensureRepository() {
    try {
      logger.info('Ensuring repository exists and is up to date')

      // Check if repository exists and needs updates
      const updateCheck = await this.hasUpdates()

      if (updateCheck.reason === 'repository_missing') {
        logger.info('Repository missing, performing initial clone')
        await this.cloneRepository()
        return { action: 'cloned', success: true }
      }

      if (updateCheck.needsUpdate) {
        logger.info('Updates available, performing pull')
        const pullResult = await this.pullUpdates()

        if (pullResult.success) {
          return { action: 'pulled', success: true, updated: pullResult.updated }
        } else if (pullResult.needsReclone) {
          logger.info('Pull failed, recloning repository')
          await this.cloneRepository()
          return { action: 'recloned', success: true }
        } else {
          throw new Error(pullResult.error)
        }
      }

      logger.info('Repository is up to date')
      return { action: 'none', success: true, updated: false }
    } catch (error) {
      logger.error('Failed to ensure repository', { error: error.message })
      throw error
    }
  }

  async getRepositoryInfo() {
    try {
      const git = simpleGit(this.repoPath)

      // Get basic info
      const status = await git.status()
      const log = await git.log({ maxCount: 10 })
      const remotes = await git.getRemotes(true)

      // Get file count
      const files = await this.getRepositoryFiles()

      return {
        path: this.repoPath,
        currentBranch: status.current,
        trackingBranch: status.tracking,
        isClean: status.isClean(),
        totalCommits: log.total,
        latestCommit: log.latest,
        remotes: remotes.map(r => ({ name: r.name, refs: r.refs.fetch })),
        fileCount: files.length,
        lastChecked: new Date().toISOString()
      }
    } catch (error) {
      logger.error('Failed to get repository info', { error: error.message })
      throw error
    }
  }

  async getRepositoryFiles() {
    try {
      const files = []
      const basePath = this.repoPath

      async function scanDirectory(dir, relativePath = '') {
        try {
          const entries = await fs.readdir(dir, { withFileTypes: true })

          for (const entry of entries) {
            const entryPath = path.join(dir, entry.name)
            const relativeEntryPath = path.join(relativePath, entry.name)

            if (entry.isDirectory() && !entry.name.startsWith('.')) {
              await scanDirectory(entryPath, relativeEntryPath)
            } else if (entry.isFile() && !entry.name.startsWith('.')) {
              files.push({
                name: entry.name,
                path: relativeEntryPath,
                fullPath: entryPath,
                size: (await fs.stat(entryPath)).size
              })
            }
          }
        } catch (error) {
          logger.warn('Failed to scan directory', { dir, error: error.message })
        }
      }

      await scanDirectory(basePath)
      return files
    } catch (error) {
      logger.error('Failed to get repository files', { error: error.message })
      return []
    }
  }
}

module.exports = GitManager