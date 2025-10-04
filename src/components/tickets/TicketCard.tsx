'use client'

import { motion } from 'framer-motion'
import { 
  Ticket, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  XCircle,
  User, 
  Calendar,
  MessageSquare,
  Paperclip,
  MoreVertical,
  Eye,
  Edit3,
  Tag
} from 'lucide-react'

interface TicketCardProps {
  ticket: any
  index: number
  onClick: () => void
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  index,
  onClick
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const formatRelativeTime = (date: string) => {
    const now = new Date()
    const ticketDate = new Date(date)
    const diffTime = Math.abs(now.getTime() - ticketDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Hoje'
    if (diffDays === 2) return 'Ontem'
    if (diffDays <= 7) return `${diffDays - 1} dias atrás`
    return formatDate(date)
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open':
        return {
          label: 'Aberto',
          icon: Ticket,
          color: 'text-blue-600',
          bg: 'bg-blue-100',
          border: 'border-blue-200'
        }
      case 'in_progress':
        return {
          label: 'Em Andamento',
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100',
          border: 'border-yellow-200'
        }
      case 'resolved':
        return {
          label: 'Resolvido',
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100',
          border: 'border-green-200'
        }
      case 'closed':
        return {
          label: 'Fechado',
          icon: XCircle,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          border: 'border-gray-200'
        }
      default:
        return {
          label: 'Desconhecido',
          icon: Ticket,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          border: 'border-gray-200'
        }
    }
  }

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return {
          label: 'Urgente',
          color: 'text-red-600',
          bg: 'bg-red-100',
          icon: AlertTriangle
        }
      case 'high':
        return {
          label: 'Alta',
          color: 'text-orange-600',
          bg: 'bg-orange-100',
          icon: AlertTriangle
        }
      case 'medium':
        return {
          label: 'Média',
          color: 'text-yellow-600',
          bg: 'bg-yellow-100',
          icon: Clock
        }
      case 'low':
        return {
          label: 'Baixa',
          color: 'text-green-600',
          bg: 'bg-green-100',
          icon: Clock
        }
      default:
        return {
          label: 'Não definida',
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          icon: Clock
        }
    }
  }

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'technical':
        return { label: 'Técnico', color: 'text-blue-600' }
      case 'billing':
        return { label: 'Faturamento', color: 'text-green-600' }
      case 'general':
        return { label: 'Geral', color: 'text-gray-600' }
      case 'feature_request':
        return { label: 'Recurso', color: 'text-purple-600' }
      case 'bug_report':
        return { label: 'Bug', color: 'text-red-600' }
      case 'account':
        return { label: 'Conta', color: 'text-indigo-600' }
      default:
        return { label: 'Outros', color: 'text-gray-600' }
    }
  }

  const statusConfig = getStatusConfig(ticket.status)
  const priorityConfig = getPriorityConfig(ticket.priority)
  const categoryConfig = getCategoryConfig(ticket.category)

  const isUrgent = ticket.priority === 'urgent'
  const isOverdue = ticket.status === 'open' && new Date(ticket.createdAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 ${statusConfig.border} hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group ${
        isUrgent ? 'ring-2 ring-red-200 dark:ring-red-800' : ''
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${statusConfig.bg} flex items-center justify-center shadow-sm`}>
              <statusConfig.icon className={`w-6 h-6 ${statusConfig.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                  {ticket.id}
                </span>
                <span className={`px-2 py-0.5 ${statusConfig.bg} ${statusConfig.color} rounded-full text-xs font-medium`}>
                  {statusConfig.label}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-1">
                {ticket.title}
              </h3>
            </div>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                console.log('⚙️ Mais opções:', ticket.id)
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Prioridade e Categoria */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`flex items-center gap-1 px-2 py-1 ${priorityConfig.bg} ${priorityConfig.color} rounded-lg text-xs font-medium`}>
            <priorityConfig.icon className="w-3 h-3" />
            {priorityConfig.label}
          </span>
          <span className={`px-2 py-1 bg-gray-100 dark:bg-gray-700 ${categoryConfig.color} rounded-lg text-xs font-medium`}>
            {categoryConfig.label}
          </span>
          {isOverdue && (
            <span className="px-2 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-medium">
              Atrasado
            </span>
          )}
        </div>

        {/* Descrição */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {ticket.description}
        </p>

        {/* Contato */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            {ticket.contact?.name?.charAt(0).toUpperCase() || 'C'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
              {ticket.contact?.name || 'Sem contato'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {ticket.contact?.email || ticket.contact?.phone || 'Sem informações'}
            </p>
          </div>
        </div>

        {/* Agente */}
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {ticket.assignedTo ? ticket.assignedTo.name : 'Não atribuído'}
          </span>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MessageSquare className="w-3 h-3 text-gray-600" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Comentários</span>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {ticket.comments?.length || 0}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Paperclip className="w-3 h-3 text-gray-600" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Anexos</span>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {ticket.attachments?.length || 0}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="w-3 h-3 text-gray-600" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Criado</span>
            </div>
            <p className="text-xs font-medium text-gray-900 dark:text-white">
              {formatRelativeTime(ticket.createdAt)}
            </p>
          </div>
        </div>

        {/* Tags */}
        {ticket.tags && ticket.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {ticket.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs"
              >
                <Tag className="w-2 h-2" />
                {tag}
              </span>
            ))}
            {ticket.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                +{ticket.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Alerta para tickets urgentes */}
        {isUrgent && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700 dark:text-red-300 font-medium">
                Ticket Urgente - Requer Atenção Imediata
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 pb-6">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
            className="flex-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-3 h-3" />
            Ver Detalhes
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation()
              console.log('✏️ Editar ticket:', ticket.id)
            }}
            className="px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Edit3 className="w-3 h-3" />
            Editar
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
