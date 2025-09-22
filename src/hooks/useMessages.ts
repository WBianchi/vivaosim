'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Message, Chat } from '@/types/chat'
import { useAuth } from '@/contexts/AuthContext'

interface UseMessagesOptions {
  chatId?: string
  autoRefresh?: boolean
  refreshInterval?: number
}

interface UseMessagesReturn {
  messages: Message[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  refreshMessages: () => Promise<void>
  loadMore: () => Promise<void>
  sendMessage: (text: string) => Promise<void>
}

export const useMessages = (options: UseMessagesOptions = {}): UseMessagesReturn => {
  const { user } = useAuth()
  const {
    chatId,
    autoRefresh = false, // Desabilitado por padrão para mensagens
    refreshInterval = 10000 // 10 segundos
  } = options

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)

  const isLoadingRef = useRef(false)
  const limit = 50

  // Buscar mensagens da API (apenas para refresh manual)
  const fetchMessages = useCallback(async (loadMore = false) => {
    if (!chatId || !user || isLoadingRef.current) return

    console.log('🔄 fetchMessages manual para:', chatId)
    
    try {
      isLoadingRef.current = true
      setIsLoading(true)
      setError(null)

      const token = localStorage.getItem('accessToken')
      const response = await fetch(`/api/chats/${chatId}/messages?limit=${limit}&downloadMedia=false`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.code === 'SESSION_NOT_CONNECTED' || data.code === 'CHAT_NOT_FOUND') {
          setMessages([])
          setError(`Chat não disponível: ${data.code}`)
          return
        }
        throw new Error(data.error || 'Erro ao buscar mensagens')
      }

      // Converter timestamps
      const processedMessages = data.messages.map((msg: Message) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
        editedTimestamp: msg.editedTimestamp ? new Date(msg.editedTimestamp) : undefined,
        revokedTimestamp: msg.revokedTimestamp ? new Date(msg.revokedTimestamp) : undefined
      }))

      // Ordenar por timestamp
      processedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

      if (loadMore) {
        setMessages(prev => [...processedMessages, ...prev])
      } else {
        setMessages(processedMessages)
      }

      setHasMore(data.messages.length === limit)

    } catch (err) {
      console.error('❌ Erro ao buscar mensagens:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }, [chatId, user, limit]) // Dependências mínimas

  // Refresh mensagens
  const refreshMessages = useCallback(async () => {
    await fetchMessages(false)
  }, [fetchMessages])

  // Load more mensagens (histórico)
  const loadMore = useCallback(async () => {
    if (hasMore) {
      await fetchMessages(true)
    }
  }, [fetchMessages, hasMore])

  // Enviar mensagem
  const sendMessage = useCallback(async (text: string) => {
    if (!chatId || !user || !text.trim()) return

    try {
      const token = localStorage.getItem('accessToken')

      const response = await fetch('/api/whatsapp/send/text', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId,
          text: text.trim()
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao enviar mensagem')
      }

      console.log('✅ Mensagem enviada')
      
      // Refresh mensagens após enviar
      setTimeout(() => refreshMessages(), 1000)

    } catch (err) {
      console.error('❌ Erro ao enviar mensagem:', err)
      throw err
    }
  }, [chatId, user, refreshMessages])

  // Carregar mensagens quando chatId muda (SEM dependência em fetchMessages)
  useEffect(() => {
    if (!chatId || !user) return

    console.log('🔄 useMessages useEffect: Carregando mensagens para chatId:', chatId, 'isLoadingRef:', isLoadingRef.current)
    
    setMessages([])
    setError(null)
    setIsLoading(true)

    // Função local para evitar dependência circular
    const loadMessages = async () => {
      if (isLoadingRef.current) return
      
      try {
        isLoadingRef.current = true
        
        const token = localStorage.getItem('accessToken')
        const response = await fetch(`/api/chats/${chatId}/messages?limit=${limit}&downloadMedia=false`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        const data = await response.json()

        if (!response.ok) {
          if (data.code === 'SESSION_NOT_CONNECTED' || data.code === 'CHAT_NOT_FOUND') {
            console.log('⚠️ Chat não encontrado ou sessão desconectada:', data.code)
            setMessages([])
            setError(`Chat não disponível: ${data.code}`)
            return
          }
          throw new Error(data.error || 'Erro ao buscar mensagens')
        }

        console.log('✅ Mensagens carregadas:', data.messages?.length || 0)

        // Converter timestamps
        const processedMessages = data.messages.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          editedTimestamp: msg.editedTimestamp ? new Date(msg.editedTimestamp) : undefined,
          revokedTimestamp: msg.revokedTimestamp ? new Date(msg.revokedTimestamp) : undefined
        }))

        // Ordenar por timestamp
        processedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        setMessages(processedMessages)
        setHasMore(data.messages.length === limit)

      } catch (err) {
        console.error('❌ Erro ao carregar mensagens:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        isLoadingRef.current = false
        setIsLoading(false)
      }
    }

    // Timeout para evitar chamadas muito rápidas
    const timeoutId = setTimeout(loadMessages, 200)
    return () => clearTimeout(timeoutId)
    
  }, [chatId, user]) // APENAS chatId e user como dependências

  // Auto refresh REMOVIDO para evitar loops - usar refresh manual

  return {
    messages,
    isLoading,
    error,
    hasMore,
    refreshMessages,
    loadMore,
    sendMessage
  }
}
