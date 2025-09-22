'use client'

import { motion } from 'framer-motion'
import { Send, Mail, MessageSquare, Clock, CheckCircle, Users, TrendingUp, Eye, Edit3, MoreVertical, Calendar, BarChart } from 'lucide-react'

interface CampaignCardProps {
  campaign: any
  index: number
  onClick: () => void
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, index, onClick }) => {
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

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return Mail
      case 'whatsapp': return MessageSquare
      case 'both': return Send
      default: return Send
    }
  }

  const statusConfig = getStatusConfig(campaign.status)
  const ChannelIcon = getChannelIcon(campaign.channel)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${statusConfig.bg} flex items-center justify-center`}>
              <ChannelIcon className={`w-6 h-6 ${statusConfig.color}`} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{campaign.name}</h3>
              <span className={`px-2 py-0.5 ${statusConfig.bg} ${statusConfig.color} rounded-full text-xs font-medium`}>
                {statusConfig.label}
              </span>
            </div>
          </div>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {campaign.subject || campaign.content}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-600">Destinatários</span>
            </div>
            <p className="text-lg font-bold text-blue-700">{campaign.recipients.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600">Taxa Abertura</span>
            </div>
            <p className="text-lg font-bold text-green-700">{campaign.openRate}%</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(campaign.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart className="w-4 h-4" />
            <span>{campaign.clickRate}% cliques</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => { e.stopPropagation(); onClick() }}
            className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
          >
            <Eye className="w-3 h-3" />
            Ver Detalhes
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => { e.stopPropagation(); console.log('✏️ Editar:', campaign.id) }}
            className="px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
          >
            <Edit3 className="w-3 h-3" />
            Editar
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
