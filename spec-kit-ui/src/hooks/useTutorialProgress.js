import { useState, useCallback } from 'react'

export const useTutorialProgress = () => {
  const [tutorialProgress, setTutorialProgress] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([false, false, false, false, false, false, false])
  const [expandedStep, setExpandedStep] = useState(null)

  // Handle tutorial progress
  const completeTutorialStep = useCallback(() => {
    if (tutorialProgress < 100) {
      setTutorialProgress(prev => Math.min(prev + 25, 100))
    }
  }, [tutorialProgress])

  // Handle individual SDD workflow step completion
  const completeWorkflowStep = useCallback((stepIndex) => {
    const newCompletedSteps = [...completedSteps]
    newCompletedSteps[stepIndex] = true
    setCompletedSteps(newCompletedSteps)

    // Update overall progress
    const completedCount = newCompletedSteps.filter(Boolean).length
    const newProgress = Math.round((completedCount / newCompletedSteps.length) * 100)
    setTutorialProgress(newProgress)
  }, [completedSteps])

  // Toggle step details expansion
  const toggleStepDetails = useCallback((stepIndex) => {
    setExpandedStep(expandedStep === stepIndex ? null : stepIndex)
  }, [expandedStep])

  return {
    // State
    tutorialProgress,
    completedSteps,
    expandedStep,

    // Actions
    setTutorialProgress,
    setCompletedSteps,
    setExpandedStep,
    completeTutorialStep,
    completeWorkflowStep,
    toggleStepDetails
  }
}