import React from 'react'

const TutorialsSection = ({
  userSkillLevel,
  recommendedTutorials,
  userProgress,
  showSkillAssessment,
  assessmentAnswers,
  achievements,
  showAchievementsModal,
  showAchievementNotifications,
  tutorials,
  skillAssessmentQuestions,
  achievementDefinitions,
  startSkillAssessment,
  getTutorialStats,
  startTutorial,
  completeTutorialStep,
  setShowSkillAssessment,
  setAssessmentAnswers,
  setShowAchievementsModal,
  completeSkillAssessment,
  calculateSkillLevel,
  generateLearningPath
}) => {
  return (
    <div className="content-section active">
      <div className="card">
        <h3>Interactive Learning Modules</h3>
        <p>Master SDD through hands-on tutorials and guided exercises.</p>
      </div>

      {/* Skill Assessment Card */}
      {!userSkillLevel && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', border: '2px solid rgba(102, 126, 234, 0.2)' }}>
          <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>🎯 Personalize Your Learning Path</h4>
          <p style={{ marginBottom: '1.5rem' }}>
            Take our quick skill assessment to get a personalized learning path tailored to your experience level and goals.
          </p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button className="btn" onClick={startSkillAssessment}>
              Start Assessment (2 minutes)
            </button>
            <span style={{ fontSize: '0.9rem', color: '#718096' }}>
              ✨ Get customized tutorial recommendations
            </span>
          </div>
        </div>
      )}

      {/* Learning Path Display */}
      {userSkillLevel && recommendedTutorials.length > 0 && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(56, 161, 105, 0.1) 100%)', border: '2px solid rgba(72, 187, 120, 0.2)' }}>
          <h4 style={{ color: '#48bb78', marginBottom: '1rem' }}>🚀 Your Personalized Learning Path</h4>
          <p style={{ marginBottom: '1rem' }}>
            Based on your assessment, we recommend starting with these {recommendedTutorials.length} tutorials:
          </p>
          <div style={{ marginBottom: '1.5rem' }}>
            {recommendedTutorials.map((tutorial, index) => (
              <div key={tutorial.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '8px' }}>
                <div style={{ width: '30px', height: '30px', background: '#48bb78', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '1rem' }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#2d3748' }}>{tutorial.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#718096' }}>{tutorial.duration} • {tutorial.level}</div>
                </div>
                <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => startTutorial(tutorials.indexOf(tutorial))}>
                  Start
                </button>
              </div>
            ))}
          </div>
          <button className="btn-secondary" onClick={() => setShowSkillAssessment(true)}>
            Retake Assessment
          </button>
        </div>
      )}

      {/* Progress Dashboard */}
      {(userSkillLevel || Object.keys(userProgress).length > 0) && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(159, 122, 234, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)', border: '2px solid rgba(159, 122, 234, 0.2)' }}>
          <h4 style={{ color: '#9f7aea', marginBottom: '1rem' }}>📊 Your Learning Progress</h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9f7aea' }}>{getTutorialStats().completionRate}%</div>
              <div style={{ fontSize: '0.85rem', color: '#718096' }}>Completion</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f6ad55' }}>{getTutorialStats().totalPoints}</div>
              <div style={{ fontSize: '0.85rem', color: '#718096' }}>Points</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#48bb78' }}>{getTutorialStats().streakDays}</div>
              <div style={{ fontSize: '0.85rem', color: '#718096' }}>Day Streak</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>{getTutorialStats().achievementsCount}</div>
              <div style={{ fontSize: '0.85rem', color: '#718096' }}>Achievements</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: '#4a5568', marginBottom: '0.25rem' }}>
                {getTutorialStats().completedCount} of {getTutorialStats().totalCount} tutorials completed
              </div>
              <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                Average accuracy: {getTutorialStats().averageAccuracy}%
              </div>
            </div>
            <button className="btn-secondary" onClick={() => setShowAchievementsModal(true)}>
              View Achievements
            </button>
          </div>
        </div>
      )}

      {/* Tutorial filters and categories */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <button className="nav-button active" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
            All Tutorials
          </button>
          <button className="nav-button" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
            Beginner
          </button>
          <button className="nav-button" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
            Intermediate
          </button>
          <button className="nav-button" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
            Advanced
          </button>
        </div>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
          📚 {tutorials.length} comprehensive tutorials available • 🎯 Progress tracking included
        </p>
      </div>

      <div className="tutorial-grid">
        {tutorials.map((tutorial, index) => (
          <div key={index} className="card" style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: tutorial.level === 'Beginner' ? 'rgba(72, 187, 120, 0.1)' :
                       tutorial.level === 'Intermediate' ? 'rgba(237, 137, 54, 0.1)' :
                       'rgba(159, 122, 234, 0.1)',
              color: tutorial.level === 'Beginner' ? '#48bb78' :
                     tutorial.level === 'Intermediate' ? '#ed8936' : '#9f7aea',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}>
              {tutorial.level}
            </div>

            <h4>{tutorial.title}</h4>
            <p style={{ marginBottom: '1rem' }}>{tutorial.description}</p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#718096' }}>
              <span>📅 {tutorial.duration}</span>
              <span>📝 {tutorial.steps.length} steps</span>
              <span>🎯 {tutorial.category}</span>
            </div>

            <button className="btn" onClick={() => startTutorial(index)}>
              Start Tutorial
            </button>

            <div style={{ marginTop: '1rem' }}>
              <h5 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>What you'll learn:</h5>
              <ul style={{ textAlign: 'left', fontSize: '0.85rem', paddingLeft: '1.25rem' }}>
                {tutorial.steps.slice(0, 3).map((step, stepIndex) => (
                  <li key={stepIndex} style={{ marginBottom: '0.25rem' }}>
                    {typeof step === 'string' ? step : step.title}
                  </li>
                ))}
                {tutorial.steps.length > 3 && (
                  <li style={{ marginBottom: '0.25rem', color: '#718096', fontStyle: 'italic' }}>
                    +{tutorial.steps.length - 3} more steps...
                  </li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Quick Start Exercise</h3>
        <p>Try this simple exercise to understand the SDD workflow:</p>

        <div className="step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h4>Define a Simple Feature</h4>
            <p>Think of a simple feature you'd like to build (e.g., a to-do list, a contact form, etc.).</p>
          </div>
        </div>

        <div className="step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h4>Write Your Specification</h4>
            <p>Use the prompt generator above to create a specification for your feature.</p>
          </div>
        </div>

        <div className="step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h4>Generate Implementation Plan</h4>
            <p>Use the /plan command structure to outline how you would implement it.</p>
          </div>
        </div>

        <button className="btn" onClick={completeTutorialStep}>
          Mark Exercise Complete
        </button>
      </div>

      {/* Skill Assessment Modal */}
      {showSkillAssessment && (
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
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0 }}>🎯 Skill Assessment</h2>
              <button
                onClick={() => setShowSkillAssessment(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#718096'
                }}
              >
                ×
              </button>
            </div>

            <p style={{ marginBottom: '2rem', color: '#4a5568' }}>
              Answer these 6 quick questions to get personalized tutorial recommendations based on your experience and goals.
            </p>

            <div style={{ marginBottom: '2rem' }}>
              {skillAssessmentQuestions.map((question, index) => (
                <div key={question.id} style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ marginBottom: '1rem', color: '#2d3748' }}>
                    {index + 1}. {question.question}
                  </h4>

                  {question.type === 'multiple-choice' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {question.options.map((option, optionIndex) => (
                        <label key={optionIndex} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0.75rem', background: assessmentAnswers[question.id] === option ? 'rgba(102, 126, 234, 0.1)' : 'rgba(0, 0, 0, 0.05)', borderRadius: '8px', transition: 'all 0.3s ease' }}>
                          <input
                            type="radio"
                            name={question.id}
                            value={option}
                            checked={assessmentAnswers[question.id] === option}
                            onChange={(e) => setAssessmentAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                            style={{ marginRight: '0.75rem' }}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === 'multi-select' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {question.options.map((option, optionIndex) => (
                        <label key={optionIndex} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0.75rem', background: (assessmentAnswers[question.id] || []).includes(option) ? 'rgba(102, 126, 234, 0.1)' : 'rgba(0, 0, 0, 0.05)', borderRadius: '8px', transition: 'all 0.3s ease' }}>
                          <input
                            type="checkbox"
                            value={option}
                            checked={(assessmentAnswers[question.id] || []).includes(option)}
                            onChange={(e) => {
                              const currentValues = assessmentAnswers[question.id] || []
                              if (e.target.checked) {
                                setAssessmentAnswers(prev => ({ ...prev, [question.id]: [...currentValues, option] }))
                              } else {
                                setAssessmentAnswers(prev => ({ ...prev, [question.id]: currentValues.filter(v => v !== option) }))
                              }
                            }}
                            style={{ marginRight: '0.75rem' }}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setShowSkillAssessment(false)}>
                Cancel
              </button>
              <button
                className="btn"
                onClick={completeSkillAssessment}
                disabled={Object.keys(assessmentAnswers).length < skillAssessmentQuestions.length - 1} // Allow one unanswered for multi-select
              >
                Get My Learning Path
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Notifications */}
      {showAchievementNotifications && (
        <div style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          zIndex: 2000,
          animation: 'slideIn 0.5s ease-out'
        }}>
          {achievements.slice(-3).map(achievementId => {
            const achievement = achievementDefinitions.find(a => a.id === achievementId)
            return achievement ? (
              <div key={achievementId} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                borderLeft: '4px solid #f6ad55',
                maxWidth: '300px',
                animation: 'bounceIn 0.6s ease-out'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '2rem', marginRight: '0.75rem' }}>{achievement.icon}</div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#2d3748' }}>Achievement Unlocked!</div>
                    <div style={{ color: '#f6ad55', fontWeight: '600' }}>{achievement.title}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                  {achievement.description} • +{achievement.points} points
                </div>
              </div>
            ) : null
          })}
        </div>
      )}

      {/* Achievements Modal */}
      {showAchievementsModal && (
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
            padding: '2rem',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0 }}>🏆 Achievements</h2>
              <button
                onClick={() => setShowAchievementsModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#718096'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '0.5rem' }}>
                {achievements.length} of {achievementDefinitions.length} achievements unlocked
              </div>
              <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                Keep learning to unlock more achievements!
              </div>
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
    </div>
  )
}

export default TutorialsSection