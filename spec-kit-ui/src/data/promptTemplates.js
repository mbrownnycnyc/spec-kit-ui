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
    template: `/specify
Create a comprehensive feature specification for {feature_type} that will serve as the foundation for implementation.

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
\`\`\`bash
/specify {feature_name}-specification.md
/constitution check {feature_name}-specification.md
/clarify {feature_name}-specification.md
/plan implementation-plan.md
\`\`\`

## Example Specification Format:
\`\`\`markdown
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
\`\`\`

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
    template: `/clarify
Review the following specification for {specification_name} and identify areas that need clarification or additional detail.

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
\`\`\`bash
/clarify clarification-questions.md
/specify updated-specification.md
/constitution check updated-specification.md
\`\`\`

## Example Specification Format:
\`\`\`markdown
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
\`\`\`

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
    template: `/plan
Create a comprehensive implementation plan for {project_name} that aligns with SDD constitutional principles.

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
\`\`\`bash
/plan {project_name}-implementation.md
/tasks
/constitution check {project_name}-implementation.md
\`\`\`

## Constitutional Compliance Requirements:
✓ **Library-First Principle**: Each component starts as a standalone library
✓ **CLI Interface Mandate**: All functionality accessible via command-line interfaces
✓ **Test-First Imperative**: No implementation code before tests
✓ **Integration-First Testing**: Use realistic environments over mocks

## Project Structure:
\`\`\`
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
\`\`\`

## Example Implementation Plan Format:
\`\`\`markdown
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
\`\`\``,
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
    whatToDoNext: '1. Execute the prompt `/analyze` to perform analysis.\n2. Update as needed: Refine your analysis approach based on findings or changing requirements.\n3. When you are done, you may be prompted to allow it to show you changes.  Proceed with allowing it to show you changes, then use "can you go ahead and make these edits for me?  use sequential-thinking" to have your coding agent resolve the problems.\n4. Re-run `/analyze` another time and repeat.',
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

export default promptTemplates