'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { TagsHeader } from '@/components/tags/TagsHeader'
import { TagsFilters } from '@/components/tags/TagsFilters'
import { TagsList } from '@/components/tags/TagsList'
import { TagDetailsModal } from '@/components/tags/TagDetailsModal'
import { CreateTagModal } from '@/components/tags/CreateTagModal'

export default function TagsPage() {
  const [selectedTag, setSelectedTag] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
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
        />

        {/* Filtros */}
        <TagsFilters 
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Lista de Tags */}
        <TagsList 
          key={refreshKey}
          filters={filters}
          searchTerm={searchTerm}
          viewMode={viewMode}
          onTagSelect={setSelectedTag}
          onRefresh={handleRefresh}
        />

        {/* Modal de Detalhes */}
        {selectedTag && (
          <TagDetailsModal
            tag={selectedTag}
            onClose={() => setSelectedTag(null)}
            onEdit={() => {
              console.log('🔄 Editar tag:', selectedTag.id)
              setSelectedTag(null)
            }}
          />
        )}

        {/* Modal de Criação */}
        {showCreateModal && (
          <CreateTagModal
            onClose={() => setShowCreateModal(false)}
            onSave={handleSaveTag}
          />
        )}
      </div>
    </div>
  )
}
