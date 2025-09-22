'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SaleCard } from './SaleCard'
import { SalesTable } from './SalesTable'
import { EmptyState } from './EmptyState'

interface SalesListProps {
  filters: any
  searchTerm: string
  viewMode: 'grid' | 'table'
  onSaleSelect: (sale: any) => void
}

// Mock data - em produção viria da API
const mockSales = [
  {
    id: 'sale-001',
    saleNumber: 'VND-2024-001',
    customer: {
      id: 'sub-001',
      name: 'João Silva',
      email: 'joao.silva@email.com',
      company: 'Tech Solutions Ltda'
    },
    plan: {
      id: 'plan-002',
      name: 'Plano Profissional',
      price: 99.90,
      period: 'monthly'
    },
    amount: 99.90,
    discount: 0,
    finalAmount: 99.90,
    status: 'completed',
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    createdAt: '2024-01-25T10:00:00Z',
    paidAt: '2024-01-25T10:05:00Z',
    activationDate: '2024-01-25T10:05:00Z',
    expirationDate: '2024-02-25T10:05:00Z',
    notes: 'Venda realizada via site',
    commission: 9.99,
    seller: 'Sistema Automático'
  },
  {
    id: 'sale-002',
    saleNumber: 'VND-2024-002',
    customer: {
      id: 'sub-002',
      name: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      company: 'Marketing Digital RJ'
    },
    plan: {
      id: 'plan-003',
      name: 'Plano Premium',
      price: 199.90,
      period: 'monthly'
    },
    amount: 199.90,
    discount: 20,
    finalAmount: 159.92,
    status: 'completed',
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    createdAt: '2024-01-24T14:30:00Z',
    paidAt: '2024-01-24T14:32:00Z',
    activationDate: '2024-01-24T14:32:00Z',
    expirationDate: '2024-02-24T14:32:00Z',
    notes: 'Cliente antigo - desconto de fidelidade',
    commission: 15.99,
    seller: 'Carlos Vendedor'
  },
  {
    id: 'sale-003',
    saleNumber: 'VND-2024-003',
    customer: {
      id: 'sub-003',
      name: 'Pedro Costa',
      email: 'pedro@startup.com',
      company: 'StartupBH'
    },
    plan: {
      id: 'plan-001',
      name: 'Plano Básico',
      price: 49.90,
      period: 'monthly'
    },
    amount: 49.90,
    discount: 0,
    finalAmount: 49.90,
    status: 'pending',
    paymentMethod: 'boleto',
    paymentStatus: 'pending',
    createdAt: '2024-01-25T16:45:00Z',
    paidAt: null,
    activationDate: null,
    expirationDate: null,
    notes: 'Aguardando pagamento do boleto',
    commission: 0,
    seller: 'Ana Consultora'
  },
  {
    id: 'sale-004',
    saleNumber: 'VND-2024-004',
    customer: {
      id: 'sub-004',
      name: 'Ana Lima',
      email: 'ana.lima@consultoria.com',
      company: 'Consultoria Nordeste'
    },
    plan: {
      id: 'plan-005',
      name: 'Plano Enterprise',
      price: 499.90,
      period: 'annual'
    },
    amount: 499.90,
    discount: 10,
    finalAmount: 449.91,
    status: 'cancelled',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'failed',
    createdAt: '2024-01-23T09:15:00Z',
    paidAt: null,
    activationDate: null,
    expirationDate: null,
    notes: 'Cancelada por falha no pagamento',
    commission: 0,
    seller: 'Roberto Gerente'
  },
  {
    id: 'sale-005',
    saleNumber: 'VND-2024-005',
    customer: {
      id: 'sub-005',
      name: 'Carlos Oliveira',
      email: 'carlos@agencia.com',
      company: 'Agência Digital SC'
    },
    plan: {
      id: 'plan-003',
      name: 'Plano Premium',
      price: 199.90,
      period: 'monthly'
    },
    amount: 199.90,
    discount: 0,
    finalAmount: 199.90,
    status: 'completed',
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    createdAt: '2024-01-22T11:20:00Z',
    paidAt: '2024-01-22T11:25:00Z',
    activationDate: '2024-01-22T11:25:00Z',
    expirationDate: '2024-02-22T11:25:00Z',
    notes: 'Upgrade do plano básico',
    commission: 19.99,
    seller: 'Sistema Automático'
  },
  {
    id: 'sale-006',
    saleNumber: 'VND-2024-006',
    customer: {
      id: 'sub-006',
      name: 'Fernanda Rocha',
      email: 'fernanda@freelancer.com',
      company: null
    },
    plan: {
      id: 'plan-001',
      name: 'Plano Básico',
      price: 49.90,
      period: 'monthly'
    },
    amount: 49.90,
    discount: 0,
    finalAmount: 49.90,
    status: 'refunded',
    paymentMethod: 'pix',
    paymentStatus: 'refunded',
    createdAt: '2024-01-20T15:30:00Z',
    paidAt: '2024-01-20T15:32:00Z',
    activationDate: '2024-01-20T15:32:00Z',
    expirationDate: '2024-02-20T15:32:00Z',
    notes: 'Reembolso solicitado pelo cliente',
    commission: 0,
    seller: 'Suporte Técnico'
  }
]

export const SalesList: React.FC<SalesListProps> = ({
  filters,
  searchTerm,
  viewMode,
  onSaleSelect
}) => {
  const [sales, setSales] = useState(mockSales)
  const [loading, setLoading] = useState(false)

  // Simular filtros
  const filteredSales = sales.filter((sale) => {
    // Filtro por status da venda
    if (filters.status !== 'all' && sale.status !== filters.status) {
      return false
    }

    // Filtro por plano
    if (filters.plan !== 'all') {
      const planCategory = sale.plan.name.toLowerCase()
      if (filters.plan === 'basic' && !planCategory.includes('básico')) return false
      if (filters.plan === 'professional' && !planCategory.includes('profissional')) return false
      if (filters.plan === 'premium' && !planCategory.includes('premium')) return false
      if (filters.plan === 'enterprise' && !planCategory.includes('enterprise')) return false
    }

    // Filtro por método de pagamento
    if (filters.paymentMethod !== 'all' && sale.paymentMethod !== filters.paymentMethod) {
      return false
    }

    // Filtro por status do pagamento
    if (filters.paymentStatus !== 'all' && sale.paymentStatus !== filters.paymentStatus) {
      return false
    }

    // Filtro por faixa de preço
    if (filters.priceRange !== 'all') {
      const amount = sale.finalAmount
      switch (filters.priceRange) {
        case '0-50':
          if (amount > 50) return false
          break
        case '50-100':
          if (amount <= 50 || amount > 100) return false
          break
        case '100-200':
          if (amount <= 100 || amount > 200) return false
          break
        case '200-500':
          if (amount <= 200 || amount > 500) return false
          break
        case '500+':
          if (amount <= 500) return false
          break
      }
    }

    // Filtro por período (implementação básica)
    if (filters.dateRange !== 'all') {
      const createdDate = new Date(sale.createdAt)
      const now = new Date()
      
      switch (filters.dateRange) {
        case 'today':
          if (createdDate.toDateString() !== now.toDateString()) return false
          break
        case 'yesterday':
          const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          if (createdDate.toDateString() !== yesterday.toDateString()) return false
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
      const matchesNumber = sale.saleNumber.toLowerCase().includes(searchLower)
      const matchesCustomer = sale.customer.name.toLowerCase().includes(searchLower)
      const matchesEmail = sale.customer.email.toLowerCase().includes(searchLower)
      const matchesCompany = sale.customer.company?.toLowerCase().includes(searchLower)
      const matchesPlan = sale.plan.name.toLowerCase().includes(searchLower)
      const matchesSeller = sale.seller.toLowerCase().includes(searchLower)
      
      if (!matchesNumber && !matchesCustomer && !matchesEmail && !matchesCompany && !matchesPlan && !matchesSeller) {
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

  if (filteredSales.length === 0) {
    return <EmptyState filters={filters} searchTerm={searchTerm} />
  }

  return (
    <div>
      {/* Contador de resultados */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredSales.length} venda{filteredSales.length !== 1 ? 's' : ''} encontrada{filteredSales.length !== 1 ? 's' : ''}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Ordenar por:</span>
          <select className="bg-transparent border-none text-green-600 font-medium focus:ring-0">
            <option value="recent">Mais recentes</option>
            <option value="amount">Maior valor</option>
            <option value="customer">Cliente A-Z</option>
            <option value="status">Status</option>
            <option value="plan">Plano</option>
            <option value="payment">Pagamento</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSales.map((sale, index) => (
              <SaleCard
                key={sale.id}
                sale={sale}
                index={index}
                onClick={() => onSaleSelect(sale)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <SalesTable
          sales={filteredSales}
          onSaleSelect={onSaleSelect}
        />
      )}
    </div>
  )
}
