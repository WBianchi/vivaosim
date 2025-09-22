'use client'

import { motion } from 'framer-motion'
import { Filter, CheckCircle, XCircle, Clock, AlertTriangle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

interface FiltersProps {
  filters: {
    status: string
    paymentStatus: string
    performance: string
    plan: string
  }
  onFiltersChange: (filters: any) => void
}

export const AffiliatesFilters: React.FC<FiltersProps> = ({ filters, onFiltersChange }) => {
  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
    { value: 'pending', label: 'Pendente' },
    { value: 'suspended', label: 'Suspenso' }
  ]

  const paymentStatusOptions = [
    { value: 'all', label: 'Todos os Pagamentos' },
    { value: 'paid', label: 'Pago' },
    { value: 'pending', label: 'Pendente' },
    { value: 'overdue', label: 'Atrasado' },
    { value: 'processing', label: 'Processando' }
  ]

  const performanceOptions = [
    { value: 'all', label: 'Todas as Performances' },
    { value: 'excellent', label: 'Excelente' },
    { value: 'good', label: 'Boa' },
    { value: 'average', label: 'Média' },
    { value: 'poor', label: 'Baixa' }
  ]

  const planOptions = [
    { value: 'all', label: 'Todos os Planos' },
    { value: 'basic', label: 'Plano Básico' },
    { value: 'professional', label: 'Plano Profissional' },
    { value: 'premium', label: 'Plano Premium' },
    { value: 'enterprise', label: 'Plano Enterprise' }
  ]

  const updateFilters = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({ status: 'all', paymentStatus: 'all', performance: 'all', plan: 'all' })
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
          <h3 className="font-semibold text-gray-900 dark:text-white">Filtros de Afiliados</h3>
          {hasActiveFilters && (
            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">Ativos</span>
          )}
        </div>
        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status Pagamento</label>
          <select
            value={filters.paymentStatus}
            onChange={(e) => updateFilters('paymentStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {paymentStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Performance</label>
          <select
            value={filters.performance}
            onChange={(e) => updateFilters('performance', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {performanceOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plano Comissionado</label>
          <select
            value={filters.plan}
            onChange={(e) => updateFilters('plan', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {planOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Filtros Rápidos:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'active', label: 'Ativos', icon: CheckCircle, color: 'text-green-600' },
            { value: 'inactive', label: 'Inativos', icon: XCircle, color: 'text-red-600' },
            { value: 'pending', label: 'Pendentes', icon: Clock, color: 'text-yellow-600' },
            { value: 'suspended', label: 'Suspensos', icon: AlertTriangle, color: 'text-orange-600' }
          ].map((status) => (
            <motion.button
              key={status.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('status', status.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.status === status.value
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <status.icon className={`w-3 h-3 ${status.color}`} />
              {status.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Performance:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'excellent', label: 'Excelente', icon: TrendingUp, color: 'text-green-600' },
            { value: 'good', label: 'Boa', icon: TrendingUp, color: 'text-blue-600' },
            { value: 'average', label: 'Média', icon: DollarSign, color: 'text-yellow-600' },
            { value: 'poor', label: 'Baixa', icon: TrendingDown, color: 'text-red-600' }
          ].map((perf) => (
            <motion.button
              key={perf.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('performance', perf.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.performance === perf.value
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <perf.icon className={`w-3 h-3 ${perf.color}`} />
              {perf.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
