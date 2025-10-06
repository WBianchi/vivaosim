'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone,
  Video,
  Info,
  Search,
  StickyNote,
  Star,
  Reply,
  Forward,
  Download,
  Volume2,
  Play,
  Pause,
  Image,
  FileText,
  MapPin,
  Clock,
  Check,
  CheckCheck,
  Eye,
  MessageSquare,
  RefreshCw,
  Calendar,
  DollarSign,
  FileSignature,
  Tag,
  Ticket,
  User
} from 'lucide-react'
import { Chat, Message, MessageType, MessageAck, ChatAssignmentMeta } from '@/types/chat'
import { SidebarType } from '@/app/chat/page'
import { useMessages } from '@/hooks/useMessages'
import { cn } from '@/lib/utils'
import { getAuthToken } from '@/lib/auth-token'
import { resolveStatusDisplay } from '@/lib/chat-status'

interface ChatAreaProps {
  chat: Chat
  onSidebarToggle: (sidebar: SidebarType) => void
  chatQuoteCount?: number
  chatContractCount?: number
  meta?: ChatAssignmentMeta
}

export const ChatArea: React.FC<ChatAreaProps> = ({ chat, onSidebarToggle, chatQuoteCount: propQuoteCount, chatContractCount: propContractCount, meta }) => {
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [chatQuoteCount, setChatQuoteCount] = useState(propQuoteCount || 0)
  const [chatContractCount, setChatContractCount] = useState(propContractCount || 0)

  // Usar hook de mensagens
  const {
    messages,
    isLoading,
    error: messagesError,
    hasMore,
    refreshMessages,
    loadMore
  } = useMessages({
    chatId: chat.id,
    autoRefresh: false, // Desabilitar auto-refresh para evitar instabilidade
    refreshInterval: 15000 // 15 segundos caso habilitado
  })

  // Buscar contagem de orçamentos do chat
  useEffect(() => {
    const fetchQuoteCount = async () => {
      try {
        const token = getAuthToken()
        if (!token) return

        const response = await fetch(`/api/quotes/by-chats?chatIds=${chat.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        
        if (data.success && data.quotes) {
          setChatQuoteCount(data.quotes.length)
        }
      } catch (error) {
        console.error('Erro ao buscar orçamentos do chat:', error)
      }
    }
    
    fetchQuoteCount()
  }, [chat.id])

  // Auto scroll quando mensagens chegam
  useEffect(() => {
    try {
      console.log('📱 ChatArea: Mensagens recebidas:', messages.length)
      if (messages.length > 0) {
        console.log('📱 Primeira mensagem:', messages[0]?.body?.substring(0, 50))
        scrollToBottom()
      }
    } catch (error) {
      console.error('Erro no scroll das mensagens:', error)
    }
  }, [messages])

  // Auto scroll para baixo com throttle
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [])

  const scheduleCount = 0
  const quoteCount = chatQuoteCount || 0
  const tagCount = Array.isArray(chat.labels) ? chat.labels.length : 0
  const contractCount = chatContractCount || 0
  const ticketCount = chat.ticket ? 1 : 0

  const handleNotesClick = () => {
    console.log('📝 Abrindo anotações do chat', chat.id)
  }

  const renderIconButton = ({
    id,
    label,
    icon: Icon,
    onClick,
    bgClass,
    textClass,
    badgeBgClass,
    count,
    iconClassName,
  }: {
    id: string
    label: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    onClick?: () => void
    bgClass: string
    textClass: string
    badgeBgClass?: string
    count?: number
    iconClassName?: string
  }) => {
    const badgeValue = typeof count === 'number' ? (count > 99 ? '99+' : count.toString()) : null

    return (
      <motion.button
        key={id}
        onClick={onClick}
        whileHover={{ scale: 1.05, translateY: -2 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-2 rounded-xl transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        title={label}
      >
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shadow-sm', bgClass)}>
          <Icon className={cn('w-5 h-5', textClass, iconClassName)} />
        </div>
        {badgeValue !== null && badgeBgClass && (
          <span className={cn(
            'absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] font-semibold text-white rounded-full flex items-center justify-center shadow-sm',
            badgeBgClass
          )}>
            {badgeValue}
          </span>
        )}
      </motion.button>
    )
  }

  const assignedAttendant = meta?.assignedTo || null
  const statusInfo = resolveStatusDisplay(meta?.status)

  // Formatar timestamp
  const formatMessageTime = (timestamp: Date) => {
    const now = new Date()
    const messageDate = new Date(timestamp)
    
    const isToday = now.toDateString() === messageDate.toDateString()
    const isYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() === messageDate.toDateString()
    
    if (isToday) {
      return messageDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    } else if (isYesterday) {
      return 'Ontem ' + messageDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    } else {
      return messageDate.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  // Ícone de status da mensagem
  const getMessageStatusIcon = (ack: MessageAck) => {
    switch (ack) {
      case MessageAck.PENDING:
        return <Clock className="w-3 h-3 text-gray-400" />
      case MessageAck.SERVER:
        return <Check className="w-3 h-3 text-gray-400" />
      case MessageAck.DEVICE:
        return <CheckCheck className="w-3 h-3 text-gray-400" />
      case MessageAck.READ:
        return <CheckCheck className="w-3 h-3 text-blue-500" />
      case MessageAck.PLAYED:
        return <Eye className="w-3 h-3 text-blue-500" />
      default:
        return null
    }
  }

  // Componente de mensagem - CORRIGIDO
  const MessageBubble: React.FC<{ message: Message }> = React.memo(({ message }) => {
    const isFromMe = message.isFromMe
    
    // Verificar se a mensagem tem conteúdo válido
    if (!message.body && !message.mediaUrl) {
      return null
    }
    
    return (
      <div
        className={cn(
          'flex mb-4 w-full',
          isFromMe ? 'justify-end' : 'justify-start'
        )}
      >
        <div
          className={cn(
            'max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl relative group min-h-[40px]',
            isFromMe
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md border border-gray-200 dark:border-gray-600'
          )}
        >
          {/* Conteúdo da mensagem */}
          <div className="break-words whitespace-pre-wrap text-sm leading-relaxed">
            {message.body || 'Mídia'}
          </div>
          
          {/* Timestamp e Status */}
          <div className={cn(
            'flex items-center justify-end space-x-1 mt-2 text-xs opacity-70',
            isFromMe ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
          )}>
            <span>{formatMessageTime(message.timestamp)}</span>
            {isFromMe && getMessageStatusIcon(message.ack)}
          </div>
        </div>
      </div>
    )
  })
  
  MessageBubble.displayName = 'MessageBubble'

  const primaryActions = [
    {
      id: 'schedule',
      label: 'Agendamentos',
      icon: Calendar,
      onClick: () => onSidebarToggle('schedule'),
      bgClass: 'bg-sky-500/10 dark:bg-sky-500/20',
      textClass: 'text-sky-600 dark:text-sky-300',
      badgeBgClass: 'bg-sky-500',
      count: scheduleCount
    },
    {
      id: 'quote',
      label: 'Orçamentos',
      icon: DollarSign,
      onClick: () => onSidebarToggle('quote'),
      bgClass: 'bg-purple-500/10 dark:bg-purple-500/20',
      textClass: 'text-purple-600 dark:text-purple-300',
      badgeBgClass: 'bg-purple-500',
      count: quoteCount
    },
    {
      id: 'tag',
      label: 'Tags',
      icon: Tag,
      onClick: () => onSidebarToggle('tag'),
      bgClass: 'bg-amber-500/10 dark:bg-amber-500/20',
      textClass: 'text-amber-600 dark:text-amber-300',
      badgeBgClass: 'bg-amber-500',
      count: tagCount
    },
    {
      id: 'contract',
      label: 'Contratos',
      icon: FileSignature,
      onClick: () => onSidebarToggle('contract'),
      bgClass: 'bg-indigo-500/10 dark:bg-indigo-500/20',
      textClass: 'text-indigo-600 dark:text-indigo-300',
      badgeBgClass: 'bg-indigo-500',
      count: contractCount
    },
    {
      id: 'ticket',
      label: 'Tickets',
      icon: Ticket,
      onClick: () => onSidebarToggle('ticket'),
      bgClass: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      textClass: 'text-emerald-600 dark:text-emerald-300',
      badgeBgClass: 'bg-emerald-500',
      count: ticketCount
    }
  ]

  const utilityButtons = [
    {
      id: 'contact-shortcut',
      label: 'Informações do Contato',
      icon: User,
      onClick: () => onSidebarToggle('contact'),
      bgClass: 'bg-orange-500/10 dark:bg-orange-500/20',
      textClass: 'text-orange-600 dark:text-orange-300'
    },
    {
      id: 'refresh',
      label: 'Atualizar mensagens',
      icon: RefreshCw,
      onClick: refreshMessages,
      bgClass: 'bg-blue-500/10 dark:bg-blue-500/20',
      textClass: 'text-blue-600 dark:text-blue-300',
      iconClassName: isLoading ? 'animate-spin' : undefined
    },
    {
      id: 'call',
      label: 'Iniciar ligação',
      icon: Phone,
      onClick: () => console.log('📞 Iniciando chamada com', chat.id),
      bgClass: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      textClass: 'text-emerald-600 dark:text-emerald-300'
    },
    {
      id: 'video',
      label: 'Iniciar vídeo chamada',
      icon: Video,
      onClick: () => console.log('🎥 Iniciando vídeo com', chat.id),
      bgClass: 'bg-fuchsia-500/10 dark:bg-fuchsia-500/20',
      textClass: 'text-fuchsia-600 dark:text-fuchsia-300'
    },
    {
      id: 'search',
      label: 'Buscar na conversa',
      icon: Search,
      onClick: () => console.log('🔍 Buscando em', chat.id),
      bgClass: 'bg-gray-500/10 dark:bg-gray-500/20',
      textClass: 'text-gray-600 dark:text-gray-300'
    },
    {
      id: 'info',
      label: 'Visão geral do contato',
      icon: Info,
      onClick: () => onSidebarToggle('contact'),
      bgClass: 'bg-cyan-500/10 dark:bg-cyan-500/20',
      textClass: 'text-cyan-600 dark:text-cyan-300'
    },
    {
      id: 'notes',
      label: 'Anotações do chat',
      icon: StickyNote,
      onClick: handleNotesClick,
      bgClass: 'bg-amber-500/10 dark:bg-amber-500/20',
      textClass: 'text-amber-600 dark:text-amber-300'
    }
  ]

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Header do Chat */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Avatar melhorado */}
            <div className="relative">
              {chat.profilePicture ? (
                <img
                  src={chat.profilePicture}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=6366f1&color=ffffff&size=48`
                  }}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-600">
                  <span className="text-white font-semibold text-lg">
                    {chat.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {!chat.isGroup && chat.contact?.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></div>
              )}
            </div>

            {/* Info do Contato */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {chat.name}
              </h3>
              
              {/* Linha 1: Atendente, Status, Visto por último */}
              <div className="flex flex-wrap items-center gap-2 text-xs mt-1">
                {assignedAttendant ? (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full">
                    <User className="w-3 h-3" />
                    <span className="font-medium truncate max-w-[140px]">
                      {assignedAttendant.name || assignedAttendant.email || 'Sem responsável'}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                    <User className="w-3 h-3" />
                    <span className="font-medium">Não atribuído</span>
                  </div>
                )}

                {statusInfo && (
                  <div className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full capitalize', statusInfo.badgeClass)}>
                    <span className={cn('w-2 h-2 rounded-full', statusInfo.dotClass)} />
                    <span className="font-medium">{statusInfo.label}</span>
                  </div>
                )}

                {/* Visto por último */}
                {!chat.isGroup && (
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    {chat.contact?.isOnline ? (
                      <span className="text-green-500 font-medium">online</span>
                    ) : (
                      chat.contact?.lastSeen && (
                        <span>há 5min</span>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Linha 2: Tags */}
              {chat.labels && chat.labels.length > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  {chat.labels.slice(0, 3).map((label, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-[10px] font-medium"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {label}
                    </span>
                  ))}
                  {chat.labels.length > 3 && (
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                      +{chat.labels.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Ações do Header */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {primaryActions.map((action) => renderIconButton(action))}
            </div>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

            <div className="flex items-center gap-2">
              {utilityButtons.map((action) => renderIconButton(action))}
            </div>
          </div>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-1 min-h-0 bg-gray-50 dark:bg-gray-900"
      >
        {messagesError ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Erro ao carregar mensagens
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {messagesError}
              </p>
              <button
                onClick={refreshMessages}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="space-y-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400">Carregando mensagens...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhuma mensagem ainda
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Seja o primeiro a enviar uma mensagem
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <MessageBubble 
                  key={`${message.id}-${index}`} 
                  message={message} 
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Nenhuma mensagem nesta conversa
                </p>
              </div>
            )}
            
            {/* Indicador de digitação */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white dark:bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-md border border-gray-200 dark:border-gray-600">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  )
}
