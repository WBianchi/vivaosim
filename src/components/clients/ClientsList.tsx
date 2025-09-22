'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ClientCard } from './ClientCard'
import { ClientsTable } from './ClientsTable'
import { EmptyState } from './EmptyState'

interface ClientsListProps {
  filters: any
  searchTerm: string
  viewMode: 'grid' | 'table'
  onClientSelect: (client: any) => void
}

// Mock data - em produção viria da API
const mockClients = [
  {
    id: 'client-001',
    name: 'João Santos Silva',
    email: 'joao.santos@email.com',
    phone: '(11) 99999-1111',
    company: 'Tech Solutions Ltda',
    avatar: null,
    status: 'active',
    type: 'company',
    priority: 'high',
    source: 'website',
    attendant: 'ana-silva',
    attendantName: 'Ana Silva',
    subscription: {
      status: 'active',
      plan: 'Plano Premium',
      startDate: '2024-01-15T10:00:00Z',
      endDate: '2024-12-15T10:00:00Z',
      value: 299.90
    },
    totalValue: 2850.50,
    lastContact: '2024-01-25T14:30:00Z',
    createdAt: '2023-08-10T09:00:00Z',
    address: {
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    documents: {
      cpf: '123.456.789-00',
      cnpj: '12.345.678/0001-90'
    },
    contracts: [
      {
        id: 'contract-001',
        title: 'Contrato de Prestação de Serviços',
        status: 'active',
        value: 299.90,
        startDate: '2024-01-15T10:00:00Z',
        endDate: '2024-12-15T10:00:00Z'
      }
    ],
    tickets: [
      {
        id: 'ticket-001',
        title: 'Dúvida sobre funcionalidade',
        status: 'resolved',
        priority: 'medium',
        createdAt: '2024-01-20T15:00:00Z'
      }
    ],
    quotes: [
      {
        id: 'quote-001',
        title: 'Upgrade para Plano Enterprise',
        status: 'pending',
        value: 599.90,
        createdAt: '2024-01-22T10:00:00Z'
      }
    ],
    meetings: [
      {
        id: 'meeting-001',
        title: 'Reunião de Alinhamento',
        date: '2024-01-30T14:00:00Z',
        status: 'scheduled'
      }
    ],
    tags: ['vip', 'tech', 'enterprise'],
    notes: 'Cliente muito satisfeito com o serviço. Potencial para upgrade.'
  },
  {
    id: 'client-002',
    name: 'Maria Costa Oliveira',
    email: 'maria.costa@gmail.com',
    phone: '(21) 88888-2222',
    company: null,
    avatar: null,
    status: 'active',
    type: 'individual',
    priority: 'medium',
    source: 'whatsapp',
    attendant: 'carlos-oliveira',
    attendantName: 'Carlos Oliveira',
    subscription: {
      status: 'trial',
      plan: 'Plano Básico',
      startDate: '2024-01-20T10:00:00Z',
      endDate: '2024-02-20T10:00:00Z',
      value: 49.90
    },
    totalValue: 0,
    lastContact: '2024-01-24T16:45:00Z',
    createdAt: '2024-01-20T10:00:00Z',
    address: {
      street: 'Av. Copacabana, 456',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '22070-001'
    },
    documents: {
      cpf: '987.654.321-00',
      cnpj: null
    },
    contracts: [],
    tickets: [],
    quotes: [
      {
        id: 'quote-002',
        title: 'Proposta Plano Profissional',
        status: 'pending',
        value: 99.90,
        createdAt: '2024-01-23T11:00:00Z'
      }
    ],
    meetings: [],
    tags: ['prospect', 'trial'],
    notes: 'Interessada em migrar para plano pago após período de teste.'
  },
  {
    id: 'client-003',
    name: 'Pedro Lima Ferreira',
    email: 'pedro.lima@empresa.com.br',
    phone: '(31) 77777-3333',
    company: 'Inovação Digital',
    avatar: null,
    status: 'inactive',
    type: 'company',
    priority: 'low',
    source: 'google',
    attendant: 'mariana-santos',
    attendantName: 'Mariana Santos',
    subscription: {
      status: 'expired',
      plan: 'Plano Profissional',
      startDate: '2023-06-01T10:00:00Z',
      endDate: '2024-01-01T10:00:00Z',
      value: 99.90
    },
    totalValue: 1198.80,
    lastContact: '2024-01-05T09:15:00Z',
    createdAt: '2023-06-01T10:00:00Z',
    address: {
      street: 'Rua da Inovação, 789',
      city: 'Belo Horizonte',
      state: 'MG',
      zipCode: '30112-000'
    },
    documents: {
      cpf: '456.789.123-00',
      cnpj: '98.765.432/0001-10'
    },
    contracts: [
      {
        id: 'contract-002',
        title: 'Contrato Anual de Serviços',
        status: 'expired',
        value: 99.90,
        startDate: '2023-06-01T10:00:00Z',
        endDate: '2024-01-01T10:00:00Z'
      }
    ],
    tickets: [
      {
        id: 'ticket-002',
        title: 'Problema de integração',
        status: 'resolved',
        priority: 'high',
        createdAt: '2023-12-15T14:00:00Z'
      }
    ],
    quotes: [],
    meetings: [],
    tags: ['expired', 'renewal-opportunity'],
    notes: 'Cliente com potencial para renovação. Fazer follow-up.'
  },
  {
    id: 'client-004',
    name: 'Ana Ferreira Rocha',
    email: 'ana.ferreira@vip.com',
    phone: '(85) 66666-4444',
    company: 'VIP Consultoria',
    avatar: null,
    status: 'active',
    type: 'vip',
    priority: 'urgent',
    source: 'referral',
    attendant: 'fernanda-lima',
    attendantName: 'Fernanda Lima',
    subscription: {
      status: 'active',
      plan: 'Plano Enterprise',
      startDate: '2023-03-01T10:00:00Z',
      endDate: '2025-03-01T10:00:00Z',
      value: 599.90
    },
    totalValue: 12598.00,
    lastContact: '2024-01-25T11:20:00Z',
    createdAt: '2023-03-01T10:00:00Z',
    address: {
      street: 'Av. Beira Mar, 1000',
      city: 'Fortaleza',
      state: 'CE',
      zipCode: '60165-121'
    },
    documents: {
      cpf: '789.123.456-00',
      cnpj: '11.222.333/0001-44'
    },
    contracts: [
      {
        id: 'contract-003',
        title: 'Contrato Enterprise Premium',
        status: 'active',
        value: 599.90,
        startDate: '2023-03-01T10:00:00Z',
        endDate: '2025-03-01T10:00:00Z'
      }
    ],
    tickets: [],
    quotes: [
      {
        id: 'quote-003',
        title: 'Serviços Adicionais',
        status: 'approved',
        value: 299.90,
        createdAt: '2024-01-10T09:00:00Z'
      }
    ],
    meetings: [
      {
        id: 'meeting-002',
        title: 'Revisão Trimestral',
        date: '2024-02-01T15:00:00Z',
        status: 'scheduled'
      }
    ],
    tags: ['vip', 'enterprise', 'high-value'],
    notes: 'Cliente VIP com excelente relacionamento. Sempre pontual nos pagamentos.'
  },
  {
    id: 'client-005',
    name: 'Roberto Silva Santos',
    email: 'roberto.silva@startup.io',
    phone: '(47) 55555-5555',
    company: 'StartupTech',
    avatar: null,
    status: 'pending',
    type: 'company',
    priority: 'medium',
    source: 'facebook',
    attendant: 'unassigned',
    attendantName: null,
    subscription: {
      status: 'none',
      plan: null,
      startDate: null,
      endDate: null,
      value: 0
    },
    totalValue: 0,
    lastContact: '2024-01-25T13:00:00Z',
    createdAt: '2024-01-25T13:00:00Z',
    address: {
      street: 'Rua das Startups, 42',
      city: 'Florianópolis',
      state: 'SC',
      zipCode: '88010-000'
    },
    documents: {
      cpf: '321.654.987-00',
      cnpj: '55.666.777/0001-88'
    },
    contracts: [],
    tickets: [],
    quotes: [
      {
        id: 'quote-004',
        title: 'Proposta Inicial',
        status: 'pending',
        value: 199.90,
        createdAt: '2024-01-25T13:30:00Z'
      }
    ],
    meetings: [
      {
        id: 'meeting-003',
        title: 'Primeira Reunião',
        date: '2024-01-28T10:00:00Z',
        status: 'scheduled'
      }
    ],
    tags: ['prospect', 'startup', 'new'],
    notes: 'Novo lead interessado em nossos serviços. Agendar reunião de apresentação.'
  },
  {
    id: 'client-006',
    name: 'Lucia Santos Pereira',
    email: 'lucia.santos@blocked.com',
    phone: '(62) 44444-6666',
    company: null,
    avatar: null,
    status: 'blocked',
    type: 'individual',
    priority: 'low',
    source: 'phone',
    attendant: 'rafael-costa',
    attendantName: 'Rafael Costa',
    subscription: {
      status: 'cancelled',
      plan: 'Plano Básico',
      startDate: '2023-10-01T10:00:00Z',
      endDate: '2023-12-01T10:00:00Z',
      value: 49.90
    },
    totalValue: 149.70,
    lastContact: '2023-12-15T16:00:00Z',
    createdAt: '2023-10-01T10:00:00Z',
    address: {
      street: 'Quadra 10, Lote 15',
      city: 'Goiânia',
      state: 'GO',
      zipCode: '74000-000'
    },
    documents: {
      cpf: '654.321.987-00',
      cnpj: null
    },
    contracts: [],
    tickets: [
      {
        id: 'ticket-003',
        title: 'Reclamação sobre cobrança',
        status: 'escalated',
        priority: 'high',
        createdAt: '2023-12-01T10:00:00Z'
      }
    ],
    quotes: [],
    meetings: [],
    tags: ['blocked', 'payment-issue'],
    notes: 'Cliente bloqueado por problemas de pagamento. Histórico de reclamações.'
  }
]

export const ClientsList: React.FC<ClientsListProps> = ({
  filters,
  searchTerm,
  viewMode,
  onClientSelect
}) => {
  const [clients, setClients] = useState(mockClients)
  const [loading, setLoading] = useState(false)

  // Simular filtros
  const filteredClients = clients.filter((client) => {
    // Filtro por status
    if (filters.status !== 'all' && client.status !== filters.status) {
      return false
    }

    // Filtro por tipo
    if (filters.type !== 'all' && client.type !== filters.type) {
      return false
    }

    // Filtro por atendente
    if (filters.attendant !== 'all') {
      if (filters.attendant === 'unassigned' && client.attendant !== 'unassigned') {
        return false
      } else if (filters.attendant !== 'unassigned' && client.attendant !== filters.attendant) {
        return false
      }
    }

    // Filtro por prioridade
    if (filters.priority !== 'all' && client.priority !== filters.priority) {
      return false
    }

    // Filtro por origem
    if (filters.source !== 'all' && client.source !== filters.source) {
      return false
    }

    // Filtro por assinatura
    if (filters.subscription !== 'all' && client.subscription.status !== filters.subscription) {
      return false
    }

    // Busca geral
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesName = client.name.toLowerCase().includes(searchLower)
      const matchesEmail = client.email.toLowerCase().includes(searchLower)
      const matchesPhone = client.phone.toLowerCase().includes(searchLower)
      const matchesCompany = client.company?.toLowerCase().includes(searchLower) || false
      
      if (!matchesName && !matchesEmail && !matchesPhone && !matchesCompany) {
        return false
      }
    }

    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (filteredClients.length === 0) {
    return <EmptyState filters={filters} searchTerm={searchTerm} />
  }

  return (
    <div>
      {/* Contador de resultados */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredClients.length} cliente{filteredClients.length !== 1 ? 's' : ''} encontrado{filteredClients.length !== 1 ? 's' : ''}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Ordenar por:</span>
          <select className="bg-transparent border-none text-green-600 font-medium focus:ring-0">
            <option value="name">Nome A-Z</option>
            <option value="totalValue">Valor Total</option>
            <option value="lastContact">Último Contato</option>
            <option value="createdAt">Data de Cadastro</option>
            <option value="priority">Prioridade</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredClients.map((client, index) => (
              <ClientCard
                key={client.id}
                client={client}
                index={index}
                onClick={() => onClientSelect(client)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <ClientsTable
          clients={filteredClients}
          onClientSelect={onClientSelect}
        />
      )}
    </div>
  )
}
