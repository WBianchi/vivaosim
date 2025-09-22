'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, TrendingUp, Eye, Edit3, MoreVertical, Play, Pause, BarChart } from 'lucide-react'

interface MarketingCampaignsGridProps {
  filters: any
  onSelectCampaign: (campaign: any) => void
}

export const MarketingCampaignsGrid: React.FC<MarketingCampaignsGridProps> = ({
  filters, onSelectCampaign
}) => {
  const campaigns = [
    {
      id: '1',
      name: 'Black Friday 2024',
      type: 'ads',
      status: 'active',
      channel: 'google',
      budget: 'R$ 5.000',
      spent: 'R$ 2.345',
      impressions: '45.2K',
      clicks: '1.2K',
      conversions: 89,
      roi: '320%',
      startDate: '2024-11-20',
      endDate: '2024-11-30'
    },
    {
      id: '2',
      name: 'Campanha de Verão',
      type: 'social',
      status: 'scheduled',
      channel: 'instagram',
      budget: 'R$ 3.000',
      spent: 'R$ 0',
      impressions: '0',
      clicks: '0',
      conversions: 0,
      roi: '0%',
      startDate: '2024-12-01',
      endDate: '2024-12-31'
    },
    {
      id: '3',
      name: 'Email Marketing Natal',
      type: 'email',
      status: 'active',
      channel: 'email',
      budget: 'R$ 1.000',
      spent: 'R$ 450',
      impressions: '12.5K',
      clicks: '890',
      conversions: 45,
      roi: '280%',
      startDate: '2024-12-10',
      endDate: '2024-12-25'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'scheduled': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'paused': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'completed': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign, index) => (
        <motion.div
          key={campaign.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4, scale: 1.02 }}
          onClick={() => onSelectCampaign(campaign)}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{campaign.name}</h3>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                {campaign.status === 'active' ? 'Ativa' : campaign.status === 'scheduled' ? 'Agendada' : campaign.status}
              </span>
            </div>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Orçamento</p>
              <p className="font-semibold text-gray-900 dark:text-white">{campaign.budget}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Gasto</p>
              <p className="font-semibold text-gray-900 dark:text-white">{campaign.spent}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Conversões</p>
              <p className="font-semibold text-gray-900 dark:text-white">{campaign.conversions}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">ROI</p>
              <p className="font-semibold text-green-600">{campaign.roi}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              {campaign.startDate}
            </div>
            <div className="flex items-center gap-2">
              {campaign.status === 'active' ? (
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <Pause className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              ) : (
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <Play className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              )}
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <BarChart className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <Edit3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
