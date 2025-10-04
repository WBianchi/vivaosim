'use client'

import { useState, useEffect } from 'react'
import { User, Loader2, AlertCircle, ExternalLink } from 'lucide-react'

interface CreateClientSheetProps {
  chat: any
  onClose: () => void
}

export const CreateClientSheet: React.FC<CreateClientSheetProps> = ({ chat, onClose }) => {
  const [formData, setFormData] = useState({
    name: chat.name || '',
    email: '',
    cpf: '',
    phone: chat.contact?.phone || chat.id.replace('@c.us', ''),
    address: '',
    city: '',
    state: '',
    notes: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [existingClient, setExistingClient] = useState<any>(null)
  const [checkingExisting, setCheckingExisting] = useState(true)

  // Verificar se já existe cliente ao montar
  useEffect(() => {
    const checkExisting = async () => {
      try {
        const response = await fetch(`/api/contacts?whatsappChatId=${chat.id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.data && data.data.length > 0) {
            setExistingClient(data.data[0])
          }
        }
      } catch (error) {
        console.error('Erro ao verificar cliente existente:', error)
      } finally {
        setCheckingExisting(false)
      }
    }
    checkExisting()
  }, [chat.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const clientData = {
      name: formData.name,
      email: formData.email || undefined,
      cpf: formData.cpf || undefined,
      phone: formData.phone,
      address: formData.address || undefined,
      city: formData.city || undefined,
      state: formData.state || undefined,
      notes: formData.notes || undefined,
      whatsappChatId: chat.id,
      whatsappNumber: chat.contact?.phone || chat.id,
      whatsappName: chat.name,
      source: 'WHATSAPP' as const,
      createdFrom: 'chat-conversion',
      tags: ['WhatsApp', 'Lead Convertido'],
      status: 'ACTIVE'
    }

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      })

      if (response.ok) {
        const newClient = await response.json()
        console.log('✅ Cliente criado:', newClient)
        alert(`✅ Cliente "${newClient.data.name}" criado com sucesso!\n\nAgora ele aparece em /dashboard/clientes`)
        onClose()
        // Recarregar página para atualizar dados
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`❌ Erro: ${error.error}`)
      }
    } catch (error) {
      console.error('Erro ao criar cliente:', error)
      alert('❌ Erro de conexão ao criar cliente.')
    } finally {
      setIsLoading(false)
    }
  }

  // Se está verificando
  if (checkingExisting) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  // Se já existe cliente
  if (existingClient) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Cliente Já Cadastrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Este contato do WhatsApp já está vinculado a um cliente
          </p>
        </div>

        {/* Dados do Cliente Existente */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
          <h4 className="font-medium text-emerald-900 dark:text-emerald-300 mb-3">
            📋 Dados do Cliente
          </h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Nome:</span> {existingClient.name}</div>
            {existingClient.email && <div><span className="font-medium">Email:</span> {existingClient.email}</div>}
            {existingClient.phone && <div><span className="font-medium">Telefone:</span> {existingClient.phone}</div>}
            {existingClient.cpf && <div><span className="font-medium">CPF:</span> {existingClient.cpf}</div>}
            <div><span className="font-medium">ID:</span> {existingClient.id}</div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Fechar
          </button>
          <a
            href={`/dashboard/clientes?id=${existingClient.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center justify-center gap-2"
          >
            Ver Cliente
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    )
  }

  // Formulário de criação (se não existe)
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Converter Lead em Cliente
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Preencha os dados para criar o cadastro completo em /dashboard/clientes
        </p>
      </div>

      {/* Dados do WhatsApp (pré-preenchidos) */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
          📱 Dados do WhatsApp (automático)
        </h4>
        <div className="space-y-2 text-sm">
          <div><span className="font-medium">Nome:</span> {chat.name}</div>
          <div><span className="font-medium">Telefone:</span> {chat.contact?.phone || chat.id}</div>
          <div><span className="font-medium">Chat ID:</span> {chat.id}</div>
        </div>
      </div>

      {/* Formulário completo */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
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
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CPF
            </label>
            <input
              type="text"
              value={formData.cpf}
              onChange={(e) => setFormData({...formData, cpf: e.target.value})}
              placeholder="000.000.000-00"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Endereço
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cidade
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              placeholder="SP"
              maxLength={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Informações adicionais sobre o cliente..."
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Cliente'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
