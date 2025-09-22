'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlanCard } from './PlanCard'
import { PlansTable } from './PlansTable'
import { EmptyState } from './EmptyState'

interface PlansListProps {
  filters: any
  searchTerm: string
  viewMode: 'grid' | 'table'
  onPlanSelect: (plan: any) => void
}

// Mock data - em produção viria da API
const mockPlans = [
  {
    id: 'plan-001',
    name: 'Plano Básico',
    description: 'Ideal para pequenos negócios que estão começando',
    category: 'basic',
    status: 'active',
    period: 'monthly',
    price: 49.90,
    originalPrice: 59.90,
    currency: 'BRL',
    features: [
      'Até 1.000 contatos',
      'Chat básico',
      'Kanban simples',
      'Relatórios básicos',
      'Suporte por email'
    ],
    benefits: [
      'Setup gratuito',
      'Treinamento incluído',
      'Sem taxa de cancelamento'
    ],
    advantages: [
      'Fácil de usar',
      'Preço acessível',
      'Ideal para iniciantes'
    ],
    subscribers: 89,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    isPopular: false,
    discount: 17,
    trial: {
      enabled: true,
      days: 7
    }
  },
  {
    id: 'plan-002',
    name: 'Plano Profissional',
    description: 'Para empresas em crescimento que precisam de mais recursos',
    category: 'professional',
    status: 'active',
    period: 'monthly',
    price: 99.90,
    originalPrice: 119.90,
    currency: 'BRL',
    features: [
      'Até 5.000 contatos',
      'Chat avançado com IA',
      'Kanban completo',
      'Automações básicas',
      'Relatórios avançados',
      'Integrações limitadas',
      'Suporte prioritário'
    ],
    benefits: [
      'Migração assistida',
      'Treinamento personalizado',
      'Suporte telefônico',
      'API básica incluída'
    ],
    advantages: [
      'Recursos avançados',
      'Escalabilidade',
      'Suporte premium'
    ],
    subscribers: 156,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-25T11:30:00Z',
    isPopular: true,
    discount: 17,
    trial: {
      enabled: true,
      days: 14
    }
  },
  {
    id: 'plan-003',
    name: 'Plano Premium',
    description: 'Solução completa para empresas estabelecidas',
    category: 'premium',
    status: 'active',
    period: 'monthly',
    price: 199.90,
    originalPrice: 249.90,
    currency: 'BRL',
    features: [
      'Contatos ilimitados',
      'IA avançada personalizada',
      'Kanban enterprise',
      'Automações avançadas',
      'Relatórios personalizados',
      'Todas as integrações',
      'Suporte 24/7',
      'API completa',
      'White label'
    ],
    benefits: [
      'Implementação dedicada',
      'Treinamento completo',
      'Gerente de conta',
      'SLA garantido',
      'Backup prioritário'
    ],
    advantages: [
      'Recursos ilimitados',
      'Personalização total',
      'Suporte dedicado'
    ],
    subscribers: 78,
    createdAt: '2024-01-08T13:30:00Z',
    updatedAt: '2024-01-24T16:45:00Z',
    isPopular: false,
    discount: 20,
    trial: {
      enabled: true,
      days: 30
    }
  },
  {
    id: 'plan-004',
    name: 'Plano Anual Básico',
    description: 'Plano básico com desconto anual',
    category: 'basic',
    status: 'active',
    period: 'annual',
    price: 39.90,
    originalPrice: 49.90,
    currency: 'BRL',
    features: [
      'Até 1.000 contatos',
      'Chat básico',
      'Kanban simples',
      'Relatórios básicos',
      'Suporte por email'
    ],
    benefits: [
      '2 meses grátis',
      'Setup gratuito',
      'Treinamento incluído'
    ],
    advantages: [
      'Economia de 20%',
      'Pagamento único',
      'Sem reajustes'
    ],
    subscribers: 134,
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-22T09:15:00Z',
    isPopular: false,
    discount: 20,
    trial: {
      enabled: true,
      days: 7
    }
  },
  {
    id: 'plan-005',
    name: 'Plano Enterprise',
    description: 'Solução personalizada para grandes corporações',
    category: 'enterprise',
    status: 'active',
    period: 'annual',
    price: 499.90,
    originalPrice: 599.90,
    currency: 'BRL',
    features: [
      'Recursos ilimitados',
      'IA personalizada',
      'Infraestrutura dedicada',
      'Integrações customizadas',
      'Relatórios corporativos',
      'Múltiplas marcas',
      'Suporte dedicado',
      'SLA personalizado'
    ],
    benefits: [
      'Implementação completa',
      'Treinamento corporativo',
      'Suporte 24/7/365',
      'Infraestrutura dedicada',
      'Compliance garantido'
    ],
    advantages: [
      'Solução sob medida',
      'Escalabilidade infinita',
      'Segurança máxima'
    ],
    subscribers: 12,
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-25T12:00:00Z',
    isPopular: false,
    discount: 17,
    trial: {
      enabled: true,
      days: 60
    }
  },
  {
    id: 'plan-006',
    name: 'Plano Starter',
    description: 'Plano gratuito para testar a plataforma',
    category: 'basic',
    status: 'active',
    period: 'monthly',
    price: 0,
    originalPrice: 0,
    currency: 'BRL',
    features: [
      'Até 100 contatos',
      'Chat básico',
      'Kanban limitado',
      'Relatórios simples'
    ],
    benefits: [
      'Gratuito para sempre',
      'Sem cartão de crédito',
      'Upgrade fácil'
    ],
    advantages: [
      'Sem custos',
      'Teste completo',
      'Sem compromisso'
    ],
    subscribers: 423,
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-25T15:20:00Z',
    isPopular: false,
    discount: 0,
    trial: {
      enabled: false,
      days: 0
    }
  },
  {
    id: 'plan-007',
    name: 'Plano Trimestral Pro',
    description: 'Plano profissional com cobrança trimestral',
    category: 'professional',
    status: 'draft',
    period: 'quarterly',
    price: 89.90,
    originalPrice: 99.90,
    currency: 'BRL',
    features: [
      'Até 5.000 contatos',
      'Chat avançado',
      'Kanban completo',
      'Automações básicas',
      'Relatórios avançados'
    ],
    benefits: [
      '10% de desconto',
      'Pagamento trimestral',
      'Suporte prioritário'
    ],
    advantages: [
      'Economia garantida',
      'Fluxo de caixa melhor',
      'Menos cobrança'
    ],
    subscribers: 0,
    createdAt: '2024-01-25T09:00:00Z',
    updatedAt: '2024-01-25T09:00:00Z',
    isPopular: false,
    discount: 10,
    trial: {
      enabled: true,
      days: 14
    }
  },
  {
    id: 'plan-008',
    name: 'Plano Personalizado',
    description: 'Plano sob medida para necessidades específicas',
    category: 'custom',
    status: 'inactive',
    period: 'annual',
    price: 299.90,
    originalPrice: 349.90,
    currency: 'BRL',
    features: [
      'Recursos personalizados',
      'Desenvolvimento customizado',
      'Integrações específicas',
      'Suporte dedicado'
    ],
    benefits: [
      'Solução única',
      'Desenvolvimento incluído',
      'Suporte especializado'
    ],
    advantages: [
      'Totalmente personalizado',
      'Atende necessidades específicas',
      'Evolução contínua'
    ],
    subscribers: 5,
    createdAt: '2024-01-18T16:00:00Z',
    updatedAt: '2024-01-23T14:10:00Z',
    isPopular: false,
    discount: 14,
    trial: {
      enabled: true,
      days: 45
    }
  }
]

export const PlansList: React.FC<PlansListProps> = ({
  filters,
  searchTerm,
  viewMode,
  onPlanSelect
}) => {
  const [plans, setPlans] = useState(mockPlans)
  const [loading, setLoading] = useState(false)

  // Simular filtros
  const filteredPlans = plans.filter((plan) => {
    // Filtro por status
    if (filters.status !== 'all' && plan.status !== filters.status) {
      return false
    }

    // Filtro por período
    if (filters.period !== 'all' && plan.period !== filters.period) {
      return false
    }

    // Filtro por categoria
    if (filters.category !== 'all' && plan.category !== filters.category) {
      return false
    }

    // Filtro por faixa de preço
    if (filters.priceRange !== 'all') {
      const price = plan.price
      switch (filters.priceRange) {
        case '0-50':
          if (price > 50) return false
          break
        case '50-100':
          if (price < 50 || price > 100) return false
          break
        case '100-200':
          if (price < 100 || price > 200) return false
          break
        case '200-500':
          if (price < 200 || price > 500) return false
          break
        case '500+':
          if (price < 500) return false
          break
      }
    }

    // Busca geral
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesName = plan.name.toLowerCase().includes(searchLower)
      const matchesDescription = plan.description.toLowerCase().includes(searchLower)
      const matchesFeatures = plan.features.some(feature => 
        feature.toLowerCase().includes(searchLower)
      )
      
      if (!matchesName && !matchesDescription && !matchesFeatures) {
        return false
      }
    }

    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (filteredPlans.length === 0) {
    return <EmptyState filters={filters} searchTerm={searchTerm} />
  }

  return (
    <div>
      {/* Contador de resultados */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredPlans.length} plano{filteredPlans.length !== 1 ? 's' : ''} encontrado{filteredPlans.length !== 1 ? 's' : ''}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Ordenar por:</span>
          <select className="bg-transparent border-none text-purple-600 font-medium focus:ring-0">
            <option value="popularity">Mais populares</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="name">Nome A-Z</option>
            <option value="subscribers">Mais assinantes</option>
            <option value="recent">Mais recentes</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredPlans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                index={index}
                onClick={() => onPlanSelect(plan)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <PlansTable
          plans={filteredPlans}
          onPlanSelect={onPlanSelect}
        />
      )}
    </div>
  )
}
