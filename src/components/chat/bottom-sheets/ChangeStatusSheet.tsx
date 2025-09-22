'use client'

import { CircleDot } from 'lucide-react'
import { useState } from 'react'

interface ChangeStatusSheetProps {
  chat: any
  clientData?: any
  onClose: () => void
}

interface StatusOption {
  value: string
  label: string
  description: string
  color: string
  bgColor: string
}

export const ChangeStatusSheet: React.FC<ChangeStatusSheetProps> = ({ chat, clientData, onClose }) => {
  const [selectedStatus, setSelectedStatus] = useState(clientData?.status || 'LEAD_FRESCO')

  const statusOptions: StatusOption[] = [
    {
      value: 'LEAD_FRESCO',
      label: 'Lead Fresco',
      description: 'Primeiro contato, ainda não qualificado',
      color: 'text-gray-700',
      bgColor: 'bg-gray-100'
    },
    {
      value: 'LEAD_QUALIFICADO', 
      label: 'Lead Qualificado',
      description: 'Demonstrou interesse real no produto/serviço',
      color: 'text-blue-700',
      bgColor: 'bg-blue-100'
    },
    {
      value: 'EM_NEGOCIACAO',
      label: 'Em Negociação',
      description: 'Discussão ativa sobre proposta comercial',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100'
    },
    {
      value: 'ORCAMENTO_ENVIADO',
      label: 'Orçamento Enviado', 
      description: 'Aguardando resposta sobre a proposta',
      color: 'text-orange-700',
      bgColor: 'bg-orange-100'
    },
    {
      value: 'CLIENTE_ATIVO',
      label: 'Cliente Ativo',
      description: 'Negócio fechado, cliente ativo',
      color: 'text-green-700',
      bgColor: 'bg-green-100'
    },
    {
      value: 'PERDIDO',
      label: 'Perdido',
      description: 'Oportunidade não convertida',
      color: 'text-red-700',
      bgColor: 'bg-red-100'
    },
    {
      value: 'PAUSADO',
      label: 'Pausado',
      description: 'Temporariamente sem interação ativa',
      color: 'text-purple-700',
      bgColor: 'bg-purple-100'
    }
  ]

  const handleChangeStatus = async () => {
    console.log('🔄 Alterando status do cliente...')

    try {
      const response = await fetch(`/api/contacts/${clientData?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus })
      })

      if (response.ok) {
        const newStatusLabel = statusOptions.find(s => s.value === selectedStatus)?.label
        console.log('✅ Status alterado')
        onClose()
        alert(`✅ Status de ${clientData?.name} alterado para "${newStatusLabel}"!`)
      } else {
        const error = await response.json()
        alert(`❌ Erro: ${error.error}`)
      }
    } catch (error) {
      console.error('❌ Erro na requisição:', error)
      alert('❌ Erro de conexão.')
    }
  }

  const currentStatus = statusOptions.find(s => s.value === clientData?.status)
  const newStatus = statusOptions.find(s => s.value === selectedStatus)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CircleDot className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Alterar Status
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Atualize o status de {clientData?.name || 'este cliente'} no funil de vendas
        </p>
      </div>

      {/* Status atual */}
      {currentStatus && (
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-2">
            📍 Status Atual
          </h4>
          <div className="flex items-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatus.bgColor} ${currentStatus.color}`}>
              <CircleDot className="w-3 h-3 mr-2" />
              {currentStatus.label}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {currentStatus.description}
          </p>
        </div>
      )}

      {/* Seleção de status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          🎯 Novo Status *
        </label>
        
        <div className="space-y-2">
          {statusOptions.map(status => (
            <label
              key={status.value}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedStatus === status.value
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <input
                type="radio"
                name="status"
                value={status.value}
                checked={selectedStatus === status.value}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="mr-3 text-purple-500"
              />
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}>
                    <CircleDot className="w-3 h-3 mr-2" />
                    {status.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {status.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Preview da mudança */}
      {selectedStatus !== clientData?.status && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 dark:text-yellow-300 mb-2">
            🔄 Alteração
          </h4>
          <div className="flex items-center space-x-3 text-sm">
            <span className={`px-2 py-1 rounded ${currentStatus?.bgColor} ${currentStatus?.color}`}>
              {currentStatus?.label}
            </span>
            <span>→</span>
            <span className={`px-2 py-1 rounded ${newStatus?.bgColor} ${newStatus?.color}`}>
              {newStatus?.label}
            </span>
          </div>
        </div>
      )}

      <div className="flex space-x-3 pt-4">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleChangeStatus}
          disabled={selectedStatus === clientData?.status}
          className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {selectedStatus === clientData?.status ? 'Status Atual' : 'Alterar Status'}
        </button>
      </div>
    </div>
  )
}
