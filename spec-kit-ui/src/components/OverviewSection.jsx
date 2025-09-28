import React from 'react'

const OverviewSection = () => {
  return (
    <div className="content-section active">
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

      <div className="card">
        <h3>What is Spec-Driven Development?</h3>
        <p>
          Spec-Driven Development (SDD) inverts the traditional software development workflow.
          Instead of specifications serving code, code serves specifications. The Product Requirements
          Document (PRD) isn't a guide for implementation—it's the source that generates implementation.
        </p>
        <p>
          This transformative approach leverages AI to understand and implement complex specifications,
          making specifications executable artifacts rather than static documents.
        </p>

        <div style={{ background: 'rgba(66, 153, 225, 0.1)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #4299e1', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#4299e1', marginBottom: '1rem' }}>🚀 Quick Start with SpecKit</h4>
          <p><strong>Install SpecKit instantly with uvx:</strong></p>
          <div style={{ background: '#2d3748', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
            <code style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>uvx --from git+https://github.com/github/spec-kit.git specify init my-project</code>
          </div>
          <p style={{ margin: 0 }}>No installation required! SpecKit runs directly with uvx and works with your preferred AI assistant.</p>
        </div>
      </div>

      <div className="card">
        <h3>Core Principles of SDD</h3>
        <p>Spec-Driven Development is built on these fundamental principles that guide the entire methodology:</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #667eea' }}>
            <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>📜 Specifications as the Lingua Franca</h4>
            <p>Specifications are the primary artifact, not just documentation. Code serves specifications, making them executable artifacts rather than static documents.</p>
          </div>
          <div style={{ background: 'rgba(72, 187, 120, 0.1)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #48bb78' }}>
            <h4 style={{ color: '#48bb78', marginBottom: '1rem' }}>⚡ Executable Specifications</h4>
            <p>Specifications must be precise, complete, and unambiguous enough to generate working systems directly through AI interpretation.</p>
          </div>
          <div style={{ background: 'rgba(237, 137, 54, 0.1)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #ed8936' }}>
            <h4 style={{ color: '#ed8936', marginBottom: '1rem' }}>🔄 Continuous Refinement</h4>
            <p>Consistency validation happens continuously throughout the development process, not as one-time quality gates.</p>
          </div>
          <div style={{ background: 'rgba(128, 90, 213, 0.1)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #8052d3' }}>
            <h4 style={{ color: '#8052d3', marginBottom: '1rem' }}>🔬 Research-Driven Context</h4>
            <p>Research agents gather technical context throughout the process, informing decisions with up-to-date information.</p>
          </div>
          <div style={{ background: 'rgba(245, 101, 101, 0.1)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #f56565' }}>
            <h4 style={{ color: '#f56565', marginBottom: '1rem' }}>↔️ Bidirectional Feedback</h4>
            <p>Production reality and user feedback continuously inform and improve specification evolution.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Leverage Google Gemini CLI to Generate the Spec-Kit Output</h3>
        <div className="step">
          <div className="step-content">
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <img src="gemini-cli-image.png" alt="Google Gemini CLI Large Context Window" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1rem' }} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{ color: '#667eea', marginBottom: '0.5rem' }}>🚀 Why Gemini CLI for Spec-Kit Output Generation</h5>
              <p style={{ lineHeight: '1.6', margin: 0 }}>Google Gemini CLI's massive context window (up to 1M tokens) enables comprehensive generation of spec-kit artifacts, making it ideal for producing high-quality specifications, implementation plans, and analysis outputs.</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{ color: '#48bb78', marginBottom: '0.5rem' }}>🎯 Comprehensive Spec-Kit Output Generation</h5>
              <ul style={{ textAlign: 'left', lineHeight: '1.8', margin: 0, paddingLeft: '1.5rem', color: '#2d3748' }}>
                <li style={{ marginBottom: '0.5rem', color: '#2d3748' }}><strong>Complete Constitution Generation:</strong> Generate comprehensive constitutional documents with all principles, guidelines, and compliance requirements in a single pass</li>
                <li style={{ marginBottom: '0.5rem', color: '#2d3748' }}><strong>Comprehensive Specification Generation:</strong> Produce detailed PRDs with user stories, acceptance criteria, technical constraints, and success metrics from minimal input</li>
                <li style={{ marginBottom: '0.5rem', color: '#2d3748' }}><strong>Full Implementation Plan Generation:</strong> Create complete technical architectures, data models, API contracts, testing strategies, and deployment approaches from specifications</li>
                <li style={{ marginBottom: '0.5rem', color: '#2d3748' }}><strong>Cross-Artifact Consistency:</strong> Ensure generated specifications, plans, and analysis maintain consistency across entire project scope</li>
                <li style={{ marginBottom: '0.5rem', color: '#2d3748' }}><strong>Research-Driven Generation:</strong> Incorporate multiple research sources, findings, and technical documentation into comprehensive spec-kit outputs</li>
              </ul>
            </div>

            </div>
        </div>
      </div>
    </div>
  )
}

export default OverviewSection