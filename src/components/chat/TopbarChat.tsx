'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  Users,
  Calendar,
  FileText,
  FileSignature,
  Ticket,
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  Sun,
  Moon,
  Palette,
  Wifi,
  WifiOff,
  ChevronDown,
  Shield,
  UserCircle,
  BarChart3,
  CreditCard,
  HelpCircle
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'
import { useCustomization } from '@/contexts/CustomizationProvider'
import { Chat } from '@/types/chat'
import { cn } from '@/lib/utils'
import { ChatNotifications } from './ChatNotifications'
import { AllQuotesSidebar } from './sidebars/AllQuotesSidebar'
import { CustomizationPanel } from './CustomizationPanel'
import { getAuthToken } from '@/lib/auth-token'
import { useAuth } from '@/contexts/AuthContext'
import type { SidebarType } from '@/app/chat/page'

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
  const { isDarkMode, toggleTheme } = useTheme()
  const { 
    settings, 
    updateTopbar, 
    updateSidebar, 
    updateChat, 
    updateMessages,
    resetSettings,
    getTopbarClasses 
  } = useCustomization()
  const { logout } = useAuth()
  const [showColorPicker, setShowColorPicker] = React.useState(false)
  const [showUserMenu, setShowUserMenu] = React.useState(false)

  const roleLabel =
    user?.role === 'ADMINISTRADOR'
      ? 'Administrador'
      : user?.role === 'ATENDENTE'
        ? 'Atendente'
        : user?.role === 'ASSINANTE'
          ? 'Assinante'
          : user?.role === 'CLIENTE'
            ? 'Cliente'
            : user?.role || 'Usuário'

  const userDisplayName = user?.name || user?.email || 'Usuário'
  const userEmail = user?.email || 'Sem e-mail'
  const userInitial = (user?.name?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()

  const solidColors = [
    { name: 'Azul', value: 'blue', class: 'bg-blue-500' },
    { name: 'Verde', value: 'green', class: 'bg-green-500' },
    { name: 'Roxo', value: 'purple', class: 'bg-purple-500' },
    { name: 'Rosa', value: 'pink', class: 'bg-pink-500' },
    { name: 'Laranja', value: 'orange', class: 'bg-orange-500' },
    { name: 'Vermelho', value: 'red', class: 'bg-red-500' },
    { name: 'Amarelo', value: 'yellow', class: 'bg-yellow-500' },
    { name: 'Ciano', value: 'cyan', class: 'bg-cyan-500' },
    { name: 'Índigo', value: 'indigo', class: 'bg-indigo-500' },
  ]
  
  const [totalQuotes, setTotalQuotes] = React.useState(0)
  const [totalContracts, setTotalContracts] = React.useState(0)
  const [totalTags, setTotalTags] = React.useState(0)
  const [totalSchedules, setTotalSchedules] = React.useState(0)
  const [showQuotesSidebar, setShowQuotesSidebar] = React.useState(false)

  // Buscar total de orçamentos
  React.useEffect(() => {
    const fetchTotalQuotes = async () => {
      try {
        const token = getAuthToken()
        if (!token) {
          console.log('⚠️ TopBar: Token não encontrado')
          return
        }

        console.log('🔍 TopBar: Buscando estatísticas de orçamentos...')
        
        const response = await fetch('/api/quotes/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        
        console.log('📊 TopBar: Resposta da API stats:', data)
        
        if (data.success) {
          setTotalQuotes(data.total || 0)
          console.log(`✅ TopBar: Total de orçamentos: ${data.total}`)
        }
      } catch (error) {
        console.error('❌ TopBar: Erro ao buscar total de orçamentos:', error)
      }
    }
    
    fetchTotalQuotes()
  }, [])

  // Buscar total de contratos
  React.useEffect(() => {
    const fetchTotalContracts = async () => {
      try {
        const token = getAuthToken()
        if (!token) {
          console.log('⚠️ TopBar: Token não encontrado (contratos)')
          return
        }

        console.log('🔍 TopBar: Buscando estatísticas de contratos...')
        
        const response = await fetch('/api/contracts/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        
        console.log('📊 TopBar: Resposta da API contracts stats:', data)
        
        if (data.success) {
          setTotalContracts(data.total || 0)
          console.log(`✅ TopBar: Total de contratos: ${data.total}`)
        }
      } catch (error) {
        console.error('❌ TopBar: Erro ao buscar total de contratos:', error)
      }
    }
    
    fetchTotalContracts()
  }, [])

  // Atualizar contagem de tags do chat atual
  React.useEffect(() => {
    if (activeChat && Array.isArray(activeChat.labels)) {
      setTotalTags(activeChat.labels.length)
    } else {
      setTotalTags(0)
    }
  }, [activeChat])

  // Buscar total de agendamentos do chat atual
  React.useEffect(() => {
    const fetchSchedules = async () => {
      if (!activeChat) {
        setTotalSchedules(0)
        return
      }

      try {
        const contactRes = await fetch(`/api/contacts/check-chat?chatId=${activeChat.id}`)
        const contactData = await contactRes.json()
        if (contactData.exists && contactData.contact) {
          const schedulesRes = await fetch(`/api/schedules?contactId=${contactData.contact.id}`)
          const schedulesData = await schedulesRes.json()
          const schedulesList = Array.isArray(schedulesData) ? schedulesData : (schedulesData.schedules || [])
          setTotalSchedules(schedulesList.length)
        }
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error)
      }
    }

    fetchSchedules()
  }, [activeChat])

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
    <header className={getTopbarClasses()}>
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

    

      {/* Botões de Sidebar - Só aparecem se há chat ativo */}
      {activeChat && (
        <div className="flex items-center space-x-2 mr-8">
          
          {sidebarButtons.map((button) => {
            const Icon = button.icon
            const isActive = activeSidebar === button.id
            
            return (
              <motion.button
                key={button.id}
                onClick={() => {
                  if (button.id === 'quote') {
                    setShowQuotesSidebar(true)
                  } else {
                    onSidebarToggle(button.id)
                  }
                }}
                className={cn(
                  'relative flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium',
                  getColorClasses(button.color, isActive)
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title={`${button.label} (Ctrl+${button.shortcut})`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden xl:block">{button.label}</span>
                {button.id === 'quote' && totalQuotes > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalQuotes > 99 ? '99+' : totalQuotes}
                  </span>
                )}
                {button.id === 'contract' && totalContracts > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalContracts > 99 ? '99+' : totalContracts}
                  </span>
                )}
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

        {/* Status de Conexão WAHA */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            isConnected
              ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
          }`}
        >
          {isConnected ? (
            <Wifi className="w-4 h-4" />
          ) : (
            <WifiOff className="w-4 h-4" />
          )}
          <span className="text-xs font-medium">
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </motion.div>

        {/* Notificações */}
        <ChatNotifications />

        {/* Toggle Dark/Light */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </motion.button>

        {/* Color Picker */}
        <div className="relative">
          <motion.button
            onClick={() => setShowColorPicker(!showColorPicker)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Customizar Cores"
          >
            <Palette className="w-5 h-5" />
          </motion.button>

          <CustomizationPanel
            isOpen={showColorPicker}
            onClose={() => setShowColorPicker(false)}
            settings={settings}
            updateTopbar={updateTopbar}
            updateSidebar={updateSidebar}
            updateChat={updateChat}
            updateMessages={updateMessages}
            resetSettings={resetSettings}
          />
        </div>

        {/* Configurações */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
        </motion.button>

        {/* Menu do Usuário */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
          <div className="relative">
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={cn(
                'flex items-center gap-2 md:gap-3 p-2 rounded-xl transition-all duration-300',
                isDarkMode
                  ? 'hover:bg-gray-700/50 text-gray-300'
                  : 'hover:bg-gray-100/50 text-gray-600'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                {userInitial}
              </div>

              <div className="text-left hidden md:block">
                <p
                  className={cn(
                    'text-sm font-medium leading-none',
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  )}
                >
                  {userDisplayName}
                </p>
                <p
                  className={cn(
                    'text-xs leading-none mt-1',
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  )}
                >
                  {roleLabel}
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

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  key="chat-user-menu"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl border backdrop-blur-xl z-50',
                    isDarkMode
                      ? 'bg-gray-900/95 border-gray-700/50'
                      : 'bg-white/95 border-gray-200/50'
                  )}
                >
                  {/* Profile Header */}
                  <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {userInitial}
                          </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-900" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={cn(
                            'font-semibold text-lg',
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          )}
                        >
                          {userDisplayName}
                        </h3>
                        <p
                          className={cn(
                            'text-sm truncate',
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          )}
                        >
                          {userEmail}
                        </p>
                        <div
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-1',
                            isDarkMode
                              ? 'bg-orange-900/30 text-orange-300'
                              : 'bg-orange-100 text-orange-600'
                          )}
                        >
                          <Shield className="w-3 h-3" />
                          {roleLabel}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div
                          className={cn(
                            'text-lg font-bold',
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          )}
                        >
                          {totalQuotes}
                        </div>
                        <div
                          className={cn(
                            'text-xs',
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          )}
                        >
                          Orçamentos
                        </div>
                      </div>
                      <div className="text-center">
                        <div
                          className={cn(
                            'text-lg font-bold',
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          )}
                        >
                          {totalTags}
                        </div>
                        <div
                          className={cn(
                            'text-xs',
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          )}
                        >
                          Tags
                        </div>
                      </div>
                      <div className="text-center">
                        <div
                          className={cn(
                            'text-lg font-bold',
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          )}
                        >
                          {totalContracts}
                        </div>
                        <div
                          className={cn(
                            'text-xs',
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          )}
                        >
                          Contratos
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      onClick={() => setShowUserMenu(false)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group',
                        isDarkMode
                          ? 'hover:bg-gray-700/50 text-gray-300'
                          : 'hover:bg-gray-100/50 text-gray-600'
                      )}
                    >
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                          isDarkMode
                            ? 'bg-gray-800 group-hover:bg-gray-700'
                            : 'bg-gray-100 group-hover:bg-gray-200'
                        )}
                      >
                        <UserCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Meu Perfil</div>
                        <div
                          className={cn(
                            'text-xs',
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          )}
                        >
                          Dados pessoais e configurações
                        </div>
                      </div>
                    </button>

                    {user?.role !== 'CLIENTE' && (
                      <button
                        onClick={() => setShowUserMenu(false)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group',
                          isDarkMode
                            ? 'hover:bg-gray-700/50 text-gray-300'
                            : 'hover:bg-gray-100/50 text-gray-600'
                        )}
                      >
                        <div
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                            isDarkMode
                              ? 'bg-gray-800 group-hover:bg-gray-700'
                              : 'bg-gray-100 group-hover:bg-gray-200'
                          )}
                        >
                          <BarChart3 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Analytics</div>
                          <div
                            className={cn(
                              'text-xs',
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            )}
                          >
                            Relatórios e métricas
                          </div>
                        </div>
                      </button>
                    )}

                    {user?.role !== 'CLIENTE' && (
                      <button
                        onClick={() => setShowUserMenu(false)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group',
                          isDarkMode
                            ? 'hover:bg-gray-700/50 text-gray-300'
                            : 'hover:bg-gray-100/50 text-gray-600'
                        )}
                      >
                        <div
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                            isDarkMode
                              ? 'bg-gray-800 group-hover:bg-gray-700'
                              : 'bg-gray-100 group-hover:bg-gray-200'
                          )}
                        >
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Planos & Billing</div>
                          <div
                            className={cn(
                              'text-xs',
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            )}
                          >
                            Assinaturas e pagamentos
                          </div>
                        </div>
                      </button>
                    )}

                    <button
                      onClick={() => setShowUserMenu(false)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group',
                        isDarkMode
                          ? 'hover:bg-gray-700/50 text-gray-300'
                          : 'hover:bg-gray-100/50 text-gray-600'
                      )}
                    >
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                          isDarkMode
                            ? 'bg-gray-800 group-hover:bg-gray-700'
                            : 'bg-gray-100 group-hover:bg-gray-200'
                        )}
                      >
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Central de Ajuda</div>
                        <div
                          className={cn(
                            'text-xs',
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          )}
                        >
                          Suporte e documentação
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="p-2 border-t border-gray-200/50 dark:border-gray-700/50">
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
        </div>
      </div>

      {/* Sidebar de Todos os Orçamentos */}
      <AllQuotesSidebar
        isOpen={showQuotesSidebar}
        onClose={() => setShowQuotesSidebar(false)}
      />
    </header>
  )
}
