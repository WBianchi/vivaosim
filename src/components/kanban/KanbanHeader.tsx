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
}

export const KanbanHeader: React.FC<KanbanHeaderProps> = ({ onCreateBoard }) => {
  return (
    <div className="mb-8">
      {/* Título e Botões */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📋 Kanban Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie seus quadros de projetos e clientes com inteligência artificial
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Botão IA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl shadow-sm hover:shadow-md transition-all font-medium"
          >
            <HiSparkles className="w-5 h-5" />
            Criar com IA
          </motion.button>

          {/* Botão Criar Manual */}
          <motion.button
            onClick={onCreateBoard}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all font-medium"
          >
            <HiPlus className="w-5 h-5" />
            Novo Quadro
          </motion.button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar quadros..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </div>
        
        <select className="px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 min-w-40">
          <option>Todos os quadros</option>
          <option>Favoritos</option>
          <option>Recentes</option>
        </select>
      </div>
    </div>
  )
}
