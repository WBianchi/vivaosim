'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TicketsHeader } from '@/components/tickets/TicketsHeader'
import { TicketsFilters } from '@/components/tickets/TicketsFilters'
import { TicketsList } from '@/components/tickets/TicketsList'
import { TicketDetailsModal } from '@/components/tickets/TicketDetailsModal'
import { CreateTicketModal } from '@/components/tickets/CreateTicketModal'

export default function TicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    agent: 'all',
    dateRange: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full p-8">
        {/* Header */}
        <TicketsHeader 
          onCreateTicket={() => setShowCreateModal(true)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Filtros */}
        <TicketsFilters 
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Lista de Tickets */}
        <TicketsList 
          filters={filters}
          searchTerm={searchTerm}
          viewMode={viewMode}
          onTicketSelect={setSelectedTicket}
        />

        {/* Modal de Detalhes */}
        {selectedTicket && (
          <TicketDetailsModal
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            onEdit={() => {
              console.log('🔄 Editar ticket:', selectedTicket.id)
              setSelectedTicket(null)
            }}
          />
        )}

        {/* Modal de Criação */}
        {showCreateModal && (
          <CreateTicketModal
            onClose={() => setShowCreateModal(false)}
            onSave={(ticketData) => {
              console.log('💾 Salvando ticket:', ticketData)
              setShowCreateModal(false)
            }}
          />
        )}
      </div>
    </div>
  )
}
