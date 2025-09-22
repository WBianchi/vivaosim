'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { HiArrowLeft, HiPlus, HiCog6Tooth, HiUsers } from 'react-icons/hi2'
import { KanbanColumn } from './KanbanColumn'
import { ClientCard } from '../cards/ClientCard'

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
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@empresa.com',
    phone: '(11) 99999-1111',
    company: 'Tech Solutions',
    status: 'LEAD_QUALIFICADO',
    value: 15000,
    priority: 'high',
    tags: ['VIP', 'Tech'],
    assignedTo: 'João Silva',
    tickets: 2,
    contracts: 0,
    quotes: 1
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao@startup.com',
    phone: '(11) 99999-2222',
    company: 'StartupXYZ',
    status: 'EM_NEGOCIACAO',
    value: 8500,
    priority: 'medium',
    tags: ['Startup'],
    assignedTo: 'Ana Costa',
    tickets: 0,
    contracts: 1,
    quotes: 2
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana@loja.com',
    phone: '(11) 99999-3333',
    company: 'Loja Online',
    status: 'ORCAMENTO_ENVIADO',
    value: 12000,
    priority: 'high',
    tags: ['E-commerce'],
    assignedTo: 'Maria Santos',
    tickets: 1,
    contracts: 0,
    quotes: 1
  }
]

const mockColumns: Column[] = [
  {
    id: 'leads',
    title: 'Novos Leads',
    color: 'from-blue-500 to-cyan-500',
    clients: [mockClients[0]]
  },
  {
    id: 'negotiation',
    title: 'Em Negociação',
    color: 'from-orange-500 to-yellow-500',
    clients: [mockClients[1]]
  },
  {
    id: 'proposal',
    title: 'Proposta Enviada',
    color: 'from-purple-500 to-pink-500',
    clients: [mockClients[2]]
  },
  {
    id: 'closed',
    title: 'Fechados',
    color: 'from-green-500 to-emerald-500',
    clients: []
  }
]

interface KanbanBoardProps {
  board: Board
  onBack: () => void
  kanbanActions?: any
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ board, onBack, kanbanActions }) => {
  const [columns, setColumns] = useState<Column[]>(mockColumns)

  const handleUpdateColumn = (columnId: string, updates: Partial<Column>) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId 
        ? { ...col, ...updates }
        : col
    ))
    console.log('📝 Atualizando coluna:', columnId, updates)
  }

  const handleCreateColumn = () => {
    const newColumn: Column = {
      id: `column-${Date.now()}`,
      title: 'Nova Coluna',
      color: 'from-gray-500 to-gray-600',
      clients: []
    }
    setColumns(prev => [...prev, newColumn])
    console.log('➕ Nova coluna criada:', newColumn.title)
  }

  const onDragEnd = (result: DropResult) => {
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

    // Remover cliente da coluna origem
    const newSourceClients = [...sourceColumn.clients]
    newSourceClients.splice(source.index, 1)

    // Adicionar cliente na coluna destino
    const newDestClients = [...destColumn.clients]
    newDestClients.splice(destination.index, 0, draggedClient)

    // Atualizar estado
    setColumns(columns.map(col => {
      if (col.id === source.droppableId) {
        return { ...col, clients: newSourceClients }
      }
      if (col.id === destination.droppableId) {
        return { ...col, clients: newDestClients }
      }
      return col
    }))

    console.log(`Cliente ${draggedClient.name} movido de ${sourceColumn.title} para ${destColumn.title}`)
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
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <HiUsers className="w-4 h-4" />
              Colaboradores
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <HiCog6Tooth className="w-4 h-4" />
              Configurar
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <HiPlus className="w-4 h-4" />
              Adicionar Cliente
            </motion.button>
          </div>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-4 gap-4">
          {columns.map((column) => (
            <div key={column.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{column.title}</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {column.clients.length}
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
            <div key={column.id} className="min-w-80">
              <KanbanColumn 
                column={column}
                kanbanActions={kanbanActions}
                onUpdateColumn={handleUpdateColumn}
              />
            </div>
          ))}
          
          {/* Botão Adicionar Nova Coluna */}
          <div className="min-w-80">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateColumn}
              className="w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500 rounded-3xl transition-all group bg-gray-50/50 dark:bg-gray-800/50 hover:bg-orange-50/50 dark:hover:bg-orange-900/10"
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
    </div>
  )
}
