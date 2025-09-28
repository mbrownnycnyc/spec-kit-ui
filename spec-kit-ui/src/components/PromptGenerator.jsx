import { useState } from 'react'
import '../App.css'

const PromptGenerator = ({ setActiveSection }) => {
  const [promptVariables, setPromptVariables] = useState({})
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [expandedTemplates, setExpandedTemplates] = useState([false, false, false, false, false])
  const [generatingPrompt, setGeneratingPrompt] = useState(false)
  const [generateSuccess, setGenerateSuccess] = useState(false)
  const [promptGeneratorGeneratedPrompt, setPromptGeneratorGeneratedPrompt] = useState('')

  // Scenario presets for quick template population
  const scenarioPresets = [
    {
      id: 'android-mobile',
      name: 'Android Mobile App',
      description: 'Native Android application with modern architecture',
      icon: '🤖',
      featureSpecVars: {
        feature_name: 'Android Mobile Application',
        feature_type: 'Android Mobile App',
        business_objective: 'Create a native Android application that provides seamless user experience with offline capabilities and push notifications',
        user_scenarios: 'Admin: Manage users and settings, Customer: Access core features and personalize experience, Manager: Monitor analytics and generate reports',
        core_capabilities: 'User authentication with biometric support, Real-time data synchronization with offline mode, Push notification system with rich media, Camera and location integration, Material 3 UI with adaptive layouts',
        requirements: 'Performance: <2s startup time, Security: Biometric auth + data encryption, Compliance: Google Play Store + GDPR, Accessibility: WCAG 2.1 with screen reader support',
        integration_context: 'REST APIs with OpenAPI spec, Firebase for backend services, Google Play Services integration, Third-party analytics SDKs, Kotlin Coroutines for async operations',
        success_criteria: '4.5+ star rating, <1% crash rate, 99.9% uptime, 10K+ concurrent users with minimal battery impact'
      }
    },
    {
      id: 'web-app',
      name: 'Web Application',
      description: 'Modern web application with responsive design',
      icon: '🌐',
      featureSpecVars: {
        feature_name: 'Web Application',
        feature_type: 'Web Application',
        business_objective: 'Create a responsive web application that works across all devices and supports offline functionality',
        user_scenarios: 'Admin: Manage application settings, User: Access core features and personalize experience, Guest: Browse public content',
        core_capabilities: 'Cross-platform support, offline functionality, system notifications, file system access, hardware integration, auto-updates',
        requirements: 'Performance: <1s page load, Security: HTTPS + data encryption, Compliance: WCAG 2.1, Accessibility: Screen reader support',
        integration_context: 'REST APIs, WebSocket for real-time updates, Service Workers for offline functionality, IndexedDB for local storage',
        success_criteria: '90+ PageSpeed score, 99.9% uptime, <100ms API response time, mobile-first design'
      }
    },
    {
      id: 'api-service',
      name: 'API Service',
      description: 'RESTful API service with microservices architecture',
      icon: '⚙️',
      featureSpecVars: {
        feature_name: 'API Service',
        feature_type: 'API Service',
        business_objective: 'Build a scalable API service that supports multiple clients and provides reliable data access',
        user_scenarios: 'Developer: Integrate with API, Admin: Monitor API usage, System: Automated API calls',
        core_capabilities: 'RESTful endpoints, GraphQL support, WebSocket connections, Rate limiting, Authentication & Authorization, API documentation',
        requirements: 'Performance: <50ms response time, Security: OAuth 2.0 + JWT, Compliance: OpenAPI spec, Reliability: 99.9% uptime',
        integration_context: 'Database connections, Message queues, External APIs, Caching layers, Monitoring systems',
        success_criteria: '99.9% uptime, <50ms p95 response time, 1000+ requests/second, comprehensive API documentation'
      }
    }
  ]

  // Prompt templates
  const promptTemplates = [
    {
      name: 'Feature Specification',
      description: 'Generate detailed feature specifications with user stories and acceptance criteria',
      icon: '📋',
      variables: [
        { key: 'feature_name', label: 'Feature Name', placeholder: 'e.g., User Authentication System', required: true },
        { key: 'feature_type', label: 'Feature Type', placeholder: 'e.g., Web Feature, Mobile App, API Service', required: true },
        { key: 'business_objective', label: 'Business Objective', placeholder: 'What business value does this feature provide?', required: true },
        { key: 'user_scenarios', label: 'User Scenarios', placeholder: 'Who will use this feature and how?', required: true },
        { key: 'core_capabilities', label: 'Core Capabilities', placeholder: 'What are the main features and functionality?', required: true },
        { key: 'requirements', label: 'Requirements', placeholder: 'Performance, security, compliance needs', required: false },
        { key: 'integration_context', label: 'Integration Context', placeholder: 'How does this integrate with existing systems?', required: false },
        { key: 'success_criteria', label: 'Success Criteria', placeholder: 'How will we measure success?', required: false }
      ],
      template: `# Feature Specification: {feature_name}

## Overview
{feature_type} designed to {business_objective}

## User Scenarios
{user_scenarios}

## Core Capabilities
{core_capabilities}

## Requirements
{requirements}

## Integration Context
{integration_context}

## Success Criteria
{success_criteria}

---
Generated with Spec-Driven Development methodology`
    },
    {
      name: 'Implementation Plan',
      description: 'Create comprehensive implementation plans with technical architecture',
      icon: '🔧',
      variables: [
        { key: 'project_name', label: 'Project Name', placeholder: 'e.g., E-commerce Platform', required: true },
        { key: 'technology_foundation', label: 'Technology Foundation', placeholder: 'e.g., React, Node.js, PostgreSQL', required: true },
        { key: 'component_architecture', label: 'Component Architecture', placeholder: 'Main components and their responsibilities', required: true },
        { key: 'data_model', label: 'Data Model', placeholder: 'Database schema and relationships', required: true },
        { key: 'api_contract', label: 'API Contract', placeholder: 'REST endpoints and data structures', required: true },
        { key: 'testing_approach', label: 'Testing Approach', placeholder: 'Unit, integration, and E2E testing strategy', required: true },
        { key: 'deployment_strategy', label: 'Deployment Strategy', placeholder: 'CI/CD and deployment process', required: false }
      ],
      template: `# Implementation Plan: {project_name}

## Technology Foundation
{technology_foundation}

## Component Architecture
{component_architecture}

## Data Model
{data_model}

## API Contract
{api_contract}

## Testing Approach
{testing_approach}

## Deployment Strategy
{deployment_strategy}

---
Generated with Spec-Driven Development methodology`
    }
  ]

  // Handle variable input changes
  const handleVariableChange = (templateIndex, variableKey, value) => {
    setPromptVariables(prev => ({
      ...prev,
      [`${templateIndex}_${variableKey}`]: value
    }))
  }

  // Toggle template expansion
  const toggleTemplate = (templateIndex) => {
    setExpandedTemplates(prev => {
      const newExpanded = [...prev]
      newExpanded[templateIndex] = !newExpanded[templateIndex]
      return newExpanded
    })
  }

  // Generate prompt with variable substitution
  const generatePrompt = (templateIndex) => {
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
  }

  // Apply scenario to populate templates
  const applyScenario = (scenarioId) => {
    const scenario = scenarioPresets.find(s => s.id === scenarioId)
    if (!scenario) return

    setSelectedScenario(scenarioId)

    // Populate variables based on scenario
    const newVariables = {}

    if (scenario.featureSpecVars) {
      Object.entries(scenario.featureSpecVars).forEach(([key, value]) => {
        newVariables[`0_${key}`] = value
      })
    }

    setPromptVariables(prev => ({
      ...prev,
      ...newVariables
    }))

    // Expand first template
    setExpandedTemplates([true, false, false, false, false])
  }

  // Clear selected scenario
  const clearScenario = () => {
    setSelectedScenario(null)
    setPromptVariables({})
    setExpandedTemplates([false, false, false, false, false])
  }

  return (
    <div className="content-section active">
      <div className="card">
        <h3>Interactive Prompt Generator</h3>
        <p>Generate customized prompts for your SDD workflow by filling in the variables below.</p>

        <div style={{ background: 'rgba(237, 137, 54, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem', borderLeft: '4px solid #ed8936' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🎙️</span>
            <h4 style={{ color: '#ed8936', margin: 0, fontSize: '1.1rem' }}>Don't know what to do?</h4>
          </div>
          <p style={{ margin: 0, lineHeight: '1.6', color: '#2d3748' }}>
            <strong>Have you tried the Spec-ear-fier?</strong> Just talk about your ideas naturally, and let the Spec-ear-fier help you transform your thoughts into structured specification prompts. It's perfect for brainstorming and exploring concepts before diving into templates!
          </p>
          <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
            <button
              onClick={() => setActiveSection('spec-ear-fier')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid #ed8936',
                backgroundColor: 'white',
                color: '#ed8936',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#ed8936'
                e.target.style.color = 'white'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'white'
                e.target.style.color = '#ed8936'
              }}
            >
              Try Spec-ear-fier →
            </button>
          </div>
        </div>

        <div style={{ background: 'rgba(72, 187, 120, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#48bb78', marginBottom: '1rem' }}>🎯 How to Use This Tool</h4>
          <ol style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem' }} className="text-dark">
            <li><strong>Choose a template:</strong> Select between Feature Specification or Implementation Plan templates</li>
            <li><strong>Fill in the variables:</strong> Replace the placeholders with your specific project details</li>
            <li><strong>Generate your prompt:</strong> Click the generate button to create your customized prompt</li>
            <li><strong>Copy and use:</strong> Copy the generated prompt to your clipboard and use it with your AI assistant</li>
          </ol>
        </div>

        <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>💡 Pro Tips</h4>
          <ul style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem' }} className="text-dark">
            <li><strong>Use Quick Start Templates:</strong> Choose a scenario above to auto-populate both templates with industry best practices</li>
            <li>Be specific with your feature descriptions - more detail leads to better specifications</li>
            <li>Consider your technical constraints and requirements before filling variables</li>
            <li>Use the generated prompts as starting points - feel free to customize them further</li>
            <li>Keep your requirements realistic and achievable for the best results</li>
          </ul>
        </div>
      </div>

      {/* Scenario Selection */}
      <div className="card">
        <h4>🚀 Quick Start Templates</h4>
        <p>Choose a scenario to auto-populate both templates with best practices and industry standards:</p>

        {selectedScenario && (
          <div style={{
            background: 'rgba(72, 187, 120, 0.1)',
            padding: '1rem',
            borderRadius: '8px',
            margin: '1rem 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: '#48bb78', fontWeight: '500' }}>
              ✅ {scenarioPresets.find(s => s.id === selectedScenario)?.name} template applied
            </span>
            <button
              className="btn-secondary"
              onClick={clearScenario}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              Clear Selection
            </button>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem'
        }}>
          {scenarioPresets.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => applyScenario(scenario.id)}
              style={{
                padding: '1.5rem',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                backgroundColor: 'white',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.borderColor = '#667eea'
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)'
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = '#e2e8f0'
                e.target.style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{scenario.icon}</div>
              <h5 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>{scenario.name}</h5>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>{scenario.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Template Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {promptTemplates.map((template, templateIndex) => (
          <div key={templateIndex} className="card">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '1rem',
              backgroundColor: 'rgba(102, 126, 234, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(102, 126, 234, 0.2)'
            }}
              onClick={() => toggleTemplate(templateIndex)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{template.icon}</span>
                <div>
                  <h4 style={{ margin: 0, color: '#2d3748' }}>{template.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>{template.description}</p>
                </div>
              </div>
              <span style={{ fontSize: '1.2rem', transition: 'transform 0.3s ease' }}>
                {expandedTemplates[templateIndex] ? '▼' : '▶'}
              </span>
            </div>

            {expandedTemplates[templateIndex] && (
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ background: 'rgba(72, 187, 120, 0.1)', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
                  <h5 style={{ margin: '0 0 1rem 0', color: '#48bb78' }}>📝 Fill in the Variables:</h5>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {template.variables.map((variable, varIndex) => (
                      <div key={varIndex} className="variable-input">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d3748' }}>
                          {variable.label}
                          {variable.required && <span style={{ color: '#e53e3e', marginLeft: '0.25rem' }}>*</span>}
                        </label>
                        <textarea
                          value={promptVariables[`${templateIndex}_${variable.key}`] || ''}
                          onChange={(e) => handleVariableChange(templateIndex, variable.key, e.target.value)}
                          placeholder={variable.placeholder}
                          style={{
                            width: '100%',
                            minHeight: variable.key.includes('scenarios') || variable.key.includes('capabilities') || variable.key.includes('requirements') ? '80px' : '60px',
                            padding: '0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.9rem',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <button
                    onClick={() => generatePrompt(templateIndex)}
                    disabled={generatingPrompt}
                    className="btn"
                    style={{
                      padding: '0.75rem 2rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      margin: '0 auto',
                      minWidth: '200px',
                      justifyContent: 'center'
                    }}
                  >
                    {generatingPrompt ? (
                      <>
                        <span>⚡</span>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        <span>Generate Prompt</span>
                      </>
                    )}
                  </button>
                  {generateSuccess && (
                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: 'rgba(72, 187, 120, 0.1)',
                      borderRadius: '20px',
                      color: '#48bb78',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      ✅ Prompt generated successfully!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Generated Prompt Output */}
      {promptGeneratorGeneratedPrompt && (
        <div className="card">
          <h4>Generated Prompt:</h4>
          <div className="prompt-output">{promptGeneratorGeneratedPrompt}</div>
          <button
            className="btn-secondary"
            onClick={() => navigator.clipboard.writeText(promptGeneratorGeneratedPrompt)}
            style={{ marginTop: '1rem' }}
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  )
}

export default PromptGenerator