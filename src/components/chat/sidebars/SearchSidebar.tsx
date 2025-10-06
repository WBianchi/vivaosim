'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Search, MessageSquare, Calendar, User, File, Image as ImageIcon, Video, Music } from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'
import { motion } from 'framer-motion'

interface SearchSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatId?: string
}

export function SearchSidebar({ isOpen, onClose, chatId }: SearchSidebarProps) {
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<'all' | 'text' | 'media' | 'files'>('all')

  useEffect(() => {
    if (isOpen && searchTerm.length >= 2) {
      searchMessages()
    } else {
      setMessages([])
    }
  }, [isOpen, searchTerm, chatId])

  const searchMessages = async () => {
    if (!searchTerm || searchTerm.length < 2) return

    setLoading(true)
    try {
      const token = getAuthToken()
      if (!token) {
        console.log('⚠️ SearchSidebar: Token não encontrado')
        setLoading(false)
        return
      }

      const url = chatId 
        ? `/api/messages/search?chatId=${chatId}&query=${encodeURIComponent(searchTerm)}`
        : `/api/messages/search?query=${encodeURIComponent(searchTerm)}`

      console.log(`🔍 SearchSidebar: Buscando mensagens com "${searchTerm}"...`)
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      console.log('📨 SearchSidebar: Resposta da API:', data)
      
      if (data.messages) {
        setMessages(data.messages)
        console.log(`✅ SearchSidebar: ${data.messages.length} mensagens encontradas`)
      }
    } catch (error) {
      console.error('❌ SearchSidebar: Erro ao buscar mensagens:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMessages = messages.filter(msg => {
    if (searchType === 'all') return true
    if (searchType === 'text') return msg.type === 'chat'
    if (searchType === 'media') return ['image', 'video', 'audio'].includes(msg.type)
    if (searchType === 'files') return msg.type === 'document'
    return true
  })

  const getMessageTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      'chat': MessageSquare,
      'image': ImageIcon,
      'video': Video,
      'audio': Music,
      'document': File
    }
    return icons[type] || MessageSquare
  }

  const highlightText = (text: string, search: string) => {
    if (!search) return text
    const parts = text.split(new RegExp(`(${search})`, 'gi'))
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-gray-900 dark:text-white px-0.5 rounded">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    )
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return `Hoje às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Ontem às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + 
             ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <Dialog.Content 
          className="fixed right-0 top-0 h-full w-[480px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300"
          aria-describedby="search-description"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <Dialog.Title asChild>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Buscar na Conversa
                  </h2>
                </Dialog.Title>
                <Dialog.Description asChild>
                  <p id="search-description" className="text-xs text-gray-500 dark:text-gray-400">
                    {filteredMessages.length > 0 
                      ? `${filteredMessages.length} resultado(s) encontrado(s)` 
                      : 'Digite para buscar mensagens'}
                  </p>
                </Dialog.Description>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Search Input */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar mensagens..."
                autoFocus
                className="w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setSearchType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  searchType === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Tudo
              </button>
              <button
                onClick={() => setSearchType('text')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  searchType === 'text'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Texto
              </button>
              <button
                onClick={() => setSearchType('media')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  searchType === 'media'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Mídia
              </button>
              <button
                onClick={() => setSearchType('files')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  searchType === 'files'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Arquivos
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : !searchTerm || searchTerm.length < 2 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Digite pelo menos 2 caracteres para buscar
                </p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Nenhuma mensagem encontrada
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMessages.map((message) => {
                  const Icon = getMessageTypeIcon(message.type)
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          message.fromMe 
                            ? 'bg-green-100 dark:bg-green-900/30' 
                            : 'bg-blue-100 dark:bg-blue-900/30'
                        }`}>
                          <Icon className={`w-4 h-4 ${
                            message.fromMe 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-blue-600 dark:text-blue-400'
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              {message.fromMe ? 'Você' : message.contact?.name || 'Contato'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTimestamp(message.timestamp)}
                            </span>
                          </div>
                          
                          {message.body && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                              {highlightText(message.body, searchTerm)}
                            </p>
                          )}
                          
                          {message.caption && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                              {highlightText(message.caption, searchTerm)}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
