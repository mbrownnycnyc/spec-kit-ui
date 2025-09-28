# Custom Hooks for Spec-Kit UI

This directory contains custom React hooks that extract state management logic from App.jsx, making the codebase more modular and maintainable.

## Available Hooks

### 1. useTutorialPlayer
Manages tutorial player state and functionality.

**Usage:**
```jsx
import { useTutorialPlayer } from './hooks'

function MyComponent() {
  const {
    activeTutorial,
    currentStep,
    tutorialCompleted,
    exerciseAnswers,
    showTutorialPlayer,
    // Actions
    startTutorial,
    closeTutorial,
    nextStep,
    previousStep,
    handleExerciseAnswer,
    getTutorialProgress
  } = useTutorialPlayer()

  const handleNextStep = () => {
    nextStep(updateProgress)
  }

  return (
    // Your JSX here
  )
}
```

**State:**
- `activeTutorial`: Currently active tutorial index
- `currentStep`: Current step in the tutorial
- `tutorialCompleted`: Whether tutorial is completed
- `exerciseAnswers`: User's exercise answers
- `showTutorialPlayer`: Whether tutorial player is visible

**Actions:**
- `startTutorial(tutorialIndex)`: Start a tutorial
- `closeTutorial()`: Close tutorial player
- `nextStep(updateProgress)`: Move to next step
- `previousStep()`: Move to previous step
- `handleExerciseAnswer(stepIndex, answer)`: Handle exercise answer
- `getTutorialProgress()`: Get progress percentage

---

### 2. useProgressTracking
Manages user progress tracking and achievement system.

**Usage:**
```jsx
import { useProgressTracking } from './hooks'

function MyComponent() {
  const {
    userProgress,
    achievements,
    currentStreak,
    totalPoints,
    // Actions
    updateTutorialProgress,
    completeTutorial,
    checkAndAwardAchievements,
    getTutorialStats
  } = useProgressTracking({
    enablePersistence: true,
    enableAchievements: true
  })

  const handleTutorialComplete = (tutorialId, accuracy) => {
    completeTutorial(tutorialId, accuracy)
  }

  return (
    // Your JSX here
  )
}
```

**State:**
- `userProgress`: User's tutorial progress data
- `achievements`: Array of earned achievements
- `currentStreak`: Current activity streak in days
- `totalPoints`: Total points earned
- `lastActiveDate`: Last active date

**Actions:**
- `updateTutorialProgress(tutorialId, progressData)`: Update tutorial progress
- `completeTutorial(tutorialId, exerciseAccuracy)`: Mark tutorial as completed
- `checkAndAwardAchievements(progress)`: Check and award achievements
- `getTutorialStats()`: Get comprehensive statistics

**Options:**
- `enablePersistence`: Enable localStorage persistence (default: true)
- `enableAchievements`: Enable achievement system (default: true)

---

### 3. useCommunityFeatures
Manages community features and collaboration functionality.

**Usage:**
```jsx
import { useCommunityFeatures } from './hooks'

function MyComponent() {
  const {
    activeCommunityTab,
    communityPosts,
    userReputation,
    // Actions
    createCommunityPost,
    likePost,
    addComment,
    getCommunityStats
  } = useCommunityFeatures({
    enablePersistence: true,
    enableRealTimeUpdates: false
  })

  const handleCreatePost = () => {
    createCommunityPost({
      content: 'My post content',
      title: 'New Discussion',
      category: 'discussion'
    })
  }

  return (
    // Your JSX here
  )
}
```

**State:**
- `activeCommunityTab`: Currently active community tab
- `communityPosts`: Array of community posts
- `showCreatePost`: Whether to show create post form
- `peerReviews`: Array of peer review requests
- `userReputation`: User's reputation score

**Actions:**
- `createCommunityPost(postData)`: Create new post
- `likePost(postId)`: Like a post
- `addComment(postId, comment)`: Add comment to post
- `createPeerReview(requestData)`: Create peer review request
- `submitReview(reviewId, reviewData)`: Submit review
- `getCommunityStats()`: Get community statistics

---

### 4. useSkillAssessment
Manages skill assessment and adaptive learning functionality.

**Usage:**
```jsx
import { useSkillAssessment } from './hooks'

function MyComponent() {
  const {
    assessmentStarted,
    currentQuestion,
    assessmentAnswers,
    userSkillLevel,
    recommendedTutorials,
    // Actions
    startAssessment,
    handleAnswer,
    completeAssessment,
    isRecommendedTutorial
  } = useSkillAssessment({
    enableAdaptiveDifficulty: true,
    enablePersistence: true
  })

  const handleStartAssessment = () => {
    startAssessment('medium')
  }

  return (
    // Your JSX here
  )
}
```

**State:**
- `assessmentStarted`: Whether assessment is started
- `currentQuestion`: Current question index
- `assessmentAnswers`: User's answers
- `userSkillLevel`: Calculated skill level
- `recommendedTutorials`: Array of recommended tutorials
- `learningPath`: Generated learning path

**Actions:**
- `startAssessment(difficulty)`: Start assessment
- `handleAnswer(questionId, answer)`: Handle user answer
- `completeAssessment()`: Complete assessment
- `resetAssessment()`: Reset assessment
- `getAssessmentProgress()`: Get progress percentage
- `isRecommendedTutorial(tutorialId)`: Check if tutorial is recommended

## Integration with App.jsx

To integrate these hooks into App.jsx, add the following import statements:

```jsx
import { useTutorialPlayer } from './hooks/useTutorialPlayer'
import { useProgressTracking } from './hooks/useProgressTracking'
import { useCommunityFeatures } from './hooks/useCommunityFeatures'
import { useSkillAssessment } from './hooks/useSkillAssessment'
```

Or use the convenience import:

```jsx
import { useTutorialPlayer, useProgressTracking, useCommunityFeatures, useSkillAssessment } from './hooks'
```

## Benefits

1. **Separation of Concerns**: Each hook manages a specific domain of functionality
2. **Reusability**: Hooks can be reused across multiple components
3. **Testability**: Logic is isolated and easier to test
4. **Maintainability**: Code is more organized and easier to understand
5. **Type Safety**: All hooks include proper TypeScript-style documentation
6. **Flexibility**: Each hook accepts configuration options for customization

## Best Practices

1. **Initialize hooks at the top level** of your component
2. **Use destructuring** to extract only the state and actions you need
3. **Configure options** when initializing hooks (persistence, etc.)
4. **Combine hooks** to create more complex functionality
5. **Test hook logic** separately from component logic