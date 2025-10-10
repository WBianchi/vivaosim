'use client'

import React from 'react'
import { Message } from '@/types/chat'
import { Check, CheckCheck } from 'lucide-react'
import { useCustomization } from '@/contexts/CustomizationProvider'

interface MessageTextProps {
  message: Message
  isFromMe: boolean
}

export const MessageText: React.FC<MessageTextProps> = ({ message, isFromMe }) => {
  const { getMessageStyle } = useCustomization()

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
    <div className="relative">
      <div 
        className={`p-3 rounded-xl ${
          isFromMe 
            ? 'bg-blue-500 text-white' 
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
        } shadow-md`}
        style={getMessageStyle(isFromMe)}
      >
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
