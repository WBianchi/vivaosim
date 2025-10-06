'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { List, ChevronRight } from 'lucide-react'
import { Message } from '@/types/chat'
import { MessageActions } from './MessageActions'

interface MessageListProps {
  message: Message
  isFromMe: boolean
}

export const MessageList: React.FC<MessageListProps> = ({ message, isFromMe }) => {
  const [showOptions, setShowOptions] = useState(false)

  // Simular dados da lista (em produção viria de message.listData)
  const listData = {
    title: message.listTitle || 'Menu',
    description: message.listDescription || 'Escolha uma opção abaixo',
    buttonText: message.listButtonText || 'Ver opções',
    sections: message.listSections || [
      {
        title: 'Seção 1',
        rows: [
          { title: 'Opção 1', description: 'Descrição da opção 1' },
          { title: 'Opção 2', description: 'Descrição da opção 2' }
        ]
      }
    ]
  }

  const handleOptionClick = (sectionIndex: number, rowIndex: number) => {
    console.log('📋 Opção selecionada:', { sectionIndex, rowIndex })
    // TODO: Enviar resposta para a API
    setShowOptions(false)
  }

  return (
    <div className="group relative">
      <div className={`p-4 rounded-xl ${isFromMe ? 'bg-blue-500' : 'bg-white dark:bg-gray-800'} shadow-lg min-w-[320px] max-w-md`}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`p-2 rounded-full ${isFromMe ? 'bg-white/20' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
            <List className={`w-4 h-4 ${isFromMe ? 'text-white' : 'text-purple-600'}`} />
          </div>
          <span className={`text-xs font-medium ${isFromMe ? 'text-white/80' : 'text-gray-500'}`}>
            LISTA/MENU
          </span>
        </div>

        {/* Título */}
        <h3 className={`text-base font-semibold mb-2 ${isFromMe ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
          {listData.title}
        </h3>

        {/* Descrição */}
        <p className={`text-sm mb-4 ${isFromMe ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
          {listData.description}
        </p>

        {/* Botão para abrir opções */}
        {!isFromMe && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowOptions(!showOptions)}
            className={`w-full p-3 rounded-lg flex items-center justify-between ${
              isFromMe 
                ? 'bg-white/20' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } transition-colors`}
          >
            <span className="text-sm font-medium">{listData.buttonText}</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}

        {/* Preview das opções (para mensagem própria) */}
        {isFromMe && (
          <div className="space-y-2">
            {listData.sections.map((section, sIndex) => (
              <div key={sIndex} className="bg-white/10 rounded-lg p-2">
                <p className="text-xs font-medium text-white/70 mb-1">{section.title}</p>
                {section.rows.slice(0, 2).map((row, rIndex) => (
                  <p key={rIndex} className="text-xs text-white/80">• {row.title}</p>
                ))}
                {section.rows.length > 2 && (
                  <p className="text-xs text-white/60">+ {section.rows.length - 2} mais</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div className={`text-xs mt-3 ${isFromMe ? 'text-white/70' : 'text-gray-500'}`}>
          {new Date(message.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Modal de Opções */}
      <AnimatePresence>
        {showOptions && !isFromMe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowOptions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
            >
              {/* Header do Modal */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {listData.title}
                </h3>
                {listData.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {listData.description}
                  </p>
                )}
              </div>

              {/* Opções */}
              <div className="overflow-y-auto max-h-[60vh]">
                {listData.sections.map((section, sIndex) => (
                  <div key={sIndex} className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    {section.title && (
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                        {section.title}
                      </h4>
                    )}
                    <div className="space-y-1">
                      {section.rows.map((row, rIndex) => (
                        <motion.button
                          key={rIndex}
                          whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                          onClick={() => handleOptionClick(sIndex, rIndex)}
                          className="w-full p-3 rounded-lg text-left transition-colors"
                        >
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {row.title}
                          </p>
                          {row.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {row.description}
                            </p>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ações */}
      <div className="absolute -top-2 -right-2">
        <MessageActions message={message} isFromMe={isFromMe} />
      </div>
    </div>
  )
}
