'use client'

import { Ticket } from 'lucide-react'

interface CreateTicketSheetProps {
  chat: any
  clientData?: any
  onClose: () => void
}

export const CreateTicketSheet: React.FC<CreateTicketSheetProps> = ({ chat, clientData, onClose }) => {
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🎫 Criando ticket...')

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const ticketData = {
      title: formData.get('title') as string,
      priority: formData.get('priority') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      contactId: clientData?.id,
      whatsappChatId: chat.id,
      status: 'open'
    }

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      })

      if (response.ok) {
        const newTicket = await response.json()
        console.log('✅ Ticket criado:', newTicket.id)
        onClose()
        alert(`✅ Ticket "${newTicket.title}" criado com sucesso!\n🎫 Prioridade: ${ticketData.priority}`)
      } else {
        const error = await response.json()
        console.error('❌ Erro:', error)
        alert(`❌ Erro ao criar ticket: ${error.error}`)
      }
    } catch (error) {
      console.error('❌ Erro na requisição:', error)
      alert('❌ Erro de conexão.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Ticket className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Criar Ticket de Suporte
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Abra um ticket para acompanhar o atendimento de {clientData?.name || 'este cliente'}
        </p>
      </div>

      {/* Info do cliente */}
      {clientData && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
          <h4 className="font-medium text-red-900 dark:text-red-300 mb-2">
            🎯 Cliente
          </h4>
          <div className="text-sm">
            <span className="font-medium">{clientData.name}</span> • {clientData.status}
          </div>
        </div>
      )}

      <form onSubmit={handleCreateTicket} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Título do Ticket *
          </label>
          <input
            type="text"
            name="title"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
            placeholder="Ex: Problema com produto X"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prioridade *
            </label>
            <select 
              name="priority"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Selecionar...</option>
              <option value="low">Baixa</option>
              <option value="normal">Normal</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria
            </label>
            <select 
              name="category"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Selecionar...</option>
              <option value="technical">Técnico</option>
              <option value="billing">Financeiro</option>
              <option value="support">Suporte Geral</option>
              <option value="complaint">Reclamação</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descrição do problema *
          </label>
          <textarea
            rows={4}
            name="description"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
            placeholder="Descreva detalhadamente o problema ou solicitação..."
            required
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
            className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Criar Ticket
          </button>
        </div>
      </form>
    </div>
  )
}
