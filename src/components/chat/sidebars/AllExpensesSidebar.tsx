'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Receipt, Plus, Search, DollarSign, Calendar, Tag } from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'
import { motion } from 'framer-motion'

interface AllExpensesSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatId?: string
}

export function AllExpensesSidebar({ isOpen, onClose, chatId }: AllExpensesSidebarProps) {
  const [loading, setLoading] = useState(false)
  const [expenses, setExpenses] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState<any>(null)

  useEffect(() => {
    if (isOpen) {
      fetchExpenses()
    }
  }, [isOpen, chatId])

  const fetchExpenses = async () => {
    setLoading(true)
    try {
      console.log(`🔍 AllExpensesSidebar: Buscando despesas... (chatId: ${chatId || 'todos'})`)
      
      // Se tiver chatId, buscar o site do contato primeiro
      if (chatId) {
        // Buscar sites do contato
        const sitesResponse = await fetch('/api/sites/clientes')
        const sitesData = await sitesResponse.json()
        
        if (sitesData.success && sitesData.sites) {
          // Buscar o contato
          const contactResponse = await fetch(`/api/contacts/check-chat?chatId=${chatId}`)
          const contactData = await contactResponse.json()
          
          if (contactData.exists && contactData.contact) {
            const contactId = contactData.contact.id
            const site = sitesData.sites.find((s: any) => s.contactId === contactId)
            
            if (site) {
              console.log('🎯 Site encontrado:', site.id)
              // Buscar despesas do site
              const response = await fetch(`/api/sites/clientes/${site.id}/custos`)
              const data = await response.json()
              
              console.log('💰 AllExpensesSidebar: Resposta da API:', data)
              
              if (data.success && data.custos) {
                setExpenses(data.custos)
                console.log(`✅ AllExpensesSidebar: ${data.custos.length} despesas carregadas`)
              }
            } else {
              console.log('⚠️ Site não encontrado para este contato')
            }
          }
        }
      } else {
        // Buscar todas as despesas
        const response = await fetch('/api/expenses')
        const data = await response.json()
        
        if (data.expenses) {
          setExpenses(data.expenses)
        }
      }
    } catch (error) {
      console.error('❌ AllExpensesSidebar: Erro ao buscar despesas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta despesa?')) return
    
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchExpenses()
      }
    } catch (error) {
      console.error('Erro ao deletar despesa:', error)
    }
  }

  const filteredExpenses = expenses.filter(expense => 
    expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'paid': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'overdue': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'cancelled': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
    return colors[status] || colors.pending
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'Pendente',
      'paid': 'Pago',
      'overdue': 'Vencido',
      'cancelled': 'Cancelado'
    }
    return labels[status] || status
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'venue': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'catering': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'decoration': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      'photography': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'entertainment': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'other': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
    return colors[category] || colors.other
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'venue': 'Local',
      'catering': 'Buffet',
      'decoration': 'Decoração',
      'photography': 'Fotografia',
      'entertainment': 'Entretenimento',
      'other': 'Outros'
    }
    return labels[category] || category
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0)
  const totalPaid = expenses.filter(e => e.status === 'paid').reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0)
  const totalPending = expenses.filter(e => e.status === 'pending').reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0)

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <Dialog.Content 
          className="fixed right-0 top-0 h-full w-[480px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300"
          aria-describedby="expenses-description"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-xl flex items-center justify-center">
                <Receipt className="w-5 h-5 text-fuchsia-600 dark:text-fuchsia-400" />
              </div>
              <div>
                <Dialog.Title asChild>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {chatId ? 'Custos e Despesas' : 'Todos os Custos'}
                  </h2>
                </Dialog.Title>
                <Dialog.Description asChild>
                  <p id="expenses-description" className="text-xs text-gray-500 dark:text-gray-400">
                    {expenses.length} lançamentos • R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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

          {/* Stats */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total</div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pago</div>
              <div className="text-sm font-bold text-green-600 dark:text-green-400">
                R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pendente</div>
              <div className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Busca */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar custos..."
                className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>
          </div>

          {/* Lista de Custos */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuchsia-500"></div>
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {searchTerm ? 'Nenhum custo encontrado' : 'Nenhum custo registrado'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredExpenses.map((expense) => (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-fuchsia-300 dark:hover:border-fuchsia-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                          {expense.description}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(expense.category)}`}>
                            {getCategoryLabel(expense.category)}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(expense.status)}`}>
                            {getStatusLabel(expense.status)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          R$ {parseFloat(expense.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {expense.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Venc: {new Date(expense.dueDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                      {expense.supplier && (
                        <span className="truncate">{expense.supplier}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
