/**
 * Utility functions for skill assessment and learning path generation
 * These functions are pure and independent of React state management
 */

/**
 * Calculate skill level based on assessment answers
 * @param {Object} answers - User's assessment answers
 * @returns {number} - Skill level score (1-15)
 */
export const calculateSkillLevel = (answers) => {
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
    'Used it occasionally': 3,
    'Regular practitioner': 4,
    'Expert level': 5
  }
  score += familiarityMap[answers.familiarity] || 1

  // Technical background scoring
  if (answers.backgrounds) {
    const backgroundMap = {
      'Software Development': 2,
      'Project Management': 2,
      'System Architecture': 2,
      'Quality Assurance': 1,
      'Business Analysis': 1,
      'Product Management': 1
    }
    score += answers.backgrounds.reduce((sum, bg) => sum + (backgroundMap[bg] || 0), 0)
  }

  // Challenge preferences (add variety score)
  if (answers.challenges) {
    score += answers.challenges.length * 0.5
  }

  // Learning goals alignment
  if (answers.goals) {
    const goalAlignment = {
      'Learn SDD methodology': 2,
      'Improve specification quality': 2,
      'Better implementation planning': 2,
      'Team collaboration': 1,
      'Personal projects': 1
    }
    score += answers.goals.reduce((sum, goal) => sum + (goalAlignment[goal] || 0), 0)
  }

  return Math.min(15, Math.max(1, Math.round(score)))
}

/**
 * Generate personalized learning path based on skill level and answers
 * @param {number} skillLevel - Calculated skill level
 * @param {Object} userAnswers - User's assessment answers
 * @returns {Array} - Array of recommended tutorial IDs
 */
export const generateLearningPath = (skillLevel, userAnswers) => {
  let recommendedPath = []

  // Base path structure
  const beginnerPath = [
    'sdd-fundamentals',
    'getting-started',
    'basic-commands',
    'specification-basics',
    'implementation-planning',
    'quick-start-exercise'
  ]

  const intermediatePath = [
    'sdd-fundamentals',
    'advanced-specification',
    'implementation-planning',
    'task-generation',
    'testing-strategies',
    'team-collaboration'
  ]

  const advancedPath = [
    'advanced-specification',
    'implementation-planning',
    'task-generation',
    'testing-strategies',
    'team-collaboration',
    'case-studies'
  ]

  const expertPath = [
    'advanced-specification',
    'implementation-planning',
    'task-generation',
    'testing-strategies',
    'team-collaboration',
    'case-studies',
    'best-practices'
  ]

  // Select base path based on skill level
  if (skillLevel <= 6) {
    recommendedPath = beginnerPath
  } else if (skillLevel <= 10) {
    recommendedPath = intermediatePath
  } else if (skillLevel <= 13) {
    recommendedPath = advancedPath
  } else {
    recommendedPath = expertPath
  }

  // Customize path based on user's background and goals
  if (userAnswers.backgrounds && userAnswers.backgrounds.includes('Project Management')) {
    recommendedPath.push('team-collaboration')
  }

  if (userAnswers.backgrounds && userAnswers.backgrounds.includes('Quality Assurance')) {
    recommendedPath.push('testing-strategies')
  }

  if (userAnswers.goals && userAnswers.goals.includes('Team collaboration')) {
    recommendedPath.push('team-collaboration')
  }

  // Remove duplicates while preserving order
  return [...new Set(recommendedPath)]
}