'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AgentCard } from './AgentCard'
import { AgentsTable } from './AgentsTable'
import { EmptyState } from './EmptyState'

interface AgentsListProps {
  filters: any
  searchTerm: string
  viewMode: 'grid' | 'table'
  onAgentSelect: (agent: any) => void
  onActivationRequest: (agent: any) => void
  onEdit?: (agent: any) => void
  onDelete?: (agentId: string) => void
}

// Mock data - em produção viria da API
const mockAgents = [
  {
    id: 'agent-001',
    name: 'Assistente de Vendas Pro',
    description: 'Especialista em vendas B2B com foco em conversão e qualificação de leads',
    model: 'gpt-4',
    niche: 'vendas',
    role: 'assistant',
    status: 'active',
    userTypes: ['atendentes', 'admin'],
    activationModes: ['chat', 'kanban'],
    prompt: 'Você é um assistente especializado em vendas B2B. Seu objetivo é qualificar leads, identificar necessidades e conduzir o processo de vendas de forma consultiva...',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    createdBy: {
      id: 'u1',
      name: 'João Silva',
      avatar: null
    },
    usage: {
      totalInteractions: 1247,
      successRate: 87,
      avgResponseTime: 1.2,
      lastUsed: '2024-01-25T16:45:00Z'
    },
    integrations: {
      chat: { active: true, config: { autoResponse: true, priority: 'high' } },
      kanban: { active: true, config: { columns: ['leads', 'qualificados'] } },
      columns: { active: false, config: {} }
    }
  },
  {
    id: 'agent-002',
    name: 'Suporte Técnico Expert',
    description: 'Agente especializado em resolver problemas técnicos e orientar usuários',
    model: 'claude-3',
    niche: 'suporte',
    role: 'specialist',
    status: 'active',
    userTypes: ['atendentes'],
    activationModes: ['chat'],
    prompt: 'Você é um especialista em suporte técnico. Analise problemas de forma sistemática, forneça soluções claras e escaláveis...',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-24T11:30:00Z',
    createdBy: {
      id: 'u2',
      name: 'Maria Santos',
      avatar: null
    },
    usage: {
      totalInteractions: 892,
      successRate: 94,
      avgResponseTime: 0.8,
      lastUsed: '2024-01-25T14:20:00Z'
    },
    integrations: {
      chat: { active: true, config: { autoResponse: false, priority: 'medium' } },
      kanban: { active: false, config: {} },
      columns: { active: false, config: {} }
    }
  },
  {
    id: 'agent-003',
    name: 'Marketing Digital Advisor',
    description: 'Consultor de marketing digital com expertise em campanhas e estratégias',
    model: 'gpt-3.5-turbo',
    niche: 'marketing',
    role: 'consultant',
    status: 'training',
    userTypes: ['admin', 'assinante'],
    activationModes: ['kanban', 'columns'],
    prompt: 'Como consultor de marketing digital, você deve analisar campanhas, sugerir estratégias e otimizar resultados...',
    createdAt: '2024-01-18T14:00:00Z',
    updatedAt: '2024-01-25T09:15:00Z',
    createdBy: {
      id: 'u3',
      name: 'Pedro Costa',
      avatar: null
    },
    usage: {
      totalInteractions: 156,
      successRate: 78,
      avgResponseTime: 2.1,
      lastUsed: '2024-01-24T10:30:00Z'
    },
    integrations: {
      chat: { active: false, config: {} },
      kanban: { active: true, config: { columns: ['campanhas', 'análise'] } },
      columns: { active: true, config: { columnIds: ['col-1', 'col-3'] } }
    }
  },
  {
    id: 'agent-004',
    name: 'Consultor Jurídico',
    description: 'Especialista em questões jurídicas empresariais e compliance',
    model: 'claude-2',
    niche: 'juridico',
    role: 'advisor',
    status: 'inactive',
    userTypes: ['admin'],
    activationModes: [],
    prompt: 'Você é um consultor jurídico especializado em direito empresarial. Forneça orientações precisas sobre compliance...',
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-20T16:45:00Z',
    createdBy: {
      id: 'u4',
      name: 'Ana Lima',
      avatar: null
    },
    usage: {
      totalInteractions: 45,
      successRate: 96,
      avgResponseTime: 3.5,
      lastUsed: '2024-01-18T15:20:00Z'
    },
    integrations: {
      chat: { active: false, config: {} },
      kanban: { active: false, config: {} },
      columns: { active: false, config: {} }
    }
  },
  {
    id: 'agent-005',
    name: 'Analista Financeiro IA',
    description: 'Agente especializado em análise financeira e relatórios',
    model: 'gemini-pro',
    niche: 'financeiro',
    role: 'analyst',
    status: 'active',
    userTypes: ['admin', 'assinante'],
    activationModes: ['chat', 'columns'],
    prompt: 'Como analista financeiro, você deve interpretar dados, gerar insights e criar relatórios detalhados...',
    createdAt: '2024-01-08T13:30:00Z',
    updatedAt: '2024-01-25T12:00:00Z',
    createdBy: {
      id: 'u1',
      name: 'João Silva',
      avatar: null
    },
    usage: {
      totalInteractions: 678,
      successRate: 91,
      avgResponseTime: 1.8,
      lastUsed: '2024-01-25T11:45:00Z'
    },
    integrations: {
      chat: { active: true, config: { autoResponse: true, priority: 'low' } },
      kanban: { active: false, config: {} },
      columns: { active: true, config: { columnIds: ['col-2', 'col-4'] } }
    }
  },
  {
    id: 'agent-006',
    name: 'RH Assistant',
    description: 'Assistente de recursos humanos para recrutamento e gestão de pessoas',
    model: 'gpt-4',
    niche: 'rh',
    role: 'assistant',
    status: 'error',
    userTypes: ['admin'],
    activationModes: ['chat'],
    prompt: 'Você é um assistente de RH especializado em recrutamento, seleção e gestão de pessoas...',
    createdAt: '2024-01-22T10:15:00Z',
    updatedAt: '2024-01-25T08:30:00Z',
    createdBy: {
      id: 'u2',
      name: 'Maria Santos',
      avatar: null
    },
    usage: {
      totalInteractions: 23,
      successRate: 65,
      avgResponseTime: 4.2,
      lastUsed: '2024-01-23T14:10:00Z'
    },
    integrations: {
      chat: { active: false, config: {} },
      kanban: { active: false, config: {} },
      columns: { active: false, config: {} }
    }
  }
]

export const AgentsList: React.FC<AgentsListProps> = ({
  filters,
  searchTerm,
  viewMode,
  onAgentSelect,
  onActivationRequest,
  onEdit,
  onDelete
}) => {
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Buscar agentes da API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true)
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('accessToken='))
          ?.split('=')[1]

        const params = new URLSearchParams()
        if (filters.status !== 'all') params.append('status', filters.status)
        if (filters.model !== 'all') params.append('model', filters.model)
        if (filters.niche !== 'all') params.append('niche', filters.niche)

        const response = await fetch(`/api/agents?${params.toString()}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })

        if (response.ok) {
          const data = await response.json()
          setAgents(data.agents || [])
        }
      } catch (error) {
        console.error('Erro ao buscar agentes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [filters.status, filters.model, filters.niche])

  // Simular filtros
  const filteredAgents = agents.filter((agent) => {
    // Filtro por status
    if (filters.status !== 'all' && agent.status !== filters.status) {
      return false
    }

    // Filtro por modelo
    if (filters.model !== 'all' && agent.model !== filters.model) {
      return false
    }

    // Filtro por nicho
    if (filters.niche !== 'all' && agent.niche !== filters.niche) {
      return false
    }

    // Filtro por função
    if (filters.role !== 'all' && agent.role !== filters.role) {
      return false
    }

    // Filtro por tipo de usuário
    if (filters.userType !== 'all' && !agent.userTypes.includes(filters.userType)) {
      return false
    }

    // Filtro por modo de ativação
    if (filters.activationMode !== 'all' && !agent.activationModes.includes(filters.activationMode)) {
      return false
    }

    // Busca geral
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesName = agent.name.toLowerCase().includes(searchLower)
      const matchesDescription = agent.description.toLowerCase().includes(searchLower)
      const matchesNiche = agent.niche.toLowerCase().includes(searchLower)
      
      if (!matchesName && !matchesDescription && !matchesNiche) {
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

  if (filteredAgents.length === 0) {
    return <EmptyState filters={filters} searchTerm={searchTerm} />
  }

  return (
    <div>
      {/* Contador de resultados */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredAgents.length} agente{filteredAgents.length !== 1 ? 's' : ''} encontrado{filteredAgents.length !== 1 ? 's' : ''}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Ordenar por:</span>
          <select className="bg-transparent border-none text-orange-600 font-medium focus:ring-0">
            <option value="usage">Mais usados</option>
            <option value="name">Nome A-Z</option>
            <option value="recent">Mais recentes</option>
            <option value="status">Status</option>
            <option value="model">Modelo</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredAgents.map((agent, index) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                index={index}
                onClick={() => onAgentSelect(agent)}
                onActivationRequest={() => onActivationRequest(agent)}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <AgentsTable
          agents={filteredAgents}
          onAgentSelect={onAgentSelect}
          onActivationRequest={onActivationRequest}
        />
      )}
    </div>
  )
}
