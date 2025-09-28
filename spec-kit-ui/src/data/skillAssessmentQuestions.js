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

export default skillAssessmentQuestions