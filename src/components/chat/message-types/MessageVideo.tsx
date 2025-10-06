'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Download, Video as VideoIcon } from 'lucide-react'
import { Message } from '@/types/chat'
import { MessageActions } from './MessageActions'

interface MessageVideoProps {
  message: Message
  isFromMe: boolean
}

export const MessageVideo: React.FC<MessageVideoProps> = ({ message, isFromMe }) => {
  const videoUrl = message.mediaUrl || message.content || message.body || ''

  return (
    <div className="group relative">
      <div className={`max-w-sm rounded-xl overflow-hidden ${isFromMe ? 'bg-blue-500' : 'bg-white dark:bg-gray-800'} shadow-lg`}>
        {/* Vídeo */}
        <div className="relative">
          <video
            src={videoUrl}
            controls
            className="w-full h-auto"
            preload="metadata"
          />

          {/* Botão Download */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.open(videoUrl, '_blank')}
              className="p-2 bg-black/50 hover:bg-black/70 rounded-lg backdrop-blur-sm"
            >
              <Download className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Legenda */}
        {message.caption && (
          <div className={`p-3 ${isFromMe ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
            <p className="text-sm whitespace-pre-wrap">{message.caption}</p>
          </div>
        )}

        {/* Timestamp */}
        <div className={`px-3 pb-2 text-xs ${isFromMe ? 'text-white/70' : 'text-gray-500'}`}>
          {new Date(message.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Ações */}
      <div className="absolute -top-2 -right-2">
        <MessageActions message={message} isFromMe={isFromMe} />
      </div>
    </div>
  )
}
