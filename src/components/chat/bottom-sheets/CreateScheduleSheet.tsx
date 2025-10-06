'use client'

import { Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getAuthToken } from '@/lib/auth-token'

interface CreateScheduleSheetProps {
  chat: any
  clientData?: any
  onClose: () => void
}

export const CreateScheduleSheet: React.FC<CreateScheduleSheetProps> = ({ chat, clientData, onClose }) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Buscar usuário atual em background (não bloqueia)
  useEffect(() => {
    const timer = setTimeout(() => {
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
      fetchCurrentUser()
    }, 50) // Delay mínimo para não bloquear abertura
    
    return () => clearTimeout(timer)
  }, [])

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
        onClose()
        alert(`✅ Reunião "${newSchedule.title}" agendada!\n📅 Data: ${date} às ${time}`)
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Agendar Reunião
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Marque uma reunião com {clientData?.name || 'este cliente'}
        </p>
      </div>

      {/* Info do cliente */}
      {clientData && (
        <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4">
          <h4 className="font-medium text-cyan-900 dark:text-cyan-300 mb-2">
            🎯 Cliente
          </h4>
          <div className="text-sm">
            <span className="font-medium">{clientData.name}</span> • {clientData.status}
          </div>
        </div>
      )}

      <form onSubmit={handleCreateSchedule} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Título da Reunião *
          </label>
          <input
            type="text"
            name="title"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
            placeholder="Ex: Apresentação da Proposta"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data *
            </label>
            <input
              type="date"
              name="date"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Horário *
            </label>
            <input
              type="time"
              name="time"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Duração (minutos) *
          </label>
          <select 
            name="duration"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="30">30 minutos</option>
            <option value="60">1 hora</option>
            <option value="90">1h 30min</option>
            <option value="120">2 horas</option>
            <option value="180">3 horas</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Local (presencial)
          </label>
          <input
            type="text"
            name="location"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
            placeholder="Ex: Av. Paulista, 1000 - São Paulo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Link da Reunião Online
          </label>
          <input
            type="url"
            name="meetingLink"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
            placeholder="https://meet.google.com/abc-defg-hij ou Zoom..."
          />
          <p className="text-xs text-gray-500 mt-1">
            💡 Google Meet, Zoom, Teams, etc.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Observações
          </label>
          <textarea
            rows={3}
            name="description"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
            placeholder="Agenda ou observações sobre a reunião..."
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium"
          >
            Agendar Reunião
          </button>
        </div>
      </form>
    </div>
  )
}
