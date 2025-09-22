'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Eye, MessageSquare, Clock, ArrowUp, ArrowDown } from 'lucide-react'

interface ReportsMetricsProps {
  period: string
  filters: any
}

export const ReportsMetrics: React.FC<ReportsMetricsProps> = ({ period, filters }) => {
  const metrics = [
    {
      title: 'Receita Total',
      value: 'R$ 248.500',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600',
      description: 'vs período anterior'
    },
    {
      title: 'Novos Clientes',
      value: '1.234',
      change: '+8.3%',
      trend: 'up',
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600',
      description: 'Cadastros no período'
    },
    {
      title: 'Pedidos',
      value: '456',
      change: '+15.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600',
      description: 'Total de vendas'
    },
    {
      title: 'Taxa de Conversão',
      value: '3.8%',
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      color: 'orange',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600',
      description: 'Visitantes → Clientes'
    },
    {
      title: 'Visualizações',
      value: '48.2K',
      change: '+22.1%',
      trend: 'up',
      icon: Eye,
      color: 'indigo',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      iconColor: 'text-indigo-600',
      description: 'Páginas visitadas'
    },
    {
      title: 'Mensagens',
      value: '892',
      change: '+18.7%',
      trend: 'up',
      icon: MessageSquare,
      color: 'pink',
      bgColor: 'bg-pink-100 dark:bg-pink-900/30',
      iconColor: 'text-pink-600',
      description: 'WhatsApp + Email'
    },
    {
      title: 'Tempo Médio',
      value: '4m 32s',
      change: '+5.4%',
      trend: 'up',
      icon: Clock,
      color: 'cyan',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
      iconColor: 'text-cyan-600',
      description: 'Permanência no site'
    },
    {
      title: 'Ticket Médio',
      value: 'R$ 545',
      change: '+9.8%',
      trend: 'up',
      icon: DollarSign,
      color: 'emerald',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600',
      description: 'Valor médio por venda'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        const TrendIcon = metric.trend === 'up' ? ArrowUp : ArrowDown

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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {metric.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {metric.description}
              </p>
            </div>

            {/* Mini gráfico */}
            <div className="mt-4 h-8 flex items-end gap-1">
              {[40, 65, 45, 70, 55, 80, 75, 90].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.05 + i * 0.02 }}
                  className={`flex-1 ${metric.bgColor} rounded-t`}
                />
              ))}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default ReportsMetrics
