import React from 'react'

const SpecEarFierSection = ({
  isRecording,
  transcript,
  setTranscript,
  isProcessing,
  doNotSave,
  setDoNotSave,
  saveButtonState,
  setSaveButtonState,
  generatingPrompt,
  setGeneratingPrompt,
  specEarFierGeneratedPrompt,
  setSpecEarFierGeneratedPrompt,
  toggleRecording
}) => {
  return (
    <div className="content-section active">
      <div className="card">
        <h3>Spec-ear-fier</h3>
        <p>Capture your thoughts naturally through speech and transform them into structured specifications.</p>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', fontStyle: 'italic', color: '#000000' }}>
              "Spec-ear-fier gave me the entry point to spec-kit that I didn't know I needed.  It was like a giant, red easy button from Staples in the early aughts (one you might sit on like a comfy couch) that's allowed me to take my waking nightmare of an idea to a concrete money making machine.  Thanks Sam Altman!" - Matt Brown
            </p>
          </div>
        <div style={{ background: 'rgba(72, 187, 120, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#48bb78', marginBottom: '1rem' }}>🎯 How to Use This Tool</h4>
          <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
            <strong>Spec-ear-fier</strong> is your digital thinking partner for capturing the free formation of ideas.
            It's designed for the messy, iterative process of problem-solving where your best insights emerge
            through natural expression rather than structured forms.
          </p>
          <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          <strong>Just talk</strong> and let Spec-ear-fier do the rest.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '1.25rem', borderRadius: '10px', borderLeft: '4px solid #667eea' }}>
              <h5 style={{ color: '#667eea', marginBottom: '0.75rem', fontSize: '1rem' }}>💭 Free Formation</h5>
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
                Speak naturally about your problem, solution ideas, challenges, and thoughts.
                Ramble, go off on tangents, challenge your assumptions—this is where innovation happens.
              </p>
            </div>

            <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '1.25rem', borderRadius: '10px', borderLeft: '4px solid #ec4899' }}>
              <h5 style={{ color: '#ec4899', marginBottom: '0.75rem', fontSize: '1rem' }}>🔍 Deep Exploration</h5>
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
                Go deep into technical details or stay at a high level. Discuss edge cases,
                potential failures, user needs, and implementation considerations as they come to mind.
              </p>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1.25rem', borderRadius: '10px', borderLeft: '4px solid #f59e0b' }}>
              <h5 style={{ color: '#f59e0b', marginBottom: '0.75rem', fontSize: '1rem' }}>🧠 Challenge & Distill</h5>
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
                Question your own assumptions, explore alternative approaches,
                and distill complex thoughts into actionable insights through the process of speaking.
              </p>
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.25rem', borderRadius: '10px', marginTop: '1.5rem', border: '1px solid #10b981' }}>
            <h5 style={{ color: '#059669', marginBottom: '0.75rem', fontSize: '1rem' }}>🚀 From Thoughts to Specifications</h5>
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
              Once you've captured your thoughts, the real magic happens. Your raw transcript becomes
              the foundation for creating precise <code style={{ background: '#e5e7eb', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>/specify</code> and
              <code style={{ background: '#e5e7eb', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>/clarify</code> commands that transform your
              spoken ideas into structured, executable specifications for AI-driven development.
            </p>
          </div>
        </div>

        <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>💡 Pro Tips for Effective Sessions</h4>

          <ol style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem', marginBottom: '1rem', color: '#000000' }}>
            <li><strong>Start with the problem:</strong> Describe what you're trying to solve and why it matters</li>
            <li><strong>Think out loud:</strong> Verbalize your thought process, including dead ends and realizations</li>
            <li><strong>Embrace imperfection:</strong> Your first ideas don't need to be polished—capture them anyway</li>
            <li><strong>Connect the dots:</strong> Explain how different concepts relate to each other</li>
            <li><strong>Consider alternatives:</strong> Discuss different approaches and their trade-offs</li>
          </ol>

          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', fontStyle: 'italic', color: '#000000' }}>
              "The best specifications emerge from the messy process of thinking through problems out loud.
              Spec-ear-fier captures that creative energy and transforms it into structured precision." - a person from thispersondoesnotexist.com
            </p>
          </div>
        </div>

        <div style={{ background: 'rgba(237, 137, 54, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#ed8936', marginBottom: '1rem' }}>🎙️ Rick Rubin Machine</h4>

          {/* Browser Compatibility Warning */}
          {!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
            <div style={{ background: 'rgba(245, 101, 101, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #f56565' }}>
              <p style={{ color: '#e53e3e', margin: 0 }}>
                <strong>Browser Not Supported:</strong> Speech Recognition is not supported in your browser.
                Please use Chrome, Edge, or Safari for this feature.
              </p>
            </div>
          )}

          {/* Controls */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={toggleRecording}
              disabled={!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: isRecording ? '#e53e3e' : '#48bb78',
                color: 'white',
                transition: 'all 0.2s ease'
              }}
            >
              {isRecording ? '⏹️ Stop Recording' : '🎙️ Start Recording'}
            </button>

            <div style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              backgroundColor: isProcessing ? '#feebc8' : isRecording ? '#fed7d7' : '#c6f6d5',
              color: isProcessing ? '#c05621' : isRecording ? '#c53030' : '#276749',
              fontSize: '0.875rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}>
              {isProcessing && (
                <span style={{ animation: 'pulse 1s infinite' }}>⚡</span>
              )}
              {isRecording && (
                <span style={{ animation: 'pulse 1.5s infinite' }}>🔴</span>
              )}
              {isProcessing ? 'Processing...' : isRecording ? 'Recording...' : 'Ready'}
            </div>
          </div>

          {/* Text Output */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d3748' }}>
              It's The Word... It's The Word... It's The Word... It's The Word...
              {isRecording && (
                <span style={{
                  marginLeft: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#48bb78',
                  fontWeight: 'normal'
                }}>
                  🎤 Listening... (interim results shown instantly)
                </span>
              )}
            </label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your words will appear here as words..."
              style={{
                width: '100%',
                minHeight: '300px',
                padding: '1rem',
                borderRadius: '8px',
                border: isRecording ? '2px solid #48bb78' : '2px solid #e2e8f0',
                fontSize: '1rem',
                lineHeight: '1.6',
                resize: 'vertical',
                fontFamily: 'inherit',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                boxShadow: isRecording ? '0 0 0 3px rgba(72, 187, 120, 0.1)' : 'none',
                transition: 'all 0.3s ease'
              }}
            />
            {isRecording && transcript.length === 0 && (
              <div style={{
                marginTop: '0.5rem',
                fontSize: '0.875rem',
                color: '#718096',
                fontStyle: 'italic'
              }}>
                💡 Speak now and you'll see text appear immediately as you talk...
              </div>
            )}
          </div>

          {/* Controls Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            {/* Do Not Save Toggle */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: '#4a5568',
              backgroundColor: doNotSave ? 'rgba(245, 101, 101, 0.1)' : 'rgba(72, 187, 120, 0.1)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: `1px solid ${doNotSave ? '#f56565' : '#48bb78'}`,
              transition: 'all 0.3s ease'
            }}>
              <input
                type="checkbox"
                checked={doNotSave}
                onChange={(e) => setDoNotSave(e.target.checked)}
                style={{ margin: 0 }}
              />
              <span style={{ fontWeight: '500' }}>
                {doNotSave ? '🚫 Do Not Save' : '💾 Save on Clear'}
              </span>
            </label>

            {/* Clear Button */}
            <button
              onClick={() => {
                if (!doNotSave && transcript.trim()) {
                  // Save as markdown file
                  setSaveButtonState('saving')
                  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
                  const filename = `spec-ear-fier-transcript-${timestamp}.md`
                  const content = `# Spec-ear-fier Transcript

**Date:** ${new Date().toLocaleString()}
**Duration:** ${isRecording ? 'Recording in progress' : 'Completed'}

## Transcript

${transcript}

---
*Generated by Spec-ear-fier*
`

                  const blob = new Blob([content], { type: 'text/markdown' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = filename
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)

                  // Show success feedback
                  setSaveButtonState('saved')

                  // Auto-revert logic
                  const revertTime = isRecording ? 2000 : 4000
                  setTimeout(() => {
                    if (!isRecording) {
                      setSaveButtonState('normal')
                    }
                  }, revertTime)
                }

                setTranscript('')
              }}
              disabled={!transcript.trim()}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: saveButtonState === 'saved' ? '#48bb78' :
                                 !transcript.trim() ? '#f7fafc' : 'white',
                color: saveButtonState === 'saved' ? 'white' :
                        !transcript.trim() ? '#a0aec0' : '#4a5568',
                cursor: !transcript.trim() ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.3s ease',
                minWidth: '120px'
              }}
            >
              {saveButtonState === 'saved' ? '✅ Saved!' :
               saveButtonState === 'saving' ? '💾 Saving...' :
               !doNotSave ? '💾 Save & Clear' : '🗑️ Clear Only'}
            </button>
          </div>

          {/* Save Status */}
          {!doNotSave && transcript.trim() && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(72, 187, 120, 0.1)',
              border: '1px solid #48bb78',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#276749'
            }}>
              💡 <strong>Auto-save enabled:</strong> When you click "Save & Clear", your transcript will be saved as a markdown file with timestamp.
            </div>
          )}

          {doNotSave && transcript.trim() && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(245, 101, 101, 0.1)',
              border: '1px solid #f56565',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#c53030'
            }}>
              ⚠️ <strong>Do not save mode:</strong> Text will be permanently deleted when you click "Clear Only".
            </div>
          )}

          {/* Generate Prompt Button */}
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button
              onClick={() => {
                if (!transcript.trim()) return

                setGeneratingPrompt(true)

                // Create the comprehensive prompt
                const prompt = `# Spec-ear-fier Analysis: From Ideas to Structured Specifications

## Context
You are acting as an expert Business Development Specialist working with a development team that uses **spec-kit** for Spec-Driven Development (SDD). The team has captured their raw thoughts and ideas through a spoken brainstorming session, which has been transcribed below.

## Your Mission
Analyze the following transcript and help the team transform their free-flowing ideas into structured, actionable **spec-kit** commands. Your goal is to extract the essence of their solution concept and organize it into:

1. **\`/specify\` prompts** - For defining clear feature specifications
2. **\`/clarify\` commands** - For gathering additional information needed

## Analysis Guidelines

### Step 1: Understand the Core Concept
- Identify the primary problem or opportunity being discussed
- Extract key stakeholders and their needs
- Note any technical constraints or preferences mentioned
- Identify the main value proposition or business objective

### Step 2: Extract Potential Features
- Look for specific functionality mentioned
- Identify user pain points that suggest feature needs
- Note any technical components or integrations discussed
- Extract performance, scalability, or usability requirements

### Step 3: Identify Clarification Needs
- Look for assumptions that need validation
- Identify missing technical details
- Note areas where requirements seem ambiguous
- Find places where user research or market validation might be needed

### Step 4: Organize by Priority
- Distinguish between must-have and nice-to-have features
- Identify dependencies between features
- Note any time-sensitive or business-critical elements

## Transcript of Solution Idea Generation Session

\`\`\`
${transcript}
\`\`\`

---

## Required Output Format

Please format your response as **markdown** with the following structure:

### Analysis Summary
[Brief summary of what you understand about the project concept]

### /specify Prompts
Create separate fenced code blocks for each distinct feature or component:

\`\`\`/specify
[Feature specification prompt here]
\`\`\`

\`\`\`/specify
[Another feature specification prompt here]
\`\`\`

### /clarify Commands
Create separate fenced code blocks for each area needing clarification:

\`\`\`/clarify
[Clarification command here]
\`\`\`

\`\`\`/clarify
[Another clarification command here]
\`\`\`

### Additional Notes
[Any context, warnings, or suggestions for the development team]

---

## Tips for High-Quality Output
- Focus on **actionable** commands that the team can execute immediately
- Each \`/specify\` should define one coherent feature or component
- Each \`/clarify\` should target one specific area of uncertainty
- Use clear, concise language that guides the AI toward useful responses
- Consider the **scope** - don't try to boil the ocean in a single command
- Remember the **SDD methodology** - specifications come before implementation

Now analyze the transcript and provide the team with their next steps for transforming their ideas into structured specifications.`

                setSpecEarFierGeneratedPrompt(prompt)
                setGeneratingPrompt(false)
              }}
              disabled={!transcript.trim() || generatingPrompt}
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
            {!transcript.trim() && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#718096', fontStyle: 'italic' }}>
                Record some speech first to generate a prompt
              </p>
            )}
          </div>

          {/* Generated Prompt Section */}
          {specEarFierGeneratedPrompt && (
            <div className="card" style={{ marginTop: '2rem' }}>
              <h4>Generated Prompt:</h4>
              <div className="prompt-output">{specEarFierGeneratedPrompt}</div>
              <button
                className="btn-secondary"
                onClick={() => navigator.clipboard.writeText(specEarFierGeneratedPrompt)}
                style={{ marginTop: '1rem' }}
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SpecEarFierSection