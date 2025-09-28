import React from 'react'

const CommunitySection = ({
  activeCommunityTab,
  setActiveCommunityTab,
  getCommunityStats,
  communityPostsData,
  communityPosts,
  peerReviewRequests,
  setShowCreatePost
}) => {
  return (
    <div className="content-section active">
      <div className="card">
        <h3>👥 SDD Community</h3>
        <p>Connect with fellow SDD practitioners, share knowledge, and collaborate on projects.</p>
      </div>

      {/* Community Stats */}
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
              {getCommunityStats().totalMembers}
            </div>
            <div style={{ color: '#4a5568', fontSize: '0.9rem' }}>Community Members</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(72, 187, 120, 0.1)', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#48bb78' }}>
              {getCommunityStats().totalPosts}
            </div>
            <div style={{ color: '#4a5568', fontSize: '0.9rem' }}>Discussion Posts</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(237, 137, 54, 0.1)', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ed8936' }}>
              {getCommunityStats().activeNow}
            </div>
            <div style={{ color: '#4a5568', fontSize: '0.9rem' }}>Active Now</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(159, 122, 234, 0.1)', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9f7aea' }}>
              {getCommunityStats().yourReputation}
            </div>
            <div style={{ color: '#4a5568', fontSize: '0.9rem' }}>Your Reputation</div>
          </div>
        </div>
      </div>

      {/* Community Navigation */}
      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button
            className={`btn ${activeCommunityTab === 'discussions' ? 'active' : ''}`}
            onClick={() => setActiveCommunityTab('discussions')}
          >
            💬 Discussions
          </button>
          <button
            className={`btn ${activeCommunityTab === 'peer-reviews' ? 'active' : ''}`}
            onClick={() => setActiveCommunityTab('peer-reviews')}
          >
            🔍 Peer Reviews
          </button>
          <button
            className={`btn ${activeCommunityTab === 'success-stories' ? 'active' : ''}`}
            onClick={() => setActiveCommunityTab('success-stories')}
          >
            🏆 Success Stories
          </button>
          <button
            className="btn-secondary"
            onClick={() => setShowCreatePost(true)}
          >
            ✨ Create Post
          </button>
        </div>

        {/* Discussions Tab */}
        {activeCommunityTab === 'discussions' && (
          <div>
            <h4>Community Discussions</h4>
            {[...communityPostsData, ...communityPosts].map(post => (
              <div key={post.id} style={{
                marginBottom: '1.5rem',
                padding: '1.5rem',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '2rem', marginRight: '1rem' }}>{post.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: '0', color: '#2d3748' }}>{post.title}</h5>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#718096', fontSize: '0.9rem' }}>
                      {post.author} • {post.timestamp}
                    </p>
                  </div>
                </div>
                <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '1rem' }}>
                  {post.content}
                </p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                    👍 {post.likes}
                  </button>
                  <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                    💬 {post.comments}
                  </button>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {post.tags.map((tag, index) => (
                      <span key={index} style={{
                        background: 'rgba(102, 126, 234, 0.1)',
                        color: '#667eea',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Peer Reviews Tab */}
        {activeCommunityTab === 'peer-reviews' && (
          <div>
            <h4>Peer Review Requests</h4>
            {peerReviewRequests.map(review => (
              <div key={review.id} style={{
                marginBottom: '1.5rem',
                padding: '1.5rem',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '2rem', marginRight: '1rem' }}>{review.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: '0', color: '#2d3748' }}>{review.title}</h5>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#718096', fontSize: '0.9rem' }}>
                      {review.author} • {review.timestamp} • {review.difficulty}
                    </p>
                  </div>
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    background: review.status === 'pending' ? 'rgba(237, 137, 54, 0.1)' :
                                   review.status === 'in-progress' ? 'rgba(102, 126, 234, 0.1)' :
                                   'rgba(72, 187, 120, 0.1)',
                    color: review.status === 'pending' ? '#ed8936' :
                           review.status === 'in-progress' ? '#667eea' :
                           '#48bb78'
                  }}>
                    {review.status}
                  </div>
                </div>
                <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '1rem' }}>
                  {review.content}
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                    📝 Review
                  </button>
                  <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                    💬 Comment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Success Stories Tab */}
        {activeCommunityTab === 'success-stories' && (
          <div>
            <h4>Success Stories</h4>
            {communityPostsData.filter(post => post.category === 'success-story').map(story => (
              <div key={story.id} style={{
                marginBottom: '1.5rem',
                padding: '1.5rem',
                background: 'rgba(72, 187, 120, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(72, 187, 120, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '2rem', marginRight: '1rem' }}>{story.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: '0', color: '#2d3748' }}>{story.title}</h5>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#718096', fontSize: '0.9rem' }}>
                      {story.author} • {story.timestamp}
                    </p>
                  </div>
                </div>
                <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '1rem' }}>
                  {story.content}
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                    👍 {story.likes}
                  </button>
                  <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                    💬 {story.comments}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CommunitySection