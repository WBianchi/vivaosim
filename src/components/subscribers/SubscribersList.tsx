'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SubscriberCard } from './SubscriberCard'
import { SubscribersTable } from './SubscribersTable'
import { EmptyState } from './EmptyState'

interface SubscribersListProps {
  filters: any
  searchTerm: string
  viewMode: 'grid' | 'table'
  onSubscriberSelect: (subscriber: any) => void
  onSubscribersLoad?: (subscribers: any[]) => void
  onEdit?: (subscriber: any) => void
  onDelete?: (subscriber: any) => void
  onArchive?: (subscriber: any) => void
}

// Mock data - em produção viria da API
const mockSubscribers = [
  {
    id: 'sub-001',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    status: 'active',
    plan: {
      id: 'plan-002',
      name: 'Plano Profissional',
      price: 99.90,
      period: 'monthly'
    },
    subscription: {
      id: 'subscription-001',
      status: 'active',
      startDate: '2024-01-15T10:00:00Z',
      endDate: '2024-02-15T10:00:00Z',
      renewalDate: '2024-02-15T10:00:00Z',
      autoRenewal: true
    },
    payment: {
      status: 'paid',
      method: 'credit_card',
      lastPayment: '2024-01-15T10:00:00Z',
      nextPayment: '2024-02-15T10:00:00Z',
      totalPaid: 299.70
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-25T14:30:00Z',
    lastLogin: '2024-01-25T16:45:00Z',
    avatar: null,
    address: {
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    company: 'Tech Solutions Ltda',
    document: '123.456.789-00'
  },
  {
    id: 'sub-002',
    name: 'Maria Santos',
    email: 'maria.santos@empresa.com',
    phone: '(21) 88888-8888',
    status: 'active',
    plan: {
      id: 'plan-003',
      name: 'Plano Premium',
      price: 199.90,
      period: 'monthly'
    },
    subscription: {
      id: 'subscription-002',
      status: 'active',
      startDate: '2024-01-10T09:00:00Z',
      endDate: '2024-02-10T09:00:00Z',
      renewalDate: '2024-02-10T09:00:00Z',
      autoRenewal: true
    },
    payment: {
      status: 'paid',
      method: 'pix',
      lastPayment: '2024-01-10T09:00:00Z',
      nextPayment: '2024-02-10T09:00:00Z',
      totalPaid: 599.70
    },
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-24T11:30:00Z',
    lastLogin: '2024-01-24T18:20:00Z',
    avatar: null,
    address: {
      street: 'Av. Copacabana, 456',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '22070-001'
    },
    company: 'Marketing Digital RJ',
    document: '987.654.321-00'
  },
  {
    id: 'sub-003',
    name: 'Pedro Costa',
    email: 'pedro@startup.com',
    phone: '(31) 77777-7777',
    status: 'active',
    plan: {
      id: 'plan-001',
      name: 'Plano Básico',
      price: 49.90,
      period: 'monthly'
    },
    subscription: {
      id: 'subscription-003',
      status: 'trial',
      startDate: '2024-01-20T14:00:00Z',
      endDate: '2024-01-27T14:00:00Z',
      renewalDate: '2024-01-27T14:00:00Z',
      autoRenewal: false
    },
    payment: {
      status: 'pending',
      method: 'credit_card',
      lastPayment: null,
      nextPayment: '2024-01-27T14:00:00Z',
      totalPaid: 0
    },
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-01-25T09:15:00Z',
    lastLogin: '2024-01-25T12:30:00Z',
    avatar: null,
    address: {
      street: 'Rua da Inovação, 789',
      city: 'Belo Horizonte',
      state: 'MG',
      zipCode: '30112-000'
    },
    company: 'StartupBH',
    document: '456.789.123-00'
  },
  {
    id: 'sub-004',
    name: 'Ana Lima',
    email: 'ana.lima@consultoria.com',
    phone: '(85) 66666-6666',
    status: 'suspended',
    plan: {
      id: 'plan-002',
      name: 'Plano Profissional',
      price: 99.90,
      period: 'monthly'
    },
    subscription: {
      id: 'subscription-004',
      status: 'expired',
      startDate: '2023-12-01T10:00:00Z',
      endDate: '2024-01-01T10:00:00Z',
      renewalDate: '2024-01-01T10:00:00Z',
      autoRenewal: false
    },
    payment: {
      status: 'failed',
      method: 'credit_card',
      lastPayment: '2023-12-01T10:00:00Z',
      nextPayment: null,
      totalPaid: 99.90
    },
    createdAt: '2023-12-01T10:00:00Z',
    updatedAt: '2024-01-15T16:45:00Z',
    lastLogin: '2024-01-10T14:20:00Z',
    avatar: null,
    address: {
      street: 'Av. Beira Mar, 321',
      city: 'Fortaleza',
      state: 'CE',
      zipCode: '60165-121'
    },
    company: 'Consultoria Nordeste',
    document: '321.654.987-00'
  },
  {
    id: 'sub-005',
    name: 'Carlos Oliveira',
    email: 'carlos@agencia.com',
    phone: '(47) 55555-5555',
    status: 'active',
    plan: {
      id: 'plan-005',
      name: 'Plano Enterprise',
      price: 499.90,
      period: 'annual'
    },
    subscription: {
      id: 'subscription-005',
      status: 'active',
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2025-01-01T00:00:00Z',
      renewalDate: '2025-01-01T00:00:00Z',
      autoRenewal: true
    },
    payment: {
      status: 'paid',
      method: 'bank_transfer',
      lastPayment: '2024-01-01T00:00:00Z',
      nextPayment: '2025-01-01T00:00:00Z',
      totalPaid: 499.90
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-25T12:00:00Z',
    lastLogin: '2024-01-25T15:45:00Z',
    avatar: null,
    address: {
      street: 'Rua Principal, 654',
      city: 'Blumenau',
      state: 'SC',
      zipCode: '89010-100'
    },
    company: 'Agência Digital SC',
    document: '789.123.456-00'
  },
  {
    id: 'sub-006',
    name: 'Fernanda Rocha',
    email: 'fernanda@freelancer.com',
    phone: '(62) 44444-4444',
    status: 'inactive',
    plan: {
      id: 'plan-001',
      name: 'Plano Básico',
      price: 49.90,
      period: 'monthly'
    },
    subscription: {
      id: 'subscription-006',
      status: 'cancelled',
      startDate: '2023-11-15T10:00:00Z',
      endDate: '2023-12-15T10:00:00Z',
      renewalDate: null,
      autoRenewal: false
    },
    payment: {
      status: 'refunded',
      method: 'pix',
      lastPayment: '2023-11-15T10:00:00Z',
      nextPayment: null,
      totalPaid: 49.90
    },
    createdAt: '2023-11-15T10:00:00Z',
    updatedAt: '2023-12-20T08:30:00Z',
    lastLogin: '2023-12-10T11:15:00Z',
    avatar: null,
    address: {
      street: 'Quadra 10, Lote 15',
      city: 'Goiânia',
      state: 'GO',
      zipCode: '74000-100'
    },
    company: null,
    document: '159.753.486-00'
  }
]

export const SubscribersList: React.FC<SubscribersListProps> = ({
  filters,
  searchTerm,
  viewMode,
  onSubscriberSelect,
  onSubscribersLoad,
  onEdit,
  onDelete,
  onArchive
}) => {
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscribers()
  }, [filters])

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters.status !== 'all') {
        params.append('status', filters.status.toUpperCase())
      }
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await fetch(`/api/subscribers?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setSubscribers(data.data)
        if (onSubscribersLoad) {
          onSubscribersLoad(data.data)
        }
      } else {
        // Fallback para mock data se API falhar
        setSubscribers(mockSubscribers)
        if (onSubscribersLoad) {
          onSubscribersLoad(mockSubscribers)
        }
      }
    } catch (error) {
      console.error('Erro ao buscar assinantes:', error)
      // Usar mock data em caso de erro
      setSubscribers(mockSubscribers)
      if (onSubscribersLoad) {
        onSubscribersLoad(mockSubscribers)
      }
    } finally {
      setLoading(false)
    }
  }

  // Simular filtros
  const filteredSubscribers = subscribers.filter((subscriber) => {
    // Filtro por status do usuário
    if (filters.status !== 'all' && subscriber.status !== filters.status) {
      return false
    }

    // Filtro por plano
    if (filters.plan !== 'all') {
      const planCategory = subscriber.plan.name.toLowerCase()
      if (filters.plan === 'basic' && !planCategory.includes('básico')) return false
      if (filters.plan === 'professional' && !planCategory.includes('profissional')) return false
      if (filters.plan === 'premium' && !planCategory.includes('premium')) return false
      if (filters.plan === 'enterprise' && !planCategory.includes('enterprise')) return false
    }

    // Filtro por status da assinatura
    if (filters.subscriptionStatus !== 'all' && subscriber.subscription.status !== filters.subscriptionStatus) {
      return false
    }

    // Filtro por status do pagamento
    if (filters.paymentStatus !== 'all' && subscriber.payment.status !== filters.paymentStatus) {
      return false
    }

    // Filtro por período (implementação básica)
    if (filters.dateRange !== 'all') {
      const createdDate = new Date(subscriber.createdAt)
      const now = new Date()
      
      switch (filters.dateRange) {
        case 'today':
          if (createdDate.toDateString() !== now.toDateString()) return false
          break
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          if (createdDate < weekAgo) return false
          break
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          if (createdDate < monthAgo) return false
          break
      }
    }

    // Busca geral
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesName = subscriber.name.toLowerCase().includes(searchLower)
      const matchesEmail = subscriber.email.toLowerCase().includes(searchLower)
      const matchesCompany = subscriber.company?.toLowerCase().includes(searchLower)
      const matchesPlan = subscriber.plan.name.toLowerCase().includes(searchLower)
      
      if (!matchesName && !matchesEmail && !matchesCompany && !matchesPlan) {
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

  if (filteredSubscribers.length === 0) {
    return <EmptyState filters={filters} searchTerm={searchTerm} />
  }

  return (
    <div>
      {/* Contador de resultados */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredSubscribers.length} assinante{filteredSubscribers.length !== 1 ? 's' : ''} encontrado{filteredSubscribers.length !== 1 ? 's' : ''}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Ordenar por:</span>
          <select className="bg-transparent border-none text-blue-600 font-medium focus:ring-0">
            <option value="recent">Mais recentes</option>
            <option value="name">Nome A-Z</option>
            <option value="plan">Plano</option>
            <option value="status">Status</option>
            <option value="payment">Pagamento</option>
            <option value="expiration">Expiração</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSubscribers.map((subscriber, index) => (
              <SubscriberCard
                key={subscriber.id}
                subscriber={subscriber}
                index={index}
                onClick={() => onSubscriberSelect(subscriber)}
                onEdit={onEdit}
                onDelete={onDelete}
                onArchive={onArchive}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <SubscribersTable
          subscribers={filteredSubscribers}
          onSubscriberSelect={onSubscriberSelect}
        />
      )}
    </div>
  )
}
