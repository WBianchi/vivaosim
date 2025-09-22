'use client'

import { motion } from 'framer-motion'
import { 
  Filter, 
  ShoppingCart, 
  Package, 
  CreditCard,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye
} from 'lucide-react'

interface FiltersProps {
  filters: {
    status: string
    plan: string
    paymentMethod: string
    paymentStatus: string
    dateRange: string
    priceRange: string
  }
  onFiltersChange: (filters: any) => void
}

export const SalesFilters: React.FC<FiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const statusOptions = [
    { value: 'all', label: 'Todos os Status', icon: Eye, color: 'text-gray-600' },
    { value: 'completed', label: 'Concluída', icon: CheckCircle, color: 'text-green-600' },
    { value: 'pending', label: 'Pendente', icon: Clock, color: 'text-yellow-600' },
    { value: 'cancelled', label: 'Cancelada', icon: XCircle, color: 'text-red-600' },
    { value: 'refunded', label: 'Reembolsada', icon: AlertTriangle, color: 'text-purple-600' }
  ]

  const planOptions = [
    { value: 'all', label: 'Todos os Planos' },
    { value: 'basic', label: 'Plano Básico' },
    { value: 'professional', label: 'Plano Profissional' },
    { value: 'premium', label: 'Plano Premium' },
    { value: 'enterprise', label: 'Plano Enterprise' },
    { value: 'custom', label: 'Plano Personalizado' }
  ]

  const paymentMethodOptions = [
    { value: 'all', label: 'Todos os Métodos' },
    { value: 'credit_card', label: 'Cartão de Crédito' },
    { value: 'pix', label: 'PIX' },
    { value: 'bank_transfer', label: 'Transferência' },
    { value: 'boleto', label: 'Boleto' },
    { value: 'paypal', label: 'PayPal' }
  ]

  const paymentStatusOptions = [
    { value: 'all', label: 'Todos os Status de Pagamento' },
    { value: 'paid', label: 'Pago' },
    { value: 'pending', label: 'Pendente' },
    { value: 'failed', label: 'Falhou' },
    { value: 'processing', label: 'Processando' },
    { value: 'refunded', label: 'Reembolsado' }
  ]

  const dateRangeOptions = [
    { value: 'all', label: 'Todos os Períodos' },
    { value: 'today', label: 'Hoje' },
    { value: 'yesterday', label: 'Ontem' },
    { value: 'week', label: 'Última Semana' },
    { value: 'month', label: 'Último Mês' },
    { value: 'quarter', label: 'Último Trimestre' },
    { value: 'year', label: 'Último Ano' }
  ]

  const priceRangeOptions = [
    { value: 'all', label: 'Todas as Faixas' },
    { value: '0-50', label: 'R$ 0 - R$ 50' },
    { value: '50-100', label: 'R$ 50 - R$ 100' },
    { value: '100-200', label: 'R$ 100 - R$ 200' },
    { value: '200-500', label: 'R$ 200 - R$ 500' },
    { value: '500+', label: 'Acima de R$ 500' }
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
      paymentMethod: 'all',
      paymentStatus: 'all',
      dateRange: 'all',
      priceRange: 'all'
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
            Filtros de Vendas
          </h3>
          {hasActiveFilters && (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
              Ativos
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            Limpar filtros
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Status da Venda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status da Venda
          </label>
          <select
            value={filters.status}
            onChange={(e) => updateFilters('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {planOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Método de Pagamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Método de Pagamento
          </label>
          <select
            value={filters.paymentMethod}
            onChange={(e) => updateFilters('paymentMethod', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {paymentMethodOptions.map((option) => (
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Faixa de Preço */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Faixa de Preço
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => updateFilters('priceRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {priceRangeOptions.map((option) => (
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
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <status.icon className={`w-3 h-3 ${status.color}`} />
              {status.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filtros por Método de Pagamento */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Métodos de Pagamento:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'credit_card', label: 'Cartão', icon: CreditCard, color: 'text-blue-600' },
            { value: 'pix', label: 'PIX', icon: DollarSign, color: 'text-green-600' },
            { value: 'bank_transfer', label: 'Transferência', icon: Calendar, color: 'text-purple-600' },
            { value: 'boleto', label: 'Boleto', icon: AlertTriangle, color: 'text-orange-600' }
          ].map((method) => (
            <motion.button
              key={method.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('paymentMethod', method.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.paymentMethod === method.value
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <method.icon className={`w-3 h-3 ${method.color}`} />
              {method.label}
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
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Package className={`w-3 h-3 ${plan.color}`} />
              {plan.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filtros por Período */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Períodos Rápidos:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'today', label: 'Hoje' },
            { value: 'week', label: 'Semana' },
            { value: 'month', label: 'Mês' },
            { value: 'quarter', label: 'Trimestre' }
          ].map((period) => (
            <motion.button
              key={period.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('dateRange', period.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.dateRange === period.value
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Calendar className="w-3 h-3 text-gray-500" />
              {period.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
