'use client'

import { motion } from 'framer-motion'
import { 
  HiPlus, 
  HiSparkles, 
  HiMagnifyingGlass, 
  HiAdjustmentsHorizontal 
} from 'react-icons/hi2'

interface KanbanHeaderProps {
  onCreateBoard: () => void
  onCreateWithAI?: () => void
}

export const KanbanHeader: React.FC<KanbanHeaderProps> = ({ onCreateBoard, onCreateWithAI }) => {
  return (
    <div className="mb-8">
      {/* Título e Botões */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Kanban
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie seus quadros de projetos e clientes
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Botão IA */}
          <motion.button
            onClick={onCreateWithAI || onCreateBoard}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors shadow-sm"
          >
            <HiSparkles className="w-4 h-4" />
            Criar com IA
          </motion.button>

          {/* Botão Criar Manual */}
          <motion.button
            onClick={onCreateBoard}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <HiPlus className="w-4 h-4" />
            Novo Quadro
          </motion.button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar quadros..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </div>
        
        <select className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 min-w-40">
          <option>Todos os quadros</option>
          <option>Favoritos</option>
          <option>Recentes</option>
        </select>
      </div>
    </div>
  )
}
