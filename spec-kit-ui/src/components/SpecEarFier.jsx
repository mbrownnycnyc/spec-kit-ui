import { useState, useEffect, useRef } from 'react'
import '../App.css'

const SpecEarFier = () => {
  // Spec-ear-fier state
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [recognition, setRecognition] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const transcriptDebounceRef = useRef(null)
  const [doNotSave, setDoNotSave] = useState(false)
  const [saveButtonState, setSaveButtonState] = useState('normal') // 'normal', 'saved', 'saving'
  const [generatingPrompt, setGeneratingPrompt] = useState(false)
  const [specEarFierGeneratedPrompt, setSpecEarFierGeneratedPrompt] = useState('')

  // Function to normalize transcript punctuation and spacing
  const normalizeTranscript = (text) => {
    return text
      // Fix spacing around periods, question marks, and exclamation marks
      // Use two spaces after periods, one space after other punctuation
      .replace(/\s*([.!?])\s*/g, (match, punctuation) => {
        return punctuation === '.' ? '.  ' : punctuation + ' '
      })
      // Remove spaces before punctuation
      .replace(/\s+([.!?])/g, '$1')
      // Fix multiple spaces (but preserve double spaces after periods)
      .replace(/([^.!?])\s+/g, '$1 ')
      .replace(/\s{3,}/g, '  ')
      // Fix spacing after commas, colons, and semicolons
      .replace(/\s*([,;:])\s*/g, '$1 ')
      // Remove spaces before commas, colons, and semicolons
      .replace(/\s+([,;:])/g, '$1')
      // Trim leading/trailing whitespace
      .trim()
  }

  // Initialize speech recognition
  useEffect(() => {
    // Check if we're on the client side and speech recognition is supported
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = 'en-US'

      recognitionInstance.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }

        // Show interim results immediately for faster feedback
        if (interimTranscript) {
          setTranscript(prev => {
            // Remove any trailing interim text from previous update
            const baseText = prev.replace(/ [^.!?]*$/, '')
            return baseText + ' ' + interimTranscript
          })
        }

        // Add final results with normalized punctuation (with debounce delay)
        if (finalTranscript) {
          // Clear any existing debounce timer
          if (transcriptDebounceRef.current) {
            clearTimeout(transcriptDebounceRef.current)
          }

          // Set a new timer to delay the transcript update
          transcriptDebounceRef.current = setTimeout(() => {
            setTranscript(prev => {
              // Remove any interim text that might be there
              const baseText = prev.replace(/ [^.!?]*$/, '')
              const combinedText = baseText + finalTranscript
              return normalizeTranscript(combinedText)
            })
          }, 1200) // 1.2 second delay before processing final transcript
        }
      }

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
      }

      recognitionInstance.onend = () => {
        // Always update recording state when recognition ends
        console.log('Recording ended')
        setIsRecording(false)
      }

      setRecognition(recognitionInstance)

      return () => {
        // Clear any pending transcript debounce timer
        if (transcriptDebounceRef.current) {
          clearTimeout(transcriptDebounceRef.current)
        }
        try {
          recognitionInstance.stop()
        } catch (error) {
          console.error('Error stopping recognition:', error)
        }
      }
    }
  }, [])

  // Handle recording state changes
  useEffect(() => {
    if (recognition && isRecording) {
      try {
        // Reset save button state when recording starts
        setSaveButtonState('normal')
        recognition.start()
      } catch (error) {
        console.error('Error starting recognition:', error)
        setIsRecording(false)
      }
    } else if (recognition && !isRecording) {
      try {
        recognition.stop()
      } catch (error) {
        console.error('Error stopping recognition:', error)
      }
    }
  }, [isRecording, recognition])

  // Handle save button state reset when recording starts
  useEffect(() => {
    if (isRecording && saveButtonState === 'saved') {
      // Reset to normal after 2 seconds if recording starts while in saved state
      const timer = setTimeout(() => {
        setSaveButtonState('normal')
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isRecording, saveButtonState])

  // Toggle recording function
  const toggleRecording = () => {
    if (!recognition) return

    if (!isRecording) {
      setIsProcessing(true)
      setTimeout(() => setIsProcessing(false), 500) // Brief processing indicator
    }

    setIsRecording(!isRecording)
  }

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
              {!isRecording && transcript.trim() && (
                <span style={{
                  marginLeft: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#667eea',
                  fontWeight: 'normal'
                }}>
                  ✅ {transcript.trim().length} characters - Ready to generate prompt
                </span>
              )}
            </label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your words will appear here as you speak, or you can type text directly to test the prompt generator..."
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
                console.log('Generate prompt clicked!')

                if (!transcript.trim()) {
                  console.log('No transcript text, returning early')
                  alert('Please add some text to the transcript first!')
                  return
                }

                console.log('Starting prompt generation...')
                setGeneratingPrompt(true)

                try {
                  // Create the comprehensive prompt
                  const prompt = "# Spec-ear-fier Analysis: From Ideas to Structured Specifications\n\n" +
                  "## Context\n" +
                  "You are acting as an expert Business Development Specialist working with a development team that uses **spec-kit** for Spec-Driven Development (SDD). The team has captured their raw thoughts and ideas through a spoken brainstorming session, which has been transcribed below.\n\n" +
                  "## Your Mission\n" +
                  "Analyze the following transcript and help the team transform their free-flowing ideas into structured, actionable **spec-kit** commands. Your goal is to extract the essence of their solution concept and organize it into:\n\n" +
                  "1. **`/specify` prompts** - For defining clear feature specifications\n" +
                  "2. **`/clarify` commands** - For gathering additional information needed\n\n" +
                  "## Analysis Guidelines\n\n" +
                  "### Step 1: Understand the Core Concept\n" +
                  "- Identify the primary problem or opportunity being discussed\n" +
                  "- Extract key stakeholders and their needs\n" +
                  "- Note any technical constraints or preferences mentioned\n" +
                  "- Identify the main value proposition or business objective\n\n" +
                  "### Step 2: Extract Potential Features\n" +
                  "- Look for specific functionality mentioned\n" +
                  "- Identify user pain points that suggest feature needs\n" +
                  "- Note any technical components or integrations discussed\n" +
                  "- Extract performance, scalability, or usability requirements\n\n" +
                  "### Step 3: Identify Clarification Needs\n" +
                  "- Look for assumptions that need validation\n" +
                  "- Identify missing technical details\n" +
                  "- Note areas where requirements seem ambiguous\n" +
                  "- Find places where user research or market validation might be needed\n\n" +
                  "### Step 4: Organize by Priority\n" +
                  "- Distinguish between must-have and nice-to-have features\n" +
                  "- Identify dependencies between features\n" +
                  "- Note any time-sensitive or business-critical elements\n\n" +
                  "## Transcript of Solution Idea Generation Session\n\n" +
                  "```\n" + transcript + "\n```\n\n" +
                  "---\n\n" +
                  "## Required Output Format\n\n" +
                  "Please format your response as **markdown** with the following structure:\n\n" +
                  "### Analysis Summary\n" +
                  "[Brief summary of what you understand about the project concept]\n\n" +
                  "### /specify Prompts\n" +
                  "Create separate fenced code blocks for each distinct feature or component:\n\n" +
                  "```/specify\n" +
                  "[Feature specification prompt here]\n" +
                  "```\n\n" +
                  "```/specify\n" +
                  "[Another feature specification prompt here]\n" +
                  "```\n\n" +
                  "### /clarify Commands\n" +
                  "Create separate fenced code blocks for each area needing clarification:\n\n" +
                  "```/clarify\n" +
                  "[Clarification command here]\n" +
                  "```\n\n" +
                  "```/clarify\n" +
                  "[Another clarification command here]\n" +
                  "```\n\n" +
                  "### Additional Notes\n" +
                  "[Any context, warnings, or suggestions for the development team]\n\n" +
                  "---\n\n" +
                  "## Tips for High-Quality Output\n" +
                  "- Focus on **actionable** commands that the team can execute immediately\n" +
                  "- Each `/specify` should define one coherent feature or component\n" +
                  "- Each `/clarify` should target one specific area of uncertainty\n" +
                  "- Use clear, concise language that guides the AI toward useful responses\n" +
                  "- Consider the **scope** - don't try to boil the ocean in a single command\n" +
                  "- Remember the **SDD methodology** - specifications come before implementation\n\n" +
                  "Now analyze the transcript and provide the team with their next steps for transforming their ideas into structured specifications."

                  console.log('Full prompt created successfully', { length: prompt.length })
                  setSpecEarFierGeneratedPrompt(prompt)
                } catch (error) {
                  console.error('Error generating prompt:', error)
                  alert('Error generating prompt: ' + error.message)
                } finally {
                  setGeneratingPrompt(false)
                }
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
                💡 Record some speech or type text in the textarea above to generate a prompt
              </p>
            )}

            {/* Test Button for Demo */}
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button
                onClick={() => {
                  const sampleTranscript = "I'm thinking about building a task management app that helps teams collaborate better. The main problem is that most task managers are too complicated and people don't actually use them. I want something simple that integrates with Slack and has automatic reminders. Maybe it could use AI to prioritize tasks based on deadlines and importance. The key features would be: simple task creation, Slack integration, smart notifications, and a clean mobile interface. I'm not sure about the tech stack but I'm thinking React for the frontend and Node.js for the backend."
                  setTranscript(sampleTranscript)
                }}
                className="btn-secondary"
                style={{ fontSize: '0.875rem' }}
              >
                📝 Load Sample Text for Testing
              </button>
            </div>
          </div>

          {/* Generated Prompt Section */}
          {specEarFierGeneratedPrompt && (
            <div className="card" style={{ marginTop: '2rem' }}>
              <h4>Generated Prompt:</h4>
              <div className="prompt-output">{specEarFierGeneratedPrompt}</div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  className="btn-secondary"
                  onClick={() => navigator.clipboard.writeText(specEarFierGeneratedPrompt)}
                >
                  Copy to Clipboard
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setSpecEarFierGeneratedPrompt('')}
                >
                  Clear Prompt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SpecEarFier