'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'
import { usePathname } from 'next/navigation'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const ChatWidget = () => {
  const pathname = usePathname()
  
  // Páginas onde o ChatWidget NÃO deve aparecer
  const excludedPages = [
    '/admin',
    '/dashboard', 
    '/chat',
    '/profile',
    '/settings',
    '/crm',
    '/events',
    '/leads'
  ]

  // Verificar se a página atual deve mostrar o ChatWidget
  const shouldShow = !excludedPages.some(page => pathname.startsWith(page))
  
  // Se não deve mostrar, retorna null
  if (!shouldShow) return null

  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! 👋 Sou o assistente virtual do Viva o Sim. Como posso ajudar você hoje?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isDarkMode } = useTheme()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        'Entendi! Vou te ajudar com isso. O Viva o Sim oferece soluções completas para gestão de eventos.',
        'Ótima pergunta! Nosso CRM é perfeito para organizar seus clientes e aumentar suas vendas.',
        'Posso te mostrar como nossa automação pode economizar horas do seu tempo diariamente.',
        'Que tal agendar uma demonstração gratuita? Posso te mostrar todas as funcionalidades na prática.',
        'Nossos planos são flexíveis e se adaptam ao tamanho do seu negócio. Quer saber mais?'
      ]

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-orange-500/25 transition-all duration-300"
            style={{
              boxShadow: '0 8px 32px rgba(249, 115, 22, 0.4), 0 0 0 0 rgba(249, 115, 22, 0.7)',
              animation: 'pulse 2s infinite'
            }}
          >
            <MessageCircle className="w-7 h-7" />
            
            {/* Notification Dot */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
          >
            <div className={`rounded-2xl overflow-hidden ${
              isDarkMode ? 'bg-slate-800' : 'bg-white'
            } border ${
              isDarkMode ? 'border-slate-700' : 'border-gray-200'
            } shadow-2xl backdrop-blur-xl`}
            style={{
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              height: isMinimized ? 'auto' : '500px'
            }}>
              
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200/20 bg-gradient-to-r from-orange-500 to-red-500">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                  >
                    <Bot className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-white">Assistente Viva o Sim</h3>
                    <p className="text-xs text-white/80">Online agora</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    {isMinimized ? 
                      <Maximize2 className="w-4 h-4 text-white" /> : 
                      <Minimize2 className="w-4 h-4 text-white" />
                    }
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages */}
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-80">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-2 max-w-[80%] ${
                          msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.sender === 'user' 
                              ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                              : isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
                          }`}>
                            {msg.sender === 'user' ? 
                              <User className="w-4 h-4 text-white" /> : 
                              <Bot className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                            }
                          </div>
                          
                          <div className={`rounded-2xl px-4 py-2 ${
                            msg.sender === 'user'
                              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                              : isDarkMode ? 'bg-slate-700 text-gray-200' : 'bg-gray-100 text-gray-800'
                          }`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${
                              msg.sender === 'user' 
                                ? 'text-white/70' 
                                : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {formatTime(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="flex items-start space-x-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
                          }`}>
                            <Bot className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                          </div>
                          <div className={`rounded-2xl px-4 py-2 ${
                            isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
                          }`}>
                            <div className="flex space-x-1">
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={i}
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                  className={`w-2 h-2 rounded-full ${
                                    isDarkMode ? 'bg-gray-400' : 'bg-gray-500'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className={`p-4 border-t ${
                    isDarkMode ? 'border-slate-700' : 'border-gray-200'
                  }`}>
                    <div className={`flex items-center space-x-2 p-2 rounded-xl border ${
                      isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Digite sua mensagem..."
                        className={`flex-1 bg-transparent ${
                          isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                        } focus:outline-none text-sm`}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="p-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        <Send className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 8px 32px rgba(249, 115, 22, 0.4), 0 0 0 0 rgba(249, 115, 22, 0.7);
          }
          70% {
            box-shadow: 0 8px 32px rgba(249, 115, 22, 0.4), 0 0 0 10px rgba(249, 115, 22, 0);
          }
          100% {
            box-shadow: 0 8px 32px rgba(249, 115, 22, 0.4), 0 0 0 0 rgba(249, 115, 22, 0);
          }
        }
      `}</style>
    </>
  )
}

export default ChatWidget
