'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QuoteCard } from './QuoteCard'
import { QuotesTable } from './QuotesTable'
import { EmptyState } from './EmptyState'
import { getAuthToken } from '@/lib/auth-token'

interface QuotesListProps {
  filters: any
  searchTerm: string
  viewMode: 'grid' | 'table'
  onQuoteSelect: (quote: any) => void
  onEdit?: (quote: any) => void
  onDelete?: (quoteId: string) => void
}

export const QuotesList: React.FC<QuotesListProps> = ({
  filters,
  searchTerm,
  viewMode,
  onQuoteSelect,
  onEdit,
  onDelete
}) => {
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const handleDelete = async (quoteId: string) => {
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch(`/api/quotes?id=${quoteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setQuotes(prev => prev.filter(q => q.id !== quoteId))
        onDelete?.(quoteId)
      }
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error)
    }
  }

  // Buscar orçamentos da API
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true)
        const token = getAuthToken()
        
        if (!token) {
          console.error('Token não encontrado')
          setQuotes([])
          return
        }

        const params = new URLSearchParams()
        if (filters.status && filters.status !== 'all') params.append('status', filters.status)

        const response = await fetch(`/api/quotes?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          // Transformar dados da API para o formato esperado
          const transformedQuotes = data.quotes.map((quote: any) => ({
            id: quote.id,
            title: quote.title,
            description: quote.description,
            client: quote.contact || { id: '', name: 'Sem cliente', email: '' },
            agent: quote.createdBy || { id: '', name: 'Não atribuído' },
            value: parseFloat(quote.total || quote.amount),
            status: quote.status,
            priority: 'medium',
            createdAt: quote.createdAt,
            updatedAt: quote.updatedAt,
            expiresAt: quote.validUntil,
            items: quote.items || [],
            notes: quote.description,
            tags: []
          }))
          setQuotes(transformedQuotes)
        } else {
          console.error('Erro ao buscar orçamentos')
          setQuotes([])
        }
      } catch (error) {
        console.error('Erro ao buscar orçamentos:', error)
        setQuotes([])
      } finally {
        setLoading(false)
      }
    }

    fetchQuotes()
  }, [filters.status])

  // Filtros locais
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
                onEdit={onEdit}
                onDelete={handleDelete}
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
