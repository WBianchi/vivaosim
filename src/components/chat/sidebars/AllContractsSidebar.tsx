'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, FileSignature, Plus, Search, Filter, ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'
import { motion, AnimatePresence } from 'framer-motion'
import { ContractSidebar } from './ContractSidebar'

interface AllContractsSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatId?: string
}

export function AllContractsSidebar({ isOpen, onClose, chatId }: AllContractsSidebarProps) {
  const [loading, setLoading] = useState(false)
  const [contracts, setContracts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedContract, setExpandedContract] = useState<string | null>(null)
  const [editingContract, setEditingContract] = useState<any | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [contactData, setContactData] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    amount: '',
    startDate: '',
    endDate: '',
    status: 'draft',
    adminSignature: '',
    clientSignature: ''
  })

  useEffect(() => {
    if (isOpen) {
      fetchContracts()
      if (chatId) {
        fetchContactData()
      }
    }
  }, [isOpen, chatId])

  const fetchContactData = async () => {
    try {
      const response = await fetch(`/api/contacts/check-chat?chatId=${chatId}`)
      const data = await response.json()
      if (data.exists && data.contact) {
        setContactData(data.contact)
      }
    } catch (error) {
      console.error('Erro ao buscar dados do contato:', error)
    }
  }

  const fetchContracts = async () => {
    setLoading(true)
    try {
      const token = getAuthToken()
      if (!token) {
        console.log('⚠️ AllContractsSidebar: Token não encontrado')
        setLoading(false)
        return
      }

      const url = chatId 
        ? `/api/contracts?chatId=${chatId}`
        : '/api/contracts'

      console.log(`🔍 AllContractsSidebar: Buscando contratos... (chatId: ${chatId || 'todos'})`)
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      console.log('📋 AllContractsSidebar: Resposta da API:', data)
      
      if (data.contracts) {
        setContracts(data.contracts)
        console.log(`✅ AllContractsSidebar: ${data.contracts.length} contratos carregados`)
      }
    } catch (error) {
      console.error('❌ AllContractsSidebar: Erro ao buscar contratos:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredContracts = contracts.filter(contract => 
    contract.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'draft': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      'pending': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'active': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'completed': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'cancelled': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    }
    return colors[status] || colors.draft
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'draft': 'Rascunho',
      'pending': 'Pendente',
      'active': 'Ativo',
      'completed': 'Concluído',
      'cancelled': 'Cancelado'
    }
    return labels[status] || status
  }

  const handleEdit = (contract: any) => {
    setEditingContract(contract)
    setEditForm({
      title: contract.title,
      description: contract.description || '',
      amount: contract.amount.toString(),
      startDate: contract.startDate ? new Date(contract.startDate).toISOString().split('T')[0] : '',
      endDate: contract.endDate ? new Date(contract.endDate).toISOString().split('T')[0] : '',
      status: contract.status,
      adminSignature: contract.providerSignature || '',
      clientSignature: contract.clientSignature || ''
    })
  }

  const handleSaveEdit = async () => {
    if (!editingContract) return

    try {
      const token = getAuthToken()
      
      const response = await fetch(`/api/contracts/${editingContract.id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          amount: parseFloat(editForm.amount),
          startDate: editForm.startDate ? new Date(editForm.startDate).toISOString() : null,
          endDate: editForm.endDate ? new Date(editForm.endDate).toISOString() : null,
          status: editForm.status,
          providerSignature: editForm.adminSignature,
          clientSignature: editForm.clientSignature
        })
      })

      if (response.ok) {
        setEditingContract(null)
        fetchContracts()
        alert('✅ Contrato atualizado com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao atualizar contrato:', error)
      alert('❌ Erro ao atualizar contrato')
    }
  }

  const handleDelete = async (contractId: string) => {
    if (!confirm('Tem certeza que deseja excluir este contrato?')) return

    try {
      const token = getAuthToken()
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setContracts(contracts.filter(c => c.id !== contractId))
        alert('✅ Contrato excluído com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao excluir contrato:', error)
      alert('❌ Erro ao excluir contrato')
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <Dialog.Content 
          className="fixed right-0 top-0 h-full w-[480px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300"
          aria-describedby="contracts-description"
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
                    {chatId ? 'Contratos deste Chat' : 'Todos os Contratos'}
                  </h2>
                </Dialog.Title>
                <Dialog.Description asChild>
                  <p id="contracts-description" className="text-xs text-gray-500 dark:text-gray-400">
                    {chatId ? 'Contratos desta conversa' : `${contracts.length} contratos encontrados`}
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

          {/* Busca */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar contratos..."
                className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Lista de Contratos */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : filteredContracts.length === 0 ? (
              <div className="text-center py-12">
                <FileSignature className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {searchTerm ? 'Nenhum contrato encontrado' : 'Nenhum contrato ainda'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredContracts.map((contract) => (
                  <motion.div
                    key={contract.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors overflow-hidden"
                  >
                    <div 
                      onClick={() => setExpandedContract(expandedContract === contract.id ? null : contract.id)}
                      className="p-4 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm flex-1">
                          {contract.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(contract.status)}`}>
                            {getStatusLabel(contract.status)}
                          </span>
                          <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                            {expandedContract === contract.id ? (
                              <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {contract.description && (
                        <p className={`text-xs text-gray-500 dark:text-gray-400 mb-2 ${expandedContract === contract.id ? '' : 'line-clamp-2'}`}>
                          {contract.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          R$ {parseFloat(contract.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {new Date(contract.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    {/* Área expandida com ações */}
                    <AnimatePresence>
                      {expandedContract === contract.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3"
                        >
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(contract)
                              }}
                              className="flex-1 py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                              Editar
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(contract.id)
                              }}
                              className="flex-1 py-2 px-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Excluir
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer com botão Novo Contrato */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Contrato
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>

      {/* Modal de Criação de Contrato */}
      {showCreateForm && (
        <ContractSidebar
          isOpen={showCreateForm}
          onClose={() => {
            setShowCreateForm(false)
            fetchContracts()
          }}
          chatId={chatId || ''}
          contactId={contactData?.id}
          contactName={contactData?.name}
        />
      )}

      {/* Modal de Edição */}
      {editingContract && (
        <Dialog.Root open={!!editingContract} onOpenChange={() => setEditingContract(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-[70] w-[500px] max-h-[80vh] overflow-y-auto">
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Editar Contrato</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor</label>
                  <input
                    type="number"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Início</label>
                    <input
                      type="date"
                      value={editForm.startDate}
                      onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Fim</label>
                    <input
                      type="date"
                      value={editForm.endDate}
                      onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assinatura Admin</label>
                  <input
                    type="text"
                    value={editForm.adminSignature}
                    onChange={(e) => setEditForm({ ...editForm, adminSignature: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assinatura Cliente</label>
                  <input
                    type="text"
                    value={editForm.clientSignature}
                    onChange={(e) => setEditForm({ ...editForm, clientSignature: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="draft">Rascunho</option>
                    <option value="pending">Pendente</option>
                    <option value="active">Ativo</option>
                    <option value="completed">Concluído</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditingContract(null)}
                    className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </Dialog.Root>
  )
}
