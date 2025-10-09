'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Forward, SmilePlus, Bot, Languages, MoreVertical, Reply, Trash2 } from 'lucide-react'
import { Message } from '@/types/chat'

interface MessageActionsProps {
  message: Message
  isFromMe: boolean
  onReply?: (message: Message) => void
  onAIResponse?: (messageText: string) => void
  onTranslate?: (messageText: string) => void
  onForward?: (messageId: string) => void
  onDelete?: (messageId: string) => void
}

export const MessageActions: React.FC<MessageActionsProps> = ({ 
  message, 
  isFromMe,
  onReply,
  onAIResponse,
  onTranslate,
  onForward,
  onDelete
}) => {
  const [showActions, setShowActions] = useState(false)
  const [showReactions, setShowReactions] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const reactions = ['👍', '❤️', '😂', '😮', '😢', '🙏']

  const handleReply = () => {
    if (onReply) {
      onReply(message)
    }
    setShowActions(false)
  }

  const handleForwardClick = () => {
    if (onForward) {
      onForward(message.id)
    }
    setShowActions(false)
  }

  const handleReaction = (emoji: string) => {
    console.log('😀 Reagir com:', emoji, 'mensagem:', message.id)
    // TODO: Implementar reação via API
    setShowReactions(false)
  }

  const handleAIResponse = () => {
    if (onAIResponse && message.body) {
      onAIResponse(message.body)
    }
    setShowActions(false)
  }

  const handleTranslateClick = () => {
    if (onTranslate && message.body) {
      onTranslate(message.body)
    }
    setShowActions(false)
  }

  const handleDelete = async () => {
    if (!confirm('Deseja realmente excluir esta mensagem?')) return

    setDeleting(true)
    try {
      const response = await fetch('/api/whatsapp/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: message.id,
          chatId: message.chatId
        })
      })

      if (response.ok) {
        if (onDelete) {
          onDelete(message.id)
        }
        alert('✅ Mensagem excluída!')
      } else {
        alert('❌ Erro ao excluir mensagem')
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
      alert('❌ Erro ao excluir mensagem')
    } finally {
      setDeleting(false)
      setShowActions(false)
    }
  }

  return (
    <div className="relative">
      {/* Botão de Ações */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowActions(!showActions)}
        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
      >
        <MoreVertical className="w-4 h-4 text-gray-500" />
      </motion.button>

      {/* Menu de Ações */}
      {showActions && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`absolute ${isFromMe ? 'right-0' : 'left-0'} mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-[9999] min-w-[200px]`}
        >
          {/* Responder - Sempre visível */}
          <button
            onClick={handleReply}
            className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Reply className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Responder</span>
          </button>

          {/* Encaminhar - Sempre visível */}
          <button
            onClick={handleForwardClick}
            className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Forward className="w-4 h-4 text-indigo-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Encaminhar</span>
          </button>

          {/* Traduzir - Sempre visível */}
          <button
            onClick={handleTranslateClick}
            className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Languages className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Traduzir</span>
          </button>

          {/* Responder com IA - Apenas para mensagens RECEBIDAS */}
          {!isFromMe && (
            <button
              onClick={handleAIResponse}
              className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Bot className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Responder com IA</span>
            </button>
          )}

          {/* Excluir - Apenas para mensagens ENVIADAS */}
          {isFromMe && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600 dark:text-red-400">
                {deleting ? 'Excluindo...' : 'Excluir'}
              </span>
            </button>
          )}
        </motion.div>
      )}

      {/* Menu de Reações */}
      {showReactions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute ${isFromMe ? 'right-0' : 'left-0'} mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-50 flex gap-1`}
        >
          {reactions.map((emoji) => (
            <motion.button
              key={emoji}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleReaction(emoji)}
              className="text-2xl p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {emoji}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  )
}
