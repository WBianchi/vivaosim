'use client'

import { motion } from 'framer-motion'
import { Phone, Video, Info, Search, MoreVertical, Star, Pin, Archive, Trash2, Bell, BellOff, Users, Circle, Shield, Clock } from 'lucide-react'

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
      <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center">
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
    <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      {/* Informações do usuário */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white">
            {selectedChat.type === 'attendant' ? <Users className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
          </div>
          <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(selectedChat.status)} rounded-full border-2 border-white dark:border-gray-800`} />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {selectedChat.name}
            </h3>
            {selectedChat.pinned && <Pin className="w-3 h-3 text-gray-400" />}
            {selectedChat.muted && <BellOff className="w-3 h-3 text-gray-400" />}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500">{selectedChat.role}</span>
            <span className="flex items-center gap-1">
              <Circle className={`w-2 h-2 ${getStatusColor(selectedChat.status)} fill-current`} />
              <span className="text-gray-500">{getStatusLabel(selectedChat.status)}</span>
            </span>
            {selectedChat.type === 'attendant' && (
              <span className="text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Última vez: há 2 min
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-2">
        {/* Status do admin */}
        <div className="flex items-center gap-2 mr-4 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span className="text-sm text-gray-600 dark:text-gray-400">Seu status:</span>
          <select
            value={onlineStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-transparent text-sm font-medium text-gray-900 dark:text-white focus:outline-none"
          >
            <option value="online">Online</option>
            <option value="away">Ausente</option>
            <option value="busy">Ocupado</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Buscar na conversa"
        >
          <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Chamada de voz"
        >
          <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Chamada de vídeo"
        >
          <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.button>

        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2" />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title={selectedChat.pinned ? 'Desafixar' : 'Fixar'}
        >
          <Pin className={`w-5 h-5 ${selectedChat.pinned ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title={selectedChat.muted ? 'Ativar notificações' : 'Silenciar'}
        >
          {selectedChat.muted ? (
            <BellOff className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Arquivar conversa"
        >
          <Archive className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Informações"
        >
          <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Mais opções"
        >
          <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.button>
      </div>
    </div>
  )
}
