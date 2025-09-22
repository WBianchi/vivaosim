'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Archive,
  Pin,
  MessageSquare,
  Users,
  Clock,
  ChevronDown,
  Tag,
  Ticket,
  Circle,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  RefreshCw,
  Loader2
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
  }, [isLoading, error, onConnectionChange])

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
    { value: 'all', label: 'Todas', count: chats.length },
    { value: 'unread', label: 'Não lidas', count: chats.filter(c => c.unreadCount > 0).length },
    { value: 'pinned', label: 'Fixadas', count: chats.filter(c => c.isPinned).length },
    { value: 'archived', label: 'Arquivadas', count: chats.filter(c => c.isArchived).length }
  ]

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

        {/* Filtros Rápidos */}
        <div className="flex space-x-1">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter({ ...filter, status: option.value as any })}
              className={cn(
                'flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors',
                filter.status === option.value
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <span>{option.label}</span>
              {option.count > 0 && (
                <span className="ml-1 opacity-60">({option.count})</span>
              )}
            </button>
          ))}
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
      <div className="flex-1 overflow-y-auto">
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
                whileHover={{ backgroundColor: 'var(--hover-bg)' }}
                onClick={() => onChatSelect(chat)}
                className={cn(
                  'flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors',
                  activeChat?.id === chat.id
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                )}
              >
                {/* Avatar com melhor handling */}
                <div className="relative flex-shrink-0">
                  {chat.profilePicture ? (
                    <img
                      src={chat.profilePicture}
                      alt={chat.name}
                      className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-600"
                      onError={(e) => {
                        // Fallback para avatar gerado
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=6366f1&color=ffffff&size=48`
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-1 ring-gray-200 dark:ring-gray-600">
                      <span className="text-white font-semibold text-sm">
                        {chat.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
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

                  {/* Tags */}
                  {chat.labels.length > 0 && (
                    <div className="flex items-center space-x-1 mt-2">
                      {chat.labels.slice(0, 2).map((label) => (
                        <span
                          key={label}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        >
                          <Tag className="w-2.5 h-2.5 mr-1" />
                          {label}
                        </span>
                      ))}
                      {chat.labels.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{chat.labels.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
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
