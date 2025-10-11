class SubagentParser {
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

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (line.startsWith('# ')) {
        subagent.title = line.replace('# ', '').trim()
      } else if (line.startsWith('## Description')) {
        currentSection = 'description'
      } else if (line.startsWith('## Why')) {
        currentSection = 'why'
        currentList = []
      } else if (line.startsWith('## When to')) {
        currentSection = 'when'
        currentList = []
      } else if (line.startsWith('## What to')) {
        currentSection = 'what'
        currentList = []
      } else if (line.startsWith('```')) {
        codeBlock = !codeBlock
        if (!codeBlock) {
          subagent.exampleCode = subagent.exampleCode.trim()
        }
      } else if (codeBlock) {
        subagent.exampleCode += line + '\n'
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        const item = line.replace(/^[-*]\s+/, '')
        currentList.push(item)
      } else if (line && currentSection === 'description') {
        subagent.description += (subagent.description ? ' ' : '') + line
      } else if (line && currentSection === 'why') {
        subagent.whyMatters += (subagent.whyMatters ? ' ' : '') + line
      } else if (line && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('*')) {
        if (currentSection === 'when') {
          currentList.push(line)
          subagent.whenToUse = [...currentList]
        } else if (currentSection === 'what') {
          currentList.push(line)
          subagent.whatToDoNext = [...currentList]
        }
      }
    }

    return subagent
  }

  formatForDisplay(subagent) {
    const formatList = (items) => {
      if (typeof items === 'string') {
        items = items.split('\n').filter(item => item.trim())
      }
      return Array.isArray(items) ? items : []
    }

    return {
      title: subagent.title || 'Untitled Subagent',
      description: subagent.description || 'No description available.',
      whyMatters: subagent.whyMatters || 'This subagent helps streamline development workflows.',
      whenToUse: formatList(subagent.whenToUse),
      whatToDoNext: formatList(subagent.whatToDoNext),
      exampleCode: subagent.exampleCode || '# Example code not available'
    }
  }

  async parseSubagentsFromFiles(files) {
    const subagents = []

    for (const file of files) {
      try {
        const parsed = this.parseSubagentFromMarkdown(file.content)
        const formatted = this.formatForDisplay(parsed)

        subagents.push({
          ...formatted,
          filename: file.name,
          source: 'awesome-claude-code-subagents'
        })
      } catch (error) {
        console.error(`Failed to parse ${file.name}:`, error.message)
      }
    }

    return subagents
  }
}

export default SubagentParser