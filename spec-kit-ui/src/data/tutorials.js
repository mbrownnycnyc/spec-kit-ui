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

export default tutorials