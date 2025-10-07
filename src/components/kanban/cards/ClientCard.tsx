'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  Building2, 
  DollarSign, 
  User, 
  Users,
  Tag,
  Ticket,
  FileText,
  Calendar,
  Eye,
  Edit3,
  MoreVertical,
  Trash2,
  FileSignature,
  Target,
  MessageSquare,
  StickyNote,
  Bot
} from 'lucide-react'
import { ClientCardTooltip } from '../ClientCardTooltip'

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
  notes?: number
  tickets?: number
  contracts?: number
  quotes?: number
  quotesCount?: number
  schedules?: number
  agent?: {
    id: string
    name: string
    model: string
    status: string
  } | null
}

interface ClientCardProps {
  client: Client
  isDragging?: boolean
  onViewClient?: (client: Client) => void
  onEditClient?: (client: Client) => void
  onManageTags?: (client: Client) => void
  onManageNotes?: (client: Client) => void
  onAssignAgent?: (client: Client) => void
  onCreateTicket?: (client: Client) => void
  onCreateSchedule?: (client: Client) => void
  onCreateQuote?: (client: Client) => void
  onCreateContract?: (client: Client) => void
  onDeleteClient?: (client: Client) => void
}

export const ClientCard: React.FC<ClientCardProps> = ({ 
  client, 
  isDragging = false,
  onViewClient,
  onEditClient,
  onManageTags,
  onManageNotes,
  onAssignAgent,
  onCreateTicket,
  onCreateSchedule,
  onCreateQuote,
  onCreateContract,
  onDeleteClient
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const [showExpandedInfo, setShowExpandedInfo] = useState(false)
  const [expandedTimeout, setExpandedTimeout] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => {
      setShowTooltip(true)
    }, 800) // Delay de 800ms para mostrar
    setHoverTimeout(timeout)
    
    // Mostrar info expandida após 500ms
    const expandTimeout = setTimeout(() => {
      setShowExpandedInfo(true)
    }, 500)
    setExpandedTimeout(expandTimeout)
  }

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    if (expandedTimeout) {
      clearTimeout(expandedTimeout)
      setExpandedTimeout(null)
    }
    setShowTooltip(false)
    setShowExpandedInfo(false)
  }

  const handleEditItem = (type: string, item: any) => {
    console.log(`📝 Editando ${type}:`, item.title)
    // Aqui você pode abrir o bottom-sheet específico já preenchido
    switch (type) {
      case 'quotes':
        onCreateQuote?.(client) // Passa dados do item para preencher
        break
      case 'schedules':
        onCreateSchedule?.(client)
        break
      case 'tickets':
        onCreateTicket?.(client)
        break
      case 'contracts':
        onCreateContract?.(client)
        break
      case 'tags':
        onManageTags?.(client)
        break
    }
  }

  const handleDeleteItem = (type: string, itemId: string) => {
    console.log(`🗑️ Excluindo ${type} ID:`, itemId)
    // Aqui faria a chamada para a API de exclusão
  }

  const handleViewItem = (type: string, item: any) => {
    console.log(`👁️ Visualizando ${type}:`, item.title)
    // Aqui chama a função do kanban actions para abrir o bottom-sheet
    if (typeof onViewClient === 'function') {
      // Hack temporário: usar onViewClient como proxy para handleViewItem
      // @ts-ignore
      onViewClient.__handleViewItem?.(client, type, item)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      default: return 'bg-green-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LEAD_FRESCO': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      case 'LEAD_QUALIFICADO': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'EM_NEGOCIACAO': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
      case 'ORCAMENTO_ENVIADO': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      case 'CLIENTE_ATIVO': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onClick={() => onViewClient?.(client)}
        className={`
          bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 
          hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-800 transition-all cursor-pointer group relative
          ${isDragging ? 'shadow-2xl rotate-1 z-50 scale-102 border-orange-300' : ''}
        `}
      >
      {/* Header do Card */}
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between mb-3">
          {/* Avatar e Nome */}
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                {client.name.charAt(0).toUpperCase()}
              </div>
              {/* Pin de Prioridade */}
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${getPriorityColor(client.priority)}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                {client.name}
              </h4>
              {client.company && (
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {client.company}
                </p>
              )}
              {/* Status Badge */}
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(client.status)}`}>
                {client.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Menu de Ações */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Valor */}
        <div className="flex items-center gap-1 mb-3">
          <DollarSign className="w-4 h-4 text-green-500" />
          <span className="font-bold text-green-600 dark:text-green-400">
            {formatCurrency(client.value)}
          </span>
        </div>
      </div>

      {/* Informações de Contato */}
      <div className="px-4 space-y-2 mb-3">
        <div className="flex items-center gap-2 text-xs">
          <Mail className="w-3 h-3 text-gray-500" />
          <span className="text-gray-600 dark:text-gray-400 truncate">
            {client.email}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-xs">
          <Phone className="w-3 h-3 text-gray-500" />
          <span className="text-gray-600 dark:text-gray-400">
            {client.phone}
          </span>
        </div>

        {client.assignedTo && (
          <div className="flex items-center gap-2 text-xs">
            <User className="w-3 h-3 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {client.assignedTo}
            </span>
          </div>
        )}
      </div>

      {/* Tags */}
      {client.tags.length > 0 && (
        <div className="px-4 mb-3">
          <div className="flex flex-wrap gap-1">
            {client.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {client.tags.length > 3 && (
              <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                +{client.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer com Ações INLINE */}
      <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
        {/* Linha de ações inline */}
        <div className="flex items-center justify-between gap-1 mb-3">
          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                onManageTags?.(client)
              }}
              className="p-2 hover:bg-orange-50 dark:hover:bg-orange-900/10 text-orange-500 dark:text-orange-400 rounded-lg transition-all"
            >
              <Tag className="w-4 h-4" />
            </motion.button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Tags
            </div>
          </div>

          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                onCreateTicket?.(client)
              }}
              className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg transition-all relative"
            >
              <Ticket className="w-4 h-4" />
              {client.tickets > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {client.tickets > 9 ? '9+' : client.tickets}
                </span>
              )}
            </motion.button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Tickets {client.tickets > 0 && `(${client.tickets})`}
            </div>
          </div>

          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                onCreateSchedule?.(client)
              }}
              className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg transition-all relative"
            >
              <Calendar className="w-4 h-4" />
              {(client.schedules || 0) > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {client.schedules > 9 ? '9+' : client.schedules}
                </span>
              )}
            </motion.button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Agendamentos {(client.schedules || 0) > 0 && `(${client.schedules})`}
            </div>
          </div>

          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                onCreateQuote?.(client)
              }}
              className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg transition-all relative"
            >
              <DollarSign className="w-4 h-4" />
              {(client.quotesCount || client.quotes || 0) > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {(client.quotesCount || client.quotes) > 9 ? '9+' : (client.quotesCount || client.quotes)}
                </span>
              )}
            </motion.button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Orçamentos {(client.quotesCount || client.quotes || 0) > 0 && `(${client.quotesCount || client.quotes})`}
            </div>
          </div>

          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                onCreateContract?.(client)
              }}
              className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg transition-all relative"
            >
              <FileSignature className="w-4 h-4" />
              {(client.contracts || 0) > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {client.contracts > 9 ? '9+' : client.contracts}
                </span>
              )}
            </motion.button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Contratos {(client.contracts || 0) > 0 && `(${client.contracts})`}
            </div>
          </div>

          {/* Anotações */}
          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                onManageNotes?.(client)
              }}
              className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg transition-all relative"
            >
              <StickyNote className="w-4 h-4" />
              {(client.notes || 0) > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {client.notes > 9 ? '9+' : client.notes}
                </span>
              )}
            </motion.button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Anotações {(client.notes || 0) > 0 && `(${client.notes})`}
            </div>
          </div>

          {/* Chat */}
          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                // TODO: Abrir chat
              }}
              className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg transition-all"
            >
              <MessageSquare className="w-4 h-4" />
            </motion.button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Chat
            </div>
          </div>

          {/* Agente IA */}
          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                onAssignAgent?.(client)
              }}
              className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg transition-all relative"
            >
              <Bot className="w-4 h-4" />
              {client.agent && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  ✓
                </span>
              )}
            </motion.button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {client.agent ? `Agente: ${client.agent.name}` : 'Atribuir Agente IA'}
            </div>
          </div>

          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                onEditClient?.(client)
              }}
              className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg transition-all"
            >
              <Edit3 className="w-4 h-4" />
            </motion.button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Editar
            </div>
          </div>

          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                onDeleteClient?.(client)
              }}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 dark:text-red-400 rounded-lg transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Excluir
            </div>
          </div>
        </div>

        {/* Indicador de tempo */}
        <div className="text-center">
          <div className="text-xs text-gray-500">
            Atualizado há 2h
          </div>
        </div>
      </div>

        {/* Hover Effect Decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </motion.div>

      {/* Popover Expandido com Listas */}
      <AnimatePresence>
        {showExpandedInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-full ml-4 top-0 z-50 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4"
            onMouseEnter={() => setShowExpandedInfo(true)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Header */}
            <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-orange-500" />
                {client.name}
              </h4>
              <p className="text-xs text-gray-500 mt-1">{client.email}</p>
            </div>

            {/* Orçamentos */}
            {(client.quotesCount || 0) > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-green-500" />
                    Orçamentos ({client.quotesCount})
                  </span>
                </div>
                <div className="space-y-1.5">
                  {Array.from({ length: Math.min(client.quotesCount || 0, 3) }).map((_, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-xs">
                      <span className="text-gray-700 dark:text-gray-300 truncate">Orçamento #{idx + 1}</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency((client.value || 0) / (client.quotesCount || 1))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agendamentos */}
            {(client.schedules || 0) > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    Agendamentos ({client.schedules})
                  </span>
                </div>
                <div className="space-y-1.5">
                  {Array.from({ length: Math.min(client.schedules || 0, 3) }).map((_, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs">
                      <span className="text-gray-700 dark:text-gray-300 truncate">Reunião #{idx + 1}</span>
                      <span className="text-blue-600 dark:text-blue-400 text-[10px]">Hoje, 14:00</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tickets */}
            {(client.tickets || 0) > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Ticket className="w-3.5 h-3.5 text-red-500" />
                    Tickets ({client.tickets})
                  </span>
                </div>
                <div className="space-y-1.5">
                  {Array.from({ length: Math.min(client.tickets || 0, 3) }).map((_, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-xs">
                      <span className="text-gray-700 dark:text-gray-300 truncate">Suporte #{idx + 1}</span>
                      <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded text-[10px]">
                        Aberto
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contratos */}
            {(client.contracts || 0) > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <FileSignature className="w-3.5 h-3.5 text-purple-500" />
                    Contratos ({client.contracts})
                  </span>
                </div>
                <div className="space-y-1.5">
                  {Array.from({ length: Math.min(client.contracts || 0, 3) }).map((_, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-xs">
                      <span className="text-gray-700 dark:text-gray-300 truncate">Contrato #{idx + 1}</span>
                      <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded text-[10px]">
                        Ativo
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mensagem se não houver nada */}
            {!client.quotesCount && !client.schedules && !client.tickets && !client.contracts && (
              <div className="text-center py-6 text-gray-400">
                <p className="text-sm">Nenhum item registrado</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
