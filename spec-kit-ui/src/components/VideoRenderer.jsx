import React, { useState } from 'react'

const VideoRenderer = ({ videoData }) => {
  const [mediaLoaded, setMediaLoaded] = useState({})

  const handleVideoLoaded = (url) => {
    setMediaLoaded(prev => ({ ...prev, [url]: true }))
  }

  return (
    <div style={{ margin: '1.5rem 0' }}>
      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
        {!mediaLoaded[videoData.url] && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '3rem',
            zIndex: 1
          }}>
            ▶️
          </div>
        )}
        <video
          style={{ width: '100%', maxHeight: '400px', display: 'block' }}
          controls
          poster={videoData.thumbnail}
          onLoadedData={() => handleVideoLoaded(videoData.url)}
        >
          <source src={videoData.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#718096' }}>
        📹 {videoData.duration} • {videoData.description}
      </div>
    </div>
  )
}

export default VideoRenderer