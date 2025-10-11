const yaml = require('js-yaml')
const path = require('path')

// Category mapping from directory names to display names
const CATEGORY_MAPPING = {
  '01-core-development': {
    id: 'core-development',
    name: 'Core Development',
    order: 1,
    icon: '⚙️',
    color: '#4299e1'
  },
  '02-language-specialists': {
    id: 'language-specialists',
    name: 'Language Specialists',
    order: 2,
    icon: '💻',
    color: '#9f7aea'
  },
  '03-infrastructure': {
    id: 'infrastructure',
    name: 'Infrastructure',
    order: 3,
    icon: '🏗️',
    color: '#38a169'
  },
  '04-quality-security': {
    id: 'quality-security',
    name: 'Quality & Security',
    order: 4,
    icon: '🔒',
    color: '#e53e3e'
  },
  '05-data-ai': {
    id: 'data-ai',
    name: 'Data & AI',
    order: 5,
    icon: '🤖',
    color: '#805ad5'
  },
  '06-developer-experience': {
    id: 'developer-experience',
    name: 'Developer Experience',
    order: 6,
    icon: '✨',
    color: '#d69e2e'
  },
  '07-specialized-domains': {
    id: 'specialized-domains',
    name: 'Specialized Domains',
    order: 7,
    icon: '🎯',
    color: '#dd6b20'
  },
  '08-business-product': {
    id: 'business-product',
    name: 'Business & Product',
    order: 8,
    icon: '💼',
    color: '#319795'
  },
  '09-meta-orchestration': {
    id: 'meta-orchestration',
    name: 'Meta & Orchestration',
    order: 9,
    icon: '🎭',
    color: '#718096'
  },
  '10-research-analysis': {
    id: 'research-analysis',
    name: 'Research & Analysis',
    order: 10,
    icon: '🔬',
    color: '#2d3748'
  }
}

// Experience level indicators
const EXPERIENCE_LEVELS = {
  JUNIOR: { level: 'junior', weight: 1 },
  INTERMEDIATE: { level: 'intermediate', weight: 2 },
  SENIOR: { level: 'senior', weight: 3 },
  EXPERT: { level: 'expert', weight: 4 }
}

// Technology groups for better organization
const TECHNOLOGY_GROUPS = {
  'frontend': ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'nextjs', 'gatsby', 'webpack', 'vite'],
  'backend': ['node', 'express', 'fastify', 'django', 'flask', 'rails', 'spring', 'dotnet', 'php', 'laravel'],
  'database': ['postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'prisma', 'typeorm', 'sequelize'],
  'devops': ['docker', 'kubernetes', 'terraform', 'jenkins', 'github-actions', 'aws', 'azure', 'gcp'],
  'testing': ['jest', 'cypress', 'playwright', 'testing-library', 'mocha', 'jasmine', 'selenium'],
  'tools': ['git', 'vscode', 'figma', 'postman', 'swagger', 'openapi', 'graphql']
}

/**
 * Parse YAML frontmatter from markdown content
 */
function parseYamlFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)

  if (match) {
    try {
      return yaml.load(match[1])
    } catch (error) {
      console.warn('Failed to parse YAML frontmatter:', error.message)
      return {}
    }
  }

  return {}
}

/**
 * Extract category information from file path
 */
function extractCategoryFromPath(filePath) {
  // Convert backslashes to forward slashes and normalize path
  const normalizedPath = filePath.replace(/\\/g, '/')
  const categoryMatch = normalizedPath.match(/categories\/(\d+-[^\/]+)/)

  if (categoryMatch) {
    const directory = categoryMatch[1]
    const categoryInfo = CATEGORY_MAPPING[directory]

    if (categoryInfo) {
      return {
        id: categoryInfo.id,
        name: categoryInfo.name,
        directory: directory,
        order: categoryInfo.order,
        icon: categoryInfo.icon,
        color: categoryInfo.color
      }
    }
  }

  // Fallback for unknown categories
  return {
    id: 'other',
    name: 'Other',
    directory: 'unknown',
    order: 999,
    icon: '📁',
    color: '#718096'
  }
}

/**
 * Extract and normalize technologies from tools field
 */
function extractTechnologies(tools) {
  if (!tools) {
    return []
  }

  let toolsArray = []

  // Handle different formats of tools field
  if (Array.isArray(tools)) {
    toolsArray = tools
  } else if (typeof tools === 'string') {
    // Split comma-separated or space-separated string
    toolsArray = tools.split(/[,]\s*/)
  }

  return toolsArray
    .filter(Boolean)
    .map(tool => {
      // Normalize technology names
      const normalized = tool.toLowerCase().trim()

      // Handle common variations
      if (normalized.includes('react')) return 'React'
      if (normalized.includes('vue')) return 'Vue'
      if (normalized.includes('angular')) return 'Angular'
      if (normalized.includes('javascript') || normalized.includes('js')) return 'JavaScript'
      if (normalized.includes('typescript') || normalized.includes('ts')) return 'TypeScript'
      if (normalized.includes('node') || normalized.includes('nodejs')) return 'Node.js'
      if (normalized.includes('python')) return 'Python'
      if (normalized.includes('docker')) return 'Docker'
      if (normalized.includes('kubernetes') || normalized.includes('k8s')) return 'Kubernetes'
      if (normalized.includes('aws')) return 'AWS'
      if (normalized.includes('graphql')) return 'GraphQL'
      if (normalized.includes('rest') || normalized.includes('api')) return 'REST API'
      if (normalized.includes('read')) return 'Read Tool'
      if (normalized.includes('write')) return 'Write Tool'
      if (normalized.includes('multiedit')) return 'MultiEdit Tool'
      if (normalized.includes('bash')) return 'Bash Tool'
      if (normalized.includes('openapi-generator')) return 'OpenAPI Generator'
      if (normalized.includes('graphql-codegen')) return 'GraphQL Codegen'
      if (normalized.includes('postman')) return 'Postman'
      if (normalized.includes('swagger-ui')) return 'Swagger UI'
      if (normalized.includes('spectral')) return 'Spectral'

      return tool.trim()
    })
    .filter((tech, index, arr) => arr.indexOf(tech) === index) // Remove duplicates
}

/**
 * Determine experience level from content analysis
 */
function determineExperienceLevel(content, frontmatter) {
  const text = (content + ' ' + JSON.stringify(frontmatter)).toLowerCase()

  // Look for experience level indicators
  const seniorIndicators = ['senior', 'expert', 'lead', 'principal', 'architect', 'advanced']
  const intermediateIndicators = ['intermediate', 'mid-level', 'experienced', 'proficient']
  const juniorIndicators = ['junior', 'beginner', 'entry-level', 'learning', 'basic']

  let score = 0

  seniorIndicators.forEach(indicator => {
    if (text.includes(indicator)) score += 3
  })

  intermediateIndicators.forEach(indicator => {
    if (text.includes(indicator)) score += 2
  })

  juniorIndicators.forEach(indicator => {
    if (text.includes(indicator)) score += 1
  })

  // Check tool complexity
  const tools = extractTechnologies(frontmatter.tools)
  if (tools.length > 8) score += 2
  if (tools.length > 12) score += 1

  if (score >= 5) return 'expert'
  if (score >= 3) return 'senior'
  if (score >= 2) return 'intermediate'
  return 'junior'
}

/**
 * Assess complexity based on content and tools
 */
function assessComplexity(content, frontmatter) {
  const tools = extractTechnologies(frontmatter.tools)
  const contentLength = content.length

  // Base complexity on number of tools
  let complexityScore = 0

  if (tools.length > 10) complexityScore += 3
  else if (tools.length > 6) complexityScore += 2
  else if (tools.length > 3) complexityScore += 1

  // Adjust based on content length
  if (contentLength > 10000) complexityScore += 2
  else if (contentLength > 5000) complexityScore += 1

  // Look for complexity indicators
  const text = content.toLowerCase()
  const complexIndicators = ['architecture', 'scalability', 'performance', 'security', 'integration', 'microservices']
  complexIndicators.forEach(indicator => {
    if (text.includes(indicator)) complexityScore += 1
  })

  if (complexityScore >= 5) return 'advanced'
  if (complexityScore >= 3) return 'complex'
  if (complexityScore >= 1) return 'moderate'
  return 'simple'
}

/**
 * Extract keywords from content for search
 */
function extractKeywords(content, frontmatter) {
  const keywords = new Set()

  // Extract from title
  const titleMatch = content.match(/^#\s+(.+)$/m)
  if (titleMatch) {
    titleMatch[1].split(/\s+/).forEach(word => {
      if (word.length > 3) keywords.add(word.toLowerCase())
    })
  }

  // Extract from tools
  const tools = extractTechnologies(frontmatter.tools)
  tools.forEach(tool => keywords.add(tool.toLowerCase()))

  // Extract from description
  const descMatch = content.match(/## Description\s*\n([\s\S]*?)(?=\n##|\n```|\n*$)/i)
  if (descMatch) {
    descMatch[1].split(/\s+/).forEach(word => {
      if (word.length > 4 && !word.match(/^(the|and|or|but|for|with|from|that|this|have|been|has|will|would|could|should)$/)) {
        keywords.add(word.toLowerCase().replace(/[^\w]/g, ''))
      }
    })
  }

  return Array.from(keywords)
}

/**
 * Extract integration patterns from content
 */
function extractIntegrations(content) {
  const integrations = new Set()

  // Look for integration patterns
  const integrationPatterns = [
    /collaborate with\s+(\w+)/gi,
    /work with\s+(\w+)/gi,
    /coordinate with\s+(\w+)/gi,
    /partner with\s+(\w+)/gi,
    /sync with\s+(\w+)/gi
  ]

  integrationPatterns.forEach(pattern => {
    const matches = content.match(pattern)
    if (matches) {
      matches.forEach(match => {
        const integration = match.replace(/(collaborate with|work with|coordinate with|partner with|sync with)\s+/i, '')
        if (integration.length > 2) {
          integrations.add(integration.toLowerCase())
        }
      })
    }
  })

  return Array.from(integrations)
}

/**
 * Enhanced subagent parser with rich metadata extraction
 */
function parseEnhancedSubagent(content, filePath) {
  try {
    const frontmatter = parseYamlFrontmatter(content)
    const category = extractCategoryFromPath(filePath)
    const technologies = extractTechnologies(frontmatter.tools)
    const experienceLevel = determineExperienceLevel(content, frontmatter)
    const complexity = assessComplexity(content, frontmatter)
    const keywords = extractKeywords(content, frontmatter)
    const integrations = extractIntegrations(content)

    // Extract basic content using existing parser
    const basicData = parseBasicSubagentContent(content)

    // Generate unique ID from filename
    const id = path.basename(filePath, '.md').toLowerCase().replace(/[^a-z0-9]/g, '-')

    return {
      // Basic Information
      id,
      title: basicData.title || frontmatter.name || 'Untitled Subagent',
      description: basicData.description || frontmatter.description || 'No description available.',
      filename: path.basename(filePath),
      path: filePath.replace(/.*external-subagents\//, ''),

      // Enhanced Metadata
      category,
      technologies,
      experienceLevel,
      complexity,

      // Content
      whyMatters: basicData.whyMatters || frontmatter.description || 'This subagent helps streamline development workflows.',
      whenToUse: Array.isArray(basicData.whenToUse) ? basicData.whenToUse : [],
      whatToDoNext: Array.isArray(basicData.whatToDoNext) ? basicData.whatToDoNext : [],
      exampleCode: basicData.exampleCode || '# Example code not available',

      // Extracted Intelligence
      keywords,
      integrations,
      useCases: extractUseCases(content),

      // Frontmatter data
      tools: technologies,
      name: frontmatter.name,

      // Metadata
      lastUpdated: new Date().toISOString(),
      visible: true,
      selected: false,
      expanded: false
    }
  } catch (error) {
    console.error('Failed to parse enhanced subagent:', error.message)
    return null
  }
}

/**
 * Extract use cases from content
 */
function extractUseCases(content) {
  const useCases = []

  // Look for "When to use" or similar patterns
  const useCasePattern = /##? (?:When to|Usage|Use Cases?)\s*\n([\s\S]*?)(?=\n##|\n```|\n*$)/i
  const match = content.match(useCasePattern)

  if (match) {
    const useCaseText = match[1]
    const listItems = useCaseText.match(/^[-*]\s+(.+)$/gm)

    if (listItems) {
      useCases.push(...listItems.map(item => item.replace(/^[-*]\s+/, '').trim()))
    }
  }

  return useCases
}

/**
 * Basic subagent content parser (extracted from existing code)
 */
function parseBasicSubagentContent(content) {
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

/**
 * Get all available categories
 */
function getAllCategories() {
  return Object.values(CATEGORY_MAPPING).sort((a, b) => a.order - b.order)
}

/**
 * Get all available technologies
 */
async function getAllAvailableTechnologies(gitManager) {
  try {
    const files = await gitManager.getRepositoryFiles()
    const mdFiles = files.filter(file => file.name.endsWith('.md'))

    const allTechnologies = new Set()

    for (const file of mdFiles) {
      try {
        const filePath = path.join(gitManager.repoPath, file.path)
        const content = await fs.promises.readFile(filePath, 'utf8')
        const frontmatter = parseYamlFrontmatter(content)
        const technologies = extractTechnologies(frontmatter.tools)

        technologies.forEach(tech => allTechnologies.add(tech))
      } catch (error) {
        // Skip files that can't be parsed
      }
    }

    return Array.from(allTechnologies).sort()
  } catch (error) {
    return []
  }
}

/**
 * Format subagent for API response
 */
function formatForAPI(subagent) {
  return {
    id: subagent.id,
    title: subagent.title,
    description: subagent.description,
    category: subagent.category,
    technologies: subagent.technologies,
    experienceLevel: subagent.experienceLevel,
    complexity: subagent.complexity,
    whyMatters: subagent.whyMatters,
    whenToUse: subagent.whenToUse,
    whatToDoNext: subagent.whatToDoNext,
    exampleCode: subagent.exampleCode,
    keywords: subagent.keywords,
    integrations: subagent.integrations,
    useCases: subagent.useCases,
    tools: subagent.tools,
    filename: subagent.filename,
    path: subagent.path,
    lastUpdated: subagent.lastUpdated,
    visible: subagent.visible,
    selected: subagent.selected,
    expanded: subagent.expanded
  }
}

module.exports = {
  parseEnhancedSubagent,
  parseYamlFrontmatter,
  extractCategoryFromPath,
  extractTechnologies,
  determineExperienceLevel,
  assessComplexity,
  extractKeywords,
  extractIntegrations,
  getAllCategories,
  getAllAvailableTechnologies,
  formatForAPI
}