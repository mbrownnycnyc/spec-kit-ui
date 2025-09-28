/**
 * Utility functions for achievement checking and awarding
 * These functions are pure and independent of React state management
 */

/**
 * Check and award achievements based on user progress
 * @param {Object} progress - Current user progress
 * @param {number} currentStreak - Current activity streak
 * @param {Array} existingAchievements - Array of already earned achievement IDs
 * @param {Array} achievementDefinitions - Array of achievement definitions
 * @returns {Object} - Object containing new achievements and total points earned
 */
export const checkAndAwardAchievements = (progress, currentStreak, existingAchievements, achievementDefinitions) => {
  const newAchievements = []
  let totalPointsEarned = 0

  achievementDefinitions.forEach(achievement => {
    if (!existingAchievements.includes(achievement.id) &&
        achievement.condition(progress, currentStreak)) {
      newAchievements.push(achievement.id)
      totalPointsEarned += achievement.points
    }
  })

  return {
    newAchievements,
    totalPointsEarned
  }
}

/**
 * Calculate tutorial completion points with accuracy bonus
 * @param {number} exerciseAccuracy - Exercise accuracy percentage
 * @param {number} currentStreak - Current activity streak
 * @returns {Object} - Points breakdown including base, accuracy bonus, and streak bonus
 */
export const calculateTutorialPoints = (exerciseAccuracy, currentStreak) => {
  const basePoints = 100
  const accuracyBonus = Math.round(basePoints * (exerciseAccuracy / 100))
  let streakBonus = 0

  // Award streak bonus
  if (currentStreak >= 3) {
    streakBonus = Math.round(basePoints * 0.1 * Math.min(currentStreak, 7))
  }

  const totalEarned = basePoints + accuracyBonus + streakBonus

  return {
    basePoints,
    accuracyBonus,
    streakBonus,
    totalEarned
  }
}

/**
 * Check if user qualifies for streak-based achievements
 * @param {number} currentStreak - Current activity streak
 * @returns {Array} - Array of streak-based achievement IDs user qualifies for
 */
export const getStreakAchievements = (currentStreak) => {
  const streakAchievements = []

  if (currentStreak >= 3) streakAchievements.push('streak-warrior')
  if (currentStreak >= 7) streakAchievements.push('week-warrior')
  if (currentStreak >= 14) streakAchievements.push('fortnight-fighter')
  if (currentStreak >= 30) streakAchievements.push('monthly-master')
  if (currentStreak >= 90) streakAchievements.push('quarterly-queen')
  if (currentStreak >= 365) streakAchievements.push('yearly-yoda')

  return streakAchievements
}

/**
 * Check if user qualifies for completion-based achievements
 * @param {Object} progress - User progress data
 * @returns {Array} - Array of completion-based achievement IDs user qualifies for
 */
export const getCompletionAchievements = (progress) => {
  const completionAchievements = []
  const completedCount = Object.values(progress).filter(p => p.completed).length

  if (completedCount >= 1) completionAchievements.push('first-steps')
  if (completedCount >= 3) completionAchievements.push('getting-started')
  if (completedCount >= 5) completionAchievements.push('halfway-there')
  if (completedCount >= 8) completionAchievements.push('sdd-scholar')
  if (completedCount >= 10) completionAchievements.push('master-student')
  if (completedCount >= 15) completionAchievements.push('completion-king')

  return completionAchievements
}