'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeProvider'
import { cn } from '@/lib/utils'
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  MessageCircle, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ReactNode
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon }) => {
  const { isDarkMode } = useTheme()
  
  return (
    <motion.div
      className={cn(
        'relative p-6 rounded-2xl border backdrop-blur-sm',
        'hover:shadow-xl transition-all duration-300',
        isDarkMode
          ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70'
          : 'bg-white/50 border-gray-200/50 hover:bg-white/70'
      )}
      whileHover={{ scale: 1.02, y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={cn(
            'text-sm font-medium',
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          )}>
            {title}
          </p>
          <p className={cn(
            'text-2xl font-bold mt-2',
            isDarkMode ? 'text-white' : 'text-gray-900'
          )}>
            {value}
          </p>
          <div className="flex items-center mt-2">
            {trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            )}
            <span className={cn(
              'text-sm font-medium ml-1',
              trend === 'up' ? 'text-green-500' : 'text-red-500'
            )}>
              {change}
            </span>
          </div>
        </div>
        <motion.div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            'bg-gradient-to-br from-orange-500/20 to-orange-600/20',
            'text-orange-500'
          )}
          whileHover={{ rotate: 5 }}
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  )
}

interface DashboardStats {
  contacts: { value: number; change: string; trend: 'up' | 'down' }
  events: { value: number; change: string; trend: 'up' | 'down' }
  revenue: { value: number; change: string; trend: 'up' | 'down' }
  quotes: { value: number; change: string; trend: 'up' | 'down' }
  todaySchedules: number
}

interface Activity {
  id: string
  description: string
  createdAt: string
}

const DashboardPage = () => {
  const { user } = useAuth()
  const { isDarkMode } = useTheme()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/dashboard/stats')
        
        if (!response.ok) {
          throw new Error('Erro ao buscar dados')
        }

        const data = await response.json()
        setStats(data.stats)
        setActivities(data.activities || [])
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error)
        toast.error('Erro ao carregar dados do dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statsCards = stats ? [
    {
      title: 'Orçamentos Aprovados',
      value: formatCurrency(stats.quotes.value),
      change: `${stats.quotes.change}%`,
      trend: stats.quotes.trend,
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      title: 'Clientes Ativos',
      value: stats.contacts.value.toString(),
      change: `${stats.contacts.change}%`,
      trend: stats.contacts.trend,
      icon: <Users className="w-6 h-6" />
    },
    {
      title: 'Eventos do Mês',
      value: stats.events.value.toString(),
      change: `${stats.events.change}%`,
      trend: stats.events.trend,
      icon: <Calendar className="w-6 h-6" />
    },
    {
      title: 'Receita Mensal',
      value: formatCurrency(stats.revenue.value),
      change: `${stats.revenue.change}%`,
      trend: stats.revenue.trend,
      icon: <DollarSign className="w-6 h-6" />
    }
  ] : []

  return (
    <div className="h-full w-full p-6">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={cn(
            'text-3xl font-bold',
            isDarkMode ? 'text-white' : 'text-gray-900'
          )}>
            {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className={cn(
            'text-lg mt-2',
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          )}>
            Aqui está um resumo dos seus negócios hoje.
          </p>
        </motion.div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <StatCard {...stat} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className={cn(
            'p-6 rounded-2xl border backdrop-blur-sm',
            isDarkMode
              ? 'bg-slate-800/50 border-slate-700/50'
              : 'bg-white/50 border-gray-200/50'
          )}
        >
          <h2 className={cn(
            'text-xl font-semibold mb-4',
            isDarkMode ? 'text-white' : 'text-gray-900'
          )}>
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl transition-all',
                'border border-dashed',
                isDarkMode
                  ? 'border-orange-500/30 hover:bg-orange-900/20 text-orange-300'
                  : 'border-orange-500/30 hover:bg-orange-50/50 text-orange-600'
              )}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Novo Cliente</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl transition-all',
                'border border-dashed',
                isDarkMode
                  ? 'border-orange-500/30 hover:bg-orange-900/20 text-orange-300'
                  : 'border-orange-500/30 hover:bg-orange-50/50 text-orange-600'
              )}
            >
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Criar Evento</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl transition-all',
                'border border-dashed',
                isDarkMode
                  ? 'border-orange-500/30 hover:bg-orange-900/20 text-orange-300'
                  : 'border-orange-500/30 hover:bg-orange-50/50 text-orange-600'
              )}
            >
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Novo Orçamento</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className={cn(
            'p-6 rounded-2xl border backdrop-blur-sm',
            isDarkMode
              ? 'bg-slate-800/50 border-slate-700/50'
              : 'bg-white/50 border-gray-200/50'
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className={cn(
              'w-5 h-5',
              isDarkMode ? 'text-orange-400' : 'text-orange-500'
            )} />
            <h2 className={cn(
              'text-xl font-semibold',
              isDarkMode ? 'text-white' : 'text-gray-900'
            )}>
              Atividade Recente
            </h2>
          </div>
          
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
              </div>
            ) : activities.length > 0 ? (
              activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg',
                    isDarkMode ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50/50'
                  )}
                >
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <span className={cn(
                    'text-sm',
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  )}>
                    {activity.description}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className={cn(
                'text-center py-8 text-sm',
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              )}>
                Nenhuma atividade recente
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardPage
