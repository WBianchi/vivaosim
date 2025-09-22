'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  FileText,
  FileSignature,
  User,
  Ticket,
  Settings,
  Bell,
  Search,
  MoreVertical,
  Wifi,
  WifiOff,
  MessageSquare,
  Users,
  Clock,
  Target
} from 'lucide-react'
import { Chat } from '@/types/chat'
import { SidebarType } from '@/app/dashboard/chat/page'
import { cn } from '@/lib/utils'

interface TopbarChatProps {
  user: any
  isConnected: boolean
  unreadCount: number
  activeChat: Chat | null
  onSidebarToggle: (sidebar: SidebarType) => void
  activeSidebar: SidebarType
}

export const TopbarChat: React.FC<TopbarChatProps> = ({
  user,
  isConnected,
  unreadCount,
  activeChat,
  onSidebarToggle,
  activeSidebar
}) => {
  const sidebarButtons = [
    {
      id: 'schedule' as SidebarType,
      icon: Calendar,
      label: 'Agendamentos',
      color: 'blue',
      shortcut: 'A'
    },
    {
      id: 'quote' as SidebarType,
      icon: FileText,
      label: 'Orçamentos',
      color: 'green',
      shortcut: 'O'
    },
    {
      id: 'contract' as SidebarType,
      icon: FileSignature,
      label: 'Contratos',
      color: 'purple',
      shortcut: 'C'
    },
    {
      id: 'contact' as SidebarType,
      icon: User,
      label: 'Contato',
      color: 'orange',
      shortcut: 'I'
    },
    {
      id: 'ticket' as SidebarType,
      icon: Ticket,
      label: 'Tickets',
      color: 'red',
      shortcut: 'T'
    }
  ]

  const getColorClasses = (color: string, isActive: boolean) => {
    const baseClasses = 'transition-all duration-200'
    
    if (isActive) {
      switch (color) {
        case 'blue': return `${baseClasses} bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400`
        case 'green': return `${baseClasses} bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400`
        case 'purple': return `${baseClasses} bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400`
        case 'orange': return `${baseClasses} bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400`
        case 'red': return `${baseClasses} bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400`
        default: return `${baseClasses} bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300`
      }
    }
    
    return `${baseClasses} text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700`
  }

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6 shadow-sm">
      {/* Logo e Branding */}
      <div className="flex items-center space-x-4 mr-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Viva o Sim
            </h1>
            <div className="flex items-center space-x-2 -mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Chat</span>
              <div className="flex items-center space-x-1">
                {isConnected ? (
                  <Wifi className="w-3 h-3 text-green-500" />
                ) : (
                  <WifiOff className="w-3 h-3 text-red-500" />
                )}
                <span className={cn(
                  'text-xs font-medium',
                  isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                )}>
                  {isConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Rápidas */}
      <div className="flex items-center space-x-6 mr-8">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {unreadCount}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">não lidas</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            2.5min
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">resp. média</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            95%
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">satisfação</span>
        </div>
      </div>

      {/* Botões de Sidebar - Só aparecem se há chat ativo */}
      {activeChat && (
        <div className="flex items-center space-x-2 mr-8">
          <div className="text-xs text-gray-500 dark:text-gray-400 mr-2">
            Ferramentas:
          </div>
          {sidebarButtons.map((button) => {
            const Icon = button.icon
            const isActive = activeSidebar === button.id
            
            return (
              <motion.button
                key={button.id}
                onClick={() => onSidebarToggle(button.id)}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium',
                  getColorClasses(button.color, isActive)
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title={`${button.label} (Ctrl+${button.shortcut})`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden xl:block">{button.label}</span>
                <span className="hidden 2xl:block text-xs opacity-60">
                  ⌘{button.shortcut}
                </span>
              </motion.button>
            )
          })}
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Controles Direita */}
      <div className="flex items-center space-x-3">
        {/* Busca Global */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar conversas, contatos..."
            className="pl-10 pr-4 py-2 w-64 text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-colors"
          />
        </div>

        {/* Notificações */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </motion.button>

        {/* Configurações */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
        </motion.button>

        {/* Menu do Usuário */}
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {user.name || user.email}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Atendente
            </div>
          </div>
          
          <div className="relative">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || user.email}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </header>
  )
}
