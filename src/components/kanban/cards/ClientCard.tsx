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
  Target
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
  notes?: string
  tickets?: number
  contracts?: number
  quotes?: number
}

interface ClientCardProps {
  client: Client
  isDragging?: boolean
  onViewClient?: (client: Client) => void
  onEditClient?: (client: Client) => void
  onManageTags?: (client: Client) => void
  onCreateTicket?: (client: Client) => void
  onCreateSchedule?: (client: Client) => void
  onCreateQuote?: (client: Client) => void
  onCreateContract?: (client: Client) => void
  onChangeQueue?: (client: Client) => void
  onDeleteClient?: (client: Client) => void
}

export const ClientCard: React.FC<ClientCardProps> = ({ 
  client, 
  isDragging = false,
  onViewClient,
  onEditClient,
  onManageTags,
  onCreateTicket,
  onCreateSchedule,
  onCreateQuote,
  onCreateContract,
  onChangeQueue,
  onDeleteClient
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => {
      setShowTooltip(true)
    }, 800) // Delay de 800ms para mostrar
    setHoverTimeout(timeout)
  }

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setShowTooltip(false)
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

      {/* Estatísticas (Tickets, Contratos, Orçamentos) */}
      <div className="px-4 mb-3">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Ticket className="w-3 h-3 text-red-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {client.tickets || 0}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3 text-purple-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {client.contracts || 0}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-blue-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {client.quotes || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Footer com Ações INLINE */}
      <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
        {/* Linha de ações inline */}
        <div className="flex items-center justify-between gap-1 mb-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onManageTags?.(client)
            }}
            className="p-2 hover:bg-orange-50 dark:hover:bg-orange-900/10 text-orange-500 dark:text-orange-400 rounded-lg transition-all"
            title="Tags"
          >
            <Tag className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onCreateTicket?.(client)
            }}
            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg transition-all"
            title="Tickets"
          >
            <Ticket className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onCreateSchedule?.(client)
            }}
            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg transition-all"
            title="Agendamentos"
          >
            <Calendar className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onCreateQuote?.(client)
            }}
            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg transition-all"
            title="Orçamentos"
          >
            <DollarSign className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onCreateContract?.(client)
            }}
            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg transition-all"
            title="Contratos"
          >
            <FileSignature className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onEditClient?.(client)
            }}
            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg transition-all"
            title="Editar"
          >
            <Edit3 className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onDeleteClient?.(client)
            }}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 dark:text-red-400 rounded-lg transition-all"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
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

      {/* Tooltip com listagem detalhada */}
      <AnimatePresence>
        {showTooltip && (
          <ClientCardTooltip
            client={client}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onViewItem={handleViewItem}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
