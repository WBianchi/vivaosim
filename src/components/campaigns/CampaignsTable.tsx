'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, Eye, Edit3, MoreVertical, Send, Mail, MessageSquare, Users, TrendingUp, Clock } from 'lucide-react'

interface CampaignsTableProps {
  campaigns: any[]
  onCampaignSelect: (campaign: any) => void
}

export const CampaignsTable: React.FC<CampaignsTableProps> = ({ campaigns, onCampaignSelect }) => {
  const [sortField, setSortField] = useState<string>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR')

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active': return { label: 'Ativa', color: 'text-green-600', bg: 'bg-green-100' }
      case 'scheduled': return { label: 'Agendada', color: 'text-blue-600', bg: 'bg-blue-100' }
      case 'completed': return { label: 'Concluída', color: 'text-gray-600', bg: 'bg-gray-100' }
      case 'paused': return { label: 'Pausada', color: 'text-yellow-600', bg: 'bg-yellow-100' }
      case 'draft': return { label: 'Rascunho', color: 'text-gray-600', bg: 'bg-gray-100' }
      default: return { label: 'Desconhecido', color: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-blue-600 transition-colors"
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      )}
    </button>
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="name">Campanha</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                Canal
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="recipients">Métricas</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="openRate">Performance</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="createdAt">Data</SortButton>
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {sortedCampaigns.map((campaign, index) => {
              const statusConfig = getStatusConfig(campaign.status)

              return (
                <motion.tr
                  key={campaign.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => onCampaignSelect(campaign)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{campaign.name}</p>
                      <p className="text-sm text-gray-500">{campaign.type}</p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {campaign.channel === 'email' && <Mail className="w-4 h-4 text-gray-400" />}
                      {campaign.channel === 'whatsapp' && <MessageSquare className="w-4 h-4 text-green-600" />}
                      {campaign.channel === 'both' && (
                        <>
                          <Mail className="w-4 h-4 text-gray-400" />
                          <MessageSquare className="w-4 h-4 text-green-600" />
                        </>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{campaign.recipients.toLocaleString()} destinatários</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{campaign.sent.toLocaleString()} enviados</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{campaign.openRate}% abertura</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">{campaign.clickRate}% cliques</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 dark:text-white">{formatDate(campaign.createdAt)}</p>
                    {campaign.scheduledAt && (
                      <p className="text-xs text-gray-500">Agendada: {formatDate(campaign.scheduledAt)}</p>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); onCampaignSelect(campaign) }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                      >
                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); console.log('✏️ Editar:', campaign.id) }}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg"
                      >
                        <Edit3 className="w-4 h-4 text-blue-600" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); console.log('⚙️ Mais:', campaign.id) }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
