'use client'

import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Calendar, BarChart3 } from 'lucide-react'

interface FinancialChartsProps {
  period: string
}

export const FinancialCharts: React.FC<FinancialChartsProps> = ({ period }) => {
  const monthlyData = [
    { month: 'Jan', receita: 120000, despesa: 45000, lucro: 75000 },
    { month: 'Fev', receita: 135000, despesa: 48000, lucro: 87000 },
    { month: 'Mar', receita: 128000, despesa: 42000, lucro: 86000 },
    { month: 'Abr', receita: 145000, despesa: 51000, lucro: 94000 },
    { month: 'Mai', receita: 142000, despesa: 47000, lucro: 95000 },
    { month: 'Jun', receita: 148500, despesa: 45200, lucro: 103300 }
  ]

  const categoryData = [
    { category: 'Decoração', value: 12500, percentage: 27.6 },
    { category: 'Buffet', value: 8900, percentage: 19.7 },
    { category: 'Som/Iluminação', value: 7200, percentage: 15.9 },
    { category: 'Espaço', value: 6500, percentage: 14.4 },
    { category: 'Fotografia', value: 4800, percentage: 10.6 },
    { category: 'Outros', value: 5300, percentage: 11.7 }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Receita vs Despesas */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Fluxo de Caixa</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Receitas vs Despesas</p>
          </div>
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>

        <div className="space-y-4">
          {monthlyData.map((data, index) => (
            <div key={data.month} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300 w-12">{data.month}</span>
                <div className="flex-1 mx-4 flex gap-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(data.receita / 150000) * 100}%` }}
                    transition={{ delay: index * 0.1 }}
                    className="h-6 bg-green-500 rounded"
                    title={`Receita: R$ ${data.receita.toLocaleString()}`}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(data.despesa / 150000) * 100}%` }}
                    transition={{ delay: index * 0.1 + 0.05 }}
                    className="h-6 bg-red-500 rounded"
                    title={`Despesa: R$ ${data.despesa.toLocaleString()}`}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white w-20 text-right">
                  R$ {(data.lucro / 1000).toFixed(0)}K
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Receitas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Despesas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Lucro</span>
          </div>
        </div>
      </motion.div>

      {/* Gráfico de Despesas por Categoria */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Despesas por Categoria</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Distribuição de custos</p>
          </div>
          <BarChart3 className="w-5 h-5 text-purple-600" />
        </div>

        <div className="space-y-3">
          {categoryData.map((item, index) => (
            <div key={item.category}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.category}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  R$ {item.value.toLocaleString()}
                </span>
              </div>
              <div className="relative">
                <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-end pr-2"
                  >
                    <span className="text-xs text-white font-medium">{item.percentage}%</span>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Despesas</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              R$ {categoryData.reduce((acc, item) => acc + item.value, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Gráfico de Evolução Mensal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 lg:col-span-2"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Evolução Financeira</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Crescimento ao longo do tempo</p>
          </div>
          <Calendar className="w-5 h-5 text-blue-600" />
        </div>

        <div className="h-64 flex items-end justify-between gap-2">
          {monthlyData.map((data, index) => (
            <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(data.lucro / 120000) * 100}%` }}
                transition={{ delay: index * 0.1 }}
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg relative group"
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  R$ {(data.lucro / 1000).toFixed(0)}K
                </div>
              </motion.div>
              <span className="text-xs text-gray-600 dark:text-gray-400">{data.month}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
