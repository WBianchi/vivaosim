'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Send, 
  Calendar,
  Clock,
  MessageSquare,
  Image as ImageIcon,
  Video,
  FileText,
  Volume2,
  Bot,
  Plus,
  Trash2,
  Sparkles
} from 'lucide-react'

interface ScheduledItem {
  id: string
  type: 'text' | 'image' | 'video' | 'audio' | 'document'
  content: string
  icon: any
  color: string
}

interface ScheduleSendModalProps {
  isOpen: boolean
  onClose: () => void
  onSchedule: (date: string, time: string, items: ScheduledItem[]) => void
  contactName?: string
}

export function ScheduleSendModal({ 
  isOpen, 
  onClose, 
  onSchedule,
  contactName 
}: ScheduleSendModalProps) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [items, setItems] = useState<ScheduledItem[]>([])
  const [showAddMenu, setShowAddMenu] = useState(false)

  const handleSchedule = () => {
    if (!date || !time || items.length === 0) {
      alert('Preencha data, hora e adicione pelo menos um item')
      return
    }
    onSchedule(date, time, items)
    onClose()
  }

  const addItem = (type: ScheduledItem['type']) => {
    const itemConfig = {
      text: { icon: MessageSquare, color: 'bg-blue-500', label: 'Mensagem de texto' },
      image: { icon: ImageIcon, color: 'bg-pink-500', label: 'Imagem' },
      video: { icon: Video, color: 'bg-purple-500', label: 'Vídeo' },
      audio: { icon: Volume2, color: 'bg-orange-500', label: 'Áudio' },
      document: { icon: FileText, color: 'bg-green-500', label: 'Documento' }
    }

    const config = itemConfig[type]
    const newItem: ScheduledItem = {
      id: Date.now().toString(),
      type,
      content: config.label,
      icon: config.icon,
      color: config.color
    }

    setItems([...items, newItem])
    setShowAddMenu(false)
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const generateWithAI = (itemId: string) => {
    alert('Gerar com IA em desenvolvimento')
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
          <div className="relative px-6 py-5 bg-gradient-to-r from-green-500 to-emerald-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Agendar Envio
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
            {/* Data e Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-500" />
                  Data
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  Horário
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                />
              </div>
            </div>

            {/* Lista de Itens */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                  Itens para Enviar ({items.length})
                </label>
                <button
                  onClick={() => setShowAddMenu(!showAddMenu)}
                  className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar
                </button>
              </div>

              {/* Menu de Adicionar */}
              {showAddMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addItem('text')}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Texto
                    </button>
                    <button
                      onClick={() => addItem('image')}
                      className="px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm font-semibold flex items-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Imagem
                    </button>
                    <button
                      onClick={() => addItem('video')}
                      className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-semibold flex items-center gap-2"
                    >
                      <Video className="w-4 h-4" />
                      Vídeo
                    </button>
                    <button
                      onClick={() => addItem('audio')}
                      className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-semibold flex items-center gap-2"
                    >
                      <Volume2 className="w-4 h-4" />
                      Áudio
                    </button>
                    <button
                      onClick={() => addItem('document')}
                      className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold flex items-center gap-2 col-span-2"
                    >
                      <FileText className="w-4 h-4" />
                      Documento
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Lista de Itens Adicionados */}
              <div className="space-y-2">
                {items.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum item adicionado</p>
                  </div>
                ) : (
                  items.map((item) => {
                    const Icon = item.icon
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                      >
                        <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {item.content}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.type === 'text' ? 'Mensagem de texto' : `Arquivo ${item.type}`}
                          </p>
                        </div>
                        <button
                          onClick={() => generateWithAI(item.id)}
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Gerar com IA"
                        >
                          <Sparkles className="w-4 h-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </motion.div>
                    )
                  })
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
                className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold"
              >
                Cancelar
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSchedule}
                disabled={!date || !time || items.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Agendar Envio
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
