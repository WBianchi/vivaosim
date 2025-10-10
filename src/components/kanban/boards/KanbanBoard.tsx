'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { HiArrowLeft, HiPlus } from 'react-icons/hi2'
import { KanbanColumn } from './KanbanColumn'
import { getAuthToken } from '@/lib/auth-token'
import { CreateClientModal } from '@/components/clients/CreateClientModal'
import { ImportFromChatModal } from '../modals/ImportFromChatModal'

interface Board {
  id: string
  name: string
  description: string
  color: string
  clientCount: number
  lastUpdated: string
  createdBy: string
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  status: string
  value: number
  priority: 'low' | 'medium' | 'high'
  tags: string[]
  assignedTo?: string
  avatar?: string
  notes?: string
  tickets?: number
  contracts?: number
  quotes?: number
}

interface Column {
  id: string
  title: string
  color: string
  clients: Client[]
  order: number
  agentId?: string
}

interface KanbanBoardProps {
  board: Board
  onBack: () => void
  kanbanActions?: any
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ board, onBack, kanbanActions }) => {
  const [columns, setColumns] = useState<Column[]>([])
  const [loading, setLoading] = useState(true)
  const [agents, setAgents] = useState<any[]>([])
  const [showCreateClientModal, setShowCreateClientModal] = useState(false)
  const [showImportFromChatModal, setShowImportFromChatModal] = useState(false)
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null)

  useEffect(() => {
    fetchColumns()
    fetchAgents()
  }, [board.id])

  const fetchColumns = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch(`/api/boards/${board.id}/columns`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const defaultColors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#EF4444']
        
        // Para cada coluna, buscar os clientes com contagens
        const columnsWithClients = await Promise.all(
          (data.columns || []).map(async (col: Column, index: number) => {
            try {
              const clientsResponse = await fetch(`/api/kanban/columns/${col.id}/clients`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              })
              
              if (clientsResponse.ok) {
                const clientsData = await clientsResponse.json()
                return {
                  ...col,
                  color: col.color || defaultColors[index % defaultColors.length],
                  clients: clientsData.clients || []
                }
              }
            } catch (error) {
              console.error(`Erro ao buscar clientes da coluna ${col.id}:`, error)
            }
            
            return {
              ...col,
              color: col.color || defaultColors[index % defaultColors.length],
              clients: []
            }
          })
        )
        
        setColumns(columnsWithClients)
      }
    } catch (error) {
      console.error('Erro ao carregar colunas:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAgents = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch('/api/agents', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAgents(data.agents || [])
      }
    } catch (error) {
      console.error('Erro ao carregar agentes:', error)
    }
  }

  const handleUpdateColumn = async (columnId: string, updates: Partial<Column>) => {
    try {
      const token = getAuthToken()
      const response = await fetch(`/api/boards/${board.id}/columns/${columnId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      })
      
      if (response.ok) {
        setColumns(prev => prev.map(col => 
          col.id === columnId ? { ...col, ...updates } : col
        ))
      }
    } catch (error) {
      console.error('Erro ao atualizar coluna:', error)
    }
  }

  const handleCreateColumn = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch(`/api/boards/${board.id}/columns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Nova Coluna',
          color: '#6B7280',
          position: columns.length
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        // Garantir que a nova coluna tenha o array de clients
        const newColumn = {
          ...data.column,
          clients: [],
          order: columns.length
        }
        setColumns(prev => [...prev, newColumn])
      }
    } catch (error) {
      console.error('Erro ao criar coluna:', error)
    }
  }

  const handleAddClient = (columnId?: string) => {
    setSelectedColumnId(columnId || null)
    setShowCreateClientModal(true)
  }

  const handleImportFromChat = async (contactId: string, columnId: string) => {
    // Recarregar colunas após importar
    await fetchColumns()
  }

  const handleSaveClient = async (clientData: any) => {
    try {
      const token = getAuthToken()
      
      // Se não tiver coluna selecionada, usar a primeira coluna
      const columnId = selectedColumnId || (columns.length > 0 ? columns[0].id : null)
      
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...clientData,
          kanbanBoardId: board.id,
          kanbanColumnId: columnId
        })
      })
      
      if (response.ok) {
        setShowCreateClientModal(false)
        setSelectedColumnId(null)
        fetchColumns() // Recarregar colunas
      }
    } catch (error) {
      console.error('Erro ao criar cliente:', error)
    }
  }

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId)!
    const destColumn = columns.find(col => col.id === destination.droppableId)!
    const draggedClient = sourceColumn.clients.find(client => client.id === draggableId)!

    // Atualizar UI otimisticamente
    const newSourceClients = [...sourceColumn.clients]
    newSourceClients.splice(source.index, 1)

    const newDestClients = [...destColumn.clients]
    newDestClients.splice(destination.index, 0, draggedClient)

    setColumns(columns.map(col => {
      if (col.id === source.droppableId) {
        return { ...col, clients: newSourceClients }
      }
      if (col.id === destination.droppableId) {
        return { ...col, clients: newDestClients }
      }
      return col
    }))

    // Salvar no backend
    try {
      const token = getAuthToken()
      await fetch(`/api/boards/${board.id}/clients/${draggableId}/move`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          columnId: destination.droppableId,
          order: destination.index
        })
      })
    } catch (error) {
      console.error('Erro ao mover cliente:', error)
      // Reverter mudança em caso de erro
      fetchColumns()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header do Board */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <HiArrowLeft className="w-5 h-5" />
          </motion.button>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {board.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {board.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAddClient()}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors shadow-sm"
            >
              <HiPlus className="w-4 h-4" />
              Adicionar Cliente
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowImportFromChatModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              Importar do Chat
            </motion.button>
          </div>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-4 gap-4">
          {columns.map((column) => (
            <div 
              key={column.id} 
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border-l-4 border-r border-t border-b border-gray-200 dark:border-gray-700"
              style={{ borderLeftColor: column.color || '#6B7280' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{column.title}</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {column.clients?.length || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <div key={column.id} className="w-[420px]">
              <KanbanColumn 
                column={column}
                kanbanActions={kanbanActions}
                onUpdateColumn={handleUpdateColumn}
                agents={agents}
                onAddClient={() => handleAddClient(column.id)}
              />
            </div>
          ))}
          
          {/* Botão Adicionar Nova Coluna */}
          <div className="w-[420px]">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateColumn}
              className="w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500 rounded-2xl transition-all group bg-gray-50/50 dark:bg-gray-800/50 hover:bg-orange-50/50 dark:hover:bg-orange-900/10"
            >
              <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                <HiPlus className="w-8 h-8 mb-3" />
                <span className="font-medium">Adicionar Nova Coluna</span>
                <span className="text-sm text-gray-400">Clique para criar</span>
              </div>
            </motion.button>
          </div>
        </div>
      </DragDropContext>

      {/* Modal de Criar Cliente */}
      {showCreateClientModal && (
        <CreateClientModal
          onClose={() => {
            setShowCreateClientModal(false)
            setSelectedColumnId(null)
          }}
          onSave={handleSaveClient}
        />
      )}

      {/* Modal de Importar do Chat */}
      {showImportFromChatModal && (
        <ImportFromChatModal
          isOpen={showImportFromChatModal}
          onClose={() => setShowImportFromChatModal(false)}
          onImport={handleImportFromChat}
          boardId={board.id}
          columns={columns}
        />
      )}
    </div>
  )
}
