'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Users, User, MessageSquare, Circle, Star, Pin, Archive, Trash2, MoreVertical, Filter, Hash, AtSign, Bell, BellOff } from 'lucide-react'

interface ChatSidebarProps {
  selectedChat: any
  onSelectChat: (chat: any) => void
  searchTerm: string
  filterType: string
}

const mockChats = [
  {
    id: 'chat-001',
    name: 'Ana Silva',
    type: 'attendant',
    avatar: null,
    lastMessage: 'Ok, vou verificar isso agora mesmo!',
    timestamp: '2 min',
    unread: 3,
    online: true,
    pinned: true,
    muted: false,
    status: 'online',
    role: 'Atendente Senior'
  },
  {
    id: 'chat-002',
    name: 'João Santos',
    type: 'client',
    avatar: null,
    lastMessage: 'Preciso de ajuda com minha conta',
    timestamp: '15 min',
    unread: 1,
    online: false,
    pinned: false,
    muted: false,
    status: 'offline',
    role: 'Cliente VIP'
  },
  {
    id: 'chat-003',
    name: 'Carlos Oliveira',
    type: 'attendant',
    avatar: null,
    lastMessage: 'Reunião às 15h confirmada',
    timestamp: '1h',
    unread: 0,
    online: true,
    pinned: false,
    muted: true,
    status: 'busy',
    role: 'Atendente'
  },
  {
    id: 'chat-004',
    name: 'Maria Costa',
    type: 'client',
    avatar: null,
    lastMessage: 'Obrigada pelo suporte!',
    timestamp: '3h',
    unread: 0,
    online: true,
    pinned: false,
    muted: false,
    status: 'away',
    role: 'Cliente'
  }
]

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  selectedChat, onSelectChat, searchTerm, filterType
}) => {
  const [chats] = useState(mockChats)
  const [showOptions, setShowOptions] = useState<string | null>(null)

  const filteredChats = chats.filter(chat => {
    if (filterType !== 'all' && chat.type !== filterType.slice(0, -1)) return false
    if (searchTerm && !chat.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const pinnedChats = filteredChats.filter(chat => chat.pinned)
  const regularChats = filteredChats.filter(chat => !chat.pinned)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'busy': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const ChatItem = ({ chat }: { chat: any }) => (
    <motion.div
      whileHover={{ x: 4 }}
      onClick={() => onSelectChat(chat)}
      onMouseEnter={() => setShowOptions(chat.id)}
      onMouseLeave={() => setShowOptions(null)}
      className={`relative flex items-center gap-3 p-4 cursor-pointer transition-all ${
        selectedChat?.id === chat.id
          ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      {/* Avatar com status */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
          {chat.type === 'attendant' ? <Users className="w-6 h-6" /> : <User className="w-6 h-6" />}
        </div>
        <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${getStatusColor(chat.status)} rounded-full border-2 border-white dark:border-gray-900`} />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-white truncate">
              {chat.name}
            </span>
            {chat.pinned && <Pin className="w-3 h-3 text-gray-400" />}
            {chat.muted && <BellOff className="w-3 h-3 text-gray-400" />}
          </div>
          <span className="text-xs text-gray-500">{chat.timestamp}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {chat.lastMessage}
          </p>
          {chat.unread > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
              {chat.unread}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">{chat.role}</p>
      </div>

      {/* Opções */}
      {showOptions === chat.id && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-2 top-2"
        >
          <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
            <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </motion.div>
      )}
    </motion.div>
  )

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            Chat Interno
          </h2>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Archive className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar conversas..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Tabs de filtro */}
        <div className="flex gap-2 mt-3">
          <button className="flex-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg text-sm font-medium">
            Todos
          </button>
          <button className="flex-1 px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-sm">
            Atendentes
          </button>
          <button className="flex-1 px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-sm">
            Clientes
          </button>
        </div>
      </div>

      {/* Lista de chats */}
      <div className="flex-1 overflow-y-auto">
        {/* Chats fixados */}
        {pinnedChats.length > 0 && (
          <div>
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
              Fixados
            </div>
            {pinnedChats.map(chat => (
              <ChatItem key={chat.id} chat={chat} />
            ))}
          </div>
        )}

        {/* Chats regulares */}
        {regularChats.length > 0 && (
          <div>
            {pinnedChats.length > 0 && (
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                Recentes
              </div>
            )}
            {regularChats.map(chat => (
              <ChatItem key={chat.id} chat={chat} />
            ))}
          </div>
        )}

        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500">Nenhuma conversa encontrada</p>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Online</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{filteredChats.filter(c => c.unread > 0).length} não lidas</span>
            <span>{filteredChats.length} chats</span>
          </div>
        </div>
      </div>
    </div>
  )
}
