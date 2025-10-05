'use client'

import { useState } from 'react'
import { AffiliatesHeader } from '@/components/affiliates/AffiliatesHeader'
import { AffiliatesFilters } from '@/components/affiliates/AffiliatesFilters'
import { AffiliatesList } from '@/components/affiliates/AffiliatesList'
import { AffiliateDetailsModal } from '@/components/affiliates/AffiliateDetailsModal'
import { CreateAffiliateModal } from '@/components/affiliates/CreateAffiliateModal'

export default function AffiliatesPage() {
  const [selectedAffiliate, setSelectedAffiliate] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [editingAffiliate, setEditingAffiliate] = useState<any>(null)
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all',
    performance: 'all',
    plan: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const handleAffiliateSelect = (affiliate: any) => {
    setSelectedAffiliate(affiliate)
    setShowDetailsModal(true)
  }

  const handleCreateAffiliate = () => {
    setEditingAffiliate(null)
    setShowCreateModal(true)
  }

  const handleEditAffiliate = (affiliate: any) => {
    setEditingAffiliate(affiliate)
    setShowCreateModal(true)
  }

  const handleDeleteAffiliate = (affiliateId: string) => {
    console.log('🗑️ Excluindo afiliado:', affiliateId)
  }

  const handleSaveAffiliate = (affiliateData: any) => {
    console.log('💾 Salvando afiliado:', affiliateData)
  }

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <AffiliatesHeader
        onCreateAffiliate={handleCreateAffiliate}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {showFilters && (
        <AffiliatesFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      )}

      <AffiliatesList
        filters={filters}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onAffiliateSelect={handleAffiliateSelect}
        onEdit={handleEditAffiliate}
        onDelete={handleDeleteAffiliate}
      />

      {showDetailsModal && selectedAffiliate && (
        <AffiliateDetailsModal
          affiliate={selectedAffiliate}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            setShowDetailsModal(false)
            setSelectedAffiliate(selectedAffiliate)
            setShowCreateModal(true)
          }}
        />
      )}

      {showCreateModal && (
        <CreateAffiliateModal
          onClose={() => {
            setShowCreateModal(false)
            setEditingAffiliate(null)
          }}
          onSave={handleSaveAffiliate}
          affiliate={editingAffiliate}
        />
      )}
    </div>
  )
}
