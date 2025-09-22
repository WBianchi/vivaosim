'use client'

import { motion } from 'framer-motion'
import { Users, UserCheck, TrendingUp, DollarSign, Clock, Target, Zap, Award } from 'lucide-react'

export const FunnelMetrics: React.FC = () => {
  const metrics = [
    {
      title: 'Total de Leads',
      value: '2.456',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Taxa de Conversão',
      value: '24.8%',
      change: '+3.2%',
      trend: 'up',
      icon: Target,
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600'
    },
    {
      title: 'Tempo Médio',
      value: '7 dias',
      change: '-2 dias',
      trend: 'up',
      icon: Clock,
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Valor Total',
      value: 'R$ 148.5K',
      change: '+18.7%',
      trend: 'up',
      icon: DollarSign,
      color: 'emerald',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Leads Qualificados',
      value: '892',
      change: '+45',
      trend: 'up',
      icon: UserCheck,
      color: 'orange',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Velocidade',
      value: '3.2x',
      change: '+0.5x',
      trend: 'up',
      icon: Zap,
      color: 'yellow',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Score Médio',
      value: '78/100',
      change: '+5',
      trend: 'up',
      icon: Award,
      color: 'pink',
      bgColor: 'bg-pink-100 dark:bg-pink-900/30',
      iconColor: 'text-pink-600'
    },
    {
      title: 'Crescimento',
      value: '+34%',
      change: 'vs mês anterior',
      trend: 'up',
      icon: TrendingUp,
      color: 'indigo',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      iconColor: 'text-indigo-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        
        return (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 ${metric.bgColor} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${metric.iconColor}`} />
              </div>
              
              {metric.trend === 'up' && (
                <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-lg">
                  {metric.change}
                </span>
              )}
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {metric.value}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {metric.title}
              </p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
