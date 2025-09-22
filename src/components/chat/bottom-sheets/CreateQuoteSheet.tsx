'use client'

import { DollarSign } from 'lucide-react'

interface CreateQuoteSheetProps {
  chat: any
  clientData?: any
  onClose: () => void
}

export const CreateQuoteSheet: React.FC<CreateQuoteSheetProps> = ({ chat, clientData, onClose }) => {
  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('💰 Criando orçamento...')

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const quoteData = {
      title: formData.get('title') as string,
      value: formData.get('value') as string,
      validUntil: formData.get('validUntil') as string,
      description: formData.get('description') as string,
      contactId: clientData?.id,
      whatsappChatId: chat.id,
    }

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData)
      })

      if (response.ok) {
        const newQuote = await response.json()
        console.log('✅ Orçamento criado:', newQuote.id)
        onClose()
        alert(`✅ Orçamento "${newQuote.title}" criado com sucesso!\n💰 Valor: R$ ${quoteData.value}`)
      } else {
        const error = await response.json()
        console.error('❌ Erro:', error)
        alert(`❌ Erro ao criar orçamento: ${error.error}`)
      }
    } catch (error) {
      console.error('❌ Erro na requisição:', error)
      alert('❌ Erro de conexão.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Criar Orçamento
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Prepare uma proposta comercial para {clientData?.name || 'este cliente'}
        </p>
      </div>

      {/* Info do cliente */}
      {clientData && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 dark:text-yellow-300 mb-2">
            🎯 Cliente
          </h4>
          <div className="text-sm">
            <span className="font-medium">{clientData.name}</span> • {clientData.status}
          </div>
        </div>
      )}

      <form onSubmit={handleCreateQuote} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Título do Orçamento *
          </label>
          <input
            type="text"
            name="title"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
            placeholder="Ex: Desenvolvimento de Website"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valor Total *
            </label>
            <input
              type="text"
              name="value"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
              placeholder="5.000,00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Válido até *
            </label>
            <input
              type="date"
              name="validUntil"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descrição detalhada *
          </label>
          <textarea
            rows={4}
            name="description"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
            placeholder="Descreva os serviços inclusos no orçamento..."
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
            className="flex-1 px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
          >
            Criar Orçamento
          </button>
        </div>
      </form>
    </div>
  )
}
