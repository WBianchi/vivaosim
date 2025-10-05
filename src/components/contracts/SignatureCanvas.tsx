'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PenTool, Trash2, Check, X } from 'lucide-react'

interface SignatureCanvasProps {
  onSave: (signature: string) => void
  onCancel: () => void
  title?: string
  existingSignature?: string
}

export default function SignatureCanvas({ 
  onSave, 
  onCancel, 
  title = 'Assine aqui',
  existingSignature 
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configurar canvas
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)

    // Estilo da caneta
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Carregar assinatura existente se houver
    if (existingSignature) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight)
        setIsEmpty(false)
      }
      img.src = existingSignature
    }
  }, [existingSignature])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setIsDrawing(true)
    setIsEmpty(false)

    const rect = canvas.getBoundingClientRect()
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setIsEmpty(true)
  }

  const saveSignature = () => {
    const canvas = canvasRef.current
    if (!canvas || isEmpty) return

    const signature = canvas.toDataURL('image/png')
    onSave(signature)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <PenTool className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Use o mouse ou toque para assinar</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Canvas de Assinatura */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl mb-4 bg-white">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-64 cursor-crosshair touch-none"
            style={{ touchAction: 'none' }}
          />
        </div>

        {/* Ações */}
        <div className="flex items-center gap-3">
          <button
            onClick={clearCanvas}
            disabled={isEmpty}
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Limpar
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
          <button
            onClick={saveSignature}
            disabled={isEmpty}
            className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Confirmar Assinatura
          </button>
        </div>
      </motion.div>
    </div>
  )
}
