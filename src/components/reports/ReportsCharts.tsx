'use client'

import { motion } from 'framer-motion'
import { TrendingUp, BarChart3, PieChart, Activity, Calendar, Download, Maximize2 } from 'lucide-react'

interface ReportsChartsProps {
  period: string
  filters: any
  reportType: string
}

export const ReportsCharts: React.FC<ReportsChartsProps> = ({ period, filters, reportType }) => {
  // Dados mock para os gráficos
  const chartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    revenue: [45000, 52000, 48000, 61000, 58000, 72000],
    customers: [120, 145, 138, 165, 155, 189],
    orders: [89, 102, 95, 118, 112, 134]
  }

  const pieData = [
    { label: 'WhatsApp', value: 45, color: 'bg-green-500' },
    { label: 'Email', value: 30, color: 'bg-blue-500' },
    { label: 'Website', value: 20, color: 'bg-purple-500' },
    { label: 'Instagram', value: 5, color: 'bg-pink-500' }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Linha - Tendência */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tendência de Receita</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Últimos 6 meses</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Gráfico de linha simulado */}
        <div className="h-64 relative">
          <div className="absolute inset-0 flex items-end justify-between gap-2">
            {chartData.revenue.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(value / Math.max(...chartData.revenue)) * 100}%` }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg relative group"
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    R$ {(value / 1000).toFixed(0)}K
                  </div>
                </motion.div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {chartData.labels[index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Legenda */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Receita</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Meta</span>
          </div>
        </div>
      </motion.div>

      {/* Gráfico de Pizza - Distribuição */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Origem dos Leads</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Distribuição por canal</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Gráfico de pizza simulado */}
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              {pieData.reduce((acc, item, index) => {
                const startAngle = acc
                const endAngle = acc + (item.value / 100) * 360
                const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
                
                const startX = 96 + 80 * Math.cos((startAngle * Math.PI) / 180)
                const startY = 96 + 80 * Math.sin((startAngle * Math.PI) / 180)
                const endX = 96 + 80 * Math.cos((endAngle * Math.PI) / 180)
                const endY = 96 + 80 * Math.sin((endAngle * Math.PI) / 180)

                return (
                  <>
                    <motion.path
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      d={`M 96 96 L ${startX} ${startY} A 80 80 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                      className={item.color}
                      fill="currentColor"
                    />
                    {acc + item.value}
                  </>
                )
              }, 0)}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">100%</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legenda */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {pieData.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2"
            >
              <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.label} ({item.value}%)
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Gráfico de Barras - Comparativo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance por Produto</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Top 5 produtos</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Barras horizontais */}
        <div className="space-y-4">
          {[
            { name: 'Produto A', value: 85, color: 'bg-blue-500' },
            { name: 'Produto B', value: 72, color: 'bg-green-500' },
            { name: 'Produto C', value: 68, color: 'bg-purple-500' },
            { name: 'Produto D', value: 54, color: 'bg-orange-500' },
            { name: 'Produto E', value: 45, color: 'bg-pink-500' }
          ].map((item, index) => (
            <div key={item.name} className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-20">
                {item.name}
              </span>
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`h-full ${item.color} rounded-full flex items-center justify-end pr-2`}
                >
                  <span className="text-xs text-white font-medium">{item.value}%</span>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Gráfico de Área - Funil */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Funil de Conversão</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Taxa de conversão por etapa</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Funil */}
        <div className="space-y-3">
          {[
            { stage: 'Visitantes', value: 10000, percentage: 100, color: 'bg-blue-500' },
            { stage: 'Leads', value: 3500, percentage: 35, color: 'bg-indigo-500' },
            { stage: 'Oportunidades', value: 1200, percentage: 12, color: 'bg-purple-500' },
            { stage: 'Clientes', value: 450, percentage: 4.5, color: 'bg-pink-500' }
          ].map((item, index) => (
            <motion.div
              key={item.stage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.stage}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.value.toLocaleString()} ({item.percentage}%)
                </span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-8 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`h-full ${item.color} rounded-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
