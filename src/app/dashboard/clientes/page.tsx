'use client'

import { useState } from 'react'
import { ClientsHeader } from '@/components/clients/ClientsHeader'
import { ClientsFilters } from '@/components/clients/ClientsFilters'
import { ClientsList } from '@/components/clients/ClientsList'
import { ClientDetailsModal } from '@/components/clients/ClientDetailsModal'
import { CreateClientModal } from '@/components/clients/CreateClientModal'

export default function ClientsPage() {
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    attendant: 'all',
    priority: 'all',
    source: 'all',
    subscription: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const handleClientSelect = (client: any) => {
    setSelectedClient(client)
    setShowDetailsModal(true)
  }

  const handleCreateClient = () => {
    setShowCreateModal(true)
  }

  const handleSaveClient = (clientData: any) => {
    console.log('💾 Salvando cliente:', clientData)
    // Aqui você faria a chamada para a API
  }

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <ClientsHeader
        onCreateClient={handleCreateClient}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {showFilters && (
        <ClientsFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      )}

      <ClientsList
        filters={filters}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onClientSelect={handleClientSelect}
      />

      {/* Modals */}
      {showDetailsModal && selectedClient && (
        <ClientDetailsModal
          client={selectedClient}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            setShowDetailsModal(false)
            setSelectedClient(selectedClient)
            setShowCreateModal(true)
          }}
        />
      )}

      {showCreateModal && (
        <CreateClientModal
          onClose={() => {
            setShowCreateModal(false)
            setSelectedClient(null)
          }}
          onSave={handleSaveClient}
          client={selectedClient}
        />
      )}
    </div>
  )
}
