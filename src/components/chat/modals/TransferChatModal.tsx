'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRightLeft, User, Check } from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'

interface Attendant {
  id: string
  name: string
  email: string
  role: string
  status: string
}

interface TransferChatModalProps {
  isOpen: boolean
  onClose: () => void
  onTransfer: (attendantId: string) => void
  chatId: string
  currentAttendant?: string
}

export function TransferChatModal({
  isOpen,
  onClose,
  onTransfer,
  chatId,
  currentAttendant
}: TransferChatModalProps) {
  const [attendants, setAttendants] = useState<Attendant[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedAttendant, setSelectedAttendant] = useState<string | null>(null)

  // Buscar atendentes disponíveis
  useEffect(() => {
    if (!isOpen) return

    const fetchAttendants = async () => {
      try {
        setLoading(true)
        const token = getAuthToken()
        if (!token) return

        const response = await fetch('/api/users?role=ATENDENTE,ADMINISTRADOR&status=ATIVO', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()
        
        if (data.users) {
          setAttendants(data.users)
        }
      } catch (error) {
        console.error('❌ Erro ao buscar atendentes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAttendants()
  }, [isOpen])

  const handleTransfer = () => {
    if (selectedAttendant) {
      onTransfer(selectedAttendant)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <ArrowRightLeft className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Transferir Conversa
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Escolha o atendente responsável
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 max-h-96">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {attendants.map((attendant) => (
                  <motion.button
                    key={attendant.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedAttendant(attendant.id)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      selectedAttendant === attendant.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {attendant.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                            {attendant.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {attendant.role === 'ADMINISTRADOR' ? 'Administrador' : 'Atendente'}
                          </p>
                        </div>
                      </div>
                      {selectedAttendant === attendant.id && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </motion.button>
                ))}

                {attendants.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum atendente disponível</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleTransfer}
                disabled={!selectedAttendant}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
              >
                Transferir
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
