'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, User, Save } from 'lucide-react'
import { motion } from 'framer-motion'

interface EditClientSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatId?: string
  clientData?: any
}

export function EditClientSidebar({ isOpen, onClose, chatId, clientData: initialClientData }: EditClientSidebarProps) {
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

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('✏️ Atualizando cliente...')

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const updateData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string || undefined,
      document: formData.get('document') as string || undefined,
      company: formData.get('company') as string || undefined,
      notes: formData.get('notes') as string || undefined,
    }

    try {
      const response = await fetch(`/api/contacts/${clientData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        const updatedClient = await response.json()
        console.log('✅ Cliente atualizado:', updatedClient.id)
        alert(`✅ Perfil de "${updatedClient.name}" atualizado com sucesso!`)
        onClose()
      } else {
        const error = await response.json()
        console.error('❌ Erro:', error)
        alert(`❌ Erro ao atualizar cliente: ${error.error}`)
      }
    } catch (error) {
      console.error('❌ Erro na requisição:', error)
      alert('❌ Erro de conexão.')
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
                    Editar Cliente
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Atualize as informações
                  </p>
                </div>
              </div>
              <Dialog.Close asChild>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </Dialog.Close>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : clientData ? (
                <>
                  {/* Status atual */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                      📊 Status Atual
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="font-medium">Status:</span> {clientData.status}</div>
                      <div><span className="font-medium">Criado:</span> {new Date(clientData.createdAt).toLocaleDateString('pt-BR')}</div>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateClient} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={clientData?.name || ''}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                        value={clientData?.phone || clientData?.whatsappNumber || ''}
                        title="Número do WhatsApp não pode ser alterado"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        E-mail
                      </label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={clientData?.email || ''}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="email@exemplo.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CPF/CNPJ
                      </label>
                      <input
                        type="text"
                        name="document"
                        defaultValue={clientData?.document || ''}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="000.000.000-00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Empresa
                      </label>
                      <input
                        type="text"
                        name="company"
                        defaultValue={clientData?.company || ''}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Nome da empresa"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Observações
                      </label>
                      <textarea
                        rows={4}
                        name="notes"
                        defaultValue={clientData?.notes || ''}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Anotações sobre o cliente..."
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Salvar Alterações
                      </button>
                    </div>
                  </form>
                </>
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
