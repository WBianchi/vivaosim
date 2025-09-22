'use client'

import { useState } from 'react'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  MoreHorizontal, 
  Palette, 
  Users, 
  Check,
  X,
  Edit3,
  User
} from 'lucide-react'
import { ClientCard } from '../cards/ClientCard'

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
  assignedAgent?: {
    id: string
    name: string
    active: boolean
  }
}

interface KanbanColumnProps {
  column: Column
  kanbanActions?: any
  onUpdateColumn?: (columnId: string, updates: Partial<Column>) => void
}

const colorOptions = [
  { name: 'Laranja', value: 'from-orange-500 to-orange-600' },
  { name: 'Azul', value: 'from-blue-500 to-blue-600' },
  { name: 'Verde', value: 'from-green-500 to-green-600' },
  { name: 'Roxo', value: 'from-purple-500 to-purple-600' },
  { name: 'Rosa', value: 'from-pink-500 to-pink-600' },
  { name: 'Vermelho', value: 'from-red-500 to-red-600' },
  { name: 'Ciano', value: 'from-cyan-500 to-cyan-600' },
  { name: 'Amarelo', value: 'from-yellow-500 to-yellow-600' },
  { name: 'Índigo', value: 'from-indigo-500 to-indigo-600' },
  { name: 'Cinza', value: 'from-gray-500 to-gray-600' }
]

const agentOptions = [
  { id: '1', name: 'João Silva', active: true },
  { id: '2', name: 'Maria Santos', active: false },
  { id: '3', name: 'Pedro Costa', active: true },
  { id: '4', name: 'Ana Lima', active: false }
]

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, kanbanActions, onUpdateColumn }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(column.title)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showAgentPicker, setShowAgentPicker] = useState(false)

  const handleTitleSave = () => {
    if (editedTitle.trim() && editedTitle !== column.title) {
      onUpdateColumn?.(column.id, { title: editedTitle.trim() })
      console.log('💾 Salvando título da coluna:', editedTitle.trim())
    }
    setIsEditingTitle(false)
  }

  const handleColorChange = (color: string) => {
    onUpdateColumn?.(column.id, { color })
    console.log('🎨 Mudando cor da coluna:', color)
    setShowColorPicker(false)
  }

  const handleAgentChange = (agent: any) => {
    onUpdateColumn?.(column.id, { assignedAgent: agent })
    console.log('👤 Atribuindo agente à coluna:', agent.name)
    setShowAgentPicker(false)
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Header da Coluna */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-5 rounded-t-3xl bg-gradient-to-r ${column.color} shadow-sm relative`}
      >
        <div className="flex items-center justify-between text-white mb-2">
          {/* Título Editável */}
          {isEditingTitle ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSave()
                  if (e.key === 'Escape') {
                    setEditedTitle(column.title)
                    setIsEditingTitle(false)
                  }
                }}
                className="bg-white/20 border border-white/30 rounded-lg px-3 py-1 text-white placeholder-white/70 font-semibold text-lg flex-1"
                placeholder="Nome da coluna"
                autoFocus
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleTitleSave}
                className="p-1 hover:bg-white/20 rounded"
              >
                <Check className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setEditedTitle(column.title)
                  setIsEditingTitle(false)
                }}
                className="p-1 hover:bg-white/20 rounded"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          ) : (
            <h3 
              className="font-semibold text-lg cursor-pointer hover:bg-white/10 px-2 py-1 rounded transition-colors"
              onDoubleClick={() => setIsEditingTitle(true)}
              title="Duplo clique para editar"
            >
              {column.title}
            </h3>
          )}
          
          <div className="flex items-center gap-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
              {column.clients.length}
            </span>
            
            {/* Botão de Cor */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title="Trocar cor"
            >
              <Palette className="w-4 h-4" />
            </motion.button>
            
            {/* Botão de Agente */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowAgentPicker(!showAgentPicker)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title="Atribuir agente"
            >
              <User className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Agente Atribuído */}
        {column.assignedAgent && (
          <div className="flex items-center gap-2 text-white/90 text-sm">
            <User className="w-3 h-3" />
            <span>{column.assignedAgent.name}</span>
            <div className={`w-2 h-2 rounded-full ${column.assignedAgent.active ? 'bg-green-400' : 'bg-gray-400'}`} />
          </div>
        )}
      </motion.div>

      {/* Color Picker Dropdown */}
      {showColorPicker && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 left-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50"
        >
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Escolher Cor
          </h4>
          <div className="grid grid-cols-5 gap-2">
            {colorOptions.map((color) => (
              <motion.button
                key={color.value}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleColorChange(color.value)}
                className={`w-8 h-8 rounded-full bg-gradient-to-r ${color.value} border-2 ${
                  column.color === color.value ? 'border-gray-900 dark:border-white' : 'border-transparent'
                }`}
                title={color.name}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Agent Picker Dropdown */}
      {showAgentPicker && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50 min-w-48"
        >
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Atribuir Agente
          </h4>
          <div className="space-y-2">
            <button
              onClick={() => handleAgentChange(null)}
              className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
            >
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                <X className="w-3 h-3" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Remover agente</span>
            </button>
            {agentOptions.map((agent) => (
              <button
                key={agent.id}
                onClick={() => handleAgentChange(agent)}
                className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs font-semibold">
                  {agent.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {agent.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${agent.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-xs text-gray-500">
                      {agent.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Área Droppable */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 p-5 space-y-3 rounded-b-3xl transition-all min-h-96 border-x border-b border-gray-100 dark:border-gray-800
              ${snapshot.isDraggingOver 
                ? 'bg-orange-50/50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800' 
                : 'bg-white dark:bg-gray-900'
              }
            `}
          >
            <AnimatePresence>
              {column.clients.map((client, index) => (
                <Draggable
                  key={client.id}
                  draggableId={client.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ClientCard 
                        client={client}
                        isDragging={snapshot.isDragging}
                        onViewClient={(() => {
                          const viewClient = kanbanActions?.handleViewClient
                          // @ts-ignore - Adiciona a função de visualizar item como propriedade
                          if (viewClient) viewClient.__handleViewItem = kanbanActions?.handleViewItem
                          return viewClient
                        })()}
                        onEditClient={kanbanActions?.handleEditClient}
                        onManageTags={kanbanActions?.handleManageTags}
                        onCreateTicket={kanbanActions?.handleCreateTicket}
                        onCreateSchedule={kanbanActions?.handleCreateSchedule}
                        onCreateQuote={kanbanActions?.handleCreateQuote}
                        onCreateContract={kanbanActions?.handleCreateContract}
                        onChangeQueue={kanbanActions?.handleChangeQueue}
                        onDeleteClient={kanbanActions?.handleDeleteClient}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </AnimatePresence>
            {provided.placeholder}
            
            {/* Botão Adicionar Cliente */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 rounded-2xl transition-all group bg-gray-50/50 dark:bg-gray-800/50 hover:bg-orange-50/50 dark:hover:bg-orange-900/10"
            >
              <div className="flex flex-col items-center text-gray-500 dark:text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                <Plus className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Adicionar Cliente</span>
              </div>
            </motion.button>
          </div>
        )}
      </Droppable>
    </div>
  )
}
