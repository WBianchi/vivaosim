'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Paperclip, Smile, Mic, Camera, Image, FileText, MoreVertical, Reply, Forward, Copy, Trash2, Star, Edit, Check, X, Sparkles, Code, Hash, AtSign, Bold, Italic, Underline, Link } from 'lucide-react'

interface ChatAreaProps {
  selectedChat: any
  isTyping: boolean
  onTypingChange: (typing: boolean) => void
}

const mockMessages = [
  {
    id: 'msg-001',
    sender: 'Ana Silva',
    content: 'Olá! Vi que você precisa de ajuda com o sistema de atendimento.',
    timestamp: '10:30',
    isMe: false,
    read: true,
    edited: false,
    starred: false,
    reactions: ['👍', '❤️']
  },
  {
    id: 'msg-002',
    sender: 'Você',
    content: 'Sim! Estou com dúvidas sobre como configurar os fluxos automatizados.',
    timestamp: '10:32',
    isMe: true,
    read: true,
    edited: false,
    starred: false,
    reactions: []
  },
  {
    id: 'msg-003',
    sender: 'Ana Silva',
    content: 'Claro! Vou te ajudar com isso. Primeiro, você precisa acessar a seção de Fluxogramas no dashboard.',
    timestamp: '10:33',
    isMe: false,
    read: true,
    edited: true,
    starred: true,
    reactions: ['✅']
  }
]

export const ChatArea: React.FC<ChatAreaProps> = ({
  selectedChat, isTyping, onTypingChange
}) => {
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<any>(null)
  const [showFormatting, setShowFormatting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: `msg-${Date.now()}`,
        sender: 'Você',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        read: false,
        edited: false,
        starred: false,
        reactions: [],
        replyTo: replyingTo
      }
      setMessages([...messages, message])
      setNewMessage('')
      setReplyingTo(null)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <AtSign className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Bem-vindo ao Chat Interno
          </h3>
          <p className="text-gray-500 max-w-md">
            Selecione uma conversa para começar a se comunicar com sua equipe e clientes
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${message.isMe ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div className={`max-w-2xl ${message.isMe ? 'order-2' : ''}`}>
                {/* Reply indicator */}
                {message.replyTo && (
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 mb-2 border-l-4 border-blue-500">
                    <p className="text-xs text-gray-500 mb-1">Respondendo a {message.replyTo.sender}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                      {message.replyTo.content}
                    </p>
                  </div>
                )}

                <div className={`group relative ${message.isMe ? 'text-right' : ''}`}>
                  <div className={`inline-block px-4 py-3 rounded-2xl ${
                    message.isMe 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  }`}>
                    {!message.isMe && (
                      <p className="text-xs font-semibold mb-1 opacity-80">{message.sender}</p>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <div className={`flex items-center gap-2 mt-2 text-xs ${
                      message.isMe ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <span>{message.timestamp}</span>
                      {message.edited && <span>(editado)</span>}
                      {message.starred && <Star className="w-3 h-3 fill-current" />}
                      {message.isMe && message.read && (
                        <div className="flex">
                          <Check className="w-3 h-3" />
                          <Check className="w-3 h-3 -ml-1" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message actions */}
                  <div className={`absolute top-0 ${message.isMe ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2`}>
                    <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                      <Reply className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                      <Forward className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                      <Star className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                      <MoreVertical className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  {/* Reactions */}
                  {message.reactions.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {message.reactions.map((reaction, i) => (
                        <span key={i} className="text-sm bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5">
                          {reaction}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-500 text-sm"
          >
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span>{selectedChat.name} está digitando...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Reply indicator */}
      {replyingTo && (
        <div className="px-6 py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Reply className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-blue-600">Respondendo a {replyingTo.sender}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{replyingTo.content}</p>
              </div>
            </div>
            <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded">
              <X className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
        {/* Formatting toolbar */}
        {showFormatting && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700"
          >
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Bold className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Italic className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Underline className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Link className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Code className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Hash className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <AtSign className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </motion.div>
        )}

        <div className="flex items-end gap-3">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFormatting(!showFormatting)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Bold className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Image className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Camera className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEmoji(!showEmoji)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>

          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value)
                onTypingChange(e.target.value.length > 0)
              }}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-2 bottom-2 p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg"
            >
              <Sparkles className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Mic className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Emoji picker placeholder */}
        {showEmoji && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-20 left-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="grid grid-cols-8 gap-2">
              {['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😗'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setNewMessage(prev => prev + emoji)}
                  className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
