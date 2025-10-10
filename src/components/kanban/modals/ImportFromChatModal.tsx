'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Loader2, User, MessageSquare, FileText, Calendar, Tag, FileCheck, AlertCircle } from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'

interface ChatContact {
  id: string
  name: string
  phone: string
  rawPhone?: string // Telefone sem formatação para busca
  profilePicture?: string
  lastMessage?: string
  unreadCount?: number
  // Dados agregados
  quotesCount: number
  schedulesCount: number
  contractsCount: number
  ticketsCount: number
  tags: string[]
}

interface ImportFromChatModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (contactId: string, columnId: string) => void
  boardId: string
  columns: any[]
}

export function ImportFromChatModal({ 
  isOpen, 
  onClose, 
  onImport,
  boardId,
  columns
}: ImportFromChatModalProps) {
  const [contacts, setContacts] = useState<ChatContact[]>([])
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null)
  const [selectedColumnId, setSelectedColumnId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchChatContacts()
    }
  }, [isOpen])

  const fetchChatContacts = async () => {
    setLoading(true)
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch('/api/chats/contacts-with-data', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setContacts(data.contacts || [])
      }
    } catch (error) {
      console.error('Erro ao buscar contatos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async () => {
    if (!selectedContact || !selectedColumnId) return

    setImporting(true)
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch('/api/kanban/import-from-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          chatId: selectedContact.id,
          columnId: selectedColumnId,
          boardId: boardId
        })
      })

      const data = await response.json()

      if (data.success) {
        onImport(selectedContact.id, selectedColumnId)
        onClose()
        setSelectedContact(null)
        setSelectedColumnId('')
      } else {
        alert('Erro ao importar contato: ' + (data.error || 'Erro desconhecido'))
      }
    } catch (error) {
      console.error('Erro ao importar:', error)
      alert('Erro ao importar contato')
    } finally {
      setImporting(false)
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const query = searchQuery.toLowerCase().replace(/\D/g, '') // Remove formatação da busca
    const nameMatch = contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    const phoneMatch = contact.phone.includes(searchQuery)
    const rawPhoneMatch = contact.rawPhone?.includes(query)
    
    return nameMatch || phoneMatch || rawPhoneMatch
  })

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-green-500" />
                Importar Cliente do Chat
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Selecione um contato do WhatsApp para importar com todos os dados
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex">
            {/* Lista de Contatos */}
            <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar contato..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Contacts List */}
              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                  </div>
                ) : filteredContacts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum contato encontrado</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredContacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => setSelectedContact(contact)}
                        className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left ${
                          selectedContact?.id === contact.id
                            ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-transparent'
                        }`}
                      >
                        {contact.profilePicture ? (
                          <img
                            src={contact.profilePicture}
                            alt={contact.name}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {contact.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {contact.phone}
                          </p>
                          {contact.lastMessage && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-1">
                              {contact.lastMessage}
                            </p>
                          )}
                          
                          {/* Badges de dados */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {contact.quotesCount > 0 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-full">
                                <FileText className="w-3 h-3" />
                                {contact.quotesCount}
                              </span>
                            )}
                            {contact.schedulesCount > 0 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full">
                                <Calendar className="w-3 h-3" />
                                {contact.schedulesCount}
                              </span>
                            )}
                            {contact.contractsCount > 0 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                                <FileCheck className="w-3 h-3" />
                                {contact.contractsCount}
                              </span>
                            )}
                            {contact.ticketsCount > 0 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full">
                                <AlertCircle className="w-3 h-3" />
                                {contact.ticketsCount}
                              </span>
                            )}
                            {contact.tags.length > 0 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full">
                                <Tag className="w-3 h-3" />
                                {contact.tags.length}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Detalhes e Seleção de Coluna */}
            <div className="w-1/2 flex flex-col">
              {selectedContact ? (
                <>
                  {/* Detalhes do Contato */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-4 mb-4">
                      {selectedContact.profilePicture ? (
                        <img
                          src={selectedContact.profilePicture}
                          alt={selectedContact.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                          <User className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {selectedContact.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedContact.phone}
                        </p>
                      </div>
                    </div>

                    {/* Resumo de Dados */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400 mb-1">
                          <FileText className="w-4 h-4" />
                          <span className="text-xs font-medium">Orçamentos</span>
                        </div>
                        <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">
                          {selectedContact.quotesCount}
                        </p>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs font-medium">Agendamentos</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                          {selectedContact.schedulesCount}
                        </p>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-1">
                          <FileCheck className="w-4 h-4" />
                          <span className="text-xs font-medium">Contratos</span>
                        </div>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                          {selectedContact.contractsCount}
                        </p>
                      </div>

                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mb-1">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">Tickets</span>
                        </div>
                        <p className="text-2xl font-bold text-red-900 dark:text-red-300">
                          {selectedContact.ticketsCount}
                        </p>
                      </div>
                    </div>

                    {selectedContact.tags.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Tags:</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedContact.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Seleção de Coluna */}
                  <div className="flex-1 p-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Selecione a coluna de destino:
                    </label>
                    <div className="space-y-2">
                      {columns.map((column) => (
                        <button
                          key={column.id}
                          onClick={() => setSelectedColumnId(column.id)}
                          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                            selectedColumnId === column.id
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: column.color || '#6B7280' }}
                            />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {column.title}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Selecione um contato para ver os detalhes</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {selectedContact ? `${selectedContact.name} selecionado` : 'Nenhum contato selecionado'}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleImport}
                  disabled={!selectedContact || !selectedColumnId || importing}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {importing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      Importar Cliente
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
