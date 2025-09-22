'use client'

import { useState } from 'react'
import { MarketingCampaignsHeader } from '@/components/marketing/campaigns/MarketingCampaignsHeader'
import { MarketingCampaignsGrid } from '@/components/marketing/campaigns/MarketingCampaignsGrid'
import { MarketingCampaignsFilters } from '@/components/marketing/campaigns/MarketingCampaignsFilters'
import { CreateMarketingCampaignModal } from '@/components/marketing/campaigns/CreateMarketingCampaignModal'

export default function CampanhasMarketingPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    channel: 'all'
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <MarketingCampaignsHeader
        onCreateCampaign={() => setShowCreateModal(true)}
      />

      {/* Filtros */}
      <MarketingCampaignsFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Grid de Campanhas */}
      <MarketingCampaignsGrid
        filters={filters}
        onSelectCampaign={setSelectedCampaign}
      />

      {/* Modal de Criação */}
      {showCreateModal && (
        <CreateMarketingCampaignModal
          onClose={() => setShowCreateModal(false)}
          onSave={(campaign) => {
            console.log('💾 Salvando campanha:', campaign)
            setShowCreateModal(false)
          }}
        />
      )}
    </div>
  )
}
