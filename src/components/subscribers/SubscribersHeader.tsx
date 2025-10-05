'use client'

import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List,
  UserPlus,
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Filter,
  Calendar,
  PercentCircle
} from 'lucide-react'

interface SubscribersHeaderProps {
  onCreateSubscriber: () => void
  onSearchChange: (search: string) => void
  searchTerm: string
  viewMode: 'grid' | 'table'
  onViewModeChange: (mode: 'grid' | 'table') => void
  onToggleFilters: () => void
  stats?: {
    totalSubscribers: number
    activeSubscribers: number
    totalRevenue: number
    avgTicket: number
    newThisMonth: number
    churnRate: number
    expiringThisMonth: number
  }
}

export const SubscribersHeader: React.FC<SubscribersHeaderProps> = ({
  onCreateSubscriber,
  onSearchChange,
  searchTerm,
  viewMode,
  onViewModeChange,
  onToggleFilters,
  stats = {
    totalSubscribers: 0,
    activeSubscribers: 0,
    totalRevenue: 0,
    avgTicket: 0,
    newThisMonth: 0,
    churnRate: 0,
    expiringThisMonth: 0
  }
}) => {

  return (
    <div className="space-y-6">
      {/* Header Principal */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Assinantes
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gerencie todos os seus assinantes e suas assinaturas
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar assinantes..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Toggle View */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 text-orange-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewModeChange('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-gray-600 text-orange-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Botão Filtros */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleFilters}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </motion.button>

          {/* Botão Criar Assinante */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateSubscriber}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-orange-500/25"
          >
            <Plus className="w-4 h-4" />
            Novo Assinante
          </motion.button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Assinantes
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalSubscribers?.toLocaleString() || 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Taxa de Churn
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(stats.churnRate || 0).toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-red-600 transform rotate-180" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Últimos 30 dias
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Ticket Médio
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                R$ {(stats.avgTicket || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Por assinante/mês
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Expirando em Breve
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.expiringThisMonth || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-yellow-600 dark:text-yellow-400">
              Próximos 7 dias
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
