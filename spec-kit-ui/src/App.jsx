import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('overview')
  const [promptVariables, setPromptVariables] = useState({})
  const [generatedPrompt, setGeneratedPrompt] = useState('')
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
      why: 'A constitution serves as the foundation for all development decisions, ensuring consistent quality, testing standards, and adherence to SDD principles throughout the project lifecycle.',
      whatToDoNext: '1. Create a constitution file: Copy the generated prompt and save it as ```constitution.md``` in your project root directory\n2. Establish foundation: Execute ```/constitution``` to set up your project\'s governing principles and development guidelines\n3. Reference throughout development: Review your constitution.md file anytime during development\n4. Update as needed: Revise your constitution as project requirements evolve while maintaining core principles',
      template: `Create a comprehensive constitution for the {project_type} project that will govern all development activities and ensure constitutional compliance.

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

## Constitution Command:
${'```'}bash
/constitution
${'```'}

## Directory Structure:
${'```'}
project/
├── memory/
│   └── constitution.md
├── specs/
├── packages/
└── tests/
${'```'}

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
      why: 'Feature specifications capture user requirements, business logic, and acceptance criteria in a structured format. They serve as the foundation for technical planning and ensure all stakeholders have a shared understanding of what needs to be built.',
      whatToDoNext: '1. Create a specification file: Copy the generated prompt and save it as ```spec-feature-name.md``` in your project root directory\n2. Use with SDD: Execute ```/specify spec-feature-name.md``` to generate comprehensive feature specifications\n3. Review generated specification: The AI will create detailed specifications based on your feature description\n4. Validate constitutional compliance: Use ```/constitution check spec-feature-name.md``` to ensure alignment\n5. Proceed to clarification: Use ```/clarify``` to resolve any ambiguities before technical planning',
      template: `Create a comprehensive feature specification for {feature_type} that will serve as the foundation for implementation.

## Feature Overview
**Feature Name:** {feature_name}
**Feature Type:** {feature_type}
**Primary Functionality:** {primary_functionality}

## Business Context
**Business Problem:** {business_problem}
**Target Users:** {target_users}
**Success Metrics:** {success_metrics}

## User Stories
- As a {user_role_1}, I want to {user_action_1} so that {user_benefit_1}
- As a {user_role_2}, I want to {user_action_2} so that {user_benefit_2}
- As a {user_role_3}, I want to {user_action_3} so that {user_benefit_3}

## Functional Requirements
**Core Features:**
1. {key_feature_1} - {feature_description_1}
2. {key_feature_2} - {feature_description_2}
3. {key_feature_3} - {feature_description_3}

**Key Functionality:**
- {primary_functionality}
- Integration requirements: {integration_requirements}
- Performance requirements: {performance_requirements}

## Technical Constraints
**Technology Stack:** {tech_stack}
**Existing Systems:** {existing_systems}
**Compliance Requirements:** {compliance_requirements}
**Security Requirements:** {security_requirements}

## Acceptance Criteria
**Given-When-Then Format:**
- Given {context_1}, when {action_1}, then {outcome_1}
- Given {context_2}, when {action_2}, then {outcome_2}
- Given {context_3}, when {action_3}, then {outcome_3}

## Non-Functional Requirements
**Performance:** {performance_targets}
**Scalability:** {scalability_requirements}
**Reliability:** {reliability_requirements}
**Usability:** {usability_requirements}
**Accessibility:** {accessibility_requirements}

## Assumptions and Dependencies
**Assumptions:** {assumptions}
**Dependencies:** {dependencies}
**Risks:** {risks}

## SDD Workflow Commands:
${'```'}bash
/specify spec-feature-name.md
/clarify clarification-questions.md
/constitution check spec-feature-name.md
/plan implementation-plan.md
${'```'}

## Directory Structure:
${'```'}
project/
├── specs/
│   ├── spec-feature-name.md
│   └── clarification-questions.md
├── memory/
│   └── constitution.md
├── packages/
└── tests/
${'```'}

This specification will guide the technical planning and implementation phases while ensuring alignment with user needs and business objectives.`,
      variables: [
        { key: 'feature_name', label: 'Feature Name', placeholder: 'e.g., User Management System, Payment Processing' },
        { key: 'feature_type', label: 'Feature Type', placeholder: 'e.g., web application, mobile app, API service' },
        { key: 'primary_functionality', label: 'Primary Functionality', placeholder: 'e.g., user authentication, data processing, payment handling' },
        { key: 'business_problem', label: 'Business Problem', placeholder: 'e.g., manual user management is inefficient, payment processing is slow' },
        { key: 'target_users', label: 'Target Users', placeholder: 'e.g., administrators, end customers, internal staff' },
        { key: 'success_metrics', label: 'Success Metrics', placeholder: 'e.g., reduce processing time by 50%, increase user satisfaction' },
        { key: 'user_role_1', label: 'User Role 1', placeholder: 'e.g., administrator, end user, manager' },
        { key: 'user_action_1', label: 'User Action 1', placeholder: 'e.g., manage users, process payments, view reports' },
        { key: 'user_benefit_1', label: 'User Benefit 1', placeholder: 'e.g., save time, improve accuracy, gain insights' },
        { key: 'user_role_2', label: 'User Role 2', placeholder: 'e.g., customer, support agent, analyst' },
        { key: 'user_action_2', label: 'User Action 2', placeholder: 'e.g., make purchases, resolve issues, analyze data' },
        { key: 'user_benefit_2', label: 'User Benefit 2', placeholder: 'e.g., convenience, efficiency, understanding' },
        { key: 'user_role_3', label: 'User Role 3', placeholder: 'e.g., auditor, developer, stakeholder' },
        { key: 'user_action_3', label: 'User Action 3', placeholder: 'e.g., review logs, maintain system, monitor progress' },
        { key: 'user_benefit_3', label: 'User Benefit 3', placeholder: 'e.g., compliance, productivity, visibility' },
        { key: 'key_feature_1', label: 'Key Feature 1', placeholder: 'e.g., authentication, dashboard, reporting' },
        { key: 'feature_description_1', label: 'Feature Description 1', placeholder: 'e.g., secure login with multi-factor authentication' },
        { key: 'key_feature_2', label: 'Key Feature 2', placeholder: 'e.g., data management, notifications, export' },
        { key: 'feature_description_2', label: 'Feature Description 2', placeholder: 'e.g., automated data backup and restore' },
        { key: 'key_feature_3', label: 'Key Feature 3', placeholder: 'e.g., analytics, search, filtering' },
        { key: 'feature_description_3', label: 'Feature Description 3', placeholder: 'e.g., real-time analytics dashboard' },
        { key: 'integration_requirements', label: 'Integration Requirements', placeholder: 'e.g., third-party APIs, legacy systems' },
        { key: 'performance_requirements', label: 'Performance Requirements', placeholder: 'e.g., response time, throughput, concurrency' },
        { key: 'tech_stack', label: 'Technology Stack', placeholder: 'e.g., React, Node.js, PostgreSQL' },
        { key: 'existing_systems', label: 'Existing Systems', placeholder: 'e.g., CRM, ERP, payment processors' },
        { key: 'compliance_requirements', label: 'Compliance Requirements', placeholder: 'e.g., GDPR, HIPAA, industry regulations' },
        { key: 'security_requirements', label: 'Security Requirements', placeholder: 'e.g., encryption, audit logs, access controls' },
        { key: 'context_1', label: 'Context 1', placeholder: 'e.g., user is logged in, form is submitted' },
        { key: 'action_1', label: 'Action 1', placeholder: 'e.g., clicks save button, submits data' },
        { key: 'outcome_1', label: 'Outcome 1', placeholder: 'e.g., data is saved, success message shown' },
        { key: 'context_2', label: 'Context 2', placeholder: 'e.g., payment is processed, validation fails' },
        { key: 'action_2', label: 'Action 2', placeholder: 'e.g., processes payment, shows error' },
        { key: 'outcome_2', label: 'Outcome 2', placeholder: 'e.g., payment completed, error displayed' },
        { key: 'context_3', label: 'Context 3', placeholder: 'e.g., report is generated, data is exported' },
        { key: 'action_3', label: 'Action 3', placeholder: 'e.g., generates report, downloads file' },
        { key: 'outcome_3', label: 'Outcome 3', placeholder: 'e.g., report displayed, file downloaded' },
        { key: 'performance_targets', label: 'Performance Targets', placeholder: 'e.g., <2s response time, 1000 concurrent users' },
        { key: 'scalability_requirements', label: 'Scalability Requirements', placeholder: 'e.g., horizontal scaling, load balancing' },
        { key: 'reliability_requirements', label: 'Reliability Requirements', placeholder: 'e.g., 99.9% uptime, fault tolerance' },
        { key: 'usability_requirements', label: 'Usability Requirements', placeholder: 'e.g., intuitive interface, accessibility' },
        { key: 'accessibility_requirements', label: 'Accessibility Requirements', placeholder: 'e.g., WCAG 2.1, screen reader support' },
        { key: 'assumptions', label: 'Assumptions', placeholder: 'e.g., users have basic computer skills' },
        { key: 'dependencies', label: 'Dependencies', placeholder: 'e.g., third-party services, APIs' },
        { key: 'risks', label: 'Risks', placeholder: 'e.g., integration complexity, performance issues' }
      ]
    },
    {
      name: 'Clarification',
      description: 'Refine specifications and resolve ambiguities before technical planning',
      why: 'Clarification reduces rework downstream by ensuring all requirements are well-understood before technical decisions are made. It identifies underspecified areas and resolves conflicts early in the process.',
      whatToDoNext: '1. Create a clarification document: Copy the generated prompt and save it as ```clarification-questions.md``` in your project root directory\n2. Use with SDD: Execute ```/clarify clarification-questions.md``` to systematically review your specification\n3. Address identified gaps: Fill in missing details and resolve conflicting requirements\n4. Validate completeness: Ensure all aspects are properly specified before proceeding to implementation planning\n5. Iterate as needed: Use clarification iteratively throughout the specification process',
      template: `Review the following specification for {specification_name} and identify areas that need clarification or additional detail.

Specification Focus: {specification_focus}
Current Specification State: {specification_state}

Areas Requiring Clarification:

1. Functional Requirements:
   - Missing user stories: {missing_user_stories}
   - Unclear features: {unclear_features}
   - Edge cases not covered: {edge_cases}

2. Technical Requirements:
   - Performance ambiguities: {performance_ambiguities}
   - Integration questions: {integration_questions}
   - Security considerations: {security_considerations}

3. User Experience:
   - User interaction flows: {ux_ambiguities}
   - Error handling scenarios: {error_handling_scenarios}
   - Accessibility requirements: {accessibility_requirements}

4. Business Logic:
   - Business rule gaps: {business_rule_gaps}
   - Data validation needs: {data_validation_needs}
   - Workflow complexities: {workflow_complexities}

5. Acceptance Criteria:
   - Undefined success metrics: {undefined_metrics}
   - Testing requirements: {testing_requirements}
   - Deployment considerations: {deployment_considerations}

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
        { key: 'specification_state', label: 'Current Specification State', placeholder: 'e.g., initial draft, partially complete, needs review' },
        { key: 'missing_user_stories', label: 'Missing User Stories', placeholder: 'e.g., admin user management, password reset flows' },
        { key: 'unclear_features', label: 'Unclear Features', placeholder: 'e.g., real-time notifications, offline functionality' },
        { key: 'edge_cases', label: 'Edge Cases Not Covered', placeholder: 'e.g., network failures, concurrent user conflicts' },
        { key: 'performance_ambiguities', label: 'Performance Ambiguities', placeholder: 'e.g., concurrent user limits, data processing requirements' },
        { key: 'integration_questions', label: 'Integration Questions', placeholder: 'e.g., third-party API dependencies, database schema conflicts' },
        { key: 'security_considerations', label: 'Security Considerations', placeholder: 'e.g., data encryption, authorization rules, audit logging' },
        { key: 'ux_ambiguities', label: 'UX Ambiguities', placeholder: 'e.g., mobile responsiveness, error message formats' },
        { key: 'error_handling_scenarios', label: 'Error Handling Scenarios', placeholder: 'e.g., invalid input handling, service unavailable responses' },
        { key: 'accessibility_requirements', label: 'Accessibility Requirements', placeholder: 'e.g., screen reader support, keyboard navigation' },
        { key: 'business_rule_gaps', label: 'Business Rule Gaps', placeholder: 'e.g., approval workflows, data retention policies' },
        { key: 'data_validation_needs', label: 'Data Validation Needs', placeholder: 'e.g., input format validation, business rule validation' },
        { key: 'workflow_complexities', label: 'Workflow Complexities', placeholder: 'e.g., multi-step processes, conditional logic' },
        { key: 'undefined_metrics', label: 'Undefined Success Metrics', placeholder: 'e.g., response time targets, user satisfaction goals' },
        { key: 'testing_requirements', label: 'Testing Requirements', placeholder: 'e.g., load testing requirements, compatibility testing' },
        { key: 'deployment_considerations', label: 'Deployment Considerations', placeholder: 'e.g., environment configurations, migration strategies' }
      ]
    },
    {
      name: 'Implementation Plan',
      description: 'Create detailed technical implementation plan from specifications',
      why: 'Implementation plans bridge the gap between specification and code. They provide technical guidance, architecture decisions, and a clear roadmap for developers while ensuring constitutional compliance throughout the development process.',
      whatToDoNext: '1. Create an implementation plan file: Copy the generated prompt and save it as ```plan-feature-name.md``` in your project root directory\n2. Use with SDD: Execute ```/plan plan-feature-name.md``` to generate detailed technical tasks and implementation steps\n3. Review generated tasks: The AI will create executable task lists and technical guidance based on your plan\n4. Execute development tasks: Follow the constitutional mandate with test-first development, starting with contract definitions\n5. Iterate and refine: Use the ```/tasks``` command to track progress and ensure compliance with your implementation plan',
      template: `Based on the specification for {project_name}, create an implementation plan using {tech_stack}.

Architecture Overview:
- Frontend: {frontend_tech}
- Backend: {backend_tech}
- Database: {database_tech}
- Deployment: {deployment_strategy}

Key Components:
1. {component_1} - {component_1_description}
2. {component_2} - {component_2_description}
3. {component_3} - {component_3_description}

Data Model:
- Main entities: {main_entities}
- Relationships: {entity_relationships}
- Key considerations: {data_considerations}

API Design:
- REST endpoints: {api_endpoints}
- Authentication: {auth_method}
- Rate limiting: {rate_limiting}

Testing Strategy:
- Unit tests: {unit_test_coverage}
- Integration tests: {integration_test_coverage}
- E2E tests: {e2e_test_coverage}

## Project Structure:
${'```'}
project/
├── packages/
│   ├── {component_1}/
│   ├── {component_2}/
│   └── {component_3}/
├── specs/
├── tests/
└── docs/
${'```'}

## Commands:
${'```'}bash
/plan implementation-plan.md
/tasks
/constitution check
${'```'}

Constitutional Compliance:
✓ Library-First Principle
✓ CLI Interface Mandate
✓ Test-First Imperative
✓ Integration-First Testing`,
      variables: [
        { key: 'project_name', label: 'Project Name', placeholder: 'e.g., E-commerce Platform' },
        { key: 'tech_stack', label: 'Technology Stack', placeholder: 'e.g., MERN stack' },
        { key: 'frontend_tech', label: 'Frontend Technology', placeholder: 'e.g., React with TypeScript' },
        { key: 'backend_tech', label: 'Backend Technology', placeholder: 'e.g., Node.js with Express' },
        { key: 'database_tech', label: 'Database Technology', placeholder: 'e.g., MongoDB with Redis caching' },
        { key: 'deployment_strategy', label: 'Deployment Strategy', placeholder: 'e.g., Docker containers on AWS' },
        { key: 'component_1', label: 'Component 1', placeholder: 'e.g., User Service' },
        { key: 'component_1_description', label: 'Component 1 Description', placeholder: 'e.g., Handles user authentication and profiles' },
        { key: 'component_2', label: 'Component 2', placeholder: 'e.g., Order Service' },
        { key: 'component_2_description', label: 'Component 2 Description', placeholder: 'e.g., Manages order processing and inventory' },
        { key: 'component_3', label: 'Component 3', placeholder: 'e.g., Payment Service' },
        { key: 'component_3_description', label: 'Component 3 Description', placeholder: 'e.g., Processes payments and refunds' },
        { key: 'main_entities', label: 'Main Entities', placeholder: 'e.g., User, Product, Order, Payment' },
        { key: 'entity_relationships', label: 'Entity Relationships', placeholder: 'e.g., User-Order (1:N), Order-Product (N:M)' },
        { key: 'data_considerations', label: 'Data Considerations', placeholder: 'e.g., Data consistency, transaction management' },
        { key: 'api_endpoints', label: 'API Endpoints', placeholder: 'e.g., RESTful APIs with OpenAPI spec' },
        { key: 'auth_method', label: 'Authentication Method', placeholder: 'e.g., JWT tokens with refresh mechanism' },
        { key: 'rate_limiting', label: 'Rate Limiting', placeholder: 'e.g., 100 requests per minute per user' },
        { key: 'unit_test_coverage', label: 'Unit Test Coverage', placeholder: 'e.g., 90% code coverage' },
        { key: 'integration_test_coverage', label: 'Integration Test Coverage', placeholder: 'e.g., All critical paths tested' },
        { key: 'e2e_test_coverage', label: 'E2E Test Coverage', placeholder: 'e.g., Key user workflows tested' }
      ]
    },
    {
      name: 'Task List',
      description: 'Generate executable task lists from implementation plans',
      why: 'Task lists break down implementation plans into concrete, actionable tasks that developers can execute. They provide clear prioritization, dependencies, and acceptance criteria for each task while ensuring constitutional compliance throughout development.',
      whatToDoNext: '1. Execute ```/tasks``` to generate detailed, executable task lists from your implementation plan\n2. Review generated tasks: The AI will create prioritized tasks with dependencies and acceptance criteria\n3. Execute tasks systematically: Follow the constitutional mandate with test-first development\n4. Track progress: Use the task list to monitor development progress and ensure compliance',
      templateInstructions: 'Templates aren\'t relevant to this slash command. `/task` is the only invocation of the slash command. ',
      template: `Templates aren't relevant to this slash command`,
      variables: []
    },
    {
      name: 'Analysis',
      description: 'Analyze code quality, architecture, and constitutional compliance',
      why: 'Analysis ensures that implemented code meets quality standards, follows architectural best practices, and complies with constitutional requirements. It provides insights into code health, performance, and areas for improvement.',
      whatToDoNext: '1. Execute ```/analyze``` to perform comprehensive code analysis and cross-artifact consistency checks\n2. Review analysis results: The AI will provide detailed insights into code quality and compliance\n3. Address identified issues: Fix any constitutional violations or quality concerns\n4. Iterate and improve: Use analysis feedback to continuously improve code quality',
      templateInstructions: 'Templates aren\'t relevant to this slash command. `/analyze` is the only invocation of the slash command. ',
      template: `Templates aren't relevant to this slash command`,
      variables: []
    },
    {
      name: 'Implementation',
      description: 'Execute the implementation phase with constitutional compliance',
      why: 'Implementation is where specifications and plans become working code. Following constitutional principles during implementation ensures that the resulting system is modular, testable, maintainable, and aligned with SDD methodology.',
      whatToDoNext: '1. Execute ```/implement``` to start the implementation phase and execute all tasks\n2. Follow constitutional principles: Implement with test-first development, library-first approach\n3. Validate compliance: Use ```/constitution check``` throughout implementation\n4. Iterate and improve: Continuously refine implementation based on feedback',
      templateInstructions: 'Templates aren\'t relevant to this slash command. `/implement` is the only invocation of the slash command. ',
      template: `Templates aren't relevant to this slash command`,
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
        feature_type: 'Android mobile application',
        primary_functionality: 'provide a seamless mobile experience for users to manage their accounts and access core features',
        key_features: 'user authentication, push notifications, offline data synchronization, camera integration, location services',
        existing_systems: 'REST APIs, Firebase services, Google Play Services, third-party analytics',
        tech_stack: 'Android (Kotlin), Jetpack Compose, MVVM architecture, Room database, Retrofit',
        compliance_requirements: 'Google Play Store policies, GDPR compliance, security best practices',
        performance_targets: '<2s app startup time, <500ms API response time, 60fps UI rendering',
        user_action_1: 'create accounts, login securely, and manage their profiles',
        system_behavior_1: 'sync data automatically and send push notifications for important updates',
        performance_metrics: 'handle 10,000+ concurrent users with minimal battery impact'
      },
      implementationPlanVars: {
        project_name: 'Android Mobile Application',
        tech_stack: 'Native Android development',
        frontend_tech: 'Jetpack Compose with Material 3',
        backend_tech: 'Node.js/Express REST APIs',
        database_tech: 'Room database with Firebase Firestore sync',
        deployment_strategy: 'Google Play Store with CI/CD pipeline',
        component_1: 'Authentication Module',
        component_1_description: 'Handles user login, registration, and session management with biometric support',
        component_2: 'Data Sync Service',
        component_2_description: 'Manages offline data storage and synchronization with backend',
        component_3: 'Notification Service',
        component_3_description: 'Handles push notifications and in-app messaging',
        main_entities: 'User, Profile, Settings, Notification, SyncRecord',
        entity_relationships: 'User-Profile (1:1), User-Notification (1:N), User-SyncRecord (1:N)',
        data_considerations: 'Offline-first approach, data encryption, conflict resolution',
        api_endpoints: 'RESTful APIs with OpenAPI 3.0 specification',
        auth_method: 'JWT tokens with refresh mechanism and OAuth 2.0',
        rate_limiting: '100 requests per minute per user',
        unit_test_coverage: '85% code coverage with JUnit',
        integration_test_coverage: 'All API endpoints and critical user flows',
        e2e_test_coverage: 'Core user journeys with UI testing'
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
        specification_name: 'Android Mobile App Feature Specification',
        specification_focus: 'user authentication, data synchronization, push notifications, offline functionality',
        specification_state: 'initial draft with core features defined',
        missing_user_stories: 'admin user management, data export functionality, advanced search features',
        unclear_features: 'offline data conflict resolution, notification throttling, background processing limits',
        edge_cases: 'network connectivity loss during sync, low storage scenarios, multiple device synchronization',
        performance_ambiguities: 'concurrent sync operations, large dataset handling, memory usage limits',
        integration_questions: 'third-party SDK dependencies, Firebase service integration, payment gateway integration',
        security_considerations: 'data encryption requirements, secure storage of sensitive data, authentication timeout policies',
        ux_ambiguities: 'tablet UI layout, dark mode implementation, accessibility features for motor impairments',
        error_handling_scenarios: 'network failure recovery, authentication token refresh, corrupted local data handling',
        accessibility_requirements: 'screen reader support, color contrast compliance, motor accessibility features',
        business_rule_gaps: 'data retention policies, user account deactivation, content moderation guidelines',
        data_validation_needs: 'input format validation, business rule validation, data integrity checks',
        workflow_complexities: 'multi-device sync conflict resolution, offline operation workflows, background processing',
        undefined_metrics: 'user engagement targets, performance benchmarks, error rate thresholds',
        testing_requirements: 'device compatibility testing, network condition testing, accessibility testing',
        deployment_considerations: 'staged rollout strategy, A/B testing framework, crash reporting integration'
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
        feature_type: 'iOS mobile application',
        primary_functionality: 'deliver a premium iOS experience with intuitive interface and seamless performance',
        key_features: 'Face ID/Touch ID authentication, CloudKit integration, HealthKit integration, Apple Pay support, iMessage extension',
        existing_systems: 'Apple ecosystems, CloudKit, HealthKit, Apple Pay, third-party iOS SDKs',
        tech_stack: 'iOS (Swift), SwiftUI, Combine framework, Core Data, CloudKit',
        compliance_requirements: 'App Store Review Guidelines, Apple Human Interface Guidelines, GDPR, ATT compliance',
        performance_targets: '<1.5s app launch time, <300ms UI response, smooth 60fps animations',
        user_action_1: 'authenticate securely using biometrics and manage their preferences',
        system_behavior_1: 'sync data across devices via iCloud and provide contextual notifications',
        performance_metrics: 'optimized for battery life with efficient background processing'
      },
      implementationPlanVars: {
        project_name: 'iOS Mobile Application',
        tech_stack: 'Native iOS development',
        frontend_tech: 'SwiftUI with Combine framework',
        backend_tech: 'CloudKit and serverless functions',
        database_tech: 'Core Data with CloudKit synchronization',
        deployment_strategy: 'App Store with TestFlight beta testing',
        component_1: 'Authentication Service',
        component_1_description: 'Manages biometric authentication and iCloud account integration',
        component_2: 'Data Sync Manager',
        component_2_description: 'Handles Core Data and CloudKit synchronization',
        component_3: 'Apple Pay Integration',
        component_3_description: 'Manages payment processing and transaction history',
        main_entities: 'User, Profile, Transaction, Preference, SyncData',
        entity_relationships: 'User-Profile (1:1), User-Transaction (1:N), User-Preference (1:1)',
        data_considerations: 'Privacy-focused design, minimal data collection, end-to-end encryption',
        api_endpoints: 'CloudKit web services and Apple native APIs',
        auth_method: 'Biometric authentication with iCloud account',
        rate_limiting: 'App Store and Apple rate limits apply',
        unit_test_coverage: '90% coverage with XCTest framework',
        integration_test_coverage: 'All Apple integrations and core features',
        e2e_test_coverage: 'Complete user flows with UI automation'
      },
      constitutionVars: {
        project_type: 'iOS mobile application',
        code_quality_requirements: 'Swift coding standards, SwiftLint strict mode, 90% test coverage, memory safety',
        testing_standards: 'XCTest for unit tests, XCTest UI for automation, 90% coverage minimum',
        performance_targets: '<1.5s app launch time, <16ms UI response, <200ms API response, 99.9% uptime',
        security_requirements: 'Biometric authentication, Keychain security, App Transport Security, data encryption',
        tech_stack_constraints: 'Swift, SwiftUI, Combine, Core Data, CloudKit, Apple native frameworks only',
        architecture_principles: 'MVVM pattern, Clean Architecture, Combine framework, protocol-oriented design',
        documentation_standards: 'SwiftDoc for all public APIs, Xcode markup, README with setup instructions',
        deployment_requirements: 'App Store deployment, TestFlight beta testing, CI/CD with Xcode Cloud',
        regulatory_compliance: 'App Store Review Guidelines, Apple Human Interface Guidelines, GDPR, ATT',
        team_workflow: 'Agile development, 1-week sprints, app store review management, automated testing',
        review_processes: 'Mandatory code review, UI/UX review, App Store guideline compliance check',
        success_metrics: '<1% crash rate, >4.5 star rating, <50ms UI response time, 99.9% uptime'
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
        security_considerations: 'Keychain data storage, biometric fallback options, data encryption requirements',
        ux_ambiguities: 'Dynamic Type scaling, VoiceOver support, Dark Mode implementation, iPad multitasking',
        error_handling_scenarios: 'iCloud authentication failures, network timeouts, Core Data corruption handling',
        accessibility_requirements: 'VoiceOver compatibility, Dynamic Type support, Switch Control, Reduce Motion',
        business_rule_gaps: 'subscription management, family sharing rules, data retention policies',
        data_validation_needs: 'input sanitization, business rule validation, data integrity checks',
        workflow_complexities: 'multi-device sync workflows, background processing, user data migration',
        undefined_metrics: 'user engagement targets, app store performance benchmarks, retention rate goals',
        testing_requirements: 'device compatibility matrix, iOS version testing, accessibility testing',
        deployment_considerations: 'App Store review preparation, TestFlight distribution, beta testing strategy'
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
        feature_type: 'progressive web application (PWA)',
        primary_functionality: 'provide a responsive web experience that works across all devices and supports offline functionality',
        key_features: 'responsive design, offline capabilities, push notifications, SEO optimization, cross-browser compatibility',
        existing_systems: 'third-party APIs, analytics platforms, payment gateways, content management systems',
        tech_stack: 'React, TypeScript, Next.js, Tailwind CSS, Progressive Web App technologies',
        compliance_requirements: 'WCAG 2.1 accessibility, GDPR, CCPA, cookie consent',
        performance_targets: '<3s first contentful paint, <1s time to interactive, 90+ Lighthouse score',
        user_action_1: 'access the application from any device and work offline when needed',
        system_behavior_1: 'cache content for offline use and sync when connectivity is restored',
        performance_metrics: 'support 50,000+ concurrent users with automatic scaling'
      },
      implementationPlanVars: {
        project_name: 'Progressive Web Application',
        tech_stack: 'Modern web development stack',
        frontend_tech: 'React 18 with TypeScript and Next.js 14',
        backend_tech: 'Node.js with Express or Next.js API routes',
        database_tech: 'PostgreSQL with Redis caching',
        deployment_strategy: 'Vercel with CI/CD pipeline and multi-region deployment',
        component_1: 'Authentication System',
        component_1_description: 'Handles user login, registration, and session management with social login',
        component_2: 'Service Worker Manager',
        component_2_description: 'Manages offline caching and background synchronization',
        component_3: 'API Gateway',
        component_3_description: 'Handles API requests, rate limiting, and response caching',
        main_entities: 'User, Session, Cache, Config, AuditLog',
        entity_relationships: 'User-Session (1:N), User-Cache (1:N), Config-AuditLog (1:N)',
        data_considerations: 'Offline data consistency, cache invalidation strategies',
        api_endpoints: 'RESTful APIs with GraphQL support and OpenAPI documentation',
        auth_method: 'JWT tokens with OAuth 2.0 and social login providers',
        rate_limiting: '1000 requests per hour per IP address',
        unit_test_coverage: '90% with Jest and React Testing Library',
        integration_test_coverage: 'All API integrations and database operations',
        e2e_test_coverage: 'Critical user journeys with Cypress'
      },
      constitutionVars: {
        project_type: 'progressive web application (PWA)',
        code_quality_requirements: 'TypeScript strict mode, ESLint configuration, Prettier formatting, 90% test coverage',
        testing_standards: 'Jest for unit tests, React Testing Library, Cypress for E2E, 90% coverage minimum',
        performance_targets: '<3s first contentful paint, <1s time to interactive, 90+ Lighthouse score',
        security_requirements: 'HTTPS enforcement, CSP headers, XSS protection, CSRF protection, secure cookies',
        tech_stack_constraints: 'React, TypeScript, Next.js, Tailwind CSS, Vercel deployment, PostgreSQL database',
        architecture_principles: 'Component-based architecture, service workers, progressive enhancement, offline-first',
        documentation_standards: 'JSDoc comments, Storybook for components, API documentation with OpenAPI',
        deployment_requirements: 'Vercel deployment, CI/CD pipeline, automated testing, multi-region CDN',
        regulatory_compliance: 'GDPR, CCPA, WCAG 2.1 accessibility, cookie consent, data privacy',
        team_workflow: 'Agile development, 2-week sprints, code reviews, automated testing, feature flags',
        review_processes: 'Mandatory code review, security review for auth features, performance review',
        success_metrics: '<2s page load, 99.9% uptime, 90+ Lighthouse score, 95% test coverage'
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
        security_considerations: 'offline data security, service worker security, XSS prevention in offline mode',
        ux_ambiguities: 'mobile vs desktop layouts, offline mode indication, update notification behavior',
        error_handling_scenarios: 'network failure handling, service worker errors, cache corruption recovery',
        accessibility_requirements: 'screen reader support, keyboard navigation, color contrast compliance',
        business_rule_gaps: 'data retention policies, user consent management, offline usage analytics',
        data_validation_needs: 'input validation, data sanitization, business rule validation',
        workflow_complexities: 'background sync conflicts, update deployment strategies, multi-tab synchronization',
        undefined_metrics: 'offline usage targets, install conversion rates, performance benchmarks',
        testing_requirements: 'cross-browser testing, offline mode testing, Lighthouse score monitoring',
        deployment_considerations: 'service worker deployment strategy, cache invalidation, A/B testing framework'
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
        feature_type: 'multi-tenant SaaS platform',
        primary_functionality: 'provide a scalable, secure platform for multiple organizations with customizable features',
        key_features: 'multi-tenant architecture, role-based access control, API integration, billing system, analytics dashboard',
        existing_systems: 'payment processors, email services, CRM systems, monitoring tools',
        tech_stack: 'Microservices architecture, container orchestration, cloud-native technologies',
        compliance_requirements: 'SOC 2, ISO 27001, GDPR, HIPAA if applicable',
        performance_targets: '<2s API response time, 99.9% uptime, horizontal scalability',
        user_action_1: 'manage their organization, users, and access enterprise features',
        system_behavior_1: 'enforce tenant isolation and provide real-time analytics',
        performance_metrics: 'support 10,000+ organizations with 100,000+ concurrent users'
      },
      implementationPlanVars: {
        project_name: 'Multi-Tenant SaaS Platform',
        tech_stack: 'Cloud-native microservices',
        frontend_tech: 'React with TypeScript and micro-frontends',
        backend_tech: 'Node.js/Python microservices with message queues',
        database_tech: 'PostgreSQL with tenant isolation, Redis, Elasticsearch',
        deployment_strategy: 'Kubernetes on AWS/GCP with Helm charts',
        component_1: 'Tenant Management Service',
        component_1_description: 'Handles tenant provisioning, configuration, and isolation',
        component_2: 'Billing & Subscription Service',
        component_2_description: 'Manages subscriptions, invoicing, and payment processing',
        component_3: 'Analytics Engine',
        component_3_description: 'Provides real-time analytics and reporting across tenants',
        main_entities: 'Tenant, User, Subscription, Invoice, AnalyticsData',
        entity_relationships: 'Tenant-User (1:N), Tenant-Subscription (1:1), User-AnalyticsData (1:N)',
        data_considerations: 'Tenant data isolation, compliance requirements, data retention',
        api_endpoints: 'RESTful APIs with tenant context and rate limiting',
        auth_method: 'OAuth 2.0 with JWT and multi-factor authentication',
        rate_limiting: 'Per-tenant rate limiting with burst handling',
        unit_test_coverage: '95% with comprehensive mocking',
        integration_test_coverage: 'All service integrations and tenant isolation',
        e2e_test_coverage: 'Multi-tenant workflows with performance testing'
      },
      constitutionVars: {
        project_type: 'multi-tenant SaaS platform',
        code_quality_requirements: 'Multi-language standards, container security, 95% test coverage, code quality gates',
        testing_standards: 'Multi-service testing, chaos engineering, load testing, 95% coverage minimum',
        performance_targets: '<2s API response, 99.9% uptime, horizontal scaling, <100ms tenant provisioning',
        security_requirements: 'Multi-tenant isolation, encryption at rest/transit, RBAC, audit logging, MFA',
        tech_stack_constraints: 'Cloud-native, container-based, microservices, Kubernetes, AWS/GCP services',
        architecture_principles: 'Microservices, tenant isolation, event-driven, API-first, infrastructure as code',
        documentation_standards: 'API documentation, architecture diagrams, runbooks, compliance documentation',
        deployment_requirements: 'Kubernetes, Istio service mesh, Helm charts, GitOps, multi-region deployment',
        regulatory_compliance: 'SOC 2, ISO 27001, GDPR, HIPAA, data residency requirements',
        team_workflow: 'DevOps practices, infrastructure as code, automated testing, incident management',
        review_processes: 'Security review, architecture review, compliance review, performance review',
        success_metrics: '99.9% uptime, <2s API response, 95% test coverage, zero security incidents'
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
        security_considerations: 'tenant isolation mechanisms, data encryption requirements, audit logging scope',
        ux_ambiguities: 'white-label customization options, admin interface complexity, user management workflows',
        error_handling_scenarios: 'tenant failure isolation, data corruption recovery, billing system failures',
        accessibility_requirements: 'WCAG 2.1 compliance, screen reader support, keyboard navigation',
        business_rule_gaps: 'tenant pricing models, feature tier definitions, data retention policies',
        data_validation_needs: 'tenant-specific validation rules, data format standards, integrity checks',
        workflow_complexities: 'tenant provisioning workflows, subscription management, billing cycles',
        undefined_metrics: 'tenant acquisition costs, churn rate targets, customer satisfaction goals',
        testing_requirements: 'multi-tenant testing, isolation verification, load testing, compliance testing',
        deployment_considerations: 'blue-green deployments, tenant migration strategies, rollback procedures'
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
        feature_type: 'RESTful API service',
        primary_functionality: 'provide reliable, scalable APIs for external and internal consumption',
        key_features: 'RESTful design, comprehensive documentation, rate limiting, monitoring, SDK support',
        existing_systems: 'databases, external APIs, authentication services, monitoring tools',
        tech_stack: 'API-first design, microservices, cloud infrastructure',
        compliance_requirements: 'API security best practices, data privacy regulations',
        performance_targets: '<100ms response time, 99.99% uptime, auto-scaling',
        user_action_1: 'integrate with the API using SDKs or direct HTTP calls',
        system_behavior_1: 'enforce rate limits, authenticate requests, and provide real-time monitoring',
        performance_metrics: 'handle millions of requests per day with automatic scaling'
      },
      implementationPlanVars: {
        project_name: 'RESTful API Service',
        tech_stack: 'API-first development',
        frontend_tech: 'API documentation portal (Swagger/OpenAPI)',
        backend_tech: 'Node.js/Python with Express/FastAPI',
        database_tech: 'PostgreSQL with read replicas, Redis caching',
        deployment_strategy: 'Docker containers with Kubernetes orchestration',
        component_1: 'API Gateway',
        component_1_description: 'Handles request routing, authentication, and rate limiting',
        component_2: 'Authentication Service',
        component_2_description: 'Manages API keys, OAuth tokens, and access control',
        component_3: 'Monitoring & Analytics',
        component_3_description: 'Provides API usage analytics, performance monitoring, and alerting',
        main_entities: 'APIKey, User, RequestLog, RateLimit, Analytics',
        entity_relationships: 'User-APIKey (1:N), APIKey-RequestLog (1:N)',
        data_considerations: 'API key security, request logging privacy, data retention',
        api_endpoints: 'Well-designed RESTful endpoints with HATEOAS support',
        auth_method: 'API keys and OAuth 2.0 tokens',
        rate_limiting: 'Tiered rate limiting based on subscription level',
        unit_test_coverage: '95% with comprehensive error scenario testing',
        integration_test_coverage: 'All database operations and external integrations',
        e2e_test_coverage: 'Complete API contract testing with load testing'
      },
      constitutionVars: {
        project_type: 'RESTful API service',
        code_quality_requirements: 'API-first standards, OpenAPI specification, 95% test coverage, linting rules',
        testing_standards: 'Contract testing, load testing, chaos engineering, 95% coverage minimum',
        performance_targets: '<100ms response time, 99.99% uptime, auto-scaling, 1000+ RPS',
        security_requirements: 'API security, OAuth 2.0, rate limiting, DDoS protection, audit logging',
        tech_stack_constraints: 'API Gateway, Node.js/Python, PostgreSQL, Redis, Kubernetes, monitoring tools',
        architecture_principles: 'API-first design, microservices, event-driven, circuit breakers, auto-scaling',
        documentation_standards: 'OpenAPI 3.0 specification, API documentation, developer guides',
        deployment_requirements: 'Kubernetes, Istio service mesh, GitOps, blue-green deployments',
        regulatory_compliance: 'API security best practices, data privacy regulations, industry standards',
        team_workflow: 'API-first development, contract testing, monitoring, incident response',
        review_processes: 'API design review, security review, performance review, compliance review',
        success_metrics: '99.99% uptime, <100ms response time, 99.9% SLA, zero security breaches'
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
        security_considerations: 'API key management, authentication token lifecycle, request validation',
        ux_ambiguities: 'developer portal interface, API documentation format, error message clarity',
        error_handling_scenarios: 'service degradation, database failures, authentication service outages',
        accessibility_requirements: 'API documentation accessibility, screen reader support for developer portal',
        business_rule_gaps: 'API pricing tiers, usage limits, subscription management, data retention',
        data_validation_needs: 'request validation, response format validation, data sanitization',
        workflow_complexities: 'API version management, deprecation strategies, backward compatibility',
        undefined_metrics: 'API usage targets, error rate thresholds, performance benchmarks',
        testing_requirements: 'contract testing, load testing, security testing, compatibility testing',
        deployment_considerations: 'API gateway configuration, SSL certificate management, monitoring setup'
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
        feature_type: 'cross-platform desktop application',
        primary_functionality: 'provide native desktop experience with offline capabilities and system integration',
        key_features: 'cross-platform support, offline functionality, system notifications, file system access, hardware integration',
        existing_systems: 'operating system APIs, local databases, cloud services, system utilities',
        tech_stack: 'Electron or Tauri, native modules, system APIs',
        compliance_requirements: 'platform-specific requirements, data privacy, security certifications',
        performance_targets: '<2s app startup, <100ms UI response, minimal memory footprint',
        user_action_1: 'install and run the application on their preferred operating system',
        system_behavior_1: 'integrate with system features and provide seamless offline experience',
        performance_metrics: 'efficient resource usage with native performance'
      },
      implementationPlanVars: {
        project_name: 'Cross-Platform Desktop Application',
        tech_stack: 'Desktop application framework',
        frontend_tech: 'React with TypeScript (Electron) or native UI (Tauri)',
        backend_tech: 'Node.js backend or Rust core (Tauri)',
        database_tech: 'SQLite for local storage, with cloud sync capabilities',
        deployment_strategy: 'Platform-specific installers with auto-update',
        component_1: 'System Integration Manager',
        component_1_description: 'Handles OS-level features like notifications, files, and hardware',
        component_2: 'Data Synchronization Service',
        component_2_description: 'Manages offline data storage and cloud synchronization',
        component_3: 'Auto-Update System',
        component_3_description: 'Handles application updates and version management',
        main_entities: 'User, Settings, LocalData, SyncRecord, UpdateLog',
        entity_relationships: 'User-Settings (1:1), User-LocalData (1:N), User-SyncRecord (1:N)',
        data_considerations: 'Local data encryption, sync conflict resolution, privacy',
        api_endpoints: 'Local APIs for system integration and cloud sync endpoints',
        auth_method: 'Local authentication with optional cloud account sync',
        rate_limiting: 'Local API calls without rate limiting',
        unit_test_coverage: '90% with platform-specific testing',
        integration_test_coverage: 'All system integrations and file operations',
        e2e_test_coverage: 'Cross-platform user workflows with automated UI testing'
      },
      constitutionVars: {
        project_type: 'cross-platform desktop application',
        code_quality_requirements: 'Platform-specific standards, memory safety, 90% test coverage, native performance',
        testing_standards: 'Unit testing, integration testing, UI automation, 90% coverage minimum',
        performance_targets: '<2s startup time, <100ms UI response, minimal memory usage, native performance',
        security_requirements: 'Local data encryption, secure updates, system integration security, code signing',
        tech_stack_constraints: 'Electron or Tauri framework, TypeScript/Rust, SQLite, native modules',
        architecture_principles: 'Cross-platform compatibility, native performance, offline-first, system integration',
        documentation_standards: 'Platform-specific documentation, API documentation, setup guides',
        deployment_requirements: 'Platform-specific installers, auto-update, code signing, distribution channels',
        regulatory_compliance: 'Platform store requirements, data privacy, security certifications',
        team_workflow: 'Cross-platform development, testing automation, release management',
        review_processes: 'Code review, security review, performance review, platform compatibility testing',
        success_metrics: '<2s startup, <100ms UI response, 99.9% stability, native performance feel'
      },
      clarifyVars: {
        specification_name: 'Cross-Platform Desktop Application Specification',
        specification_focus: 'system integration, offline capabilities, cross-platform compatibility, native features',
        specification_state: 'initial draft with cross-platform requirements identified',
        missing_user_stories: 'system preferences integration, file association handling, system tray features',
        unclear_features: 'hardware integration approach, system resource usage, update mechanism behavior',
        edge_cases: 'low disk space scenarios, network connectivity loss, system sleep/resume handling',
        performance_ambiguities: 'memory usage limits, CPU usage targets, battery optimization requirements',
        integration_questions: 'system API dependencies, hardware integration requirements, cloud service dependencies',
        security_considerations: 'local data encryption, secure update mechanism, system permission requirements',
        ux_ambiguities: 'platform-specific UI adaptations, system integration patterns, offline mode indication',
        error_handling_scenarios: 'system API failures, file system errors, update failures, network timeouts',
        accessibility_requirements: 'platform accessibility APIs, screen reader support, keyboard navigation',
        business_rule_gaps: 'update policies, data synchronization rules, user account management',
        data_validation_needs: 'input validation, file system validation, data integrity checks',
        workflow_complexities: 'background processing, system integration workflows, update management',
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

      setGeneratedPrompt(prompt)
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

  return (
    <div className="container">
      <header>
        <h1>Spec-Driven Development Toolkit</h1>
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
            <div style={{ background: 'rgba(72, 187, 120, 0.1)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #48bb78', marginTop: '1.5rem' }}>
              <h4 style={{ color: '#48bb78', marginBottom: '1rem' }}>🌟 Rapid Adoption</h4>
              <p><strong>SpecKit has achieved over 16,300 GitHub stars</strong>, making it one of the fastest-growing developer tools for specification-driven development.</p>
            </div>

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
            <h3>Multi-Agent Support</h3>
            <p>SpecKit works seamlessly with your preferred AI assistant, providing flexibility for your development workflow:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ background: 'rgba(66, 153, 225, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #4299e1' }}>
                <h4 style={{ color: '#4299e1', marginBottom: '0.5rem' }}>🤖 GitHub Copilot</h4>
                <p style={{ fontSize: '0.9rem', margin: 0 }}>Native integration in VS Code with slash commands</p>
              </div>
              <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #667eea' }}>
                <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>🎯 Claude Code</h4>
                <p style={{ fontSize: '0.9rem', margin: 0 }}>Full support for Claude-based development workflows</p>
              </div>
              <div style={{ background: 'rgba(72, 187, 120, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #48bb78' }}>
                <h4 style={{ color: '#48bb78', marginBottom: '0.5rem' }}>🔍 Gemini CLI</h4>
                <p style={{ fontSize: '0.9rem', margin: 0 }}>Google AI assistant compatibility and support</p>
              </div>
              <div style={{ background: 'rgba(237, 137, 54, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #ed8936' }}>
                <h4 style={{ color: '#ed8936', marginBottom: '0.5rem' }}>✨ Cursor</h4>
                <p style={{ fontSize: '0.9rem', margin: 0 }}>Multi-model AI editor with full SpecKit integration</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Cross-Platform Support</h3>
            <p>SpecKit provides native support for both major shell environments:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ background: 'rgba(0, 114, 198, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #0072c6' }}>
                <h4 style={{ color: '#0072c6', marginBottom: '0.5rem' }}>💻 PowerShell</h4>
                <p style={{ fontSize: '0.9rem', margin: 0 }}>Native Windows PowerShell support with full CLI functionality</p>
              </div>
              <div style={{ background: 'rgba(240, 101, 149, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #f06595' }}>
                <h4 style={{ color: '#f06595', marginBottom: '0.5rem' }}>🐧 Bash</h4>
                <p style={{ fontSize: '0.9rem', margin: 0 }}>Full bash shell support for Linux and macOS environments</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>VS Code Integration</h3>
            <p>SpecKit provides seamless integration with Visual Studio Code through powerful slash commands:</p>
            <div style={{ background: 'rgba(66, 153, 225, 0.05)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
              <code style={{ display: 'block', padding: '0.5rem', background: '#2d3748', color: '#e2e8f0', borderRadius: '4px', marginBottom: '0.5rem' }}>/specify [feature description]</code>
              <code style={{ display: 'block', padding: '0.5rem', background: '#2d3748', color: '#e2e8f0', borderRadius: '4px', marginBottom: '0.5rem' }}>/plan [technology choices]</code>
              <code style={{ display: 'block', padding: '0.5rem', background: '#2d3748', color: '#e2e8f0', borderRadius: '4px', marginBottom: '0.5rem' }}>/tasks</code>
              <code style={{ display: 'block', padding: '0.5rem', background: '#2d3748', color: '#e2e8f0', borderRadius: '4px' }}>/constitution</code>
            </div>
          </div>

          <div className="card">
            <h3>The SDD Workflow</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${tutorialProgress}%` }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
              <span>{tutorialProgress}% Complete</span>
            </div>
            {sddSteps.map((step, index) => (
              <div key={index} className="step" style={{ marginBottom: '2rem', border: completedSteps[index] ? '2px solid #48bb78' : '2px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                <div className="step-number" style={{ background: completedSteps[index] ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  {completedSteps[index] ? '✓' : index + 1}
                </div>
                <div className="step-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ color: completedSteps[index] ? '#48bb78' : '#2d3748' }}>{step.title}</h4>
                      <p>{step.description}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <button
                        className="btn"
                        onClick={() => completeWorkflowStep(index)}
                        disabled={completedSteps[index]}
                        style={{
                          background: completedSteps[index] ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' : 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                          opacity: completedSteps[index] ? 0.7 : 1,
                          cursor: completedSteps[index] ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {completedSteps[index] ? 'Completed ✓' : 'Complete Step'}
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => toggleStepDetails(index)}
                        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                      >
                        {expandedStep === index ? 'Hide Details' : 'Show Details'}
                      </button>
                    </div>
                  </div>

                  <div className="example-code">{step.command}</div>

                  {expandedStep === index && (
                    <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(102, 126, 234, 0.05)', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h5 style={{ color: '#667eea', marginBottom: '0.5rem' }}>🤔 Why This Step Matters</h5>
                        <p style={{ lineHeight: '1.6', margin: 0 }}>{step.why}</p>
                      </div>

                      <div style={{ marginBottom: '1.5rem' }}>
                        <h5 style={{ color: '#48bb78', marginBottom: '0.5rem' }}>🎯 What You\'ll Accomplish</h5>
                        <p style={{ lineHeight: '1.6', margin: 0 }}>{step.what}</p>
                      </div>

                      <div style={{ marginBottom: '1.5rem' }}>
                        <h5 style={{ color: '#ed8936', marginBottom: '0.5rem' }}>📋 Scope & Execution</h5>
                        <p style={{ lineHeight: '1.6', margin: 0 }}>{step.scope}</p>
                      </div>

                      <div>
                        <h5 style={{ color: '#8052d3', marginBottom: '0.5rem' }}>💡 Practical Examples</h5>
                        <ul style={{ textAlign: 'left', lineHeight: '1.8', margin: 0, paddingLeft: '1.5rem', color: '#2d3748' }}>
                          {step.examples.map((example, exampleIndex) => (
                            <li key={exampleIndex} style={{ marginBottom: '0.5rem', color: '#2d3748' }}>{example}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <h3>Best Practices for Context Window Size Control and Start-and-Resume</h3>
            <div className="step">
              <div className="step-content">
                <div style={{ marginBottom: '1.5rem' }}>
                  <h5 style={{ color: '#667eea', marginBottom: '0.5rem' }}>📏 Context Window Management</h5>
                  <p style={{ lineHeight: '1.6', margin: 0 }}>Effective context window management is crucial for maintaining conversation continuity and ensuring comprehensive analysis.</p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h5 style={{ color: '#48bb78', marginBottom: '0.5rem' }}>🎯 Key Strategies</h5>
                  <ul style={{ textAlign: 'left', lineHeight: '1.8', margin: 0, paddingLeft: '1.5rem', color: '#2d3748' }}>
                    <li style={{ marginBottom: '0.5rem', color: '#2d3748' }}><strong>Strategic Summarization:</strong> Condense previous conversations while preserving critical decisions and context</li>
                    <li style={{ marginBottom: '0.5rem', color: '#2d3748' }}><strong>Hierarchical Organization:</strong> Structure information with clear headers, bullet points, and prioritized details</li>
                    <li style={{ marginBottom: '0.5rem', color: '#2d3748' }}><strong>Progressive Elaboration:</strong> Start with high-level overviews, then drill into specifics as needed</li>
                    <li style={{ marginBottom: '0.5rem', color: '#2d3748' }}><strong>Context Pruning:</strong> Remove redundant or less relevant information while preserving essential context</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h5 style={{ color: '#ed8936', marginBottom: '0.5rem' }}>🔄 Start-and-Resume Techniques</h5>
                  <div className="example-code">{`// Effective session resumption pattern
/session-status
Previous work: [brief description]
Last completed: [specific task]
Current context: [key points]
Next steps: [immediate priorities]

Context preservation strategies:
• Summarize key decisions and outcomes
• Maintain links to important artifacts
• Preserve configuration and environment details
• Track unresolved questions and action items`}</div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h5 style={{ color: '#8052d3', marginBottom: '0.5rem' }}>💡 Practical Implementation</h5>
                  <div className="example-code">{`// Context window optimization example
/project-context
Project: [Project Name]
Phase: [Current Phase]
Constitution: [Key principles]
Specifications: [Brief descriptions]
Implementation Status: [Progress summary]
Key Decisions: [Critical choices made]
Outstanding Issues: [Blocking items]

// Session management commands
/context-save [session-name]
/context-load [session-name]
/context-summary
/next-steps`}</div>
                </div>

                <div>
                  <h5 style={{ color: '#e53e3e', marginBottom: '0.5rem' }}>⚠️ Common Pitfalls to Avoid</h5>
                  <ul style={{ textAlign: 'left', lineHeight: '1.8', margin: 0, paddingLeft: '1.5rem', color: '#2d3748' }}>
                    <li style={{ marginBottom: '0.5rem', color: '#2d3748' }}><strong>Information Overload:</strong> Including excessive detail that obscures key points</li>
                    <li style={{ marginBottom: '0.5rem', color: '#2d3748' }}><strong>Context Loss:</strong> Failing to preserve critical background information</li>
                    <li style={{ marginBottom: '0.5rem', color: '#2d3748' }}><strong>Poor Organization:</strong> Presenting information without clear structure or hierarchy</li>
                    <li style={{ marginBottom: '0.5rem', color: '#2d3748' }}><strong>Inconsistent Summarization:</strong> Varying levels of detail that make context hard to follow</li>
                  </ul>
                </div>
              </div>
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

                  {/* What to Do Next Section */}
                  <div style={{ background: 'rgba(237, 137, 54, 0.1)', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
                    <h5 style={{ color: '#ed8936', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      🎯 What to Do Next
                    </h5>
                    <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{template.whatToDoNext}</p>
                  </div>

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
                </div>
              )}
            </div>
          ))}

          {generatedPrompt && (
            <div className="card">
              <h4>Generated Prompt:</h4>
              <div className="prompt-output">{generatedPrompt}</div>
              <button className="btn-secondary" onClick={() => navigator.clipboard.writeText(generatedPrompt)}>
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
    </div>
  )
}

export default App
