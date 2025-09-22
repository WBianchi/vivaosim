'use client'

import { User } from 'lucide-react'

interface EditClientSheetProps {
  chat: any
  clientData: any
  onClose: () => void
}

export const EditClientSheet: React.FC<EditClientSheetProps> = ({ chat, clientData, onClose }) => {
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
        onClose()
        alert(`✅ Perfil de "${updatedClient.name}" atualizado com sucesso!`)
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
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Editar Perfil do Cliente
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Atualize as informações de {clientData?.name || 'desconhecido'}
        </p>
      </div>

      {/* Status atual do cliente */}
      {clientData && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
            📊 Status Atual
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="font-medium">Status:</span> {clientData.status}</div>
            <div><span className="font-medium">Criado:</span> {new Date(clientData.createdAt).toLocaleDateString('pt-BR')}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleUpdateClient} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
              value={clientData?.whatsappNumber || chat.id}
              title="Número do WhatsApp não pode ser alterado"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              defaultValue={clientData?.email || ''}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
            />
          </div>
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
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Observações
          </label>
          <textarea
            rows={3}
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
            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  )
}
