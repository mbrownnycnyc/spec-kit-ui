import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('overview')
  const [promptVariables, setPromptVariables] = useState({})
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [specEarFierGeneratedPrompt, setSpecEarFierGeneratedPrompt] = useState('')
  const [promptGeneratorGeneratedPrompt, setPromptGeneratorGeneratedPrompt] = useState('')
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  // Theme toggle effect
  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
  }, [isDarkTheme])

  // Theme toggle function
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
  }

  // Spec-ear-fier state
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [recognition, setRecognition] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const transcriptDebounceRef = useRef(null)
  const [doNotSave, setDoNotSave] = useState(false)
  const [saveButtonState, setSaveButtonState] = useState('normal') // 'normal', 'saved', 'saving'
  const [tutorialProgress, setTutorialProgress] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([false, false, false, false, false, false, false])
  const [expandedStep, setExpandedStep] = useState(null)
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [expandedTemplates, setExpandedTemplates] = useState([true, true, true, true]) // All templates expanded by default
  const [generatingPrompt, setGeneratingPrompt] = useState(false)
  const [generateSuccess, setGenerateSuccess] = useState(false)

  // Tutorial player state
  const [activeTutorial, setActiveTutorial] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [tutorialCompleted, setTutorialCompleted] = useState(false)
  const [exerciseAnswers, setExerciseAnswers] = useState({})
  const [showTutorialPlayer, setShowTutorialPlayer] = useState(false)
  const [mediaLoaded, setMediaLoaded] = useState({})

  // Skill assessment and adaptive learning state
  const [userSkillLevel, setUserSkillLevel] = useState(null)
  const [showSkillAssessment, setShowSkillAssessment] = useState(false)
  const [assessmentAnswers, setAssessmentAnswers] = useState({})
  const [recommendedTutorials, setRecommendedTutorials] = useState([])

  // Progress tracking and achievement system
  const [userProgress, setUserProgress] = useState({})
  const [achievements, setAchievements] = useState([])
  const [showAchievementsModal, setShowAchievementsModal] = useState(false)
  const [showAchievementNotifications, setShowAchievementNotifications] = useState(false)
  const [totalPoints, setTotalPoints] = useState(0)
  const [streakDays, setStreakDays] = useState(0)
  const [lastActivityDate, setLastActivityDate] = useState(null)

  // Community and collaboration features
  const [showCommunityModal, setShowCommunityModal] = useState(false)
  const [communityPosts, setCommunityPosts] = useState([])
  const [newPostContent, setNewPostContent] = useState('')
  const [activeCommunityTab, setActiveCommunityTab] = useState('discussions')
  const [peerReviews, setPeerReviews] = useState([])
  const [userReputation, setUserReputation] = useState(0)
  const [showCreatePost, setShowCreatePost] = useState(false)

  // Markdown renderer component with proper styling
  const MarkdownRenderer = ({ content }) => (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Customize code block rendering
          code({ inline, children, ...props }) {
            return !inline ? (
              <div className="example-code">
                <code {...props}>{children}</code>
              </div>
            ) : (
              <code style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
                padding: '0.2em 0.4em',
                borderRadius: '3px',
                fontSize: '0.9em'
              }} {...props}>
                {children}
              </code>
            )
          },
          // Style headers
          h1: ({ children }) => <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>{children}</h3>,
          h2: ({ children }) => <h4 style={{ color: '#4a5568', marginBottom: '0.75rem' }}>{children}</h4>,
          h3: ({ children }) => <h5 style={{ color: '#718096', marginBottom: '0.5rem' }}>{children}</h5>,
          // Style lists
          ul: ({ children }) => <ul style={{ textAlign: 'left', paddingLeft: '1.5rem', marginBottom: '1rem' }} className="text-dark">{children}</ul>,
          ol: ({ children }) => <ol style={{ textAlign: 'left', paddingLeft: '1.5rem', marginBottom: '1rem' }} className="text-dark">{children}</ol>,
          li: ({ children }) => <li style={{ marginBottom: '0.5rem', lineHeight: '1.6' }}>{children}</li>,
          // Style paragraphs
          p: ({ children }) => <p style={{ marginBottom: '1rem', lineHeight: '1.6' }} className="text-dark">{children}</p>,
          // Style blockquotes
          blockquote: ({ children }) => (
            <blockquote style={{
              borderLeft: '4px solid #667eea',
              paddingLeft: '1rem',
              margin: '1rem 0',
              fontStyle: 'italic',
              color: '#4a5568'
            }}>
              {children}
            </blockquote>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )

  // Navigation sections
  const sections = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'spec-ear-fier', label: 'Spec-ear-fier', icon: '🎙️' },
    { id: 'prompts', label: 'Prompt Generator', icon: '🎯' },
    { id: 'templates', label: 'Templates', icon: '📝' }
  ]

  // SDD workflow steps
  const sddSteps = [
    {
      title: 'Initialize Project Structure',
      description: 'Create the initial project structure using the spec-kit command',
      details: 'Use the spec-kit tool to instantiate a new Spec-Driven Development project with all the necessary directories and files.',
      command: 'uvx --from git+https://github.com/github/spec-kit.git specify init <PROJECT_NAME>',
      why: 'The spec-kit command creates the foundational structure for SDD projects, including the specification directory, constitution template, and initial configuration files.',
      what: 'Run the spec-kit command to create a new project directory with the proper SDD structure, including memory/, specs/, and other essential directories.',
      scope: 'Run this command once when starting a new project. This will create the complete project structure in the specified directory.',
      examples: [
        'Initialize new project: uvx --from git+https://github.com/github/spec-kit.git specify init my-project',
        'Initialize with custom name: uvx --from git+https://github.com/github/spec-kit.git specify init awesome-feature'
      ]
    },
    {
      title: '1. Establish Constitution',
      description: 'Create your project\'s governing principles and development guidelines',
      details: 'Set up the constitutional framework that will guide all development decisions and ensure consistency throughout the project lifecycle.',
      command: '/constitution',
      why: 'The constitution serves as the foundation for all development decisions, ensuring consistent quality, testing standards, and adherence to SDD principles.',
      what: 'Create a comprehensive constitution with principles focused on code quality, testing standards, user experience consistency, and performance requirements.',
      scope: 'Run /constitution once at project start to establish your project\'s constitutional framework.',
      examples: [
        'Create new constitution: /constitution Create principles focused on code quality, testing standards, user experience consistency, and performance requirements'
      ]
    },
    {
      title: '1. Feature Specification',
      description: 'Define what you want to build with comprehensive requirements',
      details: 'Transform your ideas into detailed, executable specifications that focus on the "what" and "why", not the tech stack.',
      command: '/specify [your feature description]',
      why: 'Specifications are the foundation of SDD. They serve as the primary artifact that guides all development activities, ensuring clarity and completeness before any code is written.',
      what: 'Create a comprehensive Product Requirements Document (PRD) that includes user stories, acceptance criteria, technical constraints, and success metrics.',
      scope: 'Run /specify once for each major feature or user story. Be as explicit as possible about what you are trying to build and why.',
      examples: [
        'Simple feature: /specify User authentication system with email and password login',
        'Complex feature: /specify Build a team productivity platform with projects, task management, and Kanban boards',
        'Real-world example: /specify Develop Taskify, a team productivity platform. It should allow users to create projects, add team members, assign tasks, comment and move tasks between boards in Kanban style...'
      ]
    },
    {
      title: '2. Specification Clarification',
      description: 'Refine requirements and resolve ambiguities before planning',
      details: 'Use structured clarification to identify underspecified areas and ensure complete requirements before technical planning.',
      command: '/clarify [specification areas to clarify]',
      why: 'Clarification reduces rework downstream by ensuring all requirements are well-understood before technical decisions are made.',
      what: 'Go through the specification systematically, asking questions to identify missing details, conflicting requirements, or unclear functionality.',
      scope: 'Run /clarify after creating the initial specification but before /plan. This is required unless explicitly skipped for exploratory work.',
      examples: [
        'General clarification: /clarify Review the specification and identify areas that need more detail',
        'Specific focus: /clarify Focus on the user interface requirements and interaction patterns',
        'Free-form refinement: For each sample project, there should be a variable number of tasks between 5 and 15 tasks for each one randomly distributed into different states of completion'
      ]
    },
    {
      title: '3. Implementation Planning',
      description: 'Create detailed technical plans with your chosen tech stack',
      details: 'Convert specifications into actionable technical plans including architecture, data models, APIs, and deployment strategy.',
      command: '/plan [technology choices and architectural decisions]',
      why: 'A solid technical plan ensures architectural consistency, identifies potential challenges early, and provides a roadmap for implementation.',
      what: 'Create a comprehensive technical plan including technology stack, architecture decisions, data models, API contracts, testing strategy, and deployment approach.',
      scope: 'Run /plan once for each clarified specification. Be specific about technology choices and constraints.',
      examples: [
        'Web application: /plan React frontend with Node.js backend, PostgreSQL database, using Express.js',
        'Real-world example: /plan We are going to generate this using .NET Aspire, using Postgres as the database. The frontend should use Blazor server with drag-and-drop task boards, real-time updates.',
        'Mobile app: /plan React Native app with Firebase backend and offline synchronization'
      ]
    },
    {
      title: '4. Task Generation',
      description: 'Break down plans into executable tasks with dependencies',
      details: 'Convert implementation plans into prioritized, actionable tasks with clear dependencies and acceptance criteria.',
      command: '/tasks',
      why: 'Task generation transforms high-level plans into manageable work items, making progress trackable and ensuring nothing is missed during implementation.',
      what: 'Generate a prioritized list of executable tasks with dependencies, time estimates, and clear acceptance criteria for each work item.',
      scope: 'Run /tasks once for each implementation plan. This creates tasks.md with independent tasks marked [P], dependency chains, and parallelization groups.',
      examples: [
        'Basic task generation: /tasks',
        'Component-focused: /tasks --component database',
        'Phase-based: /tasks --phase foundation'
      ]
    },
    {
      title: '5. Implementation',
      description: 'Execute all tasks to build the feature according to the plan',
      details: 'Implement the solution by executing tasks in order, following constitutional principles and test-first development.',
      command: '/implement',
      why: 'Following constitutional principles ensures high-quality, maintainable code that emphasizes simplicity, testability, and integration-first development.',
      what: 'Execute all tasks from tasks.md in the correct order, respecting dependencies and parallel execution markers. Follow TDD approach and constitutional compliance.',
      scope: 'Run /implement once all prerequisites are in place (constitution, spec, plan, and tasks). The AI agent will execute local CLI commands.',
      examples: [
        'Full implementation: /implement',
        'Prerequisite check: Ensure all required tools are installed before running /implement',
        'Constitutional compliance: Verify implementation follows all 9 constitutional articles'
      ]
    },
    {
      title: '6. Review & Refine',
      description: 'Validate implementation and improve specifications',
      details: 'Use feedback from production reality and user testing to iterate and improve both the implementation and specifications.',
      command: 'Update specifications based on lessons learned',
      why: 'Continuous improvement based on real-world usage and feedback ensures that specifications become more accurate and future implementations are more successful.',
      what: 'Review the completed implementation, gather feedback, identify areas for improvement, and update specifications to capture lessons learned.',
      scope: 'Conduct review after each major feature completion. Use production feedback, user testing, and team retrospectives.',
      examples: [
        'Performance review: Update specs with actual performance metrics and requirements',
        'User feedback: Incorporate user suggestions into specification templates',
        'Technical lessons: Document architectural decisions and constraints for future reference',
        'Process improvement: Refine specification process based on development challenges'
      ]
    }
  ]

  // Prompt templates
  const promptTemplates = [
    {
      name: 'Constitution',
      description: 'Create project governance principles and development guidelines',
      why: 'The constitution serves as the foundation for all development decisions, ensuring consistent quality, testing standards, and adherence to SDD principles.',
      what: 'Create a comprehensive constitution with principles focused on code quality, testing standards, user experience consistency, and performance requirements.',
      whenToChange: 'Different constitutions should be used when the target has distinct:\n\u00A0\u00A0\u00A0\u00A0• Purpose or Domain: Unique goals, like gaming vs. e-commerce, requiring specific principles.\n\u00A0\u00A0\u00A0\u00A0• Architecture: Different patterns, e.g., MVVM vs. Clean Architecture.\n\u00A0\u00A0\u00A0\u00A0• Technical Requirements: Varying APIs, libraries, or performance needs.\n\u00A0\u00A0\u00A0\u00A0• UI/UX Standards: Custom branding or design guidelines.\n\u00A0\u00A0\u00A0\u00A0• Team Practices: Unique coding standards, testing, or deployment processes.\n\u00A0\u00A0\u00A0\u00A0• Constraints: Specific device support, offline modes, or security needs.\n\nRule: Use a new constitution per app unless they share identical conventions.',
      whatToDoNext: '1. Fill out the below Template Variables to Complete or leverage the Quick Start Templates above.\n2. Click Generate Prompt and scroll to "Generated Prompt" section.\n3. Execute the prompt prepending with `/constitution`\n4. Update as needed: Revise your constitution as project requirements evolve while maintaining core principles',
      template: `/constitution Create a comprehensive constitution for the {project_type} project that will govern all development activities and ensure constitutional compliance.

Core Principles:
- Library-First Development: Prioritize reusable, well-documented libraries over monolithic code
- CLI Interface Accessibility: Ensure all functionality is accessible via command-line interface
- Test-First Implementation: Write tests before implementation code
- Integration-First Testing: Focus on integration tests over unit tests where possible
- Anti-Abstraction Principle: Avoid unnecessary abstraction layers and complexity

Quality Standards:
- Code quality requirements: {code_quality_requirements}
- Testing standards: {testing_standards}
- Performance targets: {performance_targets}
- Security requirements: {security_requirements}

Development Guidelines:
- Technology stack constraints: {tech_stack_constraints}
- Architecture principles: {architecture_principles}
- Documentation standards: {documentation_standards}
- Deployment requirements: {deployment_requirements}

Compliance and Governance:
- Regulatory compliance: {regulatory_compliance}
- Team workflow processes: {team_workflow}
- Review and approval processes: {review_processes}
- Success metrics and KPIs: {success_metrics}

This constitution will guide all technical decisions, ensure consistency across the project, and maintain alignment with SDD principles.`,
      variables: [
        { key: 'project_type', label: 'Project Type', placeholder: 'e.g., web application, mobile app, API service' },
        { key: 'code_quality_requirements', label: 'Code Quality Requirements', placeholder: 'e.g., ESLint strict mode, TypeScript enforcement, code coverage > 90%' },
        { key: 'testing_standards', label: 'Testing Standards', placeholder: 'e.g., Jest for unit tests, Cypress for E2E, integration test coverage > 80%' },
        { key: 'performance_targets', label: 'Performance Targets', placeholder: 'e.g., <2s page load, <100ms API response, 99.9% uptime' },
        { key: 'security_requirements', label: 'Security Requirements', placeholder: 'e.g., OAuth2 authentication, input validation, regular security audits' },
        { key: 'tech_stack_constraints', label: 'Technology Stack Constraints', placeholder: 'e.g., React with TypeScript, Node.js backend, PostgreSQL database' },
        { key: 'architecture_principles', label: 'Architecture Principles', placeholder: 'e.g., microservices, event-driven, clean architecture patterns' },
        { key: 'documentation_standards', label: 'Documentation Standards', placeholder: 'e.g., JSDoc comments, API documentation, README templates' },
        { key: 'deployment_requirements', label: 'Deployment Requirements', placeholder: 'e.g., Docker containers, CI/CD pipeline, automated testing' },
        { key: 'regulatory_compliance', label: 'Regulatory Compliance', placeholder: 'e.g., GDPR, SOC 2, HIPAA, industry-specific regulations' },
        { key: 'team_workflow', label: 'Team Workflow Processes', placeholder: 'e.g., Agile sprints, code reviews, pair programming' },
        { key: 'review_processes', label: 'Review and Approval Processes', placeholder: 'e.g., peer review mandatory, architect approval for major changes' },
        { key: 'success_metrics', label: 'Success Metrics and KPIs', placeholder: 'e.g., bug rate < 1%, feature delivery time, customer satisfaction' }
      ]
    },
    {
      name: 'Specification',
      description: 'Generate a complete feature specification',
      why: 'Specifications are the foundation of SDD. They serve as the primary artifact that guides all development activities, ensuring clarity and completeness before any code is written.',
      what: 'Create a comprehensive Product Requirements Document (PRD) that includes user stories, acceptance criteria, technical constraints, and success metrics.',
      whatToDoNext: '1. Fill out the below Template Variables to Complete or leverage the Quick Start Templates above.\n2. Click Generate Prompt and scroll to "Generated Prompt" section.\n3. Execute the prompt prepending with `/specify`\n4. Update as needed: Revise your specification as requirements evolve while ensuring constitutional compliance',
      template: `Create a comprehensive feature specification for {feature_type} that will serve as the foundation for implementation.

## Feature Overview
**Feature Name:** {feature_name}
**Feature Type:** {feature_type}
**Business Objective:** {business_objective}

## User Scenarios
{user_scenarios}

## Core Capabilities
{core_capabilities}

## Requirements
{requirements}

## Integration Context
{integration_context}

## Success Criteria
{success_criteria}

## SDD Workflow Commands:
${'```'}bash
/specify {feature_name}-specification.md
/constitution check {feature_name}-specification.md
/clarify {feature_name}-specification.md
/plan implementation-plan.md
${'```'}

## Example Specification Format:
${'```'}markdown
# Feature Specification: {feature_name}

## Overview
{business_objective}

## User Scenarios
- As a [user type], I want to [action] so that [benefit]
- As a [user type], I want to [action] so that [benefit]

## Core Capabilities
1. [Capability 1]
   - Description: [Detailed description]
   - Acceptance Criteria: [Specific, measurable criteria]

2. [Capability 2]
   - Description: [Detailed description]
   - Acceptance Criteria: [Specific, measurable criteria]

## Requirements
- Performance: [Specific performance requirements]
- Security: [Security requirements]
- Compliance: [Regulatory compliance needs]
- Accessibility: [Accessibility standards]

## Integration Context
- Systems: [Existing system integrations]
- Technology: [Technology stack and tools]
- Dependencies: [External dependencies and APIs]

## Success Criteria
- [Measurable success metric 1]
- [Measurable success metric 2]
- [Measurable success metric 3]
${'```'}

This specification will guide the technical planning and implementation phases while ensuring alignment with user needs and business objectives.`,
      variables: [
        { key: 'feature_name', label: 'Feature Name', placeholder: 'e.g., User Management System, Payment Processing' },
        { key: 'feature_type', label: 'Feature Type', placeholder: 'e.g., New Feature, Enhancement, Bug Fix, API Service' },
        { key: 'business_objective', label: 'Business Objective', placeholder: 'e.g., Streamline user onboarding, Reduce payment processing time, Improve data analytics capabilities' },
        { key: 'user_scenarios', label: 'User Scenarios', placeholder: 'e.g., Admin: Add/remove users, Customer: Make purchases, Manager: View reports - describe role-action-benefit patterns' },
        { key: 'core_capabilities', label: 'Core Capabilities', placeholder: 'e.g., User authentication with MFA, Real-time dashboard with filters, Automated reporting system with export' },
        { key: 'requirements', label: 'Requirements', placeholder: 'e.g., Performance: <2s response time, Security: Encryption at rest, Compliance: GDPR, Accessibility: WCAG 2.1' },
        { key: 'integration_context', label: 'Integration Context', placeholder: 'e.g., Integrates with existing CRM, Uses PostgreSQL database, React frontend with Node.js backend, Deploys to AWS' },
        { key: 'success_criteria', label: 'Success Criteria', placeholder: 'e.g., 50% reduction in processing time, 99.9% uptime, User satisfaction score >4.5, Successful deployment by Q3' }
      ]
    },
    {
      name: 'Clarification',
      description: 'Refine specifications and resolve ambiguities before technical planning',
      why: 'Clarification reduces rework downstream by ensuring all requirements are well-understood before technical decisions are made.',
      what: 'Go through the specification systematically, asking questions to identify missing details, conflicting requirements, or unclear functionality.',
      whatToDoNext: '1. Fill out the below Template Variables to Complete or leverage the Quick Start Templates above.\n2. Click Generate Prompt and scroll to "Generated Prompt" section.\n3. Execute the prompt prepending with `/clarify`\n4. Update as needed: Refine your clarification questions as new requirements or ambiguities emerge during specification',
      template: `Review the following specification for {specification_name} and identify areas that need clarification or additional detail.

Specification Focus: {specification_focus}

## Areas Requiring Clarification:

### 1. Core Functionality Gaps
{core_functionality_gaps}

### 2. Technical Requirements
{technical_requirements}

### 3. User Experience Needs
{user_experience_needs}

### 4. Business Logic Clarification
{business_logic_clarification}

### 5. Success Criteria
{success_criteria}

## Specification Review Commands:
${'```'}bash
/clarify clarification-questions.md
/specify updated-specification.md
/constitution check updated-specification.md
${'```'}

## Example Specification Format:
${'```'}${'```'}markdown
# Feature Specification: [Feature Name]

## Overview
[Brief description]

## User Stories
- As a [user type], I want [action] so that [benefit]

## Acceptance Criteria
- Given [context], when [action], then [outcome]

## Technical Constraints
- Technology stack: [technologies]
- Performance: [requirements]
- Security: [requirements]
${'```'}${'```'}

Please provide specific questions and recommendations for each identified area to ensure the specification is comprehensive and unambiguous before proceeding to technical planning.`,
      variables: [
        { key: 'specification_name', label: 'Specification Name', placeholder: 'e.g., User Management System, E-commerce Platform' },
        { key: 'specification_focus', label: 'Specification Focus', placeholder: 'e.g., user authentication, payment processing, data analytics' },
        { key: 'core_functionality_gaps', label: 'Core Functionality Gaps', placeholder: 'e.g., missing user stories, unclear features, edge cases not covered' },
        { key: 'technical_requirements', label: 'Technical Requirements', placeholder: 'e.g., performance targets, integration needs, security considerations, scalability concerns' },
        { key: 'user_experience_needs', label: 'User Experience Needs', placeholder: 'e.g., interaction flows, error handling, accessibility requirements, mobile responsiveness' },
        { key: 'business_logic_clarification', label: 'Business Logic Clarification', placeholder: 'e.g., business rules, data validation, workflow complexities, approval processes' },
        { key: 'success_criteria', label: 'Success Criteria', placeholder: 'e.g., measurable metrics, testing requirements, deployment considerations, acceptance criteria' }
      ]
    },
    {
      name: 'Implementation Plan',
      description: 'Create detailed technical implementation plan from specifications',
      why: 'A solid technical plan ensures architectural consistency, identifies potential challenges early, and provides a roadmap for implementation.',
      what: 'Create a comprehensive technical plan including technology stack, architecture decisions, data models, API contracts, testing strategy, and deployment approach.',
      whatToDoNext: '1. Fill out the below Template Variables to Complete or leverage the Quick Start Templates above.\n2. Click Generate Prompt and scroll to "Generated Prompt" section.\n3. Execute the prompt prepending with `/plan`\n4. Update as needed: Adjust your implementation plan as technical requirements or architectural decisions evolve',
      template: `Create a comprehensive implementation plan for {project_name} that aligns with SDD constitutional principles.

## Technology Foundation
{technology_foundation}

## Component Architecture
{component_architecture}

## Data Model
{data_model}

## API Contract
{api_contract}

## Testing Approach
{testing_approach}

## Deployment Strategy
{deployment_strategy}

## SDD Implementation Commands:
${'```'}bash
/plan {project_name}-implementation.md
/tasks
/constitution check {project_name}-implementation.md
${'```'}

## Constitutional Compliance Requirements:
✓ **Library-First Principle**: Each component starts as a standalone library
✓ **CLI Interface Mandate**: All functionality accessible via command-line interfaces
✓ **Test-First Imperative**: No implementation code before tests
✓ **Integration-First Testing**: Use realistic environments over mocks

## Project Structure:
${'```'}
project/
├── packages/
│   ├── component-1/
│   │   ├── src/
│   │   ├── tests/
│   │   └── cli.js
│   ├── component-2/
│   │   ├── src/
│   │   ├── tests/
│   │   └── cli.js
│   └── component-3/
│       ├── src/
│       ├── tests/
│       └── cli.js
├── specs/
├── tests/
│   ├── integration/
│   └── e2e/
├── memory/
│   └── constitution.md
└── docs/
${'```'}

## Example Implementation Plan Format:
${'```'}markdown
# Implementation Plan: {project_name}

## Technology Foundation
- Frontend: [Framework and tools]
- Backend: [Server and runtime]
- Database: [Storage and caching]
- Infrastructure: [Deployment and operations]

## Component Architecture
1. **[Component Name]**
   - Purpose: [Component responsibility]
   - CLI Interface: [Command-line operations]
   - Dependencies: [External dependencies]

2. **[Component Name]**
   - Purpose: [Component responsibility]
   - CLI Interface: [Command-line operations]
   - Dependencies: [External dependencies]

## Data Model
- **[Entity Name]**: [Description and fields]
- **[Entity Name]**: [Description and fields]
- Relationships: [Entity relationships and constraints]

## API Contract
- **POST /api/endpoint**: [Description]
- **GET /api/endpoint**: [Description]
- Authentication: [Security approach]
- Rate Limiting: [Throttling strategy]

## Testing Approach
- Unit Tests: [Coverage targets and framework]
- Integration Tests: [Environment and scope]
- E2E Tests: [Workflow validation]

## Deployment Strategy
- CI/CD: [Pipeline automation]
- Environment: [Deployment targets]
- Monitoring: [Observability and alerting]
${'```'}`,
      variables: [
        { key: 'project_name', label: 'Project Name', placeholder: 'e.g., E-commerce Platform, User Management System' },
        { key: 'technology_foundation', label: 'Technology Foundation', placeholder: 'e.g., React/Node.js/PostgreSQL with Docker containers on AWS, including CDN, caching, and monitoring' },
        { key: 'component_architecture', label: 'Component Architecture', placeholder: 'e.g., User Service (authentication, profiles), Order Service (processing, inventory), Payment Service (transactions, refunds) - each as standalone libraries with CLI interfaces' },
        { key: 'data_model', label: 'Data Model', placeholder: 'e.g., User, Product, Order, Payment entities with relationships: User-Order (1:N), Order-Product (N:M), Order-Payment (1:1). Consider data consistency and transaction management' },
        { key: 'api_contract', label: 'API Contract', placeholder: 'e.g., RESTful endpoints with OpenAPI spec: POST /api/auth/login, GET /api/users/{id}, POST /api/orders. JWT authentication with rate limiting: 100 requests/minute/user' },
        { key: 'testing_approach', label: 'Testing Approach', placeholder: 'e.g., Test-first with 90% unit coverage, integration-first testing with realistic environments, E2E testing for key workflows. Focus on contract testing and integration validation' },
        { key: 'deployment_strategy', label: 'Deployment Strategy', placeholder: 'e.g., CI/CD pipeline with automated testing, blue-green deployments, container orchestration, monitoring and logging, backup and disaster recovery procedures' }
      ]
    },
    {
      name: 'Task List',
      description: 'Generate executable task lists from implementation plans',
      why: 'Task generation transforms high-level plans into manageable work items, making progress trackable and ensuring nothing is missed during implementation.',
      what: 'Generate a prioritized list of executable tasks with dependencies, time estimates, and clear acceptance criteria for each work item.',
      whatToDoNext: '1. Execute the prompt `/tasks` to generate tasks.\n2. Update as needed: Refine your task list as implementation requirements evolve or new dependencies emerge',
      variables: []
    },
    {
      name: 'Analysis',
      description: 'Analyze code quality, architecture, and constitutional compliance',
      why: 'Analysis ensures that implemented code meets quality standards, follows architectural best practices, and complies with constitutional requirements. It provides insights into code health, performance, and areas for improvement.',
      whatToDoNext: '1. Execute the prompt `/analyze` to perform analysis.\n2. Update as needed: Refine your analysis approach based on findings or changing requirements.\n3. When you are done, you may be prompted to allow it to show you changes.  Proceed with allowing it to show you changes, then use \"can you go ahead and make these edits for me?  use sequential-thinking\" to have your coding agent resolve the problems.\n4. Re-run `/analyze` another time and repeat.',
      variables: []
    },
    {
      name: 'Implementation',
      description: 'Execute the implementation phase with constitutional compliance',
      why: 'Following constitutional principles ensures high-quality, maintainable code that emphasizes simplicity, testability, and integration-first development.',
      what: 'Execute all tasks from tasks.md in the correct order, respecting dependencies and parallel execution markers. Follow TDD approach and constitutional compliance.',
      whatToDoNext: '1. Execute the prompt `/implement` to start implementation.\n2. Update as needed: Refine your implementation approach based on testing results or evolving requirements',
        variables: []
    }
  ]

  // Scenario presets for quick template population
  const scenarioPresets = [
    {
      id: 'android-mobile',
      name: 'Android Mobile App',
      description: 'Native Android application with modern architecture',
      icon: '🤖',
      featureSpecVars: {
        feature_name: 'Android Mobile Application',
        feature_type: 'Android Mobile App',
        business_objective: 'Create a native Android application that provides seamless user experience with offline capabilities and push notifications',
        user_scenarios: 'Admin: Manage users and settings, Customer: Access core features and personalize experience, Manager: Monitor analytics and generate reports',
        core_capabilities: 'User authentication with biometric support, Real-time data synchronization with offline mode, Push notification system with rich media, Camera and location integration, Material 3 UI with adaptive layouts',
        requirements: 'Performance: <2s startup time, Security: Biometric auth + data encryption, Compliance: Google Play Store + GDPR, Accessibility: WCAG 2.1 with screen reader support',
        integration_context: 'REST APIs with OpenAPI spec, Firebase for backend services, Google Play Services integration, Third-party analytics SDKs, Kotlin Coroutines for async operations',
        success_criteria: '4.5+ star rating, <1% crash rate, 99.9% uptime, 10K+ concurrent users with minimal battery impact'
      },
      implementationPlanVars: {
        project_name: 'Android Mobile Application',
        technology_foundation: 'Kotlin with Jetpack Compose, Material 3 UI, MVVM architecture, Room database, Retrofit for networking, Coroutines for async operations',
        component_architecture: 'Authentication Service (biometric auth, session management, CLI tools for user management), Data Sync Service (offline-first storage, conflict resolution, CLI sync commands), Notification Service (push notifications, rich media, CLI notification testing)',
        data_model: 'User, Profile, Settings, Notification, SyncRecord entities with relationships: User-Profile (1:1), User-Notification (1:N), User-SyncRecord (1:N). Offline-first with encryption and conflict resolution',
        api_contract: 'RESTful endpoints: POST /api/auth/login, GET /api/users/{id}, POST /api/sync. JWT with OAuth 2.0, rate limiting: 100 requests/minute/user',
        testing_approach: 'Test-first with 85% JUnit coverage, integration-first with realistic network conditions, Espresso for UI testing, Robolectric for unit tests',
        deployment_strategy: 'Google Play Store with staged rollout, CI/CD using GitHub Actions, automated testing on emulator matrix, crash reporting with Firebase'
      },
      constitutionVars: {
        project_type: 'Android mobile application',
        code_quality_requirements: 'Kotlin coding standards, Android Lint warnings treated as errors, 90% test coverage',
        testing_standards: 'JUnit for unit tests, Espresso for UI tests, Mockito for mocking, 85% coverage minimum',
        performance_targets: '<2s app startup time, <16ms UI thread response, <50ms API response time, 99.9% uptime',
        security_requirements: 'Biometric authentication, data encryption at rest, SSL pinning, OAuth 2.0 + JWT',
        tech_stack_constraints: 'Kotlin, Jetpack Compose, Room, Retrofit, Coroutines, Dagger Hilt',
        architecture_principles: 'MVVM architecture, Clean Architecture, Repository pattern, Dependency injection',
        documentation_standards: 'KDoc for all public APIs, architecture documentation, README with setup instructions',
        deployment_requirements: 'Google Play Store deployment, CI/CD with GitHub Actions, automated testing',
        regulatory_compliance: 'Google Play Store policies, GDPR compliance, COPPA for family apps',
        team_workflow: 'Agile development, 2-week sprints, peer code reviews, automated testing',
        review_processes: 'Mandatory code review, security review for authentication features, architect approval for major changes',
        success_metrics: '<1% crash rate, >4.5 star rating, <100ms API response time, 99.9% uptime'
      },
      clarifyVars: {
        specification_name: 'Android Mobile Application',
        specification_focus: 'user authentication, data synchronization, push notifications, offline functionality',
        core_functionality_gaps: 'admin user management workflows, data export/import functionality, advanced search and filtering capabilities',
        technical_requirements: 'battery optimization strategies, memory usage limits, background processing constraints, network connectivity handling',
        user_experience_needs: 'tablet UI layout optimization, dark mode implementation, accessibility features for motor impairments, offline mode user guidance',
        business_logic_clarification: 'data retention policies, user account deactivation workflows, content moderation guidelines, notification throttling policies',
        success_criteria: 'user engagement targets, performance benchmarks, error rate thresholds, app store rating goals, crash rate limits'
      },
      taskListVars: {
        project_name: 'Android Mobile Application',
        tech_stack: 'Android (Kotlin), Jetpack Compose, MVVM architecture',
        component_1: 'Authentication Service',
        component_2: 'Data Sync Service',
        component_3: 'Notification Service',
        unit_test_pass_rate: '85%',
        performance_targets: '<2s app startup time, <500ms API response time',
        security_requirements: 'Biometric authentication, data encryption, secure API communication'
      },
      analysisVars: {
        analysis_target: 'Android mobile application',
        project_name: 'Android Mobile Application',
        analysis_type: 'code quality and security audit',
        compliance_framework: 'SDD Constitution, Google Play Store policies',
        test_coverage: '85% unit, 75% integration, 70% E2E',
        security_standards: 'OWASP Mobile Security, Google Security Guidelines',
        quality_thresholds: '<1% critical issues, 95% code coverage'
      },
      implementationVars: {
        component_name: 'AndroidAuthenticationService',
        component_purpose: 'Handle user authentication and session management',
        tech_stack: 'Android (Kotlin), Jetpack Compose, MVVM',
        architecture_pattern: 'Clean Architecture with Repository Pattern',
        component_class_name: 'AuthenticationManager',
        primary_method: 'authenticateUser',
        component_version: '1.0.0',
        component_description: 'Manages user authentication with biometric support',
        deployment_environment: 'production',
        database_config: 'Room database with encryption',
        external_apis: 'Firebase Authentication, Google Sign-In',
        auth_config: 'JWT tokens with OAuth 2.0',
        logging_config: 'Timber with structured logging'
      }
    },
    {
      id: 'ios-mobile',
      name: 'iOS Mobile App',
      description: 'Native iOS application following Apple design guidelines',
      icon: '📱',
      featureSpecVars: {
        feature_name: 'iOS Mobile Application',
        feature_type: 'iOS mobile application',
        business_objective: 'deliver a premium iOS experience with intuitive interface and seamless performance',
        user_scenarios: 'User: Authenticate with Face ID/Touch ID, Admin: Manage app settings and analytics, Customer: Make purchases with Apple Pay',
        core_capabilities: 'biometric authentication, CloudKit synchronization, Apple Pay integration, HealthKit features, iMessage extension support',
        requirements: '<1.5s app launch time, <300ms UI response, App Store Review Guidelines, Apple Human Interface Guidelines, GDPR compliance',
        integration_context: 'Apple ecosystem integration, CloudKit backend, HealthKit data access, Apple Pay processing, third-party iOS SDKs',
        success_criteria: '99.9% uptime, <1% crash rate, App Store approval success, user satisfaction score >4.5'
      },
      implementationPlanVars: {
        project_name: 'iOS Mobile Application',
        technology_foundation: 'Swift/SwiftUI/Combine with Core Data and CloudKit, Apple native frameworks, TestFlight deployment, MVVM architecture',
        component_architecture: 'Authentication Service (biometrics, iCloud), Data Sync Manager (Core Data, CloudKit), Apple Pay Integration (transactions, payment processing) - each as standalone modules with clear interfaces',
        data_model: 'User, Profile, Transaction, Preference, SyncData entities with relationships: User-Profile (1:1), User-Transaction (1:N), User-Preference (1:1). Privacy-first design with encryption',
        api_contract: 'CloudKit web services and Apple native APIs with Combine publishers, biometric authentication via LocalAuthentication framework, payment processing via PassKit',
        testing_approach: 'XCTest framework with 90% unit coverage, XCUITest for integration testing, TestFlight beta testing, device compatibility matrix, performance testing for launch times',
        deployment_strategy: 'App Store deployment with TestFlight beta testing, CI/CD with Xcode Cloud, automated builds and releases, crash reporting integration, App Store optimization'
      },
      constitutionVars: {
        project_type: 'iOS mobile application',
        code_quality_requirements: 'Swift coding standards, SwiftLint strict mode, 90% test coverage, memory safety, protocol-oriented design',
        testing_standards: 'XCTest for unit tests, XCUITest for automation, 90% coverage minimum, device compatibility testing',
        performance_targets: '<1.5s app launch time, <16ms UI response, <200ms API response, 99.9% uptime, battery efficiency',
        security_requirements: 'Biometric authentication, Keychain security, App Transport Security, data encryption, privacy-first design',
        tech_stack_constraints: 'Swift, SwiftUI, Combine, Core Data, CloudKit, Apple native frameworks only',
        architecture_principles: 'MVVM pattern, Clean Architecture, Combine framework, protocol-oriented design, modular components',
        documentation_standards: 'SwiftDoc for all public APIs, Xcode markup, README with setup instructions, architecture diagrams',
        deployment_requirements: 'App Store deployment, TestFlight beta testing, CI/CD with Xcode Cloud, automated releases',
        regulatory_compliance: 'App Store Review Guidelines, Apple Human Interface Guidelines, GDPR, ATT, privacy regulations',
        team_workflow: 'Agile development, 1-week sprints, app store review management, automated testing, UX reviews',
        review_processes: 'Mandatory code review, UI/UX review, App Store guideline compliance check, security audit',
        success_metrics: '<1% crash rate, >4.5 star rating, <50ms UI response time, 99.9% uptime, user satisfaction'
      },
      clarifyVars: {
        specification_name: 'iOS Mobile App Feature Specification',
        specification_focus: 'biometric authentication, CloudKit synchronization, Apple Pay integration, HealthKit features',
        specification_state: 'initial draft with Apple ecosystem integration defined',
        missing_user_stories: 'Family Sharing support, Apple Watch companion app, advanced HealthKit features',
        unclear_features: 'background app refresh behavior, iCloud sync conflict resolution, offline mode limits',
        edge_cases: 'low storage scenarios, network connectivity loss, iCloud account switching, data migration',
        performance_ambiguities: 'background processing limits, memory usage constraints, battery optimization',
        integration_questions: 'CloudKit container configuration, HealthKit data sharing, Apple Pay testing environment',
        security_considerations: 'Keychain data storage, biometric fallback options, data encryption requirements'
      },
      taskListVars: {
        project_name: 'iOS Mobile Application',
        tech_stack: 'iOS (Swift), SwiftUI, Combine framework',
        component_1: 'Authentication Module',
        component_2: 'Data Sync Manager',
        component_3: 'Notification Service',
        unit_test_pass_rate: '90%',
        performance_targets: '<1.5s app launch time, <300ms API response time',
        security_requirements: 'Biometric authentication, Keychain security, data encryption'
      },
      analysisVars: {
        analysis_target: 'iOS mobile application',
        project_name: 'iOS Mobile Application',
        analysis_type: 'code quality and performance audit',
        compliance_framework: 'SDD Constitution, Apple Human Interface Guidelines',
        test_coverage: '90% unit, 80% integration, 75% E2E',
        security_standards: 'Apple Security Guidelines, OWASP Mobile Security',
        quality_thresholds: '<0.5% critical issues, 97% code coverage'
      },
      implementationVars: {
        component_name: 'iOSAuthenticationManager',
        component_purpose: 'Handle user authentication with biometric support',
        tech_stack: 'iOS (Swift), SwiftUI, Combine',
        architecture_pattern: 'MVVM with Coordinator Pattern',
        component_class_name: 'AuthenticationCoordinator',
        primary_method: 'authenticateWithBiometrics',
        component_version: '1.0.0',
        component_description: 'Manages iOS authentication with Face ID/Touch ID',
        deployment_environment: 'production',
        database_config: 'Core Data with CloudKit sync',
        external_apis: 'CloudKit, Apple Pay, HealthKit',
        auth_config: 'Keychain storage with OAuth 2.0',
        logging_config: 'OSLog with structured logging'
      }
    },
    {
      id: 'web-app',
      name: 'Web Application',
      description: 'Modern responsive web application with PWA capabilities',
      icon: '🌐',
      featureSpecVars: {
        feature_name: 'Progressive Web Application',
        feature_type: 'progressive web application (PWA)',
        business_objective: 'provide a responsive web experience that works across all devices and supports offline functionality',
        user_scenarios: 'User: Access from any device with offline support, Admin: Manage content and analytics, Developer: Deploy and monitor performance',
        core_capabilities: 'responsive design, offline capabilities, push notifications, SEO optimization, cross-browser compatibility, PWA installation',
        requirements: '<3s first contentful paint, <1s time to interactive, 90+ Lighthouse score, WCAG 2.1 accessibility, GDPR/CCPA compliance',
        integration_context: 'third-party APIs, analytics platforms, payment gateways, content management systems, service workers, cloud hosting',
        success_criteria: '99.9% uptime, 50,000+ concurrent users, 90+ Lighthouse score, successful PWA installation rate >80%'
      },
      implementationPlanVars: {
        project_name: 'Progressive Web Application',
        technology_foundation: 'React/TypeScript/Next.js with PostgreSQL and Redis, Vercel deployment, service workers, CI/CD automation',
        component_architecture: 'Authentication System (social login, sessions), Service Worker Manager (offline caching, sync), API Gateway (rate limiting, caching) - each as standalone libraries with CLI interfaces',
        data_model: 'User, Session, Cache, Config, AuditLog entities with relationships: User-Session (1:N), User-Cache (1:N), Config-AuditLog (1:N). Focus on offline data consistency and cache invalidation',
        api_contract: 'RESTful APIs with GraphQL support and OpenAPI documentation, JWT authentication with OAuth 2.0, rate limiting: 1000 requests/hour/IP, social login integration',
        testing_approach: '90% unit coverage with Jest and React Testing Library, integration testing for APIs and database, E2E testing with Cypress for critical user journeys, Lighthouse performance monitoring',
        deployment_strategy: 'Vercel multi-region deployment with CI/CD pipeline, automated testing and builds, service worker deployment strategy, cache invalidation, A/B testing framework'
      },
      constitutionVars: {
        project_type: 'progressive web application (PWA)',
        code_quality_requirements: 'TypeScript strict mode, ESLint configuration, Prettier formatting, 90% test coverage, component documentation',
        testing_standards: 'Jest for unit tests, React Testing Library, Cypress for E2E, 90% coverage minimum, accessibility testing',
        performance_targets: '<3s first contentful paint, <1s time to interactive, 90+ Lighthouse score, Core Web Vitals optimization',
        security_requirements: 'HTTPS enforcement, CSP headers, XSS protection, CSRF protection, secure cookies, input validation',
        tech_stack_constraints: 'React, TypeScript, Next.js, Tailwind CSS, Vercel deployment, PostgreSQL database, service workers',
        architecture_principles: 'Component-based architecture, service workers, progressive enhancement, offline-first, responsive design',
        documentation_standards: 'JSDoc comments, Storybook for components, API documentation with OpenAPI, architecture diagrams',
        deployment_requirements: 'Vercel deployment, CI/CD pipeline, automated testing, multi-region CDN, progressive deployment',
        regulatory_compliance: 'GDPR, CCPA, WCAG 2.1 accessibility, cookie consent, data privacy, security standards',
        team_workflow: 'Agile development, 2-week sprints, code reviews, automated testing, feature flags, performance monitoring',
        review_processes: 'Mandatory code review, security review for auth features, performance review, accessibility review',
        success_metrics: '<2s page load, 99.9% uptime, 90+ Lighthouse score, 95% test coverage, user satisfaction'
      },
      clarifyVars: {
        specification_name: 'Progressive Web Application Specification',
        specification_focus: 'offline functionality, responsive design, PWA features, performance optimization',
        specification_state: 'initial draft with core PWA requirements identified',
        missing_user_stories: 'offline mode management, install prompts, background sync features',
        unclear_features: 'service worker caching strategy, offline data sync, push notification handling',
        edge_cases: 'network connectivity loss, browser compatibility issues, storage quota exceeded',
        performance_ambiguities: 'cache invalidation strategies, image optimization, bundle size limits',
        integration_questions: 'third-party service dependencies, analytics integration, payment gateway requirements',
        security_considerations: 'offline data security, service worker security, XSS prevention in offline mode'
      },
      taskListVars: {
        project_name: 'Progressive Web Application',
        tech_stack: 'React, TypeScript, Next.js, Tailwind CSS',
        component_1: 'Authentication System',
        component_2: 'Service Worker Manager',
        component_3: 'API Gateway',
        unit_test_pass_rate: '90%',
        performance_targets: '<3s first contentful paint, <1s time to interactive',
        security_requirements: 'JWT authentication, input validation, XSS protection'
      },
      analysisVars: {
        analysis_target: 'progressive web application',
        project_name: 'Progressive Web Application',
        analysis_type: 'performance and accessibility audit',
        compliance_framework: 'SDD Constitution, WCAG 2.1, GDPR',
        test_coverage: '90% unit, 85% integration, 80% E2E',
        security_standards: 'OWASP Web Security, Lighthouse guidelines',
        quality_thresholds: '<1% critical issues, 90+ Lighthouse score'
      },
      implementationVars: {
        component_name: 'PWAAuthenticationService',
        component_purpose: 'Handle user authentication and session management',
        tech_stack: 'React, TypeScript, Next.js',
        architecture_pattern: 'Clean Architecture with CQRS',
        component_class_name: 'AuthManager',
        primary_method: 'authenticateUser',
        component_version: '1.0.0',
        component_description: 'Manages authentication with social login support',
        deployment_environment: 'Vercel multi-region',
        database_config: 'PostgreSQL with Redis caching',
        external_apis: 'Auth providers, payment gateways, analytics',
        auth_config: 'JWT with OAuth 2.0 and refresh tokens',
        logging_config: 'Winston with structured logging'
      }
    },
    {
      id: 'saas-platform',
      name: 'SaaS Platform',
      description: 'Multi-tenant software-as-a-service platform',
      icon: '☁️',
      featureSpecVars: {
        feature_name: 'Multi-Tenant SaaS Platform',
        feature_type: 'multi-tenant SaaS platform',
        business_objective: 'provide a scalable, secure platform for multiple organizations with customizable features and real-time analytics',
        user_scenarios: 'Admin: Manage organization and users, Developer: Integrate APIs and customize features, Customer: Access enterprise features and analytics',
        core_capabilities: 'multi-tenant architecture, role-based access control, API integration, billing system, analytics dashboard, real-time monitoring',
        requirements: '<2s API response time, 99.9% uptime, horizontal scalability, SOC 2/ISO 27001 compliance, GDPR/HIPAA if applicable',
        integration_context: 'payment processors, email services, CRM systems, monitoring tools, identity providers, analytics platforms',
        success_criteria: '10,000+ organizations, 100,000+ concurrent users, 99.9% uptime, tenant isolation security, real-time analytics <1s latency'
      },
      implementationPlanVars: {
        project_name: 'Multi-Tenant SaaS Platform',
        technology_foundation: 'Cloud-native microservices with Kubernetes, PostgreSQL tenant isolation, Redis/Elasticsearch, React/TypeScript micro-frontends, multi-region deployment',
        component_architecture: 'Tenant Management Service (provisioning, isolation), Billing & Subscription Service (payments, invoicing), Analytics Engine (real-time reporting) - each as standalone libraries with CLI interfaces',
        data_model: 'Tenant, User, Subscription, Invoice, AnalyticsData entities with relationships: Tenant-User (1:N), Tenant-Subscription (1:1), User-AnalyticsData (1:N). Strict tenant isolation and compliance requirements',
        api_contract: 'RESTful APIs with tenant context and rate limiting, OAuth 2.0 with JWT and MFA, per-tenant rate limiting with burst handling, comprehensive audit logging',
        testing_approach: '95% unit coverage with comprehensive mocking, integration testing for all service integrations and tenant isolation, E2E testing for multi-tenant workflows, chaos engineering, load testing',
        deployment_strategy: 'Kubernetes on AWS/GCP with Helm charts, multi-region deployment, blue-green deployments, automated scaling, comprehensive monitoring and alerting'
      },
      constitutionVars: {
        project_type: 'multi-tenant SaaS platform',
        code_quality_requirements: 'Multi-language standards, container security, 95% test coverage, code quality gates, SAST/DAST scanning',
        testing_standards: 'Multi-service testing, chaos engineering, load testing, 95% coverage minimum, tenant isolation testing',
        performance_targets: '<2s API response, 99.9% uptime, horizontal scaling, <100ms tenant provisioning, auto-scaling thresholds',
        security_requirements: 'Multi-tenant isolation, encryption at rest/transit, RBAC, audit logging, MFA, zero-trust architecture',
        tech_stack_constraints: 'Cloud-native, container-based, microservices, Kubernetes, AWS/GCP services, Istio service mesh',
        architecture_principles: 'Microservices, tenant isolation, event-driven, API-first, infrastructure as code, immutable infrastructure',
        documentation_standards: 'API documentation, architecture diagrams, runbooks, compliance documentation, tenant setup guides',
        deployment_requirements: 'Kubernetes, Istio service mesh, Helm charts, GitOps, multi-region deployment, blue-green deployments',
        regulatory_compliance: 'SOC 2, ISO 27001, GDPR, HIPAA, data residency requirements, industry-specific regulations',
        team_workflow: 'DevOps practices, infrastructure as code, automated testing, incident management, compliance monitoring',
        review_processes: 'Security review, architecture review, compliance review, performance review, tenant onboarding review',
        success_metrics: '99.9% uptime, <2s API response, 95% test coverage, zero security incidents, tenant satisfaction >90%'
      },
      clarifyVars: {
        specification_name: 'Multi-Tenant SaaS Platform Specification',
        specification_focus: 'tenant isolation, billing system, analytics dashboard, API management',
        specification_state: 'initial draft with multi-tenant architecture defined',
        missing_user_stories: 'tenant onboarding workflows, admin dashboard, custom configuration options',
        unclear_features: 'tenant customization limits, data migration strategies, API versioning approach',
        edge_cases: 'tenant resource exhaustion, data conflicts, cross-tenant data access, compliance violations',
        performance_ambiguities: 'concurrent tenant limits, data processing requirements, scaling thresholds',
        integration_questions: 'third-party service dependencies, payment processor integration, monitoring tools',
        security_considerations: 'tenant isolation mechanisms, data encryption requirements, audit logging scope'
      },
      taskListVars: {
        project_name: 'Multi-Tenant SaaS Platform',
        tech_stack: 'Microservices, Kubernetes, React, Node.js, PostgreSQL',
        component_1: 'Tenant Management Service',
        component_2: 'Billing & Subscription Service',
        component_3: 'Analytics Engine',
        unit_test_pass_rate: '95%',
        performance_targets: '<2s API response time, 99.9% uptime',
        security_requirements: 'Multi-tenant isolation, RBAC, data encryption'
      },
      analysisVars: {
        analysis_target: 'multi-tenant SaaS platform',
        project_name: 'Multi-Tenant SaaS Platform',
        analysis_type: 'scalability and security audit',
        compliance_framework: 'SDD Constitution, SOC 2, ISO 27001, GDPR',
        test_coverage: '95% unit, 90% integration, 85% E2E',
        security_standards: 'OWASP API Security, Cloud Security Best Practices',
        quality_thresholds: '99.9% uptime, <2s response time, zero security incidents'
      },
      implementationVars: {
        component_name: 'SaaSTenantManagementService',
        component_purpose: 'Handle tenant provisioning, configuration, and isolation',
        tech_stack: 'Node.js, Kubernetes, PostgreSQL, Redis',
        architecture_pattern: 'Microservices with Event-Driven Architecture',
        component_class_name: 'TenantManager',
        primary_method: 'provisionTenant',
        component_version: '1.0.0',
        component_description: 'Manages multi-tenant architecture with isolation',
        deployment_environment: 'Kubernetes multi-region',
        database_config: 'PostgreSQL with tenant isolation and Redis caching',
        external_apis: 'Payment processors, email services, monitoring tools',
        auth_config: 'OAuth 2.0 with JWT and multi-factor authentication',
        logging_config: 'Structured logging with ELK stack'
      }
    },
    {
      id: 'api-service',
      name: 'API Service',
      description: 'RESTful API service with comprehensive documentation',
      icon: '🔧',
      featureSpecVars: {
        feature_name: 'RESTful API Service',
        feature_type: 'RESTful API service',
        business_objective: 'provide reliable, scalable APIs for external and internal consumption with comprehensive monitoring and documentation',
        user_scenarios: 'Developer: Integrate with API using SDKs, Admin: Monitor API usage and performance, Partner: Access APIs through developer portal',
        core_capabilities: 'RESTful design, comprehensive documentation, rate limiting, monitoring, SDK support, authentication, auto-scaling',
        requirements: '<100ms response time, 99.99% uptime, auto-scaling, API security best practices, data privacy regulations',
        integration_context: 'databases, external APIs, authentication services, monitoring tools, caching layers, CDN',
        success_criteria: 'millions of requests per day, 99.99% uptime, developer satisfaction >90%, comprehensive API coverage'
      },
      implementationPlanVars: {
        project_name: 'RESTful API Service',
        technology_foundation: 'API-first design with Node.js/Python, PostgreSQL with read replicas, Redis caching, Kubernetes orchestration, comprehensive monitoring',
        component_architecture: 'API Gateway (routing, auth, rate limiting), Authentication Service (API keys, OAuth), Monitoring & Analytics (usage analytics, performance) - each as standalone libraries with CLI interfaces',
        data_model: 'APIKey, User, RequestLog, RateLimit, Analytics entities with relationships: User-APIKey (1:N), APIKey-RequestLog (1:N). Focus on API key security and request logging privacy',
        api_contract: 'Well-designed RESTful endpoints with HATEOAS support, OpenAPI 3.0 specification, API keys and OAuth 2.0 tokens, tiered rate limiting based on subscription level',
        testing_approach: '95% unit coverage with comprehensive error scenario testing, integration testing for all database operations and external integrations, E2E API contract testing with load testing and chaos engineering',
        deployment_strategy: 'Docker containers with Kubernetes orchestration, blue-green deployments, auto-scaling, comprehensive monitoring and alerting, API documentation portal'
      },
      constitutionVars: {
        project_type: 'RESTful API service',
        code_quality_requirements: 'API-first standards, OpenAPI specification, 95% test coverage, linting rules, API contract testing',
        testing_standards: 'Contract testing, load testing, chaos engineering, 95% coverage minimum, API version testing',
        performance_targets: '<100ms response time, 99.99% uptime, auto-scaling, 1000+ RPS, circuit breaker patterns',
        security_requirements: 'API security, OAuth 2.0, rate limiting, DDoS protection, audit logging, input validation',
        tech_stack_constraints: 'API Gateway, Node.js/Python, PostgreSQL, Redis, Kubernetes, monitoring tools, service mesh',
        architecture_principles: 'API-first design, microservices, event-driven, circuit breakers, auto-scaling, stateless services',
        documentation_standards: 'OpenAPI 3.0 specification, API documentation, developer guides, SDK documentation',
        deployment_requirements: 'Kubernetes, Istio service mesh, GitOps, blue-green deployments, canary releases',
        regulatory_compliance: 'API security best practices, data privacy regulations, industry standards, PCI DSS if applicable',
        team_workflow: 'API-first development, contract testing, monitoring, incident response, developer support',
        review_processes: 'API design review, security review, performance review, compliance review, developer experience review',
        success_metrics: '99.99% uptime, <100ms response time, 99.9% SLA, zero security breaches, developer satisfaction >90%'
      },
      clarifyVars: {
        specification_name: 'RESTful API Service Specification',
        specification_focus: 'API design, rate limiting, authentication, monitoring, documentation',
        specification_state: 'initial draft with core API contracts defined',
        missing_user_stories: 'API key management, developer portal features, webhook integration',
        unclear_features: 'rate limiting strategy, API versioning approach, error response formats',
        edge_cases: 'API authentication failures, rate limit exhaustion, malformed requests, DDoS attacks',
        performance_ambiguities: 'concurrent request limits, data processing requirements, caching strategies',
        integration_questions: 'third-party API dependencies, database connection pooling, monitoring tools',
        security_considerations: 'API key management, authentication token lifecycle, request validation'
      },
      taskListVars: {
        project_name: 'RESTful API Service',
        tech_stack: 'Node.js, Python, Express, FastAPI, PostgreSQL, Redis',
        component_1: 'API Gateway',
        component_2: 'Authentication Service',
        component_3: 'Monitoring & Analytics',
        unit_test_pass_rate: '95%',
        performance_targets: '<100ms response time, 99.99% uptime',
        security_requirements: 'API security, OAuth 2.0, rate limiting'
      },
      analysisVars: {
        analysis_target: 'RESTful API service',
        project_name: 'RESTful API Service',
        analysis_type: 'performance and security audit',
        compliance_framework: 'SDD Constitution, OWASP API Security, SOC 2',
        test_coverage: '95% unit, 90% integration, 85% E2E',
        security_standards: 'OWASP API Security Top 10, API Security Best Practices',
        quality_thresholds: '99.99% uptime, <100ms response, zero security breaches'
      },
      implementationVars: {
        component_name: 'APIGatewayService',
        component_purpose: 'Handle request routing, authentication, and rate limiting',
        tech_stack: 'Node.js, Express, Redis, Kubernetes',
        architecture_pattern: 'API Gateway pattern with Circuit Breakers',
        component_class_name: 'APIGateway',
        primary_method: 'routeRequest',
        component_version: '1.0.0',
        component_description: 'Manages API requests with authentication and rate limiting',
        deployment_environment: 'Kubernetes with auto-scaling',
        database_config: 'PostgreSQL with read replicas and Redis caching',
        external_apis: 'Authentication services, monitoring tools, external APIs',
        auth_config: 'OAuth 2.0 with JWT and API key support',
        logging_config: 'Structured logging with ELK stack and Prometheus'
      }
    },
    {
      id: 'desktop-app',
      name: 'Desktop Application',
      description: 'Cross-platform desktop application with native performance',
      icon: '💻',
      featureSpecVars: {
        feature_name: 'Cross-Platform Desktop Application',
        feature_type: 'cross-platform desktop application',
        business_objective: 'provide native desktop experience with offline capabilities and system integration across multiple platforms',
        user_scenarios: 'User: Install and run on preferred OS, Admin: Manage settings and updates, Developer: Extend with plugins and integrations',
        core_capabilities: 'cross-platform support, offline functionality, system notifications, file system access, hardware integration, auto-updates',
        requirements: '<2s app startup, <100ms UI response, minimal memory footprint, platform-specific requirements, data privacy compliance',
        integration_context: 'operating system APIs, local databases, cloud services, system utilities, native modules, plugin architecture',
        success_criteria: 'native performance on all platforms, seamless offline experience, user satisfaction >90%, efficient resource usage'
      },
      implementationPlanVars: {
        project_name: 'Cross-Platform Desktop Application',
        technology_foundation: 'Electron/Tauri with React/TypeScript or Rust, SQLite local storage, cloud sync, platform-specific installers with auto-update',
        component_architecture: 'System Integration Manager (notifications, files, hardware), Data Synchronization Service (offline storage, cloud sync), Auto-Update System (updates, version management) - each as standalone libraries with CLI interfaces',
        data_model: 'User, Settings, LocalData, SyncRecord, UpdateLog entities with relationships: User-Settings (1:1), User-LocalData (1:N), User-SyncRecord (1:N). Focus on local data encryption and sync conflict resolution',
        api_contract: 'Local APIs for system integration and cloud sync endpoints, local authentication with optional cloud account sync, secure local API communication',
        testing_approach: '90% unit coverage with platform-specific testing, integration testing for all system integrations and file operations, E2E testing for cross-platform user workflows with automated UI testing',
        deployment_strategy: 'Platform-specific installers with auto-update, CI/CD for multiple platforms, code signing, notarization, app store distribution if applicable'
      },
      constitutionVars: {
        project_type: 'cross-platform desktop application',
        code_quality_requirements: 'Platform-specific standards, memory safety, 90% test coverage, native performance, code linting',
        testing_standards: 'Unit testing, integration testing, UI automation, 90% coverage minimum, platform compatibility testing',
        performance_targets: '<2s startup time, <100ms UI response, minimal memory usage, native performance, battery efficiency',
        security_requirements: 'Local data encryption, secure updates, system integration security, code signing, secure storage',
        tech_stack_constraints: 'Electron or Tauri framework, TypeScript/Rust, SQLite, native modules, platform APIs',
        architecture_principles: 'Cross-platform compatibility, native performance, offline-first, system integration, modular design',
        documentation_standards: 'Platform-specific documentation, API documentation, setup guides, developer guides',
        deployment_requirements: 'Platform-specific installers, auto-update, code signing, distribution channels, CI/CD automation',
        regulatory_compliance: 'Platform store requirements, data privacy, security certifications, accessibility standards',
        team_workflow: 'Cross-platform development, testing automation, release management, platform-specific expertise',
        review_processes: 'Code review, security review, performance review, platform compatibility testing, UX review',
        success_metrics: '<2s startup, <100ms UI response, 99.9% stability, native performance feel, user satisfaction'
      },
      clarifyVars: {
        specification_name: 'Cross-Platform Desktop Application Specification',
        specification_focus: 'system integration, offline capabilities, cross-platform compatibility, native features',
        specification_state: 'initial draft with cross-platform requirements identified',
        unclear_elements: 'hardware integration approach, system resource usage, update mechanism behavior, offline sync strategy, native performance targets, cross-platform UI consistency',
        stakeholder_alignment: 'development team needs clear platform priorities, UX team needs design system requirements, operations needs deployment strategy',
        technical_concerns: 'memory usage limits, CPU usage targets, battery optimization requirements, system API dependencies, hardware integration requirements',
        validation_priorities: 'cross-platform testing, performance benchmarks, offline functionality testing, system integration testing, update mechanism testing',
        refinement_focus: 'platform-specific capabilities, system integration patterns, offline-first architecture, native performance optimization',
        undefined_metrics: 'resource usage targets, user adoption goals, crash rate thresholds',
        testing_requirements: 'cross-platform testing, hardware integration testing, performance testing',
        deployment_considerations: 'platform-specific packaging, code signing, distribution channels, update strategy'
      },
      taskListVars: {
        project_name: 'Cross-Platform Desktop Application',
        tech_stack: 'Electron/Tauri, React/TypeScript, SQLite, Node.js/Rust',
        component_1: 'System Integration Manager',
        component_2: 'Data Synchronization Service',
        component_3: 'Auto-Update System',
        unit_test_pass_rate: '90%',
        performance_targets: '<2s app startup, <100ms UI response',
        security_requirements: 'Local data encryption, secure updates, system integration security'
      },
      analysisVars: {
        analysis_target: 'cross-platform desktop application',
        project_name: 'Cross-Platform Desktop Application',
        analysis_type: 'performance and compatibility audit',
        compliance_framework: 'SDD Constitution, platform-specific requirements',
        test_coverage: '90% unit, 85% integration, 80% E2E',
        security_standards: 'Platform security guidelines, data encryption standards',
        quality_thresholds: '<2s startup, <100ms UI response, 99.9% stability'
      },
      implementationVars: {
        component_name: 'DesktopSystemIntegrationManager',
        component_purpose: 'Handle OS-level features like notifications, files, and hardware',
        tech_stack: 'Electron/Tauri, React/TypeScript, Node.js/Rust',
        architecture_pattern: 'Cross-platform architecture with Native Modules',
        component_class_name: 'SystemIntegrationManager',
        primary_method: 'integrateWithSystem',
        component_version: '1.0.0',
        component_description: 'Manages cross-platform system integration',
        deployment_environment: 'Windows, macOS, Linux',
        database_config: 'SQLite for local storage with cloud sync',
        external_apis: 'System APIs, cloud services, hardware APIs',
        auth_config: 'Local authentication with optional cloud sync',
        logging_config: 'Platform-specific logging with cloud sync'
      }
    }
  ]

  // Tutorial modules
  const tutorials = [
    // BEGINNER TUTORIALS
    {
      id: 'sdd-fundamentals',
      title: 'SDD Fundamentals',
      description: 'Master the core principles and methodology of Spec-Driven Development',
      duration: '25 minutes',
      level: 'Beginner',
      category: 'fundamentals',
      steps: [
        {
          title: 'Understanding SDD Philosophy',
          content: 'Learn why specifications-first development leads to better outcomes',
          type: 'content',
          keyPoints: ['Specifications as primary artifacts', 'Executable specifications', 'Continuous refinement', 'Research-driven context'],
          video: {
            url: '/videos/sdd-philosophy-intro.mp4',
            thumbnail: '/thumbnails/sdd-philosophy.jpg',
            duration: '8:45',
            description: 'Introduction to SDD methodology and core principles'
          },
          exercise: {
            type: 'quiz',
            question: 'What is the primary artifact in SDD?',
            options: ['Code', 'Specifications', 'Tests', 'Documentation'],
            answer: 'Specifications',
            explanation: 'In SDD, specifications are the primary artifact, not code.'
          }
        },
        {
          title: 'The SDD Workflow',
          content: 'Understand the complete SDD development lifecycle',
          type: 'content',
          keyPoints: ['Constitution setup', 'Feature specification', 'Implementation planning', 'Task execution', 'Test-first development'],
          diagram: {
            type: 'flowchart',
            title: 'SDD Development Workflow',
            description: 'Visual representation of the SDD methodology phases',
            interactiveElements: [
              { name: 'Constitution', description: 'Setup project governance' },
              { name: 'Specification', description: 'Define detailed requirements' },
              { name: 'Planning', description: 'Create implementation strategy' },
              { name: 'Implementation', description: 'Execute development tasks' },
              { name: 'Testing', description: 'Verify against requirements' }
            ]
          },
          exercise: {
            type: 'ordering',
            question: 'Order the SDD workflow steps correctly:',
            items: ['Constitution Setup', 'Feature Specification', 'Implementation Planning', 'Task Execution', 'Testing'],
            correctOrder: [0, 1, 2, 3, 4]
          }
        },
        {
          title: 'Setting Up Your Environment',
          content: 'Configure your development environment for SDD',
          type: 'interactive',
          command: '/constitution create',
          exercise: {
            type: 'command',
            question: 'Create your first constitution:',
            expectedCommand: '/constitution create',
            hint: 'Use the /constitution command with the create option'
          }
        }
      ]
    },
    {
      id: 'constitution-basics',
      title: 'Constitution Mastery',
      description: 'Learn to create and manage project constitutions effectively',
      duration: '30 minutes',
      level: 'Beginner',
      category: 'fundamentals',
      steps: [
        {
          title: 'Understanding Constitutional Articles',
          content: 'Learn about the nine articles that govern SDD development',
          type: 'content',
          keyPoints: ['Library-First Principle', 'CLI Interface Mandate', 'Test-First Imperative', 'Simplicity Principle'],
          exercise: {
            type: 'matching',
            question: 'Match the principles with their descriptions:',
            pairs: [
              ['Article I', 'Library-First Principle'],
              ['Article II', 'CLI Interface Mandate'],
              ['Article III', 'Test-First Imperative'],
              ['Article VII', 'Simplicity Principle']
            ]
          }
        },
        {
          title: 'Creating Your First Constitution',
          content: 'Build a practical constitution for your project',
          type: 'interactive',
          exercise: {
            type: 'constitution-builder',
            question: 'Create a constitution with these principles: Library-First, CLI Interface, Test-First',
            requiredArticles: [1, 2, 3]
          }
        }
      ]
    },
    {
      id: 'specification-basics',
      title: 'Feature Specification Essentials',
      description: 'Write clear, comprehensive feature specifications',
      duration: '35 minutes',
      level: 'Beginner',
      category: 'specification',
      steps: [
        {
          title: 'Anatomy of a Great Specification',
          content: 'Understand what makes a specification effective and executable',
          type: 'content',
          keyPoints: ['Clear user stories', 'Acceptance criteria', 'Non-functional requirements', 'Integration requirements'],
          exercise: {
            type: 'analysis',
            question: 'Identify the missing element in this specification: "User login system with Google OAuth"',
            answer: 'Acceptance criteria and integration requirements'
          }
        },
        {
          title: 'Writing User Stories',
          content: 'Craft user stories that drive implementation',
          type: 'interactive',
          exercise: {
            type: 'story-writing',
            question: 'Write a user story for a password reset feature:',
            template: 'As a [user type], I want to [action] so that [benefit]'
          }
        }
      ]
    },
    {
      id: 'planning-basics',
      title: 'Implementation Planning Fundamentals',
      description: 'Create effective implementation plans from specifications',
      duration: '40 minutes',
      level: 'Beginner',
      category: 'planning',
      steps: [
        {
          title: 'From Spec to Plan',
          content: 'Transform specifications into actionable implementation plans',
          type: 'content',
          keyPoints: ['Technology selection', 'Architecture decisions', 'Resource planning', 'Timeline estimation'],
          exercise: {
            type: 'planning',
            question: 'Create a high-level plan for a user authentication system',
            requirements: ['User registration', 'Login/logout', 'Password reset', 'Profile management']
          }
        }
      ]
    },
    {
      id: 'testing-basics',
      title: 'Testing in SDD',
      description: 'Master test-first development in the SDD methodology',
      duration: '30 minutes',
      level: 'Beginner',
      category: 'testing',
      steps: [
        {
          title: 'Test-First Imperative',
          content: 'Understand why tests come before implementation',
          type: 'content',
          keyPoints: ['Red-Green-Refactor cycle', 'Contract testing', 'Integration testing', 'Test coverage goals'],
          exercise: {
            type: 'test-writing',
            question: 'Write a test for a user authentication function:',
            specification: 'Function should validate email format and password strength'
          }
        }
      ]
    },
    // INTERMEDIATE TUTORIALS
    {
      id: 'advanced-specification',
      title: 'Advanced Specification Techniques',
      description: 'Handle complex requirements and edge cases',
      duration: '45 minutes',
      level: 'Intermediate',
      category: 'specification',
      steps: [
        {
          title: 'Handling Ambiguity',
          content: 'Learn techniques to clarify and resolve specification uncertainties',
          type: 'interactive',
          exercise: {
            type: 'clarification',
            question: 'Identify and clarify ambiguities in this specification',
            specification: 'Build a fast payment system'
          }
        }
      ]
    },
    {
      id: 'complex-planning',
      title: 'Complex Project Planning',
      description: 'Plan multi-component, scalable systems',
      duration: '50 minutes',
      level: 'Intermediate',
      category: 'planning',
      steps: [
        {
          title: 'Multi-Project Architecture',
          content: 'Design systems that scale across multiple projects',
          type: 'content',
          keyPoints: ['Microservices vs monolith', 'API design', 'Data architecture', 'Deployment strategy'],
          exercise: {
            type: 'architecture',
            question: 'Design a microservice architecture for an e-commerce platform',
            constraints: ['Must handle 10k+ users', 'Needs payment processing', 'Requires inventory management']
          }
        },
        {
          title: 'Real-World Case Study: E-Commerce Platform',
          content: 'Learn from a real SDD implementation case study',
          type: 'case-study',
          caseStudy: {
            title: 'ShopFlow: E-Commerce Platform Transformation',
            background: 'ShopFlow, a growing e-commerce platform, needed to scale from 1,000 to 50,000 daily users while maintaining 99.9% uptime.',
            challenge: 'Legacy monolith architecture couldn\'t handle the scale, and the team lacked clear specifications for the migration.',
            solution: 'Implemented SDD methodology to create detailed specifications for a microservice migration.',
            process: [
              'Phase 1: Constitution setup establishing microservices principles',
              'Phase 2: Feature specifications for each service (User, Product, Order, Payment)',
              'Phase 3: Implementation plans with migration strategies',
              'Phase 4: Task-based execution with rollback procedures'
            ],
            outcomes: [
              'Successfully migrated to microservices architecture',
              'Achieved 99.95% uptime during migration',
              'Reduced deployment time from 2 hours to 5 minutes',
              'Improved team productivity by 40%'
            ],
            lessons: [
              'Detailed specifications prevented critical oversights',
              'Constitutional principles guided architectural decisions',
              'Task-based execution enabled controlled, trackable progress'
            ]
          },
          exercise: {
            type: 'analysis',
            question: 'Analyze this case study: What were the key success factors in ShopFlow\'s transformation?',
            keyPoints: ['Specification quality', 'Constitutional compliance', 'Task breakdown', 'Team coordination']
          }
        }
      ]
    },
    {
      id: 'integration-testing',
      title: 'Integration Testing Mastery',
      description: 'Build robust integration tests for complex systems',
      duration: '40 minutes',
      level: 'Intermediate',
      category: 'testing',
      steps: [
        {
          title: 'Contract-Driven Testing',
          content: 'Use contracts to ensure system integration',
          type: 'interactive',
          exercise: {
            type: 'contract',
            question: 'Define API contracts for user management service',
            endpoints: ['POST /users', 'GET /users/{id}', 'PUT /users/{id}']
          }
        }
      ]
    },
    {
      id: 'cli-mastery',
      title: 'CLI Command Mastery',
      description: 'Become proficient with all SDD CLI commands',
      duration: '35 minutes',
      level: 'Intermediate',
      category: 'tools',
      steps: [
        {
          title: 'Advanced /specify Usage',
          content: 'Master advanced features of the /specify command',
          type: 'interactive',
          exercise: {
            type: 'command-advanced',
            question: 'Use /specify with templates and variables',
            scenario: 'Create a specification for a real-time chat application'
          }
        }
      ]
    },
    // ADVANCED TUTORIALS
    {
      id: 'large-scale-sdd',
      title: 'Large-Scale SDD Implementation',
      description: 'Implement SDD across enterprise teams and projects',
      duration: '60 minutes',
      level: 'Advanced',
      category: 'enterprise',
      steps: [
        {
          title: 'Team Coordination',
          content: 'Coordinate multiple teams using SDD methodology',
          type: 'content',
          keyPoints: ['Constitutional alignment', 'Specification governance', 'Integration points', 'Quality gates'],
          exercise: {
            type: 'coordination',
            question: 'Plan SDD implementation for 3 teams working on different parts of a system',
            teams: ['Frontend', 'Backend', 'DevOps'],
            integrationPoints: ['API contracts', 'Authentication', 'Deployment pipeline']
          }
        }
      ]
    },
    {
      id: 'performance-optimization',
      title: 'Performance Optimization in SDD',
      description: 'Optimize performance while maintaining SDD principles',
      duration: '45 minutes',
      level: 'Advanced',
      category: 'performance',
      steps: [
        {
          title: 'Performance-First Specifications',
          content: 'Write specifications that include performance requirements',
          type: 'interactive',
          exercise: {
            type: 'performance-spec',
            question: 'Add performance requirements to a high-traffic API specification',
            constraints: ['<100ms response time', '1000+ concurrent users', '99.9% uptime']
          }
        }
      ]
    },
    {
      id: 'sdd-patterns',
      title: 'SDD Design Patterns',
      description: 'Master common patterns and best practices in SDD',
      duration: '50 minutes',
      level: 'Advanced',
      category: 'patterns',
      steps: [
        {
          title: 'Constitutional Patterns',
          content: 'Learn proven patterns for constitutional compliance',
          type: 'content',
          keyPoints: ['Simplicity patterns', 'Anti-abstraction patterns', 'Integration patterns', 'Testing patterns'],
          exercise: {
            type: 'pattern-application',
            question: 'Apply constitutional patterns to a complex system design',
            system: 'Distributed e-commerce platform with multiple services'
          }
        }
      ]
    }
  ]

  // Skill assessment questions
  const skillAssessmentQuestions = [
    {
      id: 'experience',
      question: 'What is your experience level with software development?',
      type: 'multiple-choice',
      options: ['Beginner (0-1 years)', 'Intermediate (1-3 years)', 'Advanced (3-5 years)', 'Expert (5+ years)'],
      category: 'experience'
    },
    {
      id: 'familiarity',
      question: 'How familiar are you with Spec-Driven Development?',
      type: 'multiple-choice',
      options: ['Never heard of it', 'Basic understanding', 'Some experience', 'Very experienced'],
      category: 'sdd'
    },
    {
      id: 'spec-writing',
      question: 'How comfortable are you writing technical specifications?',
      type: 'multiple-choice',
      options: ['Not comfortable at all', 'Somewhat comfortable', 'Very comfortable', 'Expert level'],
      category: 'writing'
    },
    {
      id: 'tools',
      question: 'Which development tools do you regularly use?',
      type: 'multi-select',
      options: ['CLI tools', 'IDEs', 'Version control', 'Testing frameworks', 'Documentation tools'],
      category: 'tools'
    },
    {
      id: 'projects',
      question: 'What type of projects interest you most?',
      type: 'multiple-choice',
      options: ['Web applications', 'Mobile apps', 'APIs/Services', 'System tools', 'Documentation'],
      category: 'interests'
    },
    {
      id: 'learning',
      question: 'How do you prefer to learn?',
      type: 'multiple-choice',
      options: ['Reading documentation', 'Hands-on exercises', 'Video tutorials', 'Interactive tutorials', 'Real projects'],
      category: 'learning'
    }
  ]

  // Adaptive learning logic
  const calculateSkillLevel = (answers) => {
    let score = 0

    // Experience scoring
    const experienceMap = {
      'Beginner (0-1 years)': 1,
      'Intermediate (1-3 years)': 2,
      'Advanced (3-5 years)': 3,
      'Expert (5+ years)': 4
    }
    score += experienceMap[answers.experience] || 1

    // SDD familiarity scoring
    const familiarityMap = {
      'Never heard of it': 1,
      'Basic understanding': 2,
      'Some experience': 3,
      'Very experienced': 4
    }
    score += familiarityMap[answers.familiarity] || 1

    // Spec writing comfort scoring
    const writingMap = {
      'Not comfortable at all': 1,
      'Somewhat comfortable': 2,
      'Very comfortable': 3,
      'Expert level': 4
    }
    score += writingMap[answers['spec-writing']] || 1

    // Tools familiarity (bonus points for more tools)
    const tools = answers.tools || []
    score += Math.min(tools.length, 2)

    return score
  }

  const generateLearningPath = (skillLevel, userAnswers) => {
    let recommendedPath = []

    if (skillLevel <= 6) {
      // Beginner path
      recommendedPath = [
        'sdd-fundamentals',
        'getting-started',
        'basic-commands',
        'specification-basics',
        'implementation-planning',
        'quick-start-exercise'
      ]
    } else if (skillLevel <= 10) {
      // Intermediate path
      recommendedPath = [
        'sdd-fundamentals',
        'advanced-specification',
        'complex-planning',
        'workflow-optimization',
        'testing-strategies',
        'integration-patterns'
      ]
    } else {
      // Advanced path
      recommendedPath = [
        'advanced-specification',
        'complex-planning',
        'workflow-optimization',
        'testing-strategies',
        'integration-patterns',
        'constitutional-patterns'
      ]
    }

    // Add project-specific recommendations
    const projectInterests = userAnswers.projects
    if (projectInterests === 'Web applications') {
      recommendedPath.push('quick-start-exercise')
    } else if (projectInterests === 'APIs/Services') {
      recommendedPath.push('complex-planning')
    }

    return recommendedPath
  }

  const startSkillAssessment = () => {
    setShowSkillAssessment(true)
    setAssessmentAnswers({})
  }

  const completeSkillAssessment = () => {
    const skillLevel = calculateSkillLevel(assessmentAnswers)
    const path = generateLearningPath(skillLevel, assessmentAnswers)

    setUserSkillLevel(skillLevel)
    setRecommendedTutorials(tutorials.filter(t => path.includes(t.id)))
    setShowSkillAssessment(false)
  }

  // Achievement definitions
  const achievementDefinitions = [
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Complete your first tutorial',
      icon: '👶',
      points: 50,
      condition: (progress) => Object.keys(progress).length >= 1 && Object.values(progress).some(p => p.completed)
    },
    {
      id: 'quick-learner',
      title: 'Quick Learner',
      description: 'Complete 3 tutorials',
      icon: '🚀',
      points: 150,
      condition: (progress) => Object.values(progress).filter(p => p.completed).length >= 3
    },
    {
      id: 'sdd-master',
      title: 'SDD Master',
      description: 'Complete all beginner tutorials',
      icon: '🎓',
      points: 300,
      condition: (progress) => {
        const beginnerTutorials = tutorials.filter(t => t.level === 'Beginner')
        return beginnerTutorials.every(t => progress[t.id]?.completed)
      }
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Complete a tutorial with 100% exercise accuracy',
      icon: '💯',
      points: 200,
      condition: (progress) => Object.values(progress).some(p => p.completed && p.exerciseAccuracy === 100)
    },
    {
      id: 'consistent-learner',
      title: 'Consistent Learner',
      description: 'Complete tutorials on 3 consecutive days',
      icon: '📅',
      points: 250,
      condition: (progress, streak) => streak >= 3
    },
    {
      id: 'explorer',
      title: 'Explorer',
      description: 'Try tutorials from all difficulty levels',
      icon: '🗺️',
      points: 400,
      condition: (progress) => {
        const completedLevels = new Set()
        Object.entries(progress).forEach(([tutorialId, p]) => {
          if (p.completed) {
            const tutorial = tutorials.find(t => t.id === tutorialId)
            if (tutorial) completedLevels.add(tutorial.level)
          }
        })
        return completedLevels.size >= 3
      }
    },
    {
      id: 'expert-level',
      title: 'Expert Level',
      description: 'Complete all advanced tutorials',
      icon: '🏆',
      points: 500,
      condition: (progress) => {
        const advancedTutorials = tutorials.filter(t => t.level === 'Advanced')
        return advancedTutorials.every(t => progress[t.id]?.completed)
      }
    }
  ]

  // Progress tracking functions
  const updateTutorialProgress = (tutorialId, progressData) => {
    const newProgress = {
      ...userProgress,
      [tutorialId]: {
        ...userProgress[tutorialId],
        ...progressData,
        lastAccessed: new Date().toISOString()
      }
    }

    setUserProgress(newProgress)

    // Update activity streak
    const today = new Date().toDateString()
    const lastActivity = lastActivityDate ? new Date(lastActivityDate).toDateString() : null

    if (lastActivity !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      if (lastActivity === yesterday.toDateString()) {
        setStreakDays(prev => prev + 1)
      } else if (lastActivity) {
        setStreakDays(1)
      } else {
        setStreakDays(1)
      }
      setLastActivityDate(today)
    }

    // Check for new achievements
    checkAndAwardAchievements(newProgress)

    // Update points
    const pointsEarned = progressData.pointsEarned || 0
    if (pointsEarned > 0) {
      setTotalPoints(prev => prev + pointsEarned)
    }
  }

  const completeTutorial = (tutorialId, exerciseAccuracy = 0) => {
    const pointsEarned = Math.round(100 * (1 + exerciseAccuracy / 100))

    updateTutorialProgress(tutorialId, {
      completed: true,
      exerciseAccuracy: Math.round(exerciseAccuracy),
      completedAt: new Date().toISOString(),
      pointsEarned: pointsEarned
    })
  }

  const checkAndAwardAchievements = (progress) => {
    const newAchievements = []

    achievementDefinitions.forEach(achievement => {
      if (!achievements.includes(achievement.id) && achievement.condition(progress, streakDays)) {
        newAchievements.push(achievement.id)
        setAchievements(prev => [...prev, achievement.id])
        setTotalPoints(prev => prev + achievement.points)
      }
    })

    if (newAchievements.length > 0) {
      // Show achievement notifications
      setTimeout(() => {
        setShowAchievementNotifications(true)
        setTimeout(() => setShowAchievementNotifications(false), 5000)
      }, 1000)
    }
  }

  const getTutorialStats = () => {
    const completedCount = Object.values(userProgress).filter(p => p.completed).length
    const totalCount = tutorials.length
    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
    const averageAccuracy = Object.values(userProgress).filter(p => p.exerciseAccuracy).reduce((sum, p) => sum + p.exerciseAccuracy, 0) / completedCount || 0

    return {
      completedCount,
      totalCount,
      completionRate,
      averageAccuracy: Math.round(averageAccuracy),
      totalPoints,
      streakDays,
      achievementsCount: achievements.length
    }
  }

  // Community features data and functions
  const communityPostsData = [
    {
      id: 1,
      author: 'Alex Chen',
      avatar: '👨‍💻',
      title: 'Best practices for writing SDD specifications',
      content: 'I\'ve been using SDD for 6 months now and wanted to share some tips for writing better specifications...',
      category: 'discussion',
      likes: 24,
      comments: 8,
      timestamp: '2 hours ago',
      tags: ['specifications', 'best-practices'],
      replies: [
        {
          id: 101,
          author: 'Sarah Kim',
          avatar: '👩‍💼',
          content: 'Great tips! I especially agree with the "be specific" point.',
          timestamp: '1 hour ago'
        }
      ]
    },
    {
      id: 2,
      author: 'Marcus Johnson',
      avatar: '🚀',
      title: 'How SDD saved our startup project',
      content: 'We were about to fail our project until we adopted SDD methodology. Here\'s our success story...',
      category: 'success-story',
      likes: 42,
      comments: 15,
      timestamp: '1 day ago',
      tags: ['success-story', 'startup'],
      replies: []
    }
  ]

  const peerReviewRequests = [
    {
      id: 1,
      author: 'Emma Wilson',
      avatar: '🎯',
      title: 'Review: E-commerce platform specification',
      content: 'Would appreciate feedback on my SDD specification for a new e-commerce platform.',
      category: 'review-request',
      status: 'pending',
      timestamp: '3 hours ago',
      tags: ['review', 'e-commerce'],
      difficulty: 'Intermediate'
    },
    {
      id: 2,
      author: 'David Park',
      avatar: '🔧',
      title: 'Review: CLI tool specification',
      content: 'Looking for feedback on my CLI tool specification before implementation.',
      category: 'review-request',
      status: 'in-progress',
      timestamp: '5 hours ago',
      tags: ['review', 'cli'],
      difficulty: 'Beginner'
    }
  ]

  const createCommunityPost = () => {
    if (newPostContent.trim()) {
      const newPost = {
        id: communityPosts.length + 1,
        author: 'You',
        avatar: '😊',
        title: 'New Discussion',
        content: newPostContent,
        category: 'discussion',
        likes: 0,
        comments: 0,
        timestamp: 'Just now',
        tags: [],
        replies: []
      }

      setCommunityPosts(prev => [newPost, ...prev])
      setNewPostContent('')
      setShowCreatePost(false)

      // Award reputation points
      setUserReputation(prev => prev + 10)
    }
  }

  const getCommunityStats = () => {
    return {
      totalPosts: communityPostsData.length + communityPosts.length,
      totalMembers: 1247,
      activeNow: 89,
      yourReputation: userReputation
    }
  }

  // Enhanced content rendering functions
  const renderVideoContent = (videoData) => {
    return (
      <div style={{ margin: '1.5rem 0' }}>
        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
          {!mediaLoaded[videoData.url] && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontSize: '3rem',
              zIndex: 1
            }}>
              ▶️
            </div>
          )}
          <video
            style={{ width: '100%', maxHeight: '400px', display: 'block' }}
            controls
            poster={videoData.thumbnail}
            onLoadedData={() => setMediaLoaded(prev => ({ ...prev, [videoData.url]: true }))}
          >
            <source src={videoData.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#718096' }}>
          📹 {videoData.duration} • {videoData.description}
        </div>
      </div>
    )
  }

  const renderDiagramContent = (diagramData) => {
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
                    <div style={{ fontWeight: '600', color: '#667eea', fontSize: '0.9rem' }}>
                      {element.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.25rem' }}>
                      {element.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderCaseStudyContent = (caseStudyData) => {
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

          {caseStudyData.outcomes && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{ color: '#2b6cb0', marginBottom: '0.75rem' }}>Outcomes</h5>
              <ul style={{ textAlign: 'left', paddingLeft: '1.5rem', color: '#48bb78' }}>
                {caseStudyData.outcomes.map((outcome, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>✓ {outcome}</li>
                ))}
              </ul>
            </div>
          )}

          {caseStudyData.lessons && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{ color: '#2b6cb0', marginBottom: '0.75rem' }}>Key Lessons</h5>
              <ul style={{ textAlign: 'left', paddingLeft: '1.5rem', color: '#4a5568' }}>
                {caseStudyData.lessons.map((lesson, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>💡 {lesson}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Handle variable input changes
  const handleVariableChange = (templateIndex, variableKey, value) => {
    setPromptVariables(prev => ({
      ...prev,
      [`${templateIndex}_${variableKey}`]: value
    }))
  }

  // Toggle template expansion
  const toggleTemplate = (templateIndex) => {
    setExpandedTemplates(prev => {
      const newExpanded = [...prev]
      newExpanded[templateIndex] = !newExpanded[templateIndex]
      return newExpanded
    })
  }

  // Generate prompt with variable substitution
  const generatePrompt = (templateIndex) => {
    setGeneratingPrompt(true)
    setGenerateSuccess(false)

    // Simulate a brief delay for better UX feedback
    setTimeout(() => {
      const template = promptTemplates[templateIndex]
      let prompt = template.template

      // Replace variables with user input
      template.variables.forEach(variable => {
        const key = `${templateIndex}_${variable.key}`
        const value = promptVariables[key] || `[${variable.key.toUpperCase()}]`
        prompt = prompt.replace(new RegExp(`{${variable.key}}`, 'g'), value)
      })

      setPromptGeneratorGeneratedPrompt(prompt)
      setGeneratingPrompt(false)
      setGenerateSuccess(true)

      // Reset success state after 3 seconds
      setTimeout(() => {
        setGenerateSuccess(false)
      }, 3000)
    }, 800)
  }

  // Auto-populate template variables based on selected scenario
  const applyScenario = (scenarioId) => {
    const scenario = scenarioPresets.find(s => s.id === scenarioId)
    if (!scenario) return

    setSelectedScenario(scenarioId)

    // Clear existing variables
    const newVariables = {}

    // Populate variables for all templates based on scenario
    promptTemplates.forEach((template, templateIndex) => {
      let varsKey
      switch (templateIndex) {
        case 0: // Constitution
          varsKey = 'constitutionVars'
          break
        case 1: // Specification
          varsKey = 'featureSpecVars'
          break
        case 2: // Clarification
          varsKey = 'clarifyVars'
          break
        case 3: // Implementation Plan
          varsKey = 'implementationPlanVars'
          break
        case 4: // Task List
          varsKey = 'taskListVars'
          break
        case 5: // Analysis
          varsKey = 'analysisVars'
          break
        case 6: // Implementation
          varsKey = 'implementationVars'
          break
        default:
          return
      }

      const scenarioVars = scenario[varsKey]

      if (scenarioVars) {
        template.variables.forEach(variable => {
          const key = `${templateIndex}_${variable.key}`
          newVariables[key] = scenarioVars[variable.key] || ''
        })
      }
    })

    setPromptVariables(newVariables)
  }

  // Clear scenario selection
  const clearScenario = () => {
    setSelectedScenario(null)
    setPromptVariables({})
  }

  // Handle tutorial progress
  const completeTutorialStep = () => {
    if (tutorialProgress < 100) {
      setTutorialProgress(prev => Math.min(prev + 25, 100))
    }
  }

  // Handle individual SDD workflow step completion
  const completeWorkflowStep = (stepIndex) => {
    const newCompletedSteps = [...completedSteps]
    newCompletedSteps[stepIndex] = true
    setCompletedSteps(newCompletedSteps)

    // Update overall progress
    const completedCount = newCompletedSteps.filter(Boolean).length
    const newProgress = Math.round((completedCount / newCompletedSteps.length) * 100)
    setTutorialProgress(newProgress)
  }

  // Toggle step details expansion
  const toggleStepDetails = (stepIndex) => {
    setExpandedStep(expandedStep === stepIndex ? null : stepIndex)
  }

  // Handle starting a tutorial
  // Tutorial player functions
  const startTutorial = (tutorialIndex) => {
    setActiveTutorial(tutorialIndex)
    setCurrentStep(0)
    setTutorialCompleted(false)
    setExerciseAnswers({})
    setShowTutorialPlayer(true)
  }

  const closeTutorial = () => {
    setShowTutorialPlayer(false)
    setActiveTutorial(null)
    setCurrentStep(0)
    setTutorialCompleted(false)
    setExerciseAnswers({})
  }

  const nextStep = () => {
    const tutorial = tutorials[activeTutorial]
    if (currentStep < tutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1)
      // Update progress for step completion
      updateTutorialProgress(tutorial.id, {
        currentStep: currentStep + 1,
        stepsCompleted: currentStep + 1,
        totalSteps: tutorial.steps.length
      })
    } else {
      // Calculate exercise accuracy
      const exerciseSteps = tutorial.steps.filter(step => step.exercise)
      const correctAnswers = exerciseSteps.filter(step => {
        const stepIndex = tutorial.steps.indexOf(step)
        return exerciseAnswers[stepIndex] === step.exercise.answer
      }).length
      const accuracy = exerciseSteps.length > 0 ? (correctAnswers / exerciseSteps.length) * 100 : 0

      setTutorialCompleted(true)
      completeTutorial(tutorial.id, accuracy)
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleExerciseAnswer = (stepIndex, answer) => {
    setExerciseAnswers(prev => ({
      ...prev,
      [stepIndex]: answer
    }))
  }

  const getTutorialProgress = () => {
    if (!activeTutorial && activeTutorial !== 0) return 0
    const tutorial = tutorials[activeTutorial]
    return ((currentStep + 1) / tutorial.steps.length) * 100
  }

  const renderExercise = (step, stepIndex) => {
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

  // Function to normalize transcript punctuation and spacing
  const normalizeTranscript = (text) => {
    return text
      // Fix spacing around periods, question marks, and exclamation marks
      // Use two spaces after periods, one space after other punctuation
      .replace(/\s*([.!?])\s*/g, (match, punctuation) => {
        return punctuation === '.' ? '.  ' : punctuation + ' '
      })
      // Remove spaces before punctuation
      .replace(/\s+([.!?])/g, '$1')
      // Fix multiple spaces (but preserve double spaces after periods)
      .replace(/([^.!?])\s+/g, '$1 ')
      .replace(/\s{3,}/g, '  ')
      // Fix spacing after commas, colons, and semicolons
      .replace(/\s*([,;:])\s*/g, '$1 ')
      // Remove spaces before commas, colons, and semicolons
      .replace(/\s+([,;:])/g, '$1')
      // Trim leading/trailing whitespace
      .trim()
  }

  // Initialize speech recognition
  useEffect(() => {
    // Check if we're on the client side and speech recognition is supported
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = 'en-US'

      recognitionInstance.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }

        // Show interim results immediately for faster feedback
        if (interimTranscript) {
          setTranscript(prev => {
            // Remove any trailing interim text from previous update
            const baseText = prev.replace(/ [^.!?]*$/, '')
            return baseText + ' ' + interimTranscript
          })
        }

        // Add final results with normalized punctuation (with debounce delay)
        if (finalTranscript) {
          // Clear any existing debounce timer
          if (transcriptDebounceRef.current) {
            clearTimeout(transcriptDebounceRef.current)
          }

          // Set a new timer to delay the transcript update
          transcriptDebounceRef.current = setTimeout(() => {
            setTranscript(prev => {
              // Remove any interim text that might be there
              const baseText = prev.replace(/ [^.!?]*$/, '')
              const combinedText = baseText + finalTranscript
              return normalizeTranscript(combinedText)
            })
          }, 1200) // 1.2 second delay before processing final transcript
        }
      }

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
      }

      recognitionInstance.onend = () => {
        if (isRecording) {
          // Try to restart recognition for continuous recording
          try {
            recognitionInstance.start()
          } catch (err) {
            // If restart fails (e.g., due to silence timeout), update recording state
            console.log('Recording stopped due to silence or timeout')
            setIsRecording(false)
          }
        }
      }

      setRecognition(recognitionInstance)

      return () => {
        // Clear any pending transcript debounce timer
        if (transcriptDebounceRef.current) {
          clearTimeout(transcriptDebounceRef.current)
        }
        try {
          recognitionInstance.stop()
        } catch (error) {
          console.error('Error stopping recognition:', error)
        }
      }
    }
  }, [])

  // Handle recording state changes
  useEffect(() => {
    if (recognition && isRecording) {
      try {
        // Reset save button state when recording starts
        setSaveButtonState('normal')
        recognition.start()
      } catch (error) {
        console.error('Error starting recognition:', error)
        setIsRecording(false)
      }
    } else if (recognition && !isRecording) {
      try {
        recognition.stop()
      } catch (error) {
        console.error('Error stopping recognition:', error)
      }
    }
  }, [isRecording, recognition])

  // Handle save button state reset when recording starts
  useEffect(() => {
    if (isRecording && saveButtonState === 'saved') {
      // Reset to normal after 2 seconds if recording starts while in saved state
      const timer = setTimeout(() => {
        setSaveButtonState('normal')
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isRecording, saveButtonState])

  // Toggle recording function
  const toggleRecording = () => {
    if (!recognition) return

    if (!isRecording) {
      setIsProcessing(true)
      setTimeout(() => setIsProcessing(false), 500) // Brief processing indicator
    }

    setIsRecording(!isRecording)
  }

  return (
    <div className="container">
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
      </header>

      {/* Overview Section */}
      {activeSection === 'overview' && (
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
      )}

  
      {/* Spec-ear-fier Section */}
      {activeSection === 'spec-ear-fier' && (
        <div className="content-section active">
          <div className="card">
            <h3>Spec-ear-fier</h3>
            <p>Capture your thoughts naturally through speech and transform them into structured specifications.</p>
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', fontStyle: 'italic', color: '#000000' }}>
                  "Spec-ear-fier gave me the entry point to spec-kit that I didn't know I needed.  It was like a giant, red easy button from Staples in the early aughts (one you might sit on like a comfy couch) that's allowed me to take my waking nightmare of an idea to a concrete money making machine.  Thanks Sam Altman!" - Matt Brown
                </p>
              </div>
            <div style={{ background: 'rgba(72, 187, 120, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
              <h4 style={{ color: '#48bb78', marginBottom: '1rem' }}>🎯 How to Use This Tool</h4>
              <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                <strong>Spec-ear-fier</strong> is your digital thinking partner for capturing the free formation of ideas.
                It's designed for the messy, iterative process of problem-solving where your best insights emerge
                through natural expression rather than structured forms. 
              </p>
              <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
              <strong>Just talk</strong> and let Spec-ear-fier do the rest.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '1.25rem', borderRadius: '10px', borderLeft: '4px solid #667eea' }}>
                  <h5 style={{ color: '#667eea', marginBottom: '0.75rem', fontSize: '1rem' }}>💭 Free Formation</h5>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
                    Speak naturally about your problem, solution ideas, challenges, and thoughts.
                    Ramble, go off on tangents, challenge your assumptions—this is where innovation happens.
                  </p>
                </div>

                <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '1.25rem', borderRadius: '10px', borderLeft: '4px solid #ec4899' }}>
                  <h5 style={{ color: '#ec4899', marginBottom: '0.75rem', fontSize: '1rem' }}>🔍 Deep Exploration</h5>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
                    Go deep into technical details or stay at a high level. Discuss edge cases,
                    potential failures, user needs, and implementation considerations as they come to mind.
                  </p>
                </div>

                <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1.25rem', borderRadius: '10px', borderLeft: '4px solid #f59e0b' }}>
                  <h5 style={{ color: '#f59e0b', marginBottom: '0.75rem', fontSize: '1rem' }}>🧠 Challenge & Distill</h5>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
                    Question your own assumptions, explore alternative approaches,
                    and distill complex thoughts into actionable insights through the process of speaking.
                  </p>
                </div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.25rem', borderRadius: '10px', marginTop: '1.5rem', border: '1px solid #10b981' }}>
                <h5 style={{ color: '#059669', marginBottom: '0.75rem', fontSize: '1rem' }}>🚀 From Thoughts to Specifications</h5>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Once you've captured your thoughts, the real magic happens. Your raw transcript becomes
                  the foundation for creating precise <code style={{ background: '#e5e7eb', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>/specify</code> and
                  <code style={{ background: '#e5e7eb', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>/clarify</code> commands that transform your
                  spoken ideas into structured, executable specifications for AI-driven development.
                </p>
              </div>
            </div>

            <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
              <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>💡 Pro Tips for Effective Sessions</h4>

              <ol style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem', marginBottom: '1rem', color: '#000000' }}>
                <li><strong>Start with the problem:</strong> Describe what you're trying to solve and why it matters</li>
                <li><strong>Think out loud:</strong> Verbalize your thought process, including dead ends and realizations</li>
                <li><strong>Embrace imperfection:</strong> Your first ideas don't need to be polished—capture them anyway</li>
                <li><strong>Connect the dots:</strong> Explain how different concepts relate to each other</li>
                <li><strong>Consider alternatives:</strong> Discuss different approaches and their trade-offs</li>
              </ol>

              <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', fontStyle: 'italic', color: '#000000' }}>
                  "The best specifications emerge from the messy process of thinking through problems out loud.
                  Spec-ear-fier captures that creative energy and transforms it into structured precision." - a person from thispersondoesnotexist.com
                </p>
              </div>
            </div>

            <div style={{ background: 'rgba(237, 137, 54, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
              <h4 style={{ color: '#ed8936', marginBottom: '1rem' }}>🎙️ Rick Rubin Machine</h4>

              {/* Browser Compatibility Warning */}
              {!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
                <div style={{ background: 'rgba(245, 101, 101, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #f56565' }}>
                  <p style={{ color: '#e53e3e', margin: 0 }}>
                    <strong>Browser Not Supported:</strong> Speech Recognition is not supported in your browser.
                    Please use Chrome, Edge, or Safari for this feature.
                  </p>
                </div>
              )}

              {/* Controls */}
              <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  onClick={toggleRecording}
                  disabled={!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: isRecording ? '#e53e3e' : '#48bb78',
                    color: 'white',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isRecording ? '⏹️ Stop Recording' : '🎙️ Start Recording'}
                </button>

                <div style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  backgroundColor: isProcessing ? '#feebc8' : isRecording ? '#fed7d7' : '#c6f6d5',
                  color: isProcessing ? '#c05621' : isRecording ? '#c53030' : '#276749',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}>
                  {isProcessing && (
                    <span style={{ animation: 'pulse 1s infinite' }}>⚡</span>
                  )}
                  {isRecording && (
                    <span style={{ animation: 'pulse 1.5s infinite' }}>🔴</span>
                  )}
                  {isProcessing ? 'Processing...' : isRecording ? 'Recording...' : 'Ready'}
                </div>
              </div>

              {/* Text Output */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d3748' }}>
                  It's The Word... It's The Word... It's The Word... It's The Word...
                  {isRecording && (
                    <span style={{
                      marginLeft: '0.5rem',
                      fontSize: '0.75rem',
                      color: '#48bb78',
                      fontWeight: 'normal'
                    }}>
                      🎤 Listening... (interim results shown instantly)
                    </span>
                  )}
                </label>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Your words will appear here as words..."
                  style={{
                    width: '100%',
                    minHeight: '300px',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: isRecording ? '2px solid #48bb78' : '2px solid #e2e8f0',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    boxShadow: isRecording ? '0 0 0 3px rgba(72, 187, 120, 0.1)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                />
                {isRecording && transcript.length === 0 && (
                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#718096',
                    fontStyle: 'italic'
                  }}>
                    💡 Speak now and you'll see text appear immediately as you talk...
                  </div>
                )}
              </div>

              {/* Controls Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                {/* Do Not Save Toggle */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  color: '#4a5568',
                  backgroundColor: doNotSave ? 'rgba(245, 101, 101, 0.1)' : 'rgba(72, 187, 120, 0.1)',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: `1px solid ${doNotSave ? '#f56565' : '#48bb78'}`,
                  transition: 'all 0.3s ease'
                }}>
                  <input
                    type="checkbox"
                    checked={doNotSave}
                    onChange={(e) => setDoNotSave(e.target.checked)}
                    style={{ margin: 0 }}
                  />
                  <span style={{ fontWeight: '500' }}>
                    {doNotSave ? '🚫 Do Not Save' : '💾 Save on Clear'}
                  </span>
                </label>

                {/* Clear Button */}
                <button
                  onClick={(event) => {
                    if (!doNotSave && transcript.trim()) {
                      // Save as markdown file
                      setSaveButtonState('saving')
                      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
                      const filename = `spec-ear-fier-transcript-${timestamp}.md`
                      const content = `# Spec-ear-fier Transcript

**Date:** ${new Date().toLocaleString()}
**Duration:** ${isRecording ? 'Recording in progress' : 'Completed'}

## Transcript

${transcript}

---
*Generated by Spec-ear-fier*
`

                      const blob = new Blob([content], { type: 'text/markdown' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = filename
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                      URL.revokeObjectURL(url)

                      // Show success feedback
                      setSaveButtonState('saved')

                      // Auto-revert logic
                      const revertTime = isRecording ? 2000 : 4000
                      setTimeout(() => {
                        if (!isRecording) {
                          setSaveButtonState('normal')
                        }
                      }, revertTime)
                    }

                    setTranscript('')
                  }}
                  disabled={!transcript.trim()}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: saveButtonState === 'saved' ? '#48bb78' :
                                     !transcript.trim() ? '#f7fafc' : 'white',
                    color: saveButtonState === 'saved' ? 'white' :
                            !transcript.trim() ? '#a0aec0' : '#4a5568',
                    cursor: !transcript.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    minWidth: '120px'
                  }}
                >
                  {saveButtonState === 'saved' ? '✅ Saved!' :
                   saveButtonState === 'saving' ? '💾 Saving...' :
                   !doNotSave ? '💾 Save & Clear' : '🗑️ Clear Only'}
                </button>
              </div>

              {/* Save Status */}
              {!doNotSave && transcript.trim() && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(72, 187, 120, 0.1)',
                  border: '1px solid #48bb78',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#276749'
                }}>
                  💡 <strong>Auto-save enabled:</strong> When you click "Save & Clear", your transcript will be saved as a markdown file with timestamp.
                </div>
              )}

              {doNotSave && transcript.trim() && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(245, 101, 101, 0.1)',
                  border: '1px solid #f56565',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#c53030'
                }}>
                  ⚠️ <strong>Do not save mode:</strong> Text will be permanently deleted when you click "Clear Only".
                </div>
              )}

              {/* Generate Prompt Button */}
              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button
                  onClick={() => {
                    if (!transcript.trim()) return

                    setGeneratingPrompt(true)

                    // Create the comprehensive prompt
                    const prompt = `# Spec-ear-fier Analysis: From Ideas to Structured Specifications

## Context
You are acting as an expert Business Development Specialist working with a development team that uses **spec-kit** for Spec-Driven Development (SDD). The team has captured their raw thoughts and ideas through a spoken brainstorming session, which has been transcribed below.

## Your Mission
Analyze the following transcript and help the team transform their free-flowing ideas into structured, actionable **spec-kit** commands. Your goal is to extract the essence of their solution concept and organize it into:

1. **\`/specify\` prompts** - For defining clear feature specifications
2. **\`/clarify\` commands** - For gathering additional information needed

## Analysis Guidelines

### Step 1: Understand the Core Concept
- Identify the primary problem or opportunity being discussed
- Extract key stakeholders and their needs
- Note any technical constraints or preferences mentioned
- Identify the main value proposition or business objective

### Step 2: Extract Potential Features
- Look for specific functionality mentioned
- Identify user pain points that suggest feature needs
- Note any technical components or integrations discussed
- Extract performance, scalability, or usability requirements

### Step 3: Identify Clarification Needs
- Look for assumptions that need validation
- Identify missing technical details
- Note areas where requirements seem ambiguous
- Find places where user research or market validation might be needed

### Step 4: Organize by Priority
- Distinguish between must-have and nice-to-have features
- Identify dependencies between features
- Note any time-sensitive or business-critical elements

## Transcript of Solution Idea Generation Session

\`\`\`
${transcript}
\`\`\`

---

## Required Output Format

Please format your response as **markdown** with the following structure:

### Analysis Summary
[Brief summary of what you understand about the project concept]

### /specify Prompts
Create separate fenced code blocks for each distinct feature or component:

\`\`\`/specify
[Feature specification prompt here]
\`\`\`

\`\`\`/specify
[Another feature specification prompt here]
\`\`\`

### /clarify Commands
Create separate fenced code blocks for each area needing clarification:

\`\`\`/clarify
[Clarification command here]
\`\`\`

\`\`\`/clarify
[Another clarification command here]
\`\`\`

### Additional Notes
[Any context, warnings, or suggestions for the development team]

---

## Tips for High-Quality Output
- Focus on **actionable** commands that the team can execute immediately
- Each \`/specify\` should define one coherent feature or component
- Each \`/clarify\` should target one specific area of uncertainty
- Use clear, concise language that guides the AI toward useful responses
- Consider the **scope** - don't try to boil the ocean in a single command
- Remember the **SDD methodology** - specifications come before implementation

Now analyze the transcript and provide the team with their next steps for transforming their ideas into structured specifications.`

                    setSpecEarFierGeneratedPrompt(prompt)
                    setGeneratingPrompt(false)
                  }}
                  disabled={!transcript.trim() || generatingPrompt}
                  className="btn"
                  style={{
                    padding: '0.75rem 2rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '0 auto',
                    minWidth: '200px',
                    justifyContent: 'center'
                  }}
                >
                  {generatingPrompt ? (
                    <>
                      <span>⚡</span>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Generate Prompt</span>
                    </>
                  )}
                </button>
                {!transcript.trim() && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#718096', fontStyle: 'italic' }}>
                    Record some speech first to generate a prompt
                  </p>
                )}
              </div>

              {/* Generated Prompt Section */}
              {specEarFierGeneratedPrompt && (
                <div className="card" style={{ marginTop: '2rem' }}>
                  <h4>Generated Prompt:</h4>
                  <div className="prompt-output">{specEarFierGeneratedPrompt}</div>
                  <button
                    className="btn-secondary"
                    onClick={() => navigator.clipboard.writeText(specEarFierGeneratedPrompt)}
                    style={{ marginTop: '1rem' }}
                  >
                    Copy to Clipboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Prompt Generator Section */}
      {activeSection === 'prompts' && (
        <div className="content-section active">
          <div className="card">
            <h3>Interactive Prompt Generator</h3>
            <p>Generate customized prompts for your SDD workflow by filling in the variables below.</p>

            <div style={{ background: 'rgba(237, 137, 54, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem', borderLeft: '4px solid #ed8936' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🎙️</span>
                <h4 style={{ color: '#ed8936', margin: 0, fontSize: '1.1rem' }}>Don't know what to do?</h4>
              </div>
              <p style={{ margin: 0, lineHeight: '1.6', color: '#2d3748' }}>
                <strong>Have you tried the Spec-ear-fier?</strong> Just talk about your ideas naturally, and let the Spec-ear-fier help you transform your thoughts into structured specification prompts. It's perfect for brainstorming and exploring concepts before diving into templates!
              </p>
              <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                <button
                  onClick={() => setActiveSection('spec-ear-fier')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #ed8936',
                    backgroundColor: 'white',
                    color: '#ed8936',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#ed8936'
                    e.target.style.color = 'white'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'white'
                    e.target.style.color = '#ed8936'
                  }}
                >
                  Try Spec-ear-fier →
                </button>
              </div>
            </div>

            <div style={{ background: 'rgba(72, 187, 120, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
              <h4 style={{ color: '#48bb78', marginBottom: '1rem' }}>🎯 How to Use This Tool</h4>
              <ol style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem' }} className="text-dark">
                <li><strong>Choose a template:</strong> Select between Feature Specification or Implementation Plan templates</li>
                <li><strong>Fill in the variables:</strong> Replace the placeholders with your specific project details</li>
                <li><strong>Generate your prompt:</strong> Click the generate button to create your customized prompt</li>
                <li><strong>Copy and use:</strong> Copy the generated prompt to your clipboard and use it with your AI assistant</li>
              </ol>
            </div>

            <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
              <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>💡 Pro Tips</h4>
              <ul style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem' }} className="text-dark">
                <li><strong>Use Quick Start Templates:</strong> Choose a scenario above to auto-populate both templates with industry best practices</li>
                <li>Be specific with your feature descriptions - more detail leads to better specifications</li>
                <li>Consider your technical constraints and requirements before filling variables</li>
                <li>Use the generated prompts as starting points - feel free to customize them further</li>
                <li>Keep your requirements realistic and achievable for the best results</li>
              </ul>
            </div>
          </div>

          {/* Scenario Selection */}
          <div className="card">
            <h4>🚀 Quick Start Templates</h4>
            <p>Choose a scenario to auto-populate both templates with best practices and industry standards:</p>

            {selectedScenario && (
              <div style={{
                background: 'rgba(72, 187, 120, 0.1)',
                padding: '1rem',
                borderRadius: '8px',
                margin: '1rem 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#48bb78', fontWeight: '500' }}>
                  ✅ {scenarioPresets.find(s => s.id === selectedScenario)?.name} template applied
                </span>
                <button
                  className="btn-secondary"
                  onClick={clearScenario}
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                >
                  Clear Selection
                </button>
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
              marginTop: '1.5rem'
            }}>
              {scenarioPresets.map((scenario) => (
                <button
                  key={scenario.id}
                  className={`btn ${selectedScenario === scenario.id ? 'active' : ''}`}
                  onClick={() => applyScenario(scenario.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    padding: '1.2rem',
                    minHeight: '100px',
                    position: 'relative',
                    background: selectedScenario === scenario.id
                      ? 'linear-gradient(135deg, #4c51bf 0%, #553c9a 100%)'
                      : undefined
                  }}
                >
                  <div style={{
                    fontSize: '1.5rem',
                    marginBottom: '0.5rem',
                    filter: selectedScenario === scenario.id ? 'brightness(1.2)' : 'none'
                  }}>
                    {scenario.icon}
                  </div>
                  <div style={{ fontWeight: '600', marginBottom: '0.3rem' }}>
                    {scenario.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: '1.4' }}>
                    {scenario.description}
                  </div>
                  {selectedScenario === scenario.id && (
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem'
                    }}>
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {promptTemplates.map((template, templateIndex) => (
            <div key={templateIndex} className="card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '1rem',
                  margin: '-1rem -1rem 1rem -1rem',
                  borderRadius: '12px 12px 0 0',
                  transition: 'background-color 0.3s ease'
                }}
                onClick={() => toggleTemplate(templateIndex)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div>
                  <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {template.name}
                    <span style={{ fontSize: '0.8rem', color: '#667eea' }}>
                      {expandedTemplates[templateIndex] ? '▼' : '▶'}
                    </span>
                  </h4>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#4a5568' }}>{template.description}</p>
                </div>
              </div>

              {expandedTemplates[templateIndex] && (
                <div>
                  {/* Why Section */}
                  <div style={{ background: 'rgba(72, 187, 120, 0.1)', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
                    <h5 style={{ color: '#48bb78', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      💡 Why
                    </h5>
                    <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.6' }}>{template.why}</p>
                  </div>

                  {/* When to Change Your Constitution Section */}
                  {template.whenToChange && (
                    <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
                      <h5 style={{ color: '#ec4899', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🔄 When to Change Your Constitution
                      </h5>
                      <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{template.whenToChange}</p>
                    </div>
                  )}

                  {/* What to Do Next Section */}
                  <div style={{ background: 'rgba(237, 137, 54, 0.1)', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
                    <h5 style={{ color: '#ed8936', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      🎯 What to Do Next
                    </h5>
                    <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{template.whatToDoNext}</p>
                  </div>

                  {template.variables.length > 0 && (
                    <div style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '1rem', borderRadius: '8px', margin: '1rem 0', border: '1px solid #e2e8f0' }}>
                      <h5 style={{ marginBottom: '1rem' }}>📝 Template Instructions:</h5>
                      {template.templateInstructions ? (
                        <p style={{ fontSize: '0.9rem', color: '#4a5568', marginBottom: '1rem', whiteSpace: 'pre-line' }}>
                          {template.templateInstructions}
                        </p>
                      ) : (
                        <>
                          <p style={{ fontSize: '0.9rem', color: '#4a5568', marginBottom: '1rem' }}>
                            Fill in all the variables below to customize your template. Each placeholder will be replaced with your specific information.
                          </p>

                          <h5>Variables to Complete:</h5>
                          {template.variables.map((variable, varIndex) => (
                            <div key={varIndex} className="variable-input">
                              <label>{variable.label}:</label>
                              <input
                                type="text"
                                placeholder={variable.placeholder}
                                value={promptVariables[`${templateIndex}_${variable.key}`] || ''}
                                onChange={(e) => handleVariableChange(templateIndex, variable.key, e.target.value)}
                              />
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}

                  {template.variables.length > 0 && (
                    <button
                      className="btn"
                      onClick={() => generatePrompt(templateIndex)}
                      disabled={generatingPrompt}
                      style={{
                        position: 'relative',
                        minWidth: '140px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        justifyContent: 'center'
                      }}
                    >
                      {generatingPrompt ? (
                        <>
                          <span>⏳</span>
                          <span>Generating...</span>
                        </>
                      ) : generateSuccess ? (
                        <>
                          <span>✅</span>
                          <span>Generated!</span>
                        </>
                      ) : (
                        <>
                          <span>🚀</span>
                          <span>Generate Prompt</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {promptGeneratorGeneratedPrompt && (
            <div className="card">
              <h4>Generated Prompt:</h4>
              <div className="prompt-output">{promptGeneratorGeneratedPrompt}</div>
              <button className="btn-secondary" onClick={() => navigator.clipboard.writeText(promptGeneratorGeneratedPrompt)}>
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      )}

      {/* Interactive Tutorials Section */}
      {activeSection === 'tutorials' && (
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
        </div>
      )}

      {/* Templates Section */}
      {activeSection === 'templates' && (
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
      )}

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

      {/* Community Section */}
      {activeSection === 'community' && (
        <div className="content-section active">
          <div className="card">
            <h3>👥 SDD Community</h3>
            <p>Connect with fellow SDD practitioners, share knowledge, and collaborate on projects.</p>
          </div>

          {/* Community Stats */}
          <div className="card">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '12px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
                  {getCommunityStats().totalMembers}
                </div>
                <div style={{ color: '#4a5568', fontSize: '0.9rem' }}>Community Members</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(72, 187, 120, 0.1)', borderRadius: '12px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#48bb78' }}>
                  {getCommunityStats().totalPosts}
                </div>
                <div style={{ color: '#4a5568', fontSize: '0.9rem' }}>Discussion Posts</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(237, 137, 54, 0.1)', borderRadius: '12px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ed8936' }}>
                  {getCommunityStats().activeNow}
                </div>
                <div style={{ color: '#4a5568', fontSize: '0.9rem' }}>Active Now</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(159, 122, 234, 0.1)', borderRadius: '12px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9f7aea' }}>
                  {getCommunityStats().yourReputation}
                </div>
                <div style={{ color: '#4a5568', fontSize: '0.9rem' }}>Your Reputation</div>
              </div>
            </div>
          </div>

          {/* Community Navigation */}
          <div className="card">
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <button
                className={`btn ${activeCommunityTab === 'discussions' ? 'active' : ''}`}
                onClick={() => setActiveCommunityTab('discussions')}
              >
                💬 Discussions
              </button>
              <button
                className={`btn ${activeCommunityTab === 'peer-reviews' ? 'active' : ''}`}
                onClick={() => setActiveCommunityTab('peer-reviews')}
              >
                🔍 Peer Reviews
              </button>
              <button
                className={`btn ${activeCommunityTab === 'success-stories' ? 'active' : ''}`}
                onClick={() => setActiveCommunityTab('success-stories')}
              >
                🏆 Success Stories
              </button>
              <button
                className="btn-secondary"
                onClick={() => setShowCreatePost(true)}
              >
                ✨ Create Post
              </button>
            </div>

            {/* Discussions Tab */}
            {activeCommunityTab === 'discussions' && (
              <div>
                <h4>Community Discussions</h4>
                {[...communityPostsData, ...communityPosts].map(post => (
                  <div key={post.id} style={{
                    marginBottom: '1.5rem',
                    padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '2rem', marginRight: '1rem' }}>{post.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <h5 style={{ margin: '0', color: '#2d3748' }}>{post.title}</h5>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#718096', fontSize: '0.9rem' }}>
                          {post.author} • {post.timestamp}
                        </p>
                      </div>
                    </div>
                    <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '1rem' }}>
                      {post.content}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                        👍 {post.likes}
                      </button>
                      <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                        💬 {post.comments}
                      </button>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {post.tags.map((tag, index) => (
                          <span key={index} style={{
                            background: 'rgba(102, 126, 234, 0.1)',
                            color: '#667eea',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '12px',
                            fontSize: '0.8rem'
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Peer Reviews Tab */}
            {activeCommunityTab === 'peer-reviews' && (
              <div>
                <h4>Peer Review Requests</h4>
                {peerReviewRequests.map(review => (
                  <div key={review.id} style={{
                    marginBottom: '1.5rem',
                    padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '2rem', marginRight: '1rem' }}>{review.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <h5 style={{ margin: '0', color: '#2d3748' }}>{review.title}</h5>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#718096', fontSize: '0.9rem' }}>
                          {review.author} • {review.timestamp} • {review.difficulty}
                        </p>
                      </div>
                      <div style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        background: review.status === 'pending' ? 'rgba(237, 137, 54, 0.1)' :
                                       review.status === 'in-progress' ? 'rgba(102, 126, 234, 0.1)' :
                                       'rgba(72, 187, 120, 0.1)',
                        color: review.status === 'pending' ? '#ed8936' :
                               review.status === 'in-progress' ? '#667eea' :
                               '#48bb78'
                      }}>
                        {review.status}
                      </div>
                    </div>
                    <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '1rem' }}>
                      {review.content}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                        📝 Review
                      </button>
                      <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                        💬 Comment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Success Stories Tab */}
            {activeCommunityTab === 'success-stories' && (
              <div>
                <h4>Success Stories</h4>
                {communityPostsData.filter(post => post.category === 'success-story').map(story => (
                  <div key={story.id} style={{
                    marginBottom: '1.5rem',
                    padding: '1.5rem',
                    background: 'rgba(72, 187, 120, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(72, 187, 120, 0.2)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '2rem', marginRight: '1rem' }}>{story.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <h5 style={{ margin: '0', color: '#2d3748' }}>{story.title}</h5>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#718096', fontSize: '0.9rem' }}>
                          {story.author} • {story.timestamp}
                        </p>
                      </div>
                    </div>
                    <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '1rem' }}>
                      {story.content}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                        👍 {story.likes}
                      </button>
                      <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                        💬 {story.comments}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tutorial Player Modal */}
      {showTutorialPlayer && activeTutorial !== null && (
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
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Tutorial Header */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '2rem',
              position: 'relative'
            }}>
              <button
                onClick={closeTutorial}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>

              <h2 style={{ margin: '0 0 0.5rem 0' }}>
                {tutorials[activeTutorial].title}
              </h2>
              <p style={{ margin: '0', opacity: 0.9 }}>
                {tutorials[activeTutorial].description}
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.9rem' }}>
                <span>📅 {tutorials[activeTutorial].duration}</span>
                <span>🎯 {tutorials[activeTutorial].level}</span>
                <span>📝 Step {currentStep + 1} of {tutorials[activeTutorial].steps.length}</span>
              </div>

              {/* Progress Bar */}
              <div style={{ marginTop: '1rem', height: '4px', background: 'rgba(255, 255, 255, 0.3)', borderRadius: '2px' }}>
                <div style={{
                  width: `${getTutorialProgress()}%`,
                  height: '100%',
                  background: 'white',
                  borderRadius: '2px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {/* Tutorial Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
              {!tutorialCompleted ? (
                <div>
                  {/* Current Step */}
                  <div>
                    <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>
                      {tutorials[activeTutorial].steps[currentStep].title}
                    </h3>
                    <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                      {tutorials[activeTutorial].steps[currentStep].content}
                    </p>

                    {/* Enhanced Content Types */}
                    {tutorials[activeTutorial].steps[currentStep].video && (
                      renderVideoContent(tutorials[activeTutorial].steps[currentStep].video)
                    )}

                    {tutorials[activeTutorial].steps[currentStep].diagram && (
                      renderDiagramContent(tutorials[activeTutorial].steps[currentStep].diagram)
                    )}

                    {tutorials[activeTutorial].steps[currentStep].caseStudy && (
                      renderCaseStudyContent(tutorials[activeTutorial].steps[currentStep].caseStudy)
                    )}

                    {/* Key Points */}
                    {tutorials[activeTutorial].steps[currentStep].keyPoints && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ color: '#667eea', marginBottom: '0.75rem' }}>🔑 Key Points:</h4>
                        <ul style={{ textAlign: 'left', paddingLeft: '1.5rem', color: '#4a5568' }}>
                          {tutorials[activeTutorial].steps[currentStep].keyPoints.map((point, index) => (
                            <li key={index} style={{ marginBottom: '0.5rem' }}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Exercise */}
                    {tutorials[activeTutorial].steps[currentStep].exercise && (
                      renderExercise(tutorials[activeTutorial].steps[currentStep], currentStep)
                    )}
                  </div>

                  {/* Navigation */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '2rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #e2e8f0'
                  }}>
                    <button
                      onClick={previousStep}
                      disabled={currentStep === 0}
                      className={`btn-secondary ${currentStep === 0 ? 'disabled' : ''}`}
                      style={{ opacity: currentStep === 0 ? 0.5 : 1 }}
                    >
                      ← Previous
                    </button>

                    <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                      {currentStep + 1} of {tutorials[activeTutorial].steps.length} steps
                    </div>

                    <button
                      onClick={nextStep}
                      className="btn"
                    >
                      {currentStep === tutorials[activeTutorial].steps.length - 1 ? 'Complete Tutorial' : 'Next →'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Tutorial Completion */
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                  <h2 style={{ color: '#48bb78', marginBottom: '1rem' }}>Tutorial Complete!</h2>
                  <p style={{ color: '#4a5568', marginBottom: '2rem', lineHeight: '1.6' }}>
                    Congratulations! You've successfully completed "{tutorials[activeTutorial].title}".
                    You've gained valuable skills in Spec-Driven Development.
                  </p>

                  <div style={{
                    background: 'rgba(72, 187, 120, 0.1)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    textAlign: 'left'
                  }}>
                    <h4 style={{ color: '#48bb78', marginBottom: '1rem' }}>🏆 What You've Achieved:</h4>
                    <ul style={{ textAlign: 'left', color: '#2d3748', marginBottom: 0 }}>
                      <li>Completed {tutorials[activeTutorial].steps.length} learning steps</li>
                      <li>Mastered key SDD concepts</li>
                      <li>Gained hands-on practice experience</li>
                      <li>Built confidence in applying SDD methodology</li>
                    </ul>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={closeTutorial} className="btn">
                      Back to Tutorials
                    </button>
                    <button
                      onClick={() => {
                        setActiveTutorial(null)
                        setShowTutorialPlayer(false)
                        setActiveSection('prompts')
                      }}
                      className="btn-secondary"
                    >
                      Try Practice Exercises
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Theme Toggle Button */}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {isDarkTheme ? '☀️' : '🌙'}
      </button>
    </div>
  )
}

export default App
