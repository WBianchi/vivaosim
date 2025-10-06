'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, Send, Image as ImageIcon, Upload, Camera } from 'lucide-react'

interface SendImageModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (file: File, caption: string) => void
  file: File | null
  chatName: string
  onFileChange?: (file: File | null) => void
}

export const SendImageModal: React.FC<SendImageModalProps> = ({
  isOpen,
  onClose,
  onSend,
  file,
  chatName,
  onFileChange
}) => {
  const [caption, setCaption] = useState('')
  const [preview, setPreview] = useState<string>('')
  const [localFile, setLocalFile] = useState<File | null>(file)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLocalFile(file)
  }, [file])

  useEffect(() => {
    if (!localFile) {
      setPreview('')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(localFile)
  }, [localFile])

  if (!isOpen) return null

  const updateFile = (selected: File | null) => {
    setLocalFile(selected)
    onFileChange?.(selected)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] || null
    if (selected) {
      updateFile(selected)
    }
    event.target.value = ''
  }

  const openGallery = () => galleryInputRef.current?.click()
  const openCamera = () => cameraInputRef.current?.click()

  const handleSend = () => {
    if (!localFile) {
      alert('Selecione uma imagem para enviar.')
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Enviar Imagem
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
        <div className="p-4 bg-gray-50 dark:bg-gray-900 max-h-[50vh] overflow-auto flex flex-col items-center justify-center gap-4">
          {!localFile && (
            <div className="w-full max-w-xl border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 text-center bg-white/60 dark:bg-gray-800/60">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Escolha uma imagem da galeria ou capture uma nova foto.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={openGallery}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Galeria
                </button>
                <button
                  onClick={openCamera}
                  className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Câmera
                </button>
              </div>
            </div>
          )}

          {preview && localFile && (
            <img
              src={preview}
              alt="Pré-visualização"
              className="max-w-full max-h-[45vh] object-contain rounded-xl shadow-lg"
            />
          )}
        </div>

        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleInputChange}
        />

        {/* Caption */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Adicione uma legenda (opcional)..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white resize-none"
            maxLength={1000}
          />
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{localFile ? `${localFile.name} • ${(localFile.size / 1024 / 1024).toFixed(2)} MB` : 'Nenhuma imagem selecionada'}</span>
            <span>{caption.length}/1000</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSend}
            disabled={!localFile}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Enviar
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
