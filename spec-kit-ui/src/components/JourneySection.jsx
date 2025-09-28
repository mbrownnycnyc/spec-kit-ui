import React from 'react'

const JourneySection = () => {
  return (
    <div className="card">
      <h3>🛤️ Your SDD Journey</h3>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', margin: '2rem 0', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            margin: '0 auto 1rem'
          }}>1</div>
          <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>📖 Read Overview</h4>
          <p style={{ fontSize: '0.9rem', margin: 0 }}>Understand SDD methodology</p>
        </div>

        <div style={{ fontSize: '2rem', color: '#667eea' }}>→</div>

        <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            margin: '0 auto 1rem'
          }}>2</div>
          <h4 style={{ color: '#48bb78', marginBottom: '0.5rem' }}>🎤 Spec-ear-fier</h4>
          <p style={{ fontSize: '0.9rem', margin: 0 }}>Capture your ideas naturally</p>
        </div>

        <div style={{ fontSize: '2rem', color: '#667eea' }}>→</div>

        <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            margin: '0 auto 1rem'
          }}>3</div>
          <h4 style={{ color: '#ed8936', marginBottom: '0.5rem' }}>⚡ Prompt Generator</h4>
          <p style={{ fontSize: '0.9rem', margin: 0 }}>Create structured specifications</p>
        </div>
      </div>
    </div>
  )
}

export default JourneySection