'use client'

import { motion } from 'framer-motion'
import { 
  Filter, 
  Headphones, 
  Users, 
  Clock,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Zap
} from 'lucide-react'

interface FiltersProps {
  filters: {
    status: string
    onlineStatus: string
    department: string
    performance: string
    workload: string
  }
  onFiltersChange: (filters: any) => void
}

export const AttendantsFilters: React.FC<FiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const statusOptions = [
    { value: 'all', label: 'Todos os Status', icon: Eye, color: 'text-gray-600' },
    { value: 'active', label: 'Ativo', icon: CheckCircle, color: 'text-green-600' },
    { value: 'inactive', label: 'Inativo', icon: XCircle, color: 'text-red-600' },
    { value: 'suspended', label: 'Suspenso', icon: AlertCircle, color: 'text-yellow-600' },
    { value: 'training', label: 'Treinamento', icon: Clock, color: 'text-blue-600' }
  ]

  const onlineStatusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'online', label: 'Online' },
    { value: 'offline', label: 'Offline' },
    { value: 'away', label: 'Ausente' },
    { value: 'busy', label: 'Ocupado' }
  ]

  const departmentOptions = [
    { value: 'all', label: 'Todos os Departamentos' },
    { value: 'support', label: 'Suporte Técnico' },
    { value: 'sales', label: 'Vendas' },
    { value: 'billing', label: 'Financeiro' },
    { value: 'general', label: 'Atendimento Geral' },
    { value: 'vip', label: 'Atendimento VIP' }
  ]

  const performanceOptions = [
    { value: 'all', label: 'Todas as Performances' },
    { value: 'excellent', label: 'Excelente (4.5+)' },
    { value: 'good', label: 'Bom (3.5-4.4)' },
    { value: 'average', label: 'Médio (2.5-3.4)' },
    { value: 'poor', label: 'Baixo (<2.5)' }
  ]

  const workloadOptions = [
    { value: 'all', label: 'Todas as Cargas' },
    { value: 'light', label: 'Leve (0-5 chats)' },
    { value: 'moderate', label: 'Moderada (6-10 chats)' },
    { value: 'heavy', label: 'Pesada (11-15 chats)' },
    { value: 'overloaded', label: 'Sobrecarregado (15+ chats)' }
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
      onlineStatus: 'all',
      department: 'all',
      performance: 'all',
      workload: 'all'
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
            Filtros de Atendentes
          </h3>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
              Ativos
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Limpar filtros
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => updateFilters('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Online */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status Online
          </label>
          <select
            value={filters.onlineStatus}
            onChange={(e) => updateFilters('onlineStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {onlineStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Departamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Departamento
          </label>
          <select
            value={filters.department}
            onChange={(e) => updateFilters('department', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {departmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Performance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Performance
          </label>
          <select
            value={filters.performance}
            onChange={(e) => updateFilters('performance', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {performanceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Carga de Trabalho */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Carga de Trabalho
          </label>
          <select
            value={filters.workload}
            onChange={(e) => updateFilters('workload', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {workloadOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtros Rápidos por Status */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Status Rápidos:
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
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <status.icon className={`w-3 h-3 ${status.color}`} />
              {status.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filtros por Status Online */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Status Online:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'online', label: 'Online', color: 'text-green-600' },
            { value: 'offline', label: 'Offline', color: 'text-gray-600' },
            { value: 'away', label: 'Ausente', color: 'text-yellow-600' },
            { value: 'busy', label: 'Ocupado', color: 'text-red-600' }
          ].map((status) => (
            <motion.button
              key={status.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('onlineStatus', status.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.onlineStatus === status.value
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                status.value === 'online' ? 'bg-green-500' :
                status.value === 'offline' ? 'bg-gray-500' :
                status.value === 'away' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              {status.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filtros por Departamento */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Departamentos:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'support', label: 'Suporte', icon: Headphones, color: 'text-blue-600' },
            { value: 'sales', label: 'Vendas', icon: Users, color: 'text-green-600' },
            { value: 'billing', label: 'Financeiro', icon: Star, color: 'text-purple-600' },
            { value: 'vip', label: 'VIP', icon: Zap, color: 'text-orange-600' }
          ].map((dept) => (
            <motion.button
              key={dept.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('department', dept.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.department === dept.value
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <dept.icon className={`w-3 h-3 ${dept.color}`} />
              {dept.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
