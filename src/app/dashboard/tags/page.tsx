'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { TagsHeader } from '@/components/tags/TagsHeader'
import { TagsFilters } from '@/components/tags/TagsFilters'
import { TagsList } from '@/components/tags/TagsList'
import { TagDetailsModal } from '@/components/tags/TagDetailsModal'
import { CreateTagModal } from '@/components/tags/CreateTagModal'
import { getAuthToken } from '@/lib/auth-token'

export default function TagsPage() {
  const [selectedTag, setSelectedTag] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTag, setEditingTag] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: 'all',
    color: 'all',
    usage: 'all',
    status: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [refreshKey, setRefreshKey] = useState(0)
  const tagsListRef = useRef<any>(null)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleSaveTag = () => {
    setShowCreateModal(false)
    handleRefresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full p-8">
        {/* Header */}
        <TagsHeader 
          onCreateTag={() => setShowCreateModal(true)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {/* Filtros */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <TagsFilters 
              filters={filters}
              onFiltersChange={setFilters}
            />
          </motion.div>
        )}

        {/* Lista de Tags */}
        <TagsList 
          key={refreshKey}
          filters={filters}
          searchTerm={searchTerm}
          viewMode={viewMode}
          onTagSelect={setSelectedTag}
          onTagEdit={(tag) => {
            setEditingTag(tag)
            setShowCreateModal(true)
          }}
          onTagDelete={async (tag) => {
            if (!confirm('Tem certeza que deseja excluir esta tag?')) return
            
            try {
              const token = getAuthToken()
              if (!token) return
              
              const response = await fetch(`/api/tags?id=${tag.id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              })
              
              if (response.ok) {
                handleRefresh()
              } else {
                const data = await response.json()
                alert(data.error || 'Erro ao excluir tag')
              }
            } catch (error) {
              console.error('Erro ao excluir tag:', error)
              alert('Erro ao excluir tag')
            }
          }}
          onRefresh={handleRefresh}
        />

        {/* Modal de Detalhes */}
        {selectedTag && (
          <TagDetailsModal
            tag={selectedTag}
            onClose={() => setSelectedTag(null)}
            onEdit={() => {
              setEditingTag(selectedTag)
              setSelectedTag(null)
              setShowCreateModal(true)
            }}
            onDelete={() => {
              setSelectedTag(null)
              handleRefresh()
            }}
          />
        )}

        {/* Modal de Criação/Edição */}
        {showCreateModal && (
          <CreateTagModal
            tag={editingTag}
            onClose={() => {
              setShowCreateModal(false)
              setEditingTag(null)
            }}
            onSave={() => {
              setShowCreateModal(false)
              setEditingTag(null)
              handleRefresh()
            }}
          />
        )}
      </div>
    </div>
  )
}
