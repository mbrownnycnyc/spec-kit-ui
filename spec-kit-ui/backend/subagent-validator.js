const yaml = require('js-yaml')
const path = require('path')

/**
 * Validates whether a markdown file contains a proper subagent definition
 * Based on the Claude Code subagent specification and repository patterns
 */

class SubagentValidator {
  constructor(config = {}) {
    this.config = {
      // Files that should always be excluded
      excludedFiles: [
        'README.md',
        'LICENSE',
        'CONTRIBUTING.md',
        '.gitignore',
        'package.json',
        'yarn.lock',
        'package-lock.json'
      ],

      // Required YAML frontmatter fields
      requiredYamlFields: ['name', 'description'],

      // Optional YAML fields that if present, must be valid
      optionalYamlFields: {
        tools: (value) => typeof value === 'string' && value.trim().length > 0,
        model: (value) => typeof value === 'string' && ['sonnet', 'opus', 'haiku', 'inherit'].includes(value.trim())
      },

      // Content validation
      minContentLines: 20, // Minimum lines after frontmatter
      requiredSections: [
        'MCP Tool Suite',
        'Communication Protocol'
      ],

      // Valid category directories (from repository structure)
      validCategories: [
        '01-core-development',
        '02-language-specialists',
        '03-infrastructure',
        '04-quality-security',
        '05-data-ai',
        '06-developer-experience',
        '07-specialized-domains',
        '08-business-product',
        '09-meta-orchestration',
        '10-research-analysis'
      ],

      ...config
    }
  }

  /**
   * Main validation function - determines if a file should be included as a subagent
   * @param {string} fileName - Name of the file
   * @param {string} filePath - Relative path of the file
   * @param {string} content - File content
   * @returns {Object} Validation result with reason
   */
  validate(fileName, filePath, content) {
    // 1. Check file exclusions
    const fileExclusion = this._checkFileExclusions(fileName, filePath)
    if (!fileExclusion.valid) {
      return {
        valid: false,
        reason: fileExclusion.reason,
        category: 'file_exclusion'
      }
    }

    // 2. Check category validation
    const categoryValidation = this._validateCategory(filePath)
    if (!categoryValidation.valid) {
      return {
        valid: false,
        reason: categoryValidation.reason,
        category: 'category_validation'
      }
    }

    // 3. Parse and validate YAML frontmatter
    const frontmatterValidation = this._validateFrontmatter(content)
    if (!frontmatterValidation.valid) {
      return {
        valid: false,
        reason: frontmatterValidation.reason,
        category: 'frontmatter_validation'
      }
    }

    // 4. Validate content structure
    const contentValidation = this._validateContent(content)
    if (!contentValidation.valid) {
      return {
        valid: false,
        reason: contentValidation.reason,
        category: 'content_validation'
      }
    }

    // 5. Subagent-specific validation
    const subagentValidation = this._validateSubagentStructure(content)
    if (!subagentValidation.valid) {
      return {
        valid: false,
        reason: subagentValidation.reason,
        category: 'subagent_validation'
      }
    }

    return {
      valid: true,
      reason: 'Valid subagent definition',
      category: 'valid_subagent',
      metadata: {
        frontmatter: frontmatterValidation.frontmatter,
        category: this._extractCategory(filePath),
        estimatedComplexity: this._estimateComplexity(content)
      }
    }
  }

  /**
   * Check if file should be excluded based on name/path patterns
   */
  _checkFileExclusions(fileName, filePath) {
    // Exact matches
    if (this.config.excludedFiles.includes(fileName)) {
      return {
        valid: false,
        reason: `File '${fileName}' is in exclusion list`
      }
    }

    // Hidden files
    if (fileName.startsWith('.')) {
      return {
        valid: false,
        reason: `File '${fileName}' is a hidden file`
      }
    }

    // Root directory files that aren't subagents (excluding files in categories directories)
    const pathParts = filePath.split(/[\/\\]/) // Handle both forward and back slashes
    if (pathParts.length === 1 || (pathParts.length === 2 && pathParts[0] === 'categories')) {
      return {
        valid: false,
        reason: `File '${filePath}' is in root directory, not a subagent`
      }
    }

    return { valid: true }
  }

  /**
   * Validate that file is in a valid category directory
   */
  _validateCategory(filePath) {
    const pathParts = filePath.split(/[\/\\]/) // Handle both forward and back slashes

    // Should be in categories/ subdirectory
    if (!filePath.includes('categories/') && !filePath.includes('categories\\')) {
      return {
        valid: false,
        reason: `File '${filePath}' is not in categories/ directory`
      }
    }

    // Extract category directory (first part after 'categories/')
    const categoriesIndex = pathParts.indexOf('categories')
    if (categoriesIndex >= 0 && categoriesIndex + 1 < pathParts.length) {
      const categoryDir = pathParts[categoriesIndex + 1]
      if (!this.config.validCategories.includes(categoryDir)) {
        return {
          valid: false,
          reason: `Category '${categoryDir}' is not in valid categories list`
        }
      }
    }

    return { valid: true }
  }

  /**
   * Parse and validate YAML frontmatter
   */
  _validateFrontmatter(content) {
    if (!content.startsWith('---')) {
      return {
        valid: false,
        reason: 'File does not start with YAML frontmatter'
      }
    }

    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
    if (!frontmatterMatch) {
      return {
        valid: false,
        reason: 'Invalid YAML frontmatter format'
      }
    }

    let frontmatter
    try {
      frontmatter = yaml.load(frontmatterMatch[1])
    } catch (error) {
      return {
        valid: false,
        reason: `Invalid YAML syntax: ${error.message}`
      }
    }

    // Check required fields
    for (const field of this.config.requiredYamlFields) {
      if (!frontmatter || !frontmatter[field] || typeof frontmatter[field] !== 'string' || frontmatter[field].trim().length === 0) {
        return {
          valid: false,
          reason: `Missing or invalid required field '${field}' in YAML frontmatter`
        }
      }
    }

    // Check optional fields if present
    for (const [field, validator] of Object.entries(this.config.optionalYamlFields)) {
      if (frontmatter && frontmatter[field] !== undefined) {
        if (!validator(frontmatter[field])) {
          return {
            valid: false,
            reason: `Invalid value for optional field '${field}'`
          }
        }
      }
    }

    // Validate name format
    if (frontmatter.name && !/^[a-z0-9-]+$/.test(frontmatter.name.trim())) {
      return {
        valid: false,
        reason: `Subagent name '${frontmatter.name}' must contain only lowercase letters, numbers, and hyphens`
      }
    }

    return {
      valid: true,
      frontmatter
    }
  }

  /**
   * Validate basic content requirements
   */
  _validateContent(content) {
    // Remove frontmatter for content analysis
    const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '').trim()

    // Check minimum length
    const lines = contentWithoutFrontmatter.split('\n').filter(line => line.trim().length > 0)
    if (lines.length < this.config.minContentLines) {
      return {
        valid: false,
        reason: `Content too short (${lines.length} lines, minimum ${this.config.minContentLines})`
      }
    }

    return { valid: true }
  }

  /**
   * Validate subagent-specific content structure
   */
  _validateSubagentStructure(content) {
    const contentLower = content.toLowerCase()

    // Check for required sections
    for (const section of this.config.requiredSections) {
      if (!content.includes(section)) {
        return {
          valid: false,
          reason: `Missing required section '${section}'`
        }
      }
    }

    // Check for subagent-specific content indicators
    const subagentIndicators = [
      'when invoked:',
      'you are a',
      'specializing in',
      'expert',
      'specialist'
    ]

    const hasSubagentIndicators = subagentIndicators.some(indicator =>
      contentLower.includes(indicator.toLowerCase())
    )

    if (!hasSubagentIndicators) {
      return {
        valid: false,
        reason: 'Content does not appear to be a subagent definition'
      }
    }

    return { valid: true }
  }

  /**
   * Extract category from file path
   */
  _extractCategory(filePath) {
    const pathParts = filePath.split(/[\/\\]/) // Handle both forward and back slashes
    const categoriesIndex = pathParts.indexOf('categories')
    if (categoriesIndex >= 0 && categoriesIndex + 1 < pathParts.length) {
      return pathParts[categoriesIndex + 1]
    }
    return 'unknown'
  }

  /**
   * Estimate complexity of subagent based on content
   */
  _estimateComplexity(content) {
    const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '')
    const wordCount = contentWithoutFrontmatter.split(/\s+/).length
    const sectionCount = (content.match(/^##\s+/gm) || []).length

    if (wordCount > 1000 || sectionCount > 10) return 'advanced'
    if (wordCount > 500 || sectionCount > 5) return 'intermediate'
    return 'basic'
  }

  /**
   * Batch validation for multiple files
   */
  validateBatch(files) {
    const results = {
      valid: [],
      invalid: [],
      summary: {
        total: files.length,
        valid: 0,
        invalid: 0,
        byReason: {},
        byCategory: {}
      }
    }

    for (const file of files) {
      const validation = this.validate(file.fileName, file.filePath, file.content)

      if (validation.valid) {
        results.valid.push({
          ...file,
          metadata: validation.metadata
        })
        results.summary.valid++
      } else {
        results.invalid.push({
          ...file,
          reason: validation.reason,
          category: validation.category
        })
        results.summary.invalid++

        // Track statistics
        results.summary.byReason[validation.reason] = (results.summary.byReason[validation.reason] || 0) + 1
        results.summary.byCategory[validation.category] = (results.summary.byCategory[validation.category] || 0) + 1
      }
    }

    return results
  }
}

module.exports = SubagentValidator