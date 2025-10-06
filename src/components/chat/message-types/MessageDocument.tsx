'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, File } from 'lucide-react'
import { Message } from '@/types/chat'
import { MessageActions } from './MessageActions'

interface MessageDocumentProps {
  message: Message
  isFromMe: boolean
}

export const MessageDocument: React.FC<MessageDocumentProps> = ({ message, isFromMe }) => {
  const documentUrl = message.mediaUrl || message.content || message.body || ''
  const fileName = message.mediaFilename || message.fileName || 'documento.pdf'
  const fileSize = message.mediaSize ? `${(message.mediaSize / 1024 / 1024).toFixed(2)} MB` : 'Tamanho desconhecido'

  const getFileIcon = () => {
    if (fileName.endsWith('.pdf')) return <FileText className="w-8 h-8" />
    return <File className="w-8 h-8" />
  }

  return (
    <div className="group relative">
      <div className={`flex items-center gap-3 p-4 rounded-xl ${isFromMe ? 'bg-blue-500' : 'bg-white dark:bg-gray-800'} shadow-lg min-w-[300px] max-w-sm`}>
        {/* Ícone do Arquivo */}
        <div className={`p-3 rounded-xl ${isFromMe ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
          <div className={isFromMe ? 'text-white' : 'text-gray-700 dark:text-gray-300'}>
            {getFileIcon()}
          </div>
        </div>

        {/* Info do Arquivo */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isFromMe ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
            {fileName}
          </p>
          <p className={`text-xs ${isFromMe ? 'text-white/70' : 'text-gray-500'}`}>
            {fileSize}
          </p>
        </div>

        {/* Botão Download */}
        <motion.a
          href={documentUrl}
          download={fileName}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-3 rounded-full ${isFromMe ? 'bg-white/20 hover:bg-white/30' : 'bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50'} transition-colors`}
        >
          <Download className={`w-5 h-5 ${isFromMe ? 'text-white' : 'text-blue-600'}`} />
        </motion.a>
      </div>

      {/* Ações */}
      <div className="absolute -top-2 -right-2">
        <MessageActions message={message} isFromMe={isFromMe} />
      </div>
    </div>
  )
}
