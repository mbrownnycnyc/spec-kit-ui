import { useState, useEffect, useRef } from 'react'

export const useSpeechRecognition = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [recognition, setRecognition] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [saveButtonState, setSaveButtonState] = useState('normal') // 'normal', 'saved', 'saving'
  const transcriptDebounceRef = useRef(null)

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

  return {
    isRecording,
    transcript,
    setTranscript,
    isProcessing,
    saveButtonState,
    setSaveButtonState,
    toggleRecording
  }
}