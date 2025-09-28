import { useState } from 'react'
import tutorials from '../data/tutorials'
import skillAssessmentQuestions from '../data/skillAssessmentQuestions'

/**
 * Custom hook for managing skill assessment and adaptive learning
 * @param {Object} options - Configuration options
 * @returns {Array} - [state, actions] array containing state and action functions
 */
export const useSkillAssessment = (options = {}) => {
  const { enableAdaptiveDifficulty = true, enablePersistence = true } = options

  // Assessment state
  const [assessmentStarted, setAssessmentStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [assessmentAnswers, setAssessmentAnswers] = useState({})
  const [assessmentResult, setAssessmentResult] = useState(null)
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState('medium')
  const [showSkillAssessment, setShowSkillAssessment] = useState(false)
  const [recommendedTutorials, setRecommendedTutorials] = useState([])
  const [userSkillLevel, setUserSkillLevel] = useState(null)
  const [learningPath, setLearningPath] = useState([])

  /**
   * Start the skill assessment
   * @param {string} difficulty - Starting difficulty level
   */
  const startAssessment = (difficulty = 'medium') => {
    setAssessmentStarted(true)
    setCurrentQuestion(0)
    setAssessmentAnswers({})
    setAssessmentResult(null)
    setAdaptiveDifficulty(difficulty)
    setShowSkillAssessment(true)
    setUserSkillLevel(null)
  }

  /**
   * Handle user answer to assessment questions
   * @param {string} questionId - ID of the question
   * @param {string|Array} answer - User's answer
   */
  const handleAnswer = (questionId, answer) => {
    setAssessmentAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))

    // Move to next question
    if (currentQuestion < skillAssessmentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // Assessment completed
      completeAssessment()
    }
  }

  /**
   * Complete the assessment and calculate results
   */
  const completeAssessment = () => {
    const skillLevel = calculateSkillLevel(assessmentAnswers)
    const generatedPath = generateLearningPath(skillLevel, assessmentAnswers)

    setAssessmentResult({
      skillLevel,
      learningPath: generatedPath,
      answers: assessmentAnswers,
      completedAt: new Date().toISOString()
    })

    setUserSkillLevel(skillLevel)
    setRecommendedTutorials(generatedPath)
    setLearningPath(generatedPath)

    // Save to localStorage if enabled
    if (enablePersistence) {
      localStorage.setItem('sddSkillAssessment', JSON.stringify({
        skillLevel,
        learningPath: generatedPath,
        completedAt: new Date().toISOString()
      }))
    }
  }

  /**
   * Calculate skill level based on assessment answers
   * @param {Object} answers - User's assessment answers
   * @returns {number} - Skill level score (1-15)
   */
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
  const generateLearningPath = (skillLevel, userAnswers) => {
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

  /**
   * Get adaptive question based on current performance
   * @returns {Object} - Adaptive question
   */
  const getAdaptiveQuestion = () => {
    if (!enableAdaptiveDifficulty) {
      return skillAssessmentQuestions[currentQuestion]
    }

    // Filter questions by difficulty
    const difficultyMap = {
      'easy': skillAssessmentQuestions.filter(q => q.difficulty === 'easy'),
      'medium': skillAssessmentQuestions.filter(q => q.difficulty === 'medium'),
      'hard': skillAssessmentQuestions.filter(q => q.difficulty === 'hard')
    }

    const questions = difficultyMap[adaptiveDifficulty] || difficultyMap.medium

    // Return current question if available, otherwise get next question of appropriate difficulty
    if (currentQuestion < questions.length) {
      return questions[currentQuestion]
    }

    // Fallback to next available question
    return skillAssessmentQuestions[currentQuestion] || skillAssessmentQuestions[0]
  }

  /**
   * Adjust difficulty based on user performance
   * @param {boolean} correct - Whether the user answered correctly
   */
  const adjustDifficulty = (correct) => {
    if (!enableAdaptiveDifficulty) return

    const difficultyLevels = ['easy', 'medium', 'hard']
    const currentIndex = difficultyLevels.indexOf(adaptiveDifficulty)

    if (correct && currentIndex < difficultyLevels.length - 1) {
      setAdaptiveDifficulty(difficultyLevels[currentIndex + 1])
    } else if (!correct && currentIndex > 0) {
      setAdaptiveDifficulty(difficultyLevels[currentIndex - 1])
    }
  }

  /**
   * Reset the assessment
   */
  const resetAssessment = () => {
    setAssessmentStarted(false)
    setCurrentQuestion(0)
    setAssessmentAnswers({})
    setAssessmentResult(null)
    setAdaptiveDifficulty('medium')
    setShowSkillAssessment(false)
    setRecommendedTutorials([])
    setUserSkillLevel(null)
    setLearningPath([])
  }

  /**
   * Get assessment progress percentage
   * @returns {number} - Progress percentage (0-100)
   */
  const getAssessmentProgress = () => {
    return ((currentQuestion + 1) / skillAssessmentQuestions.length) * 100
  }

  /**
   * Check if a tutorial is in the user's learning path
   * @param {string} tutorialId - ID of the tutorial
   * @returns {boolean} - Whether tutorial is recommended
   */
  const isRecommendedTutorial = (tutorialId) => {
    return recommendedTutorials.includes(tutorialId)
  }

  /**
   * Get skill level description
   * @returns {Object} - Skill level details
   */
  const getSkillLevelDetails = () => {
    const levels = {
      1: { level: 'Beginner', description: 'Just starting with SDD' },
      2: { level: 'Beginner', description: 'Learning basic concepts' },
      3: { level: 'Beginner', description: 'Understanding fundamentals' },
      4: { level: 'Beginner', description: 'Grasping core principles' },
      5: { level: 'Beginner', description: 'Building foundation' },
      6: { level: 'Intermediate', description: 'Developing practical skills' },
      7: { level: 'Intermediate', description: 'Applying SDD concepts' },
      8: { level: 'Intermediate', description: 'Improving methodology' },
      9: { level: 'Intermediate', description: 'Refining approach' },
      10: { level: 'Intermediate', description: 'Gaining proficiency' },
      11: { level: 'Advanced', description: 'Mastering advanced topics' },
      12: { level: 'Advanced', description: 'Optimizing workflows' },
      13: { level: 'Advanced', description: 'Leading implementations' },
      14: { level: 'Expert', description: 'Innovating with SDD' },
      15: { level: 'Expert', description: 'Teaching and mentoring' }
    }

    return levels[userSkillLevel] || levels[1]
  }

  return {
    // State
    assessmentStarted,
    currentQuestion,
    assessmentAnswers,
    assessmentResult,
    adaptiveDifficulty,
    showSkillAssessment,
    recommendedTutorials,
    userSkillLevel,
    learningPath,

    // Actions
    startAssessment,
    handleAnswer,
    completeAssessment,
    calculateSkillLevel,
    generateLearningPath,
    resetAssessment,
    adjustDifficulty,
    getAdaptiveQuestion,
    getAssessmentProgress,
    isRecommendedTutorial,
    getSkillLevelDetails,
    setShowSkillAssessment
  }
}