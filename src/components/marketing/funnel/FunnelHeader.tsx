'use client'

import { motion } from 'framer-motion'
import { TrendingDown, Layers, LayoutGrid, Download, Settings, Plus } from 'lucide-react'

interface FunnelHeaderProps {
  viewMode: 'funnel' | 'kanban'
  onViewModeChange: (mode: 'funnel' | 'kanban') => void
}

export const FunnelHeader: React.FC<FunnelHeaderProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <TrendingDown className="w-6 h-6 text-white rotate-180" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Funil de Vendas</h1>
            <p className="text-gray-600 dark:text-gray-400">Acompanhe a jornada dos seus leads até a conversão</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle de visualização */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewModeChange('funnel')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                viewMode === 'funnel'
                  ? 'bg-white dark:bg-gray-600 text-indigo-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Layers className="w-4 h-4" />
              Funil
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewModeChange('kanban')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-gray-600 text-indigo-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Kanban
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25"
          >
            <Plus className="w-4 h-4" />
            Novo Lead
          </motion.button>
        </div>
      </div>
    </div>
  )
}
