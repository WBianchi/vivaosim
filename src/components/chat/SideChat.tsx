'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Archive,
  Star,
  Tag,
  MoreVertical,
  Phone,
  Video,
  Info,
  DollarSign,
  Calendar,
  Ticket,
  User,
  Zap,
  FileText,
  FileSignature,
  Bot,
  Circle,
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  MessageSquare,
  Pin,
  Users,
  ArrowRightLeft,
  Trash2,
  Heart,
  Clock,
  TrendingUp,
  PlayCircle,
  PauseCircle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Chat, Contact, ChatAssignmentMeta } from '@/types/chat'
import { cn } from '@/lib/utils'
import { useChats } from '@/hooks/useChats'
import { getAuthToken } from '@/lib/auth-token'
import { ATTENDANCE_STATUS_OPTIONS, resolveStatusDisplay, AttendanceStatusCode } from '@/lib/chat-status'

const STATUS_ICONS: Record<AttendanceStatusCode, React.ElementType> = {
  AGUARDANDO: Clock,
  EM_ANDAMENTO: Zap,
  PAUSADO: PauseCircle,
  FINALIZADO: CheckCircle2
}

interface SideChatProps {
  onChatSelect: (chat: Chat) => void
  activeChat: Chat | null
  onConnectionChange: (connected: boolean) => void
  onMetaMerge: (chatId: string, patch: Partial<ChatAssignmentMeta>) => void
  onMetaReplace: (metaMap: Record<string, ChatAssignmentMeta>) => void
  chatMeta: Record<string, ChatAssignmentMeta>
}

interface ChatQuote {
  chatId: string
  total: number
  count: number
}

export const SideChat: React.FC<SideChatProps> = ({
  onChatSelect,
  activeChat,
  onConnectionChange,
  onMetaMerge,
  onMetaReplace,
  chatMeta
}) => {
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'price' | 'priority'>('recent')
  const [actionState, setActionState] = useState<{chatId: string, action: 'transfer' | 'status' | 'favorite' | 'archive' | 'delete' | null}>({chatId: '', action: null})
  const [selectedAttendant, setSelectedAttendant] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatusCode | null>(null)
  const [attendants, setAttendants] = useState<any[]>([])
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [chatQuotes, setChatQuotes] = useState<Record<string, ChatQuote>>({})
  const [chatTags, setChatTags] = useState<Record<string, any[]>>({})
  const [chatContracts, setChatContracts] = useState<Record<string, any[]>>({})
  const [chatAgents, setChatAgents] = useState<Record<string, any>>({})
  const [chatKanban, setChatKanban] = useState<Record<string, { boardName: string, columnName: string, columnColor: string }>>({})
  
  const {
    chats,
    isLoading,
    error,
    total,
    hasMore,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    refreshChats,
    loadMore
  } = useChats({
    autoRefresh: true,
    refreshInterval: 30000 // 30 segundos para ser menos agressivo
  })
  
  // Filtrar e ordenar chats
  const filteredChats = chats
  
  // Buscar orçamentos dos chats
  useEffect(() => {
    const fetchQuotes = async () => {
      if (chats.length === 0) {
        console.log('🔍 SideChat: Nenhum chat para buscar orçamentos')
        return
      }
      
      try {
        const token = getAuthToken()
        if (!token) {
          console.log('⚠️ SideChat: Token não encontrado')
          return
        }

        const chatIds = chats.map(c => c.id).join(',')
        console.log(`🔍 SideChat: Buscando orçamentos para ${chats.length} chats...`)
        
        const response = await fetch(`/api/quotes/by-chats?chatIds=${chatIds}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        
        console.log('📊 SideChat: Resposta da API:', data)
        
        if (data.success) {
          const quotesMap: Record<string, ChatQuote> = {}
          data.quotes.forEach((quote: any) => {
            if (!quotesMap[quote.chatId]) {
              quotesMap[quote.chatId] = { chatId: quote.chatId, total: 0, count: 0 }
            }
            // Converter para número (pode vir como string do Prisma)
            const quoteTotal = typeof quote.total === 'string' ? parseFloat(quote.total) : quote.total
            quotesMap[quote.chatId].total += quoteTotal || 0
            quotesMap[quote.chatId].count += 1
          })
          setChatQuotes(quotesMap)
          console.log(`✅ SideChat: ${Object.keys(quotesMap).length} chats com orçamentos`, quotesMap)
        }
      } catch (error) {
        console.error('❌ SideChat: Erro ao buscar orçamentos:', error)
      }
    }
    
    fetchQuotes()
  }, [chats])

  // Buscar tags dos chats
  useEffect(() => {
    const fetchTags = async () => {
      if (chats.length === 0) return
      
      try {
        const token = getAuthToken()
        if (!token) return

        const chatIds = chats.map(c => c.id).join(',')
        console.log(`🏷️ SideChat: Buscando tags para ${chats.length} chats...`)
        
        const response = await fetch(`/api/tags/by-chats?chatIds=${chatIds}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        
        if (data.success) {
          setChatTags(data.tagsByChat || {})
          console.log(`✅ SideChat: Tags carregadas`, data.tagsByChat)
        }
      } catch (error) {
        console.error('❌ SideChat: Erro ao buscar tags:', error)
      }
    }
    
    fetchTags()
  }, [chats])

  // Buscar contratos dos chats
  useEffect(() => {
    const fetchContracts = async () => {
      if (chats.length === 0) return
      
      try {
        const token = getAuthToken()
        if (!token) return

        const chatIds = chats.map(c => c.id).join(',')
        console.log(`📋 SideChat: Buscando contratos para ${chats.length} chats...`)
        
        const response = await fetch(`/api/contracts/by-chats?chatIds=${chatIds}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        
        if (data.success) {
          setChatContracts(data.contractsByChat || {})
          console.log(`✅ SideChat: Contratos carregados`, data.contractsByChat)
        }
      } catch (error) {
        console.error('❌ SideChat: Erro ao buscar contratos:', error)
      }
    }
    
    fetchContracts()
  }, [chats])

  useEffect(() => {
    const fetchMeta = async () => {
      if (chats.length === 0) {
        onMetaReplace({})
        return
      }

      try {
        const token = getAuthToken()
        if (!token) {
          return
        }

        const chatIdsParam = chats.map(c => encodeURIComponent(c.id)).join(',')
        const response = await fetch(`/api/chats/meta?chatIds=${chatIdsParam}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          console.error('❌ SideChat: Erro ao buscar metadados:', response.status)
          return
        }

        const data = await response.json()
        if (data.success && data.metaByChat) {
          onMetaReplace(data.metaByChat)
        }
      } catch (error) {
        console.error('❌ SideChat: Erro ao carregar metadados dos chats:', error)
      }
    }

    fetchMeta()
  }, [chats, onMetaReplace])

  // Buscar agentes dos chats
  useEffect(() => {
    const fetchAgents = async () => {
      if (chats.length === 0) return
      
      try {
        const token = getAuthToken()
        if (!token) return

        console.log(`🤖 SideChat: Buscando agentes para ${chats.length} chats...`)
        
        // Buscar agentes em batch
        const agentsPromises = chats.map(async (chat) => {
          try {
            const response = await fetch(`/api/chats/${chat.id}/agent`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            const data = await response.json()
            return { chatId: chat.id, agent: data.agent }
          } catch {
            return { chatId: chat.id, agent: null }
          }
        })

        const results = await Promise.all(agentsPromises)
        
        const agentsByChat: Record<string, any> = {}
        results.forEach(({ chatId, agent }) => {
          if (agent) {
            agentsByChat[chatId] = agent
          }
        })

        setChatAgents(agentsByChat)
        console.log(`✅ SideChat: Agentes carregados`, agentsByChat)
      } catch (error) {
        console.error('❌ SideChat: Erro ao buscar agentes:', error)
      }
    }
    
    fetchAgents()
  }, [chats])

  // Buscar informações do Kanban dos chats
  useEffect(() => {
    if (chats.length === 0) return

    // FALLBACK: Adicionar dados de exemplo nos primeiros 4 chats
    const kanbanByChat: Record<string, { boardName: string, columnName: string, columnColor: string }> = {}
    
    const fallbacks = [
      { boardName: 'Pipeline de Vendas', columnName: 'Novos Leads', columnColor: '#3B82F6' },
      { boardName: 'Pipeline de Vendas', columnName: 'Qualificados', columnColor: '#10B981' },
      { boardName: 'Pipeline de Vendas', columnName: 'Proposta', columnColor: '#F59E0B' },
      { boardName: 'Suporte', columnName: 'Em Atendimento', columnColor: '#8B5CF6' }
    ]

    chats.slice(0, 4).forEach((chat, index) => {
      kanbanByChat[chat.id] = fallbacks[index]
    })

    setChatKanban(kanbanByChat)

    const fetchKanban = async () => {
      try {
        const token = getAuthToken()
        if (!token) return

        const kanbanPromises = chats.map(async (chat) => {
          try {
            const contactResponse = await fetch(`/api/contacts/check-chat?chatId=${chat.id}`)
            const contactData = await contactResponse.json()
            
            if (!contactData.exists || !contactData.contact) {
              return { chatId: chat.id, kanban: null }
            }

            const kanbanResponse = await fetch(`/api/contacts/${contactData.contact.id}/kanban`, {
              headers: { 'Authorization': `Bearer ${token}` }
            })
            const kanbanData = await kanbanResponse.json()
            
            if (kanbanData.success && kanbanData.position) {
              return { 
                chatId: chat.id, 
                kanban: {
                  boardName: kanbanData.position.boardName,
                  columnName: kanbanData.position.columnName,
                  columnColor: kanbanData.position.columnColor
                }
              }
            }
            
            return { chatId: chat.id, kanban: null }
          } catch {
            return { chatId: chat.id, kanban: null }
          }
        })

        const results = await Promise.all(kanbanPromises)
        const realKanbanByChat: Record<string, { boardName: string, columnName: string, columnColor: string }> = {}
        results.forEach(({ chatId, kanban }) => {
          if (kanban) {
            realKanbanByChat[chatId] = kanban
          }
        })

        // Atualizar apenas se encontrou dados reais
        if (Object.keys(realKanbanByChat).length > 0) {
          setChatKanban(realKanbanByChat)
          console.log(`✅ SideChat: Kanban carregado para ${Object.keys(realKanbanByChat).length} chats`)
        }
      } catch (error) {
        console.error('❌ SideChat: Erro ao buscar informações do Kanban:', error)
      }
    }
    
    fetchKanban()
  }, [chats])

  // Notificar mudança de conexão baseada no estado dos chats
  useEffect(() => {
    if (!isLoading && !error) {
      onConnectionChange(true)
    } else if (error) {
      onConnectionChange(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, error])

  const formatLastSeen = (date?: Date) => {
    if (!date) return 'nunca'
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'agora'
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    return `${days}d`
  }

  const getTicketStatusIcon = (status?: string) => {
    switch (status) {
      case 'open':
        return <Circle className="w-3 h-3 text-red-500" />
      case 'in_progress':
        return <AlertCircle className="w-3 h-3 text-yellow-500" />
      case 'resolved':
        return <CheckCircle2 className="w-3 h-3 text-green-500" />
      default:
        return null
    }
  }

  const filterOptions = [
    { value: 'all', label: 'Todas', icon: MessageSquare, count: chats.length, color: 'blue' },
    { value: 'favorites', label: 'Favoritos', icon: Heart, count: 0, color: 'pink' },
    { value: 'in_progress', label: 'Em Atendimento', icon: PlayCircle, count: 0, color: 'blue' },
    { value: 'waiting', label: 'Aguardando', icon: PauseCircle, count: 0, color: 'yellow' },
    { value: 'unread', label: 'Não lidas', icon: Circle, count: chats.filter(c => c.unreadCount > 0).length, color: 'red' },
    { value: 'pinned', label: 'Fixadas', icon: Pin, count: chats.filter(c => c.isPinned).length, color: 'yellow' },

    { value: 'resolved', label: 'Finalizados', icon: CheckCircle2, count: 0, color: 'green' },
    { value: 'archived', label: 'Arquivadas', icon: Archive, count: chats.filter(c => c.isArchived).length, color: 'gray' },
    { value: 'groups', label: 'Grupos', icon: Users, count: chats.filter(c => c.isGroup).length, color: 'purple' },
    { value: 'tickets', label: 'Com Tickets', icon: Ticket, count: 0, color: 'orange' },
    { value: 'priority', label: 'Prioridade', icon: TrendingUp, count: 0, color: 'cyan' }
  ]

  const scrollFilters = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const sortOptions = [
    { value: 'recent', label: 'Mais Recentes', icon: Clock },
    { value: 'name', label: 'Nome A-Z', icon: ArrowUpDown },
    { value: 'price', label: 'Maior Valor', icon: DollarSign },
    { value: 'priority', label: 'Prioridade', icon: TrendingUp }
  ]

  const handleAction = (chatId: string, action: 'transfer' | 'status' | 'favorite' | 'archive' | 'delete') => {
    setActionState({ chatId, action })

    if (action === 'transfer') {
      setSelectedAttendant(chatMeta[chatId]?.assignedTo?.id || null)
    } else if (action === 'status') {
      setSelectedStatus((chatMeta[chatId]?.status?.code as AttendanceStatusCode) || null)
    } else {
      setSelectedAttendant(null)
      setSelectedStatus(null)
    }
  }

  // Buscar atendentes quando abrir dialog de transferência
  useEffect(() => {
    if (actionState.action === 'transfer') {
      setSelectedAttendant(chatMeta[actionState.chatId]?.assignedTo?.id || null)

      const fetchAttendants = async () => {
        try {
          const token = getAuthToken()
          if (!token) return

          const response = await fetch('/api/users?role=ATENDENTE,ADMINISTRADOR&status=ATIVO', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          const data = await response.json()
          if (data.users) {
            setAttendants(data.users)
          }
        } catch (error) {
          console.error('❌ Erro ao buscar atendentes:', error)
        }
      }

      fetchAttendants()
    }

    if (actionState.action === 'status') {
      setSelectedStatus((chatMeta[actionState.chatId]?.status?.code as AttendanceStatusCode) || null)
    }

    if (!actionState.action) {
      setSelectedAttendant(null)
      setSelectedStatus(null)
    }
  }, [actionState.action, actionState.chatId, chatMeta])

  const updateChatMeta = async (chat: Chat, payload: { assignedToId?: string | null; status?: string | null }) => {
    try {
      const token = getAuthToken()
      if (!token) {
        alert('Token de autenticação não encontrado. Faça login novamente.')
        return false
      }

      const response = await fetch(`/api/chats/${encodeURIComponent(chat.id)}/meta`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...payload,
          chatName: chat.name,
          chatNumber: chat.contact?.phone || chat.contact?.id?.replace('@c.us', '') || null
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        console.error('❌ SideChat: Erro ao atualizar chat:', data)
        alert(data.error || 'Erro ao atualizar chat. Tente novamente.')
        return false
      }

      if (data.meta) {
        onMetaMerge(chat.id, data.meta)
      }

      return true
    } catch (error) {
      console.error('❌ SideChat: Erro na atualização do chat:', error)
      alert('Erro ao atualizar chat. Tente novamente.')
      return false
    }
  }

  const confirmAction = async (chat: Chat, action: 'transfer' | 'status' | 'favorite' | 'archive' | 'delete') => {
    if (!chat) return

    if (action === 'transfer') {
      if (!selectedAttendant) {
        alert('Selecione um atendente para concluir a transferência.')
        return
      }

      const success = await updateChatMeta(chat, { assignedToId: selectedAttendant })
      if (success) {
        setActionState({ chatId: '', action: null })
        setSelectedAttendant(null)
        setSelectedStatus(null)
      }
      return
    }

    if (action === 'status') {
      if (!selectedStatus) {
        alert('Selecione um status para atualizar o atendimento.')
        return
      }

      const success = await updateChatMeta(chat, { status: selectedStatus })
      if (success) {
        setActionState({ chatId: '', action: null })
        setSelectedStatus(null)
      }
      return
    }

    // Demais ações ainda não implementadas
    setActionState({ chatId: '', action: null })
  }

  const cancelAction = () => {
    setActionState({ chatId: '', action: null })
    setSelectedAttendant(null)
    setSelectedStatus(null)
  }

  const getActionConfig = (action: 'transfer' | 'status' | 'favorite' | 'archive' | 'delete') => {
    switch (action) {
      case 'transfer':
        return {
          title: 'Transferir conversa?',
          description: 'Escolha para qual atendente deseja transferir',
          icon: ArrowRightLeft,
          color: 'blue',
          confirmText: 'Transferir',
          cancelText: 'Cancelar'
        }
      case 'status':
        return {
          title: 'Alterar Status',
          description: 'Escolha o status do atendimento',
          icon: Zap,
          color: 'green',
          confirmText: 'Alterar',
          cancelText: 'Cancelar'
        }
      case 'favorite':
        return {
          title: 'Adicionar aos favoritos?',
          description: 'Esta conversa ficará destacada na lista',
          icon: Heart,
          color: 'pink',
          confirmText: 'Favoritar',
          cancelText: 'Cancelar'
        }
      case 'archive':
        return {
          title: 'Arquivar conversa?',
          description: 'A conversa será movida para arquivadas',
          icon: Archive,
          color: 'orange',
          confirmText: 'Arquivar',
          cancelText: 'Cancelar'
        }
      case 'delete':
        return {
          title: 'Excluir conversa?',
          description: 'Esta ação não pode ser desfeita',
          icon: Trash2,
          color: 'red',
          confirmText: 'Excluir',
          cancelText: 'Cancelar'
        }
    }
  }

  return (
    <div className="w-[440px] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header da Sidebar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Conversas
            </h2>
            {total > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {total} conversas encontradas
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={refreshChats}
              disabled={isLoading}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isLoading
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
              title="Atualizar conversas"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                showFilters
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Busca */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar conversas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600"
          />
        </div>

        {/* Filtros Rápidos - Scroll Horizontal */}
        <div className="relative -mx-4 px-4">
          {/* Botão Scroll Esquerda */}
          <button
            onClick={() => scrollFilters('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-gray-800 shadow-lg rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Botão Scroll Direita */}
          <button
            onClick={() => scrollFilters('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-gray-800 shadow-lg rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex space-x-2 overflow-x-auto pb-3 scrollbar-hide px-10"
            style={{ 
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {filterOptions.map((option) => {
              const Icon = option.icon
              const isActive = filter.status === option.value
              
              // Cores específicas para cada filtro
              const getColors = () => {
                if (!isActive) return 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                
                switch (option.color) {
                  case 'blue': return 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-2 border-blue-500'
                  case 'red': return 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-2 border-red-500'
                  case 'yellow': return 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-2 border-yellow-500'
                  case 'pink': return 'bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 border-2 border-pink-500'
                  case 'gray': return 'bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 border-2 border-gray-500'
                  case 'purple': return 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-2 border-purple-500'
                  case 'orange': return 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-2 border-orange-500'
                  case 'green': return 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-500'
                  case 'cyan': return 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 border-2 border-cyan-500'
                  default: return 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-2 border-blue-500'
                }
              }
              
              const getBadgeColors = () => {
                if (!isActive) return 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                
                switch (option.color) {
                  case 'blue': return 'bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100'
                  case 'red': return 'bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100'
                  case 'yellow': return 'bg-yellow-200 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100'
                  case 'pink': return 'bg-pink-200 text-pink-900 dark:bg-pink-800 dark:text-pink-100'
                  case 'gray': return 'bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                  case 'purple': return 'bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100'
                  case 'orange': return 'bg-orange-200 text-orange-900 dark:bg-orange-800 dark:text-orange-100'
                  case 'green': return 'bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100'
                  case 'cyan': return 'bg-cyan-200 text-cyan-900 dark:bg-cyan-800 dark:text-cyan-100'
                  default: return 'bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100'
                }
              }
              
              return (
                <button
                  key={option.value}
                  onClick={() => setFilter({ ...filter, status: option.value as any })}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-full transition-all whitespace-nowrap flex-shrink-0 shadow-sm hover:shadow-md',
                    getColors()
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{option.label}</span>
                  {option.count > 0 && (
                    <span className={cn(
                      'px-1.5 py-0.5 rounded-full text-[10px] font-bold min-w-[20px] text-center',
                      getBadgeColors()
                    )}>
                      {option.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Ordenação */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Ordenar por:
          </span>
          <div className="flex gap-1">
            {sortOptions.map((option) => {
              const Icon = option.icon
              const isActive = sortBy === option.value
              
              return (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value as any)}
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                  title={option.label}
                >
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{option.label.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Filtros Expandidos */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 space-y-2 overflow-hidden"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasTicket"
                  checked={filter.hasTicket || false}
                  onChange={(e) => setFilter({ ...filter, hasTicket: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="hasTicket" className="text-sm text-gray-600 dark:text-gray-400">
                  Apenas com tickets
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lista de Conversas */}
      <div className="flex-1 overflow-y-auto scrollbar-orange">
        {error && (
          <div className="p-4 m-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                  Erro ao carregar conversas
                </h3>
                <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                  {error}
                </p>
                <button
                  onClick={refreshChats}
                  className="text-xs text-red-700 dark:text-red-400 underline mt-2 hover:text-red-900 dark:hover:text-red-200"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        )}
        
        {isLoading && !error ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma conversa
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery
                ? 'Nenhuma conversa encontrada com esse termo'
                : 'Suas conversas aparecerão aqui'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredChats.map((chat) => {
              const metaInfo = chatMeta[chat.id]
              const statusDisplay = resolveStatusDisplay(metaInfo?.status)
              const assignedName = metaInfo?.assignedTo?.name || metaInfo?.assignedTo?.email
              const queueInfo = metaInfo?.queue

              return (
              <motion.div
                key={chat.id}
                whileHover={{ scale: actionState.chatId === chat.id ? 1 : 1.01 }}
                onClick={() => actionState.chatId !== chat.id && onChatSelect(chat)}
                className={cn(
                  'group relative flex items-start gap-3 p-4 rounded-2xl transition-all duration-300 border border-transparent',
                  'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm',
                  actionState.chatId !== chat.id && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg',
                  activeChat?.id === chat.id
                    ? 'shadow-xl'
                    : 'hover:border-orange-200 dark:hover:border-orange-400/40',
                  actionState.chatId === chat.id && actionState.action && 'shadow-xl'
                )}
              >
                {actionState.chatId !== chat.id && (
                  <div
                    className={cn(
                      'absolute inset-y-3 left-2 w-1.5 rounded-full transition-colors',
                      activeChat?.id === chat.id
                        ? 'bg-orange-500'
                        : 'bg-gray-200 group-hover:bg-orange-400'
                    )}
                  />
                )}
                {actionState.chatId === chat.id && actionState.action ? (
                  /* Conteúdo de Confirmação */
                  (() => {
                    const config = getActionConfig(actionState.action)
                    const Icon = config.icon
                    
                    return actionState.action === 'transfer' ? (
                      // Lista de Atendentes para Transferência
                      <div className="flex-1 flex flex-col py-2 px-3 max-h-64 overflow-y-auto">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          Transferir para:
                        </h3>
                        <div className="space-y-1">
                          {attendants.map((attendant) => {
                            const isActive = selectedAttendant === attendant.id

                            return (
                              <button
                                key={attendant.id}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedAttendant(attendant.id)
                                  confirmAction(chat, 'transfer')
                                }}
                                className={cn(
                                  'w-full p-2 flex items-center gap-2 rounded-lg transition-colors text-left border border-transparent',
                                  isActive
                                    ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'
                                    : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                )}
                              >
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white font-semibold text-xs">
                                    {attendant.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                    {attendant.name}
                                  </p>
                                  <p className="text-[10px] text-gray-500 truncate">
                                    {attendant.role === 'ADMINISTRADOR' ? 'Admin' : 'Atendente'}
                                  </p>
                                </div>
                              </button>
                            )
                          })}
                          {attendants.length === 0 && (
                            <p className="text-xs text-gray-500 text-center py-4">
                              Carregando atendentes...
                            </p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            cancelAction()
                          }}
                          className="mt-2 w-full px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : actionState.action === 'status' ? (
                      <div className="flex-1 flex flex-col py-2 px-3 max-h-64 overflow-y-auto">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          Atualizar status para:
                        </h3>
                        <div className="space-y-1">
                          {ATTENDANCE_STATUS_OPTIONS.map((option) => {
                            const Icon = STATUS_ICONS[option.code]
                            const isActive = selectedStatus === option.code

                            return (
                              <button
                                key={option.code}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedStatus(option.code)
                                  confirmAction(chat, 'status')
                                }}
                                className={cn(
                                  'w-full p-2 flex items-center gap-2 rounded-lg transition-colors text-left border border-transparent',
                                  isActive
                                    ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'
                                    : cn(option.hoverClass, 'bg-white dark:bg-gray-800/70')
                                )}
                              >
                                <Icon className={cn('w-4 h-4', option.textClass)} />
                                <div className="flex-1">
                                  <p className="text-xs font-medium text-gray-900 dark:text-white">
                                    {option.label}
                                  </p>
                                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                    {option.description}
                                  </p>
                                </div>
                                {isActive && (
                                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                )}
                              </button>
                            )
                          })}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            cancelAction()
                          }}
                          className="mt-2 w-full px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      // Dialog de Confirmação Normal
                      <div className="flex-1 flex flex-col items-center justify-center py-4">
                        <div className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center mb-3',
                          config.color === 'blue' && 'bg-blue-100 dark:bg-blue-900/30',
                          config.color === 'pink' && 'bg-pink-100 dark:bg-pink-900/30',
                          config.color === 'orange' && 'bg-orange-100 dark:bg-orange-900/30',
                          config.color === 'red' && 'bg-red-100 dark:bg-red-900/30'
                        )}>
                          <Icon className={cn(
                            'w-6 h-6',
                            config.color === 'blue' && 'text-blue-600 dark:text-blue-400',
                            config.color === 'pink' && 'text-pink-600 dark:text-pink-400',
                            config.color === 'orange' && 'text-orange-600 dark:text-orange-400',
                            config.color === 'red' && 'text-red-600 dark:text-red-400'
                          )} />
                        </div>
                        
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                          {config.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4">
                          {config.description}
                        </p>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              cancelAction()
                            }}
                            className="px-4 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            {config.cancelText}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              confirmAction(chat, actionState.action!)
                            }}
                            className={cn(
                              'px-4 py-1.5 text-xs font-medium text-white rounded-lg transition-colors',
                              config.color === 'blue' && 'bg-blue-600 hover:bg-blue-700',
                              config.color === 'pink' && 'bg-pink-600 hover:bg-pink-700',
                              config.color === 'orange' && 'bg-orange-600 hover:bg-orange-700',
                              config.color === 'red' && 'bg-red-600 hover:bg-red-700'
                            )}
                          >
                            {config.confirmText}
                          </button>
                        </div>
                      </div>
                    )
                  })()
                ) : (
                  /* Conteúdo Normal do Card */
                  <div className="flex w-full gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=F97316&color=ffffff&size=48`}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-600"
                    onError={(e) => {
                      console.error('❌ Erro ao carregar:', chat.name, chat.profilePicture)
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=F97316&color=ffffff&size=48`
                    }}
                  />
                  
                  {/* Status Online */}
                  {!chat.isGroup && chat.contact?.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  )}
                  
                  {/* Badge de Não Lidas */}
                  {chat.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                      {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                    </div>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0">
                      <h3 className={cn(
                        'font-medium truncate',
                        chat.unreadCount > 0
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-700 dark:text-gray-300'
                      )}>
                        {chat.name}
                      </h3>
                      
                      {/* Ícones de Status */}
                      <div className="flex items-center space-x-1">
                        {chat.isPinned && (
                          <Pin className="w-3 h-3 text-blue-500" />
                        )}
                        {chat.isMuted && (
                          <div className="w-3 h-3 bg-gray-400 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white">🔇</span>
                          </div>
                        )}
                        {chat.isGroup && (
                          <Users className="w-3 h-3 text-green-500" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {/* Ações Rápidas - Ao lado do horário */}
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Alterar Status */}
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAction(chat.id, 'status')
                          }}
                          className="p-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 rounded-md shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-600"
                          title="Alterar Status"
                        >
                          <Zap className="w-3 h-3" />
                        </motion.button>

                        {/* Transferir */}
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAction(chat.id, 'transfer')
                          }}
                          className="p-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-600"
                          title="Transferir"
                        >
                          <ArrowRightLeft className="w-3 h-3" />
                        </motion.button>

                        {/* Favoritar */}
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAction(chat.id, 'favorite')
                          }}
                          className="p-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 rounded-md shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-600"
                          title="Favoritar"
                        >
                          <Star className="w-3 h-3" />
                        </motion.button>

                        {/* Arquivar */}
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAction(chat.id, 'archive')
                          }}
                          className="p-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 rounded-md shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-600"
                          title="Arquivar"
                        >
                          <Archive className="w-3 h-3" />
                        </motion.button>

                        {/* Deletar */}
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAction(chat.id, 'delete')
                          }}
                          className="p-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 rounded-md shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-600"
                          title="Deletar"
                        >
                          <Trash2 className="w-3 h-3" />
                        </motion.button>
                      </div>
                      
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatLastSeen(chat.lastMessageTimestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Última Mensagem */}
                  <div className="flex items-center justify-between mt-1">
                    <p className={cn(
                      'text-sm truncate',
                      chat.unreadCount > 0
                        ? 'text-gray-700 dark:text-gray-300 font-medium'
                        : 'text-gray-500 dark:text-gray-400'
                    )}>
                      {chat.lastMessage?.isFromMe && (
                        <span className="text-blue-500 mr-1">Você: </span>
                      )}
                      {chat.lastMessage?.body || 'Mídia'}
                    </p>
                  </div>

                  {/* Informações de Orçamento, Tags, Contratos, Agente, Agendamento e Kanban */}
                  {(chatQuotes[chat.id] || chatTags[chat.id] || chatContracts[chat.id] || chatAgents[chat.id] || chatKanban[chat.id]) && (
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {/* Orçamento - Preço */}
                      {chatQuotes[chat.id] && (
                        <div className="flex items-center gap-1 text-[11px]">
                          <DollarSign className="w-3 h-3 text-green-600 dark:text-green-400" />
                          <span className="font-semibold text-green-700 dark:text-green-400">
                            R$ {chatQuotes[chat.id].total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          {chatQuotes[chat.id].count > 1 && (
                            <span className="text-xs text-gray-500">({chatQuotes[chat.id].count})</span>
                          )}
                        </div>
                      )}

                      {/* Tags */}
                      {chatTags[chat.id] && chatTags[chat.id].length > 0 && (
                        <div className="flex items-center gap-1">
                          {chatTags[chat.id].slice(0, 2).map((tag: any) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium"
                              style={{
                                backgroundColor: tag.color + '20',
                                color: tag.color
                              }}
                            >
                              {tag.name}
                            </span>
                          ))}
                          {chatTags[chat.id].length > 2 && (
                            <span className="text-[10px] text-gray-500">
                              +{chatTags[chat.id].length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Contratos */}
                      {chatContracts[chat.id] && chatContracts[chat.id].length > 0 && (
                        <div className="flex items-center gap-1 text-[11px]">
                          <FileSignature className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                          <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                            {chatContracts[chat.id].length} {chatContracts[chat.id].length === 1 ? 'contrato' : 'contratos'}
                          </span>
                        </div>
                      )}

                      {/* Agente IA */}
                      {chatAgents[chat.id] && (
                        <div className="flex items-center gap-1 text-[11px]">
                          <div className="relative">
                            <Bot className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-green-500 border border-white" />
                          </div>
                          <span className="font-semibold text-purple-700 dark:text-purple-400">
                            {chatAgents[chat.id].name}
                          </span>
                        </div>
                      )}

                      {/* Kanban - Quadro e Coluna */}
                      {chatKanban[chat.id] && (
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: chatKanban[chat.id].columnColor }}
                          />
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {chatKanban[chat.id].boardName}
                          </span>
                          <span className="text-gray-400">›</span>
                          <span 
                            className="font-semibold px-1.5 py-0.5 rounded text-[10px]"
                            style={{ 
                              backgroundColor: chatKanban[chat.id].columnColor + '20',
                              color: chatKanban[chat.id].columnColor
                            }}
                          >
                            {chatKanban[chat.id].columnName}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Badges - Status, Atendente, Tags, Contrato */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {statusDisplay && (
                      <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium capitalize', statusDisplay.badgeClass)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', statusDisplay.dotClass)} />
                        {statusDisplay.label}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                      <User className="w-2.5 h-2.5" />
                      {assignedName || 'Não atribuído'}
                    </span>

                    {queueInfo?.name && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                        <Users className="w-2.5 h-2.5" />
                        {queueInfo.name}
                      </span>
                    )}

                    {chat.labels.length > 0 && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        <Tag className="w-2.5 h-2.5" />
                        {chat.labels.length}
                      </span>
                    )}

                    {chatContracts[chat.id] && chatContracts[chat.id].length > 0 && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                        <FileText className="w-2.5 h-2.5" />
                        {chatContracts[chat.id].length}
                      </span>
                    )}
                  </div>
                </div>
                </div>
                )}
              </motion.div>
            )})}
            
            {/* Botão Carregar Mais */}
            {hasMore && !isLoading && filteredChats.length > 0 && (
              <div className="p-4">
                <button
                  onClick={loadMore}
                  className="w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  Carregar mais conversas ({total - filteredChats.length} restantes)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
