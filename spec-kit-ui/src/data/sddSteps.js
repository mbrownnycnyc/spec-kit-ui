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
    ],
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

export default sddSteps