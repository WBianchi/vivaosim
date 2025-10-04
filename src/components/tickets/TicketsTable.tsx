'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronUp, 
  ChevronDown,
  Eye,
  Edit3,
  MoreVertical,
  Ticket,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  MessageSquare,
  Paperclip
} from 'lucide-react'

interface TicketsTableProps {
  tickets: any[]
  onTicketSelect: (ticket: any) => void
}

type SortField = 'id' | 'title' | 'client' | 'priority' | 'status' | 'agent' | 'createdAt'
type SortDirection = 'asc' | 'desc'

export const TicketsTable: React.FC<TicketsTableProps> = ({
  tickets,
  onTicketSelect
}) => {
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedTickets = [...tickets].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortField) {
      case 'id':
        aValue = a.id.toLowerCase()
        bValue = b.id.toLowerCase()
        break
      case 'title':
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      case 'client':
        aValue = a.contact?.name?.toLowerCase() || 'zzz'
        bValue = b.contact?.name?.toLowerCase() || 'zzz'
        break
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
        bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
        break
      case 'status':
        aValue = a.status
        bValue = b.status
        break
      case 'agent':
        aValue = a.assignedTo?.name?.toLowerCase() || 'zzz'
        bValue = b.assignedTo?.name?.toLowerCase() || 'zzz'
        break
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
        break
      default:
        return 0
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1
    }
    return 0
  })

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
          bg: 'bg-blue-100'
        }
      case 'in_progress':
        return {
          label: 'Em Andamento',
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100'
        }
      case 'resolved':
        return {
          label: 'Resolvido',
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100'
        }
      case 'closed':
        return {
          label: 'Fechado',
          icon: XCircle,
          color: 'text-gray-600',
          bg: 'bg-gray-100'
        }
      default:
        return {
          label: 'Desconhecido',
          icon: Ticket,
          color: 'text-gray-600',
          bg: 'bg-gray-100'
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

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-orange-600 transition-colors"
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? 
          <ChevronUp className="w-4 h-4" /> : 
          <ChevronDown className="w-4 h-4" />
      )}
    </button>
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="id">Ticket</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="client">Contato</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="priority">Prioridade</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="status">Status</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                Categoria
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="agent">Agente</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                Atividade
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="createdAt">Criado</SortButton>
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {sortedTickets.map((ticket, index) => {
              const statusConfig = getStatusConfig(ticket.status)
              const priorityConfig = getPriorityConfig(ticket.priority)
              const categoryConfig = getCategoryConfig(ticket.category)
              const isUrgent = ticket.priority === 'urgent'

              return (
                <motion.tr
                  key={ticket.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                    isUrgent ? 'bg-red-50 dark:bg-red-900/10' : ''
                  }`}
                  onClick={() => onTicketSelect(ticket)}
                >
                  {/* Ticket */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${statusConfig.bg} rounded-lg flex items-center justify-center`}>
                        <statusConfig.icon className={`w-5 h-5 ${statusConfig.color}`} />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                          {ticket.id}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                          {ticket.title}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contato */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                        {ticket.contact?.name?.charAt(0).toUpperCase() || 'C'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {ticket.contact?.name || 'Sem contato'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {ticket.contact?.email || ticket.contact?.phone || 'Sem informações'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Prioridade */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${priorityConfig.bg} ${priorityConfig.color}`}>
                      <priorityConfig.icon className="w-3 h-3" />
                      {priorityConfig.label}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      <statusConfig.icon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                  </td>

                  {/* Categoria */}
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${categoryConfig.color}`}>
                      {categoryConfig.label}
                    </span>
                  </td>

                  {/* Agente */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {ticket.assignedTo ? ticket.assignedTo.name : 'Não atribuído'}
                      </span>
                    </div>
                  </td>

                  {/* Atividade */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{ticket.comments?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Paperclip className="w-3 h-3" />
                        <span>{ticket.attachments?.length || 0}</span>
                      </div>
                    </div>
                  </td>

                  {/* Criado */}
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {formatDate(ticket.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatRelativeTime(ticket.createdAt)}
                      </p>
                    </div>
                  </td>

                  {/* Ações */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onTicketSelect(ticket)
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('✏️ Editar ticket:', ticket.id)
                        }}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Editar ticket"
                      >
                        <Edit3 className="w-4 h-4 text-blue-600" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('⚙️ Mais opções:', ticket.id)
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        title="Mais opções"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
