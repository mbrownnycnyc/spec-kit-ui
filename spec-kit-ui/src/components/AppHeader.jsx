const AppHeader = ({ activeSection, setActiveSection, navigationSections, toggleTheme, isDarkTheme }) => {
  return (
    <header>
      <h1>Spec Kit UI</h1>
      <p className="subtitle">Master the art of specification-first software development</p>
      <nav>
        {navigationSections.map(section => (
          <button
            key={section.id}
            className={`nav-button ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.icon} {section.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

export default AppHeader