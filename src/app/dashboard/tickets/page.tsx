'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { TicketsHeader } from '@/components/tickets/TicketsHeader'
import { TicketsFilters } from '@/components/tickets/TicketsFilters'
import { TicketsList } from '@/components/tickets/TicketsList'
import { TicketDetailsModal } from '@/components/tickets/TicketDetailsModal'
import { CreateTicketModal } from '@/components/tickets/CreateTicketModal'

export default function TicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTicket, setEditingTicket] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    agent: 'all',
    dateRange: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [refreshKey, setRefreshKey] = useState(0)
  const ticketsListRef = useRef<any>(null)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleSaveTicket = () => {
    setShowCreateModal(false)
    setEditingTicket(null)
    handleRefresh()
  }

  const handleEditTicket = (ticket: any) => {
    setEditingTicket(ticket)
    setShowCreateModal(true)
    setSelectedTicket(null)
  }

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
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {/* Filtros */}
        {showFilters && (
          <TicketsFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
        )}

        {/* Lista de Tickets */}
        <TicketsList 
          key={refreshKey}
          filters={filters}
          searchTerm={searchTerm}
          viewMode={viewMode}
          onTicketSelect={setSelectedTicket}
          onRefresh={handleRefresh}
          onEdit={handleEditTicket}
        />

        {/* Modal de Detalhes */}
        {selectedTicket && (
          <TicketDetailsModal
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            onEdit={() => handleEditTicket(selectedTicket)}
          />
        )}

        {/* Modal de Criação/Edição */}
        {showCreateModal && (
          <CreateTicketModal
            onClose={() => {
              setShowCreateModal(false)
              setEditingTicket(null)
            }}
            onSave={handleSaveTicket}
            ticket={editingTicket}
          />
        )}
      </div>
    </div>
  )
}
