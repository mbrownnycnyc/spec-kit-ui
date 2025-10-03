import Overview from './Overview'
import SpecEarFierSection from './SpecEarFierSection'
import PromptGeneratorSection from './PromptGeneratorSection'
import TemplatesSection from './TemplatesSection'
import TutorialsSection from './TutorialsSection'
import JourneySection from './JourneySection'
import SDDExplanation from './SDDExplanation'
import CommunitySection from './CommunitySection'

const AppContent = ({
  activeSection,
  // Spec-ear-fier props
  doNotSave, setDoNotSave, selectedScenario, setSelectedScenario,
  isRecording, transcript, setTranscript, isProcessing, saveButtonState, setSaveButtonState, toggleRecording,
  generatingPrompt: specEarFierGeneratingPrompt, setGeneratingPrompt: setSpecEarFierGeneratingPrompt, setSpecEarFierGeneratedPrompt,
  // Tutorial player props
  showTutorialPlayer, activeTutorial, currentStep, tutorialCompleted, exerciseAnswers, mediaLoaded, closeTutorial, nextStep, previousStep, handleExerciseAnswer, getTutorialProgress, setMediaLoadedForTutorial,
  // Progress tracking props
  showAchievementsModal, setShowAchievementsModal, achievements, achievementDefinitions,
  // Community props
  showCommunityModal, setShowCommunityModal,
  // Generated prompts
  specEarFierGeneratedPrompt, promptGeneratorGeneratedPrompt,
  // Prompt generator props
  promptVariables, expandedTemplates, generatingPrompt, generateSuccess, promptTemplates, scenarioPresets, handleVariableChange, toggleTemplate, generatePrompt, applyScenario, clearScenario
}) => {
  return (
    <>
      {/* Overview Section */}
      {activeSection === 'overview' && <Overview />}

      {/* Spec-ear-fier Section */}
      {activeSection === 'spec-ear-fier' && (
        <SpecEarFierSection
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
          generatingPrompt={specEarFierGeneratingPrompt}
          setGeneratingPrompt={setSpecEarFierGeneratingPrompt}
          specEarFierGeneratedPrompt={specEarFierGeneratedPrompt}
          setSpecEarFierGeneratedPrompt={setSpecEarFierGeneratedPrompt}
        />
      )}

      {/* Prompts Section */}
      {activeSection === 'prompts' && (
        <PromptGeneratorSection
          generatedPrompt={promptGeneratorGeneratedPrompt}
          promptVariables={promptVariables}
          selectedScenario={selectedScenario}
          expandedTemplates={expandedTemplates}
          generatingPrompt={generatingPrompt}
          generateSuccess={generateSuccess}
          promptTemplates={promptTemplates}
          scenarioPresets={scenarioPresets}
          handleVariableChange={handleVariableChange}
          toggleTemplate={toggleTemplate}
          generatePrompt={generatePrompt}
          applyScenario={applyScenario}
          clearScenario={clearScenario}
        />
      )}

      {/* Templates Section */}
      {activeSection === 'templates' && <TemplatesSection />}

      {/* Tutorials Section */}
      {activeSection === 'tutorials' && (
        <TutorialsSection
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
        />
      )}

      {/* Community Section */}
      {activeSection === 'community' && (
        <CommunitySection
          showCommunityModal={showCommunityModal}
          setShowCommunityModal={setShowCommunityModal}
        />
      )}

      {/* Other sections would go here */}
      {activeSection === 'journey' && <JourneySection />}
      {activeSection === 'sdd' && <SDDExplanation />}
    </>
  )
}

export default AppContent