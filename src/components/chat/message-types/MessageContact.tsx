'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { User, Phone, MessageCircle } from 'lucide-react'
import { Message } from '@/types/chat'
import { MessageActions } from './MessageActions'

interface MessageContactProps {
  message: Message
  isFromMe: boolean
}

export const MessageContact: React.FC<MessageContactProps> = ({ message, isFromMe }) => {
  // Dados do contato (em produção viria de message.contactData)
  const contactData = {
    name: message.contactName || 'Contato',
    phone: message.contactPhone || '',
    avatar: message.contactAvatar || null
  }

  const handleSaveContact = () => {
    console.log('💾 Salvar contato:', contactData)
    // TODO: Implementar salvamento de contato
  }

  const handleWhatsApp = () => {
    const phone = contactData.phone.replace(/\D/g, '')
    window.open(`https://wa.me/${phone}`, '_blank')
  }

  const handleCall = () => {
    window.location.href = `tel:${contactData.phone}`
  }

  return (
    <div className="group relative">
      <div className={`p-4 rounded-xl ${isFromMe ? 'bg-blue-500' : 'bg-white dark:bg-gray-800'} shadow-lg min-w-[280px] max-w-sm`}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`p-2 rounded-full ${isFromMe ? 'bg-white/20' : 'bg-indigo-100 dark:bg-indigo-900/30'}`}>
            <User className={`w-4 h-4 ${isFromMe ? 'text-white' : 'text-indigo-600'}`} />
          </div>
          <span className={`text-xs font-medium ${isFromMe ? 'text-white/80' : 'text-gray-500'}`}>
            CONTATO
          </span>
        </div>

        {/* Informações do Contato */}
        <div className="flex items-center gap-3 mb-4">
          {/* Avatar */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isFromMe ? 'bg-white/20' : 'bg-gradient-to-br from-indigo-500 to-purple-500'
          }`}>
            {contactData.avatar ? (
              <img 
                src={contactData.avatar} 
                alt={contactData.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>

          {/* Nome e Telefone */}
          <div className="flex-1">
            <h3 className={`text-base font-bold ${isFromMe ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
              {contactData.name}
            </h3>
            <p className={`text-sm ${isFromMe ? 'text-white/70' : 'text-gray-600 dark:text-gray-400'}`}>
              {contactData.phone}
            </p>
          </div>
        </div>

        {/* Ações do Contato */}
        {!isFromMe && (
          <div className="grid grid-cols-3 gap-2">
            {/* Mensagem */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWhatsApp}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-green-600" />
              <span className="text-xs font-medium text-green-700 dark:text-green-400">Mensagem</span>
            </motion.button>

            {/* Ligar */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCall}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              <Phone className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-400">Ligar</span>
            </motion.button>

            {/* Salvar */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveContact}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
            >
              <User className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-medium text-purple-700 dark:text-purple-400">Salvar</span>
            </motion.button>
          </div>
        )}

        {/* Timestamp */}
        <div className={`text-xs mt-3 ${isFromMe ? 'text-white/70' : 'text-gray-500'}`}>
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
