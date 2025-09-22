'use client'

import { motion } from 'framer-motion'
import { 
  Filter, 
  Calendar, 
  User, 
  CheckCircle, 
  Clock, 
  XCircle,
  Play,
  Video,
  MapPin,
  Phone,
  Users,
  RefreshCw
} from 'lucide-react'

interface FiltersProps {
  filters: {
    status: string
    dateRange: string
    client: string
    agent: string
    type: string
    format: string
  }
  onFiltersChange: (filters: any) => void
}

export const SchedulesFilters: React.FC<FiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const statusOptions = [
    { value: 'all', label: 'Todos os Status', icon: RefreshCw, color: 'text-gray-600' },
    { value: 'scheduled', label: 'Agendado', icon: Clock, color: 'text-blue-600' },
    { value: 'in_progress', label: 'Em Andamento', icon: Play, color: 'text-orange-600' },
    { value: 'completed', label: 'Concluído', icon: CheckCircle, color: 'text-green-600' },
    { value: 'cancelled', label: 'Cancelado', icon: XCircle, color: 'text-red-600' }
  ]

  const dateRangeOptions = [
    { value: 'all', label: 'Todo o período' },
    { value: 'today', label: 'Hoje' },
    { value: 'tomorrow', label: 'Amanhã' },
    { value: 'week', label: 'Esta semana' },
    { value: 'next_week', label: 'Próxima semana' },
    { value: 'month', label: 'Este mês' }
  ]

  const agentOptions = [
    { value: 'all', label: 'Todos os Agentes' },
    { value: 'joao', label: 'João Silva' },
    { value: 'maria', label: 'Maria Santos' },
    { value: 'pedro', label: 'Pedro Costa' },
    { value: 'ana', label: 'Ana Lima' }
  ]

  const typeOptions = [
    { value: 'all', label: 'Todos os Tipos' },
    { value: 'meeting', label: 'Reunião' },
    { value: 'call', label: 'Ligação' },
    { value: 'visit', label: 'Visita' },
    { value: 'presentation', label: 'Apresentação' },
    { value: 'followup', label: 'Follow-up' }
  ]

  const formatOptions = [
    { value: 'all', label: 'Todos os Formatos' },
    { value: 'online', label: 'Online' },
    { value: 'in_person', label: 'Presencial' },
    { value: 'phone', label: 'Telefone' },
    { value: 'hybrid', label: 'Híbrido' }
  ]

  const updateFilters = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      status: 'all',
      dateRange: 'all',
      client: '',
      agent: 'all',
      type: 'all',
      format: 'all'
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== 'all' && value !== ''
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Filtros
          </h3>
          {hasActiveFilters && (
            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
              Ativos
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            Limpar filtros
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => updateFilters('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Período */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Período
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => updateFilters('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Agente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Agente
          </label>
          <select
            value={filters.agent}
            onChange={(e) => updateFilters('agent', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {agentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cliente
          </label>
          <input
            type="text"
            placeholder="Nome do cliente..."
            value={filters.client}
            onChange={(e) => updateFilters('client', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo
          </label>
          <select
            value={filters.type}
            onChange={(e) => updateFilters('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Formato */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Formato
          </label>
          <select
            value={filters.format}
            onChange={(e) => updateFilters('format', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {formatOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtros Rápidos */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Filtros Rápidos:
        </p>
        <div className="flex flex-wrap gap-2">
          {statusOptions.slice(1).map((status) => (
            <motion.button
              key={status.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('status', status.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.status === status.value
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <status.icon className={`w-3 h-3 ${status.color}`} />
              {status.label}
            </motion.button>
          ))}
        </div>

        {/* Filtros de Formato */}
        <div className="flex flex-wrap gap-2 mt-2">
          {[
            { value: 'online', label: 'Online', icon: Video, color: 'text-blue-600' },
            { value: 'in_person', label: 'Presencial', icon: MapPin, color: 'text-green-600' },
            { value: 'phone', label: 'Telefone', icon: Phone, color: 'text-purple-600' }
          ].map((format) => (
            <motion.button
              key={format.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('format', format.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.format === format.value
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <format.icon className={`w-3 h-3 ${format.color}`} />
              {format.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
