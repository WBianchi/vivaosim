'use client'

import { User } from 'lucide-react'
import { useState, useEffect } from 'react'

interface AssignAgentSheetProps {
  chat: any
  clientData?: any
  onClose: () => void
}

interface Agent {
  id: string
  name: string
  email: string
  avatar?: string
  isOnline?: boolean
  activeChats?: number
}

export const AssignAgentSheet: React.FC<AssignAgentSheetProps> = ({ chat, clientData, onClose }) => {
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/users?role=agent')
      if (response.ok) {
        const data = await response.json()
        setAgents(data.users || [])
        setSelectedAgent(clientData?.assignedToId || '')
      }
    } catch (error) {
      console.error('❌ Erro ao carregar atendentes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignAgent = async () => {
    console.log('👤 Atribuindo atendente...')

    try {
      const response = await fetch(`/api/contacts/${clientData?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          assignedToId: selectedAgent || null 
        })
      })

      if (response.ok) {
        const selectedAgentName = selectedAgent 
          ? agents.find(a => a.id === selectedAgent)?.name || 'Atendente'
          : 'Nenhum atendente'
        
        console.log('✅ Atendente atribuído')
        onClose()
        alert(`✅ ${clientData?.name} atribuído para ${selectedAgentName}!`)
      } else {
        const error = await response.json()
        alert(`❌ Erro: ${error.error}`)
      }
    } catch (error) {
      console.error('❌ Erro na requisição:', error)
      alert('❌ Erro de conexão.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Atribuir Atendente
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Designe um atendente responsável por {clientData?.name || 'este cliente'}
        </p>
      </div>

      {/* Atendente atual */}
      {clientData && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <h4 className="font-medium text-green-900 dark:text-green-300 mb-2">
            👤 Responsável Atual
          </h4>
          <div className="text-sm">
            <span className="font-medium">
              {clientData.assignedTo?.name || 'Não atribuído'}
            </span>
            {clientData.assignedTo?.email && (
              <p className="text-gray-600 dark:text-gray-400">
                {clientData.assignedTo.email}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Seleção de atendente */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          🎯 Novo Responsável
        </label>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Carregando atendentes...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Opção para desatribuir */}
            <label
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedAgent === ''
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <input
                type="radio"
                name="agent"
                value=""
                checked={selectedAgent === ''}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="mr-3 text-green-500"
              />
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Não atribuído
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Remover responsável atual
                  </div>
                </div>
              </div>
            </label>

            {agents.map(agent => (
              <label
                key={agent.id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAgent === agent.id
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="agent"
                  value={agent.id}
                  checked={selectedAgent === agent.id}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="mr-3 text-green-500"
                />
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3">
                    {agent.avatar ? (
                      <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <span className="text-white font-medium">
                        {agent.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {agent.name}
                      </span>
                      {agent.isOnline && (
                        <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {agent.email}
                    </div>
                    {agent.activeChats !== undefined && (
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                        {agent.activeChats} chats ativos
                      </div>
                    )}
                  </div>
                </div>
              </label>
            ))}
            
            {agents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum atendente disponível</p>
                <p className="text-sm">Configure atendentes no painel administrativo</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleAssignAgent}
          disabled={loading}
          className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Atribuir Responsável
        </button>
      </div>
    </div>
  )
}
