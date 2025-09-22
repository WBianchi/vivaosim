'use client'

import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, Receipt, Calculator, FileText, Download, Calendar } from 'lucide-react'

interface FinancialHeaderProps {
  viewMode: string
  onViewModeChange: (mode: 'overview' | 'events' | 'expenses' | 'budget') => void
}

export const FinancialHeader: React.FC<FinancialHeaderProps> = ({ viewMode, onViewModeChange }) => {
  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
    { id: 'events', label: 'Eventos/Festas', icon: Calendar },
    { id: 'expenses', label: 'Despesas', icon: Receipt },
    { id: 'budget', label: 'Orçamentos', icon: Calculator }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financeiro</h1>
            <p className="text-gray-600 dark:text-gray-400">Controle completo de custos e receitas</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium shadow-lg shadow-green-500/25"
          >
            <Download className="w-4 h-4" />
            Exportar
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewModeChange(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                viewMode === tab.id
                  ? 'bg-white dark:bg-gray-700 text-green-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
