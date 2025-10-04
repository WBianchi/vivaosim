'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ClientCard } from './ClientCard'
import { ClientsTable } from './ClientsTable'
import { EmptyState } from './EmptyState'
import { getAuthToken } from '@/lib/auth-token'

interface ClientsListProps {
  filters: any
  searchTerm: string
  viewMode: 'grid' | 'table'
  onClientSelect: (client: any) => void
  refreshTrigger?: number
}

export const ClientsList: React.FC<ClientsListProps> = ({
  filters,
  searchTerm,
  viewMode,
  onClientSelect,
  refreshTrigger
}) => {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
  }, [filters, searchTerm, refreshTrigger])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const token = getAuthToken()
      
      // Construir query params
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (filters.status !== 'all') params.append('status', filters.status)
      if (filters.attendant !== 'all') params.append('assignedToId', filters.attendant)
      
      const response = await fetch(`/api/contacts?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setClients(data.contacts || [])
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (clients.length === 0) {
    return <EmptyState filters={filters} searchTerm={searchTerm} />
  }

  return (
    <AnimatePresence mode="wait">
      {viewMode === 'grid' ? (
        <motion.div
          key="grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {clients.map((client, index) => (
            <ClientCard
              key={client.id}
              client={client}
              index={index}
              onClick={() => onClientSelect(client)}
              onDelete={fetchClients}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          key="table"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ClientsTable
            clients={clients}
            onClientSelect={onClientSelect}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
