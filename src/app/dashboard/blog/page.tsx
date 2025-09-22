'use client'

import { useState } from 'react'
import { BlogHeader } from '@/components/blog/BlogHeader'
import { BlogFilters } from '@/components/blog/BlogFilters'
import { BlogList } from '@/components/blog/BlogList'
import { BlogDetailsModal } from '@/components/blog/BlogDetailsModal'
import { CreateBlogModal } from '@/components/blog/CreateBlogModal'

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    author: 'all',
    visibility: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const handlePostSelect = (post: any) => {
    setSelectedPost(post)
    setShowDetailsModal(true)
  }

  const handleCreatePost = () => {
    setShowCreateModal(true)
  }

  const handleSavePost = (postData: any) => {
    console.log('💾 Salvando post:', postData)
  }

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <BlogHeader
        onCreatePost={handleCreatePost}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <BlogFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <BlogList
        filters={filters}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onPostSelect={handlePostSelect}
      />

      {showDetailsModal && selectedPost && (
        <BlogDetailsModal
          post={selectedPost}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            setShowDetailsModal(false)
            setSelectedPost(selectedPost)
            setShowCreateModal(true)
          }}
        />
      )}

      {showCreateModal && (
        <CreateBlogModal
          onClose={() => {
            setShowCreateModal(false)
            setSelectedPost(null)
          }}
          onSave={handleSavePost}
          post={selectedPost}
        />
      )}
    </div>
  )
}
