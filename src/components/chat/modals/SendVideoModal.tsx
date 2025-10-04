'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Send, Video } from 'lucide-react'

interface SendVideoModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (file: File, caption: string) => void
  file: File | null
  chatName: string
}

export const SendVideoModal: React.FC<SendVideoModalProps> = ({
  isOpen,
  onClose,
  onSend,
  file,
  chatName
}) => {
  const [caption, setCaption] = useState('')
  const [preview, setPreview] = useState<string>('')

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [file])

  if (!isOpen || !file) return null

  const handleSend = () => {
    onSend(file, caption)
    setCaption('')
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Enviar Vídeo
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Para: {chatName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 max-h-[50vh] overflow-auto flex items-center justify-center">
          {preview && (
            <video
              src={preview}
              controls
              className="max-w-full max-h-[45vh] rounded-lg"
            />
          )}
        </div>

        {/* Caption */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Adicione uma legenda (opcional)..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 dark:text-white resize-none"
            maxLength={1000}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {file.name} • {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {caption.length}/1000
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSend}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Enviar
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
