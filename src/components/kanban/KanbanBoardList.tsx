'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  HiPlus, 
  HiRectangleStack, 
  HiUsers, 
  HiBolt 
} from 'react-icons/hi2'
import { BoardCard } from './boards/BoardCard'
import { KanbanBoard } from './boards/KanbanBoard'

interface Board {
  id: string
  name: string
  description: string
  color: string
  clientCount: number
  lastUpdated: string
  createdBy: string
}

interface KanbanBoardListProps {
  kanbanActions?: any
  onCreateBoard?: () => void
}

export const KanbanBoardList: React.FC<KanbanBoardListProps> = ({ kanbanActions, onCreateBoard }) => {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null)
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)

  // Buscar boards da API
  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    try {
      const response = await fetch('/api/boards')
      const data = await response.json()
      // Mapear _count.clients para clientCount
      const mappedBoards = (data.boards || []).map((board: any) => ({
        ...board,
        clientCount: board._count?.clients || 0,
        columnsCount: board._count?.columns || 0
      }))
      setBoards(mappedBoards)
    } catch (error) {
      console.error('❌ Erro ao carregar boards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBoard = async (boardId: string) => {
    try {
      const response = await fetch(`/api/boards/${boardId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        console.log('✅ Board deletado com sucesso')
        fetchBoards() // Recarregar lista
      } else {
        alert('❌ Erro ao deletar quadro')
      }
    } catch (error) {
      console.error('❌ Erro ao deletar board:', error)
      alert('❌ Erro ao deletar quadro')
    }
  }

  const handleUpdateName = async (boardId: string, newName: string) => {
    try {
      const response = await fetch(`/api/boards/${boardId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName })
      })
      
      if (response.ok) {
        // Atualizar localmente sem recarregar tudo
        setBoards(prev => prev.map(board => 
          board.id === boardId ? { ...board, name: newName } : board
        ))
      } else {
        alert('❌ Erro ao atualizar nome')
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar nome:', error)
      alert('❌ Erro ao atualizar nome')
    }
  }

  if (selectedBoard) {
    const board = boards.find(b => b.id === selectedBoard)
    if (!board) return null
    
    return (
      <KanbanBoard 
        board={board}
        onBack={() => setSelectedBoard(null)}
        kanbanActions={kanbanActions}
      />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Quadros</p>
              <p className="text-3xl font-bold text-gray-900">{boards.length}</p>
            </div>
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center">
              <HiRectangleStack className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Clientes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {boards.reduce((acc, board) => acc + (board.clientCount || 0), 0)}
              </p>
            </div>
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center">
              <HiUsers className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Quadros Ativos</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{boards.length}</p>
            </div>
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center">
              <HiBolt className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lista de Quadros */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Seus Quadros
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board, index) => (
            <BoardCard 
              key={board.id}
              board={board}
              index={index}
              onClick={() => setSelectedBoard(board.id)}
              onDelete={handleDeleteBoard}
              onUpdateName={handleUpdateName}
            />
          ))}
          
          {/* Card para adicionar novo quadro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={onCreateBoard}
            className="bg-white dark:bg-gray-900 p-8 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-colors cursor-pointer group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                >
                  <HiPlus className="w-8 h-8 text-gray-500 group-hover:text-orange-600" />
                </motion.div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Criar Novo Quadro
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Configure um novo quadro kanban para seu projeto
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
