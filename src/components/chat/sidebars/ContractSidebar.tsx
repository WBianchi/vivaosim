'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { 
  X, 
  FileSignature, 
  Save,
  Loader2,
  Calendar,
  DollarSign,
  User
} from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'

interface ContractSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatId: string
  contactId?: string
  contactName?: string
}

export function ContractSidebar({ isOpen, onClose, chatId, contactId, contactName }: ContractSidebarProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    value: '',
    startDate: '',
    endDate: '',
    paymentTerms: '',
    status: 'draft'
  })

  const handleSubmit = async () => {
    if (!formData.title || !formData.value) {
      alert('❌ Preencha título e valor')
      return
    }

    setLoading(true)
    
    try {
      const token = getAuthToken()
      if (!token) {
        alert('❌ Token não encontrado')
        setLoading(false)
        return
      }

      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          value: parseFloat(formData.value),
          chatId,
          contactId
        })
      })

      const data = await response.json()

      if (data.contract) {
        // Toast de sucesso
        const toast = document.createElement('div')
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] flex items-center gap-2'
        toast.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="font-medium">Contrato criado com sucesso!</span>
        `
        document.body.appendChild(toast)
        setTimeout(() => toast.remove(), 3000)

        // Limpar form e fechar
        setFormData({
          title: '',
          description: '',
          value: '',
          startDate: '',
          endDate: '',
          paymentTerms: '',
          status: 'draft'
        })
        onClose()
      }
    } catch (error) {
      console.error('Erro ao criar contrato:', error)
      alert('❌ Erro ao criar contrato')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <Dialog.Content 
          className="fixed right-0 top-0 h-full w-[480px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300"
          aria-describedby="contract-description"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <FileSignature className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <Dialog.Title asChild>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Criar Contrato
                  </h2>
                </Dialog.Title>
                <Dialog.Description asChild>
                  <p id="contract-description" className="text-xs text-gray-500 dark:text-gray-400">
                    {contactName || 'Novo contrato'}
                  </p>
                </Dialog.Description>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título do Contrato *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Contrato de Prestação de Serviços"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Descreva os detalhes do contrato..."
              />
            </div>

            {/* Valor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor Total *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0,00"
                  step="0.01"
                />
              </div>
            </div>

            {/* Datas */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data Início
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data Fim
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Condições de Pagamento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Condições de Pagamento
              </label>
              <textarea
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: 50% entrada, 50% na entrega"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="draft">Rascunho</option>
                <option value="pending">Pendente</option>
                <option value="active">Ativo</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Criar Contrato
                </>
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
