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
  const [filters, setFilters] = useState({
    status: 'all',
    plan: 'all',
    subscriptionStatus: 'all',
    paymentStatus: 'all',
    dateRange: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')

  const handleSubscriberSelect = (subscriber: any) => {
    setSelectedSubscriber(subscriber)
    setShowDetailsModal(true)
  }

  const handleCreateSubscriber = () => {
    setShowCreateModal(true)
  }

  const handleSaveSubscriber = (subscriberData: any) => {
    console.log('💾 Salvando assinante:', subscriberData)
    // Aqui você faria a chamada para a API
  }

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <SubscribersHeader
        onCreateSubscriber={handleCreateSubscriber}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <SubscribersFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <SubscribersList
        filters={filters}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onSubscriberSelect={handleSubscriberSelect}
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
