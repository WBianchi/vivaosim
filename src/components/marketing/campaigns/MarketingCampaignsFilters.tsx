'use client'

import { motion } from 'framer-motion'
import { Filter, Search } from 'lucide-react'

interface MarketingCampaignsFiltersProps {
  filters: any
  onFiltersChange: (filters: any) => void
}

export const MarketingCampaignsFilters: React.FC<MarketingCampaignsFiltersProps> = ({
  filters, onFiltersChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="font-semibold text-gray-900 dark:text-white">Filtros</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar campanhas..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">Todos os Status</option>
          <option value="active">Ativas</option>
          <option value="scheduled">Agendadas</option>
          <option value="paused">Pausadas</option>
          <option value="completed">Concluídas</option>
        </select>

        <select
          value={filters.type}
          onChange={(e) => onFiltersChange({ ...filters, type: e.target.value })}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">Todos os Tipos</option>
          <option value="email">Email</option>
          <option value="social">Redes Sociais</option>
          <option value="ads">Anúncios</option>
          <option value="sms">SMS</option>
        </select>

        <select
          value={filters.channel}
          onChange={(e) => onFiltersChange({ ...filters, channel: e.target.value })}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">Todos os Canais</option>
          <option value="google">Google</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </div>
    </div>
  )
}
