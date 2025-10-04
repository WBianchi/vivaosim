'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, X, RotateCcw, Save } from 'lucide-react'

interface ChatTheme {
  // Cores principais
  primaryColor: string
  secondaryColor: string
  accentColor: string
  
  // Chat Area
  chatBg: string
  messageBubbleSent: string
  messageBubbleReceived: string
  messageTextSent: string
  messageTextReceived: string
  
  // Side Chat
  sideChatBg: string
  sideChatHover: string
  sideChatActive: string
  
  // Top Chat
  topChatBg: string
  topChatText: string
  
  // Footer
  footerBg: string
  inputBg: string
  inputBorder: string
}

const defaultTheme: ChatTheme = {
  primaryColor: '#F97316',
  secondaryColor: '#1F2937',
  accentColor: '#3B82F6',
  chatBg: '#F3F4F6',
  messageBubbleSent: '#F97316',
  messageBubbleReceived: '#FFFFFF',
  messageTextSent: '#FFFFFF',
  messageTextReceived: '#1F2937',
  sideChatBg: '#FFFFFF',
  sideChatHover: '#F3F4F6',
  sideChatActive: '#FED7AA',
  topChatBg: '#FFFFFF',
  topChatText: '#1F2937',
  footerBg: '#FFFFFF',
  inputBg: '#F9FAFB',
  inputBorder: '#D1D5DB'
}

export const ChatCustomizer = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState<ChatTheme>(defaultTheme)
  const [activeSection, setActiveSection] = useState<'colors' | 'chat' | 'sidebar' | 'header'>('colors')

  // Carregar tema salvo do localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('chatTheme')
    if (savedTheme) {
      setTheme(JSON.parse(savedTheme))
    }
  }, [])

  // Aplicar tema
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const applyTheme = (newTheme: ChatTheme) => {
    const root = document.documentElement
    root.style.setProperty('--chat-primary', newTheme.primaryColor)
    root.style.setProperty('--chat-secondary', newTheme.secondaryColor)
    root.style.setProperty('--chat-accent', newTheme.accentColor)
    root.style.setProperty('--chat-bg', newTheme.chatBg)
    root.style.setProperty('--message-sent', newTheme.messageBubbleSent)
    root.style.setProperty('--message-received', newTheme.messageBubbleReceived)
    root.style.setProperty('--side-chat-bg', newTheme.sideChatBg)
    root.style.setProperty('--top-chat-bg', newTheme.topChatBg)
    root.style.setProperty('--footer-bg', newTheme.footerBg)
  }

  const saveTheme = () => {
    localStorage.setItem('chatTheme', JSON.stringify(theme))
    alert('Tema salvo com sucesso!')
  }

  const resetTheme = () => {
    setTheme(defaultTheme)
    localStorage.removeItem('chatTheme')
  }

  const updateColor = (key: keyof ChatTheme, value: string) => {
    setTheme(prev => ({ ...prev, [key]: value }))
  }

  const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-300 dark:border-gray-600"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
    </div>
  )

  return (
    <>
      {/* Botão Flutuante */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-6 p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-40"
      >
        <Palette className="w-6 h-6" />
      </motion.button>

      {/* Painel Lateral */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Painel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <Palette className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        Customizar Chat
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Personalize cores e aparência
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                  {[
                    { id: 'colors', label: 'Cores' },
                    { id: 'chat', label: 'Chat' },
                    { id: 'sidebar', label: 'Sidebar' },
                    { id: 'header', label: 'Header' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSection(tab.id as any)}
                      className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        activeSection === tab.id
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                {activeSection === 'colors' && (
                  <>
                    <ColorPicker
                      label="Cor Principal"
                      value={theme.primaryColor}
                      onChange={(v) => updateColor('primaryColor', v)}
                    />
                    <ColorPicker
                      label="Cor Secundária"
                      value={theme.secondaryColor}
                      onChange={(v) => updateColor('secondaryColor', v)}
                    />
                    <ColorPicker
                      label="Cor de Destaque"
                      value={theme.accentColor}
                      onChange={(v) => updateColor('accentColor', v)}
                    />
                  </>
                )}

                {activeSection === 'chat' && (
                  <>
                    <ColorPicker
                      label="Fundo do Chat"
                      value={theme.chatBg}
                      onChange={(v) => updateColor('chatBg', v)}
                    />
                    <ColorPicker
                      label="Mensagem Enviada"
                      value={theme.messageBubbleSent}
                      onChange={(v) => updateColor('messageBubbleSent', v)}
                    />
                    <ColorPicker
                      label="Mensagem Recebida"
                      value={theme.messageBubbleReceived}
                      onChange={(v) => updateColor('messageBubbleReceived', v)}
                    />
                    <ColorPicker
                      label="Texto Enviado"
                      value={theme.messageTextSent}
                      onChange={(v) => updateColor('messageTextSent', v)}
                    />
                    <ColorPicker
                      label="Texto Recebido"
                      value={theme.messageTextReceived}
                      onChange={(v) => updateColor('messageTextReceived', v)}
                    />
                  </>
                )}

                {activeSection === 'sidebar' && (
                  <>
                    <ColorPicker
                      label="Fundo Sidebar"
                      value={theme.sideChatBg}
                      onChange={(v) => updateColor('sideChatBg', v)}
                    />
                    <ColorPicker
                      label="Hover Sidebar"
                      value={theme.sideChatHover}
                      onChange={(v) => updateColor('sideChatHover', v)}
                    />
                    <ColorPicker
                      label="Chat Ativo"
                      value={theme.sideChatActive}
                      onChange={(v) => updateColor('sideChatActive', v)}
                    />
                  </>
                )}

                {activeSection === 'header' && (
                  <>
                    <ColorPicker
                      label="Fundo Header"
                      value={theme.topChatBg}
                      onChange={(v) => updateColor('topChatBg', v)}
                    />
                    <ColorPicker
                      label="Texto Header"
                      value={theme.topChatText}
                      onChange={(v) => updateColor('topChatText', v)}
                    />
                    <ColorPicker
                      label="Fundo Footer"
                      value={theme.footerBg}
                      onChange={(v) => updateColor('footerBg', v)}
                    />
                    <ColorPicker
                      label="Fundo Input"
                      value={theme.inputBg}
                      onChange={(v) => updateColor('inputBg', v)}
                    />
                    <ColorPicker
                      label="Borda Input"
                      value={theme.inputBorder}
                      onChange={(v) => updateColor('inputBorder', v)}
                    />
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <button
                  onClick={saveTheme}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Salvar Tema
                </button>
                <button
                  onClick={resetTheme}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restaurar Padrão
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
