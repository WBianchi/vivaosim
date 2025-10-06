'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Calendar, Plus, Search, Clock, MapPin, Users } from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'
import { motion } from 'framer-motion'

interface AllSchedulesSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatId?: string
}

export function AllSchedulesSidebar({ isOpen, onClose, chatId }: AllSchedulesSidebarProps) {
  const [loading, setLoading] = useState(false)
  const [schedules, setSchedules] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchSchedules()
    }
  }, [isOpen, chatId])

  const fetchSchedules = async () => {
    setLoading(true)
    try {
      const token = getAuthToken()
      if (!token) {
        console.log('⚠️ AllSchedulesSidebar: Token não encontrado')
        setLoading(false)
        return
      }

      const url = chatId 
        ? `/api/agendamentos?chatId=${chatId}`
        : '/api/agendamentos'

      console.log(`🔍 AllSchedulesSidebar: Buscando agendamentos... (chatId: ${chatId || 'todos'})`)
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      console.log('📅 AllSchedulesSidebar: Resposta da API:', data)
      
      if (data.agendamentos) {
        setSchedules(data.agendamentos)
        console.log(`✅ AllSchedulesSidebar: ${data.agendamentos.length} agendamentos carregados`)
      }
    } catch (error) {
      console.error('❌ AllSchedulesSidebar: Erro ao buscar agendamentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSchedules = schedules.filter(schedule => 
    schedule.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'scheduled': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'confirmed': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'cancelled': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'completed': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    }
    return colors[status] || colors.scheduled
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'scheduled': 'Agendado',
      'confirmed': 'Confirmado',
      'cancelled': 'Cancelado',
      'completed': 'Concluído'
    }
    return labels[status] || status
  }

  const formatDateTime = (date: string) => {
    const d = new Date(date)
    return {
      date: d.toLocaleDateString('pt-BR'),
      time: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <Dialog.Content 
          className="fixed right-0 top-0 h-full w-[480px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300"
          aria-describedby="schedules-description"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <Dialog.Title asChild>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {chatId ? 'Agendamentos deste Chat' : 'Todos os Agendamentos'}
                  </h2>
                </Dialog.Title>
                <Dialog.Description asChild>
                  <p id="schedules-description" className="text-xs text-gray-500 dark:text-gray-400">
                    {chatId ? 'Agendamentos desta conversa' : `${schedules.length} agendamentos encontrados`}
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
                placeholder="Buscar agendamentos..."
                className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Lista de Agendamentos */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredSchedules.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {searchTerm ? 'Nenhum agendamento encontrado' : 'Nenhum agendamento ainda'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSchedules.map((schedule) => {
                  const { date, time } = formatDateTime(schedule.date)
                  return (
                    <motion.div
                      key={schedule.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm flex-1">
                          {schedule.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(schedule.status)}`}>
                          {getStatusLabel(schedule.status)}
                        </span>
                      </div>
                      
                      {schedule.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                          {schedule.description}
                        </p>
                      )}
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{date} às {time}</span>
                        </div>
                        
                        {schedule.location && (
                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{schedule.location}</span>
                          </div>
                        )}
                        
                        {schedule.attendees && (
                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Users className="w-3.5 h-3.5" />
                            <span>{schedule.attendees} participantes</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
