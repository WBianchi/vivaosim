'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone,
  Video,
  Info,
  Search,
  MoreVertical,
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
import { Chat, Message, MessageType, MessageAck } from '@/types/chat'
import { SidebarType } from '@/app/chat/page'
import { useMessages } from '@/hooks/useMessages'
import { cn } from '@/lib/utils'

interface ChatAreaProps {
  chat: Chat
  onSidebarToggle: (sidebar: SidebarType) => void
}

export const ChatArea: React.FC<ChatAreaProps> = ({ chat, onSidebarToggle }) => {
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

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
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                {chat.isGroup ? (
                  <span>{chat.participants?.length} participantes</span>
                ) : (
                  <>
                    <span>{chat.contact?.phone}</span>
                    {chat.contact?.isOnline ? (
                      <span className="text-green-500">• online</span>
                    ) : (
                      chat.contact?.lastSeen && (
                        <span>• visto por último {formatMessageTime(chat.contact.lastSeen)}</span>
                      )
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Ações do Header */}
          <div className="flex items-center space-x-1">
            {/* Funcionalidades Business */}
            <motion.button
              onClick={() => onSidebarToggle('schedule')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Agendamentos"
            >
              <Calendar className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={() => onSidebarToggle('quote')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
              title="Orçamentos"
            >
              <DollarSign className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={() => onSidebarToggle('contract')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
              title="Contratos"
            >
              <FileSignature className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={() => onSidebarToggle('ticket')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Tickets"
            >
              <Ticket className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={() => onSidebarToggle('contact')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
              title="Informações do Contato"
            >
              <User className="w-5 h-5" />
            </motion.button>

            {/* Divisor */}
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

            {/* Ações Tradicionais */}
            <motion.button
              onClick={refreshMessages}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Atualizar mensagens"
            >
              <RefreshCw className={cn("w-5 h-5", isLoading && "animate-spin")} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Video className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSidebarToggle('contact')}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Info className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-1 min-h-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.1'%3E%3Cpath d='m0 40 40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}
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
