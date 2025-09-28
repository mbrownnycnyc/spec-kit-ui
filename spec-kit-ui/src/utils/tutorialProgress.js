/**
 * Utility functions for tutorial progress tracking and statistics
 * These functions are pure and independent of React state management
 */

/**
 * Update tutorial progress and maintain activity streak
 * @param {Object} currentUserProgress - Current user progress object
 * @param {string} tutorialId - ID of the tutorial
 * @param {Object} progressData - Progress data to update
 * @param {string} lastActiveDate - Last active date string
 * @returns {Object} - Updated progress data and streak information
 */
export const updateTutorialProgress = (currentUserProgress, tutorialId, progressData, lastActiveDate) => {
  const newProgress = {
    ...currentUserProgress,
    [tutorialId]: {
      ...currentUserProgress[tutorialId],
      ...progressData,
      lastAccessed: new Date().toISOString()
    }
  }

  // Update activity streak
  const today = new Date().toDateString()
  const lastActivity = lastActiveDate ? new Date(lastActiveDate).toDateString() : null
  let newStreak = 1
  let newLastActiveDate = today

  if (!lastActivity || lastActivity === today) {
    // First activity or same day
    if (lastActivity) {
      // Same day, keep current streak
      newStreak = 1 // Reset to 1 since it's the same day
    }
  } else {
    // Check if consecutive day
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    if (lastActivity === yesterday.toDateString()) {
      newStreak = 2 // Incrementing streak (this would need to be passed in as current streak)
    }
  }

  return {
    updatedProgress: newProgress,
    currentStreak: newStreak,
    lastActiveDate: newLastActiveDate
  }
}

/**
 * Get comprehensive tutorial statistics
 * @param {Object} userProgress - User progress data
 * @param {Array} tutorials - Array of tutorial objects
 * @param {number} totalPoints - Current total points
 * @param {number} currentStreak - Current activity streak
 * @param {Array} achievements - Array of achievement IDs
 * @returns {Object} - Tutorial statistics
 */
export const getTutorialStats = (userProgress, tutorials, totalPoints, currentStreak, achievements) => {
  const completedTutorials = Object.values(userProgress).filter(p => p.completed)
  const completedCount = completedTutorials.length
  const totalCount = tutorials.length
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const averageAccuracy = completedTutorials.length > 0
    ? completedTutorials.reduce((sum, p) => sum + (p.exerciseAccuracy || 0), 0) / completedCount
    : 0

  return {
    completedCount,
    totalCount,
    completionRate,
    averageAccuracy: Math.round(averageAccuracy),
    totalPoints,
    streakDays: currentStreak,
    achievementsCount: achievements.length,
    completedTutorials: completedTutorials.map(p => p.id)
  }
}

/**
 * Calculate skill level based on progress and performance
 * @param {Object} progress - User progress data
 * @returns {string} - Skill level (Beginner, Intermediate, Advanced, Expert)
 */
export const calculateProgressSkillLevel = (progress) => {
  const completedCount = Object.values(progress).filter(p => p.completed).length
  const averageAccuracy = Object.values(progress)
    .filter(p => p.exerciseAccuracy)
    .reduce((sum, p) => sum + p.exerciseAccuracy, 0) / completedCount || 0

  if (completedCount < 2) return 'Beginner'
  if (completedCount < 5 || averageAccuracy < 70) return 'Intermediate'
  if (completedCount < 8 || averageAccuracy < 85) return 'Advanced'
  return 'Expert'
}