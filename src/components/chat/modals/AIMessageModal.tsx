'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Send, 
  Sparkles, 
  RefreshCw, 
  Image as ImageIcon, 
  Volume2,
  MessageSquare,
  Loader2,
  Bot,
  Wand2
} from 'lucide-react'

interface AIMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (message: string) => void
  initialMessage?: string
  contactName?: string
}

export function AIMessageModal({ 
  isOpen, 
  onClose, 
  onSend, 
  initialMessage = '',
  contactName 
}: AIMessageModalProps) {
  const [message, setMessage] = useState(initialMessage)
  const [isGenerating, setIsGenerating] = useState(false)
  const [originalMessage] = useState(initialMessage)

  const handleSend = () => {
    if (!message.trim()) return
    onSend(message)
    onClose()
  }

  const handleGenerate = async (type: 'improve' | 'formal' | 'casual' | 'response') => {
    setIsGenerating(true)
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Aqui você faria a chamada real para sua API de IA
      let newMessage = message
      switch (type) {
        case 'improve':
          newMessage = `✨ ${message} (melhorado)`
          break
        case 'formal':
          newMessage = `Prezado(a), ${message}`
          break
        case 'casual':
          newMessage = `Oi! ${message} 😊`
          break
        case 'response':
          newMessage = 'Olá! Como posso ajudar você hoje? 😊'
          break
      }
      setMessage(newMessage)
    } catch (error) {
      console.error('Erro ao gerar com IA:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setMessage(originalMessage)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-800"
        >
          {/* Header */}
          <div className="relative px-6 py-5 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Enviar com I.A
                  </h2>
                  {contactName && (
                    <p className="text-sm text-white/80">
                      Para: <span className="font-semibold">{contactName}</span>
                    </p>
                  )}
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5 max-h-[calc(90vh-200px)] overflow-y-auto">
            {/* AI Actions */}
            <div className="space-y-3">
              {/* Seção: Ajustes de Texto */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Wand2 className="w-3.5 h-3.5" />
                  Ajustes de Texto
                </h3>
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleGenerate('response')}
                    disabled={isGenerating}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold flex items-center gap-2"
                  >
                    <Bot className="w-4 h-4" />
                    Gerar com IA
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleGenerate('improve')}
                    disabled={isGenerating || !message.trim()}
                    className="px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all disabled:opacity-50 text-sm font-semibold flex items-center gap-2"
                  >
                    <Wand2 className="w-4 h-4" />
                    Melhorar
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleGenerate('formal')}
                    disabled={isGenerating || !message.trim()}
                    className="px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all disabled:opacity-50 text-sm font-semibold flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Formal
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleGenerate('casual')}
                    disabled={isGenerating || !message.trim()}
                    className="px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all disabled:opacity-50 text-sm font-semibold flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Casual
                  </motion.button>

                  {message !== originalMessage && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleReset}
                      disabled={isGenerating}
                      className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all disabled:opacity-50 text-sm font-semibold ml-auto"
                    >
                      Resetar
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Seção: Gerar Mídia */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Gerar Mídia com IA
                </h3>
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => alert('Gerar imagem em desenvolvimento')}
                    disabled={isGenerating}
                    className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm font-semibold flex items-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Gerar Imagem
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => alert('Gerar áudio em desenvolvimento')}
                    disabled={isGenerating}
                    className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm font-semibold flex items-center gap-2"
                  >
                    <Volume2 className="w-4 h-4" />
                    Gerar Áudio
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Text Editor */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                Mensagem
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem aqui..."
                className="w-full min-h-[200px] p-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 transition-all"
                disabled={isGenerating}
              />
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium">{message.length} caracteres</span>
                {isGenerating && (
                  <div className="flex items-center gap-2 text-blue-500">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span className="font-medium">Gerando com IA...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                disabled={isGenerating}
                className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all disabled:opacity-50 font-semibold"
              >
                Cancelar
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSend}
                disabled={!message.trim() || isGenerating}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Enviar Mensagem
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
