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
      const token = getAuthToken()
      if (!token) {
        console.log('⚠️ AllGuestsSidebar: Token não encontrado')
        setLoading(false)
        return
      }

      const url = chatId 
        ? `/api/convidados?chatId=${chatId}`
        : '/api/convidados'

      console.log(`🔍 AllGuestsSidebar: Buscando convidados... (chatId: ${chatId || 'todos'})`)
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      console.log('👥 AllGuestsSidebar: Resposta da API:', data)
      
      if (data.convidados) {
        setGuests(data.convidados)
        console.log(`✅ AllGuestsSidebar: ${data.convidados.length} convidados carregados`)
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
            ) : filteredGuests.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {searchTerm ? 'Nenhum convidado encontrado' : 'Nenhum convidado ainda'}
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
