import { useState, useEffect } from 'react'
import tutorials from '../data/tutorials'
import achievementDefinitions from '../data/achievementDefinitions'

/**
 * Custom hook for managing user progress tracking and achievement system
 * @param {Object} initialProgress - Initial user progress data
 * @param {Object} options - Configuration options
 * @returns {Array} - [state, actions] array containing state and action functions
 */
export const useProgressTracking = (initialProgress = {}, options = {}) => {
  const { enablePersistence = true, enableAchievements = true } = options

  // Progress state
  const [userProgress, setUserProgress] = useState(initialProgress)
  const [achievements, setAchievements] = useState([])
  const [showAchievementsModal, setShowAchievementsModal] = useState(false)
  const [showAchievementNotifications, setShowAchievementNotifications] = useState(false)
  const [totalPoints, setTotalPoints] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [lastActiveDate, setLastActiveDate] = useState(null)

  // Initialize from localStorage if enabled
  useEffect(() => {
    if (enablePersistence) {
      const savedProgress = localStorage.getItem('sddUserProgress')
      const savedAchievements = localStorage.getItem('sddAchievements')
      const savedPoints = localStorage.getItem('sddTotalPoints')
      const savedStreak = localStorage.getItem('sddCurrentStreak')
      const savedLastActive = localStorage.getItem('sddLastActiveDate')

      if (savedProgress) setUserProgress(JSON.parse(savedProgress))
      if (savedAchievements) setAchievements(JSON.parse(savedAchievements))
      if (savedPoints) setTotalPoints(parseInt(savedPoints))
      if (savedStreak) setCurrentStreak(parseInt(savedStreak))
      if (savedLastActive) setLastActiveDate(savedLastActive)
    }
  }, [enablePersistence])

  // Save to localStorage when state changes
  useEffect(() => {
    if (enablePersistence) {
      localStorage.setItem('sddUserProgress', JSON.stringify(userProgress))
      localStorage.setItem('sddAchievements', JSON.stringify(achievements))
      localStorage.setItem('sddTotalPoints', totalPoints.toString())
      localStorage.setItem('sddCurrentStreak', currentStreak.toString())
      localStorage.setItem('sddLastActiveDate', lastActiveDate)
    }
  }, [userProgress, achievements, totalPoints, currentStreak, lastActiveDate, enablePersistence])

  /**
   * Update tutorial progress and maintain activity streak
   * @param {string} tutorialId - ID of the tutorial
   * @param {Object} progressData - Progress data to update
   */
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
    const lastActivity = lastActiveDate ? new Date(lastActiveDate).toDateString() : null

    if (!lastActivity || lastActivity === today) {
      // First activity or same day
      setLastActiveDate(today)
      if (!lastActivity) {
        setCurrentStreak(1)
      }
    } else {
      // Check if consecutive day
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      if (lastActivity === yesterday.toDateString()) {
        setCurrentStreak(prev => prev + 1)
        setLastActiveDate(today)
      } else if (lastActivity !== today) {
        // Streak broken, reset
        setCurrentStreak(1)
        setLastActiveDate(today)
      }
    }

    // Check for achievements if enabled
    if (enableAchievements) {
      checkAndAwardAchievements(newProgress)
    }
  }

  /**
   * Award achievement points for tutorial completion
   * @param {string} tutorialId - ID of the completed tutorial
   * @param {number} exerciseAccuracy - Exercise accuracy percentage
   */
  const completeTutorial = (tutorialId, exerciseAccuracy = 0) => {
    const basePoints = 100
    const accuracyBonus = Math.round(basePoints * (exerciseAccuracy / 100))
    const totalEarned = basePoints + accuracyBonus

    setTotalPoints(prev => prev + totalEarned)

    // Award streak bonus
    if (currentStreak >= 3) {
      const streakBonus = Math.round(totalEarned * 0.1 * Math.min(currentStreak, 7))
      setTotalPoints(prev => prev + streakBonus)
    }

    updateTutorialProgress(tutorialId, {
      completed: true,
      exerciseAccuracy,
      pointsEarned: totalEarned,
      completedAt: new Date().toISOString()
    })
  }

  /**
   * Check and award achievements based on user progress
   * @param {Object} progress - Current user progress
   */
  const checkAndAwardAchievements = (progress) => {
    const newAchievements = []

    achievementDefinitions.forEach(achievement => {
      if (!achievements.includes(achievement.id) &&
          achievement.condition(progress, currentStreak)) {
        newAchievements.push(achievement.id)
        setAchievements(prev => [...prev, achievement.id])
        setTotalPoints(prev => prev + achievement.points)
      }
    })

    if (newAchievements.length > 0) {
      // Show achievement notifications
      setShowAchievementNotifications(true)
      setTimeout(() => setShowAchievementNotifications(false), 5000)
    }
  }

  /**
   * Get comprehensive tutorial statistics
   * @returns {Object} - Tutorial statistics
   */
  const getTutorialStats = () => {
    const completedTutorials = Object.values(userProgress).filter(p => p.completed)
    const completedCount = completedTutorials.length
    const totalCount = tutorials.length
    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    const averageAccuracy = completedTutorials.length > 0
      ? completedTutorials.reduce((sum, p) => sum + (p.exerciseAccuracy || 0), 0) / completedCount
      : 0

    // Calculate skill level based on completion and accuracy
    const skillLevel = calculateSkillLevel(userProgress)

    return {
      completedCount,
      totalCount,
      completionRate,
      averageAccuracy: Math.round(averageAccuracy),
      totalPoints,
      currentStreak,
      achievementsCount: achievements.length,
      skillLevel,
      completedTutorials: completedTutorials.map(p => p.id)
    }
  }

  /**
   * Calculate skill level based on progress and performance
   * @param {Object} progress - User progress data
   * @returns {string} - Skill level (Beginner, Intermediate, Advanced, Expert)
   */
  const calculateSkillLevel = (progress) => {
    const completedCount = Object.values(progress).filter(p => p.completed).length
    const averageAccuracy = Object.values(progress)
      .filter(p => p.exerciseAccuracy)
      .reduce((sum, p) => sum + p.exerciseAccuracy, 0) / completedCount || 0

    if (completedCount < 2) return 'Beginner'
    if (completedCount < 5 || averageAccuracy < 70) return 'Intermediate'
    if (completedCount < 8 || averageAccuracy < 85) return 'Advanced'
    return 'Expert'
  }

  /**
   * Reset all progress (for testing purposes)
   */
  const resetProgress = () => {
    setUserProgress({})
    setAchievements([])
    setTotalPoints(0)
    setCurrentStreak(0)
    setLastActiveDate(null)

    if (enablePersistence) {
      localStorage.removeItem('sddUserProgress')
      localStorage.removeItem('sddAchievements')
      localStorage.removeItem('sddTotalPoints')
      localStorage.removeItem('sddCurrentStreak')
      localStorage.removeItem('sddLastActiveDate')
    }
  }

  return {
    // State
    userProgress,
    achievements,
    currentStreak,
    lastActiveDate,
    totalPoints,
    showAchievementsModal,
    showAchievementNotifications,

    // Actions
    updateTutorialProgress,
    completeTutorial,
    checkAndAwardAchievements,
    getTutorialStats,
    calculateSkillLevel,
    resetProgress,
    setShowAchievementsModal
  }
}