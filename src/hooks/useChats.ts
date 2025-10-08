'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Chat, ChatFilter } from '@/types/chat'
import { useAuth } from '@/contexts/AuthContext'

interface UseChatsOptions {
  sessionId?: string
  autoRefresh?: boolean
  refreshInterval?: number
  chatMeta?: Record<string, any> // Metadados dos chats para filtros de status
}

interface UseChatsReturn {
  chats: Chat[]
  filteredChats: Chat[]
  isLoading: boolean
  error: string | null
  total: number
  hasMore: boolean
  filter: ChatFilter
  setFilter: (filter: ChatFilter) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  refreshChats: () => Promise<void>
  loadMore: () => Promise<void>
  selectChat: (chatId: string) => Chat | undefined
}

export const useChats = (options: UseChatsOptions = {}): UseChatsReturn => {
  const { user } = useAuth()
  const {
    sessionId: providedSessionId,
    autoRefresh = true,
    refreshInterval = 30000, // 30 segundos
    chatMeta = {}
  } = options

  const [chats, setChats] = useState<Chat[]>([])
  const [filteredChats, setFilteredChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState<ChatFilter>({ status: 'all' })
  const [searchQuery, setSearchQuery] = useState('')

  // Usar ref para offset para evitar dependência circular
  const offsetRef = useRef(0)
  const isLoadingRef = useRef(false)
  const limit = 50
  const sessionId = providedSessionId || (user ? `session-${user.id}` : null)

  // Buscar chats da API
  const fetchChats = useCallback(async (resetOffset = false) => {
    if (!sessionId || !user || isLoadingRef.current) return

    try {
      isLoadingRef.current = true
      setIsLoading(true)
      setError(null)

      // Usar ref para offset
      const currentOffset = resetOffset ? 0 : offsetRef.current
      const token = localStorage.getItem('accessToken')

      console.log('🔍 Buscando chats...', { sessionId, offset: currentOffset, limit })

      const response = await fetch(`/api/chats/overview?sessionId=${sessionId}&limit=${limit}&offset=${currentOffset}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        // Se não é erro crítico, apenas log e continua
        if (data.code === 'SESSION_NOT_CONNECTED' || data.code === 'SESSION_RECREATED') {
          console.log('⚠️ Sessão WhatsApp não conectada:', data.sessionStatus)
          setChats([])
          setTotal(0)
          setError(`WhatsApp não conectado. Status: ${data.sessionStatus}`)
          return
        }
        
        throw new Error(data.error || 'Erro ao buscar chats')
      }

      console.log('✅ Chats recebidos:', data.chats?.length || 0)

      // Converter timestamps de string para Date
      const processedChats = data.chats.map((chat: Chat) => ({
        ...chat,
        lastMessageTimestamp: chat.lastMessageTimestamp ? new Date(chat.lastMessageTimestamp) : undefined,
        lastMessage: chat.lastMessage ? {
          ...chat.lastMessage,
          timestamp: new Date(chat.lastMessage.timestamp)
        } : undefined,
        contact: chat.contact ? {
          ...chat.contact,
          lastSeen: chat.contact.lastSeen ? new Date(chat.contact.lastSeen) : undefined
        } : undefined
      }))

      if (resetOffset) {
        setChats(processedChats)
        offsetRef.current = limit
      } else {
        setChats(prev => [...prev, ...processedChats])
        offsetRef.current += limit
      }

      setTotal(data.total)

    } catch (err) {
      console.error('❌ Erro ao buscar chats:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }, [sessionId, user, limit]) // Removido offset das dependências

  // Refresh chats (reset)
  const refreshChats = useCallback(async () => {
    offsetRef.current = 0
    await fetchChats(true)
  }, [fetchChats])

  // Load more chats
  const loadMore = useCallback(async () => {
    if (chats.length < total) {
      await fetchChats(false)
    }
  }, [fetchChats, chats.length, total])

  // Selecionar chat por ID
  const selectChat = useCallback((chatId: string): Chat | undefined => {
    return chats.find(chat => chat.id === chatId)
  }, [chats])

  // Filtrar chats
  useEffect(() => {
    console.log('🔍 useChats - Aplicando filtros:', { filterStatus: filter.status, totalChats: chats.length })
    let filtered = [...chats]

    // Filtro de status
    switch (filter.status) {
      case 'unread':
        filtered = filtered.filter(chat => chat.unreadCount > 0)
        break
      case 'archived':
        filtered = filtered.filter(chat => chat.isArchived)
        break
      case 'pinned':
        filtered = filtered.filter(chat => chat.isPinned)
        break
      case 'favorites':
        filtered = filtered.filter(chat => chat.isPinned)
        break
      case 'groups':
        filtered = filtered.filter(chat => chat.isGroup)
        break
      case 'in_progress':
        filtered = filtered.filter(chat => chatMeta[chat.id]?.status?.code === 'EM_ANDAMENTO')
        break
      case 'waiting':
        filtered = filtered.filter(chat => chatMeta[chat.id]?.status?.code === 'AGUARDANDO')
        break
      case 'finished':
        filtered = filtered.filter(chat => chatMeta[chat.id]?.status?.code === 'FINALIZADO')
        break
      case 'all':
        // Não filtrar nada, mostrar todos
        break
    }

    // Filtro de busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(chat =>
        chat.name.toLowerCase().includes(query) ||
        chat.contact?.phone.includes(query) ||
        chat.lastMessage?.body?.toLowerCase().includes(query) ||
        chat.contact?.name?.toLowerCase().includes(query)
      )
    }

    // Filtro de tickets
    if (filter.hasTicket) {
      filtered = filtered.filter(chat => chat.ticket)
    }

    if (filter.ticketStatus) {
      filtered = filtered.filter(chat => chat.ticket?.status === filter.ticketStatus)
    }

    // Filtro de labels
    if (filter.labels && filter.labels.length > 0) {
      filtered = filtered.filter(chat => 
        filter.labels!.some(label => chat.labels.includes(label))
      )
    }

    // Filtro de data
    if (filter.dateFrom || filter.dateTo) {
      filtered = filtered.filter(chat => {
        if (!chat.lastMessageTimestamp) return false
        
        const messageTime = chat.lastMessageTimestamp.getTime()
        
        if (filter.dateFrom && messageTime < filter.dateFrom.getTime()) {
          return false
        }
        
        if (filter.dateTo && messageTime > filter.dateTo.getTime()) {
          return false
        }
        
        return true
      })
    }

    // Ordenar por última mensagem
    filtered.sort((a, b) => {
      // Pinados primeiro
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      
      // Depois por timestamp - com verificação de tipo
      const timeA = a.lastMessageTimestamp instanceof Date 
        ? a.lastMessageTimestamp.getTime() 
        : (a.lastMessageTimestamp ? new Date(a.lastMessageTimestamp).getTime() : 0)
        
      const timeB = b.lastMessageTimestamp instanceof Date 
        ? b.lastMessageTimestamp.getTime() 
        : (b.lastMessageTimestamp ? new Date(b.lastMessageTimestamp).getTime() : 0)
        
      return timeB - timeA
    })

    console.log('✅ useChats - Filtros aplicados:', { filteredCount: filtered.length, originalCount: chats.length })
    setFilteredChats(filtered)
  }, [chats, filter, searchQuery, chatMeta])

  // Carregar chats iniciais
  useEffect(() => {
    if (sessionId && user) {
      refreshChats()
    }
  }, [sessionId, user, refreshChats])

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh || !sessionId || !user) return

    const interval = setInterval(() => {
      console.log('🔄 Auto-refresh chats...')
      refreshChats()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, sessionId, user, refreshChats])

  return {
    chats,
    filteredChats,
    isLoading,
    error,
    total,
    hasMore: chats.length < total,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    refreshChats,
    loadMore,
    selectChat
  }
}
