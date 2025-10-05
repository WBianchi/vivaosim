'use client'

import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List,
  Headphones,
  TrendingUp,
  Users,
  Clock,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Star,
  Filter
} from 'lucide-react'

interface AttendantsHeaderProps {
  onCreateAttendant: () => void
  onSearchChange: (search: string) => void
  searchTerm: string
  viewMode: 'grid' | 'table'
  onViewModeChange: (mode: 'grid' | 'table') => void
  onToggleFilters: () => void
  stats?: {
    totalAttendants: number
    onlineAttendants: number
    activeChats: number
    avgResponseTime: number
    avgRating: number
    totalTickets: number
    resolvedToday: number
    pendingTickets: number
  }
}

export const AttendantsHeader: React.FC<AttendantsHeaderProps> = ({
  onCreateAttendant,
  onSearchChange,
  searchTerm,
  viewMode,
  onViewModeChange,
  onToggleFilters,
  stats = {
    totalAttendants: 0,
    onlineAttendants: 0,
    activeChats: 0,
    avgResponseTime: 0,
    avgRating: 0,
    totalTickets: 0,
    resolvedToday: 0,
    pendingTickets: 0
  }
}) => {
  return (
    <div className="space-y-6">
      {/* Header Principal */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Atendentes
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gerencie sua equipe de atendimento e monitore performance
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
              placeholder="Buscar atendentes..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm'
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
                  ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm'
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
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </motion.button>

          {/* Botão Criar Atendente */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateAttendant}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-orange-500/25"
          >
            <Plus className="w-4 h-4" />
            Novo Atendente
          </motion.button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Atendentes
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalAttendants}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 dark:text-green-400">
              +2 este mês
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Online Agora
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.onlineAttendants}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {((stats.onlineAttendants / stats.totalAttendants) * 100).toFixed(0)}% da equipe
            </span>
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
                Chats Ativos
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.activeChats}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
            <span className="text-sm text-purple-600 dark:text-purple-400">
              Em tempo real
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Tempo Resposta
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.avgResponseTime}min
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Tempo médio
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
                Avaliação Média
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.avgRating}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm text-yellow-600 dark:text-yellow-400">
              Excelente
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
                Tickets Total
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalTickets}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <Headphones className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Este mês
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Resolvidos Hoje
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.resolvedToday}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 dark:text-green-400">
              +12% vs ontem
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pendentes
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.pendingTickets}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-red-600 dark:text-red-400">
              Requer atenção
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
