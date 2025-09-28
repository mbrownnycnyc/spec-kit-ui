import React from 'react'

const DiagramRenderer = ({ diagramData }) => {
  return (
    <div style={{ margin: '1.5rem 0' }}>
      <div style={{
        background: '#f7fafc',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        padding: '2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>{diagramData.title}</h4>
          <p style={{ color: '#718096', fontSize: '0.9rem' }}>{diagramData.description}</p>
        </div>
        {/* Interactive diagram placeholder */}
        <div style={{
          background: 'white',
          border: '2px dashed #cbd5e0',
          borderRadius: '8px',
          padding: '3rem 2rem',
          margin: '1rem 0',
          position: 'relative'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            {diagramData.type === 'flowchart' ? '📊' :
             diagramData.type === 'architecture' ? '🏗️' :
             diagramData.type === 'sequence' ? '🔄' : '📋'}
          </div>
          <div style={{ color: '#718096', fontSize: '0.9rem' }}>
            Interactive {diagramData.type} diagram
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button className="btn" style={{ fontSize: '0.85rem' }}>
              View Interactive Diagram
            </button>
          </div>
        </div>
        {diagramData.interactiveElements && (
          <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
            <h5 style={{ color: '#2d3748', marginBottom: '0.75rem' }}>Interactive Elements:</h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {diagramData.interactiveElements.map((element, index) => (
                <div key={index} style={{
                  background: 'rgba(102, 126, 234, 0.1)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(102, 126, 234, 0.2)'
                }}>
                  <div style={{ fontWeight: '500', color: '#667eea', marginBottom: '0.25rem' }}>
                    {element.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                    {element.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {diagramData.legend && (
          <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
            <h5 style={{ color: '#2d3748', marginBottom: '0.75rem' }}>Legend:</h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {diagramData.legend.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    background: item.color,
                    borderRadius: '4px',
                    border: item.border ? `2px solid ${item.border}` : 'none'
                  }}></div>
                  <span style={{ fontSize: '0.9rem', color: '#4a5568' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiagramRenderer