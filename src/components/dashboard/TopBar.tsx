'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  Settings,
  MessageCircle,
  Calendar,
  DollarSign,
  ChevronDown,
  Zap,
  Wifi,
  WifiOff,
  Users,
  Menu,
  Maximize,
  Minimize,
  Languages,
  Globe,
  UserCircle,
  Shield,
  CreditCard,
  HelpCircle,
  BarChart3,
  Check,
  MoreVertical,
  QrCode,
  Loader2
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeProvider'
import { WhatsAppSimpleModal } from '@/components/whatsapp/WhatsAppSimpleModal'
import { WhatsAppConnectionManager } from '@/components/whatsapp/WhatsAppConnectionManager'
import { cn } from '@/lib/utils'

interface WhatsAppStatusProps {
  onOpenModal: () => void
}

const WhatsAppStatus: React.FC<WhatsAppStatusProps> = ({ onOpenModal }) => {
  const { isDarkMode } = useTheme()
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Verificar status da sessão WhatsApp
  React.useEffect(() => {
    const checkWhatsAppStatus = async () => {
      try {
        // Buscar token do cookie ou localStorage
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('accessToken='))
          ?.split('=')[1]

        const response = await fetch('/api/whatsapp/sessions', {
          headers: token ? {
            'Authorization': `Bearer ${token}`
          } : {}
        })
        
        if (response.ok) {
          const sessions = await response.json()
          // Verificar se existe alguma sessão ativa (WORKING)
          const hasActiveSession = Array.isArray(sessions) 
            ? sessions.some((s: any) => s.status === 'WORKING')
            : false
          setIsConnected(hasActiveSession)
          console.log('🔍 WhatsApp Status Check:', { sessions, hasActiveSession })
        } else {
          console.log('❌ Erro na resposta:', response.status)
        }
      } catch (error) {
        console.error('Erro ao verificar status WhatsApp:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkWhatsAppStatus()
    // Verificar a cada 15 segundos (otimizado)
    const interval = setInterval(checkWhatsAppStatus, 15000)
    
    // Listener para atualização instantânea quando conectar
    const handleWhatsAppConnected = () => {
      console.log('✅ WhatsApp conectado - atualizando status')
      setIsConnected(true)
      setIsLoading(false)
    }
    
    window.addEventListener('whatsapp-connected', handleWhatsAppConnected)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('whatsapp-connected', handleWhatsAppConnected)
    }
  }, [])

  if (isLoading) {
    return (
      <motion.div
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl',
          isDarkMode ? 'bg-slate-800/50 text-slate-300' : 'bg-gray-100/80 text-gray-600'
        )}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm font-medium">Verificando...</span>
      </motion.div>
    )
  }

  if (isConnected) {
    return (
      <motion.button
        onClick={onOpenModal}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300',
          isDarkMode
            ? 'bg-green-900/30 text-green-300 hover:bg-green-900/50'
            : 'bg-green-100/80 text-green-600 hover:bg-green-200/80'
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Wifi className="w-4 h-4" />
        <span className="text-sm font-medium">WhatsApp Conectado</span>
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      </motion.button>
    )
  }
  
  return (
    <motion.button
      onClick={onOpenModal}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300',
        isDarkMode
          ? 'bg-red-900/30 text-red-300 hover:bg-red-900/50'
          : 'bg-red-100/80 text-red-600 hover:bg-red-200/80'
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1] 
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <WifiOff className="w-4 h-4" />
      </motion.div>
      <span className="text-sm font-medium">
        Conectar WhatsApp
      </span>
      <div className="w-2 h-2 rounded-full bg-red-400" />
    </motion.button>
  )
}

interface WhatsAppChatsCountProps {
  sessions: any[]
}

const WhatsAppChatsCount: React.FC<WhatsAppChatsCountProps> = ({ sessions }) => {
  const { isDarkMode } = useTheme()
  const [totalChats, setTotalChats] = useState(0)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    const fetchChatsCount = async () => {
      if (!sessions || sessions.length === 0) {
        setTotalChats(0)
        return
      }

      setLoading(true)
      let count = 0

      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1]

      for (const session of sessions) {
        if (session.status === 'WORKING') {
          try {
            const response = await fetch(`/api/whatsapp/sessions/${session.sessionId}/chats`, {
              headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            })
            if (response.ok) {
              const chats = await response.json()
              count += Array.isArray(chats) ? chats.length : 0
            }
          } catch (err) {
            console.error('Erro ao buscar chats:', err)
          }
        }
      }

      setTotalChats(count)
      setLoading(false)
    }

    fetchChatsCount()
  }, [sessions])
  
  return (
    <motion.div
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-xl',
        isDarkMode 
          ? 'bg-slate-800/50 text-slate-300' 
          : 'bg-gray-100/50 text-gray-600'
      )}
      whileHover={{ scale: 1.02 }}
    >
      <MessageCircle className="w-4 h-4" />
      <span className="text-sm font-medium">
        {loading ? '...' : totalChats}
      </span>
      {totalChats > 0 && <div className="w-2 h-2 bg-green-400 rounded-full" />}
    </motion.div>
  )
}

interface NotificationItemProps {
  type: 'message' | 'appointment' | 'budget' | 'system'
  title: string
  message: string
  time: string
  isRead?: boolean
  onClick?: () => void
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  type,
  title,
  message,
  time,
  isRead = false,
  onClick
}) => {
  const { isDarkMode } = useTheme()
  
  const getIcon = () => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-4 h-4 text-blue-500" />
      case 'appointment':
        return <Calendar className="w-4 h-4 text-purple-500" />
      case 'budget':
        return <DollarSign className="w-4 h-4 text-green-500" />
      default:
        return <Zap className="w-4 h-4 text-orange-500" />
    }
  }

  return (
    <motion.div
      onClick={onClick}
      className={cn(
        'flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300',
        'border-l-4',
        type === 'message' && 'border-l-blue-500',
        type === 'appointment' && 'border-l-purple-500',
        type === 'budget' && 'border-l-green-500',
        type === 'system' && 'border-l-orange-500',
        isDarkMode
          ? 'hover:bg-slate-700/30'
          : 'hover:bg-gray-50/50',
        !isRead && (isDarkMode ? 'bg-slate-800/30' : 'bg-orange-50/30')
      )}
      whileHover={{ scale: 1.01, x: 2 }}
      whileTap={{ scale: 0.99 }}
    >
      <motion.div
        className="mt-1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        {getIcon()}
      </motion.div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className={cn(
            'font-medium text-sm',
            isDarkMode ? 'text-white' : 'text-gray-900'
          )}>
            {title}
          </h4>
          <span className={cn(
            'text-xs',
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          )}>
            {time}
          </span>
        </div>
        <p className={cn(
          'text-sm mt-1 line-clamp-2',
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        )}>
          {message}
        </p>
      </div>
      
      {!isRead && (
        <motion.div
          className="w-2 h-2 bg-orange-500 rounded-full mt-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        />
      )}
    </motion.div>
  )
}

interface TopBarProps {
  className?: string
  onMenuClick?: () => void
  showMenuButton?: boolean
}

export const TopBar: React.FC<TopBarProps> = ({ className, onMenuClick, showMenuButton = false }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showMobileOptions, setShowMobileOptions] = useState(false)
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false)
  const [showConnectionManager, setShowConnectionManager] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('pt')
  const [searchQuery, setSearchQuery] = useState('')
  const [whatsappSessions, setWhatsappSessions] = useState<any[]>([])
  const { user, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()

  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loadingNotifications, setLoadingNotifications] = useState(false)

  // Buscar notificações
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('accessToken='))
          ?.split('=')[1]

        const response = await fetch('/api/notifications', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })

        if (response.ok) {
          const data = await response.json()
          setNotifications(data.notifications || [])
          setUnreadCount(data.unreadCount || 0)
        }
      } catch (error) {
        console.error('Erro ao buscar notificações:', error)
      }
    }

    fetchNotifications()
    // Atualizar a cada 60 segundos
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  // Buscar sessões WhatsApp
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('accessToken='))
          ?.split('=')[1]

        const response = await fetch('/api/whatsapp/sessions', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })

        if (response.ok) {
          const sessions = await response.json()
          setWhatsappSessions(Array.isArray(sessions) ? sessions : [])
        }
      } catch (error) {
        console.error('Erro ao buscar sessões:', error)
      }
    }

    fetchSessions()
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchSessions, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleOpenWhatsAppModal = () => {
    console.log('🚀 Abrindo gerenciador de conexões WhatsApp')
    setShowConnectionManager(true)
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1]

      await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ notificationId })
      })

      // Atualizar localmente
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Erro ao marcar notificação:', error)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ]

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode)
    setShowLanguageMenu(false)
    // Aqui você implementaria a mudança de idioma
    console.log('Mudando idioma para:', langCode)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex items-center justify-between px-4 md:px-6 py-3 md:py-4',
        'border-b backdrop-blur-xl',
        isDarkMode
          ? 'bg-slate-900/95 border-slate-700/50'
          : 'bg-white/95 border-gray-200/50',
        className
      )}
    >
      {/* Left side - Mobile Menu + Search */}
      <div className="flex items-center gap-2 md:gap-4 flex-1">
        {/* Mobile Menu Button */}
        {showMenuButton && (
          <motion.button
            onClick={onMenuClick}
            className={cn(
              'p-3 rounded-xl transition-all duration-300 md:p-2',
              isDarkMode
                ? 'hover:bg-slate-700/50 text-slate-300'
                : 'hover:bg-gray-100/50 text-gray-600'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        )}

        {/* Search Bar - Hidden on small mobile, visible on larger screens */}
        <div className="relative flex-1 max-w-sm hidden sm:block">
          <Search className={cn(
            'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5',
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          )} />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full pl-10 pr-4 py-2 rounded-xl border transition-all backdrop-blur-sm',
              isDarkMode
                ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-gray-400 focus:border-orange-500 focus:bg-slate-800/70'
                : 'bg-white/50 border-gray-200/50 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:bg-white/80'
            )}
          />
          {searchQuery && (
            <motion.button
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-gray-600"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
          )}
        </div>

        {/* Mobile Search Button - Only on small screens */}
        <motion.button
          className={cn(
            'p-3 rounded-xl transition-all duration-300 sm:hidden',
            isDarkMode
              ? 'hover:bg-slate-700/50 text-slate-300'
              : 'hover:bg-gray-100/50 text-gray-600'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Search className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Center - Status Indicators - Hidden on mobile */}
      <div className="hidden lg:flex items-center gap-4">
        <WhatsAppStatus 
          onOpenModal={handleOpenWhatsAppModal}
        />
        
        {(user?.role === 'ADMINISTRADOR' || user?.role === 'ASSINANTE') && (
          <WhatsAppChatsCount sessions={whatsappSessions} />
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Language Selector - Hidden on small mobile */}
        <div className="relative hidden sm:block">
          <motion.button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className={cn(
              'flex items-center gap-2 p-2 rounded-xl transition-all duration-300',
              isDarkMode
                ? 'hover:bg-slate-700/50 text-slate-300'
                : 'hover:bg-gray-100/50 text-gray-600'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm font-medium hidden md:block">
              {languages.find(l => l.code === currentLanguage)?.flag}
            </span>
          </motion.button>

          {/* Language Dropdown */}
          <AnimatePresence>
            {showLanguageMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'absolute right-0 mt-2 w-48 rounded-2xl shadow-2xl border',
                  'backdrop-blur-xl z-50',
                  isDarkMode
                    ? 'bg-slate-800/95 border-slate-700/50'
                    : 'bg-white/95 border-gray-200/50'
                )}
              >
                <div className="p-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left',
                        currentLanguage === lang.code
                          ? isDarkMode
                            ? 'bg-orange-900/30 text-orange-300'
                            : 'bg-orange-100/80 text-orange-600'
                          : isDarkMode
                            ? 'hover:bg-slate-700/50 text-slate-300'
                            : 'hover:bg-gray-100/50 text-gray-600'
                      )}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.name}</span>
                      {currentLanguage === lang.code && (
                        <Check className="w-4 h-4 ml-auto text-orange-500" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fullscreen Toggle - Hidden on small mobile */}
        <motion.button
          onClick={toggleFullscreen}
          className={cn(
            'p-2 rounded-xl transition-all duration-300 hidden sm:block',
            isDarkMode
              ? 'hover:bg-slate-700/50 text-slate-300'
              : 'hover:bg-gray-100/50 text-gray-600'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </motion.button>

        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          className={cn(
            'p-2 md:p-2 rounded-xl transition-all duration-300',
            isDarkMode
              ? 'hover:bg-slate-700/50 text-slate-300'
              : 'hover:bg-gray-100/50 text-gray-600'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              'relative p-2 md:p-2 rounded-xl transition-all duration-300',
              isDarkMode
                ? 'hover:bg-slate-700/50 text-slate-300'
                : 'hover:bg-gray-100/50 text-gray-600'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5" />
            
            {unreadCount > 0 && (
              <motion.div
                className="absolute -top-1 -right-1 min-w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.div>
            )}
          </motion.button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl border',
                  'backdrop-blur-xl z-50',
                  isDarkMode
                    ? 'bg-slate-800/95 border-slate-700/50'
                    : 'bg-white/95 border-gray-200/50'
                )}
              >
                <div className="p-4 border-b border-gray-200/50 dark:border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <h3 className={cn(
                      'font-semibold',
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    )}>
                      Notificações
                    </h3>
                    {unreadCount > 0 && (
                      <span className="text-sm text-orange-500 font-medium">
                        {unreadCount} novas
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="max-h-80 overflow-y-auto p-2">
                  {notifications.length === 0 ? (
                    <div className={cn(
                      'text-center py-8 text-sm',
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    )}>
                      Nenhuma notificação
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        {...notification}
                        onClick={() => {
                          if (!notification.isRead) {
                            markAsRead(notification.id)
                          }
                          setShowNotifications(false)
                        }}
                      />
                    ))
                  )}
                </div>
                
                <div className="p-3 border-t border-gray-200/50 dark:border-slate-700/50">
                  <button className={cn(
                    'w-full text-center text-sm font-medium py-2 rounded-lg transition-colors',
                    isDarkMode
                      ? 'text-orange-400 hover:bg-slate-700/30'
                      : 'text-orange-600 hover:bg-orange-50/50'
                  )}>
                    Ver todas as notificações
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative">
          <motion.button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={cn(
              'flex items-center gap-2 md:gap-3 p-2 rounded-xl transition-all duration-300',
              isDarkMode
                ? 'hover:bg-slate-700/50 text-slate-300'
                : 'hover:bg-gray-100/50 text-gray-600'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            
            <div className="text-left hidden md:block">
              <p className={cn(
                'text-sm font-medium leading-none',
                isDarkMode ? 'text-white' : 'text-gray-900'
              )}>
                {user?.name || 'Usuário'}
              </p>
              <p className={cn(
                'text-xs leading-none mt-1',
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              )}>
                {user?.role || 'Role'}
              </p>
            </div>
            
            <motion.div
              animate={{ rotate: showUserMenu ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="hidden sm:block"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.button>

          {/* Advanced User Dropdown */}
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl border',
                  'backdrop-blur-xl z-50',
                  isDarkMode
                    ? 'bg-slate-800/95 border-slate-700/50'
                    : 'bg-white/95 border-gray-200/50'
                )}
              >
                {/* Profile Header */}
                <div className="p-6 border-b border-gray-200/50 dark:border-slate-700/50">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-slate-800" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        'font-semibold text-lg',
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      )}>
                        {user?.name}
                      </h3>
                      <p className={cn(
                        'text-sm',
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        {user?.email}
                      </p>
                      <div className={cn(
                        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-1',
                        isDarkMode
                          ? 'bg-orange-900/30 text-orange-300'
                          : 'bg-orange-100 text-orange-600'
                      )}>
                        <Shield className="w-3 h-3" />
                        {user?.role}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="p-4 border-b border-gray-200/50 dark:border-slate-700/50">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className={cn(
                        'text-lg font-bold',
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      )}>
                        12
                      </div>
                      <div className={cn(
                        'text-xs',
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        Projetos
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={cn(
                        'text-lg font-bold',
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      )}>
                        48
                      </div>
                      <div className={cn(
                        'text-xs',
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        Clientes
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={cn(
                        'text-lg font-bold',
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      )}>
                        R$ 15k
                      </div>
                      <div className={cn(
                        'text-xs',
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        Vendas
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="p-2">
                  <button className={cn(
                    'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group',
                    isDarkMode
                      ? 'hover:bg-slate-700/50 text-slate-300'
                      : 'hover:bg-gray-100/50 text-gray-600'
                  )}>
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                      isDarkMode ? 'bg-slate-700 group-hover:bg-slate-600' : 'bg-gray-100 group-hover:bg-gray-200'
                    )}>
                      <UserCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Meu Perfil</div>
                      <div className={cn(
                        'text-xs',
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      )}>
                        Dados pessoais e configurações
                      </div>
                    </div>
                  </button>

                  <button className={cn(
                    'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group',
                    isDarkMode
                      ? 'hover:bg-slate-700/50 text-slate-300'
                      : 'hover:bg-gray-100/50 text-gray-600'
                  )}>
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                      isDarkMode ? 'bg-slate-700 group-hover:bg-slate-600' : 'bg-gray-100 group-hover:bg-gray-200'
                    )}>
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Analytics</div>
                      <div className={cn(
                        'text-xs',
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      )}>
                        Relatórios e métricas
                      </div>
                    </div>
                  </button>

                  <button className={cn(
                    'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group',
                    isDarkMode
                      ? 'hover:bg-slate-700/50 text-slate-300'
                      : 'hover:bg-gray-100/50 text-gray-600'
                  )}>
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                      isDarkMode ? 'bg-slate-700 group-hover:bg-slate-600' : 'bg-gray-100 group-hover:bg-gray-200'
                    )}>
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Planos & Billing</div>
                      <div className={cn(
                        'text-xs',
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      )}>
                        Assinatura e pagamentos
                      </div>
                    </div>
                  </button>

                  <button className={cn(
                    'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group',
                    isDarkMode
                      ? 'hover:bg-slate-700/50 text-slate-300'
                      : 'hover:bg-gray-100/50 text-gray-600'
                  )}>
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                      isDarkMode ? 'bg-slate-700 group-hover:bg-slate-600' : 'bg-gray-100 group-hover:bg-gray-200'
                    )}>
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Configurações</div>
                      <div className={cn(
                        'text-xs',
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      )}>
                        Preferências do sistema
                      </div>
                    </div>
                  </button>

                  <button className={cn(
                    'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group',
                    isDarkMode
                      ? 'hover:bg-slate-700/50 text-slate-300'
                      : 'hover:bg-gray-100/50 text-gray-600'
                  )}>
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                      isDarkMode ? 'bg-slate-700 group-hover:bg-slate-600' : 'bg-gray-100 group-hover:bg-gray-200'
                    )}>
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Central de Ajuda</div>
                      <div className={cn(
                        'text-xs',
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      )}>
                        Suporte e documentação
                      </div>
                    </div>
                  </button>
                </div>

                {/* Logout Button */}
                <div className="p-2 border-t border-gray-200/50 dark:border-slate-700/50">
                  <button 
                    onClick={() => {
                      logout()
                      setShowUserMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Sair da Conta</div>
                      <div className="text-xs opacity-60">
                        Encerrar sessão atual
                      </div>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Options Menu - Only on small screens */}
        <div className="relative sm:hidden">
          <motion.button
            onClick={() => setShowMobileOptions(!showMobileOptions)}
            className={cn(
              'p-2 rounded-xl transition-all duration-300',
              isDarkMode
                ? 'hover:bg-slate-700/50 text-slate-300'
                : 'hover:bg-gray-100/50 text-gray-600'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MoreVertical className="w-5 h-5" />
          </motion.button>

          {/* Mobile Options Dropdown */}
          <AnimatePresence>
            {showMobileOptions && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'absolute right-0 mt-2 w-48 rounded-2xl shadow-2xl border',
                  'backdrop-blur-xl z-50',
                  isDarkMode
                    ? 'bg-slate-800/95 border-slate-700/50'
                    : 'bg-white/95 border-gray-200/50'
                )}
              >
                <div className="p-2">
                  {/* Language Options */}
                  <div className="mb-2">
                    <p className={cn('px-3 py-1 text-xs font-medium', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
                      Idioma
                    </p>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          handleLanguageChange(lang.code)
                          setShowMobileOptions(false)
                        }}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left',
                          currentLanguage === lang.code
                            ? isDarkMode
                              ? 'bg-orange-900/30 text-orange-300'
                              : 'bg-orange-100/80 text-orange-600'
                            : isDarkMode
                              ? 'hover:bg-slate-700/50 text-slate-300'
                              : 'hover:bg-gray-100/50 text-gray-600'
                        )}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-sm font-medium">{lang.name}</span>
                        {currentLanguage === lang.code && (
                          <Check className="w-4 h-4 ml-auto text-orange-500" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Fullscreen Toggle */}
                  <button
                    onClick={() => {
                      toggleFullscreen()
                      setShowMobileOptions(false)
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left',
                      isDarkMode
                        ? 'hover:bg-slate-700/50 text-slate-300'
                        : 'hover:bg-gray-100/50 text-gray-600'
                    )}
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    <span className="text-sm font-medium">
                      {isFullscreen ? 'Sair Tela Cheia' : 'Tela Cheia'}
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* WhatsApp Connection Manager */}
      <WhatsAppConnectionManager
        isOpen={showConnectionManager}
        onClose={() => setShowConnectionManager(false)}
      />
    </header>
  )
}
