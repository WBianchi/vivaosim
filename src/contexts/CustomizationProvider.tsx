'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface CustomizationSettings {
  topbar: {
    gradient?: { from: string; to: string }
    color?: string
    showLogo: boolean
    showStats: boolean
    glassEffect: boolean
  }
  sidebar: {
    gradient?: { from: string; to: string }
    color?: string
    coloredIcons: boolean
    showShortcuts: boolean
    compact: boolean
  }
  chat: {
    gradient?: { from: string; to: string }
    color?: string
    roundedBubbles: boolean
    showAvatar: boolean
    backgroundImage: boolean
  }
  messages: {
    gradient?: { from: string; to: string }
    color?: string
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
  getSidebarClasses: () => string
  getChatClasses: () => string
  getMessageClasses: (isSent: boolean) => string
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
    let classes = 'h-16 border-b border-gray-200 dark:border-gray-700 flex items-center px-6 shadow-sm transition-all duration-300'

    if (topbar.gradient) {
      classes += ` bg-gradient-to-r ${topbar.gradient.from} ${topbar.gradient.to}`
    } else if (topbar.color) {
      classes += ` bg-${topbar.color}-500 dark:bg-${topbar.color}-600`
    } else {
      classes += ' bg-white dark:bg-gray-800'
    }

    if (topbar.glassEffect) {
      classes += ' backdrop-blur-md bg-opacity-80 dark:bg-opacity-80'
    }

    return classes
  }

  // Gerar classes CSS para Sidebar
  const getSidebarClasses = () => {
    const { sidebar } = settings
    let classes = 'h-full border-r border-gray-200 dark:border-gray-700 transition-all duration-300'

    if (sidebar.gradient) {
      classes += ` bg-gradient-to-b ${sidebar.gradient.from} ${sidebar.gradient.to}`
    } else if (sidebar.color) {
      classes += ` bg-${sidebar.color}-50 dark:bg-${sidebar.color}-900/20`
    } else {
      classes += ' bg-gray-50 dark:bg-gray-800'
    }

    if (sidebar.compact) {
      classes += ' w-16'
    } else {
      classes += ' w-64'
    }

    return classes
  }

  // Gerar classes CSS para Chat
  const getChatClasses = () => {
    const { chat } = settings
    let classes = 'flex-1 overflow-y-auto transition-all duration-300'

    if (chat.gradient) {
      classes += ` bg-gradient-to-b ${chat.gradient.from} ${chat.gradient.to}`
    } else if (chat.color) {
      classes += ` bg-${chat.color}-50 dark:bg-${chat.color}-900/10`
    } else {
      classes += ' bg-gray-50 dark:bg-gray-900'
    }

    if (chat.backgroundImage) {
      classes += ' bg-[url("/chat-bg.png")] bg-cover bg-center'
    }

    return classes
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
      if (messages.gradient) {
        classes += ` bg-gradient-to-r ${messages.gradient.from} ${messages.gradient.to} text-white`
      } else if (messages.color) {
        classes += ` bg-${messages.color}-500 text-white`
      } else {
        classes += ' bg-green-500 text-white'
      }
      
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
        getSidebarClasses,
        getChatClasses,
        getMessageClasses
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
