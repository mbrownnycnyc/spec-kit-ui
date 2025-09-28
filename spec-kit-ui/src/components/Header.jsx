import React from 'react'

const Header = ({ sections, activeSection, setActiveSection, isDarkTheme, toggleTheme }) => {
  return (
    <header>
      <h1>Spec Kit UI</h1>
      <p className="subtitle">Master the art of specification-first software development</p>

      <nav>
        {sections.map(section => (
          <button
            key={section.id}
            className={`nav-button ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.icon} {section.label}
          </button>
        ))}
      </nav>

      <button
        onClick={toggleTheme}
        className="theme-toggle"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'none',
          border: '2px solid #667eea',
          borderRadius: '8px',
          padding: '8px 16px',
          cursor: 'pointer',
          fontSize: '1rem',
          color: isDarkTheme ? '#fff' : '#667eea',
          transition: 'all 0.3s ease'
        }}
      >
        {isDarkTheme ? '☀️ Light' : '🌙 Dark'}
      </button>
    </header>
  )
}

export default Header