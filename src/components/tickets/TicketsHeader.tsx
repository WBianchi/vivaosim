'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  Ticket,
  AlertTriangle,
  Clock,
  CheckCircle,
  Users
} from 'lucide-react'
import { getAuthHeaders } from '@/lib/auth-token'

interface TicketsHeaderProps {
  onCreateTicket: () => void
  viewMode: 'grid' | 'table'
  onViewModeChange: (mode: 'grid' | 'table') => void
  searchTerm: string
  onSearchChange: (term: string) => void
}

export const TicketsHeader: React.FC<TicketsHeaderProps> = ({
  onCreateTicket,
  viewMode,
  onViewModeChange,
  searchTerm,
  onSearchChange
}) => {
  const [stats, setStats] = useState([
    {
      label: 'Total de Tickets',
      value: '0',
      icon: Ticket,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      change: '+0'
    },
    {
      label: 'Urgentes',
      value: '0',
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-100',
      change: '+0'
    },
    {
      label: 'Em Andamento',
      value: '0',
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
      change: '+0'
    },
    {
      label: 'Resolvidos',
      value: '0',
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100',
      change: '+0'
    }
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/tickets/stats', {
        headers: getAuthHeaders()
      })

      if (response.ok) {
        const data = await response.json()
        setStats([
          {
            label: 'Total de Tickets',
            value: data.stats.totalTickets.value.toString(),
            icon: Ticket,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
            change: data.stats.totalTickets.change >= 0 
              ? `+${data.stats.totalTickets.change}` 
              : data.stats.totalTickets.change.toString()
          },
          {
            label: 'Urgentes',
            value: data.stats.urgentTickets.value.toString(),
            icon: AlertTriangle,
            color: 'text-red-600',
            bg: 'bg-red-100',
            change: data.stats.urgentTickets.change >= 0 
              ? `+${data.stats.urgentTickets.change}` 
              : data.stats.urgentTickets.change.toString()
          },
          {
            label: 'Em Andamento',
            value: data.stats.inProgressTickets.value.toString(),
            icon: Clock,
            color: 'text-yellow-600',
            bg: 'bg-yellow-100',
            change: data.stats.inProgressTickets.change >= 0 
              ? `+${data.stats.inProgressTickets.change}` 
              : data.stats.inProgressTickets.change.toString()
          },
          {
            label: 'Resolvidos',
            value: data.stats.resolvedTickets.value.toString(),
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-100',
            change: data.stats.resolvedTickets.change >= 0 
              ? `+${data.stats.resolvedTickets.change}` 
              : data.stats.resolvedTickets.change.toString()
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
            Tickets de Suporte
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie solicitações e problemas dos clientes
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar tickets..."
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
          </div>

          {/* Botão Criar Ticket */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreateTicket}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Ticket
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
                  <span className="text-xs text-gray-500">esta semana</span>
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
          className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition-colors"
        >
          <AlertTriangle className="w-4 h-4" />
          Tickets Urgentes
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-xl transition-colors"
        >
          <Clock className="w-4 h-4" />
          Em Andamento
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors"
        >
          <Users className="w-4 h-4" />
          Meus Tickets
        </motion.button>
      </div>
    </div>
  )
}
