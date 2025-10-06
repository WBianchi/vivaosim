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
  const [showFilters, setShowFilters] = useState(false)
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

  const [refreshKey, setRefreshKey] = useState(0)

  const handleSavePost = () => {
    setShowCreateModal(false)
    setSelectedPost(null)
    setRefreshKey(prev => prev + 1)
  }

  const handleEditPost = (post: any) => {
    setSelectedPost(post)
    setShowCreateModal(true)
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return

    try {
      const token = localStorage.getItem('accessToken') || 
                   document.cookie.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1]

      const response = await fetch(`/api/blog?id=${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setRefreshKey(prev => prev + 1)
        alert('✅ Post excluído com sucesso!')
      } else {
        const data = await response.json()
        alert(`❌ Erro ao excluir post: ${data.error || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Erro ao excluir post:', error)
      alert('❌ Erro ao excluir post')
    }
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
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {showFilters && (
        <BlogFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      )}

      <BlogList
        key={refreshKey}
        filters={filters}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onPostSelect={handlePostSelect}
        onEdit={handleEditPost}
        onDelete={handleDeletePost}
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
