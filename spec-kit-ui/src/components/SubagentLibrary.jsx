import React, { useState, useEffect, useCallback, useMemo } from 'react'
import '../App.css'

const API_BASE_URL = 'http://localhost:3001/api/subagents'

// Helper component for category badge
const CategoryBadge = ({ category }) => {
  if (!category) return null

  return (
    <span
      className="tag"
      style={{
        background: `${category.color}20`,
        color: category.color,
        border: `1px solid ${category.color}40`
      }}
    >
      {category.icon} {category.name}
    </span>
  )
}

// Helper component for experience level badge
const ExperienceLevelBadge = ({ level }) => {
  const colors = {
    junior: { bg: '#48bb7820', color: '#48bb78', border: '#48bb7840' },
    intermediate: { bg: '#ed893620', color: '#ed8936', border: '#ed893640' },
    senior: { bg: '#667eea20', color: '#667eea', border: '#667eea40' },
    expert: { bg: '#9f7aea20', color: '#9f7aea', border: '#9f7aea40' }
  }

  const style = colors[level] || colors.junior
  const levelText = level.charAt(0).toUpperCase() + level.slice(1)

  return (
    <span
      className="tag"
      style={{
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`
      }}
    >
      {levelText}
    </span>
  )
}

// Helper component for complexity badge
const ComplexityBadge = ({ complexity }) => {
  const colors = {
    simple: { bg: '#48bb7820', color: '#48bb78', border: '#48bb7840' },
    moderate: { bg: '#ed893620', color: '#ed8936', border: '#ed893640' },
    complex: { bg: '#f5656520', color: '#f56565', border: '#f5656540' },
    advanced: { bg: '#9f7aea20', color: '#9f7aea', border: '#9f7aea40' }
  }

  const style = colors[complexity] || colors.simple
  const complexityText = complexity.charAt(0).toUpperCase() + complexity.slice(1)

  return (
    <span
      className="tag"
      style={{
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`
      }}
    >
      {complexityText}
    </span>
  )
}

// Technology tags component
const TechnologyTags = ({ technologies }) => {
  if (!technologies || technologies.length === 0) return null

  const displayTechs = technologies.slice(0, 3)
  const hasMore = technologies.length > 3

  return (
    <div className="tag-container">
      {displayTechs.map((tech, index) => (
        <span key={index} className="tag">
          {tech}
        </span>
      ))}
      {hasMore && (
        <span className="tag" style={{ background: '#e2e8f0', color: '#718096' }}>
          +{technologies.length - 3} more
        </span>
      )}
    </div>
  )
}

// Subagent card component
const SubagentCard = ({ subagent, onSelect }) => {
  const handleCopyTemplate = () => {
    if (subagent.exampleCode) {
      navigator.clipboard.writeText(subagent.exampleCode)
    }
  }

  return (
    <div className="card" style={{ cursor: 'pointer' }} onClick={() => onSelect(subagent)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0, color: '#2d3748', flex: 1 }}>{subagent.title}</h4>
        <CategoryBadge category={subagent.category} />
      </div>

      <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '1rem' }}>
        {subagent.description}
      </p>

      <div className="badge-container" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <ExperienceLevelBadge level={subagent.experienceLevel} />
        <ComplexityBadge complexity={subagent.complexity} />
      </div>

      <TechnologyTags technologies={subagent.technologies} />

      {subagent.whyMatters && (
        <div className="why-matters-preview" style={{
          background: 'rgba(72, 187, 120, 0.1)',
          padding: '1rem',
          borderRadius: '8px',
          marginTop: '1rem',
          fontSize: '0.9rem'
        }}>
          <h5 style={{ color: '#48bb78', marginBottom: '0.5rem', fontSize: '0.95rem' }}>🤔 Why This Matters</h5>
          <p style={{ textAlign: 'left', lineHeight: '1.6', margin: 0, color: '#2d3748', fontSize: '0.9rem' }}>
            {subagent.whyMatters.length > 150 ? `${subagent.whyMatters.substring(0, 150)}...` : subagent.whyMatters}
          </p>
        </div>
      )}

      <div className="card-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button
          className="btn"
          onClick={(e) => {
            e.stopPropagation()
            handleCopyTemplate()
          }}
          disabled={!subagent.exampleCode || subagent.exampleCode === '# Example code not available'}
        >
          Copy Template
        </button>
        <button
          className="btn-secondary"
          onClick={(e) => {
            e.stopPropagation()
            onSelect(subagent)
          }}
        >
          View Details
        </button>
      </div>
    </div>
  )
}

// Filter panel component
const FilterPanel = ({ filters, setFilters, categories, technologies, experienceLevels, complexities }) => {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const current = prev[filterType] || []
      if (current.includes(value)) {
        return { ...prev, [filterType]: current.filter(v => v !== value) }
      } else {
        return { ...prev, [filterType]: [...current, value] }
      }
    })
  }

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }))
  }

  const handleSortChange = (sortBy, sortOrder) => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder }))
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      technologies: [],
      experienceLevels: [],
      complexities: [],
      search: '',
      sortBy: 'relevance',
      sortOrder: 'asc'
    })
  }

  const hasActiveFilters = Object.keys(filters).some(key =>
    Array.isArray(filters[key]) ? filters[key].length > 0 : filters[key]
  )

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1.5rem', color: '#2d3748' }}>Filter Subagents</h3>

      {/* Search */}
      <div className="form-group">
        <label>Search</label>
        <input
          type="text"
          placeholder="Search by name, description, technologies..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Quick Filters */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ marginBottom: '1rem', color: '#2d3748', fontSize: '1.1rem' }}>Categories</h4>
        <div className="tag-container">
          {categories.map(category => (
            <button
              key={category.id}
              className="tag"
              style={{
                background: filters.categories?.includes(category.id)
                  ? `${category.color}40`
                  : '#e2e8f0',
                color: filters.categories?.includes(category.id)
                  ? category.color
                  : '#4a5568',
                border: filters.categories?.includes(category.id)
                  ? `2px solid ${category.color}`
                  : '1px solid #e2e8f0',
                cursor: 'pointer'
              }}
              onClick={() => handleFilterChange('categories', category.id)}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <button
        className="btn-secondary"
        style={{ marginBottom: '1rem', width: '100%' }}
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
      </button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div>
          {/* Experience Levels */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#2d3748', fontSize: '1.1rem' }}>Experience Level</h4>
            <div className="tag-container">
              {experienceLevels.map(level => (
                <button
                  key={level}
                  className="tag"
                  style={{
                    background: filters.experienceLevels?.includes(level)
                      ? '#667eea40'
                      : '#e2e8f0',
                    color: filters.experienceLevels?.includes(level)
                      ? '#667eea'
                      : '#4a5568',
                    border: filters.experienceLevels?.includes(level)
                      ? '2px solid #667eea'
                      : '1px solid #e2e8f0',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleFilterChange('experienceLevels', level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Complexity */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#2d3748', fontSize: '1.1rem' }}>Complexity</h4>
            <div className="tag-container">
              {complexities.map(complexity => (
                <button
                  key={complexity}
                  className="tag"
                  style={{
                    background: filters.complexities?.includes(complexity)
                      ? '#f5656540'
                      : '#e2e8f0',
                    color: filters.complexities?.includes(complexity)
                      ? '#f56565'
                      : '#4a5568',
                    border: filters.complexities?.includes(complexity)
                      ? '2px solid #f56565'
                      : '1px solid #e2e8f0',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleFilterChange('complexities', complexity)}
                >
                  {complexity.charAt(0).toUpperCase() + complexity.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Technologies (limited to most common) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#2d3748', fontSize: '1.1rem' }}>Popular Technologies</h4>
            <div className="tag-container">
              {technologies.slice(0, 10).map(tech => (
                <button
                  key={tech}
                  className="tag"
                  style={{
                    background: filters.technologies?.includes(tech)
                      ? '#48bb7840'
                      : '#e2e8f0',
                    color: filters.technologies?.includes(tech)
                      ? '#48bb78'
                      : '#4a5568',
                    border: filters.technologies?.includes(tech)
                      ? '2px solid #48bb78'
                      : '1px solid #e2e8f0',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleFilterChange('technologies', tech)}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#2d3748', fontSize: '1.1rem' }}>Sort By</h4>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <select
                value={filters.sortBy || 'relevance'}
                onChange={(e) => handleSortChange(e.target.value, filters.sortOrder)}
                style={{ flex: 1 }}
              >
                <option value="relevance">Relevance</option>
                <option value="name">Name</option>
                <option value="category">Category</option>
                <option value="experienceLevel">Experience Level</option>
                <option value="updated">Last Updated</option>
              </select>
              <select
                value={filters.sortOrder || 'asc'}
                onChange={(e) => handleSortChange(filters.sortBy, e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          className="btn-secondary"
          onClick={clearFilters}
          style={{ width: '100%' }}
        >
          Clear All Filters
        </button>
      )}
    </div>
  )
}

// Pagination component
const PaginationControls = ({ pagination, onPageChange }) => {
  const { limit, offset, hasNext, hasPrev, totalCount, filteredCount } = pagination
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(filteredCount / limit)

  if (totalCount === 0) return null

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '1rem', color: '#4a5568' }}>
        Showing {Math.min(offset + 1, filteredCount)}-{Math.min(offset + limit, filteredCount)} of {filteredCount} subagents
        {filteredCount !== totalCount && ` (filtered from ${totalCount} total)`}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          className="btn-secondary"
          onClick={() => onPageChange(offset - limit)}
          disabled={!hasPrev}
          style={{ opacity: hasPrev ? 1 : 0.5, cursor: hasPrev ? 'pointer' : 'not-allowed' }}
        >
          ← Previous
        </button>

        <span style={{
          padding: '0.75rem 1rem',
          background: '#667eea',
          color: 'white',
          borderRadius: '8px',
          fontWeight: '500'
        }}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="btn-secondary"
          onClick={() => onPageChange(offset + limit)}
          disabled={!hasNext}
          style={{ opacity: hasNext ? 1 : 0.5, cursor: hasNext ? 'pointer' : 'not-allowed' }}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

// Loading component
const LoadingState = () => (
  <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
    <h4 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>Loading Subagents...</h4>
    <p style={{ color: '#718096' }}>Fetching the latest subagent library</p>
  </div>
)

// Error component
const ErrorState = ({ error, onRetry }) => (
  <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
    <h4 style={{ color: '#e53e3e', marginBottom: '0.5rem' }}>Error Loading Subagents</h4>
    <p style={{ color: '#718096', marginBottom: '1rem' }}>{error}</p>
    <button className="btn" onClick={onRetry}>
      Try Again
    </button>
  </div>
)

// Empty state component
const EmptyState = ({ hasFilters, onClearFilters }) => (
  <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
    <h4 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>
      {hasFilters ? 'No Matching Subagents' : 'No Subagents Available'}
    </h4>
    <p style={{ color: '#718096', marginBottom: '1rem' }}>
      {hasFilters
        ? 'Try adjusting your filters or search terms'
        : 'The subagent library is currently empty. Please check back later.'
      }
    </p>
    {hasFilters && (
      <button className="btn-secondary" onClick={onClearFilters}>
        Clear Filters
      </button>
    )}
  </div>
)

// Subagent detail modal
const SubagentDetailModal = ({ subagent, isOpen, onClose }) => {
  if (!isOpen || !subagent) return null

  const handleCopyTemplate = () => {
    if (subagent.exampleCode) {
      navigator.clipboard.writeText(subagent.exampleCode)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ margin: 0, color: '#2d3748', marginBottom: '0.5rem' }}>{subagent.title}</h2>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <CategoryBadge category={subagent.category} />
                <ExperienceLevelBadge level={subagent.experienceLevel} />
                <ComplexityBadge complexity={subagent.complexity} />
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#718096'
              }}
            >
              ×
            </button>
          </div>

          <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            {subagent.description}
          </p>

          <TechnologyTags technologies={subagent.technologies} />

          {subagent.whyMatters && (
            <div style={{
              background: 'rgba(72, 187, 120, 0.1)',
              padding: '1.5rem',
              borderRadius: '12px',
              marginTop: '1.5rem'
            }}>
              <h4 style={{ color: '#48bb78', marginBottom: '1rem' }}>🤔 Why This Subagent Matters</h4>
              <p style={{ textAlign: 'left', lineHeight: '1.8', margin: 0, color: '#2d3748' }}>
                {subagent.whyMatters}
              </p>
            </div>
          )}

          {subagent.whenToUse && subagent.whenToUse.length > 0 && (
            <div style={{
              background: 'rgba(236, 72, 153, 0.1)',
              padding: '1.5rem',
              borderRadius: '12px',
              marginTop: '1.5rem'
            }}>
              <h4 style={{ color: '#ec4899', marginBottom: '1rem' }}>🔄 When to Use This Subagent</h4>
              <ul style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem', margin: 0, color: '#2d3748' }}>
                {subagent.whenToUse.map((item, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            </div>
          )}

          {subagent.whatToDoNext && subagent.whatToDoNext.length > 0 && (
            <div style={{
              background: 'rgba(102, 126, 234, 0.1)',
              padding: '1.5rem',
              borderRadius: '12px',
              marginTop: '1.5rem'
            }}>
              <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>🎯 What to Do Next</h4>
              <ol style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem', margin: 0 }} className="text-dark">
                {subagent.whatToDoNext.map((item, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ol>
            </div>
          )}

          {subagent.exampleCode && subagent.exampleCode !== '# Example code not available' && (
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}>Example Configuration</h4>
              <div className="example-code" style={{ maxHeight: '400px' }}>
                {subagent.exampleCode}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              className="btn"
              onClick={handleCopyTemplate}
            >
              Copy Template
            </button>
            <button
              className="btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main component
const SubagentLibrary = () => {
  const [subagents, setSubagents] = useState([])
  const [categories, setCategories] = useState([])
  const [technologies, setTechnologies] = useState([])
  const [experienceLevels] = useState(['junior', 'intermediate', 'senior', 'expert'])
  const [complexities] = useState(['simple', 'moderate', 'complex', 'advanced'])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    limit: 12,
    offset: 0,
    hasNext: false,
    hasPrev: false,
    totalCount: 0,
    filteredCount: 0
  })
  const [filters, setFilters] = useState({
    categories: [],
    technologies: [],
    experienceLevels: [],
    complexities: [],
    search: '',
    sortBy: 'relevance',
    sortOrder: 'asc'
  })
  const [selectedSubagent, setSelectedSubagent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch subagents with filters
  const fetchSubagents = useCallback(async (resetOffset = false) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()

      if (filters.categories?.length > 0) {
        filters.categories.forEach(cat => params.append('categories', cat))
      }
      if (filters.technologies?.length > 0) {
        filters.technologies.forEach(tech => params.append('technologies', tech))
      }
      if (filters.experienceLevels?.length > 0) {
        filters.experienceLevels.forEach(level => params.append('experienceLevels', level))
      }
      if (filters.complexities?.length > 0) {
        filters.complexities.forEach(comp => params.append('complexities', comp))
      }
      if (filters.search) {
        params.append('search', filters.search)
      }
      params.append('sortBy', filters.sortBy)
      params.append('sortOrder', filters.sortOrder)
      params.append('limit', filters.limit || pagination.limit)
      params.append('offset', resetOffset ? 0 : filters.offset || pagination.offset)

      const response = await fetch(`${API_BASE_URL}/filter?${params}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setSubagents(data.data.subagents)
        setPagination(data.data.pagination)

        // Update categories and technologies from available filters
        if (data.data.availableFilters) {
          if (data.data.categories?.length > 0) {
            setCategories(data.data.categories)
          }
          if (data.data.availableFilters.technologies?.length > 0) {
            setTechnologies(data.data.availableFilters.technologies)
          }
        }
      } else {
        throw new Error(data.message || 'Failed to fetch subagents')
      }
    } catch (err) {
      console.error('Error fetching subagents:', err)
      setError(err.message || 'Failed to load subagents. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.limit, pagination.offset])

  // Initial load and fetch when filters change
  useEffect(() => {
    fetchSubagents(true)
  }, [filters.categories, filters.technologies, filters.experienceLevels, filters.complexities, filters.search, filters.sortBy, filters.sortOrder, filters.limit])

  // Handle page change
  const handlePageChange = (newOffset) => {
    setFilters(prev => ({ ...prev, offset: newOffset }))
    fetchSubagents(false)
  }

  // Handle subagent selection
  const handleSubagentSelect = (subagent) => {
    setSelectedSubagent(subagent)
    setIsModalOpen(true)
  }

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedSubagent(null)
  }

  // Handle retry
  const handleRetry = () => {
    fetchSubagents(true)
  }

  // Clear filters
  const clearFilters = () => {
    setFilters({
      categories: [],
      technologies: [],
      experienceLevels: [],
      complexities: [],
      search: '',
      sortBy: 'relevance',
      sortOrder: 'asc'
    })
  }

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).some(key =>
      Array.isArray(filters[key]) ? filters[key]?.length > 0 : filters[key]
    )
  }, [filters])

  return (
    <div className="content-section active">
      <div className="card">
        <h3>Subagent Library</h3>
        <p>Pre-built subagents for common development tasks and workflows. Filter by category, technology, experience level, and more.</p>
      </div>

      <div className="subagent-library-grid" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
        {/* Filters Sidebar */}
        <div className="filter-panel">
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            technologies={technologies}
            experienceLevels={experienceLevels}
            complexities={complexities}
          />
        </div>

        {/* Main Content */}
        <div className="subagent-content">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} onRetry={handleRetry} />
          ) : subagents.length === 0 ? (
            <EmptyState hasFilters={hasActiveFilters} onClearFilters={clearFilters} />
          ) : (
            <>
              {/* Results Header */}
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: 0, color: '#2d3748' }}>
                  Found {pagination.filteredCount} subagent{pagination.filteredCount !== 1 ? 's' : ''}
                  {hasActiveFilters && ' (filtered)'}
                </h4>
              </div>

              {/* Subagent Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                {subagents.map((subagent, index) => (
                  <SubagentCard
                    key={`${subagent.filename || subagent.path || subagent.id || 'unknown'}-${index}`}
                    subagent={subagent}
                    onSelect={handleSubagentSelect}
                  />
                ))}
              </div>

              {/* Pagination */}
              <PaginationControls
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <SubagentDetailModal
        subagent={selectedSubagent}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  )
}

export default SubagentLibrary