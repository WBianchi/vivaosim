'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Users, Plus, Search, Mail, Phone, Check, Clock } from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'
import { motion } from 'framer-motion'

interface AllGuestsSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatId?: string
}

export function AllGuestsSidebar({ isOpen, onClose, chatId }: AllGuestsSidebarProps) {
  const [loading, setLoading] = useState(false)
  const [guests, setGuests] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchGuests()
    }
  }, [isOpen, chatId])

  const fetchGuests = async () => {
    setLoading(true)
    try {
      console.log(`🔍 AllGuestsSidebar: Buscando convidados... (chatId: ${chatId || 'todos'})`)
      
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
              // Buscar convidados do site
              const response = await fetch(`/api/sites/clientes/${site.id}/convidados`)
              const data = await response.json()
              
              console.log('👥 AllGuestsSidebar: Resposta da API:', data)
              
              if (data.success && data.convidados) {
                setGuests(data.convidados.map((c: any) => ({
                  id: c.id,
                  name: c.nome,
                  email: c.email,
                  phone: c.telefone,
                  status: c.confirmado ? 'confirmed' : 'pending',
                  companion: c.acompanhante,
                  table: c.mesa
                })))
                console.log(`✅ AllGuestsSidebar: ${data.convidados.length} convidados carregados`)
              }
            } else {
              console.log('⚠️ Site não encontrado para este contato')
            }
          }
        }
      } else {
        // Buscar todos os convidados
        const response = await fetch('/api/convidados')
        const data = await response.json()
        
        if (data.convidados) {
          setGuests(data.convidados)
        }
      }
    } catch (error) {
      console.error('❌ AllGuestsSidebar: Erro ao buscar convidados:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredGuests = guests.filter(guest => 
    guest.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'confirmed': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'pending': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'declined': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'maybe': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    }
    return colors[status] || colors.pending
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'confirmed': 'Confirmado',
      'pending': 'Pendente',
      'declined': 'Recusado',
      'maybe': 'Talvez'
    }
    return labels[status] || status
  }

  const stats = {
    total: guests.length,
    confirmed: guests.filter(g => g.status === 'confirmed').length,
    pending: guests.filter(g => g.status === 'pending').length,
    declined: guests.filter(g => g.status === 'declined').length
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <Dialog.Content 
          className="fixed right-0 top-0 h-full w-[480px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300"
          aria-describedby="guests-description"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <Dialog.Title asChild>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {chatId ? 'Convidados deste Evento' : 'Todos os Convidados'}
                  </h2>
                </Dialog.Title>
                <Dialog.Description asChild>
                  <p id="guests-description" className="text-xs text-gray-500 dark:text-gray-400">
                    {stats.confirmed} confirmados de {stats.total} convidados
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
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{stats.confirmed}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Confirmados</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Pendentes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600 dark:text-red-400">{stats.declined}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Recusados</div>
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
                placeholder="Buscar convidados..."
                className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Lista de Convidados */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : filteredGuests.length === 0 && !searchTerm ? (
              // Fallback com exemplos quando não tem convidados
              <div className="space-y-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-lg border border-purple-200 dark:border-purple-800"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                        João Silva
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        + Maria Silva
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Confirmado
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">joao.silva@email.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <Phone className="w-3 h-3" />
                      <span>(11) 98765-4321</span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Mesa 5
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-3 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                        Ana Costa
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                      Pendente
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">ana.costa@email.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <Phone className="w-3 h-3" />
                      <span>(11) 91234-5678</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                        Pedro Santos
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        + Carla Santos
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      Talvez
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">pedro.santos@email.com</span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Mesa 8
                    </div>
                  </div>
                </motion.div>

                <div className="text-center py-6">
                  <p className="text-gray-400 dark:text-gray-500 text-xs italic">
                    ⬆️ Exemplo de como os convidados aparecerão
                  </p>
                </div>
              </div>
            ) : filteredGuests.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Nenhum convidado encontrado
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredGuests.map((guest) => (
                  <motion.div
                    key={guest.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                          {guest.name}
                        </h3>
                        {guest.companion && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            + {guest.companion}
                          </p>
                        )}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(guest.status)}`}>
                        {getStatusLabel(guest.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      {guest.email && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{guest.email}</span>
                        </div>
                      )}
                      
                      {guest.phone && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <Phone className="w-3 h-3" />
                          <span>{guest.phone}</span>
                        </div>
                      )}
                      
                      {guest.table && (
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Mesa {guest.table}
                        </div>
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
