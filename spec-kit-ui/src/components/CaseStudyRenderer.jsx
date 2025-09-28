import React from 'react'

const CaseStudyRenderer = ({ caseStudyData }) => {
  return (
    <div style={{ margin: '1.5rem 0' }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(66, 153, 225, 0.1) 0%, rgba(49, 130, 206, 0.1) 100%)',
        border: '2px solid rgba(66, 153, 225, 0.2)',
        borderRadius: '12px',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginRight: '1rem' }}>📖</div>
          <div>
            <h4 style={{ color: '#2b6cb0', margin: '0' }}>{caseStudyData.title}</h4>
            <p style={{ color: '#4a5568', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
              Real-World SDD Implementation
            </p>
          </div>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <h5 style={{ color: '#2b6cb0', marginBottom: '0.75rem' }}>Background</h5>
          <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
            {caseStudyData.background}
          </p>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <h5 style={{ color: '#2b6cb0', marginBottom: '0.75rem' }}>Challenge</h5>
          <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
            {caseStudyData.challenge}
          </p>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <h5 style={{ color: '#2b6cb0', marginBottom: '0.75rem' }}>Solution</h5>
          <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
            {caseStudyData.solution}
          </p>
        </div>
        {caseStudyData.process && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ color: '#2b6cb0', marginBottom: '0.75rem' }}>Process</h5>
            <ul style={{ textAlign: 'left', paddingLeft: '1.5rem', color: '#4a5568' }}>
              {caseStudyData.process.map((step, index) => (
                <li key={index} style={{ marginBottom: '0.5rem' }}>{step}</li>
              ))}
            </ul>
          </div>
        )}
        {caseStudyData.results && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ color: '#2b6cb0', marginBottom: '0.75rem' }}>Results</h5>
            <ul style={{ textAlign: 'left', paddingLeft: '1.5rem', color: '#4a5568' }}>
              {caseStudyData.results.map((result, index) => (
                <li key={index} style={{ marginBottom: '0.5rem' }}>{result}</li>
              ))}
            </ul>
          </div>
        )}
        {caseStudyData.keyTakeaways && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ color: '#2b6cb0', marginBottom: '0.75rem' }}>Key Takeaways</h5>
            <ul style={{ textAlign: 'left', paddingLeft: '1.5rem', color: '#4a5568' }}>
              {caseStudyData.keyTakeaways.map((takeaway, index) => (
                <li key={index} style={{ marginBottom: '0.5rem' }}>{takeaway}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default CaseStudyRenderer