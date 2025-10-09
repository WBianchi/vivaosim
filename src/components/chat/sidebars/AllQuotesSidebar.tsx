'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { 
  X, 
  FileText, 
  DollarSign,
  Calendar,
  User,
  Search,
  Filter,
  Eye,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Plus
} from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'
import { motion, AnimatePresence } from 'framer-motion'
import { QuoteSidebar } from './QuoteSidebar'

interface AllQuotesSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatId?: string // Opcional: se passar, filtra apenas orçamentos desse chat
}

export function AllQuotesSidebar({ isOpen, onClose, chatId }: AllQuotesSidebarProps) {
  const [loading, setLoading] = useState(false)
  const [quotes, setQuotes] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null)
  const [editingQuote, setEditingQuote] = useState<any | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [contactData, setContactData] = useState<any>(null)

  useEffect(() => {
    if (isOpen) {
      fetchQuotes()
      if (chatId) {
        fetchContactData()
      }
    }
  }, [isOpen, chatId])

  const fetchContactData = async () => {
    try {
      console.log('🔍 AllQuotesSidebar: Buscando dados do contato...', chatId)
      const response = await fetch(`/api/contacts/check-chat?chatId=${chatId}`)
      const data = await response.json()
      console.log('📋 AllQuotesSidebar: Resposta do contato:', data)
      if (data.exists && data.contact) {
        setContactData(data.contact)
        console.log('✅ AllQuotesSidebar: Contato carregado:', data.contact.id)
      } else {
        console.log('⚠️ AllQuotesSidebar: Contato não encontrado')
      }
    } catch (error) {
      console.error('❌ AllQuotesSidebar: Erro ao buscar dados do contato:', error)
    }
  }

  const fetchQuotes = async () => {
    setLoading(true)
    try {
      const token = getAuthToken()
      if (!token) {
        console.log('⚠️ AllQuotesSidebar: Token não encontrado')
        setLoading(false)
        return
      }

      // Se chatId foi passado, buscar apenas orçamentos desse chat
      if (chatId) {
        console.log(`🔍 AllQuotesSidebar: Buscando orçamentos do chat ${chatId}...`)
        
        const response = await fetch(`/api/quotes/by-chats?chatIds=${chatId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        
        console.log('📊 AllQuotesSidebar: Resposta da API (chat específico):', data)
        
        if (data.success) {
          setQuotes(data.quotes || [])
          console.log(`✅ AllQuotesSidebar: ${data.quotes?.length || 0} orçamentos do chat carregados`)
        }
      } else {
        // Buscar todos os orçamentos
        console.log('🔍 AllQuotesSidebar: Buscando todos os orçamentos...')

        const response = await fetch('/api/quotes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        
        console.log('📊 AllQuotesSidebar: Resposta da API (todos):', data)
        
        if (data.success) {
          setQuotes(data.quotes || [])
          console.log(`✅ AllQuotesSidebar: ${data.quotes?.length || 0} orçamentos carregados`)
        }
      }
    } catch (error) {
      console.error('❌ AllQuotesSidebar: Erro ao buscar orçamentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.contact?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || quote.status === filterStatus
    return matchesSearch && matchesStatus
  })


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APROVADO': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'PENDENTE': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'REJEITADO': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const handleDelete = async (quoteId: string) => {
    if (!confirm('Tem certeza que deseja excluir este orçamento?')) return

    try {
      const token = getAuthToken()
      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setQuotes(quotes.filter(q => q.id !== quoteId))
        alert('✅ Orçamento excluído com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error)
      alert('❌ Erro ao excluir orçamento')
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <Dialog.Content className="fixed right-0 top-0 h-full w-[480px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {chatId ? 'Orçamentos deste Chat' : 'Todos os Orçamentos'}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {chatId ? 'Orçamentos desta conversa' : 'Gerencie seus orçamentos'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Filtros */}
            <div className="p-4 space-y-3 border-b border-gray-200 dark:border-gray-700">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="Buscar orçamento..."
                />
              </div>

              {/* Status */}
              <div className="flex gap-2">
                {['all', 'PENDENTE', 'APROVADO', 'REJEITADO'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      filterStatus === status
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {status === 'all' ? 'Todos' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : filteredQuotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <FileText className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm">Nenhum orçamento encontrado</p>
                </div>
              ) : (
                filteredQuotes.map((quote) => (
                  <motion.div
                    key={quote.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600 transition-colors overflow-hidden"
                  >
                    <div 
                      onClick={() => setExpandedQuote(expandedQuote === quote.id ? null : quote.id)}
                      className="p-4 cursor-pointer"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {quote.title || 'Sem título'}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                            <User className="w-3 h-3" />
                            {quote.contact?.name || 'Cliente não identificado'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quote.status)}`}>
                            {quote.status || 'PENDENTE'}
                          </span>
                          <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                            {expandedQuote === quote.id ? (
                              <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Valor e Data */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-bold text-sm">
                            R$ {(quote.total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(quote.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>

                    {/* Área expandida com ações */}
                    <AnimatePresence>
                      {expandedQuote === quote.id && (
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
                                alert('Edição em desenvolvimento')
                              }}
                              className="flex-1 py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                              Editar
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(quote.id)
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
                ))
              )}
            </div>

            {/* Footer com botão Novo Orçamento */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  if (!contactData && chatId) {
                    alert('⚠️ Aguarde... carregando dados do contato')
                    return
                  }
                  setShowCreateForm(true)
                }}
                className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Novo Orçamento
              </button>
            </div>
        </Dialog.Content>
      </Dialog.Portal>

      {/* Modal de Criação de Orçamento */}
      {showCreateForm && (
        <QuoteSidebar
          isOpen={showCreateForm}
          onClose={() => {
            setShowCreateForm(false)
            fetchQuotes() // Recarregar lista após criar
          }}
          chatId={chatId || ''}
          contactId={contactData?.id}
          contactName={contactData?.name}
        />
      )}
    </Dialog.Root>
  )
}
