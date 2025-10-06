'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Send, User, Phone, Search, Loader2 } from 'lucide-react'

interface WhatsAppContact {
  id: string
  name: string
  pushname?: string
  number: string
  isBusiness?: boolean
}

interface SendContactModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (contactData: {
    name: string
    phone: string
  }) => void
  chatName: string
  sessionId?: string
}

export const SendContactModal: React.FC<SendContactModalProps> = ({
  isOpen,
  onClose,
  onSend,
  chatName,
  sessionId
}) => {
  const [contacts, setContacts] = useState<WhatsAppContact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<WhatsAppContact[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact | null>(null)
  const [loading, setLoading] = useState(false)

  // Buscar contatos do WhatsApp
  useEffect(() => {
    if (isOpen) {
      loadContacts()
    }
  }, [isOpen])

  // Filtrar contatos com base na pesquisa
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = contacts.filter(contact => 
        contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.pushname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.number.includes(searchTerm)
      )
      setFilteredContacts(filtered)
    } else {
      setFilteredContacts(contacts)
    }
  }, [searchTerm, contacts])

  const loadContacts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/whatsapp/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId })
      })

      if (response.ok) {
        const data = await response.json()
        setContacts(data.contacts || [])
        setFilteredContacts(data.contacts || [])
      }
    } catch (error) {
      console.error('Erro ao buscar contatos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const handleSend = () => {
    if (!selectedContact) {
      alert('Selecione um contato')
      return
    }

    onSend({
      name: selectedContact.name || selectedContact.pushname || 'Contato',
      phone: selectedContact.number
    })

    // Reset
    setSelectedContact(null)
    setSearchTerm('')
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Enviar Contato
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Para: {chatName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Campo de Pesquisa */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar contatos...."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
            />
          </div>

          {/* Lista de Contatos */}
          <div className="max-h-96 overflow-y-auto space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg p-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Nenhum contato encontrado</p>
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedContact?.id === contact.id
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 border-2 border-indigo-500'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {contact.name || contact.pushname || 'Sem nome'}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {contact.number}
                      </p>
                    </div>
                    {selectedContact?.id === contact.id && (
                      <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {selectedContact && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Contato selecionado:</strong> {selectedContact.name || selectedContact.pushname}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSend}
            disabled={!selectedContact}
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Enviar Contato
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
