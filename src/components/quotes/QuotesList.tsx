'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QuoteCard } from './QuoteCard'
import { QuotesTable } from './QuotesTable'
import { EmptyState } from './EmptyState'

interface QuotesListProps {
  filters: any
  searchTerm: string
  viewMode: 'grid' | 'table'
  onQuoteSelect: (quote: any) => void
}

// Mock data - em produção viria da API
const mockQuotes = [
  {
    id: '1',
    title: 'Website Institucional',
    description: 'Desenvolvimento de website moderno com CMS',
    client: {
      id: 'c1',
      name: 'Empresa ABC Ltda',
      email: 'contato@empresaabc.com',
      avatar: null
    },
    agent: {
      id: 'a1',
      name: 'João Silva',
      avatar: null
    },
    value: 15000,
    status: 'pending',
    priority: 'high',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    expiresAt: '2024-02-15T23:59:59Z',
    items: [
      { name: 'Design UI/UX', quantity: 1, price: 5000 },
      { name: 'Desenvolvimento Frontend', quantity: 1, price: 6000 },
      { name: 'Desenvolvimento Backend', quantity: 1, price: 4000 }
    ],
    notes: 'Cliente solicitou entrega em 30 dias',
    tags: ['Website', 'Urgente']
  },
  {
    id: '2',
    title: 'App Mobile E-commerce',
    description: 'Aplicativo mobile para vendas online',
    client: {
      id: 'c2',
      name: 'Tech Solutions',
      email: 'dev@techsolutions.com',
      avatar: null
    },
    agent: {
      id: 'a2',
      name: 'Maria Santos',
      avatar: null
    },
    value: 25000,
    status: 'approved',
    priority: 'medium',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:00:00Z',
    expiresAt: '2024-02-10T23:59:59Z',
    items: [
      { name: 'Design Mobile', quantity: 1, price: 8000 },
      { name: 'Desenvolvimento iOS', quantity: 1, price: 8500 },
      { name: 'Desenvolvimento Android', quantity: 1, price: 8500 }
    ],
    notes: 'Incluir sistema de pagamento integrado',
    tags: ['Mobile', 'E-commerce']
  },
  {
    id: '3',
    title: 'Sistema CRM',
    description: 'Plataforma de gerenciamento de clientes',
    client: {
      id: 'c3',
      name: 'Vendas Pro',
      email: 'admin@vendaspro.com',
      avatar: null
    },
    agent: {
      id: 'a3',
      name: 'Pedro Costa',
      avatar: null
    },
    value: 35000,
    status: 'rejected',
    priority: 'low',
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-12T10:30:00Z',
    expiresAt: '2024-02-05T23:59:59Z',
    items: [
      { name: 'Análise de Requisitos', quantity: 1, price: 5000 },
      { name: 'Desenvolvimento Sistema', quantity: 1, price: 20000 },
      { name: 'Integração APIs', quantity: 1, price: 10000 }
    ],
    notes: 'Cliente solicitou revisão de escopo',
    tags: ['CRM', 'Integração']
  },
  {
    id: '4',
    title: 'Landing Page',
    description: 'Página de captura para campanha',
    client: {
      id: 'c4',
      name: 'Marketing Digital',
      email: 'contato@marketing.com',
      avatar: null
    },
    agent: {
      id: 'a1',
      name: 'João Silva',
      avatar: null
    },
    value: 3500,
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-22T09:15:00Z',
    expiresAt: '2024-02-20T23:59:59Z',
    items: [
      { name: 'Design Landing Page', quantity: 1, price: 2000 },
      { name: 'Implementação', quantity: 1, price: 1500 }
    ],
    notes: 'Prazo de entrega: 1 semana',
    tags: ['Landing Page', 'Marketing']
  }
]

export const QuotesList: React.FC<QuotesListProps> = ({
  filters,
  searchTerm,
  viewMode,
  onQuoteSelect
}) => {
  const [quotes, setQuotes] = useState(mockQuotes)
  const [loading, setLoading] = useState(false)

  // Simular filtros
  const filteredQuotes = quotes.filter((quote) => {
    // Filtro por status
    if (filters.status !== 'all' && quote.status !== filters.status) {
      return false
    }

    // Filtro por agente  
    if (filters.agent !== 'all' && quote.agent.id !== filters.agent) {
      return false
    }

    // Filtro por cliente (busca no nome)
    if (filters.client && !quote.client.name.toLowerCase().includes(filters.client.toLowerCase())) {
      return false
    }

    // Filtro por valor mínimo
    if (filters.minValue && quote.value < parseFloat(filters.minValue)) {
      return false
    }

    // Filtro por valor máximo
    if (filters.maxValue && quote.value > parseFloat(filters.maxValue)) {
      return false
    }

    // Busca geral
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesTitle = quote.title.toLowerCase().includes(searchLower)
      const matchesClient = quote.client.name.toLowerCase().includes(searchLower)
      const matchesDescription = quote.description.toLowerCase().includes(searchLower)
      
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

  if (filteredQuotes.length === 0) {
    return <EmptyState filters={filters} searchTerm={searchTerm} />
  }

  return (
    <div>
      {/* Contador de resultados */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredQuotes.length} orçamento{filteredQuotes.length !== 1 ? 's' : ''} encontrado{filteredQuotes.length !== 1 ? 's' : ''}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Ordenar por:</span>
          <select className="bg-transparent border-none text-orange-600 font-medium focus:ring-0">
            <option value="recent">Mais recentes</option>
            <option value="value-desc">Maior valor</option>
            <option value="value-asc">Menor valor</option>
            <option value="client">Cliente A-Z</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredQuotes.map((quote, index) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                index={index}
                onClick={() => onQuoteSelect(quote)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <QuotesTable
          quotes={filteredQuotes}
          onQuoteSelect={onQuoteSelect}
        />
      )}
    </div>
  )
}
