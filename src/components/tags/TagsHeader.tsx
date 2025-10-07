'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  Tag,
  TrendingUp,
  Hash,
  Palette,
  BarChart3,
  Filter
} from 'lucide-react'
import { getAuthHeaders } from '@/lib/auth-token'

interface TagsHeaderProps {
  onCreateTag: () => void
  viewMode: 'grid' | 'table'
  onViewModeChange: (mode: 'grid' | 'table') => void
  searchTerm: string
  onSearchChange: (term: string) => void
  showFilters: boolean
  onToggleFilters: () => void
}

export const TagsHeader: React.FC<TagsHeaderProps> = ({
  onCreateTag,
  viewMode,
  onViewModeChange,
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters
}) => {
  const [stats, setStats] = useState([
    {
      label: 'Total de Tags',
      value: '0',
      icon: Tag,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      change: '+0'
    },
    {
      label: 'Mais Usadas',
      value: '0',
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100',
      change: '+0'
    },
    {
      label: 'Uso Total',
      value: '0',
      icon: BarChart3,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      change: '+0'
    },
    {
      label: 'Cores Ativas',
      value: '0',
      icon: Palette,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      change: '+0'
    }
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/tags/stats', {
        headers: getAuthHeaders()
      })

      if (response.ok) {
        const data = await response.json()
        setStats([
          {
            label: 'Total de Tags',
            value: data.stats.totalTags.value.toString(),
            icon: Tag,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
            change: data.stats.totalTags.change >= 0 
              ? `+${data.stats.totalTags.change}` 
              : data.stats.totalTags.change.toString()
          },
          {
            label: 'Mais Usadas',
            value: data.stats.mostUsedTags.value.toString(),
            icon: TrendingUp,
            color: 'text-green-600',
            bg: 'bg-green-100',
            change: data.stats.mostUsedTags.change >= 0 
              ? `+${data.stats.mostUsedTags.change}` 
              : data.stats.mostUsedTags.change.toString()
          },
          {
            label: 'Uso Total',
            value: data.stats.totalUsage.value.toString(),
            icon: BarChart3,
            color: 'text-purple-600',
            bg: 'bg-purple-100',
            change: data.stats.totalUsage.change >= 0 
              ? `+${data.stats.totalUsage.change}` 
              : data.stats.totalUsage.change.toString()
          },
          {
            label: 'Cores Ativas',
            value: data.stats.activeColors.value.toString(),
            icon: Palette,
            color: 'text-orange-600',
            bg: 'bg-orange-100',
            change: data.stats.activeColors.change >= 0 
              ? `+${data.stats.activeColors.change}` 
              : data.stats.activeColors.change.toString()
          }
        ])
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-8">
      {/* Título e Ações */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tags
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Organize e categorize seus conteúdos com tags inteligentes
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar tags..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
            />
          </div>

          {/* Botão de Filtros */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onToggleFilters}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              showFilters
                ? 'bg-orange-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </motion.button>

          {/* Toggle View Mode */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Vista em Grade"
            >
              <Grid3X3 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewModeChange('table')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Vista em Tabela"
            >
              <List className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Botão Criar Tag */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreateTag}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Tag
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`text-xs font-medium ${
                    stat.change.startsWith('+') 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500">este mês</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors"
        >
          <TrendingUp className="w-4 h-4" />
          Tags Populares
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-colors"
        >
          <Hash className="w-4 h-4" />
          Por Categoria
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-colors"
        >
          <BarChart3 className="w-4 h-4" />
          Relatórios de Uso
        </motion.button>
      </div>
    </div>
  )
}
