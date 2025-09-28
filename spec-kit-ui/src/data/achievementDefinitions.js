const achievementDefinitions = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first tutorial',
    icon: '👶',
    points: 50,
    condition: (progress) => Object.keys(progress).length >= 1 && Object.values(progress).some(p => p.completed)
  },
  {
    id: 'quick-learner',
    title: 'Quick Learner',
    description: 'Complete 3 tutorials',
    icon: '🚀',
    points: 150,
    condition: (progress) => Object.values(progress).filter(p => p.completed).length >= 3
  },
  {
    id: 'sdd-master',
    title: 'SDD Master',
    description: 'Complete all beginner tutorials',
    icon: '🎓',
    points: 300,
    condition: (progress) => {
      const beginnerTutorials = tutorials.filter(t => t.level === 'Beginner')
      return beginnerTutorials.every(t => progress[t.id]?.completed)
    }
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete a tutorial with 100% exercise accuracy',
    icon: '💯',
    points: 200,
    condition: (progress) => Object.values(progress).some(p => p.completed && p.exerciseAccuracy === 100)
  },
  {
    id: 'consistent-learner',
    title: 'Consistent Learner',
    description: 'Complete tutorials on 3 consecutive days',
    icon: '📅',
    points: 250,
    condition: (progress, streak) => streak >= 3
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Try tutorials from all difficulty levels',
    icon: '🗺️',
    points: 400,
    condition: (progress) => {
      const completedLevels = new Set()
      Object.entries(progress).forEach(([tutorialId, p]) => {
        if (p.completed) {
          const tutorial = tutorials.find(t => t.id === tutorialId)
          if (tutorial) completedLevels.add(tutorial.level)
        }
      })
      return completedLevels.size >= 3
    }
  },
  {
    id: 'expert-level',
    title: 'Expert Level',
    description: 'Complete all advanced tutorials',
    icon: '🏆',
    points: 500,
    condition: (progress) => {
      const advancedTutorials = tutorials.filter(t => t.level === 'Advanced')
      return advancedTutorials.every(t => progress[t.id]?.completed)
    }
  }
]

export default achievementDefinitions