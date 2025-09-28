import React from 'react'

const TutorialPlayerModal = ({
  showTutorialPlayer,
  activeTutorial,
  currentStep,
  tutorialCompleted,
  tutorials,
  closeTutorial,
  previousStep,
  nextStep,
  getTutorialProgress,
  renderVideoContent,
  renderDiagramContent,
  renderCaseStudyContent,
  renderExercise,
  setActiveTutorial,
  setShowTutorialPlayer,
  setActiveSection
}) => {
  if (!showTutorialPlayer || activeTutorial === null) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Tutorial Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '2rem',
          position: 'relative'
        }}>
          <button
            onClick={closeTutorial}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>

          <h2 style={{ margin: '0 0 0.5rem 0' }}>
            {tutorials[activeTutorial].title}
          </h2>
          <p style={{ margin: '0', opacity: 0.9 }}>
            {tutorials[activeTutorial].description}
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.9rem' }}>
            <span>📅 {tutorials[activeTutorial].duration}</span>
            <span>🎯 {tutorials[activeTutorial].level}</span>
            <span>📝 Step {currentStep + 1} of {tutorials[activeTutorial].steps.length}</span>
          </div>

          {/* Progress Bar */}
          <div style={{ marginTop: '1rem', height: '4px', background: 'rgba(255, 255, 255, 0.3)', borderRadius: '2px' }}>
            <div style={{
              width: `${getTutorialProgress()}%`,
              height: '100%',
              background: 'white',
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Tutorial Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {!tutorialCompleted ? (
            <div>
              {/* Current Step */}
              <div>
                <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>
                  {tutorials[activeTutorial].steps[currentStep].title}
                </h3>
                <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  {tutorials[activeTutorial].steps[currentStep].content}
                </p>

                {/* Enhanced Content Types */}
                {tutorials[activeTutorial].steps[currentStep].video && (
                  renderVideoContent(tutorials[activeTutorial].steps[currentStep].video)
                )}

                {tutorials[activeTutorial].steps[currentStep].diagram && (
                  renderDiagramContent(tutorials[activeTutorial].steps[currentStep].diagram)
                )}

                {tutorials[activeTutorial].steps[currentStep].caseStudy && (
                  renderCaseStudyContent(tutorials[activeTutorial].steps[currentStep].caseStudy)
                )}

                {/* Key Points */}
                {tutorials[activeTutorial].steps[currentStep].keyPoints && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ color: '#667eea', marginBottom: '0.75rem' }}>🔑 Key Points:</h4>
                    <ul style={{ textAlign: 'left', paddingLeft: '1.5rem', color: '#4a5568' }}>
                      {tutorials[activeTutorial].steps[currentStep].keyPoints.map((point, index) => (
                        <li key={index} style={{ marginBottom: '0.5rem' }}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Exercise */}
                {tutorials[activeTutorial].steps[currentStep].exercise && (
                  renderExercise(tutorials[activeTutorial].steps[currentStep], currentStep)
                )}
              </div>

              {/* Navigation */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '2rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #e2e8f0'
              }}>
                <button
                  onClick={previousStep}
                  disabled={currentStep === 0}
                  className={`btn-secondary ${currentStep === 0 ? 'disabled' : ''}`}
                  style={{ opacity: currentStep === 0 ? 0.5 : 1 }}
                >
                  ← Previous
                </button>

                <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                  {currentStep + 1} of {tutorials[activeTutorial].steps.length} steps
                </div>

                <button
                  onClick={nextStep}
                  className="btn"
                >
                  {currentStep === tutorials[activeTutorial].steps.length - 1 ? 'Complete Tutorial' : 'Next →'}
                </button>
              </div>
            </div>
          ) : (
            /* Tutorial Completion */
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
              <h2 style={{ color: '#48bb78', marginBottom: '1rem' }}>Tutorial Complete!</h2>
              <p style={{ color: '#4a5568', marginBottom: '2rem', lineHeight: '1.6' }}>
                Congratulations! You've successfully completed "{tutorials[activeTutorial].title}".
                You've gained valuable skills in Spec-Driven Development.
              </p>

              <div style={{
                background: 'rgba(72, 187, 120, 0.1)',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                textAlign: 'left'
              }}>
                <h4 style={{ color: '#48bb78', marginBottom: '1rem' }}>🏆 What You've Achieved:</h4>
                <ul style={{ textAlign: 'left', color: '#2d3748', marginBottom: 0 }}>
                  <li>Completed {tutorials[activeTutorial].steps.length} learning steps</li>
                  <li>Mastered key SDD concepts</li>
                  <li>Gained hands-on practice experience</li>
                  <li>Built confidence in applying SDD methodology</li>
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={closeTutorial} className="btn">
                  Back to Tutorials
                </button>
                <button
                  onClick={() => {
                    setActiveTutorial(null)
                    setShowTutorialPlayer(false)
                    setActiveSection('prompts')
                  }}
                  className="btn-secondary"
                >
                  Try Practice Exercises
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TutorialPlayerModal