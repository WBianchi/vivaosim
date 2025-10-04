'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { QuotesHeader } from '@/components/quotes/QuotesHeader'
import { QuotesStats } from '@/components/quotes/QuotesStats'
import { QuotesFilters } from '@/components/quotes/QuotesFilters'
import { QuotesList } from '@/components/quotes/QuotesList'
import { QuoteDetailsModal } from '@/components/quotes/QuoteDetailsModal'
import { CreateQuoteModal } from '@/components/quotes/CreateQuoteModal'

export default function OrcamentosPage() {
  const [selectedQuote, setSelectedQuote] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingQuote, setEditingQuote] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    client: '',
    agent: 'all',
    minValue: '',
    maxValue: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const handleEdit = (quote: any) => {
    setEditingQuote(quote)
    setShowEditModal(true)
  }

  const handleDelete = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full p-8">
        {/* Header */}
        <QuotesHeader 
          onCreateQuote={() => setShowCreateModal(true)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Estatísticas */}
        <QuotesStats refreshTrigger={refreshKey} />

        {/* Filtros */}
        <QuotesFilters 
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Lista de Orçamentos */}
        <QuotesList 
          key={refreshKey}
          filters={filters}
          searchTerm={searchTerm}
          viewMode={viewMode}
          onQuoteSelect={setSelectedQuote}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Modal de Detalhes */}
        {selectedQuote && (
          <QuoteDetailsModal
            quote={selectedQuote}
            onClose={() => setSelectedQuote(null)}
            onEdit={() => {
              console.log('🔄 Editar orçamento:', selectedQuote.id)
              setSelectedQuote(null)
            }}
          />
        )}

        {/* Modal de Criação */}
        {showCreateModal && (
          <CreateQuoteModal
            onClose={() => setShowCreateModal(false)}
            onSave={() => {
              setShowCreateModal(false)
              setRefreshKey(prev => prev + 1)
            }}
          />
        )}
      </div>
    </div>
  )
}
