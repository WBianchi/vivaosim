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
      console.log(`🔍 AllGiftsSidebar: Buscando presentes... (chatId: ${chatId || 'todos'})`)
      
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
              // Buscar produtos do site
              const response = await fetch(`/api/sites/clientes/${site.id}/produtos`)
              const data = await response.json()
              
              console.log('🎁 AllGiftsSidebar: Resposta da API:', data)
              
              if (data.success && data.produtos) {
                setGifts(data.produtos.map((p: any) => ({
                  id: p.id,
                  name: p.nome,
                  description: p.descricao,
                  price: p.preco,
                  image: p.imagem,
                  status: p.disponivel ? 'available' : 'unavailable',
                  quantity: p.quantidade || 1
                })))
                console.log(`✅ AllGiftsSidebar: ${data.produtos.length} presentes carregados`)
              }
            } else {
              console.log('⚠️ Site não encontrado para este contato')
            }
          }
        }
      } else {
        // Buscar todos os produtos
        const response = await fetch('/api/compras')
        const data = await response.json()
        
        if (data.compras) {
          setGifts(data.compras)
        }
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
            ) : filteredGifts.length === 0 && !searchTerm ? (
              // Fallback com exemplos quando não tem presentes
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/10 dark:to-pink-900/10 rounded-lg border border-rose-200 dark:border-rose-800 hover:border-rose-400 dark:hover:border-rose-600 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-rose-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                          Jogo de Panelas Premium
                        </h3>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Disponível
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        Conjunto completo com 12 peças em aço inoxidável com revestimento antiaderente
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm font-bold">
                            R$ 450,00
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <ShoppingBag className="w-3 h-3" />
                          <span>Qtd: 1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-lg border border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-blue-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                          Liquidificador Turbo
                        </h3>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          Comprado
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        Liquidificador de alta potência com 12 velocidades e copo de vidro
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm font-bold">
                            R$ 280,00
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Comprado por: <span className="font-medium">Maria Santos</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 rounded-lg border border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-amber-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                          Jogo de Toalhas Luxo
                        </h3>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                          Reservado
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        Kit com 6 toalhas de banho e 6 toalhas de rosto em algodão egípcio
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm font-bold">
                            R$ 320,00
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <ShoppingBag className="w-3 h-3" />
                          <span>Qtd: 1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="text-center py-6">
                  <p className="text-gray-400 dark:text-gray-500 text-xs italic">
                    ⬆️ Exemplo de como os presentes aparecerão
                  </p>
                </div>
              </div>
            ) : filteredGifts.length === 0 ? (
              <div className="text-center py-12">
                <Gift className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Nenhum presente encontrado
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
