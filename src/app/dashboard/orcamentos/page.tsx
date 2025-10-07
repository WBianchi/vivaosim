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
  const [editingQuote, setEditingQuote] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)
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
    setShowCreateModal(true)
  }

  const handleDelete = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full p-8">
        {/* Header */}
        <QuotesHeader 
          onCreateQuote={() => {
            setEditingQuote(null)
            setShowCreateModal(true)
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {/* Estatísticas */}
        <QuotesStats refreshTrigger={refreshKey} />

        {/* Filtros */}
        {showFilters && (
          <QuotesFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
        )}

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
            onEdit={() => handleEdit(selectedQuote)}
          />
        )}

        {/* Modal de Criação/Edição */}
        {showCreateModal && (
          <CreateQuoteModal
            quote={editingQuote}
            onClose={() => {
              setShowCreateModal(false)
              setEditingQuote(null)
            }}
            onSave={() => {
              setShowCreateModal(false)
              setEditingQuote(null)
              setRefreshKey(prev => prev + 1)
            }}
          />
        )}
      </div>
    </div>
  )
}
