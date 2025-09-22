'use client'

import { motion } from 'framer-motion'
import { 
  Filter, 
  Tag, 
  Hash, 
  Palette,
  TrendingUp,
  Eye,
  Activity
} from 'lucide-react'

interface FiltersProps {
  filters: {
    category: string
    color: string
    usage: string
    status: string
  }
  onFiltersChange: (filters: any) => void
}

export const TagsFilters: React.FC<FiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const categoryOptions = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'projeto', label: 'Projeto' },
    { value: 'cliente', label: 'Cliente' },
    { value: 'status', label: 'Status' },
    { value: 'prioridade', label: 'Prioridade' },
    { value: 'departamento', label: 'Departamento' },
    { value: 'servico', label: 'Serviço' },
    { value: 'produto', label: 'Produto' },
    { value: 'geral', label: 'Geral' }
  ]

  const colorOptions = [
    { value: 'all', label: 'Todas as Cores' },
    { value: 'red', label: 'Vermelho', color: 'bg-red-500' },
    { value: 'orange', label: 'Laranja', color: 'bg-orange-500' },
    { value: 'yellow', label: 'Amarelo', color: 'bg-yellow-500' },
    { value: 'green', label: 'Verde', color: 'bg-green-500' },
    { value: 'blue', label: 'Azul', color: 'bg-blue-500' },
    { value: 'purple', label: 'Roxo', color: 'bg-purple-500' },
    { value: 'pink', label: 'Rosa', color: 'bg-pink-500' },
    { value: 'gray', label: 'Cinza', color: 'bg-gray-500' }
  ]

  const usageOptions = [
    { value: 'all', label: 'Todos os Usos' },
    { value: 'high', label: 'Muito Usadas (50+)' },
    { value: 'medium', label: 'Moderadamente Usadas (10-49)' },
    { value: 'low', label: 'Pouco Usadas (1-9)' },
    { value: 'unused', label: 'Não Usadas (0)' }
  ]

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'active', label: 'Ativas' },
    { value: 'inactive', label: 'Inativas' },
    { value: 'archived', label: 'Arquivadas' }
  ]

  const updateFilters = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      category: 'all',
      color: 'all',
      usage: 'all',
      status: 'all'
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categoria
          </label>
          <select
            value={filters.category}
            onChange={(e) => updateFilters('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Cor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cor
          </label>
          <select
            value={filters.color}
            onChange={(e) => updateFilters('color', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {colorOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Uso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Frequência de Uso
          </label>
          <select
            value={filters.usage}
            onChange={(e) => updateFilters('usage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {usageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

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
      </div>

      {/* Filtros Rápidos por Categoria */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Categorias Rápidas:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'projeto', label: 'Projeto', icon: Hash, color: 'text-blue-600' },
            { value: 'cliente', label: 'Cliente', icon: Eye, color: 'text-green-600' },
            { value: 'status', label: 'Status', icon: Activity, color: 'text-yellow-600' },
            { value: 'prioridade', label: 'Prioridade', icon: TrendingUp, color: 'text-red-600' }
          ].map((category) => (
            <motion.button
              key={category.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('category', category.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.category === category.value
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <category.icon className={`w-3 h-3 ${category.color}`} />
              {category.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filtros por Cores */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Cores Populares:
        </p>
        <div className="flex flex-wrap gap-2">
          {colorOptions.slice(1, 6).map((color) => (
            <motion.button
              key={color.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('color', color.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.color === color.value
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <div className={`w-3 h-3 ${color.color} rounded-full`}></div>
              {color.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filtros por Uso */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Por Frequência:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'high', label: 'Muito Usadas', icon: TrendingUp, color: 'text-green-600' },
            { value: 'medium', label: 'Moderadas', icon: Activity, color: 'text-yellow-600' },
            { value: 'low', label: 'Pouco Usadas', icon: Eye, color: 'text-orange-600' }
          ].map((usage) => (
            <motion.button
              key={usage.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('usage', usage.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.usage === usage.value
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <usage.icon className={`w-3 h-3 ${usage.color}`} />
              {usage.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
