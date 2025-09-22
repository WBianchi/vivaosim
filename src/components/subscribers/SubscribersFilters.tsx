'use client'

import { motion } from 'framer-motion'
import { 
  Filter, 
  User, 
  Package, 
  CreditCard,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  DollarSign
} from 'lucide-react'

interface FiltersProps {
  filters: {
    status: string
    plan: string
    subscriptionStatus: string
    paymentStatus: string
    dateRange: string
  }
  onFiltersChange: (filters: any) => void
}

export const SubscribersFilters: React.FC<FiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const statusOptions = [
    { value: 'all', label: 'Todos os Status', icon: Eye, color: 'text-gray-600' },
    { value: 'active', label: 'Ativo', icon: CheckCircle, color: 'text-green-600' },
    { value: 'inactive', label: 'Inativo', icon: XCircle, color: 'text-red-600' },
    { value: 'suspended', label: 'Suspenso', icon: Clock, color: 'text-yellow-600' },
    { value: 'blocked', label: 'Bloqueado', icon: AlertTriangle, color: 'text-red-600' }
  ]

  const planOptions = [
    { value: 'all', label: 'Todos os Planos' },
    { value: 'basic', label: 'Plano Básico' },
    { value: 'professional', label: 'Plano Profissional' },
    { value: 'premium', label: 'Plano Premium' },
    { value: 'enterprise', label: 'Plano Enterprise' },
    { value: 'custom', label: 'Plano Personalizado' }
  ]

  const subscriptionStatusOptions = [
    { value: 'all', label: 'Todos os Status de Assinatura' },
    { value: 'active', label: 'Assinatura Ativa' },
    { value: 'expired', label: 'Assinatura Expirada' },
    { value: 'cancelled', label: 'Assinatura Cancelada' },
    { value: 'trial', label: 'Período de Teste' },
    { value: 'pending', label: 'Pendente' }
  ]

  const paymentStatusOptions = [
    { value: 'all', label: 'Todos os Status de Pagamento' },
    { value: 'paid', label: 'Pago' },
    { value: 'pending', label: 'Pendente' },
    { value: 'failed', label: 'Falhou' },
    { value: 'overdue', label: 'Em Atraso' },
    { value: 'refunded', label: 'Reembolsado' }
  ]

  const dateRangeOptions = [
    { value: 'all', label: 'Todos os Períodos' },
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Última Semana' },
    { value: 'month', label: 'Último Mês' },
    { value: 'quarter', label: 'Último Trimestre' },
    { value: 'year', label: 'Último Ano' }
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
      plan: 'all',
      subscriptionStatus: 'all',
      paymentStatus: 'all',
      dateRange: 'all'
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
        {/* Status do Usuário */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status do Usuário
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

        {/* Plano */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Plano
          </label>
          <select
            value={filters.plan}
            onChange={(e) => updateFilters('plan', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {planOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status da Assinatura */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status da Assinatura
          </label>
          <select
            value={filters.subscriptionStatus}
            onChange={(e) => updateFilters('subscriptionStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {subscriptionStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status do Pagamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status do Pagamento
          </label>
          <select
            value={filters.paymentStatus}
            onChange={(e) => updateFilters('paymentStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {paymentStatusOptions.map((option) => (
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {dateRangeOptions.map((option) => (
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

      {/* Filtros por Status de Assinatura */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Status de Assinatura:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'active', label: 'Ativa', icon: CheckCircle, color: 'text-green-600' },
            { value: 'trial', label: 'Teste', icon: Clock, color: 'text-blue-600' },
            { value: 'expired', label: 'Expirada', icon: XCircle, color: 'text-red-600' },
            { value: 'cancelled', label: 'Cancelada', icon: AlertTriangle, color: 'text-yellow-600' }
          ].map((status) => (
            <motion.button
              key={status.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('subscriptionStatus', status.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.subscriptionStatus === status.value
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

      {/* Filtros por Status de Pagamento */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Status de Pagamento:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'paid', label: 'Pago', icon: CheckCircle, color: 'text-green-600' },
            { value: 'pending', label: 'Pendente', icon: Clock, color: 'text-yellow-600' },
            { value: 'failed', label: 'Falhou', icon: XCircle, color: 'text-red-600' },
            { value: 'overdue', label: 'Atraso', icon: AlertTriangle, color: 'text-orange-600' }
          ].map((status) => (
            <motion.button
              key={status.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('paymentStatus', status.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.paymentStatus === status.value
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

      {/* Filtros por Planos */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Planos:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'basic', label: 'Básico', color: 'text-gray-600' },
            { value: 'professional', label: 'Profissional', color: 'text-blue-600' },
            { value: 'premium', label: 'Premium', color: 'text-purple-600' },
            { value: 'enterprise', label: 'Enterprise', color: 'text-orange-600' }
          ].map((plan) => (
            <motion.button
              key={plan.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('plan', plan.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.plan === plan.value
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Package className={`w-3 h-3 ${plan.color}`} />
              {plan.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
