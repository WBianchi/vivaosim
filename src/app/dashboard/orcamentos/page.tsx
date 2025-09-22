'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { QuotesHeader } from '@/components/quotes/QuotesHeader'
import { QuotesFilters } from '@/components/quotes/QuotesFilters'
import { QuotesList } from '@/components/quotes/QuotesList'
import { QuoteDetailsModal } from '@/components/quotes/QuoteDetailsModal'
import { CreateQuoteModal } from '@/components/quotes/CreateQuoteModal'

export default function OrcamentosPage() {
  const [selectedQuote, setSelectedQuote] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
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

        {/* Filtros */}
        <QuotesFilters 
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Lista de Orçamentos */}
        <QuotesList 
          filters={filters}
          searchTerm={searchTerm}
          viewMode={viewMode}
          onQuoteSelect={setSelectedQuote}
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
            onSave={(quoteData) => {
              console.log('💾 Salvando orçamento:', quoteData)
              setShowCreateModal(false)
            }}
          />
        )}
      </div>
    </div>
  )
}
