'use client'

import { motion } from 'framer-motion'
import { Phone, Video, Info, Search, MoreVertical, Star, Pin, Archive, Trash2, Bell, BellOff, Users, Circle, Shield, Clock, UserCog } from 'lucide-react'

interface ChatTopBarProps {
  selectedChat: any
  onlineStatus: string
  onStatusChange: (status: any) => void
}

export const ChatTopBar: React.FC<ChatTopBarProps> = ({
  selectedChat, onlineStatus, onStatusChange
}) => {
  if (!selectedChat) {
    return (
      <div className="flex-shrink-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <p className="text-gray-500">Selecione uma conversa para começar</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'busy': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online': return 'Online'
      case 'away': return 'Ausente'
      case 'busy': return 'Ocupado'
      default: return 'Offline'
    }
  }

  return (
    <div className="flex-shrink-0 h-20 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 shadow-sm">
      {/* Informações do usuário */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {selectedChat.otherUser?.avatar ? (
            <img 
              src={selectedChat.otherUser.avatar} 
              alt={selectedChat.otherUser?.name || selectedChat.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-200 dark:ring-gray-700 shadow-md"
            />
          ) : (
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg ${
              selectedChat.otherUser?.role === 'ADMINISTRADOR'
                ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                : 'bg-gradient-to-br from-blue-500 to-cyan-500'
            }`}>
              {selectedChat.otherUser?.role === 'ATENDENTE' ? <UserCog className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
            </div>
          )}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${selectedChat.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'} rounded-full border-2 border-white dark:border-gray-800 shadow-md`} />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              {selectedChat.otherUser?.name || selectedChat.name}
            </h3>
            {selectedChat.pinned && (
              <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                <Pin className="w-3 h-3 text-yellow-900" />
              </div>
            )}
            {selectedChat.muted && (
              <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                <BellOff className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Role Badge */}
            {selectedChat.otherUser?.role === 'ADMINISTRADOR' && (
              <div className="px-2.5 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center gap-1 shadow-sm">
                <Shield className="w-3 h-3 text-white" />
                <span className="text-xs font-semibold text-white">Admin</span>
              </div>
            )}
            {selectedChat.otherUser?.role === 'ATENDENTE' && (
              <div className="px-2.5 py-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center gap-1 shadow-sm">
                <UserCog className="w-3 h-3 text-white" />
                <span className="text-xs font-semibold text-white">Atendente</span>
              </div>
            )}
            
            {/* Status Online */}
            <div className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${
              selectedChat.status === 'online' 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-gray-100 dark:bg-gray-700'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${selectedChat.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className={`text-xs font-medium ${selectedChat.status === 'online' ? 'text-green-700 dark:text-green-400' : 'text-gray-500'}`}>
                {getStatusLabel(selectedChat.status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-3">
        {/* Badge de ações futuras */}
        <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            Em breve: Ações rápidas
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 rounded-xl transition-all group"
          title="Buscar na conversa"
        >
          <Search className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 rounded-xl transition-all group"
          title="Chamada de voz"
        >
          <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 rounded-xl transition-all group"
          title="Chamada de vídeo"
        >
          <Video className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
        </motion.button>

        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 rounded-xl transition-all"
          title="Mais opções"
        >
          <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.button>
      </div>
    </div>
  )
}
