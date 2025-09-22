'use client'

import { useState } from 'react'
import { CampaignsHeader } from '@/components/campaigns/CampaignsHeader'
import { CampaignsFilters } from '@/components/campaigns/CampaignsFilters'
import { CampaignsList } from '@/components/campaigns/CampaignsList'
import { CampaignDetailsModal } from '@/components/campaigns/CampaignDetailsModal'
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal'

export default function DisparosPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    channel: 'all',
    schedule: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const handleCampaignSelect = (campaign: any) => {
    setSelectedCampaign(campaign)
    setShowDetailsModal(true)
  }

  const handleCreateCampaign = () => {
    setShowCreateModal(true)
  }

  const handleSaveCampaign = (campaignData: any) => {
    console.log('💾 Salvando campanha:', campaignData)
  }

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <CampaignsHeader
        onCreateCampaign={handleCreateCampaign}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <CampaignsFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <CampaignsList
        filters={filters}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onCampaignSelect={handleCampaignSelect}
      />

      {showDetailsModal && selectedCampaign && (
        <CampaignDetailsModal
          campaign={selectedCampaign}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            setShowDetailsModal(false)
            setSelectedCampaign(selectedCampaign)
            setShowCreateModal(true)
          }}
        />
      )}

      {showCreateModal && (
        <CreateCampaignModal
          onClose={() => {
            setShowCreateModal(false)
            setSelectedCampaign(null)
          }}
          onSave={handleSaveCampaign}
          campaign={selectedCampaign}
        />
      )}
    </div>
  )
}
