'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Forward, SmilePlus, Bot, Languages, MoreVertical } from 'lucide-react'
import { Message } from '@/types/chat'

interface MessageActionsProps {
  message: Message
  isFromMe: boolean
}

export const MessageActions: React.FC<MessageActionsProps> = ({ message, isFromMe }) => {
  const [showActions, setShowActions] = useState(false)
  const [showReactions, setShowReactions] = useState(false)

  const reactions = ['👍', '❤️', '😂', '😮', '😢', '🙏']

  const handleForward = () => {
    console.log('🔄 Encaminhar mensagem:', message.id)
    // TODO: Implementar encaminhamento
  }

  const handleReaction = (emoji: string) => {
    console.log('😀 Reagir com:', emoji, 'mensagem:', message.id)
    // TODO: Implementar reação
    setShowReactions(false)
  }

  const handleAIResponse = () => {
    console.log('🤖 Responder com IA:', message.id)
    // TODO: Implementar resposta IA
  }

  const handleTranslate = () => {
    console.log('🌐 Traduzir mensagem:', message.id)
    // TODO: Implementar tradução
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
          className={`absolute ${isFromMe ? 'right-0' : 'left-0'} mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 min-w-[180px]`}
        >
          {/* Encaminhar */}
          <button
            onClick={handleForward}
            className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Forward className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Encaminhar</span>
          </button>

          {/* Reação */}
          <button
            onClick={() => setShowReactions(!showReactions)}
            className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <SmilePlus className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Reagir</span>
          </button>

          {/* Responder com IA */}
          {!isFromMe && (
            <button
              onClick={handleAIResponse}
              className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Bot className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Responder com IA</span>
            </button>
          )}

          {/* Traduzir */}
          <button
            onClick={handleTranslate}
            className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Languages className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Traduzir</span>
          </button>
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
