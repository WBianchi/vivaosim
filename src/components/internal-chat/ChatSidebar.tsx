'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Users, User, MessageSquare, Circle, Star, Pin, Archive, Trash2, MoreVertical, Filter, Hash, AtSign, Bell, BellOff, Shield, UserCog } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface ChatSidebarProps {
  selectedChat: any
  onSelectChat: (chat: any) => void
  searchTerm: string
  filterType: string
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  selectedChat, onSelectChat, searchTerm, filterType
}) => {
  const authContext = useAuth()
  const { user, loading: authLoading } = authContext
  
  console.log('🔍 ChatSidebar - authContext:', authContext)
  console.log('👤 ChatSidebar - user:', user)
  console.log('⏰ ChatSidebar - authLoading:', authLoading)
  
  const [chats, setChats] = useState<any[]>([])
  const [availableUsers, setAvailableUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showOptions, setShowOptions] = useState<string | null>(null)

  // Buscar chats e usuários disponíveis (aguardar autenticação)
  useEffect(() => {
    // Aguardar autenticação finalizar
    if (authLoading) {
      console.log('⏳ ChatSidebar aguardando autenticação...', { authLoading, user })
      return
    }
    
    // Se não há usuário após carregar, não buscar
    if (!user?.id) {
      console.log('⚠️ Sem usuário após autenticação', { authLoading, user })
      setLoading(false)
      return
    }
    
    // Usuário autenticado, buscar dados
    console.log('✅ ChatSidebar iniciando fetchChats para user:', user.id)
    fetchChats()
  }, [user, authLoading])

  const fetchChats = async () => {
    if (!user?.id) {
      console.log('⚠️ Usuário não autenticado, user:', user)
      setLoading(false)
      return
    }
    
    console.log('🔍 Buscando chats internos para user:', user.id)
    
    try {
      const response = await fetch('/api/internal-chats', {
        headers: {
          'x-user-id': user.id
        }
      })
      
      console.log('📡 Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Dados recebidos:', data)
        setChats(data.chats || [])
        setAvailableUsers(data.availableUsers || [])
      } else {
        const errorData = await response.json()
        console.error('❌ Erro na resposta:', errorData)
      }
    } catch (error) {
      console.error('❌ Erro ao buscar chats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Criar ou abrir chat com usuário
  const handleOpenChat = async (otherUserId: string) => {
    if (!user?.id) return
    
    try {
      const response = await fetch('/api/internal-chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({ otherUserId })
      })
      
      if (response.ok) {
        const data = await response.json()
        await fetchChats() // Recarregar lista
        // Encontrar o chat criado e selecionar
        const newChat = chats.find(c => c.id === data.chat.id)
        if (newChat) {
          onSelectChat(newChat)
        }
      }
    } catch (error) {
      console.error('❌ Erro ao criar/abrir chat:', error)
    }
  }

  // Formatar timestamp relativo
  const formatTimestamp = (date: string) => {
    const now = new Date()
    const messageDate = new Date(date)
    const diffMs = now.getTime() - messageDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Agora'
    if (diffMins < 60) return `${diffMins} min`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return messageDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  // Verificar se usuário está online (logou nas últimas 5 min)
  const isUserOnline = (lastLoginAt: string) => {
    if (!lastLoginAt) return false
    const diff = new Date().getTime() - new Date(lastLoginAt).getTime()
    return diff < 300000 // 5 minutos
  }

  const filteredChats = chats.filter(chat => {
    if (searchTerm && !chat.otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const pinnedChats = filteredChats.filter(chat => chat.pinned)
  const regularChats = filteredChats.filter(chat => !chat.pinned)

  const getStatusColor = (online: boolean) => {
    return online ? 'bg-green-500' : 'bg-gray-400'
  }

  const ChatItem = ({ chat }: { chat: any }) => {
    const online = isUserOnline(chat.otherUser?.lastLoginAt)
    const isSelected = selectedChat?.id === chat.id
    
    return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelectChat(chat)}
      onMouseEnter={() => setShowOptions(chat.id)}
      onMouseLeave={() => setShowOptions(null)}
      className={`relative mx-3 mb-3 p-4 cursor-pointer rounded-2xl transition-all ${
        isSelected
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl'
          : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar com status */}
        <div className="relative flex-shrink-0">
          {chat.otherUser?.avatar ? (
            <img 
              src={chat.otherUser.avatar} 
              alt={chat.otherUser.name}
              className={`w-14 h-14 rounded-xl object-cover ring-2 ${
                isSelected ? 'ring-white' : 'ring-gray-200 dark:ring-gray-700'
              }`}
            />
          ) : (
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-semibold shadow-lg ${
              isSelected 
                ? 'bg-white/20 text-white' 
                : chat.otherUser?.role === 'ADMINISTRADOR'
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                  : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
            }`}>
              {chat.otherUser?.role === 'ATENDENTE' ? <Users className="w-7 h-7" /> : <User className="w-7 h-7" />}
            </div>
          )}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 shadow-sm ${
            online ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          } ${isSelected ? 'border-blue-600' : 'border-white dark:border-gray-800'}`} />
          
          {/* Badges de Pin e Mute */}
          {(chat.pinned || chat.muted) && (
            <div className="absolute -top-1 -left-1 flex gap-1">
              {chat.pinned && (
                <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                  <Pin className="w-3 h-3 text-yellow-900" />
                </div>
              )}
              {chat.muted && (
                <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center shadow-md">
                  <BellOff className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className={`font-bold truncate text-base ${
              isSelected ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              {chat.otherUser?.name || 'Usuário'}
            </span>
            <span className={`text-xs font-medium whitespace-nowrap ml-2 ${
              isSelected ? 'text-white/80' : 'text-gray-500'
            }`}>
              {chat.lastMessageAt ? formatTimestamp(chat.lastMessageAt) : ''}
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm truncate ${
              isSelected ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {chat.lastMessage || 'Nenhuma mensagem'}
            </p>
            {chat.unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`ml-2 min-w-[24px] h-6 px-2 flex items-center justify-center rounded-full text-xs font-bold shadow-lg ${
                  isSelected 
                    ? 'bg-white text-blue-600' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                }`}
              >
                {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
              </motion.span>
            )}
          </div>

          {/* Role Badge */}
          <div className="flex items-center gap-2">
            {chat.otherUser?.role === 'ADMINISTRADOR' && (
              <div className={`px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                isSelected 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              }`}>
                <Shield className="w-3 h-3" />
                <span className="text-xs font-semibold">Admin</span>
              </div>
            )}
            {chat.otherUser?.role === 'ATENDENTE' && (
              <div className={`px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                isSelected 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
              }`}>
                <UserCog className="w-3 h-3" />
                <span className="text-xs font-semibold">Atendente</span>
              </div>
            )}
            {online && (
              <div className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${
                isSelected 
                  ? 'bg-white/20 text-white' 
                  : 'bg-green-100 dark:bg-green-900/30'
              }`}>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className={`text-xs font-medium ${
                  isSelected ? 'text-white' : 'text-green-700 dark:text-green-400'
                }`}>Online</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Opções */}
      {showOptions === chat.id && !isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-2 top-2"
        >
          <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </motion.div>
      )}
    </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
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
      <div className="flex-1 overflow-y-auto pt-3">
        {/* Chats fixados */}
        {pinnedChats.length > 0 && (
          <div>
            <div className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
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

        {/* Usuários disponíveis (quando não há chats) */}
        {filteredChats.length === 0 && availableUsers.length > 0 && (
          <div>
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
              Usuários Disponíveis
            </div>
            {availableUsers.map((user: any) => (
              <motion.div
                key={user.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOpenChat(user.id)}
                className="mx-2 mb-2 p-3 cursor-pointer bg-white dark:bg-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all shadow-sm hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-gray-200 dark:ring-gray-700 shadow-md"
                      />
                    ) : (
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-semibold shadow-xl ${
                        user.role === 'ADMINISTRADOR' 
                          ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500' 
                          : 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500'
                      }`}>
                        {user.role === 'ATENDENTE' ? <Users className="w-8 h-8" /> : <User className="w-8 h-8" />}
                      </div>
                    )}
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 shadow-lg ${
                      isUserOnline(user.lastLoginAt) ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                    }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 dark:text-white truncate text-lg">
                        {user.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                        Clique para iniciar conversa
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {user.role === 'ADMINISTRADOR' && (
                        <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center gap-1.5 shadow-md">
                          <Shield className="w-3.5 h-3.5 text-white" />
                          <p className="text-xs text-white font-bold">Admin</p>
                        </div>
                      )}
                      {user.role === 'ATENDENTE' && (
                        <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center gap-1.5 shadow-md">
                          <UserCog className="w-3.5 h-3.5 text-white" />
                          <p className="text-xs text-white font-bold">Atendente</p>
                        </div>
                      )}
                      {isUserOnline(user.lastLoginAt) ? (
                        <div className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center gap-1.5 shadow-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <p className="text-xs text-green-700 dark:text-green-400 font-bold">Online</p>
                        </div>
                      ) : (
                        <div className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-full shadow-sm">
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Offline</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredChats.length === 0 && availableUsers.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-6"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
            >
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </motion.div>
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">
              Nenhum chat disponível
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Comece uma nova conversa clicando<br />em um usuário disponível
            </p>
          </motion.div>
        )}
      </div>

      {/* Status bar */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Online</span>
          </div>
          <div className="flex items-center gap-3">
            {filteredChats.filter(c => c.unreadCount > 0).length > 0 && (
              <div className="px-2.5 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                {filteredChats.filter(c => c.unreadCount > 0).length} nova{filteredChats.filter(c => c.unreadCount > 0).length > 1 ? 's' : ''}
              </div>
            )}
            <div className="px-2.5 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full">
              {filteredChats.length} chat{filteredChats.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
