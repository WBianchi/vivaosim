'use client'

import { motion } from 'framer-motion'
import { 
  Filter, 
  Package, 
  Calendar, 
  DollarSign,
  Tag,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

interface FiltersProps {
  filters: {
    status: string
    period: string
    priceRange: string
    category: string
  }
  onFiltersChange: (filters: any) => void
}

export const PlansFilters: React.FC<FiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const statusOptions = [
    { value: 'all', label: 'Todos os Status', icon: Eye, color: 'text-gray-600' },
    { value: 'active', label: 'Ativo', icon: CheckCircle, color: 'text-green-600' },
    { value: 'inactive', label: 'Inativo', icon: XCircle, color: 'text-red-600' },
    { value: 'draft', label: 'Rascunho', icon: Clock, color: 'text-yellow-600' }
  ]

  const periodOptions = [
    { value: 'all', label: 'Todos os Períodos' },
    { value: 'monthly', label: 'Mensal' },
    { value: 'quarterly', label: 'Trimestral' },
    { value: 'semiannual', label: 'Semestral' },
    { value: 'annual', label: 'Anual' }
  ]

  const priceRangeOptions = [
    { value: 'all', label: 'Todas as Faixas' },
    { value: '0-50', label: 'Até R$ 50' },
    { value: '50-100', label: 'R$ 50 - R$ 100' },
    { value: '100-200', label: 'R$ 100 - R$ 200' },
    { value: '200-500', label: 'R$ 200 - R$ 500' },
    { value: '500+', label: 'Acima de R$ 500' }
  ]

  const categoryOptions = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'basic', label: 'Básico' },
    { value: 'professional', label: 'Profissional' },
    { value: 'premium', label: 'Premium' },
    { value: 'enterprise', label: 'Empresarial' },
    { value: 'custom', label: 'Personalizado' }
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
      period: 'all',
      priceRange: 'all',
      category: 'all'
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
            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
              Ativos
            </span>
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
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => updateFilters('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            Período de Cobrança
          </label>
          <select
            value={filters.period}
            onChange={(e) => updateFilters('period', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {periodOptions.map((option) => (
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {priceRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categoria
          </label>
          <select
            value={filters.category}
            onChange={(e) => updateFilters('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {categoryOptions.map((option) => (
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

      {/* Filtros por Período */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Períodos de Cobrança:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'monthly', label: 'Mensal', icon: Calendar, color: 'text-blue-600' },
            { value: 'quarterly', label: 'Trimestral', icon: Calendar, color: 'text-green-600' },
            { value: 'semiannual', label: 'Semestral', icon: Calendar, color: 'text-orange-600' },
            { value: 'annual', label: 'Anual', icon: Calendar, color: 'text-purple-600' }
          ].map((period) => (
            <motion.button
              key={period.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('period', period.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.period === period.value
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <period.icon className={`w-3 h-3 ${period.color}`} />
              {period.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filtros por Categoria */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Categorias:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'basic', label: 'Básico', color: 'text-gray-600' },
            { value: 'professional', label: 'Profissional', color: 'text-blue-600' },
            { value: 'premium', label: 'Premium', color: 'text-purple-600' },
            { value: 'enterprise', label: 'Empresarial', color: 'text-orange-600' }
          ].map((category) => (
            <motion.button
              key={category.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('category', category.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.category === category.value
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Tag className={`w-3 h-3 ${category.color}`} />
              {category.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
