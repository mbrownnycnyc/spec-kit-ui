import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Customize code block rendering
          code({ inline, children, ...props }) {
            return !inline ? (
              <div className="example-code">
                <code {...props}>{children}</code>
              </div>
            ) : (
              <code style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
                padding: '0.2em 0.4em',
                borderRadius: '3px',
                fontSize: '0.9em'
              }} {...props}>
                {children}
              </code>
            )
          },
          // Style headers
          h1: ({ children }) => <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>{children}</h3>,
          h2: ({ children }) => <h4 style={{ color: '#4a5568', marginBottom: '0.75rem' }}>{children}</h4>,
          h3: ({ children }) => <h5 style={{ color: '#718096', marginBottom: '0.5rem' }}>{children}</h5>,
          // Style lists
          ul: ({ children }) => <ul style={{ textAlign: 'left', paddingLeft: '1.5rem', marginBottom: '1rem' }} className="text-dark">{children}</ul>,
          ol: ({ children }) => <ol style={{ textAlign: 'left', paddingLeft: '1.5rem', marginBottom: '1rem' }} className="text-dark">{children}</ol>,
          li: ({ children }) => <li style={{ marginBottom: '0.5rem', lineHeight: '1.6' }}>{children}</li>,
          // Style paragraphs
          p: ({ children }) => <p style={{ marginBottom: '1rem', lineHeight: '1.6' }} className="text-dark">{children}</p>,
          // Style blockquotes
          blockquote: ({ children }) => (
            <blockquote style={{
              borderLeft: '4px solid #667eea',
              paddingLeft: '1rem',
              fontStyle: 'italic',
              margin: '1rem 0',
              color: '#4a5568'
            }}>
              {children}
            </blockquote>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer