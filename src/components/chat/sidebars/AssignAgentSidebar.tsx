'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Users, Search, Check } from 'lucide-react'
import { motion } from 'framer-motion'

interface AssignAgentSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatId?: string
  clientData?: any
}

export function AssignAgentSidebar({ isOpen, onClose, chatId, clientData }: AssignAgentSidebarProps) {
  const [loading, setLoading] = useState(false)
  const [agents, setAgents] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchAgents()
    }
  }, [isOpen])

  const fetchAgents = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/users?role=agent')
      const data = await response.json()
      
      if (data.users) {
        setAgents(data.users)
      }
    } catch (error) {
      console.error('Erro ao buscar agentes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssign = async () => {
    if (!selectedAgent) {
      alert('Selecione um agente')
      return
    }

    try {
      const response = await fetch(`/api/contacts/${clientData?.id || chatId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: selectedAgent })
      })

      if (response.ok) {
        alert('✅ Agente atribuído com sucesso!')
        onClose()
      } else {
        alert('❌ Erro ao atribuir agente')
      }
    } catch (error) {
      console.error('Erro ao atribuir agente:', error)
      alert('❌ Erro de conexão')
    }
  }

  const filteredAgents = agents.filter(agent =>
    agent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Atribuir Agente
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Selecione um agente para este cliente
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
              {/* Cliente Info */}
              {clientData && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-2">
                    👤 Cliente
                  </h4>
                  <p className="text-sm font-medium">{clientData.name}</p>
                </div>
              )}

              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar agente..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Agents List */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <div className="space-y-2 mb-6">
                  {filteredAgents.length > 0 ? (
                    filteredAgents.map((agent) => (
                      <motion.button
                        key={agent.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedAgent(agent.id)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          selectedAgent === agent.id
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-white">
                                {agent.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {agent.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {agent.email}
                              </p>
                            </div>
                          </div>
                          {selectedAgent === agent.id && (
                            <Check className="w-5 h-5 text-purple-500" />
                          )}
                        </div>
                      </motion.button>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      Nenhum agente encontrado
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAssign}
                  disabled={!selectedAgent}
                  className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Atribuir Agente
                </button>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
