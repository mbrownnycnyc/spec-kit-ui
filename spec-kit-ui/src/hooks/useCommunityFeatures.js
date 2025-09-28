import { useState, useEffect } from 'react'
import communityPostsData from '../data/communityPostsData'
import peerReviewRequests from '../data/peerReviewRequests'

/**
 * Custom hook for managing community features and collaboration
 * @param {Object} options - Configuration options
 * @returns {Array} - [state, actions] array containing state and action functions
 */
export const useCommunityFeatures = (options = {}) => {
  const { enablePersistence = true, enableRealTimeUpdates = false } = options

  // Community state
  const [activeCommunityTab, setActiveCommunityTab] = useState('discussions')
  const [communityPosts, setCommunityPosts] = useState([])
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [peerReviews, setPeerReviews] = useState([])
  const [userReputation, setUserReputation] = useState(0)
  const [showCommunityModal, setShowCommunityModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize with mock data
  useEffect(() => {
    setCommunityPosts(communityPostsData)
    setPeerReviews(peerReviewRequests)
  }, [])

  // Load persisted data if enabled
  useEffect(() => {
    if (enablePersistence) {
      const savedPosts = localStorage.getItem('sddCommunityPosts')
      const savedReputation = localStorage.getItem('sddUserReputation')

      if (savedPosts) setCommunityPosts(JSON.parse(savedPosts))
      if (savedReputation) setUserReputation(parseInt(savedReputation))
    }
  }, [enablePersistence])

  // Save to localStorage when state changes
  useEffect(() => {
    if (enablePersistence) {
      localStorage.setItem('sddCommunityPosts', JSON.stringify(communityPosts))
      localStorage.setItem('sddUserReputation', userReputation.toString())
    }
  }, [communityPosts, userReputation, enablePersistence])

  /**
   * Create a new community post
   * @param {Object} postData - Post data (optional, uses newPostContent if not provided)
   * @returns {Object|null} - Created post or null if creation failed
   */
  const createCommunityPost = (postData = null) => {
    const content = postData?.content || newPostContent

    if (!content.trim()) {
      return null
    }

    const newPost = {
      id: Date.now(), // Use timestamp for unique ID
      author: 'You',
      avatar: '😊',
      title: postData?.title || 'New Discussion',
      content: content,
      category: postData?.category || 'discussion',
      likes: 0,
      comments: 0,
      timestamp: 'Just now',
      tags: postData?.tags || [],
      replies: [],
      isUserPost: true,
      createdAt: new Date().toISOString()
    }

    setCommunityPosts(prev => [newPost, ...prev])
    setNewPostContent('')
    setShowCreatePost(false)

    // Award reputation for creating posts
    setUserReputation(prev => prev + 5)

    return newPost
  }

  /**
   * Like a community post
   * @param {number} postId - ID of the post to like
   */
  const likePost = (postId) => {
    setCommunityPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const updatedPost = { ...post, likes: post.likes + 1 }
        if (post.isUserPost) {
          setUserReputation(prev => prev + 1) // Small reputation bonus for engagement
        }
        return updatedPost
      }
      return post
    }))
  }

  /**
   * Add a comment to a post
   * @param {number} postId - ID of the post to comment on
   * @param {string} comment - Comment content
   */
  const addComment = (postId, comment) => {
    if (!comment.trim()) return

    const newComment = {
      id: Date.now(),
      author: 'You',
      avatar: '😊',
      content: comment,
      timestamp: 'Just now',
      likes: 0,
      createdAt: new Date().toISOString()
    }

    setCommunityPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const updatedPost = {
          ...post,
          comments: post.comments + 1,
          replies: [...(post.replies || []), newComment]
        }
        if (post.isUserPost) {
          setUserReputation(prev => prev + 3) // Reputation for receiving comments
        }
        return updatedPost
      }
      return post
    }))

    setUserReputation(prev => prev + 2) // Reputation for commenting
  }

  /**
   * Create a peer review request
   * @param {Object} requestData - Peer review request data
   */
  const createPeerReview = (requestData) => {
    const newReview = {
      id: Date.now(),
      author: 'You',
      title: requestData.title,
      description: requestData.description,
      category: requestData.category || 'specification',
      status: 'pending',
      timestamp: 'Just now',
      reviewers: [],
      createdAt: new Date().toISOString()
    }

    setPeerReviews(prev => [newReview, ...prev])
    setUserReputation(prev => prev + 10) // Reputation for creating review requests

    return newReview
  }

  /**
   * Submit a review for a peer review request
   * @param {number} reviewId - ID of the review request
   * @param {Object} reviewData - Review submission data
   */
  const submitReview = (reviewId, reviewData) => {
    setPeerReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          status: 'completed',
          reviewers: [
            ...(review.reviewers || []),
            {
              reviewer: 'You',
              rating: reviewData.rating,
              feedback: reviewData.feedback,
              timestamp: 'Just now'
            }
          ]
        }
      }
      return review
    }))

    setUserReputation(prev => prev + 15) // Reputation for completing reviews
  }

  /**
   * Get community statistics
   * @returns {Object} - Community statistics
   */
  const getCommunityStats = () => {
    const userPosts = communityPosts.filter(post => post.isUserPost).length
    const totalPosts = communityPostsData.length + communityPosts.length
    const activeReviews = peerReviews.filter(review => review.status === 'pending').length
    const completedReviews = peerReviews.filter(review => review.status === 'completed').length

    return {
      totalPosts,
      totalMembers: 1247, // Mock data
      activeNow: 89, // Mock data
      userReputation,
      userPosts,
      activeReviews,
      completedReviews,
      engagementRate: totalPosts > 0 ? Math.round((userPosts / totalPosts) * 100) : 0
    }
  }

  /**
   * Switch between community tabs
   * @param {string} tab - Tab to switch to
   */
  const switchTab = (tab) => {
    setActiveCommunityTab(tab)
  }

  /**
   * Search through community posts
   * @param {string} query - Search query
   * @returns {Array} - Filtered posts
   */
  const searchPosts = (query) => {
    if (!query.trim()) return communityPosts

    const lowercaseQuery = query.toLowerCase()
    return communityPosts.filter(post =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }

  /**
   * Filter posts by category
   * @param {string} category - Category to filter by
   * @returns {Array} - Filtered posts
   */
  const filterByCategory = (category) => {
    if (category === 'all') return communityPosts
    return communityPosts.filter(post => post.category === category)
  }

  /**
   * Get trending posts based on engagement
   * @returns {Array} - Trending posts
   */
  const getTrendingPosts = () => {
    return [...communityPosts]
      .sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments))
      .slice(0, 5)
  }

  /**
   * Toggle community modal visibility
   * @param {boolean} show - Whether to show the modal
   */
  const toggleCommunityModal = (show) => {
    setShowCommunityModal(show !== undefined ? show : !showCommunityModal)
  }

  return {
    // State
    activeCommunityTab,
    communityPosts,
    showCreatePost,
    newPostContent,
    peerReviews,
    userReputation,
    showCommunityModal,
    isLoading,

    // Actions
    createCommunityPost,
    likePost,
    addComment,
    createPeerReview,
    submitReview,
    switchTab,
    searchPosts,
    filterByCategory,
    getTrendingPosts,
    toggleCommunityModal,
    setNewPostContent,
    setShowCreatePost,
    setShowCommunityModal,
    getCommunityStats
  }
}