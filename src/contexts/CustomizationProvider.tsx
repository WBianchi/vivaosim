'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface CustomizationSettings {
  topbar: {
    type?: 'gradient' | 'solid'
    gradientFrom?: string
    gradientTo?: string
    solidColor?: string
    showLogo: boolean
    showStats: boolean
    glassEffect: boolean
  }
  sidebar: {
    type?: 'gradient' | 'solid'
    gradientFrom?: string
    gradientTo?: string
    solidColor?: string
    coloredIcons: boolean
    showShortcuts: boolean
    compact: boolean
  }
  chat: {
    type?: 'gradient' | 'solid'
    gradientFrom?: string
    gradientTo?: string
    solidColor?: string
    roundedBubbles: boolean
    showAvatar: boolean
    backgroundImage: boolean
  }
  messages: {
    type?: 'gradient' | 'solid'
    gradientFrom?: string
    gradientTo?: string
    solidColor?: string
    roundedBubbles: boolean
    sentRight: boolean
    showTime: boolean
    animations: boolean
  }
}

const defaultSettings: CustomizationSettings = {
  topbar: {
    showLogo: true,
    showStats: true,
    glassEffect: true
  },
  sidebar: {
    coloredIcons: true,
    showShortcuts: true,
    compact: false
  },
  chat: {
    roundedBubbles: true,
    showAvatar: true,
    backgroundImage: false
  },
  messages: {
    roundedBubbles: true,
    sentRight: true,
    showTime: true,
    animations: true
  }
}

interface CustomizationContextType {
  settings: CustomizationSettings
  updateTopbar: (updates: Partial<CustomizationSettings['topbar']>) => void
  updateSidebar: (updates: Partial<CustomizationSettings['sidebar']>) => void
  updateChat: (updates: Partial<CustomizationSettings['chat']>) => void
  updateMessages: (updates: Partial<CustomizationSettings['messages']>) => void
  resetSettings: () => void
  getTopbarClasses: () => string
  getTopbarStyle: () => React.CSSProperties
  getSidebarClasses: () => string
  getSidebarStyle: () => React.CSSProperties
  getChatClasses: () => string
  getChatStyle: () => React.CSSProperties
  getMessageClasses: (isSent: boolean) => string
  getMessageStyle: (isSent: boolean) => React.CSSProperties
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined)

export function CustomizationProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<CustomizationSettings>(defaultSettings)

  // Carregar do localStorage ao montar
  useEffect(() => {
    const saved = localStorage.getItem('chat-customization')
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch (error) {
        console.error('Erro ao carregar customização:', error)
      }
    }
  }, [])

  // Salvar no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('chat-customization', JSON.stringify(settings))
  }, [settings])

  const updateTopbar = (updates: Partial<CustomizationSettings['topbar']>) => {
    setSettings(prev => ({
      ...prev,
      topbar: { ...prev.topbar, ...updates }
    }))
  }

  const updateSidebar = (updates: Partial<CustomizationSettings['sidebar']>) => {
    setSettings(prev => ({
      ...prev,
      sidebar: { ...prev.sidebar, ...updates }
    }))
  }

  const updateChat = (updates: Partial<CustomizationSettings['chat']>) => {
    setSettings(prev => ({
      ...prev,
      chat: { ...prev.chat, ...updates }
    }))
  }

  const updateMessages = (updates: Partial<CustomizationSettings['messages']>) => {
    setSettings(prev => ({
      ...prev,
      messages: { ...prev.messages, ...updates }
    }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.removeItem('chat-customization')
  }

  // Gerar classes CSS para Topbar
  const getTopbarClasses = () => {
    const { topbar } = settings
    let classes = 'h-16 border-b border-gray-200 dark:border-gray-700 flex items-center px-6 shadow-sm transition-all duration-300 relative z-50'

    // Aplicar cor de fundo padrão
    classes += ' bg-white dark:bg-gray-800'

    if (topbar.glassEffect) {
      classes += ' backdrop-blur-md bg-opacity-80 dark:bg-opacity-80'
    }

    return classes
  }

  // Gerar estilo inline para Topbar
  const getTopbarStyle = () => {
    const { topbar } = settings
    if (topbar.type === 'gradient' && topbar.gradientFrom && topbar.gradientTo) {
      return {
        background: `linear-gradient(135deg, ${topbar.gradientFrom}, ${topbar.gradientTo})`
      }
    } else if (topbar.type === 'solid' && topbar.solidColor) {
      return {
        backgroundColor: topbar.solidColor
      }
    }
    return {}
  }

  // Gerar classes CSS para Sidebar
  const getSidebarClasses = () => {
    const { sidebar } = settings
    let classes = 'h-full border-r border-gray-200 dark:border-gray-700 transition-all duration-300'

    // Aplicar cor de fundo padrão
    classes += ' bg-gray-50 dark:bg-gray-800'

    if (sidebar.compact) {
      classes += ' w-16'
    } else {
      classes += ' w-64'
    }

    return classes
  }

  // Gerar estilo inline para Sidebar
  const getSidebarStyle = () => {
    const { sidebar } = settings
    if (sidebar.type === 'gradient' && sidebar.gradientFrom && sidebar.gradientTo) {
      return {
        background: `linear-gradient(180deg, ${sidebar.gradientFrom}, ${sidebar.gradientTo})`
      }
    } else if (sidebar.type === 'solid' && sidebar.solidColor) {
      return {
        backgroundColor: sidebar.solidColor
      }
    }
    return {}
  }

  // Gerar classes CSS para Chat
  const getChatClasses = () => {
    const { chat } = settings
    let classes = 'flex-1 overflow-y-auto transition-all duration-300'

    // Aplicar cor de fundo padrão
    classes += ' bg-gray-50 dark:bg-gray-900'

    if (chat.backgroundImage) {
      classes += ' bg-[url("/chat-bg.png")] bg-cover bg-center'
    }

    return classes
  }

  // Gerar estilo inline para Chat
  const getChatStyle = () => {
    const { chat } = settings
    if (chat.type === 'gradient' && chat.gradientFrom && chat.gradientTo) {
      return {
        background: `linear-gradient(180deg, ${chat.gradientFrom}, ${chat.gradientTo})`
      }
    } else if (chat.type === 'solid' && chat.solidColor) {
      return {
        backgroundColor: chat.solidColor
      }
    }
    return {}
  }

  // Gerar classes CSS para Mensagens
  const getMessageClasses = (isSent: boolean) => {
    const { messages } = settings
    let classes = 'max-w-[70%] p-3 transition-all duration-300'

    if (messages.roundedBubbles) {
      classes += ' rounded-2xl'
    } else {
      classes += ' rounded-lg'
    }

    if (isSent) {
      // Aplicar cor padrão
      classes += ' bg-green-500 text-white'
      
      if (messages.sentRight) {
        classes += ' ml-auto'
      }
    } else {
      classes += ' bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
    }

    if (messages.animations) {
      classes += ' animate-in fade-in slide-in-from-bottom-2'
    }

    return classes
  }

  // Gerar estilo inline para Mensagens
  const getMessageStyle = (isSent: boolean) => {
    const { messages } = settings
    if (!isSent) return {}

    if (messages.type === 'gradient' && messages.gradientFrom && messages.gradientTo) {
      return {
        background: `linear-gradient(135deg, ${messages.gradientFrom}, ${messages.gradientTo})`,
        color: 'white'
      }
    } else if (messages.type === 'solid' && messages.solidColor) {
      return {
        backgroundColor: messages.solidColor,
        color: 'white'
      }
    }
    return {}
  }

  return (
    <CustomizationContext.Provider
      value={{
        settings,
        updateTopbar,
        updateSidebar,
        updateChat,
        updateMessages,
        resetSettings,
        getTopbarClasses,
        getTopbarStyle,
        getSidebarClasses,
        getSidebarStyle,
        getChatClasses,
        getChatStyle,
        getMessageClasses,
        getMessageStyle
      }}
    >
      {children}
    </CustomizationContext.Provider>
  )
}

export function useCustomization() {
  const context = useContext(CustomizationContext)
  if (!context) {
    throw new Error('useCustomization must be used within CustomizationProvider')
  }
  return context
}
