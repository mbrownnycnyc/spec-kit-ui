import React from 'react'
import '../App.css'

const PromptGeneratorSection = ({
  // State variables
  promptVariables,
  promptGeneratorGeneratedPrompt,
  selectedScenario,
  expandedTemplates,
  generatingPrompt,
  generateSuccess,

  // Data
  promptTemplates,
  scenarioPresets,

  // Functions
  handleVariableChange,
  toggleTemplate,
  generatePrompt,
  applyScenario,
  clearScenario,
  setActiveSection
}) => {
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
              className={`btn ${selectedScenario === scenario.id ? 'active' : ''}`}
              onClick={() => applyScenario(scenario.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                padding: '1.2rem',
                minHeight: '100px',
                position: 'relative',
                background: selectedScenario === scenario.id
                  ? 'linear-gradient(135deg, #4c51bf 0%, #553c9a 100%)'
                  : undefined
              }}
            >
              <div style={{
                fontSize: '1.5rem',
                marginBottom: '0.5rem',
                filter: selectedScenario === scenario.id ? 'brightness(1.2)' : 'none'
              }}>
                {scenario.icon}
              </div>
              <div style={{ fontWeight: '600', marginBottom: '0.3rem' }}>
                {scenario.name}
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: '1.4' }}>
                {scenario.description}
              </div>
              {selectedScenario === scenario.id && (
                <div style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem'
                }}>
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {promptTemplates.map((template, templateIndex) => (
        <div key={templateIndex} className="card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '1rem',
              margin: '-1rem -1rem 1rem -1rem',
              borderRadius: '12px 12px 0 0',
              transition: 'background-color 0.3s ease'
            }}
            onClick={() => toggleTemplate(templateIndex)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div>
              <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {template.name}
                <span style={{ fontSize: '0.8rem', color: '#667eea' }}>
                  {expandedTemplates[templateIndex] ? '▼' : '▶'}
                </span>
              </h4>
              <p style={{ margin: '0.5rem 0 0 0', color: '#4a5568' }}>{template.description}</p>
            </div>
          </div>

          {expandedTemplates[templateIndex] && (
            <div>
              {/* Why Section */}
              <div style={{ background: 'rgba(72, 187, 120, 0.1)', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
                <h5 style={{ color: '#48bb78', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  💡 Why
                </h5>
                <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.6' }}>{template.why}</p>
              </div>

              {/* When to Change Your Constitution Section */}
              {template.whenToChange && (
                <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
                  <h5 style={{ color: '#ec4899', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🔄 When to Change Your Constitution
                  </h5>
                  <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{template.whenToChange}</p>
                </div>
              )}

              {/* What to Do Next Section */}
              <div style={{ background: 'rgba(237, 137, 54, 0.1)', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
                <h5 style={{ color: '#ed8936', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🎯 What to Do Next
                </h5>
                <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{template.whatToDoNext}</p>
              </div>

              {template.variables.length > 0 && (
                <div style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '1rem', borderRadius: '8px', margin: '1rem 0', border: '1px solid #e2e8f0' }}>
                  <h5 style={{ marginBottom: '1rem' }}>📝 Template Instructions:</h5>
                  {template.templateInstructions ? (
                    <p style={{ fontSize: '0.9rem', color: '#4a5568', marginBottom: '1rem', whiteSpace: 'pre-line' }}>
                      {template.templateInstructions}
                    </p>
                  ) : (
                    <>
                      <p style={{ fontSize: '0.9rem', color: '#4a5568', marginBottom: '1rem' }}>
                        Fill in all the variables below to customize your template. Each placeholder will be replaced with your specific information.
                      </p>

                      <h5>Variables to Complete:</h5>
                      {template.variables.map((variable, varIndex) => (
                        <div key={varIndex} className="variable-input">
                          <label>{variable.label}:</label>
                          <input
                            type="text"
                            placeholder={variable.placeholder}
                            value={promptVariables[`${templateIndex}_${variable.key}`] || ''}
                            onChange={(e) => handleVariableChange(templateIndex, variable.key, e.target.value)}
                          />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {template.variables.length > 0 && (
                <button
                  className="btn"
                  onClick={() => generatePrompt(templateIndex)}
                  disabled={generatingPrompt}
                  style={{
                    position: 'relative',
                    minWidth: '140px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    justifyContent: 'center'
                  }}
                >
                  {generatingPrompt ? (
                    <>
                      <span>⏳</span>
                      <span>Generating...</span>
                    </>
                  ) : generateSuccess ? (
                    <>
                      <span>✅</span>
                      <span>Generated!</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Generate Prompt</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {promptGeneratorGeneratedPrompt && (
        <div className="card">
          <h4>Generated Prompt:</h4>
          <div className="prompt-output">{promptGeneratorGeneratedPrompt}</div>
          <button className="btn-secondary" onClick={() => navigator.clipboard.writeText(promptGeneratorGeneratedPrompt)}>
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  )
}

export default PromptGeneratorSection