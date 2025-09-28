import TutorialPlayerModal from './TutorialPlayerModal'

const AppModals = ({
  showTutorialPlayer,
  activeTutorial,
  currentStep,
  tutorialCompleted,
  exerciseAnswers,
  mediaLoaded,
  closeTutorial,
  nextStep,
  previousStep,
  handleExerciseAnswer,
  getTutorialProgress,
  setMediaLoadedForTutorial,
  showAchievementsModal,
  setShowAchievementsModal,
  achievements,
  achievementDefinitions,
  showCommunityModal,
  setShowCommunityModal
}) => {
  return (
    <>
      {/* Tutorial Player Modal */}
      {showTutorialPlayer && (
        <TutorialPlayerModal
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

      {/* Achievements Modal */}
      {showAchievementsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>🏆 Achievements</h2>
              <button
                onClick={() => setShowAchievementsModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {achievementDefinitions.map(achievement => {
                const isUnlocked = achievements.includes(achievement.id)
                return (
                  <div
                    key={achievement.id}
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      background: isUnlocked ? 'linear-gradient(135deg, rgba(246, 173, 85, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%)' : 'rgba(0, 0, 0, 0.05)',
                      border: isUnlocked ? '2px solid rgba(246, 173, 85, 0.3)' : '2px solid transparent',
                      opacity: isUnlocked ? 1 : 0.6,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ fontSize: '2.5rem', marginRight: '1rem', filter: isUnlocked ? 'none' : 'grayscale(100%)' }}>
                        {achievement.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <h4 style={{ margin: 0, color: isUnlocked ? '#2d3748' : '#718096' }}>
                            {achievement.title}
                          </h4>
                          <div style={{ fontSize: '0.85rem', color: isUnlocked ? '#f6ad55' : '#a0aec0' }}>
                            {isUnlocked ? `+${achievement.points} pts` : 'Locked'}
                          </div>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: isUnlocked ? '#4a5568' : '#a0aec0' }}>
                          {achievement.description}
                        </p>
                        {!isUnlocked && (
                          <div style={{ fontSize: '0.8rem', color: '#a0aec0', marginTop: '0.25rem' }}>
                            Keep learning to unlock this achievement
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Community Modal */}
      {showCommunityModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>👥 SDD Community</h2>
              <button
                onClick={() => setShowCommunityModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>
            <p>Community features coming soon!</p>
          </div>
        </div>
      )}
    </>
  )
}

export default AppModals