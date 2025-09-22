'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TicketCard } from './TicketCard'
import { TicketsTable } from './TicketsTable'
import { EmptyState } from './EmptyState'

interface TicketsListProps {
  filters: any
  searchTerm: string
  viewMode: 'grid' | 'table'
  onTicketSelect: (ticket: any) => void
}

// Mock data - em produção viria da API
const mockTickets = [
  {
    id: 'TK-001',
    title: 'Sistema não carrega após atualização',
    description: 'Após a última atualização, o sistema fica em tela branca e não carrega nenhuma funcionalidade.',
    status: 'open',
    priority: 'urgent',
    category: 'technical',
    client: {
      id: 'c1',
      name: 'TechCorp Soluções',
      email: 'suporte@techcorp.com',
      avatar: null
    },
    agent: {
      id: 'a1',
      name: 'João Silva',
      avatar: null
    },
    createdAt: '2024-01-25T09:30:00Z',
    updatedAt: '2024-01-25T14:45:00Z',
    resolvedAt: null,
    tags: ['Sistema', 'Atualização', 'Crítico'],
    attachments: [
      { name: 'screenshot-erro.png', size: '1.2 MB', type: 'image' },
      { name: 'log-sistema.txt', size: '0.8 MB', type: 'text' }
    ],
    comments: [
      {
        id: '1',
        author: 'Cliente',
        content: 'O problema começou hoje de manhã após a atualização automática.',
        createdAt: '2024-01-25T09:30:00Z'
      },
      {
        id: '2',
        author: 'João Silva',
        content: 'Vou verificar os logs do sistema e retorno em breve.',
        createdAt: '2024-01-25T10:15:00Z'
      }
    ]
  },
  {
    id: 'TK-002',
    title: 'Cobrança duplicada na fatura',
    description: 'Recebi uma cobrança em duplicata na minha fatura deste mês. Preciso de estorno.',
    status: 'in_progress',
    priority: 'high',
    category: 'billing',
    client: {
      id: 'c2',
      name: 'Inovação Brasil LTDA',
      email: 'financeiro@inovacaobrasil.com',
      avatar: null
    },
    agent: {
      id: 'a2',
      name: 'Maria Santos',
      avatar: null
    },
    createdAt: '2024-01-24T14:20:00Z',
    updatedAt: '2024-01-25T11:30:00Z',
    resolvedAt: null,
    tags: ['Faturamento', 'Estorno', 'Financeiro'],
    attachments: [
      { name: 'fatura-janeiro.pdf', size: '0.5 MB', type: 'pdf' }
    ],
    comments: [
      {
        id: '1',
        author: 'Cliente',
        content: 'Anexei a fatura com a cobrança duplicada.',
        createdAt: '2024-01-24T14:20:00Z'
      },
      {
        id: '2',
        author: 'Maria Santos',
        content: 'Identifiquei o erro. Processando o estorno agora.',
        createdAt: '2024-01-25T11:30:00Z'
      }
    ]
  },
  {
    id: 'TK-003',
    title: 'Solicitação de novo recurso - Dashboard personalizado',
    description: 'Gostaria de solicitar um dashboard personalizado para acompanhar métricas específicas do nosso negócio.',
    status: 'resolved',
    priority: 'medium',
    category: 'feature_request',
    client: {
      id: 'c3',
      name: 'StartupTech Inc.',
      email: 'produto@startuptech.com',
      avatar: null
    },
    agent: {
      id: 'a3',
      name: 'Pedro Costa',
      avatar: null
    },
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-24T16:00:00Z',
    resolvedAt: '2024-01-24T16:00:00Z',
    tags: ['Dashboard', 'Personalização', 'Recurso'],
    attachments: [
      { name: 'mockup-dashboard.png', size: '2.1 MB', type: 'image' },
      { name: 'requisitos.docx', size: '1.5 MB', type: 'word' }
    ],
    comments: [
      {
        id: '1',
        author: 'Cliente',
        content: 'Anexei um mockup do que precisamos.',
        createdAt: '2024-01-20T10:00:00Z'
      },
      {
        id: '2',
        author: 'Pedro Costa',
        content: 'Recurso implementado e disponível na versão 2.1.',
        createdAt: '2024-01-24T16:00:00Z'
      }
    ]
  },
  {
    id: 'TK-004',
    title: 'Bug no relatório de vendas',
    description: 'Os valores no relatório de vendas estão incorretos. Mostra valores muito abaixo do real.',
    status: 'open',
    priority: 'high',
    category: 'bug_report',
    client: {
      id: 'c4',
      name: 'Comercial Santos LTDA',
      email: 'vendas@comercialsantos.com',
      avatar: null
    },
    agent: null,
    createdAt: '2024-01-25T16:45:00Z',
    updatedAt: '2024-01-25T16:45:00Z',
    resolvedAt: null,
    tags: ['Bug', 'Relatório', 'Vendas'],
    attachments: [
      { name: 'relatorio-incorreto.pdf', size: '0.7 MB', type: 'pdf' }
    ],
    comments: [
      {
        id: '1',
        author: 'Cliente',
        content: 'Anexei o relatório com os valores incorretos.',
        createdAt: '2024-01-25T16:45:00Z'
      }
    ]
  },
  {
    id: 'TK-005',
    title: 'Dúvida sobre configuração de usuários',
    description: 'Como posso configurar diferentes níveis de acesso para os usuários da minha equipe?',
    status: 'closed',
    priority: 'low',
    category: 'general',
    client: {
      id: 'c5',
      name: 'Pequena Empresa ME',
      email: 'admin@pequenaempresa.com',
      avatar: null
    },
    agent: {
      id: 'a4',
      name: 'Ana Lima',
      avatar: null
    },
    createdAt: '2024-01-22T11:15:00Z',
    updatedAt: '2024-01-23T09:30:00Z',
    resolvedAt: '2024-01-23T09:30:00Z',
    tags: ['Configuração', 'Usuários', 'Dúvida'],
    attachments: [],
    comments: [
      {
        id: '1',
        author: 'Cliente',
        content: 'Preciso configurar acesso limitado para alguns usuários.',
        createdAt: '2024-01-22T11:15:00Z'
      },
      {
        id: '2',
        author: 'Ana Lima',
        content: 'Enviei um guia detalhado por email. Ticket resolvido.',
        createdAt: '2024-01-23T09:30:00Z'
      }
    ]
  }
]

export const TicketsList: React.FC<TicketsListProps> = ({
  filters,
  searchTerm,
  viewMode,
  onTicketSelect
}) => {
  const [tickets, setTickets] = useState(mockTickets)
  const [loading, setLoading] = useState(false)

  // Simular filtros
  const filteredTickets = tickets.filter((ticket) => {
    // Filtro por status
    if (filters.status !== 'all' && ticket.status !== filters.status) {
      return false
    }

    // Filtro por prioridade
    if (filters.priority !== 'all' && ticket.priority !== filters.priority) {
      return false
    }

    // Filtro por categoria
    if (filters.category !== 'all' && ticket.category !== filters.category) {
      return false
    }

    // Filtro por agente
    if (filters.agent !== 'all') {
      if (filters.agent === 'unassigned' && ticket.agent !== null) {
        return false
      }
      if (filters.agent !== 'unassigned' && (!ticket.agent || ticket.agent.id !== filters.agent)) {
        return false
      }
    }

    // Busca geral
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesId = ticket.id.toLowerCase().includes(searchLower)
      const matchesTitle = ticket.title.toLowerCase().includes(searchLower)
      const matchesDescription = ticket.description.toLowerCase().includes(searchLower)
      const matchesClient = ticket.client.name.toLowerCase().includes(searchLower)
      
      if (!matchesId && !matchesTitle && !matchesDescription && !matchesClient) {
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

  if (filteredTickets.length === 0) {
    return <EmptyState filters={filters} searchTerm={searchTerm} />
  }

  return (
    <div>
      {/* Contador de resultados */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''} encontrado{filteredTickets.length !== 1 ? 's' : ''}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Ordenar por:</span>
          <select className="bg-transparent border-none text-orange-600 font-medium focus:ring-0">
            <option value="recent">Mais recentes</option>
            <option value="priority">Prioridade</option>
            <option value="status">Status</option>
            <option value="client">Cliente A-Z</option>
            <option value="agent">Agente</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTickets.map((ticket, index) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                index={index}
                onClick={() => onTicketSelect(ticket)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <TicketsTable
          tickets={filteredTickets}
          onTicketSelect={onTicketSelect}
        />
      )}
    </div>
  )
}
