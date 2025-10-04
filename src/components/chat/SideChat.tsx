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
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  PauseCircle
} from 'lucide-react'
import { Chat, ChatFilter, TicketStatus } from '@/types/chat'
import { useChats } from '@/hooks/useChats'
import { cn } from '@/lib/utils'

interface SideChatProps {
  onChatSelect: (chat: Chat) => void
  activeChat: Chat | null
  onConnectionChange: (connected: boolean) => void
}

export const SideChat: React.FC<SideChatProps> = ({
  onChatSelect,
  activeChat,
  onConnectionChange
}) => {
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'price' | 'priority'>('recent')
  const [actionState, setActionState] = useState<{chatId: string, action: 'transfer' | 'favorite' | 'archive' | 'delete' | null}>({chatId: '', action: null})
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  
  // Usar hook personalizado para gerenciar chats
  const {
    chats,
    filteredChats,
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

  const handleAction = (chatId: string, action: 'transfer' | 'favorite' | 'archive' | 'delete') => {
    setActionState({ chatId, action })
  }

  const confirmAction = (chatId: string, action: string) => {
    console.log(`✅ Confirmado: ${action} para chat ${chatId}`)
    // TODO: Implementar ação real
    setActionState({ chatId: '', action: null })
  }

  const cancelAction = () => {
    setActionState({ chatId: '', action: null })
  }

  const getActionConfig = (action: 'transfer' | 'favorite' | 'archive' | 'delete') => {
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
            {filteredChats.map((chat) => (
              <motion.div
                key={chat.id}
                whileHover={{ scale: actionState.chatId === chat.id ? 1 : 1.02 }}
                onClick={() => actionState.chatId !== chat.id && onChatSelect(chat)}
                className={cn(
                  'group relative flex items-center space-x-3 p-3 rounded-2xl transition-all duration-200',
                  'shadow-[2px_2px_5px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.7)]',
                  'dark:shadow-[2px_2px_5px_rgba(0,0,0,0.3),-2px_-2px_5px_rgba(255,255,255,0.05)]',
                  'border-r-[6px]',
                  actionState.chatId !== chat.id && 'cursor-pointer',
                  activeChat?.id === chat.id
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-500'
                    : 'bg-white dark:bg-gray-800 border-orange-400 hover:shadow-[3px_3px_8px_rgba(0,0,0,0.15),-3px_-3px_8px_rgba(255,255,255,0.8)] hover:border-orange-500'
                )}
              >{actionState.chatId === chat.id && actionState.action ? (
                  /* Conteúdo de Confirmação */
                  (() => {
                    const config = getActionConfig(actionState.action)
                    const Icon = config.icon
                    
                    return (
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
                              confirmAction(chat.id, actionState.action!)
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
                  <>
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

                  {/* Informações de Orçamento e Agendamento */}
                  <div className="flex items-center gap-3 mt-2">
                    {/* Orçamento - Preço */}
                    <div className="flex items-center gap-1 text-[11px]">
                      <DollarSign className="w-3 h-3 text-green-600 dark:text-green-400" />
                      <span className="font-semibold text-green-700 dark:text-green-400">
                        R$ 2.500,00
                      </span>
                    </div>

                    {/* Agendamento - Data e Hora */}
                    <div className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        15/10 às 14h30
                      </span>
                    </div>
                  </div>

                  {/* Badges - Tags, Atendente, Status, Contrato */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {/* Tags */}
                    {chat.labels.length > 0 && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        <Tag className="w-2.5 h-2.5" />
                        {chat.labels.length}
                      </span>
                    )}
                    
                    {/* Atendente */}
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                      <User className="w-2.5 h-2.5" />
                      João
                    </span>
                    
                    {/* Status */}
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <Zap className="w-2.5 h-2.5" />
                      Ativo
                    </span>
                    
                    {/* Contrato */}
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                      <FileText className="w-2.5 h-2.5" />
                      1
                    </span>
                  </div>
                </div>

                {/* Ações Rápidas - Canto Inferior Direito */}
                <div className="absolute bottom-2 right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
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
                    <ArrowRightLeft className="w-3.5 h-3.5" />
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
                    <Star className="w-3.5 h-3.5" />
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
                    <Archive className="w-3.5 h-3.5" />
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
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
                </>
                )}
              </motion.div>
            ))}
            
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
