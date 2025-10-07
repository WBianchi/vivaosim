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
      console.log(`🔍 AllGiftSalesSidebar: Buscando vendas... (chatId: ${chatId || 'todos'})`)
      
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
              // Buscar recebimentos do site
              const response = await fetch(`/api/sites/clientes/${site.id}/recebimentos`)
              const data = await response.json()
              
              console.log('🛒 AllGiftSalesSidebar: Resposta da API:', data)
              
              if (data.success && data.recebimentos) {
                setSales(data.recebimentos.map((r: any) => ({
                  id: r.id,
                  giftName: r.produto?.nome || 'Presente',
                  description: r.produto?.descricao,
                  amount: r.valor,
                  status: r.statusPagamento === 'PAGO' ? 'paid' : 'pending',
                  paymentMethod: r.metodoPagamento,
                  buyerName: r.nomeComprador,
                  createdAt: r.createdAt
                })))
                console.log(`✅ AllGiftSalesSidebar: ${data.recebimentos.length} vendas carregadas`)
              }
            } else {
              console.log('⚠️ Site não encontrado para este contato')
            }
          }
        }
      } else {
        // Buscar todas as vendas
        const response = await fetch('/api/recebimentos')
        const data = await response.json()
        
        if (data.recebimentos) {
          setSales(data.recebimentos)
        }
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
            ) : filteredSales.length === 0 && !searchTerm ? (
              // Fallback com exemplo quando não tem vendas
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Foto do Produto */}
                  <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 flex items-center justify-center">
                    <ShoppingCart className="w-16 h-16 text-emerald-300 dark:text-emerald-700" />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold shadow-lg bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                        Pendente
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {/* Título */}
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                      Kit Churrasco Premium
                    </h3>
                    
                    {/* Descrição */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      Kit completo com espetos, pinças e tábua de madeira nobre. Perfeito para churrascos em família.
                    </p>
                    
                    {/* Preço Total */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Preço Total</span>
                      <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        R$ 250,00
                      </span>
                    </div>
                    
                    {/* Forma de Pagamento */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Forma de Pagamento</span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium">
                        PIX
                      </span>
                    </div>
                    
                    {/* Status do Pagamento */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Status do Pagamento</span>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Aguardando Pagamento
                        </span>
                      </div>
                    </div>
                    
                    {/* Comprador e Data */}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>João Silva</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date().toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <div className="text-center py-6">
                  <p className="text-gray-400 dark:text-gray-500 text-xs italic">
                    ⬆️ Exemplo de como as vendas aparecerão
                  </p>
                </div>
              </div>
            ) : filteredSales.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Nenhuma venda encontrada
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSales.map((sale) => (
                  <motion.div
                    key={sale.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    {/* Foto do Produto */}
                    {sale.giftImage && (
                      <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20">
                        <img 
                          src={sale.giftImage} 
                          alt={sale.giftName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getStatusColor(sale.status)}`}>
                            {getStatusLabel(sale.status)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4">
                      {/* Título */}
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                        {sale.giftName || 'Presente'}
                      </h3>
                      
                      {/* Descrição */}
                      {sale.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {sale.description}
                        </p>
                      )}
                      
                      {/* Preço Total */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Preço Total</span>
                        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          R$ {parseFloat(sale.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      
                      {/* Forma de Pagamento */}
                      {sale.paymentMethod && (
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Forma de Pagamento</span>
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium">
                            {getPaymentMethodLabel(sale.paymentMethod)}
                          </span>
                        </div>
                      )}
                      
                      {/* Status do Pagamento */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Status do Pagamento</span>
                        <div className="flex items-center gap-2">
                          {sale.status === 'paid' && <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />}
                          {sale.status === 'pending' && <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {getStatusLabel(sale.status)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Comprador e Data */}
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        {sale.buyerName && (
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            <span>{sale.buyerName}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(sale.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
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
