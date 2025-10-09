'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Calendar, Plus, Search, Clock, MapPin, Users, ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'
import { motion, AnimatePresence } from 'framer-motion'

interface AllSchedulesSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatId?: string
}

export function AllSchedulesSidebar({ isOpen, onClose, chatId }: AllSchedulesSidebarProps) {
  const [loading, setLoading] = useState(false)
  const [schedules, setSchedules] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [clientData, setClientData] = useState<any>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [expandedSchedule, setExpandedSchedule] = useState<string | null>(null)
  const [editingSchedule, setEditingSchedule] = useState<any | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    location: '',
    status: 'scheduled'
  })

  useEffect(() => {
    if (isOpen) {
      fetchCurrentUser()
      if (chatId) {
        fetchClientData()
      } else {
        fetchSchedules()
      }
    }
  }, [isOpen, chatId])

  useEffect(() => {
    if (isOpen && clientData) {
      fetchSchedules()
    }
  }, [clientData])

  const fetchCurrentUser = async () => {
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setCurrentUserId(data.user?.id || null)
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
    }
  }

  const fetchClientData = async () => {
    try {
      const response = await fetch(`/api/contacts/check-chat?chatId=${chatId}`)
      const data = await response.json()
      if (data.exists && data.contact) {
        setClientData(data.contact)
      }
    } catch (error) {
      console.error('Erro ao buscar cliente:', error)
    }
  }

  const fetchSchedules = async () => {
    setLoading(true)
    try {
      console.log(`🔍 AllSchedulesSidebar: Buscando agendamentos... (chatId: ${chatId || 'todos'})`)
      
      // Buscar agendamentos
      const url = chatId && clientData
        ? `/api/schedules?contactId=${clientData.id}`
        : '/api/schedules'
      
      const response = await fetch(url)
      const data = await response.json()
      
      console.log('📅 AllSchedulesSidebar: Resposta da API:', data)
      
      // A API pode retornar array direto ou objeto com schedules
      const schedulesList = Array.isArray(data) ? data : (data.schedules || [])
      setSchedules(schedulesList)
      console.log(`✅ AllSchedulesSidebar: ${schedulesList.length} agendamentos carregados`)
    } catch (error) {
      console.error('❌ AllSchedulesSidebar: Erro ao buscar agendamentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('📅 Criando agendamento...')

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const date = formData.get('date') as string
    const time = formData.get('time') as string
    const datetime = new Date(`${date}T${time}`)

    const scheduleData = {
      title: formData.get('title') as string,
      datetime: datetime.toISOString(),
      duration: parseInt(formData.get('duration') as string),
      location: formData.get('location') as string,
      meetingLink: formData.get('meetingLink') as string || undefined,
      description: formData.get('description') as string,
      contactId: clientData?.id,
      status: 'scheduled',
      createdById: currentUserId
    }

    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleData)
      })

      if (response.ok) {
        const newSchedule = await response.json()
        console.log('✅ Agendamento criado:', newSchedule.id)
        setShowCreateForm(false)
        fetchSchedules()
        alert(`✅ Reunião "${scheduleData.title}" agendada!\n📅 Data: ${date} às ${time}`)
      } else {
        const error = await response.json()
        console.error('❌ Erro:', error)
        alert(`❌ Erro ao criar agendamento: ${error.error}`)
      }
    } catch (error) {
      console.error('❌ Erro na requisição:', error)
      alert('❌ Erro de conexão.')
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

  const handleEdit = (schedule: any) => {
    const scheduleDate = new Date(schedule.datetime || schedule.date)
    setEditingSchedule(schedule)
    setEditForm({
      title: schedule.title,
      description: schedule.description || '',
      date: scheduleDate.toISOString().split('T')[0],
      time: scheduleDate.toTimeString().slice(0, 5),
      duration: schedule.duration || 60,
      location: schedule.location || '',
      status: schedule.status
    })
  }

  const handleSaveEdit = async () => {
    if (!editingSchedule) return

    try {
      const token = getAuthToken()
      const datetime = new Date(`${editForm.date}T${editForm.time}`)
      
      const response = await fetch(`/api/schedules/${editingSchedule.id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...editForm,
          datetime: datetime.toISOString()
        })
      })

      const data = await response.json()

      if (data.success || response.ok) {
        setSchedules(schedules.map(s => s.id === editingSchedule.id ? data.schedule : s))
        setEditingSchedule(null)
        alert('✅ Agendamento atualizado com sucesso!')
        fetchSchedules()
      }
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error)
      alert('❌ Erro ao atualizar agendamento')
    }
  }

  const handleDelete = async (scheduleId: string) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return

    try {
      const token = getAuthToken()
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setSchedules(schedules.filter(s => s.id !== scheduleId))
        alert('✅ Agendamento excluído com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error)
      alert('❌ Erro ao excluir agendamento')
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
                  const { date, time } = formatDateTime(schedule.datetime || schedule.date)
                  return (
                    <motion.div
                      key={schedule.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 transition-colors overflow-hidden"
                    >
                      <div 
                        onClick={() => setExpandedSchedule(expandedSchedule === schedule.id ? null : schedule.id)}
                        className="p-4 cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm flex-1">
                            {schedule.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(schedule.status)}`}>
                              {getStatusLabel(schedule.status)}
                            </span>
                            <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                              {expandedSchedule === schedule.id ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        {schedule.description && (
                          <p className={`text-xs text-gray-500 dark:text-gray-400 mb-3 ${expandedSchedule === schedule.id ? '' : 'line-clamp-2'}`}>
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
                      </div>

                      {/* Área expandida com ações */}
                      <AnimatePresence>
                        {expandedSchedule === schedule.id && (
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
                                  handleEdit(schedule)
                                }}
                                className="flex-1 py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                                Editar
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDelete(schedule.id)
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
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer com botão Novo Agendamento */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Agendamento
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>

      {/* Modal de Criação */}
      {showCreateForm && (
        <Dialog.Root open={showCreateForm} onOpenChange={() => setShowCreateForm(false)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-[70] w-[500px] max-h-[80vh] overflow-y-auto">
              <form onSubmit={handleCreateSchedule} className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Novo Agendamento</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="Ex: Reunião com cliente"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Detalhes do agendamento..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Data *
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Horário *
                    </label>
                    <input
                      type="time"
                      name="time"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duração (min)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      defaultValue={60}
                      min={15}
                      step={15}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Local
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="Ex: Escritório"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Link da Reunião
                  </label>
                  <input
                    type="url"
                    name="meetingLink"
                    placeholder="https://meet.google.com/..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                  >
                    Criar Agendamento
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}

      {/* Modal de Edição */}
      {editingSchedule && (
        <Dialog.Root open={!!editingSchedule} onOpenChange={() => setEditingSchedule(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-[70] w-[500px] max-h-[80vh] overflow-y-auto">
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Editar Agendamento</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Data *
                    </label>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Horário *
                    </label>
                    <input
                      type="time"
                      value={editForm.time}
                      onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Local
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="scheduled">Agendado</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="cancelled">Cancelado</option>
                    <option value="completed">Concluído</option>
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
                    onClick={() => setEditingSchedule(null)}
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
