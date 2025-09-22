'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Eye, MousePointerClick } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeProvider'

interface PerformanceData {
  name: string
  views: number
  clicks: number
  conversion: string
  revenue: string
}

interface PerformanceTableProps {
  data: PerformanceData[]
}

export const PerformanceTable: React.FC<PerformanceTableProps> = ({ data }) => {
  const { isDarkMode } = useTheme()

  const getConversionColor = (conversion: string) => {
    const rate = parseFloat(conversion.replace('%', ''))
    if (rate >= 22) return isDarkMode ? 'text-green-400' : 'text-green-600'
    if (rate >= 20) return isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
    return isDarkMode ? 'text-red-400' : 'text-red-600'
  }

  const getConversionIcon = (conversion: string) => {
    const rate = parseFloat(conversion.replace('%', ''))
    return rate >= 21 ? TrendingUp : TrendingDown
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        {/* Header */}
        <thead>
          <tr className={cn(
            'border-b',
            isDarkMode ? 'border-slate-700' : 'border-gray-200'
          )}>
            <th className={cn(
              'text-left py-4 px-4 text-sm font-semibold',
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              Página
            </th>
            <th className={cn(
              'text-center py-4 px-4 text-sm font-semibold',
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              <div className="flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" />
                Visualizações
              </div>
            </th>
            <th className={cn(
              'text-center py-4 px-4 text-sm font-semibold',
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              <div className="flex items-center justify-center gap-2">
                <MousePointerClick className="w-4 h-4" />
                Cliques
              </div>
            </th>
            <th className={cn(
              'text-center py-4 px-4 text-sm font-semibold',
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              Conversão
            </th>
            <th className={cn(
              'text-right py-4 px-4 text-sm font-semibold',
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              Receita
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {data.map((row, index) => {
            const ConversionIcon = getConversionIcon(row.conversion)
            
            return (
              <motion.tr
                key={row.name}
                className={cn(
                  'border-b transition-colors',
                  isDarkMode 
                    ? 'border-slate-700/50 hover:bg-slate-700/20' 
                    : 'border-gray-100 hover:bg-gray-50',
                )}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                {/* Page Name */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold',
                      isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'
                    )}>
                      {row.name.charAt(0)}
                    </div>
                    <span className={cn(
                      'font-medium',
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    )}>
                      {row.name}
                    </span>
                  </div>
                </td>

                {/* Views */}
                <td className="py-4 px-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className={cn(
                      'font-semibold',
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    )}>
                      {row.views.toLocaleString()}
                    </span>
                    <div className="w-12 h-1 bg-blue-500 rounded-full opacity-30" />
                  </div>
                </td>

                {/* Clicks */}
                <td className="py-4 px-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className={cn(
                      'font-semibold',
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    )}>
                      {row.clicks.toLocaleString()}
                    </span>
                    <div className="w-12 h-1 bg-green-500 rounded-full opacity-30" />
                  </div>
                </td>

                {/* Conversion */}
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <ConversionIcon className={cn('w-4 h-4', getConversionColor(row.conversion))} />
                    <span className={cn(
                      'font-semibold',
                      getConversionColor(row.conversion)
                    )}>
                      {row.conversion}
                    </span>
                  </div>
                </td>

                {/* Revenue */}
                <td className="py-4 px-4 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className={cn(
                      'font-bold text-lg',
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    )}>
                      {row.revenue}
                    </span>
                    <div className="w-16 h-1 bg-emerald-500 rounded-full opacity-30" />
                  </div>
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>

      {/* Summary */}
      <motion.div
        className={cn(
          'mt-6 p-4 rounded-xl',
          isDarkMode ? 'bg-slate-700/30' : 'bg-gray-50'
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className={cn('text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600')}>
              Total de Visualizações
            </p>
            <p className={cn('text-xl font-bold', isDarkMode ? 'text-white' : 'text-gray-900')}>
              {data.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className={cn('text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600')}>
              Total de Cliques
            </p>
            <p className={cn('text-xl font-bold', isDarkMode ? 'text-white' : 'text-gray-900')}>
              {data.reduce((sum, item) => sum + item.clicks, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className={cn('text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600')}>
              Conversão Média
            </p>
            <p className={cn('text-xl font-bold', isDarkMode ? 'text-white' : 'text-gray-900')}>
              {(data.reduce((sum, item) => sum + parseFloat(item.conversion.replace('%', '')), 0) / data.length).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className={cn('text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600')}>
              Receita Total
            </p>
            <p className={cn('text-xl font-bold text-green-500')}>
              R$ {(data.reduce((sum, item) => sum + parseFloat(item.revenue.replace('R$ ', '').replace('K', '').replace(',', '.')), 0)).toFixed(1)}K
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
