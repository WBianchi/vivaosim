'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScheduleCard } from './ScheduleCard'
import { SchedulesTable } from './SchedulesTable'
import { SchedulesCalendar } from './SchedulesCalendar'
import { EmptyState } from './EmptyState'
import { getAuthToken } from '@/lib/auth-token'

interface SchedulesListProps {
  filters: any
  searchTerm: string
  viewMode: 'grid' | 'table' | 'calendar'
  onScheduleSelect: (schedule: any) => void
}

// Mock data - fallback se API falhar
const mockSchedules = [
  {
    id: '1',
    title: 'Reunião de Briefing',
    description: 'Definir escopo e requisitos do projeto',
    client: {
      id: 'c1',
      name: 'Empresa ABC Ltda',
      email: 'contato@empresaabc.com',
      avatar: null,
      phone: '(11) 99999-9999'
    },
    agent: {
      id: 'a1',
      name: 'João Silva',
      avatar: null
    },
    dateTime: '2024-01-25T10:00:00Z',
    duration: 60,
    status: 'scheduled',
    type: 'meeting',
    format: 'online',
    location: 'Google Meet',
    meetingUrl: 'https://meet.google.com/abc-defg-hij',
    notes: 'Cliente interessado em desenvolver plataforma web',
    priority: 'high',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-22T14:30:00Z',
    tags: ['Novo Cliente', 'Desenvolvimento']
  },
  {
    id: '2',
    title: 'Apresentação da Proposta',
    description: 'Apresentar orçamento e cronograma do projeto',
    client: {
      id: 'c2',
      name: 'Tech Solutions',
      email: 'dev@techsolutions.com',
      avatar: null,
      phone: '(11) 88888-8888'
    },
    agent: {
      id: 'a2',
      name: 'Maria Santos',
      avatar: null
    },
    dateTime: '2024-01-26T14:30:00Z',
    duration: 90,
    status: 'completed',
    type: 'presentation',
    format: 'in_person',
    location: 'Escritório - Sala 3',
    meetingUrl: null,
    notes: 'Proposta aprovada. Iniciar projeto na próxima semana',
    priority: 'medium',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-26T16:00:00Z',
    tags: ['Apresentação', 'Aprovado']
  },
  {
    id: '3',
    title: 'Follow-up do Projeto',
    description: 'Acompanhar progresso e tirar dúvidas',
    client: {
      id: 'c3',
      name: 'Vendas Pro',
      email: 'admin@vendaspro.com',
      avatar: null,
      phone: '(11) 77777-7777'
    },
    agent: {
      id: 'a3',
      name: 'Pedro Costa',
      avatar: null
    },
    dateTime: '2024-01-27T16:00:00Z',
    duration: 30,
    status: 'cancelled',
    type: 'followup',
    format: 'phone',
    location: 'Ligação telefônica',
    meetingUrl: null,
    notes: 'Cliente cancelou devido a mudança de prioridades',
    priority: 'low',
    createdAt: '2024-01-22T11:00:00Z',
    updatedAt: '2024-01-26T09:15:00Z',
    tags: ['Follow-up', 'Cancelado']
  },
  {
    id: '4',
    title: 'Demonstração do Sistema',
    description: 'Mostrar funcionalidades desenvolvidas',
    client: {
      id: 'c4',
      name: 'Marketing Digital',
      email: 'contato@marketing.com',
      avatar: null,
      phone: '(11) 66666-6666'
    },
    agent: {
      id: 'a1',
      name: 'João Silva',
      avatar: null
    },
    dateTime: '2024-01-28T11:00:00Z',
    duration: 45,
    status: 'scheduled',
    type: 'meeting',
    format: 'hybrid',
    location: 'Escritório + Online',
    meetingUrl: 'https://meet.google.com/xyz-wxyz-abc',
    notes: 'Preparar demo ambiente de homologação',
    priority: 'high',
    createdAt: '2024-01-23T15:00:00Z',
    updatedAt: '2024-01-24T10:30:00Z',
    tags: ['Demo', 'Sistema']
  },
  {
    id: '5',
    title: 'Visita Técnica',
    description: 'Avaliar infraestrutura do cliente',
    client: {
      id: 'c5',
      name: 'Indústria XYZ',
      email: 'ti@industriaxyz.com',
      avatar: null,
      phone: '(11) 55555-5555'
    },
    agent: {
      id: 'a4',
      name: 'Ana Lima',
      avatar: null
    },
    dateTime: '2024-01-29T09:30:00Z',
    duration: 120,
    status: 'in_progress',
    type: 'visit',
    format: 'in_person',
    location: 'Sede do Cliente - Rua ABC, 123',
    meetingUrl: null,
    notes: 'Levar equipamentos de medição',
    priority: 'medium',
    createdAt: '2024-01-21T08:00:00Z',
    updatedAt: '2024-01-28T14:00:00Z',
    tags: ['Visita', 'Técnico']
  }
]

export const SchedulesList: React.FC<SchedulesListProps> = ({
  filters,
  searchTerm,
  viewMode,
  onScheduleSelect
}) => {
  const [schedules, setSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Buscar agendamentos da API
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true)
        const token = getAuthToken()
        
        if (!token) {
          console.error('Token não encontrado')
          setSchedules(mockSchedules)
          return
        }

        const params = new URLSearchParams()
        if (filters.status && filters.status !== 'all') params.append('status', filters.status)
        if (filters.type && filters.type !== 'all') params.append('type', filters.type)
        if (filters.agent && filters.agent !== 'all') params.append('assignedToId', filters.agent)

        const response = await fetch(`/api/appointments?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          // Transformar dados da API para o formato esperado pelos componentes
          const transformedSchedules = data.appointments.map((apt: any) => ({
            id: apt.id,
            title: apt.title,
            description: apt.description,
            client: apt.client || { id: '', name: 'Sem cliente', email: '', phone: '' },
            agent: apt.assignedTo || { id: '', name: 'Não atribuído' },
            dateTime: apt.startDateTime,
            duration: apt.duration || 60,
            status: apt.status.toLowerCase(),
            type: apt.type.toLowerCase(),
            format: apt.isOnline ? 'online' : 'in_person',
            location: apt.location || '',
            meetingUrl: apt.meetingUrl,
            notes: apt.notes,
            priority: 'medium',
            createdAt: apt.createdAt,
            updatedAt: apt.updatedAt,
            tags: []
          }))
          setSchedules(transformedSchedules)
        } else {
          console.error('Erro ao buscar agendamentos')
          setSchedules(mockSchedules)
        }
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error)
        setSchedules(mockSchedules)
      } finally {
        setLoading(false)
      }
    }

    fetchSchedules()
  }, [filters.status, filters.type, filters.agent])

  // Simular filtros
  const filteredSchedules = schedules.filter((schedule) => {
    // Filtro por status
    if (filters.status !== 'all' && schedule.status !== filters.status) {
      return false
    }

    // Filtro por agente  
    if (filters.agent !== 'all' && schedule.agent.id !== filters.agent) {
      return false
    }

    // Filtro por tipo
    if (filters.type !== 'all' && schedule.type !== filters.type) {
      return false
    }

    // Filtro por formato
    if (filters.format !== 'all' && schedule.format !== filters.format) {
      return false
    }

    // Filtro por cliente (busca no nome)
    if (filters.client && !schedule.client.name.toLowerCase().includes(filters.client.toLowerCase())) {
      return false
    }

    // Filtro por período
    if (filters.dateRange !== 'all') {
      const scheduleDate = new Date(schedule.dateTime)
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      switch (filters.dateRange) {
        case 'today':
          if (scheduleDate.toDateString() !== today.toDateString()) {
            return false
          }
          break
        case 'tomorrow':
          if (scheduleDate.toDateString() !== tomorrow.toDateString()) {
            return false
          }
          break
        case 'week':
          const weekStart = new Date(today)
          weekStart.setDate(today.getDate() - today.getDay())
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          if (scheduleDate < weekStart || scheduleDate > weekEnd) {
            return false
          }
          break
      }
    }

    // Busca geral
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesTitle = schedule.title.toLowerCase().includes(searchLower)
      const matchesClient = schedule.client.name.toLowerCase().includes(searchLower)
      const matchesDescription = schedule.description.toLowerCase().includes(searchLower)
      
      if (!matchesTitle && !matchesClient && !matchesDescription) {
        return false
      }
    }

    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (filteredSchedules.length === 0) {
    return <EmptyState filters={filters} searchTerm={searchTerm} />
  }

  return (
    <div>
      {/* Contador de resultados */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredSchedules.length} agendamento{filteredSchedules.length !== 1 ? 's' : ''} encontrado{filteredSchedules.length !== 1 ? 's' : ''}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Ordenar por:</span>
          <select className="bg-transparent border-none text-orange-600 font-medium focus:ring-0">
            <option value="date-asc">Mais próximos</option>
            <option value="date-desc">Mais distantes</option>
            <option value="client">Cliente A-Z</option>
            <option value="status">Status</option>
            <option value="agent">Agente</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSchedules.map((schedule, index) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                index={index}
                onClick={() => onScheduleSelect(schedule)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {viewMode === 'table' && (
        <SchedulesTable
          schedules={filteredSchedules}
          onScheduleSelect={onScheduleSelect}
        />
      )}

      {viewMode === 'calendar' && (
        <SchedulesCalendar
          schedules={filteredSchedules}
          onScheduleSelect={onScheduleSelect}
        />
      )}
    </div>
  )
}
