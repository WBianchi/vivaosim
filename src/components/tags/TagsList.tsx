'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TagCard } from './TagCard'
import { TagsTable } from './TagsTable'
import { EmptyState } from './EmptyState'

interface TagsListProps {
  filters: any
  searchTerm: string
  viewMode: 'grid' | 'table'
  onTagSelect: (tag: any) => void
}

// Mock data - em produção viria da API
const mockTags = [
  {
    id: '1',
    name: 'Urgente',
    description: 'Tarefas que precisam de atenção imediata',
    color: 'red',
    category: 'prioridade',
    usageCount: 87,
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    createdBy: {
      id: 'u1',
      name: 'João Silva',
      avatar: null
    },
    relatedItems: {
      contracts: 12,
      quotes: 23,
      schedules: 15,
      tickets: 37
    }
  },
  {
    id: '2',
    name: 'E-commerce',
    description: 'Projetos relacionados a lojas virtuais',
    color: 'blue',
    category: 'projeto',
    usageCount: 64,
    status: 'active',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:00:00Z',
    createdBy: {
      id: 'u2',
      name: 'Maria Santos',
      avatar: null
    },
    relatedItems: {
      contracts: 8,
      quotes: 18,
      schedules: 12,
      tickets: 26
    }
  },
  {
    id: '3',
    name: 'VIP',
    description: 'Clientes premium com atendimento especial',
    color: 'purple',
    category: 'cliente',
    usageCount: 45,
    status: 'active',
    createdAt: '2024-01-08T14:00:00Z',
    updatedAt: '2024-01-22T11:30:00Z',
    createdBy: {
      id: 'u3',
      name: 'Pedro Costa',
      avatar: null
    },
    relatedItems: {
      contracts: 15,
      quotes: 12,
      schedules: 8,
      tickets: 10
    }
  },
  {
    id: '4',
    name: 'Marketing',
    description: 'Campanhas e materiais de marketing',
    color: 'green',
    category: 'departamento',
    usageCount: 38,
    status: 'active',
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-25T09:15:00Z',
    createdBy: {
      id: 'u4',
      name: 'Ana Lima',
      avatar: null
    },
    relatedItems: {
      contracts: 5,
      quotes: 14,
      schedules: 9,
      tickets: 10
    }
  },
  {
    id: '5',
    name: 'Concluído',
    description: 'Projetos finalizados com sucesso',
    color: 'green',
    category: 'status',
    usageCount: 156,
    status: 'active',
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-20T17:45:00Z',
    createdBy: {
      id: 'u1',
      name: 'João Silva',
      avatar: null
    },
    relatedItems: {
      contracts: 45,
      quotes: 67,
      schedules: 23,
      tickets: 21
    }
  },
  {
    id: '6',
    name: 'Mobile',
    description: 'Desenvolvimento de aplicativos móveis',
    color: 'orange',
    category: 'servico',
    usageCount: 29,
    status: 'active',
    createdAt: '2024-01-18T13:00:00Z',
    updatedAt: '2024-01-24T10:20:00Z',
    createdBy: {
      id: 'u2',
      name: 'Maria Santos',
      avatar: null
    },
    relatedItems: {
      contracts: 7,
      quotes: 11,
      schedules: 6,
      tickets: 5
    }
  },
  {
    id: '7',
    name: 'Pausado',
    description: 'Projetos temporariamente suspensos',
    color: 'yellow',
    category: 'status',
    usageCount: 12,
    status: 'active',
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-21T14:15:00Z',
    createdBy: {
      id: 'u3',
      name: 'Pedro Costa',
      avatar: null
    },
    relatedItems: {
      contracts: 3,
      quotes: 4,
      schedules: 2,
      tickets: 3
    }
  },
  {
    id: '8',
    name: 'Consultoria',
    description: 'Serviços de consultoria especializada',
    color: 'purple',
    category: 'servico',
    usageCount: 34,
    status: 'active',
    createdAt: '2024-01-09T12:00:00Z',
    updatedAt: '2024-01-23T16:30:00Z',
    createdBy: {
      id: 'u4',
      name: 'Ana Lima',
      avatar: null
    },
    relatedItems: {
      contracts: 12,
      quotes: 8,
      schedules: 7,
      tickets: 7
    }
  },
  {
    id: '9',
    name: 'Arquivado',
    description: 'Itens arquivados para referência futura',
    color: 'gray',
    category: 'status',
    usageCount: 8,
    status: 'inactive',
    createdAt: '2024-01-06T10:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
    createdBy: {
      id: 'u1',
      name: 'João Silva',
      avatar: null
    },
    relatedItems: {
      contracts: 2,
      quotes: 3,
      schedules: 1,
      tickets: 2
    }
  },
  {
    id: '10',
    name: 'Beta',
    description: 'Recursos em fase de testes',
    color: 'pink',
    category: 'produto',
    usageCount: 5,
    status: 'active',
    createdAt: '2024-01-20T09:30:00Z',
    updatedAt: '2024-01-24T11:45:00Z',
    createdBy: {
      id: 'u2',
      name: 'Maria Santos',
      avatar: null
    },
    relatedItems: {
      contracts: 1,
      quotes: 2,
      schedules: 1,
      tickets: 1
    }
  }
]

export const TagsList: React.FC<TagsListProps> = ({
  filters,
  searchTerm,
  viewMode,
  onTagSelect
}) => {
  const [tags, setTags] = useState(mockTags)
  const [loading, setLoading] = useState(false)

  // Simular filtros
  const filteredTags = tags.filter((tag) => {
    // Filtro por categoria
    if (filters.category !== 'all' && tag.category !== filters.category) {
      return false
    }

    // Filtro por cor
    if (filters.color !== 'all' && tag.color !== filters.color) {
      return false
    }

    // Filtro por status
    if (filters.status !== 'all' && tag.status !== filters.status) {
      return false
    }

    // Filtro por uso
    if (filters.usage !== 'all') {
      switch (filters.usage) {
        case 'high':
          if (tag.usageCount < 50) return false
          break
        case 'medium':
          if (tag.usageCount < 10 || tag.usageCount >= 50) return false
          break
        case 'low':
          if (tag.usageCount < 1 || tag.usageCount >= 10) return false
          break
        case 'unused':
          if (tag.usageCount > 0) return false
          break
      }
    }

    // Busca geral
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesName = tag.name.toLowerCase().includes(searchLower)
      const matchesDescription = tag.description.toLowerCase().includes(searchLower)
      const matchesCategory = tag.category.toLowerCase().includes(searchLower)
      
      if (!matchesName && !matchesDescription && !matchesCategory) {
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

  if (filteredTags.length === 0) {
    return <EmptyState filters={filters} searchTerm={searchTerm} />
  }

  return (
    <div>
      {/* Contador de resultados */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredTags.length} tag{filteredTags.length !== 1 ? 's' : ''} encontrada{filteredTags.length !== 1 ? 's' : ''}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Ordenar por:</span>
          <select className="bg-transparent border-none text-orange-600 font-medium focus:ring-0">
            <option value="usage">Mais usadas</option>
            <option value="name">Nome A-Z</option>
            <option value="recent">Mais recentes</option>
            <option value="category">Categoria</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredTags.map((tag, index) => (
              <TagCard
                key={tag.id}
                tag={tag}
                index={index}
                onClick={() => onTagSelect(tag)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <TagsTable
          tags={filteredTags}
          onTagSelect={onTagSelect}
        />
      )}
    </div>
  )
}
