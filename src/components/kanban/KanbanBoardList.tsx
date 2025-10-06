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
  columnsCount?: number
  quotesCount?: number
  appointmentsCount?: number
  contractsCount?: number
  ticketsCount?: number
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
        columnsCount: board._count?.columns || 0,
        quotesCount: board._count?.quotes || board.quotesCount || 0,
        appointmentsCount: board._count?.appointments || board.appointmentsCount || 0,
        contractsCount: board._count?.contracts || board.contractsCount || 0,
        ticketsCount: board._count?.tickets || board.ticketsCount || 0
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
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={onCreateBoard}
            className="group relative flex h-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center transition-all hover:-translate-y-1 hover:border-orange-400 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors group-hover:bg-orange-500 group-hover:text-white dark:bg-gray-800">
                <HiPlus className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Criar Novo Quadro
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Configure um novo quadro Kanban para o seu projeto
                </p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  )
}
