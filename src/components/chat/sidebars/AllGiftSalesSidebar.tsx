'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, ShoppingCart, Plus, Search, DollarSign, Calendar, User, CheckCircle, Clock } from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'
import { motion } from 'framer-motion'

interface AllGiftSalesSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatId?: string
}

export function AllGiftSalesSidebar({ isOpen, onClose, chatId }: AllGiftSalesSidebarProps) {
  const [loading, setLoading] = useState(false)
  const [sales, setSales] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchSales()
    }
  }, [isOpen, chatId])

  const fetchSales = async () => {
    setLoading(true)
    try {
      const token = getAuthToken()
      if (!token) {
        console.log('⚠️ AllGiftSalesSidebar: Token não encontrado')
        setLoading(false)
        return
      }

      const url = chatId 
        ? `/api/recebimentos?chatId=${chatId}`
        : '/api/recebimentos'

      console.log(`🔍 AllGiftSalesSidebar: Buscando vendas... (chatId: ${chatId || 'todos'})`)
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      console.log('🛒 AllGiftSalesSidebar: Resposta da API:', data)
      
      if (data.recebimentos) {
        setSales(data.recebimentos)
        console.log(`✅ AllGiftSalesSidebar: ${data.recebimentos.length} vendas carregadas`)
      }
    } catch (error) {
      console.error('❌ AllGiftSalesSidebar: Erro ao buscar vendas:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSales = sales.filter(sale => 
    sale.giftName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.buyerName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'paid': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'cancelled': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'refunded': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
    return colors[status] || colors.pending
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'Pendente',
      'paid': 'Pago',
      'cancelled': 'Cancelado',
      'refunded': 'Reembolsado'
    }
    return labels[status] || status
  }

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      'pix': 'PIX',
      'credit_card': 'Cartão de Crédito',
      'debit_card': 'Cartão de Débito',
      'cash': 'Dinheiro',
      'transfer': 'Transferência'
    }
    return labels[method] || method
  }

  const totalSales = sales.length
  const totalRevenue = sales.filter(s => s.status === 'paid').reduce((sum, sale) => sum + (parseFloat(sale.amount) || 0), 0)
  const pendingAmount = sales.filter(s => s.status === 'pending').reduce((sum, sale) => sum + (parseFloat(sale.amount) || 0), 0)
  const paidCount = sales.filter(s => s.status === 'paid').length

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <Dialog.Content 
          className="fixed right-0 top-0 h-full w-[480px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300"
          aria-describedby="sales-description"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <Dialog.Title asChild>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Vendas de Presentes
                  </h2>
                </Dialog.Title>
                <Dialog.Description asChild>
                  <p id="sales-description" className="text-xs text-gray-500 dark:text-gray-400">
                    {totalSales} venda(s) • R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Vendas</div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">{totalSales}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Recebido</div>
              <div className="text-sm font-bold text-green-600 dark:text-green-400">
                R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pendente</div>
              <div className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                R$ {pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                placeholder="Buscar vendas..."
                className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Lista de Vendas */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              </div>
            ) : filteredSales.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {searchTerm ? 'Nenhuma venda encontrada' : 'Nenhuma venda registrada'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSales.map((sale) => (
                  <motion.div
                    key={sale.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                          {sale.giftName || 'Presente'}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(sale.status)}`}>
                            {getStatusLabel(sale.status)}
                          </span>
                          {sale.paymentMethod && (
                            <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                              {getPaymentMethodLabel(sale.paymentMethod)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          R$ {parseFloat(sale.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {sale.buyerName && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <User className="w-3.5 h-3.5" />
                          <span>{sale.buyerName}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(sale.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                        
                        {sale.status === 'paid' && (
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Confirmado</span>
                          </div>
                        )}
                        
                        {sale.status === 'pending' && (
                          <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Aguardando</span>
                          </div>
                        )}
                      </div>
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
