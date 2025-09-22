'use client'

import { motion } from 'framer-motion'
import { Filter, Send, Clock, CheckCircle, XCircle, Mail, MessageSquare, Calendar } from 'lucide-react'

interface FiltersProps {
  filters: {
    status: string
    type: string
    channel: string
    schedule: string
  }
  onFiltersChange: (filters: any) => void
}

export const CampaignsFilters: React.FC<FiltersProps> = ({ filters, onFiltersChange }) => {
  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'active', label: 'Ativa' },
    { value: 'scheduled', label: 'Agendada' },
    { value: 'completed', label: 'Concluída' },
    { value: 'paused', label: 'Pausada' },
    { value: 'draft', label: 'Rascunho' }
  ]

  const typeOptions = [
    { value: 'all', label: 'Todos os Tipos' },
    { value: 'promotional', label: 'Promocional' },
    { value: 'transactional', label: 'Transacional' },
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'notification', label: 'Notificação' }
  ]

  const channelOptions = [
    { value: 'all', label: 'Todos os Canais' },
    { value: 'email', label: 'Email' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'both', label: 'Email + WhatsApp' }
  ]

  const scheduleOptions = [
    { value: 'all', label: 'Todos os Agendamentos' },
    { value: 'immediate', label: 'Imediato' },
    { value: 'scheduled', label: 'Agendado' },
    { value: 'recurring', label: 'Recorrente' }
  ]

  const updateFilters = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({ status: 'all', type: 'all', channel: 'all', schedule: 'all' })
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all')

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Filtros de Campanhas</h3>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Ativos</span>
          )}
        </div>
        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
          >
            Limpar filtros
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => updateFilters('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo</label>
          <select
            value={filters.type}
            onChange={(e) => updateFilters('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Canal</label>
          <select
            value={filters.channel}
            onChange={(e) => updateFilters('channel', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            {channelOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Agendamento</label>
          <select
            value={filters.schedule}
            onChange={(e) => updateFilters('schedule', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            {scheduleOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Filtros Rápidos:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'active', label: 'Ativas', icon: Send, color: 'text-green-600' },
            { value: 'scheduled', label: 'Agendadas', icon: Clock, color: 'text-blue-600' },
            { value: 'email', label: 'Email', icon: Mail, color: 'text-purple-600' },
            { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, color: 'text-green-600' }
          ].map((item) => (
            <motion.button
              key={item.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (item.value === 'active' || item.value === 'scheduled') {
                  updateFilters('status', item.value)
                } else {
                  updateFilters('channel', item.value)
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                (filters.status === item.value || filters.channel === item.value)
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <item.icon className={`w-3 h-3 ${item.color}`} />
              {item.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
