'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileSignature, 
  DollarSign, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'

interface ContractsStatsProps {
  refreshTrigger?: number
}

export const ContractsStats: React.FC<ContractsStatsProps> = ({ refreshTrigger }) => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    draft: 0,
    totalValue: 0,
    trend: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getAuthToken()
        if (!token) return

        const response = await fetch('/api/contracts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          const contracts = data.contracts || []

          const total = contracts.length
          const active = contracts.filter((c: any) => c.status === 'active').length
          const completed = contracts.filter((c: any) => c.status === 'completed').length
          const draft = contracts.filter((c: any) => c.status === 'draft').length
          const totalValue = contracts.reduce((sum: number, c: any) => sum + parseFloat(c.amount || 0), 0)

          setStats({
            total,
            active,
            completed,
            draft,
            totalValue,
            trend: 15.5
          })
        }
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [refreshTrigger])

  const cards = [
    {
      title: 'Total de Contratos',
      value: stats.total,
      icon: FileSignature,
      color: 'bg-blue-500',
      trend: stats.trend,
      format: 'number'
    },
    {
      title: 'Ativos',
      value: stats.active,
      icon: CheckCircle2,
      color: 'bg-green-500',
      format: 'number'
    },
    {
      title: 'Rascunhos',
      value: stats.draft,
      icon: Clock,
      color: 'bg-yellow-500',
      format: 'number'
    },
    {
      title: 'Valor Total',
      value: stats.totalValue,
      icon: DollarSign,
      color: 'bg-orange-500',
      trend: stats.trend,
      format: 'currency'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            {card.trend !== undefined && (
              <div className={`flex items-center gap-1 text-sm ${card.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {card.trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{Math.abs(card.trend)}%</span>
              </div>
            )}
          </div>
          
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {card.title}
          </h3>
          
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {card.format === 'currency' 
              ? `R$ ${card.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : card.value.toLocaleString('pt-BR')
            }
          </p>
        </motion.div>
      ))}
    </div>
  )
}
