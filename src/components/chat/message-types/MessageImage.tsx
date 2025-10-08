'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Eye, Image as ImageIcon } from 'lucide-react'
import { Message } from '@/types/chat'
import { MessageActions } from './MessageActions'

interface MessageImageProps {
  message: Message
  isFromMe: boolean
}

export const MessageImage: React.FC<MessageImageProps> = ({ message, isFromMe }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showFullImage, setShowFullImage] = useState(false)

  const imageUrl = message.mediaUrl || message.content || message.body || ''
  
  // 🐛 DEBUG
  console.log('📸 [MessageImage] Renderizando:', {
    id: message.id,
    imageUrl,
    hasMediaUrl: !!message.mediaUrl,
    type: message.type
  })

  return (
    <div className="group relative">
      <div className={`max-w-sm rounded-xl overflow-hidden ${isFromMe ? 'bg-blue-500' : 'bg-white dark:bg-gray-800'} shadow-lg`}>
        {/* Imagem */}
        <div className="relative">
          {!imageLoaded && (
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          <img
            src={imageUrl}
            alt="Imagem"
            className={`w-full h-auto cursor-pointer transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onClick={() => setShowFullImage(true)}
          />

          {/* Botões sobre a imagem */}
          {imageLoaded && (
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowFullImage(true)}
                className="p-2 bg-black/50 hover:bg-black/70 rounded-lg backdrop-blur-sm"
              >
                <Eye className="w-4 h-4 text-white" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => window.open(imageUrl, '_blank')}
                className="p-2 bg-black/50 hover:bg-black/70 rounded-lg backdrop-blur-sm"
              >
                <Download className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          )}
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

      {/* Modal Imagem Completa */}
      {showFullImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowFullImage(false)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        >
          <img src={imageUrl} alt="Imagem completa" className="max-w-full max-h-full object-contain" />
        </motion.div>
      )}
    </div>
  )
}
