'use client'

import { Users } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ChangeQueueSheetProps {
  chat: any
  clientData?: any
  onClose: () => void
}

interface Queue {
  id: string
  name: string
  description?: string
  agentCount?: number
}

export const ChangeQueueSheet: React.FC<ChangeQueueSheetProps> = ({ chat, clientData, onClose }) => {
  const [queues, setQueues] = useState<Queue[]>([])
  const [selectedQueue, setSelectedQueue] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQueues()
  }, [])

  const fetchQueues = async () => {
    try {
      const response = await fetch('/api/queues')
      if (response.ok) {
        const data = await response.json()
        setQueues(data.queues || [])
        setSelectedQueue(clientData?.queueId || '')
      }
    } catch (error) {
      console.error('❌ Erro ao carregar filas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeQueue = async () => {
    if (!selectedQueue) {
      alert('⚠️ Selecione uma fila')
      return
    }

    console.log('🔄 Alterando fila do cliente...')

    try {
      const response = await fetch(`/api/contacts/${clientData?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queueId: selectedQueue })
      })

      if (response.ok) {
        const selectedQueueName = queues.find(q => q.id === selectedQueue)?.name
        console.log('✅ Fila alterada')
        onClose()
        alert(`✅ ${clientData?.name} movido para fila "${selectedQueueName}"!`)
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
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Alterar Fila
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Mova {clientData?.name || 'este cliente'} para outra fila de atendimento
        </p>
      </div>

      {/* Status atual */}
      {clientData && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
            📍 Fila Atual
          </h4>
          <div className="text-sm">
            <span className="font-medium">{clientData.queue?.name || 'Sem fila'}</span>
            {clientData.queue?.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {clientData.queue.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Seleção de fila */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          🎯 Nova Fila *
        </label>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Carregando filas...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {queues.map(queue => (
              <label
                key={queue.id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedQueue === queue.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="queue"
                  value={queue.id}
                  checked={selectedQueue === queue.id}
                  onChange={(e) => setSelectedQueue(e.target.value)}
                  className="mr-3 text-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {queue.name}
                  </div>
                  {queue.description && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {queue.description}
                    </div>
                  )}
                  {queue.agentCount !== undefined && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {queue.agentCount} atendentes
                    </div>
                  )}
                </div>
              </label>
            ))}
            
            {queues.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma fila disponível</p>
                <p className="text-sm">Configure filas no painel administrativo</p>
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
          onClick={handleChangeQueue}
          disabled={!selectedQueue || loading}
          className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Alterar Fila
        </button>
      </div>
    </div>
  )
}
