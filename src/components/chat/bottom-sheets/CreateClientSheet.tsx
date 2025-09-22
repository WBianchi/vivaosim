'use client'

import { User } from 'lucide-react'

interface CreateClientSheetProps {
  chat: any
  onClose: () => void
}

export const CreateClientSheet: React.FC<CreateClientSheetProps> = ({ chat, onClose }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Transformar em Cliente
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Complete as informações para converter este lead em cliente
        </p>
      </div>

      {/* Dados do WhatsApp (pré-preenchidos) */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
          📱 Dados do WhatsApp
        </h4>
        <div className="space-y-2 text-sm">
          <div><span className="font-medium">Nome:</span> {chat.name}</div>
          <div><span className="font-medium">Telefone:</span> {chat.contact?.phone || chat.id}</div>
          <div><span className="font-medium">Chat ID:</span> {chat.id}</div>
        </div>
      </div>

      {/* Formulário simplificado */}
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            name="name"
            defaultValue={chat.name}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </form>

      {/* Botões */}
      <div className="flex space-x-3 pt-4">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={async () => {
            console.log('💾 Criando cliente...')
            
            const clientData = {
              name: chat.name || 'Cliente WhatsApp',
              whatsappChatId: chat.id,
              whatsappNumber: chat.contact?.phone || chat.id,
              whatsappName: chat.name,
              source: 'WHATSAPP' as const,
              createdFrom: 'chat-conversion',
              tags: ['WhatsApp', 'Lead Qualificado']
            }

            try {
              const response = await fetch('/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clientData)
              })

              if (response.ok) {
                const newClient = await response.json()
                console.log('✅ Cliente criado:', newClient.id)
                onClose()
                alert(`✅ Cliente criado: ${newClient.name}`)
              } else {
                const error = await response.json()
                alert(`❌ Erro: ${error.error}`)
              }
            } catch (error) {
              alert('❌ Erro de conexão.')
            }
          }}
          className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
        >
          Criar Cliente
        </button>
      </div>
    </div>
  )
}
