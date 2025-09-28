import { useState } from 'react'
import tutorials from '../data/tutorials'

/**
 * Custom hook for managing tutorial player state and functionality
 * @param {Object} initialProgress - Initial tutorial progress data
 * @returns {Array} - [state, actions] array containing state and action functions
 */
export const useTutorialPlayer = (initialProgress = {}) => {
  // Tutorial state
  const [activeTutorial, setActiveTutorial] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [tutorialCompleted, setTutorialCompleted] = useState(false)
  const [exerciseAnswers, setExerciseAnswers] = useState({})
  const [showTutorialPlayer, setShowTutorialPlayer] = useState(false)
  const [mediaLoaded, setMediaLoaded] = useState({})

  /**
   * Start a new tutorial
   * @param {number} tutorialIndex - Index of the tutorial to start
   */
  const startTutorial = (tutorialIndex) => {
    setActiveTutorial(tutorialIndex)
    setCurrentStep(0)
    setTutorialCompleted(false)
    setExerciseAnswers({})
    setShowTutorialPlayer(true)
  }

  /**
   * Close and reset the tutorial player
   */
  const closeTutorial = () => {
    setShowTutorialPlayer(false)
    setActiveTutorial(null)
    setCurrentStep(0)
    setTutorialCompleted(false)
    setExerciseAnswers({})
  }

  /**
   * Navigate to the next tutorial step
   * @param {Function} updateProgress - Callback to update progress
   */
  const nextStep = (updateProgress) => {
    if (activeTutorial === null || !tutorials[activeTutorial]) return

    const tutorial = tutorials[activeTutorial]
    if (currentStep < tutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1)

      // Update progress for step completion
      if (updateProgress) {
        updateProgress(tutorial.id, {
          currentStep: currentStep + 1,
          stepsCompleted: currentStep + 1,
          totalSteps: tutorial.steps.length
        })
      }
    } else {
      // Tutorial completed
      const exerciseSteps = tutorial.steps.filter(step => step.exercise)
      const correctAnswers = exerciseSteps.filter(step => {
        const stepIndex = tutorial.steps.indexOf(step)
        return exerciseAnswers[stepIndex] === step.exercise.answer
      }).length

      const accuracy = exerciseSteps.length > 0 ? (correctAnswers / exerciseSteps.length) * 100 : 0

      setTutorialCompleted(true)

      if (updateProgress) {
        updateProgress(tutorial.id, {
          completed: true,
          exerciseAccuracy: accuracy,
          completedAt: new Date().toISOString()
        })
      }
    }
  }

  /**
   * Navigate to the previous tutorial step
   */
  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  /**
   * Handle exercise answer submission
   * @param {number} stepIndex - Index of the step being answered
   * @param {string} answer - User's answer
   */
  const handleExerciseAnswer = (stepIndex, answer) => {
    setExerciseAnswers(prev => ({
      ...prev,
      [stepIndex]: answer
    }))
  }

  /**
   * Get current tutorial progress percentage
   * @returns {number} - Progress percentage (0-100)
   */
  const getTutorialProgress = () => {
    if (activeTutorial === null || !tutorials[activeTutorial]) return 0
    const tutorial = tutorials[activeTutorial]
    return ((currentStep + 1) / tutorial.steps.length) * 100
  }

  /**
   * Mark media as loaded for a specific tutorial
   * @param {string} tutorialId - ID of the tutorial
   * @param {boolean} loaded - Whether media is loaded
   */
  const setMediaLoadedForTutorial = (tutorialId, loaded) => {
    setMediaLoaded(prev => ({
      ...prev,
      [tutorialId]: loaded
    }))
  }

  return {
    // State
    activeTutorial,
    currentStep,
    tutorialCompleted,
    exerciseAnswers,
    showTutorialPlayer,
    mediaLoaded,

    // Actions
    startTutorial,
    closeTutorial,
    nextStep,
    previousStep,
    handleExerciseAnswer,
    getTutorialProgress,
    setMediaLoadedForTutorial
  }
}