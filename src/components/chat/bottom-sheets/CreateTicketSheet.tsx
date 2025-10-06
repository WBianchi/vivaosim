'use client'

import { Ticket } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getAuthToken } from '@/lib/auth-token'

interface CreateTicketSheetProps {
  chat: any
  clientData?: any
  onClose: () => void
}

export const CreateTicketSheet: React.FC<CreateTicketSheetProps> = ({ chat, clientData, onClose }) => {
  const [users, setUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [hasLoadedUsers, setHasLoadedUsers] = useState(false)

  // Buscar usuários SOMENTE quando necessário (lazy load)
  useEffect(() => {
    // Buscar apenas o usuário atual primeiro (mais rápido)
    const fetchCurrentUser = async () => {
      try {
        const token = getAuthToken()
        if (!token) return

        const userResponse = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setCurrentUserId(userData.user?.id || null)
        }
      } catch (error) {
        console.error('Erro ao buscar usuário atual:', error)
      }
    }
    
    fetchCurrentUser()
    
    // Carregar lista de usuários em background (não bloqueia abertura)
    const timer = setTimeout(() => {
      fetchUsersList()
    }, 100) // Pequeno delay para não bloquear a abertura
    
    return () => clearTimeout(timer)
  }, [])

  const fetchUsersList = async () => {
    if (hasLoadedUsers) return
    
    setLoadingUsers(true)
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
        setHasLoadedUsers(true)
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🎫 Criando ticket...')

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const assignedToId = formData.get('assignedToId') as string
    
    const ticketData = {
      title: formData.get('title') as string,
      priority: formData.get('priority') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      contactId: clientData?.id,
      chatId: chat.id,
      status: 'open',
      createdById: currentUserId,
      assignedToId: assignedToId && assignedToId !== '' ? assignedToId : undefined
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
              <option value="">Geral</option>
              <option value="technical">Técnico</option>
              <option value="billing">Financeiro</option>
              <option value="general">Geral</option>
            </select>
          </div>
        </div>

        {/* Atribuir Atendente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Atribuir para (opcional)
          </label>
          <select 
            name="assignedToId"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
            disabled={loadingUsers}
          >
            <option value="">Não atribuído</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} {user.email && `(${user.email})`}
              </option>
            ))}
          </select>
          {loadingUsers && (
            <p className="text-xs text-gray-500 mt-1">Carregando atendentes...</p>
          )}
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
