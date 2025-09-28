import React from 'react'

const TutorialExerciseRenderer = ({ step, stepIndex, exerciseAnswers, handleExerciseAnswer }) => {
  const exercise = step.exercise
  const userAnswer = exerciseAnswers[stepIndex]

  switch (exercise.type) {
    case 'quiz':
      return (
        <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(102, 126, 234, 0.05)', borderRadius: '8px' }}>
          <h5 style={{ color: '#667eea', marginBottom: '1rem' }}>📝 Knowledge Check</h5>
          <p style={{ marginBottom: '1rem', fontWeight: '500' }}>{exercise.question}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {exercise.options.map((option, index) => (
              <button
                key={index}
                className={`btn ${userAnswer === option ? 'active' : ''}`}
                onClick={() => handleExerciseAnswer(stepIndex, option)}
                style={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                {option}
              </button>
            ))}
          </div>
          {userAnswer && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: userAnswer === exercise.answer ? 'rgba(72, 187, 120, 0.1)' : 'rgba(229, 62, 62, 0.1)', borderRadius: '6px' }}>
              <p style={{ margin: 0, color: userAnswer === exercise.answer ? '#48bb78' : '#e53e3e' }}>
                {userAnswer === exercise.answer ? '✅ Correct!' : '❌ Incorrect'}
                {exercise.explanation && ` - ${exercise.explanation}`}
              </p>
            </div>
          )}
        </div>
      )
    case 'ordering':
      return (
        <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(102, 126, 234, 0.05)', borderRadius: '8px' }}>
          <h5 style={{ color: '#667eea', marginBottom: '1rem' }}>🔄 Order the Steps</h5>
          <p style={{ marginBottom: '1rem', fontWeight: '500' }}>{exercise.question}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {exercise.items.map((item, index) => (
              <div key={index} style={{ padding: '0.75rem', background: 'white', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                {item}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#667eea' }}>
            💡 Correct order: {exercise.correctOrder.map(i => exercise.items[i]).join(' → ')}
          </div>
        </div>
      )
    case 'command':
      return (
        <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(102, 126, 234, 0.05)', borderRadius: '8px' }}>
          <h5 style={{ color: '#667eea', marginBottom: '1rem' }}>⌨️ Command Practice</h5>
          <p style={{ marginBottom: '1rem', fontWeight: '500' }}>{exercise.question}</p>
          <div className="example-code">{exercise.expectedCommand}</div>
          {exercise.hint && (
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#718096', fontStyle: 'italic' }}>
              💡 Hint: {exercise.hint}
            </p>
          )}
        </div>
      )
    case 'matching':
      return (
        <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(102, 126, 234, 0.05)', borderRadius: '8px' }}>
          <h5 style={{ color: '#667eea', marginBottom: '1rem' }}>🔗 Match the Pairs</h5>
          <p style={{ marginBottom: '1rem', fontWeight: '500' }}>{exercise.question}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <h6 style={{ marginBottom: '0.5rem', color: '#4a5568' }}>Items:</h6>
              {exercise.pairs.map((pair, index) => (
                <div key={index} style={{ padding: '0.5rem', background: 'white', borderRadius: '4px', marginBottom: '0.5rem' }}>
                  {pair[0]}
                </div>
              ))}
            </div>
            <div>
              <h6 style={{ marginBottom: '0.5rem', color: '#4a5568' }}>Matches:</h6>
              {exercise.pairs.map((pair, index) => (
                <div key={index} style={{ padding: '0.5rem', background: 'rgba(72, 187, 120, 0.1)', borderRadius: '4px', marginBottom: '0.5rem' }}>
                  {pair[1]}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    default:
      return (
        <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(102, 126, 234, 0.05)', borderRadius: '8px' }}>
          <h5 style={{ color: '#667eea', marginBottom: '1rem' }}>🎯 Interactive Exercise</h5>
          <p style={{ marginBottom: '1rem', fontWeight: '500' }}>{exercise.question}</p>
          <div style={{ padding: '1rem', background: 'white', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: 0, color: '#718096', fontStyle: 'italic' }}>
              💡 This is an interactive exercise. In a full implementation, this would provide hands-on practice.
            </p>
          </div>
        </div>
      )
  }
}

export default TutorialExerciseRenderer