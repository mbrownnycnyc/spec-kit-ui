const communityPostsData = [
  {
    id: 1,
    author: 'Alex Chen',
    avatar: '👨‍💻',
    title: 'Best practices for writing SDD specifications',
    content: 'I\'ve been using SDD for 6 months now and wanted to share some tips for writing better specifications...',
    category: 'discussion',
    likes: 24,
    comments: 8,
    timestamp: '2 hours ago',
    tags: ['specifications', 'best-practices'],
    replies: [
      {
        id: 101,
        author: 'Sarah Kim',
        avatar: '👩‍💼',
        content: 'Great tips! I especially agree with the "be specific" point.',
        timestamp: '1 hour ago'
      }
    ]
  },
  {
    id: 2,
    author: 'Marcus Johnson',
    avatar: '🚀',
    title: 'How SDD saved our startup project',
    content: 'We were about to fail our project until we adopted SDD methodology. Here\'s our success story...',
    category: 'success-story',
    likes: 42,
    comments: 15,
    timestamp: '1 day ago',
    tags: ['success-story', 'startup'],
    replies: []
  }
]

export default communityPostsData