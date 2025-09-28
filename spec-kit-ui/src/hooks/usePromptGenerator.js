import { useState, useCallback } from 'react'
import promptTemplates from '../data/promptTemplates'
import scenarioPresets from '../data/scenarioPresets'

export const usePromptGenerator = () => {
  const [promptVariables, setPromptVariables] = useState({})
  const [expandedTemplates, setExpandedTemplates] = useState([false, false, false, false, false]) // All templates collapsed by default
  const [generatingPrompt, setGeneratingPrompt] = useState(false)
  const [generateSuccess, setGenerateSuccess] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [promptGeneratorGeneratedPrompt, setPromptGeneratorGeneratedPrompt] = useState('')

  // Handle variable input changes
  const handleVariableChange = useCallback((templateIndex, variableKey, value) => {
    setPromptVariables(prev => ({
      ...prev,
      [`${templateIndex}_${variableKey}`]: value
    }))
  }, [])

  // Toggle template expansion
  const toggleTemplate = useCallback((templateIndex) => {
    setExpandedTemplates(prev => {
      const newExpanded = [...prev]
      newExpanded[templateIndex] = !newExpanded[templateIndex]
      return newExpanded
    })
  }, [])

  // Generate prompt with variable substitution
  const generatePrompt = useCallback((templateIndex) => {
    setGeneratingPrompt(true)
    setGenerateSuccess(false)

    // Simulate a brief delay for better UX feedback
    setTimeout(() => {
      const template = promptTemplates[templateIndex]
      let prompt = template.template

      // Replace variables with user input
      template.variables.forEach(variable => {
        const key = `${templateIndex}_${variable.key}`
        const value = promptVariables[key] || `[${variable.key.toUpperCase()}]`
        prompt = prompt.replace(new RegExp(`{${variable.key}}`, 'g'), value)
      })

      setPromptGeneratorGeneratedPrompt(prompt)
      setGeneratingPrompt(false)
      setGenerateSuccess(true)

      // Reset success state after 3 seconds
      setTimeout(() => {
        setGenerateSuccess(false)
      }, 3000)
    }, 800)
  }, [promptVariables])

  // Auto-populate template variables based on selected scenario
  const applyScenario = useCallback((scenarioId) => {
    const scenario = scenarioPresets.find(s => s.id === scenarioId)
    if (!scenario) return

    setSelectedScenario(scenarioId)

    // Clear existing variables
    const newVariables = {}

    // Populate variables for all templates based on scenario
    promptTemplates.forEach((template, templateIndex) => {
      let varsKey
      switch (templateIndex) {
        case 0: // Constitution
          varsKey = 'constitutionVars'
          break
        case 1: // Specification
          varsKey = 'featureSpecVars'
          break
        case 2: // Clarification
          varsKey = 'clarifyVars'
          break
        case 3: // Implementation Plan
          varsKey = 'implementationPlanVars'
          break
        case 4: // Task List
          varsKey = 'taskListVars'
          break
        case 5: // Analysis
          varsKey = 'analysisVars'
          break
        case 6: // Implementation
          varsKey = 'implementationVars'
          break
        default:
          return
      }

      const scenarioVars = scenario[varsKey]

      if (scenarioVars) {
        template.variables.forEach(variable => {
          const key = `${templateIndex}_${variable.key}`
          newVariables[key] = scenarioVars[variable.key] || ''
        })
      }
    })

    setPromptVariables(newVariables)
  }, [])

  // Clear scenario selection
  const clearScenario = useCallback(() => {
    setSelectedScenario(null)
    setPromptVariables({})
  }, [])

  return {
    // State
    promptVariables,
    expandedTemplates,
    generatingPrompt,
    generateSuccess,
    selectedScenario,
    promptGeneratorGeneratedPrompt,

    // Data
    promptTemplates,
    scenarioPresets,

    // Actions
    handleVariableChange,
    toggleTemplate,
    generatePrompt,
    applyScenario,
    clearScenario,
    setPromptVariables,
    setPromptGeneratorGeneratedPrompt
  }
}