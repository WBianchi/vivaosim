'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Ticket, 
  User, 
  Calendar, 
  Clock,
  Edit3,
  MessageSquare,
  Paperclip,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Tag,
  Download,
  Send,
  UserCheck
} from 'lucide-react'

interface TicketDetailsModalProps {
  ticket: any
  onClose: () => void
  onEdit?: () => void
}

export const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
  ticket,
  onClose,
  onEdit
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-BR')
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
        return { label: 'Solicitação de Recurso', color: 'text-purple-600' }
      case 'bug_report':
        return { label: 'Relatório de Bug', color: 'text-red-600' }
      case 'account':
        return { label: 'Conta', color: 'text-indigo-600' }
      default:
        return { label: 'Outros', color: 'text-gray-600' }
    }
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      console.log('💬 Adicionando comentário:', newComment)
      setNewComment('')
    }
  }

  const statusConfig = getStatusConfig(ticket.status)
  const priorityConfig = getPriorityConfig(ticket.priority)
  const categoryConfig = getCategoryConfig(ticket.category)

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${statusConfig.bg} rounded-xl flex items-center justify-center shadow-sm`}>
                  <statusConfig.icon className={`w-6 h-6 ${statusConfig.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                      {ticket.id}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityConfig.bg} ${priorityConfig.color}`}>
                      {priorityConfig.label}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {ticket.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onEdit && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onEdit()
                      handleClose()
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    <Edit3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna Principal */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Descrição */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Descrição
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                      <p className="text-gray-700 dark:text-gray-300">
                        {ticket.description}
                      </p>
                    </div>
                  </div>

                  {/* Anexos */}
                  {ticket.attachments && ticket.attachments.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Paperclip className="w-5 h-5" />
                        Anexos ({ticket.attachments.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {ticket.attachments.map((attachment: any, index: number) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                              <Paperclip className="w-5 h-5 text-orange-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {attachment.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {attachment.size}
                              </p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </motion.button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comentários */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Comentários ({ticket.comments?.length || 0})
                    </h3>
                    
                    <div className="space-y-4 mb-4">
                      {ticket.comments?.map((comment: any) => (
                        <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                              {comment.author.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {comment.author}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {formatDateTime(comment.createdAt)}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">
                            {comment.content}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Adicionar Comentário */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Adicionar comentário..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      />
                      <div className="flex justify-end mt-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          Enviar
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Informações do Cliente */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Cliente
                    </h4>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                        {ticket.client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {ticket.client.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {ticket.client.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Agente Responsável */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      Agente
                    </h4>
                    {ticket.agent ? (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold">
                          {ticket.agent.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {ticket.agent.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Agente Responsável
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          Ticket não atribuído
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm transition-colors"
                        >
                          Atribuir Agente
                        </motion.button>
                      </div>
                    )}
                  </div>

                  {/* Detalhes */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Detalhes
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Categoria</p>
                        <p className={`font-medium ${categoryConfig.color}`}>
                          {categoryConfig.label}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Criado em</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDateTime(ticket.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Última atualização</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDateTime(ticket.updatedAt)}
                        </p>
                      </div>
                      {ticket.resolvedAt && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Resolvido em</p>
                          <p className="font-medium text-green-600">
                            {formatDateTime(ticket.resolvedAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {ticket.tags && ticket.tags.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {ticket.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ações Rápidas */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Ações Rápidas
                    </h4>
                    <div className="space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors"
                      >
                        Marcar como Resolvido
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm transition-colors"
                      >
                        Em Andamento
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                      >
                        Fechar Ticket
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
