'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Paperclip, Smile, Mic, Camera, Image, FileText, MoreVertical, Reply, Forward, Copy, Trash2, Star, Edit, Check, X, Sparkles, Code, Hash, AtSign, Bold, Italic, Underline, Link, Video, Music, Download } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ChatAreaProps {
  selectedChat: any
  isTyping: boolean
  onTypingChange: (typing: boolean) => void
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  selectedChat, isTyping, onTypingChange
}) => {
  const { user } = useAuth()
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<any>(null)
  const [showFormatting, setShowFormatting] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const [showAudioModal, setShowAudioModal] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Buscar mensagens quando selecionar um chat
  useEffect(() => {
    if (selectedChat?.id && user?.id) {
      fetchMessages()
      
      // Polling a cada 3 segundos para atualizar mensagens
      const interval = setInterval(fetchMessages, 3000)
      return () => clearInterval(interval)
    } else {
      setMessages([])
    }
  }, [selectedChat?.id, user?.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    if (!selectedChat?.id || !user?.id) return
    
    try {
      const response = await fetch(`/api/internal-chats/${selectedChat.id}/messages`, {
        headers: {
          'x-user-id': user.id
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('❌ Erro ao buscar mensagens:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat?.id || !user?.id) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/internal-chats/${selectedChat.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          content: newMessage,
          messageType: 'TEXT',
          replyToId: replyingTo?.id
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessages([...messages, data.message])
        setNewMessage('')
        setReplyingTo(null)
        onTypingChange(false)
      }
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = async (file: File, type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT') => {
    if (!selectedChat?.id || !user?.id || !file) return
    
    setLoading(true)
    try {
      // TODO: Implementar upload real para S3/storage
      // Por enquanto, simular URL
      const fakeUrl = URL.createObjectURL(file)
      
      const response = await fetch(`/api/internal-chats/${selectedChat.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          content: `[${type}] ${file.name}`,
          messageType: type,
          mediaUrl: fakeUrl,
          mediaFilename: file.name,
          mediaMimeType: file.type,
          mediaSize: file.size
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessages([...messages, data.message])
      }
    } catch (error) {
      console.error('❌ Erro ao enviar arquivo:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file, 'IMAGE')
  }

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file, 'VIDEO')
  }

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file, 'AUDIO')
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file, 'DOCUMENT')
  }

  const startRecording = () => {
    setShowAudioModal(true)
    setIsRecording(true)
    setRecordingTime(0)
    
    // Iniciar contador
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
    
    console.log('🎙️ Iniciando gravação...')
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
    }
    console.log('⏹️ Parando gravação...')
  }

  const cancelRecording = () => {
    setIsRecording(false)
    setShowAudioModal(false)
    setRecordingTime(0)
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
    }
  }

  const sendRecording = async () => {
    // TODO: Enviar áudio gravado
    setIsRecording(false)
    setShowAudioModal(false)
    setRecordingTime(0)
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
    }
    console.log('📤 Enviando áudio...')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAIResponse = async () => {
    if (!newMessage.trim() || !selectedChat?.id || !user?.id) return
    
    setLoading(true)
    try {
      // Enviar pergunta do usuário
      const userMsgResponse = await fetch(`/api/internal-chats/${selectedChat.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          content: newMessage,
          messageType: 'TEXT'
        })
      })
      
      if (userMsgResponse.ok) {
        const userData = await userMsgResponse.json()
        setMessages([...messages, userData.message])
        
        // Gerar resposta com IA
        const aiResponse = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: newMessage,
            context: messages.slice(-5).map(m => ({ role: m.senderId === user.id ? 'user' : 'assistant', content: m.content }))
          })
        })
        
        if (aiResponse.ok) {
          const aiData = await aiResponse.json()
          
          // Enviar resposta da IA como mensagem
          const aiMsgResponse = await fetch(`/api/internal-chats/${selectedChat.id}/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': user.id
            },
            body: JSON.stringify({
              content: `🤖 ${aiData.response}`,
              messageType: 'TEXT'
            })
          })
          
          if (aiMsgResponse.ok) {
            const aiMsgData = await aiMsgResponse.json()
            setMessages(prev => [...prev, aiMsgData.message])
          }
        }
        
        setNewMessage('')
        onTypingChange(false)
      }
    } catch (error) {
      console.error('❌ Erro ao gerar resposta IA:', error)
    } finally {
      setLoading(false)
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
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 h-full max-h-full overflow-hidden">
      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div className={`max-w-2xl ${message.senderId === user?.id ? 'order-2' : ''}`}>
                {/* Reply indicator */}
                {message.replyToId && (
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 mb-2 border-l-4 border-blue-500">
                    <p className="text-xs text-gray-500 mb-1">Respondendo...</p>
                  </div>
                )}

                <div className={`group relative ${message.senderId === user?.id ? 'text-right' : ''}`}>
                  <div className={`inline-block rounded-2xl ${
                    message.senderId === user?.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  } ${message.messageType !== 'TEXT' ? 'p-2' : 'px-4 py-3'}`}>
                    {message.senderId !== user?.id && message.sender && (
                      <p className="text-xs font-semibold mb-1 opacity-80 px-2">{message.sender.name}</p>
                    )}
                    
                    {/* Renderizar mídia */}
                    {message.messageType === 'IMAGE' && message.mediaUrl && (
                      <div className="max-w-sm">
                        <img 
                          src={message.mediaUrl} 
                          alt={message.mediaFilename || 'Imagem'}
                          className="rounded-lg w-full cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(message.mediaUrl, '_blank')}
                        />
                        {message.content && !message.content.startsWith('[IMAGE]') && (
                          <p className="mt-2 px-2 whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                    )}
                    
                    {message.messageType === 'VIDEO' && message.mediaUrl && (
                      <div className="max-w-sm">
                        <video 
                          src={message.mediaUrl} 
                          controls
                          className="rounded-lg w-full"
                        />
                        {message.content && !message.content.startsWith('[VIDEO]') && (
                          <p className="mt-2 px-2 whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                    )}
                    
                    {message.messageType === 'AUDIO' && message.mediaUrl && (
                      <div className="min-w-[300px]">
                        <audio 
                          src={message.mediaUrl} 
                          controls
                          className="w-full"
                        />
                        {message.mediaFilename && (
                          <p className="text-xs mt-1 px-2 opacity-70">{message.mediaFilename}</p>
                        )}
                      </div>
                    )}
                    
                    {message.messageType === 'DOCUMENT' && (
                      <a 
                        href={message.mediaUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors min-w-[250px]"
                      >
                        <FileText className={`w-8 h-8 ${message.senderId === user?.id ? 'text-white' : 'text-blue-500'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate text-sm">{message.mediaFilename || 'Documento'}</p>
                          {message.mediaSize && (
                            <p className="text-xs opacity-70">{(message.mediaSize / 1024).toFixed(2)} KB</p>
                          )}
                        </div>
                        <Download className="w-4 h-4 flex-shrink-0" />
                      </a>
                    )}
                    
                    {/* Mensagem de texto normal */}
                    {message.messageType === 'TEXT' && (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                    <div className={`flex items-center gap-2 mt-2 text-xs ${message.messageType !== 'TEXT' ? 'px-2' : ''} ${
                      message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <span>
                        {message.createdAt ? format(new Date(message.createdAt), 'HH:mm', { locale: ptBR }) : ''}
                      </span>
                      {message.edited && <span>(editado)</span>}
                      {message.senderId === user?.id && message.status === 'READ' && (
                        <div className="flex">
                          <Check className="w-3 h-3" />
                          <Check className="w-3 h-3 -ml-1" />
                        </div>
                      )}
                      {message.senderId === user?.id && message.status === 'SENT' && (
                        <Check className="w-3 h-3" />
                      )}
                    </div>
                  </div>

                  {/* Message actions */}
                  <div className={`absolute top-0 ${message.senderId === user?.id ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2`}>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setReplyingTo(message)}
                      className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Responder"
                    >
                      <Reply className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
                      title="Favoritar"
                    >
                      <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </motion.button>
                  </div>

                  {/* Reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {message.reactions.map((reaction: string, i: number) => (
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

      {/* Hidden file inputs */}
      <input 
        ref={fileInputRef} 
        type="file" 
        className="hidden" 
        onChange={handleFileSelect}
        accept=".pdf,.doc,.docx,.txt,.zip"
      />
      <input 
        ref={imageInputRef} 
        type="file" 
        className="hidden" 
        onChange={handleImageSelect}
        accept="image/*"
      />
      <input 
        ref={videoInputRef} 
        type="file" 
        className="hidden" 
        onChange={handleVideoSelect}
        accept="video/*"
      />
      <input 
        ref={audioInputRef} 
        type="file" 
        className="hidden" 
        onChange={handleAudioSelect}
        accept="audio/*"
      />

      {/* Input area */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        {/* Recording indicator */}
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                Gravando áudio...
              </span>
            </div>
            <div className="flex-1 flex items-center gap-1">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-red-500 rounded-full"
                  animate={{
                    height: [4, 16, 4]
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.05
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-red-600 dark:text-red-400 font-mono">
              00:00
            </span>
          </motion.div>
        )}
        
        <div className="flex items-center gap-2">
          {/* Attach Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05, rotate: 45 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className={`p-3 rounded-xl transition-all flex items-center justify-center ${
                showAttachMenu 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Paperclip className="w-5 h-5" />
            </motion.button>

            {/* Attach options menu */}
            <AnimatePresence>
              {showAttachMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-2 min-w-[200px]"
                >
                  <button
                    onClick={() => { imageInputRef.current?.click(); setShowAttachMenu(false) }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-left transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Image className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Imagem</p>
                      <p className="text-xs text-gray-500">JPG, PNG, GIF</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { videoInputRef.current?.click(); setShowAttachMenu(false) }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-left transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Vídeo</p>
                      <p className="text-xs text-gray-500">MP4, MOV, AVI</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { audioInputRef.current?.click(); setShowAttachMenu(false) }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-left transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <Music className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Áudio</p>
                      <p className="text-xs text-gray-500">MP3, WAV, M4A</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { fileInputRef.current?.click(); setShowAttachMenu(false) }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-left transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Documento</p>
                      <p className="text-xs text-gray-500">PDF, DOC, TXT</p>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input field */}
          <div className="flex-1 relative bg-gray-50 dark:bg-gray-700 rounded-2xl border-2 border-transparent focus-within:border-blue-500 transition-all">
            <textarea
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value)
                onTypingChange(e.target.value.length > 0)
              }}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="w-full px-4 py-3 pr-12 bg-transparent border-none rounded-2xl resize-none focus:ring-0 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />

            {/* AI Button */}
            {newMessage.trim() && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAIResponse}
                disabled={loading}
                className="absolute right-3 bottom-3 p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                title="Gerar resposta com IA"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </motion.button>
            )}
          </div>

          {/* Emoji Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEmoji(!showEmoji)}
            className={`p-3 rounded-xl transition-all flex items-center justify-center ${
              showEmoji 
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            <Smile className="w-5 h-5" />
          </motion.button>

          {/* Voice/Send Button */}
          {newMessage.trim() ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={loading}
              className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg disabled:opacity-50 transition-all flex items-center justify-center min-w-[48px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startRecording}
              className={`p-3 rounded-xl transition-all flex items-center justify-center min-w-[48px] ${
                isRecording
                  ? 'bg-red-500 text-white shadow-lg animate-pulse'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Mic className="w-5 h-5" />
            </motion.button>
          )}
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

      {/* Audio Recording Modal */}
      <AnimatePresence>
        {showAudioModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={cancelRecording}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 min-w-[400px]"
            >
              <div className="text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                  className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl"
                >
                  <Mic className="w-16 h-16 text-white" />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Gravando Áudio
                </h3>
                
                <div className="text-5xl font-mono font-bold text-red-500 mb-8">
                  {formatTime(recordingTime)}
                </div>

                {/* Waveform visual */}
                <div className="flex items-center justify-center gap-1 mb-8 h-16">
                  {[...Array(30)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-red-500 rounded-full"
                      animate={{
                        height: [8, 48, 8]
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.05
                      }}
                    />
                  ))}
                </div>

                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={cancelRecording}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold transition-all"
                  >
                    ❌ Cancelar
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendRecording}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg transition-all"
                  >
                    ✅ Enviar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
