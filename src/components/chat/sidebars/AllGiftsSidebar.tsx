'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Gift, Plus, Search, DollarSign, Package, ShoppingBag } from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'
import { motion } from 'framer-motion'

interface AllGiftsSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatId?: string
}

export function AllGiftsSidebar({ isOpen, onClose, chatId }: AllGiftsSidebarProps) {
  const [loading, setLoading] = useState(false)
  const [gifts, setGifts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchGifts()
    }
  }, [isOpen, chatId])

  const fetchGifts = async () => {
    setLoading(true)
    try {
      const token = getAuthToken()
      if (!token) {
        console.log('⚠️ AllGiftsSidebar: Token não encontrado')
        setLoading(false)
        return
      }

      const url = chatId 
        ? `/api/compras?chatId=${chatId}`
        : '/api/compras'

      console.log(`🔍 AllGiftsSidebar: Buscando presentes... (chatId: ${chatId || 'todos'})`)
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      console.log('🎁 AllGiftsSidebar: Resposta da API:', data)
      
      if (data.compras) {
        setGifts(data.compras)
        console.log(`✅ AllGiftsSidebar: ${data.compras.length} presentes carregados`)
      }
    } catch (error) {
      console.error('❌ AllGiftsSidebar: Erro ao buscar presentes:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredGifts = gifts.filter(gift => 
    gift.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gift.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'available': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'reserved': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'purchased': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'unavailable': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
    return colors[status] || colors.available
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'available': 'Disponível',
      'reserved': 'Reservado',
      'purchased': 'Comprado',
      'unavailable': 'Indisponível'
    }
    return labels[status] || status
  }

  const totalGifts = gifts.length
  const totalValue = gifts.reduce((sum, gift) => sum + (parseFloat(gift.price) || 0), 0)
  const purchased = gifts.filter(g => g.status === 'purchased').length
  const available = gifts.filter(g => g.status === 'available').length

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <Dialog.Content 
          className="fixed right-0 top-0 h-full w-[480px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300"
          aria-describedby="gifts-description"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <Dialog.Title asChild>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {chatId ? 'Lista de Presentes' : 'Todos os Presentes'}
                  </h2>
                </Dialog.Title>
                <Dialog.Description asChild>
                  <p id="gifts-description" className="text-xs text-gray-500 dark:text-gray-400">
                    {totalGifts} itens • R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
          <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">{totalGifts}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{available}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Disponíveis</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{purchased}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Comprados</div>
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
                placeholder="Buscar presentes..."
                className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Lista de Presentes */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
              </div>
            ) : filteredGifts.length === 0 ? (
              <div className="text-center py-12">
                <Gift className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {searchTerm ? 'Nenhum presente encontrado' : 'Nenhum presente cadastrado'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredGifts.map((gift) => (
                  <motion.div
                    key={gift.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/10 dark:to-pink-900/10 rounded-lg border border-rose-200 dark:border-rose-800 hover:border-rose-400 dark:hover:border-rose-600 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {gift.image ? (
                        <img 
                          src={gift.image} 
                          alt={gift.name}
                          className="w-16 h-16 rounded-lg object-cover border-2 border-white dark:border-gray-700 shadow"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-rose-400" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {gift.name}
                          </h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(gift.status)}`}>
                            {getStatusLabel(gift.status)}
                          </span>
                        </div>
                        
                        {gift.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {gift.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-sm font-bold">
                              R$ {parseFloat(gift.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          
                          {gift.quantity && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <ShoppingBag className="w-3 h-3" />
                              <span>Qtd: {gift.quantity}</span>
                            </div>
                          )}
                        </div>

                        {gift.purchasedBy && (
                          <div className="mt-2 pt-2 border-t border-rose-200 dark:border-rose-800">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Comprado por: <span className="font-medium">{gift.purchasedBy.name}</span>
                            </p>
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
