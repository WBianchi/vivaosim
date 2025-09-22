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
    setShowCreateModal(true)
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
      />

      <AffiliatesFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <AffiliatesList
        filters={filters}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onAffiliateSelect={handleAffiliateSelect}
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
            setSelectedAffiliate(null)
          }}
          onSave={handleSaveAffiliate}
          affiliate={selectedAffiliate}
        />
      )}
    </div>
  )
}
