'use client'

import { motion } from 'framer-motion'
import { Save, TestTube, Copy } from 'lucide-react'

interface AutomationsToolbarProps {
  onSave: () => void
  onTest: () => void
  onDuplicate: () => void
}

export const AutomationsToolbar: React.FC<AutomationsToolbarProps> = ({
  onSave, onTest, onDuplicate
}) => {
  return (
    <div className="h-12 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center gap-3">
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={onSave}
        className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
      >
        <Save className="w-3 h-3" />
        Salvar
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={onTest}
        className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
      >
        <TestTube className="w-3 h-3" />
        Testar
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={onDuplicate}
        className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
      >
        <Copy className="w-3 h-3" />
        Duplicar
      </motion.button>
    </div>
  )
}
