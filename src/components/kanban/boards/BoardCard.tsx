'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiTrash2, FiColumns, FiFileText, FiCalendar, FiTag, FiAlertCircle } from 'react-icons/fi'
import { HiOutlineDocumentText } from 'react-icons/hi2'

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
  } | string
  columnsCount?: number
  quotesCount?: number
  appointmentsCount?: number
  tagsCount?: number
  ticketsCount?: number
  contractsCount?: number
}

interface BoardCardProps {
  board: Board
  index: number
  onClick: () => void
  onDelete?: (boardId: string) => void
  onUpdateName?: (boardId: string, newName: string) => void
}

export const BoardCard: React.FC<BoardCardProps> = ({ board, index, onClick, onDelete, onUpdateName }) => {
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(board.name)

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditingName(true)
  }

  const handleNameBlur = () => {
    setIsEditingName(false)
    if (editedName.trim() && editedName !== board.name) {
      onUpdateName?.(board.id, editedName.trim())
    } else {
      setEditedName(board.name)
    }
  }

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameBlur()
    } else if (e.key === 'Escape') {
      setEditedName(board.name)
      setIsEditingName(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''
      return date.toLocaleDateString('pt-BR')
    } catch {
      return ''
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-700 transition-all cursor-pointer group overflow-hidden"
    >
      {/* Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4">
            {isEditingName ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleNameBlur}
                onKeyDown={handleNameKeyDown}
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={(e) => e.stopPropagation()}
                autoFocus
                className="text-xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-orange-500 outline-none w-full pb-1"
              />
            ) : (
              <h3 
                onDoubleClick={handleDoubleClick}
                onClick={(e) => e.stopPropagation()}
                className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 hover:text-orange-600 transition-colors cursor-text"
                title="Duplo clique para editar"
              >
                {board.name}
              </h3>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {board.description}
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              if (confirm(`Deseja excluir o quadro "${board.name}"?`)) {
                onDelete?.(board.id)
              }
            }}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 rounded-xl transition-all opacity-0 group-hover:opacity-100"
            title="Excluir"
          >
            <FiTrash2 className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <FiColumns className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{board.columnsCount || 0}</p>
                <p className="text-xs text-gray-500">colunas</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                <FiUsers className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{board.clientCount}</p>
                <p className="text-xs text-gray-500">clientes</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                <FiFileText className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{board.quotesCount || 0}</p>
                <p className="text-xs text-gray-500">orçamentos</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <FiCalendar className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{board.appointmentsCount || 0}</p>
                <p className="text-xs text-gray-500">agendamentos</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <HiOutlineDocumentText className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{board.contractsCount || 0}</p>
                <p className="text-xs text-gray-500">contratos</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center">
                <FiTag className="w-4 h-4 text-pink-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{board.tagsCount || 0}</p>
                <p className="text-xs text-gray-500">tags</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          {formatDate(board.lastUpdated) ? (
            <span className="text-xs text-gray-500">
              Atualizado {formatDate(board.lastUpdated)}
            </span>
          ) : (
            <span className="text-xs text-gray-500">Novo quadro</span>
          )}

          <motion.div
            whileHover={{ x: 3 }}
            className="flex items-center gap-1.5 text-orange-500 group-hover:text-orange-600 transition-colors"
          >
            <span className="text-sm font-medium">Abrir</span>
            <span>→</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
