import React from 'react'
import '../App.css'

const SubagentLibrarySection = () => {
  return (
    <div className="content-section active">
      <div className="card">
        <h3>Subagent Library</h3>
        <p>Pre-built subagents for common development tasks and workflows.</p>
      </div>




      <div className="card">
        <h4>Code Review Subagent</h4>
        <div style={{ background: 'rgba(72, 187, 120, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#48bb78', marginBottom: '1rem' }}>🤔 Why This Subagent Matters</h4>
          <p style={{ textAlign: 'left', lineHeight: '1.8', margin: 0, color: '#2d3748' }}>This subagent automates comprehensive code reviews by analyzing code quality, security vulnerabilities, performance issues, and adherence to best practices. It reduces the manual burden of code reviews while maintaining high standards and providing consistent feedback across your codebase.</p>
        </div>
        <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#ec4899', marginBottom: '1rem' }}>🔄 When to Use This Subagent</h4>
          <p style={{ textAlign: 'left', lineHeight: '1.8', margin: 0, color: '#2d3748' }}>Use this subagent when you need to:</p>
          <ul style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem', margin: '0.5rem 0', color: '#2d3748' }}>
            <li><strong>Review pull requests:</strong> Automated analysis before manual review</li>
            <li><strong>Check code quality:</strong> Identify potential issues and improvements</li>
            <li><strong>Security assessment:</strong> Scan for common vulnerabilities and patterns</li>
            <li><strong>Performance analysis:</strong> Identify bottlenecks and optimization opportunities</li>
            <li><strong>Compliance checking:</strong> Ensure adherence to coding standards and guidelines</li>
          </ul>
        </div>
        <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>🎯 What to Do Next</h4>
          <ol style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem', margin: 0 }} className="text-dark">
            <li>Build the subagent using the configuration below</li>
            <li>Integrate it into your CI/CD pipeline for automated reviews</li>
            <li>Customize the review criteria based on your project requirements</li>
            <li>Set up automated notifications for review findings</li>
            <li>Monitor and refine the subagent's performance over time</li>
          </ol>
        </div>
        <div className="example-code">{`Create a code review subagent that analyzes:

**Code Quality Analysis:**
- Syntax and linting issues
- Code complexity and maintainability
- Duplicate code detection
- Code formatting and style consistency
- Documentation completeness

**Security Review:**
- Common vulnerability patterns (OWASP Top 10)
- Input validation and sanitization
- Authentication and authorization checks
- Sensitive data exposure risks
- Dependency security scanning

**Performance Assessment:**
- Algorithm efficiency analysis
- Resource usage optimization
- Database query optimization
- Memory leak detection
- Scalability considerations

**Best Practices Compliance:**
- Framework-specific patterns
- Design pattern implementation
- Error handling completeness
- Testing coverage analysis
- Configuration management

The subagent should provide:
- Detailed findings with severity levels
- Specific code location references
- Recommended fixes with examples
- Automated fix suggestions where possible
- Summary reports and metrics`}</div>
        <button className="btn" onClick={() => {
          const templateText = `Create a code review subagent that analyzes:

**Code Quality Analysis:**
- Syntax and linting issues
- Code complexity and maintainability
- Duplicate code detection
- Code formatting and style consistency
- Documentation completeness

**Security Review:**
- Common vulnerability patterns (OWASP Top 10)
- Input validation and sanitization
- Authentication and authorization checks
- Sensitive data exposure risks
- Dependency security scanning

**Performance Assessment:**
- Algorithm efficiency analysis
- Resource usage optimization
- Database query optimization
- Memory leak detection
- Scalability considerations

**Best Practices Compliance:**
- Framework-specific patterns
- Design pattern implementation
- Error handling completeness
- Testing coverage analysis
- Configuration management

The subagent should provide:
- Detailed findings with severity levels
- Specific code location references
- Recommended fixes with examples
- Automated fix suggestions where possible
- Summary reports and metrics`;
          navigator.clipboard.writeText(templateText);
        }}>Copy Template</button>
      </div>

      <div className="card">
        <h4>Documentation Generation Subagent</h4>
        <div style={{ background: 'rgba(72, 187, 120, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#48bb78', marginBottom: '1rem' }}>🤔 Why This Subagent Matters</h4>
          <p style={{ textAlign: 'left', lineHeight: '1.8', margin: 0, color: '#2d3748' }}>This subagent automatically generates comprehensive documentation from your codebase, including API docs, user guides, and technical documentation. It ensures documentation stays synchronized with code changes and reduces the manual effort of maintaining documentation.</p>
        </div>
        <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#ec4899', marginBottom: '1rem' }}>🔄 When to Use This Subagent</h4>
          <p style={{ textAlign: 'left', lineHeight: '1.8', margin: 0, color: '#2d3748' }}>Use this subagent when you need to:</p>
          <ul style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem', margin: '0.5rem 0', color: '#2d3748' }}>
            <li><strong>Generate API documentation:</strong> Auto-create docs from code annotations</li>
            <li><strong>Create user guides:</strong> Produce step-by-step instructions</li>
            <li><strong>Maintain technical docs:</strong> Keep architecture docs up-to-date</li>
            <li><strong>Document new features:</strong> Auto-generate release notes</li>
            <li><strong>Onboard new developers:</strong> Provide comprehensive project documentation</li>
          </ul>
        </div>
        <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>🎯 What to Do Next</h4>
          <ol style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem', margin: 0 }} className="text-dark">
            <li>Build the subagent using the specification below</li>
            <li>Configure it to scan your codebase automatically</li>
            <li>Set up scheduled documentation updates</li>
            <li>Integrate with your documentation platform</li>
            <li>Review and customize generated documentation quality</li>
          </ol>
        </div>

        <div className="example-code">{`Create a documentation generation subagent that:

**Analyzes Code Structure:**
- Extracts function signatures and parameters
- Identifies classes, modules, and components
- Maps dependencies and relationships
- Detects configuration files and settings
- Scans for existing documentation comments

**Generates API Documentation:**
- Creates endpoint documentation from routes
- Documents request/response schemas
- Generates parameter descriptions
- Includes authentication requirements
- Provides example requests and responses

**Creates User Guides:**
- Writes installation and setup instructions
- Generates getting started tutorials
- Creates configuration guides
- Documents common workflows
- Provides troubleshooting sections

**Produces Technical Documentation:**
- Architecture overview and diagrams
- Database schema documentation
- Development setup instructions
- Deployment procedures
- Testing and validation guides

**Maintains Consistency:**
- Follows documentation templates
- Ensures consistent formatting
- Validates generated content
- Updates existing docs when code changes
- Flags incomplete or outdated documentation`}</div>

        <button className="btn" onClick={() => {
          const templateText = `Create a documentation generation subagent that:

**Analyzes Code Structure:**
- Extracts function signatures and parameters
- Identifies classes, modules, and components
- Maps dependencies and relationships
- Detects configuration files and settings
- Scans for existing documentation comments

**Generates API Documentation:**
- Creates endpoint documentation from routes
- Documents request/response schemas
- Generates parameter descriptions
- Includes authentication requirements
- Provides example requests and responses

**Creates User Guides:**
- Writes installation and setup instructions
- Generates getting started tutorials
- Creates configuration guides
- Documents common workflows
- Provides troubleshooting sections

**Produces Technical Documentation:**
- Architecture overview and diagrams
- Database schema documentation
- Development setup instructions
- Deployment procedures
- Testing and validation guides

**Maintains Consistency:**
- Follows documentation templates
- Ensures consistent formatting
- Validates generated content
- Updates existing docs when code changes
- Flags incomplete or outdated documentation`;
          navigator.clipboard.writeText(templateText);
        }}>Copy Template</button>
      </div>

      <div className="card">
        <h4>Test Generation Subagent</h4>
        <div style={{ background: 'rgba(72, 187, 120, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#48bb78', marginBottom: '1rem' }}>🤔 Why This Subagent Matters</h4>
          <p style={{ textAlign: 'left', lineHeight: '1.8', margin: 0, color: '#2d3748' }}>This subagent automatically generates comprehensive tests including unit tests, integration tests, and end-to-end tests. It ensures high test coverage while reducing the manual effort of writing tests and helps maintain code quality and reliability.</p>
        </div>
        <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#ec4899', marginBottom: '1rem' }}>🔄 When to Use This Subagent</h4>
          <p style={{ textAlign: 'left', lineHeight: '1.8', margin: 0, color: '#2d3748' }}>Use this subagent when you need to:</p>
          <ul style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem', margin: '0.5rem 0', color: '#2d3748' }}>
            <li><strong>Generate unit tests:</strong> Create tests for individual functions and methods</li>
            <li><strong>Create integration tests:</strong> Test component interactions and workflows</li>
            <li><strong>Build E2E tests:</strong> Automate user journey testing</li>
            <li><strong>Increase coverage:</strong> Improve test coverage across the codebase</li>
            <li><strong>Maintain test suites:</strong> Update tests when code changes</li>
          </ul>
        </div>
        <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>🎯 What to Do Next</h4>
          <ol style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem', margin: 0 }} className="text-dark">
            <li>Build the subagent using the specification below</li>
            <li>Configure it to work with your testing framework</li>
            <li>Set up automated test generation on code changes</li>
            <li>Integrate with your CI/CD pipeline</li>
            <li>Monitor test quality and coverage metrics</li>
          </ol>
        </div>

        <div className="example-code">{`Create a test generation subagent that:

**Analyzes Code for Testing:**
- Identifies functions, classes, and modules needing tests
- Maps code paths and edge cases
- Detects existing test coverage gaps
- Analyzes function signatures and return types
- Identifies dependencies and mocking requirements

**Generates Unit Tests:**
- Creates tests for individual functions and methods
- Generates test cases for edge cases and boundaries
- Includes positive and negative test scenarios
- Adds parameter validation tests
- Creates mock objects for dependencies

**Creates Integration Tests:**
- Tests component interactions
- Validates API endpoints and database operations
- Tests authentication and authorization flows
- Validates configuration and environment setup
- Tests error handling and recovery scenarios

**Builds E2E Tests:**
- Creates user journey simulations
- Tests complete workflows from start to finish
- Includes browser automation tests
- Tests responsive design and mobile scenarios
- Validates performance and accessibility

**Ensures Test Quality:**
- Generates descriptive test names and documentation
- Includes setup and teardown procedures
- Adds assertions with meaningful messages
- Creates test data fixtures and helpers
- Validates test reliability and flakiness`}</div>

        <button className="btn" onClick={() => {
          const templateText = `Create a test generation subagent that:

**Analyzes Code for Testing:**
- Identifies functions, classes, and modules needing tests
- Maps code paths and edge cases
- Detects existing test coverage gaps
- Analyzes function signatures and return types
- Identifies dependencies and mocking requirements

**Generates Unit Tests:**
- Creates tests for individual functions and methods
- Generates test cases for edge cases and boundaries
- Includes positive and negative test scenarios
- Adds parameter validation tests
- Creates mock objects for dependencies

**Creates Integration Tests:**
- Tests component interactions
- Validates API endpoints and database operations
- Tests authentication and authorization flows
- Validates configuration and environment setup
- Tests error handling and recovery scenarios

**Builds E2E Tests:**
- Creates user journey simulations
- Tests complete workflows from start to finish
- Includes browser automation tests
- Tests responsive design and mobile scenarios
- Validates performance and accessibility

**Ensures Test Quality:**
- Generates descriptive test names and documentation
- Includes setup and teardown procedures
- Adds assertions with meaningful messages
- Creates test data fixtures and helpers
- Validates test reliability and flakiness`;
          navigator.clipboard.writeText(templateText);
        }}>Copy Template</button>
      </div>
    </div>
  )
}

export default SubagentLibrarySection