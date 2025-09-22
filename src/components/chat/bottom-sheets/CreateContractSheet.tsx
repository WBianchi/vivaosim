'use client'

import { FileSignature } from 'lucide-react'

interface CreateContractSheetProps {
  chat: any
  clientData?: any
  onClose: () => void
}

export const CreateContractSheet: React.FC<CreateContractSheetProps> = ({ chat, clientData, onClose }) => {
  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('📋 Criando contrato...')

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const contractData = {
      title: formData.get('title') as string,
      value: formData.get('value') as string,
      duration: formData.get('duration') as string,
      description: formData.get('description') as string,
      contactId: clientData?.id,
      whatsappChatId: chat.id,
      status: 'draft'
    }

    try {
      // TODO: Implementar API de contratos
      console.log('Dados do contrato:', contractData)
      onClose()
      alert(`✅ Contrato "${contractData.title}" criado!\n💰 Valor: R$ ${contractData.value}`)
    } catch (error) {
      console.error('❌ Erro na requisição:', error)
      alert('❌ Erro de conexão.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileSignature className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Criar Contrato
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Gere um contrato para {clientData?.name || 'este cliente'}
        </p>
      </div>

      {/* Info do cliente */}
      {clientData && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
          <h4 className="font-medium text-indigo-900 dark:text-indigo-300 mb-2">
            🎯 Cliente
          </h4>
          <div className="text-sm">
            <span className="font-medium">{clientData.name}</span> • {clientData.status}
          </div>
        </div>
      )}

      <form onSubmit={handleCreateContract} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Título do Contrato *
          </label>
          <input
            type="text"
            name="title"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="Ex: Contrato de Prestação de Serviços"
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="5.000,00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duração
            </label>
            <select 
              name="duration"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Selecionar...</option>
              <option value="1_month">1 mês</option>
              <option value="3_months">3 meses</option>
              <option value="6_months">6 meses</option>
              <option value="12_months">12 meses</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descrição dos Serviços *
          </label>
          <textarea
            rows={4}
            name="description"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="Descreva detalhadamente os serviços que serão prestados..."
            required
          />
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-300">
            <FileSignature className="w-4 h-4" />
            <span className="text-sm font-medium">Próximos Passos</span>
          </div>
          <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-400 list-disc list-inside space-y-1">
            <li>Contrato será salvo como rascunho</li>
            <li>Você poderá revisar antes de enviar</li>
            <li>Cliente receberá link para assinatura digital</li>
          </ul>
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
            className="flex-1 px-4 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
          >
            Criar Contrato
          </button>
        </div>
      </form>
    </div>
  )
}
