'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Receipt, CreditCard, Wallet, PiggyBank, AlertTriangle } from 'lucide-react'

interface FinancialMetricsProps {
  period: string
  onPeriodChange: (period: string) => void
}

export const FinancialMetrics: React.FC<FinancialMetricsProps> = ({ period, onPeriodChange }) => {
  const metrics = [
    {
      title: 'Receita Total',
      value: 'R$ 148.500',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600'
    },
    {
      title: 'Despesas',
      value: 'R$ 45.200',
      change: '+8.3%',
      trend: 'up',
      icon: Receipt,
      color: 'red',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600'
    },
    {
      title: 'Lucro Líquido',
      value: 'R$ 103.300',
      change: '+15.2%',
      trend: 'up',
      icon: Wallet,
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Margem',
      value: '69.5%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Eventos Ativos',
      value: '24',
      change: '+6',
      trend: 'up',
      icon: CreditCard,
      color: 'orange',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Orçamentos',
      value: 'R$ 285.000',
      change: '+22.1%',
      trend: 'up',
      icon: PiggyBank,
      color: 'indigo',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      iconColor: 'text-indigo-600'
    },
    {
      title: 'Pendências',
      value: 'R$ 12.500',
      change: '-5.4%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'yellow',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Ticket Médio',
      value: 'R$ 6.187',
      change: '+9.8%',
      trend: 'up',
      icon: DollarSign,
      color: 'emerald',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600'
    }
  ]

  return (
    <div className="space-y-4">
      {/* Seletor de período */}
      <div className="flex justify-end">
        <select
          value={period}
          onChange={(e) => onPeriodChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
        >
          <option value="day">Hoje</option>
          <option value="week">Esta Semana</option>
          <option value="month">Este Mês</option>
          <option value="quarter">Trimestre</option>
          <option value="year">Este Ano</option>
        </select>
      </div>

      {/* Grid de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown

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
                <div className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${metric.iconColor}`} />
                </div>
                
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon className="w-3 h-3" />
                  {metric.change}
                </div>
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
    </div>
  )
}
