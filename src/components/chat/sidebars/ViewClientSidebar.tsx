'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, User, Mail, Phone, Building, Calendar, FileText, Edit } from 'lucide-react'
import { motion } from 'framer-motion'

interface ViewClientSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatId?: string
  clientData?: any
  onEdit?: () => void
}

export function ViewClientSidebar({ isOpen, onClose, chatId, clientData: initialClientData, onEdit }: ViewClientSidebarProps) {
  const [loading, setLoading] = useState(false)
  const [clientData, setClientData] = useState<any>(initialClientData)

  useEffect(() => {
    if (isOpen && chatId && !initialClientData) {
      fetchClientData()
    } else if (initialClientData) {
      setClientData(initialClientData)
    }
  }, [isOpen, chatId, initialClientData])

  const fetchClientData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/contacts/check-chat?chatId=${chatId}`)
      const data = await response.json()
      
      if (data.exists && data.contact) {
        setClientData(data.contact)
      }
    } catch (error) {
      console.error('Erro ao buscar cliente:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed right-0 top-0 h-full w-full sm:w-[500px] bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="h-full flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Detalhes do Cliente
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Informações completas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-5 h-5 text-gray-500" />
                  </button>
                )}
                <Dialog.Close asChild>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </Dialog.Close>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : clientData ? (
                <div className="space-y-6">
                  {/* Avatar e Nome */}
                  <div className="text-center pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">
                        {clientData.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {clientData.name}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      clientData.status === 'active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {clientData.status === 'active' ? 'Ativo' : clientData.status}
                    </span>
                  </div>

                  {/* Informações de Contato */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Contato
                    </h4>
                    <div className="space-y-3">
                      {clientData.phone && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">WhatsApp</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{clientData.phone}</p>
                          </div>
                        </div>
                      )}
                      {clientData.email && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">E-mail</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{clientData.email}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Informações Adicionais */}
                  {(clientData.company || clientData.document) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Informações Adicionais
                      </h4>
                      <div className="space-y-3">
                        {clientData.company && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <Building className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Empresa</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{clientData.company}</p>
                            </div>
                          </div>
                        )}
                        {clientData.document && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">CPF/CNPJ</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{clientData.document}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Observações */}
                  {clientData.notes && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Observações
                      </h4>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {clientData.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Data de Criação */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Cliente desde {new Date(clientData.createdAt).toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  Nenhum cliente encontrado
                </div>
              )}
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
