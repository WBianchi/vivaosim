'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Ticket, Plus, Search, Filter, Clock, User, ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'
import { motion, AnimatePresence } from 'framer-motion'

interface AllTicketsSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatId?: string
  contactId?: string
}

export function AllTicketsSidebar({ isOpen, onClose, chatId, contactId }: AllTicketsSidebarProps) {
  const [loading, setLoading] = useState(false)
  const [tickets, setTickets] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null)
  const [editingTicket, setEditingTicket] = useState<any | null>(null)
  const [creatingTicket, setCreatingTicket] = useState(false)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'normal'
  })

  useEffect(() => {
    if (isOpen) {
      fetchTickets()
    }
  }, [isOpen, chatId])

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const token = getAuthToken()
      if (!token) {
        console.log('⚠️ AllTicketsSidebar: Token não encontrado')
        setLoading(false)
        return
      }

      const url = chatId 
        ? `/api/tickets?chatId=${chatId}`
        : '/api/tickets'

      console.log(`🔍 AllTicketsSidebar: Buscando tickets... (chatId: ${chatId || 'todos'})`)
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      console.log('🎫 AllTicketsSidebar: Resposta da API:', data)
      
      if (data.tickets) {
        setTickets(data.tickets)
        console.log(`✅ AllTicketsSidebar: ${data.tickets.length} tickets carregados`)
      }
    } catch (error) {
      console.error('❌ AllTicketsSidebar: Erro ao buscar tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTickets = tickets.filter(ticket => 
    ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'open': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'in_progress': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'resolved': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'closed': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
    return colors[status] || colors.open
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'open': 'Aberto',
      'in_progress': 'Em Progresso',
      'resolved': 'Resolvido',
      'closed': 'Fechado'
    }
    return labels[status] || status
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'low': 'text-gray-500',
      'medium': 'text-yellow-500',
      'high': 'text-orange-500',
      'urgent': 'text-red-500'
    }
    return colors[priority] || colors.medium
  }

  const handleDelete = async (ticketId: string) => {
    if (!confirm('Tem certeza que deseja excluir este ticket?')) return

    try {
      const token = getAuthToken()
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setTickets(tickets.filter(t => t.id !== ticketId))
        alert('✅ Ticket excluído com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao excluir ticket:', error)
      alert('❌ Erro ao excluir ticket')
    }
  }

  const handleEdit = (ticket: any) => {
    setEditingTicket(ticket)
    setEditForm({
      title: ticket.title,
      description: ticket.description || '',
      status: ticket.status,
      priority: ticket.priority
    })
  }

  const handleSaveEdit = async () => {
    if (!editingTicket) return

    try {
      const token = getAuthToken()
      const response = await fetch(`/api/tickets/${editingTicket.id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      })

      const data = await response.json()

      if (data.success) {
        setTickets(tickets.map(t => t.id === editingTicket.id ? data.ticket : t))
        setEditingTicket(null)
        alert('✅ Ticket atualizado com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao atualizar ticket:', error)
      alert('❌ Erro ao atualizar ticket')
    }
  }

  const handleCreateTicket = async () => {
    if (!editForm.title.trim()) {
      alert('⚠️ Título é obrigatório')
      return
    }

    if (!chatId) {
      alert('⚠️ Chat não identificado')
      return
    }

    try {
      const token = getAuthToken()
      
      // Buscar contactId do chat se não foi passado
      let finalContactId = contactId
      
      if (!finalContactId && chatId) {
        // Extrair número do WhatsApp do chatId (formato: 5511999999999@c.us)
        const whatsappNumber = chatId.replace('@c.us', '')
        
        // Buscar contato pelo número do WhatsApp
        const contactResponse = await fetch(`/api/contacts?whatsappNumber=${whatsappNumber}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const contactData = await contactResponse.json()
        
        if (contactData.contacts && contactData.contacts.length > 0) {
          finalContactId = contactData.contacts[0].id
        }
      }

      if (!finalContactId) {
        alert('⚠️ Contato não identificado. Certifique-se de que o contato existe no sistema.')
        return
      }

      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...editForm,
          contactId: finalContactId,
          chatId
        })
      })

      const data = await response.json()

      if (data.ticket) {
        setTickets([data.ticket, ...tickets])
        setCreatingTicket(false)
        setEditForm({ title: '', description: '', status: 'open', priority: 'normal' })
        alert('✅ Ticket criado com sucesso!')
      } else {
        alert(`❌ ${data.error || 'Erro ao criar ticket'}`)
      }
    } catch (error) {
      console.error('Erro ao criar ticket:', error)
      alert('❌ Erro ao criar ticket')
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <Dialog.Content 
          className="fixed right-0 top-0 h-full w-[480px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300"
          aria-describedby="tickets-description"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                <Ticket className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <Dialog.Title asChild>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {chatId ? 'Tickets deste Chat' : 'Todos os Tickets'}
                  </h2>
                </Dialog.Title>
                <Dialog.Description asChild>
                  <p id="tickets-description" className="text-xs text-gray-500 dark:text-gray-400">
                    {chatId ? 'Tickets desta conversa' : `${tickets.length} tickets encontrados`}
                  </p>
                </Dialog.Description>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Busca */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar tickets..."
                className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Lista de Tickets */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {searchTerm ? 'Nenhum ticket encontrado' : 'Nenhum ticket ainda'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTickets.map((ticket) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors overflow-hidden"
                  >
                    <div 
                      onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                      className="p-4 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                            {ticket.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}>
                              {getStatusLabel(ticket.status)}
                            </span>
                            <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority === 'urgent' ? '🔥 Urgente' : 
                               ticket.priority === 'high' ? '⚠️ Alta' :
                               ticket.priority === 'medium' ? '📌 Média' : '📋 Baixa'}
                            </span>
                          </div>
                        </div>
                        <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                          {expandedTicket === ticket.id ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                      
                      {ticket.description && (
                        <p className={`text-xs text-gray-500 dark:text-gray-400 mb-3 ${expandedTicket === ticket.id ? '' : 'line-clamp-2'}`}>
                          {ticket.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-3">
                          {ticket.assignedTo && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{ticket.assignedTo.name}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Área expandida com ações */}
                    <AnimatePresence>
                      {expandedTicket === ticket.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3"
                        >
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(ticket)
                              }}
                              className="flex-1 py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                              Editar
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(ticket.id)
                              }}
                              className="flex-1 py-2 px-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Excluir
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer com botão Novo Ticket */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setCreatingTicket(true)
                setEditForm({ title: '', description: '', status: 'open', priority: 'normal' })
              }}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Ticket
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>

      {/* Modal de Edição */}
      {editingTicket && (
        <Dialog.Root open={!!editingTicket} onOpenChange={() => setEditingTicket(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-[70] w-[500px] max-h-[80vh] overflow-y-auto">
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Editar Ticket</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="open">Aberto</option>
                      <option value="in_progress">Em Progresso</option>
                      <option value="resolved">Resolvido</option>
                      <option value="closed">Fechado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Prioridade
                    </label>
                    <select
                      value={editForm.priority}
                      onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="low">Baixa</option>
                      <option value="normal">Normal</option>
                      <option value="high">Alta</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditingTicket(null)}
                    className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}

      {/* Modal de Criação */}
      {creatingTicket && (
        <Dialog.Root open={creatingTicket} onOpenChange={() => setCreatingTicket(false)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-[70] w-[500px] max-h-[80vh] overflow-y-auto">
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Novo Ticket</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Digite o título do ticket"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Descreva o problema ou solicitação"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="open">Aberto</option>
                      <option value="in_progress">Em Progresso</option>
                      <option value="resolved">Resolvido</option>
                      <option value="closed">Fechado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Prioridade
                    </label>
                    <select
                      value={editForm.priority}
                      onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="low">Baixa</option>
                      <option value="normal">Normal</option>
                      <option value="high">Alta</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCreateTicket}
                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium"
                  >
                    Criar Ticket
                  </button>
                  <button
                    onClick={() => setCreatingTicket(false)}
                    className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </Dialog.Root>
  )
}
