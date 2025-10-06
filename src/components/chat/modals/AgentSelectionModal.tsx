'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bot, Sparkles, Check, AlertCircle, Zap } from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'

interface Agent {
  id: string
  name: string
  description: string
  model: string
  niche: string
  role: string
  status: string
  prompt: string
  color?: string
}

interface AgentSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (agent: Agent | null) => void
  currentAgent?: Agent | null
  chatId: string
}

export function AgentSelectionModal({
  isOpen,
  onClose,
  onSelect,
  currentAgent,
  chatId
}: AgentSelectionModalProps) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(currentAgent?.id || null)
  const [saving, setSaving] = useState(false)

  // Atualizar selectedAgent quando currentAgent mudar
  useEffect(() => {
    setSelectedAgent(currentAgent?.id || null)
  }, [currentAgent])

  // Buscar agentes disponíveis
  useEffect(() => {
    if (!isOpen) return

    const fetchAgents = async () => {
      try {
        setLoading(true)
        const token = getAuthToken()
        if (!token) return

        console.log('🤖 Buscando agentes disponíveis...')

        const response = await fetch('/api/agents', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()
        console.log('📋 Agentes recebidos:', data)

        if (data.agents) {
          setAgents(data.agents)
        }
      } catch (error) {
        console.error('❌ Erro ao buscar agentes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [isOpen])

  const handleSelectAgent = async () => {
    if (!selectedAgent) return

    setSaving(true)
    try {
      const token = getAuthToken()
      if (!token) return

      const agent = agents.find(a => a.id === selectedAgent)
      
      console.log('🤖 Atribuindo agente ao chat:', { chatId, agentId: selectedAgent })

      // Atribuir agente ao chat
      const response = await fetch(`/api/chats/${chatId}/agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ agentId: selectedAgent })
      })

      const data = await response.json()

      if (data.success) {
        onSelect(agent || null)
        
        // Toast de sucesso
        const toast = document.createElement('div')
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] flex items-center gap-2'
        toast.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="font-medium">Agente ativado com sucesso!</span>
        `
        document.body.appendChild(toast)
        setTimeout(() => toast.remove(), 3000)
        
        onClose()
      }
    } catch (error) {
      console.error('❌ Erro ao atribuir agente:', error)
      alert('❌ Erro ao atribuir agente')
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivateAgent = async () => {
    setSaving(true)
    try {
      const token = getAuthToken()
      if (!token) return

      console.log('🤖 Desativando agente do chat:', chatId)

      // Remover agente do chat
      const response = await fetch(`/api/chats/${chatId}/agent`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        onSelect(null)
        setSelectedAgent(null)
        
        // Toast de sucesso
        const toast = document.createElement('div')
        toast.className = 'fixed top-4 right-4 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] flex items-center gap-2'
        toast.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span class="font-medium">Agente desativado</span>
        `
        document.body.appendChild(toast)
        setTimeout(() => toast.remove(), 3000)
        
        onClose()
      }
    } catch (error) {
      console.error('❌ Erro ao desativar agente:', error)
      alert('❌ Erro ao desativar agente')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Selecionar Agente IA
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Escolha um agente para auxiliar no atendimento
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Opção para desativar agente */}
                {currentAgent && (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedAgent(null)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedAgent === null
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            Desativar Agente
                          </h3>
                          <p className="text-sm text-gray-500">
                            Atendimento manual sem assistência de IA
                          </p>
                        </div>
                      </div>
                      {selectedAgent === null && (
                        <Check className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </motion.button>
                )}

                {/* Lista de agentes */}
                {agents.map((agent) => (
                  <motion.button
                    key={agent.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedAgent(agent.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedAgent === agent.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"
                        >
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {agent.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {agent.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                              {agent.model}
                            </span>
                            <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded">
                              {agent.niche}
                            </span>
                            {agent.status === 'ACTIVE' && (
                              <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 rounded flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                Ativo
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {selectedAgent === agent.id && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </motion.button>
                ))}

                {agents.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum agente disponível</p>
                    <p className="text-xs mt-2">Crie agentes em Configurações → Agentes IA</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              {selectedAgent === null ? (
                <button
                  onClick={handleDeactivateAgent}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition-colors"
                >
                  {saving ? 'Desativando...' : 'Desativar Agente'}
                </button>
              ) : (
                <button
                  onClick={handleSelectAgent}
                  disabled={!selectedAgent || saving}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
                >
                  {saving ? 'Ativando...' : 'Ativar Agente'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
