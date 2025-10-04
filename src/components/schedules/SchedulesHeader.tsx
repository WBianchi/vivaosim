'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  Calendar,
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  Filter
} from 'lucide-react'
import { getAuthHeaders } from '@/lib/auth-token'

interface SchedulesHeaderProps {
  onCreateSchedule: () => void
  viewMode: 'grid' | 'table' | 'calendar'
  onViewModeChange: (mode: 'grid' | 'table' | 'calendar') => void
  searchTerm: string
  onSearchChange: (term: string) => void
  onToggleFilters?: () => void
  showFilters?: boolean
}

export const SchedulesHeader: React.FC<SchedulesHeaderProps> = ({
  onCreateSchedule,
  viewMode,
  onViewModeChange,
  searchTerm,
  onSearchChange,
  onToggleFilters,
  showFilters = false
}) => {
  const [statsData, setStatsData] = useState({
    totalAppointments: 0,
    appointmentsToday: 0,
    uniqueClients: 0,
    completedAppointments: 0,
    changePercent: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/appointments/stats', {
        headers: getAuthHeaders()
      })

      if (response.ok) {
        const data = await response.json()
        setStatsData({
          totalAppointments: data.stats.totalAppointments.value,
          appointmentsToday: data.stats.appointmentsToday.value,
          uniqueClients: data.stats.uniqueClients.value,
          completedAppointments: data.stats.completedAppointments.value,
          changePercent: data.stats.totalAppointments.change
        })
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      label: 'Total de Agendamentos',
      value: statsData.totalAppointments.toString(),
      icon: CalendarDays,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      change: `${statsData.changePercent > 0 ? '+' : ''}${statsData.changePercent}%`
    },
    {
      label: 'Hoje',
      value: statsData.appointmentsToday.toString(),
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      change: `${statsData.appointmentsToday}`
    },
    {
      label: 'Clientes Únicos',
      value: statsData.uniqueClients.toString(),
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      change: '+0%'
    },
    {
      label: 'Concluídos',
      value: statsData.completedAppointments.toString(),
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-100',
      change: '+0%'
    }
  ]

  return (
    <div className="mb-8">
      {/* Título e Ações */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Agendamentos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie todos os agendamentos com clientes
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar agendamentos..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
            />
          </div>

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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewModeChange('calendar')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Vista em Calendário"
            >
              <Calendar className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Botão Filtros */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onToggleFilters}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors shadow-sm ${
              showFilters
                ? 'bg-orange-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </motion.button>

          {/* Botão Criar Agendamento */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreateSchedule}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Agendamento
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
                  <span className="text-xs text-gray-500">vs mês anterior</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
