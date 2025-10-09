'use client'

import React, { useState } from 'react'
import { Message } from '@/types/chat'
import { Check, CheckCheck, MoreVertical, Reply, Forward, Languages, Sparkles } from 'lucide-react'

interface MessageTextProps {
  message: Message
  isFromMe: boolean
}

export const MessageText: React.FC<MessageTextProps> = ({ message, isFromMe }) => {
  const [showMenu, setShowMenu] = useState(false)

  // Detectar links no texto
  const linkifyText = (text: string) => {
    if (!text) return null
    
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = text.split(urlRegex)
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={`underline hover:text-blue-300 transition-colors ${
              isFromMe ? 'text-white' : 'text-blue-600 dark:text-blue-400'
            }`}
          >
            {part}
          </a>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  const getMessageStatus = () => {
    if (!isFromMe) return null
    
    switch (message.ack) {
      case 1: // Enviado
        return <Check className="w-4 h-4 text-white/70" />
      case 2: // Entregue
        return <CheckCheck className="w-4 h-4 text-white/70" />
      case 3: // Lido
        return <CheckCheck className="w-4 h-4 text-blue-300" />
      default:
        return <Check className="w-4 h-4 text-white/50" />
    }
  }

  return (
    <div className="group relative">
      {/* Botão de menu (3 pontinhos) */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 z-10"
      >
        <MoreVertical className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Menu dropdown */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-20" 
            onClick={() => setShowMenu(false)}
          />
          <div className={`absolute ${isFromMe ? 'right-0' : 'left-0'} top-8 z-30 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[180px]`}>
            <button
              onClick={() => {
                console.log('Responder mensagem:', message.id)
                setShowMenu(false)
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <Reply className="w-4 h-4" />
              Responder
            </button>
            <button
              onClick={() => {
                console.log('Encaminhar mensagem:', message.id)
                setShowMenu(false)
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <Forward className="w-4 h-4" />
              Encaminhar
            </button>
            <button
              onClick={() => {
                console.log('Traduzir mensagem:', message.id)
                setShowMenu(false)
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <Languages className="w-4 h-4" />
              Traduzir
            </button>
            <button
              onClick={() => {
                console.log('Responder com IA:', message.id)
                setShowMenu(false)
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-purple-600 dark:text-purple-400"
            >
              <Sparkles className="w-4 h-4" />
              Responder com IA
            </button>
          </div>
        </>
      )}

      <div className={`p-3 rounded-xl ${
        isFromMe 
          ? 'bg-blue-500 text-white' 
          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
      } shadow-md`}>
        {/* Mensagem citada (se houver) */}
        {message.quotedMessage && (
          <div className={`mb-2 pb-2 border-l-4 pl-3 ${
            isFromMe 
              ? 'border-white/30 bg-white/10' 
              : 'border-blue-500 bg-gray-50 dark:bg-gray-700/50'
          } rounded`}>
            <p className={`text-xs font-medium mb-1 ${
              isFromMe ? 'text-white/70' : 'text-blue-600 dark:text-blue-400'
            }`}>
              {message.quotedMessage.fromMe ? 'Você' : message.quotedMessage.senderName}
            </p>
            <p className={`text-xs ${
              isFromMe ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'
            } line-clamp-2`}>
              {message.quotedMessage.content || message.quotedMessage.body || ''}
            </p>
          </div>
        )}

        {/* Texto da mensagem */}
        <p className="text-sm whitespace-pre-wrap break-words">
          {linkifyText(message.content || message.body || '')}
        </p>

        {/* Footer: Timestamp + Status */}
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className={`text-xs ${
            isFromMe ? 'text-white/70' : 'text-gray-500'
          }`}>
            {new Date(message.timestamp).toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          {getMessageStatus()}
        </div>
      </div>
    </div>
  )
}
