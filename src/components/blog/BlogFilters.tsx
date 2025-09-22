'use client'

import { motion } from 'framer-motion'
import { Filter, FileText, Eye, Clock, Tag, User, TrendingUp, Search } from 'lucide-react'

interface FiltersProps {
  filters: {
    status: string
    category: string
    author: string
    visibility: string
  }
  onFiltersChange: (filters: any) => void
}

export const BlogFilters: React.FC<FiltersProps> = ({ filters, onFiltersChange }) => {
  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'published', label: 'Publicado' },
    { value: 'draft', label: 'Rascunho' },
    { value: 'scheduled', label: 'Agendado' },
    { value: 'archived', label: 'Arquivado' }
  ]

  const categoryOptions = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'technology', label: 'Tecnologia' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'business', label: 'Negócios' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'news', label: 'Notícias' }
  ]

  const visibilityOptions = [
    { value: 'all', label: 'Todas as Visibilidades' },
    { value: 'public', label: 'Público' },
    { value: 'private', label: 'Privado' },
    { value: 'members', label: 'Membros' }
  ]

  const updateFilters = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({ status: 'all', category: 'all', author: 'all', visibility: 'all' })
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
          <h3 className="font-semibold text-gray-900 dark:text-white">Filtros do Blog</h3>
          {hasActiveFilters && (
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">Ativos</span>
          )}
        </div>
        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors"
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoria</label>
          <select
            value={filters.category}
            onChange={(e) => updateFilters('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Autor</label>
          <select
            value={filters.author}
            onChange={(e) => updateFilters('author', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Todos os Autores</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="guest">Convidado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Visibilidade</label>
          <select
            value={filters.visibility}
            onChange={(e) => updateFilters('visibility', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          >
            {visibilityOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Filtros Rápidos:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'published', label: 'Publicados', icon: Eye, color: 'text-green-600' },
            { value: 'draft', label: 'Rascunhos', icon: FileText, color: 'text-yellow-600' },
            { value: 'scheduled', label: 'Agendados', icon: Clock, color: 'text-blue-600' },
            { value: 'technology', label: 'Tecnologia', icon: Tag, color: 'text-purple-600' },
            { value: 'marketing', label: 'Marketing', icon: TrendingUp, color: 'text-orange-600' }
          ].map((item) => (
            <motion.button
              key={item.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters(item.value.includes('published') || item.value.includes('draft') || item.value.includes('scheduled') ? 'status' : 'category', item.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                (filters.status === item.value || filters.category === item.value)
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
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
