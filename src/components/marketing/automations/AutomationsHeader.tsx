'use client'

import { motion } from 'framer-motion'
import { Workflow, Play, Pause, Save } from 'lucide-react'

interface AutomationsHeaderProps {
  selectedAutomation: any
  isRunning: boolean
  onToggleRun: () => void
}

export const AutomationsHeader: React.FC<AutomationsHeaderProps> = ({
  selectedAutomation, isRunning, onToggleRun
}) => {
  return (
    <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Workflow className="w-6 h-6 text-purple-600" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {selectedAutomation?.name || 'Nova Automação'}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleRun}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
            isRunning 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Pausar' : 'Executar'}
        </motion.button>
      </div>
    </div>
  )
}
