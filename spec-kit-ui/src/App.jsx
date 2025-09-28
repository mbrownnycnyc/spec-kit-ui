import { useState } from 'react'
import AppHeader from './components/AppHeader'
import AppContent from './components/AppContent'
import AppModals from './components/AppModals'
import navigationSections from './data/navigationSections'
import { useTutorialPlayer, useProgressTracking, useCommunityFeatures, useSkillAssessment, useSpeechRecognition, usePromptGenerator, useTutorialProgress, useTheme, useThemeToggle } from './hooks'
import achievementDefinitions from './data/achievementDefinitions'

function App() {
  const [activeSection, setActiveSection] = useState('overview')
  const [promptVariables, setPromptVariables] = useState({})
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [specEarFierGeneratedPrompt, setSpecEarFierGeneratedPrompt] = useState('')
  const [promptGeneratorGeneratedPrompt, setPromptGeneratorGeneratedPrompt] = useState('')
  const { isDarkTheme, toggleTheme } = useThemeToggle()

  useTheme(isDarkTheme)

  // Spec-ear-fier state
  const [doNotSave, setDoNotSave] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState(null)

  // Tutorial player hook
  const {
    activeTutorial,
    currentStep,
    tutorialCompleted,
    exerciseAnswers,
    showTutorialPlayer,
    mediaLoaded,
    startTutorial,
    closeTutorial,
    nextStep,
    previousStep,
    handleExerciseAnswer,
    getTutorialProgress,
    setMediaLoadedForTutorial
  } = useTutorialPlayer()

  // Skill assessment hook
  const {
    assessmentStarted,
    currentQuestion,
    assessmentAnswers,
    assessmentResult,
    adaptiveDifficulty,
    showSkillAssessment,
    recommendedTutorials,
    userSkillLevel,
    learningPath,
    startAssessment,
    handleAnswer,
    completeAssessment,
    resetAssessment,
    getAssessmentProgress,
    isRecommendedTutorial,
    setShowSkillAssessment
  } = useSkillAssessment()

  // Progress tracking hook
  const {
    userProgress,
    achievements,
    currentStreak,
    lastActiveDate,
    totalPoints,
    showAchievementsModal,
    showAchievementNotifications,
    updateTutorialProgress,
    completeTutorial,
    getTutorialStats,
    calculateSkillLevel,
    resetProgress,
    setShowAchievementsModal
  } = useProgressTracking()

  // Community features hook
  const {
    activeCommunityTab,
    communityPosts,
    showCreatePost,
    newPostContent,
    peerReviews,
    userReputation,
    showCommunityModal,
    createCommunityPost,
    likePost,
    addComment,
    createPeerReview,
    submitReview,
    switchTab,
    toggleCommunityModal,
    setNewPostContent,
    setShowCreatePost,
    setShowCommunityModal
  } = useCommunityFeatures()

  // Speech recognition hook
  const {
    isRecording,
    transcript,
    setTranscript,
    isProcessing,
    saveButtonState,
    setSaveButtonState,
    toggleRecording
  } = useSpeechRecognition()

  // Prompt generator hook
  const {
    promptVariables: hookPromptVariables,
    expandedTemplates,
    generatingPrompt,
    generateSuccess,
    selectedScenario: promptSelectedScenario,
    promptGeneratorGeneratedPrompt: hookPromptGeneratorGeneratedPrompt,
    promptTemplates,
    scenarioPresets,
    handleVariableChange,
    toggleTemplate,
    generatePrompt: hookGeneratePrompt,
    applyScenario: hookApplyScenario,
    clearScenario: hookClearScenario,
    setPromptVariables: setHookPromptVariables,
    setPromptGeneratorGeneratedPrompt: setHookPromptGeneratorGeneratedPrompt
  } = usePromptGenerator()

  // Tutorial progress hook
  const {
    tutorialProgress,
    completedSteps,
    expandedStep,
    completeTutorialStep,
    completeWorkflowStep,
    toggleStepDetails
  } = useTutorialProgress()

  return (
    <div className="container">
      <AppHeader
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        navigationSections={navigationSections}
        toggleTheme={toggleTheme}
        isDarkTheme={isDarkTheme}
      />

      <AppContent
        activeSection={activeSection}
        // Spec-ear-fier props
        doNotSave={doNotSave}
        setDoNotSave={setDoNotSave}
        selectedScenario={selectedScenario}
        setSelectedScenario={setSelectedScenario}
        isRecording={isRecording}
        transcript={transcript}
        setTranscript={setTranscript}
        isProcessing={isProcessing}
        saveButtonState={saveButtonState}
        setSaveButtonState={setSaveButtonState}
        toggleRecording={toggleRecording}
        // Tutorial player props
        showTutorialPlayer={showTutorialPlayer}
        activeTutorial={activeTutorial}
        currentStep={currentStep}
        tutorialCompleted={tutorialCompleted}
        exerciseAnswers={exerciseAnswers}
        mediaLoaded={mediaLoaded}
        closeTutorial={closeTutorial}
        nextStep={nextStep}
        previousStep={previousStep}
        handleExerciseAnswer={handleExerciseAnswer}
        getTutorialProgress={getTutorialProgress}
        setMediaLoadedForTutorial={setMediaLoadedForTutorial}
        // Progress tracking props
        showAchievementsModal={showAchievementsModal}
        setShowAchievementsModal={setShowAchievementsModal}
        achievements={achievements}
        achievementDefinitions={achievementDefinitions}
        // Community props
        showCommunityModal={showCommunityModal}
        setShowCommunityModal={setShowCommunityModal}
        // Generated prompts
        specEarFierGeneratedPrompt={specEarFierGeneratedPrompt}
        // Prompt generator props
        promptVariables={hookPromptVariables}
        promptGeneratorGeneratedPrompt={hookPromptGeneratorGeneratedPrompt}
        selectedScenario={promptSelectedScenario}
        expandedTemplates={expandedTemplates}
        generatingPrompt={generatingPrompt}
        generateSuccess={generateSuccess}
        promptTemplates={promptTemplates}
        scenarioPresets={scenarioPresets}
        handleVariableChange={handleVariableChange}
        toggleTemplate={toggleTemplate}
        generatePrompt={hookGeneratePrompt}
        applyScenario={hookApplyScenario}
        clearScenario={hookClearScenario}
      />

      <AppModals
        showTutorialPlayer={showTutorialPlayer}
        activeTutorial={activeTutorial}
        currentStep={currentStep}
        tutorialCompleted={tutorialCompleted}
        exerciseAnswers={exerciseAnswers}
        mediaLoaded={mediaLoaded}
        closeTutorial={closeTutorial}
        nextStep={nextStep}
        previousStep={previousStep}
        handleExerciseAnswer={handleExerciseAnswer}
        getTutorialProgress={getTutorialProgress}
        setMediaLoadedForTutorial={setMediaLoadedForTutorial}
        showAchievementsModal={showAchievementsModal}
        setShowAchievementsModal={setShowAchievementsModal}
        achievements={achievements}
        achievementDefinitions={achievementDefinitions}
        showCommunityModal={showCommunityModal}
        setShowCommunityModal={setShowCommunityModal}
      />

      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {isDarkTheme ? '☀️' : '🌙'}
      </button>
    </div>
  )
}

export default App