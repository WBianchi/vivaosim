'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AttendantCard } from './AttendantCard'
import { AttendantsTable } from './AttendantsTable'
import { EmptyState } from './EmptyState'

interface AttendantsListProps {
  filters: any
  searchTerm: string
  viewMode: 'grid' | 'table'
  onAttendantSelect: (attendant: any) => void
}

// Mock data - em produção viria da API
const mockAttendants = [
  {
    id: 'att-001',
    name: 'Ana Silva',
    email: 'ana.silva@empresa.com',
    phone: '(11) 99999-1111',
    avatar: null,
    status: 'active',
    onlineStatus: 'online',
    department: 'support',
    role: 'Atendente Senior',
    rating: 4.8,
    totalRatings: 156,
    activeChats: 3,
    maxChats: 8,
    responseTime: 1.2,
    resolutionTime: 15.5,
    ticketsResolved: 89,
    ticketsTotal: 95,
    workingHours: '08:00 - 18:00',
    lastActivity: '2024-01-25T16:45:00Z',
    joinedAt: '2023-06-15T09:00:00Z',
    currentClients: [
      { id: 'client-001', name: 'João Santos', chatId: 'chat-001', startTime: '2024-01-25T16:30:00Z' },
      { id: 'client-002', name: 'Maria Costa', chatId: 'chat-002', startTime: '2024-01-25T16:15:00Z' },
      { id: 'client-003', name: 'Pedro Lima', chatId: 'chat-003', startTime: '2024-01-25T16:00:00Z' }
    ],
    performance: {
      satisfaction: 4.8,
      firstResponseTime: 45,
      resolutionRate: 94,
      escalationRate: 6
    }
  },
  {
    id: 'att-002',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@empresa.com',
    phone: '(21) 88888-2222',
    avatar: null,
    status: 'active',
    onlineStatus: 'busy',
    department: 'sales',
    role: 'Consultor de Vendas',
    rating: 4.6,
    totalRatings: 203,
    activeChats: 5,
    maxChats: 6,
    responseTime: 2.1,
    resolutionTime: 22.3,
    ticketsResolved: 67,
    ticketsTotal: 72,
    workingHours: '09:00 - 19:00',
    lastActivity: '2024-01-25T16:40:00Z',
    joinedAt: '2023-03-10T10:00:00Z',
    currentClients: [
      { id: 'client-004', name: 'Ana Ferreira', chatId: 'chat-004', startTime: '2024-01-25T16:35:00Z' },
      { id: 'client-005', name: 'Roberto Silva', chatId: 'chat-005', startTime: '2024-01-25T16:20:00Z' },
      { id: 'client-006', name: 'Lucia Santos', chatId: 'chat-006', startTime: '2024-01-25T16:10:00Z' },
      { id: 'client-007', name: 'Fernando Costa', chatId: 'chat-007', startTime: '2024-01-25T16:05:00Z' },
      { id: 'client-008', name: 'Patricia Lima', chatId: 'chat-008', startTime: '2024-01-25T15:50:00Z' }
    ],
    performance: {
      satisfaction: 4.6,
      firstResponseTime: 62,
      resolutionRate: 93,
      escalationRate: 7
    }
  },
  {
    id: 'att-003',
    name: 'Mariana Santos',
    email: 'mariana.santos@empresa.com',
    phone: '(31) 77777-3333',
    avatar: null,
    status: 'active',
    onlineStatus: 'online',
    department: 'billing',
    role: 'Especialista Financeiro',
    rating: 4.9,
    totalRatings: 98,
    activeChats: 2,
    maxChats: 5,
    responseTime: 0.8,
    resolutionTime: 12.1,
    ticketsResolved: 45,
    ticketsTotal: 47,
    workingHours: '08:00 - 17:00',
    lastActivity: '2024-01-25T16:42:00Z',
    joinedAt: '2023-09-20T08:30:00Z',
    currentClients: [
      { id: 'client-009', name: 'Gabriel Rocha', chatId: 'chat-009', startTime: '2024-01-25T16:25:00Z' },
      { id: 'client-010', name: 'Isabella Alves', chatId: 'chat-010', startTime: '2024-01-25T16:10:00Z' }
    ],
    performance: {
      satisfaction: 4.9,
      firstResponseTime: 28,
      resolutionRate: 96,
      escalationRate: 4
    }
  },
  {
    id: 'att-004',
    name: 'Rafael Costa',
    email: 'rafael.costa@empresa.com',
    phone: '(85) 66666-4444',
    avatar: null,
    status: 'inactive',
    onlineStatus: 'offline',
    department: 'support',
    role: 'Atendente Junior',
    rating: 4.2,
    totalRatings: 67,
    activeChats: 0,
    maxChats: 6,
    responseTime: 3.5,
    resolutionTime: 28.7,
    ticketsResolved: 34,
    ticketsTotal: 42,
    workingHours: '14:00 - 22:00',
    lastActivity: '2024-01-24T22:00:00Z',
    joinedAt: '2023-11-05T14:00:00Z',
    currentClients: [],
    performance: {
      satisfaction: 4.2,
      firstResponseTime: 95,
      resolutionRate: 81,
      escalationRate: 19
    }
  },
  {
    id: 'att-005',
    name: 'Fernanda Lima',
    email: 'fernanda.lima@empresa.com',
    phone: '(47) 55555-5555',
    avatar: null,
    status: 'active',
    onlineStatus: 'away',
    department: 'vip',
    role: 'Atendente VIP',
    rating: 4.7,
    totalRatings: 134,
    activeChats: 1,
    maxChats: 3,
    responseTime: 1.0,
    resolutionTime: 18.2,
    ticketsResolved: 78,
    ticketsTotal: 82,
    workingHours: '10:00 - 20:00',
    lastActivity: '2024-01-25T16:30:00Z',
    joinedAt: '2023-01-15T10:00:00Z',
    currentClients: [
      { id: 'client-011', name: 'Eduardo Martins', chatId: 'chat-011', startTime: '2024-01-25T16:00:00Z' }
    ],
    performance: {
      satisfaction: 4.7,
      firstResponseTime: 35,
      resolutionRate: 95,
      escalationRate: 5
    }
  },
  {
    id: 'att-006',
    name: 'Lucas Pereira',
    email: 'lucas.pereira@empresa.com',
    phone: '(62) 44444-6666',
    avatar: null,
    status: 'training',
    onlineStatus: 'online',
    department: 'general',
    role: 'Trainee',
    rating: 3.8,
    totalRatings: 25,
    activeChats: 1,
    maxChats: 3,
    responseTime: 4.2,
    resolutionTime: 35.8,
    ticketsResolved: 12,
    ticketsTotal: 18,
    workingHours: '09:00 - 18:00',
    lastActivity: '2024-01-25T16:35:00Z',
    joinedAt: '2024-01-08T09:00:00Z',
    currentClients: [
      { id: 'client-012', name: 'Camila Souza', chatId: 'chat-012', startTime: '2024-01-25T16:20:00Z' }
    ],
    performance: {
      satisfaction: 3.8,
      firstResponseTime: 120,
      resolutionRate: 67,
      escalationRate: 33
    }
  }
]

export const AttendantsList: React.FC<AttendantsListProps> = ({
  filters,
  searchTerm,
  viewMode,
  onAttendantSelect
}) => {
  const [attendants, setAttendants] = useState(mockAttendants)
  const [loading, setLoading] = useState(false)

  // Simular filtros
  const filteredAttendants = attendants.filter((attendant) => {
    // Filtro por status
    if (filters.status !== 'all' && attendant.status !== filters.status) {
      return false
    }

    // Filtro por status online
    if (filters.onlineStatus !== 'all' && attendant.onlineStatus !== filters.onlineStatus) {
      return false
    }

    // Filtro por departamento
    if (filters.department !== 'all' && attendant.department !== filters.department) {
      return false
    }

    // Filtro por performance
    if (filters.performance !== 'all') {
      const rating = attendant.rating
      switch (filters.performance) {
        case 'excellent':
          if (rating < 4.5) return false
          break
        case 'good':
          if (rating < 3.5 || rating >= 4.5) return false
          break
        case 'average':
          if (rating < 2.5 || rating >= 3.5) return false
          break
        case 'poor':
          if (rating >= 2.5) return false
          break
      }
    }

    // Filtro por carga de trabalho
    if (filters.workload !== 'all') {
      const activeChats = attendant.activeChats
      switch (filters.workload) {
        case 'light':
          if (activeChats > 5) return false
          break
        case 'moderate':
          if (activeChats < 6 || activeChats > 10) return false
          break
        case 'heavy':
          if (activeChats < 11 || activeChats > 15) return false
          break
        case 'overloaded':
          if (activeChats < 15) return false
          break
      }
    }

    // Busca geral
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesName = attendant.name.toLowerCase().includes(searchLower)
      const matchesEmail = attendant.email.toLowerCase().includes(searchLower)
      const matchesRole = attendant.role.toLowerCase().includes(searchLower)
      const matchesDepartment = attendant.department.toLowerCase().includes(searchLower)
      
      if (!matchesName && !matchesEmail && !matchesRole && !matchesDepartment) {
        return false
      }
    }

    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (filteredAttendants.length === 0) {
    return <EmptyState filters={filters} searchTerm={searchTerm} />
  }

  return (
    <div>
      {/* Contador de resultados */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredAttendants.length} atendente{filteredAttendants.length !== 1 ? 's' : ''} encontrado{filteredAttendants.length !== 1 ? 's' : ''}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Ordenar por:</span>
          <select className="bg-transparent border-none text-blue-600 font-medium focus:ring-0">
            <option value="name">Nome A-Z</option>
            <option value="rating">Avaliação</option>
            <option value="activeChats">Chats Ativos</option>
            <option value="responseTime">Tempo Resposta</option>
            <option value="department">Departamento</option>
            <option value="joinedAt">Data de Entrada</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredAttendants.map((attendant, index) => (
              <AttendantCard
                key={attendant.id}
                attendant={attendant}
                index={index}
                onClick={() => onAttendantSelect(attendant)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <AttendantsTable
          attendants={filteredAttendants}
          onAttendantSelect={onAttendantSelect}
        />
      )}
    </div>
  )
}
