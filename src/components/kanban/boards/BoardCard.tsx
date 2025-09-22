'use client'

import { motion } from 'framer-motion'
import { HiCalendarDays, HiUsers, HiEllipsisVertical, HiStar, HiTrash, HiPencil } from 'react-icons/hi2'

interface Board {
  id: string
  name: string
  description: string
  color: string
  clientCount: number
  lastUpdated: string
  createdBy?: {
    name: string
    email: string
  } | string // Pode ser objeto ou string para compatibilidade
}

interface BoardCardProps {
  board: Board
  index: number
  onClick: () => void
  onDelete?: (boardId: string) => void
  onEdit?: (boardId: string) => void
}

export const BoardCard: React.FC<BoardCardProps> = ({ board, index, onClick, onDelete, onEdit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-800 transition-all cursor-pointer group overflow-hidden"
    >
      {/* Header colorido */}
      <div className={`h-32 bg-gradient-to-br ${board.color} p-6 relative`}>
        <div className="flex items-start justify-between text-white">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2 line-clamp-2">
              {board.name}
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <HiStar className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <HiEllipsisVertical className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Padrão decorativo */}
        <div className="absolute -bottom-1 -right-6 opacity-20">
          <div className="w-24 h-24 rounded-full bg-white/10" />
        </div>
        <div className="absolute -bottom-6 -right-12 opacity-10">
          <div className="w-32 h-32 rounded-full bg-white/10" />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {board.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm">
            <HiUsers className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">
              {board.clientCount} clientes
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <HiCalendarDays className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500 text-xs">
              {new Date(board.lastUpdated).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
              {(() => {
                if (!board.createdBy) return 'S'
                if (typeof board.createdBy === 'string') return board.createdBy.charAt(0).toUpperCase()
                return board.createdBy.name.charAt(0).toUpperCase()
              })()}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              por {(() => {
                if (!board.createdBy) return 'Sistema'
                if (typeof board.createdBy === 'string') return board.createdBy
                return board.createdBy.name
              })()}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {onEdit && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(board.id)
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                title="Editar quadro"
              >
                <HiPencil className="w-4 h-4" />
              </motion.button>
            )}
            
            {onDelete && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm(`Deseja deletar o quadro "${board.name}"?`)) {
                    onDelete(board.id)
                  }
                }}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 dark:text-red-400 rounded-xl transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-red-200 dark:hover:border-red-800"
                title="Deletar quadro"
              >
                <HiTrash className="w-4 h-4" />
              </motion.button>
            )}
            
            <motion.div
              whileHover={{ x: 3 }}
              className="text-orange-500 group-hover:text-orange-600 transition-colors ml-2"
            >
              <span className="text-sm font-medium">Abrir →</span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
