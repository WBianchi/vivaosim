'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, Send, FileText, Upload } from 'lucide-react'

interface SendDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (file: File, caption: string) => void
  file: File | null
  chatName: string
  onFileChange?: (file: File | null) => void
}

export const SendDocumentModal: React.FC<SendDocumentModalProps> = ({
  isOpen,
  onClose,
  onSend,
  file,
  chatName,
  onFileChange
}) => {
  const [caption, setCaption] = useState('')
  const [localFile, setLocalFile] = useState<File | null>(file)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLocalFile(file)
  }, [file])

  if (!isOpen) return null

  const updateFile = (selected: File | null) => {
    setLocalFile(selected)
    onFileChange?.(selected)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] || null
    if (selected) {
      updateFile(selected)
    }
    event.target.value = ''
  }

  const openFilePicker = () => fileInputRef.current?.click()

  const handleSend = () => {
    if (!localFile) {
      alert('Selecione um documento para enviar.')
      return
    }

    onSend(localFile, caption)
    setCaption('')
    updateFile(null)
    onClose()
  }

  const handleClose = () => {
    setCaption('')
    updateFile(null)
    onClose()
  }

  const getFileIcon = (currentFile: File | null) => {
    if (!currentFile) return '📎'
    const type = currentFile.type.toLowerCase()
    if (type.includes('pdf')) return '📄'
    if (type.includes('word') || currentFile.name.endsWith('.doc') || currentFile.name.endsWith('.docx')) return '📝'
    if (type.includes('excel') || currentFile.name.endsWith('.xls') || currentFile.name.endsWith('.xlsx')) return '📊'
    if (type.includes('powerpoint') || currentFile.name.endsWith('.ppt') || currentFile.name.endsWith('.pptx')) return '📽️'
    return '📎'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Enviar Documento
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Para: {chatName}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {!localFile && (
            <div className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 text-center bg-white/60 dark:bg-gray-800/60">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Selecione um documento para enviar. São aceitos PDF, Word, Excel, apresentações e outros formatos comuns.
              </p>
              <button
                onClick={openFilePicker}
                className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center gap-2 mx-auto"
              >
                <Upload className="w-4 h-4" />
                Selecionar documento
              </button>
            </div>
          )}

          {localFile && (
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-5xl">
                {getFileIcon(localFile)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {localFile.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(localFile.size / 1024 / 1024).toFixed(2)} MB • {localFile.type || 'Documento'}
                </p>
              </div>
              <button
                onClick={openFilePicker}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Alterar
              </button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.csv,.odt,.ods,.odp"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Caption */}
        <div className="px-6 pb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Legenda (opcional)
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Adicione uma descrição..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-900 dark:text-white resize-none"
            maxLength={1000}
          />
          <div className="text-right mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {caption.length}/1000
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSend}
            disabled={!localFile}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Enviar
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
