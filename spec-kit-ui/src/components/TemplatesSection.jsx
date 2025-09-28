import React from 'react'
import '../App.css'

const TemplatesSection = () => {
  return (
    <div className="content-section active">
      <div className="card">
        <h3>SDD Templates and Examples</h3>
        <p>Ready-to-use templates for your Spec-Driven Development workflow.</p>
      </div>

      <div className="card">
        <h4>Feature Specification Template</h4>
        <div style={{ background: 'rgba(72, 187, 120, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#48bb78', marginBottom: '1rem' }}>🤔 Why This Template Matters</h4>
          <p style={{ textAlign: 'left', lineHeight: '1.8', margin: 0, color: '#2d3748' }}>Feature specifications are the foundation of Spec-Driven Development. They provide clear, unambiguous requirements that guide implementation and ensure all stakeholders have a shared understanding of what needs to be built.</p>
        </div>
        <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>🎯 What to Do Next</h4>
          <ol style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem', margin: 0 }} className="text-dark">
            <li>Copy this template and customize it for your specific feature</li>
            <li>Use it with the <code>/specify</code> command to start the specification-driven development process</li>
            <li>Replace all placeholders with your specific requirements and constraints</li>
            <li>Review and refine the specification until all [NEEDS CLARIFICATION] markers are resolved</li>
          </ol>
        </div>

        <div className="example-code">{`# Feature Specification: [Feature Name]

## Overview
[High-level description of the feature and its purpose]

## User Stories
### Primary User Story
As a [user type], I want to [action] so that [benefit].

**Acceptance Criteria:**
- [ ] Given [context], when [action], then [outcome]
- [ ] [Additional criteria]

### Secondary User Stories
- As a [user type], I want to [action] so that [benefit]

## Non-Functional Requirements
### Performance
- [ ] Response time less than target
- [ ] Support target concurrent users

### Security
- [ ] [Authentication requirement]
- [ ] [Authorization requirement]

### Usability
- [ ] [Usability requirement]

## Integration Requirements
- [ ] Integration with [existing system]
- [ ] API compatibility with [external service]

## Constraints
- [ ] Technology constraint
- [ ] Business constraint
- [ ] Regulatory constraint

## Success Metrics
- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]

## Open Questions
[NEEDS CLARIFICATION: Question 1]
[NEEDS CLARIFICATION: Question 2]

---
*This specification follows the SDD methodology and constitutional principles.*`}</div>

        <button className="btn" onClick={() => {
          const templateText = `# Feature Specification: [Feature Name]

## Overview
[High-level description of the feature and its purpose]

## User Stories
### Primary User Story
As a [user type], I want to [action] so that [benefit].

**Acceptance Criteria:**
- [ ] Given [context], when [action], then [outcome]
- [ ] [Additional criteria]

### Secondary User Stories
- As a [user type], I want to [action] so that [benefit]

## Non-Functional Requirements
### Performance
- [ ] Response time less than target
- [ ] Support target concurrent users

### Security
- [ ] [Authentication requirement]
- [ ] [Authorization requirement]

### Usability
- [ ] [Usability requirement]

## Integration Requirements
- [ ] Integration with [existing system]
- [ ] API compatibility with [external service]

## Constraints
- [ ] Technology constraint
- [ ] Business constraint
- [ ] Regulatory constraint

## Success Metrics
- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]

## Open Questions
[NEEDS CLARIFICATION: Question 1]
[NEEDS CLARIFICATION: Question 2]

---
*This specification follows the SDD methodology and constitutional principles.*`;
          navigator.clipboard.writeText(templateText);
        }}>Copy Template</button>
      </div>

      <div className="card">
        <h4>Implementation Plan Template</h4>
        <div style={{ background: 'rgba(72, 187, 120, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#48bb78', marginBottom: '1rem' }}>🤔 Why This Template Matters</h4>
          <p style={{ textAlign: 'left', lineHeight: '1.8', margin: 0, color: '#2d3748' }}>Implementation plans bridge the gap between specification and code. They provide technical guidance, architecture decisions, and a clear roadmap for developers while ensuring constitutional compliance throughout the development process.</p>
        </div>
        <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>🎯 What to Do Next</h4>
          <ol style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem', margin: 0 }} className="text-dark">
            <li>Copy this template and customize it for your project</li>
            <li>Use it with the <code>/plan</code> command to generate detailed technical tasks and implementation steps</li>
            <li>Ensure all constitutional gates are satisfied before proceeding</li>
            <li>Follow the task execution order to maintain constitutional compliance</li>
          </ol>
        </div>

        <div className="example-code">{`# Implementation Plan: [Project Name]

## Phase -1: Pre-Implementation Gates
### Simplicity Gate (Article VII)
- [ ] Using ≤3 projects?
- [ ] No future-proofing?

### Anti-Abstraction Gate (Article VIII)
- [ ] Using framework directly?
- [ ] Single model representation?

### Integration-First Gate (Article IX)
- [ ] Contracts defined?
- [ ] Contract tests written?

## Phase 0: Foundation Setup
### Project Structure
project/
├── packages/
│   ├── feature-library/     # Main feature implementation
│   ├── cli-interface/       # CLI interface for the feature
│   └── test-suite/          # Integration and contract tests
└── contracts/              # API contracts and schemas

### Technology Stack
- **Frontend:** [Technology choice and rationale]
- **Backend:** [Technology choice and rationale]
- **Database:** [Technology choice and rationale]
- **Testing:** [Testing framework and rationale]

## Phase 1: Contract Definition
### API Contracts
- [ ] Define REST/OpenAPI specifications
- [ ] Create data model schemas
- [ ] Write contract tests

### Data Model
- [ ] Entity relationship design
- [ ] Database schema definition
- [ ] Data validation rules

## Phase 2: Library Development
### Core Library Implementation
- [ ] Implement core business logic
- [ ] Create CLI interface
- [ ] Write comprehensive tests

### Integration Layer
- [ ] Implement API endpoints
- [ ] Create authentication layer
- [ ] Add error handling

## Phase 3: Application Integration
### Frontend Integration
- [ ] Create UI components
- [ ] Implement state management
- [ ] Add user interactions

### Deployment Setup
- [ ] Configure CI/CD pipeline
- [ ] Set up monitoring
- [ ] Create documentation

## Testing Strategy
### Test Types
- **Contract Tests:** Ensure API compliance
- **Integration Tests:** Verify system interactions
- **E2E Tests:** Validate user workflows
- **Unit Tests:** Test individual components

### Test Coverage Goals
- Unit tests: ≥90% coverage
- Integration tests: All critical paths
- E2E tests: Key user workflows

## Success Criteria
- [ ] All tests passing
- [ ] Performance targets met
- [ ] Security requirements satisfied
- [ ] Documentation complete

## Complexity Tracking
*Document any justified complexity with clear rationale*`}</div>

        <button className="btn" onClick={() => {
          const templateText = `# Implementation Plan: [Project Name]

## Phase -1: Pre-Implementation Gates
### Simplicity Gate (Article VII)
- [ ] Using ≤3 projects?
- [ ] No future-proofing?

### Anti-Abstraction Gate (Article VIII)
- [ ] Using framework directly?
- [ ] Single model representation?

### Integration-First Gate (Article IX)
- [ ] Contracts defined?
- [ ] Contract tests written?

## Phase 0: Foundation Setup
### Project Structure
project/
├── packages/
│   ├── feature-library/     # Main feature implementation
│   ├── cli-interface/       # CLI interface for the feature
│   └── test-suite/          # Integration and contract tests
└── contracts/              # API contracts and schemas

### Technology Stack
- **Frontend:** [Technology choice and rationale]
- **Backend:** [Technology choice and rationale]
- **Database:** [Technology choice and rationale]
- **Testing:** [Testing framework and rationale]

## Phase 1: Contract Definition
### API Contracts
- [ ] Define REST/OpenAPI specifications
- [ ] Create data model schemas
- [ ] Write contract tests

### Data Model
- [ ] Entity relationship design
- [ ] Database schema definition
- [ ] Data validation rules

## Phase 2: Library Development
### Core Library Implementation
- [ ] Implement core business logic
- [ ] Create CLI interface
- [ ] Write comprehensive tests

### Integration Layer
- [ ] Implement API endpoints
- [ ] Create authentication layer
- [ ] Add error handling

## Phase 3: Application Integration
### Frontend Integration
- [ ] Create UI components
- [ ] Implement state management
- [ ] Add user interactions

### Deployment Setup
- [ ] Configure CI/CD pipeline
- [ ] Set up monitoring
- [ ] Create documentation

## Testing Strategy
### Test Types
- **Contract Tests:** Ensure API compliance
- **Integration Tests:** Verify system interactions
- **E2E Tests:** Validate user workflows
- **Unit Tests:** Test individual components

### Test Coverage Goals
- Unit tests: ≥90% coverage
- Integration tests: All critical paths
- E2E tests: Key user workflows

## Success Criteria
- [ ] All tests passing
- [ ] Performance targets met
- [ ] Security requirements satisfied
- [ ] Documentation complete

## Complexity Tracking
*Document any justified complexity with clear rationale*`;
          navigator.clipboard.writeText(templateText);
        }}>Copy Template</button>
      </div>

      <div className="card">
        <h4>Constitutional Compliance Checklist</h4>
        <div style={{ background: 'rgba(72, 187, 120, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#48bb78', marginBottom: '1rem' }}>🤔 Why This Template Matters</h4>
          <p style={{ textAlign: 'left', lineHeight: '1.8', margin: 0, color: '#2d3748' }}>The Constitution ensures your implementations follow Spec-Driven Development principles consistently. This checklist validates compliance with core tenets like library-first development, CLI accessibility, test-first implementation, and simplicity.</p>
        </div>
        <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#ec4899', marginBottom: '1rem' }}>🔄 When to Change Your Constitution</h4>
          <p style={{ textAlign: 'left', lineHeight: '1.8', margin: 0, color: '#2d3748' }}>Different constitutions should be used when applications have distinct:</p>
          <ul style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem', margin: '0.5rem 0', color: '#2d3748' }}>
            <li><strong>Purpose or Domain:</strong> Unique goals, like gaming vs. e-commerce, requiring specific principles</li>
            <li><strong>Architecture:</strong> Different patterns, e.g., MVVM vs. Clean Architecture</li>
            <li><strong>Technical Requirements:</strong> Varying APIs, libraries, or performance needs</li>
            <li><strong>UI/UX Standards:</strong> Custom branding or design guidelines</li>
            <li><strong>Team Practices:</strong> Unique coding standards, testing, or deployment processes</li>
            <li><strong>Constraints:</strong> Specific device support, offline modes, or security needs</li>
          </ul>
          <p style={{ textAlign: 'left', lineHeight: '1.8', margin: '0.5rem 0 0 0', color: '#2d3748' }}>Use a new constitution per app unless they share identical conventions.</p>
        </div>
        <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>🎯 What to Do Next</h4>
          <ol style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem', margin: 0 }} className="text-dark">
            <li>Use this checklist during implementation planning and review</li>
            <li>Each article represents a constitutional principle that must be satisfied or properly justified</li>
            <li>Document any exceptions with clear justifications</li>
            <li>Review compliance regularly throughout the development process</li>
          </ol>
        </div>
        <div className="example-code">{`# Constitutional Compliance Checklist

## Article I: Library-First Principle
- [ ] Feature implemented as standalone library
- [ ] Clear separation between library and application
- [ ] Minimal external dependencies
- [ ] Well-defined public API

## Article II: CLI Interface Mandate
- [ ] All functionality accessible via CLI
- [ ] Text-based input/output supported
- [ ] JSON format available for structured data
- [ ] CLI commands documented and tested

## Article III: Test-First Imperative
- [ ] Tests written before implementation
- [ ] All tests fail initially (Red phase)
- [ ] Implementation makes tests pass (Green phase)
- [ ] Test coverage meets requirements

## Article VII: Simplicity Principle
- [ ] Maximum 3 projects for initial implementation
- [ ] No future-proofing or over-engineering
- [ ] Simple, straightforward solutions preferred
- [ ] Complexity properly justified

## Article VIII: Anti-Abstraction Principle
- [ ] Using framework features directly
- [ ] No unnecessary abstraction layers
- [ ] Single model representation
- [ ] Framework conventions followed

## Article IX: Integration-First Testing
- [ ] Using real databases over mocks
- [ ] Actual service instances in tests
- [ ] Contract tests before implementation
- [ ] Realistic test environments

## Overall Compliance
- [ ] All applicable articles satisfied
- [ ] Justifications documented for exceptions
- [ ] Constitutional principles followed
- [ ] Quality gates passed`}</div>
        <button className="btn" onClick={() => {
          const templateText = `# Constitutional Compliance Checklist

## Article I: Library-First Principle
- [ ] Feature implemented as standalone library
- [ ] Clear separation between library and application
- [ ] Minimal external dependencies
- [ ] Well-defined public API

## Article II: CLI Interface Mandate
- [ ] All functionality accessible via CLI
- [ ] Text-based input/output supported
- [ ] JSON format available for structured data
- [ ] CLI commands documented and tested

## Article III: Test-First Imperative
- [ ] Tests written before implementation
- [ ] All tests fail initially (Red phase)
- [ ] Implementation makes tests pass (Green phase)
- [ ] Test coverage meets requirements

## Article VII: Simplicity Principle
- [ ] Maximum 3 projects for initial implementation
- [ ] No future-proofing or over-engineering
- [ ] Simple, straightforward solutions preferred
- [ ] Complexity properly justified

## Article VIII: Anti-Abstraction Principle
- [ ] Using framework features directly
- [ ] No unnecessary abstraction layers
- [ ] Single model representation
- [ ] Framework conventions followed

## Article IX: Integration-First Testing
- [ ] Using real databases over mocks
- [ ] Actual service instances in tests
- [ ] Contract tests before implementation
- [ ] Realistic test environments

## Overall Compliance
- [ ] All applicable articles satisfied
- [ ] Justifications documented for exceptions
- [ ] Constitutional principles followed
- [ ] Quality gates passed`;
          navigator.clipboard.writeText(templateText);
        }}>Copy Checklist</button>
      </div>
    </div>
  )
}

export default TemplatesSection