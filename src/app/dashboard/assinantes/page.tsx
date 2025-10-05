'use client'

import { useState } from 'react'
import { SubscribersHeader } from '@/components/subscribers/SubscribersHeader'
import { SubscribersFilters } from '@/components/subscribers/SubscribersFilters'
import { SubscribersList } from '@/components/subscribers/SubscribersList'
import { SubscriberDetailsModal } from '@/components/subscribers/SubscriberDetailsModal'
import { CreateSubscriberModal } from '@/components/subscribers/CreateSubscriberModal'

export default function SubscribersPage() {
  const [selectedSubscriber, setSelectedSubscriber] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [filters, setFilters] = useState({
    status: 'all',
    plan: 'all',
    subscriptionStatus: 'all',
    paymentStatus: 'all',
    dateRange: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  // Calcular estatísticas
  const stats = {
    totalSubscribers: subscribers.length,
    activeSubscribers: subscribers.filter(s => s.subscriptionStatus === 'active').length,
    totalRevenue: subscribers.reduce((sum, s) => sum + (s.plan?.price || 0), 0),
    avgTicket: subscribers.length > 0 ? subscribers.reduce((sum, s) => sum + (s.plan?.price || 0), 0) / subscribers.length : 0,
    newThisMonth: subscribers.filter(s => {
      const createdDate = new Date(s.createdAt)
      const now = new Date()
      return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear()
    }).length,
    churnRate: subscribers.length > 0 ? (subscribers.filter(s => s.subscriptionStatus === 'cancelled').length / subscribers.length) * 100 : 0,
    expiringThisMonth: subscribers.filter(s => {
      if (!s.expiresAt) return false
      const expiryDate = new Date(s.expiresAt)
      const now = new Date()
      return expiryDate.getMonth() === now.getMonth() && expiryDate.getFullYear() === now.getFullYear()
    }).length
  }

  const handleSubscriberSelect = (subscriber: any) => {
    setSelectedSubscriber(subscriber)
    setShowDetailsModal(true)
  }
  const handleCreateSubscriber = () => {
    setShowCreateModal(true)
  }

  const handleSaveSubscriber = async (subscriberData: any) => {
    try {
      const isEditing = !!selectedSubscriber

      console.log(' Enviando para API:', subscriberData)

      const response = await fetch(isEditing ? `/api/subscribers/${selectedSubscriber.id}` : '/api/subscribers', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscriberData)
      })

      const data = await response.json()

      console.log('Resposta da API:', data)

      if (data.success) {
        console.log(` Assinante ${isEditing ? 'atualizado' : 'criado'} com sucesso!`)
        setShowCreateModal(false)
        setSelectedSubscriber(null)
        
        // Aguardar 2 segundos antes de recarregar para ver os logs
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        console.error('Erro da API:', data.error)
        alert(' Erro: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao salvar assinante:', error)
      alert(' Erro ao salvar assinante')
    }
  }

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  const handleDeleteSubscriber = async (subscriber: any) => {
    try {
      const response = await fetch(`/api/subscribers/${subscriber.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Assinante excluído com sucesso!')
        window.location.reload()
      } else {
        alert('❌ Erro: ' + data.error)
      }
    } catch (error) {
      console.error('❌ Erro ao excluir assinante:', error)
      alert('❌ Erro ao excluir assinante')
    }
  }

  const handleArchiveSubscriber = async (subscriber: any) => {
    try {
      const response = await fetch(`/api/subscribers/${subscriber.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ARQUIVADO' })
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Assinante arquivado com sucesso!')
        window.location.reload()
      } else {
        alert('❌ Erro: ' + data.error)
      }
    } catch (error) {
      console.error('❌ Erro ao arquivar assinante:', error)
      alert('❌ Erro ao arquivar assinante')
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <SubscribersHeader
        onCreateSubscriber={handleCreateSubscriber}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onToggleFilters={() => setShowFilters(!showFilters)}
        stats={stats}
      />

      {showFilters && (
        <SubscribersFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      )}

      <SubscribersList
        filters={filters}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onSubscriberSelect={handleSubscriberSelect}
        onSubscribersLoad={setSubscribers}
        onEdit={(subscriber) => {
          setSelectedSubscriber(subscriber)
          setShowCreateModal(true)
        }}
        onDelete={handleDeleteSubscriber}
        onArchive={handleArchiveSubscriber}
      />

      {/* Modals */}
      {showDetailsModal && selectedSubscriber && (
        <SubscriberDetailsModal
          subscriber={selectedSubscriber}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            setShowDetailsModal(false)
            setSelectedSubscriber(selectedSubscriber)
            setShowCreateModal(true)
          }}
          onDelete={handleDeleteSubscriber}
          onArchive={handleArchiveSubscriber}
        />
      )}

      {showCreateModal && (
        <CreateSubscriberModal
          onClose={() => {
            setShowCreateModal(false)
            setSelectedSubscriber(null)
          }}
          onSave={handleSaveSubscriber}
          subscriber={selectedSubscriber}
        />
      )}
    </div>
  )
}
