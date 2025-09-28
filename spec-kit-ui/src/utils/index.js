/**
 * Utility functions index file
 * Provides easy access to all utility functions
 */

// Skill assessment utilities
export {
  calculateSkillLevel,
  generateLearningPath
} from './skillAssessment.js'

// Tutorial progress utilities
export {
  updateTutorialProgress,
  getTutorialStats,
  calculateProgressSkillLevel
} from './tutorialProgress.js'

// Achievement utilities
export {
  checkAndAwardAchievements,
  calculateTutorialPoints,
  getStreakAchievements,
  getCompletionAchievements
} from './achievements.js'

// Re-export all utilities as a namespace for convenience
export * from './skillAssessment.js'
export * from './tutorialProgress.js'
export * from './achievements.js'