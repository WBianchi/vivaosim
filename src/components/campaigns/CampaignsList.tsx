'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CampaignCard } from './CampaignCard'
import { CampaignsTable } from './CampaignsTable'
import { EmptyState } from './EmptyState'

interface CampaignsListProps {
  filters: any
  searchTerm: string
  viewMode: 'grid' | 'table'
  onCampaignSelect: (campaign: any) => void
}

const mockCampaigns = [
  {
    id: 'camp-001',
    name: 'Black Friday 2024',
    type: 'promotional',
    channel: 'both',
    status: 'active',
    schedule: 'scheduled',
    subject: 'Ofertas Imperdíveis da Black Friday!',
    content: 'Aproveite até 70% de desconto em todos os produtos...',
    template: 'black-friday-template',
    recipients: 5890,
    sent: 4567,
    delivered: 4456,
    opened: 3234,
    clicked: 1234,
    bounced: 111,
    unsubscribed: 23,
    openRate: 72.6,
    clickRate: 27.7,
    scheduledAt: '2024-11-24T00:00:00Z',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'camp-002',
    name: 'Newsletter Semanal',
    type: 'newsletter',
    channel: 'email',
    status: 'active',
    schedule: 'recurring',
    subject: 'Novidades da Semana',
    content: 'Confira as principais novidades...',
    template: 'newsletter-template',
    recipients: 3456,
    sent: 3456,
    delivered: 3400,
    opened: 2100,
    clicked: 567,
    bounced: 56,
    unsubscribed: 12,
    openRate: 61.8,
    clickRate: 16.7,
    scheduledAt: null,
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-25T09:15:00Z'
  },
  {
    id: 'camp-003',
    name: 'Lembrete de Pagamento',
    type: 'transactional',
    channel: 'whatsapp',
    status: 'completed',
    schedule: 'immediate',
    subject: null,
    content: 'Olá! Seu pagamento vence amanhã...',
    template: 'payment-reminder',
    recipients: 890,
    sent: 890,
    delivered: 885,
    opened: 850,
    clicked: 234,
    bounced: 5,
    unsubscribed: 0,
    openRate: 96.0,
    clickRate: 26.4,
    scheduledAt: null,
    createdAt: '2024-01-22T16:45:00Z',
    updatedAt: '2024-01-22T17:00:00Z'
  }
]

export const CampaignsList: React.FC<CampaignsListProps> = ({
  filters, searchTerm, viewMode, onCampaignSelect
}) => {
  const [campaigns] = useState(mockCampaigns)
  const [loading] = useState(false)

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (filters.status !== 'all' && campaign.status !== filters.status) return false
    if (filters.type !== 'all' && campaign.type !== filters.type) return false
    if (filters.channel !== 'all' && campaign.channel !== filters.channel) return false
    if (filters.schedule !== 'all' && campaign.schedule !== filters.schedule) return false

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesName = campaign.name.toLowerCase().includes(searchLower)
      const matchesSubject = campaign.subject?.toLowerCase().includes(searchLower) || false
      const matchesContent = campaign.content.toLowerCase().includes(searchLower)
      if (!matchesName && !matchesSubject && !matchesContent) return false
    }

    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (filteredCampaigns.length === 0) {
    return <EmptyState filters={filters} searchTerm={searchTerm} />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredCampaigns.length} campanha{filteredCampaigns.length !== 1 ? 's' : ''} encontrada{filteredCampaigns.length !== 1 ? 's' : ''}
        </p>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCampaigns.map((campaign, index) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                index={index}
                onClick={() => onCampaignSelect(campaign)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <CampaignsTable
          campaigns={filteredCampaigns}
          onCampaignSelect={onCampaignSelect}
        />
      )}
    </div>
  )
}
