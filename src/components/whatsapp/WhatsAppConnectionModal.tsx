'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Smartphone, 
  QrCode, 
  Wifi, 
  WifiOff, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Plus,
  RefreshCw,
  Trash2
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface WhatsAppSession {
  id: string
  sessionId: string
  name: string
  status: 'STARTING' | 'SCAN_QR_CODE' | 'WORKING' | 'FAILED' | 'STOPPED'
  qrCode?: string
  connectedAt?: Date
  lastSeen?: Date
  phoneNumber?: string
  profileName?: string
}

interface WhatsAppConnectionModalProps {
  isOpen: boolean
  onClose: () => void
}

export const WhatsAppConnectionModal: React.FC<WhatsAppConnectionModalProps> = ({
  isOpen,
  onClose
}) => {
  const { isDarkMode } = useTheme()
  const { user } = useAuth()
  const [isMounted, setIsMounted] = useState(false)
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newSessionName, setNewSessionName] = useState('')
  
  // Mock do hook useWhatsAppSession
  const sessions: WhatsAppSession[] = []
  const isLoading = false
  const error = null
  const createSession = async (name: string) => { console.log('Creating session:', name) }
  const fetchQRCode = async (sessionId: string) => { console.log('Fetching QR:', sessionId) }
  const reconnectSession = async (sessionId: string) => { console.log('Reconnecting:', sessionId) }
  const stopSession = async (sessionId: string) => { console.log('Stopping:', sessionId) }
  const deleteSession = async (sessionId: string) => { console.log('Deleting:', sessionId) }
  const clearError = () => { console.log('Clearing error') }

  // Controlar montagem do componente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Limpar erro quando modal abre
  useEffect(() => {
    if (isOpen) {
      clearError()
    }
  }, [isOpen, clearError])

  const handleCreateSession = async () => {
    if (!newSessionName.trim()) return

    try {
      await createSession(newSessionName)
      setNewSessionName('')
      setShowCreateForm(false)
    } catch (err) {
      // Erro já tratado no hook
    }
  }

  const handleRetryQR = async (sessionId: string) => {
    await fetchQRCode(sessionId)
  }

  const handleReconnect = async (sessionId: string) => {
    await reconnectSession(sessionId)
  }

  const handleStop = async (sessionId: string) => {
    await stopSession(sessionId)
  }

  const handleDelete = async (sessionId: string) => {
    if (confirm('Tem certeza que deseja deletar esta sessão?')) {
      await deleteSession(sessionId)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WORKING': return 'text-green-500'
      case 'SCAN_QR_CODE': return 'text-yellow-500'
      case 'STARTING': return 'text-blue-500'
      case 'FAILED': return 'text-red-500'
      case 'STOPPED': return 'text-gray-500'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'WORKING': return <Wifi className="w-4 h-4 text-green-500" />
      case 'SCAN_QR_CODE': return <QrCode className="w-4 h-4 text-yellow-500" />
      case 'STARTING': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      case 'FAILED': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'STOPPED': return <WifiOff className="w-4 h-4 text-gray-500" />
      default: return <WifiOff className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'WORKING': return 'Conectado'
      case 'SCAN_QR_CODE': return 'Aguardando QR Code'
      case 'STARTING': return 'Iniciando...'
      case 'FAILED': return 'Falha na conexão'
      case 'STOPPED': return 'Desconectado'
      default: return 'Status desconhecido'
    }
  }

  // Debug
  console.log('📱 Modal WhatsApp - isOpen:', isOpen, 'isMounted:', isMounted, 'sessions:', sessions.length)

  // Não renderizar no servidor
  if (!isMounted) return null

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'w-full max-w-2xl mx-4 rounded-2xl shadow-2xl border',
              isDarkMode 
                ? 'bg-slate-900/95 border-slate-700/50' 
                : 'bg-white/95 border-gray-200/50'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/20">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  'bg-gradient-to-br from-green-500 to-green-600'
                )}>
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className={cn('text-xl font-bold', isDarkMode ? 'text-white' : 'text-gray-900')}>
                    Conexões WhatsApp
                  </h2>
                  <p className={cn('text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600')}>
                    Gerencie suas conexões com WhatsApp Business
                  </p>
                </div>
              </div>
              
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  'p-2 rounded-xl transition-colors',
                  isDarkMode 
                    ? 'hover:bg-slate-800 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                )}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                >
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                </motion.div>
              )}

              {/* Create New Session */}
              <div className="mb-6">
                {!showCreateForm ? (
                  <motion.button
                    onClick={() => setShowCreateForm(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed transition-colors',
                      isDarkMode
                        ? 'border-slate-600 hover:border-slate-500 text-slate-400 hover:text-slate-300'
                        : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700'
                    )}
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Nova Conexão WhatsApp</span>
                  </motion.button>
                ) : (
                  <div className={cn(
                    'p-4 rounded-xl border',
                    isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
                  )}>
                    <div className="space-y-4">
                      <div>
                        <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-gray-300' : 'text-gray-700')}>
                          Nome da Sessão
                        </label>
                        <input
                          type="text"
                          value={newSessionName}
                          onChange={(e) => setNewSessionName(e.target.value)}
                          placeholder="Ex: WhatsApp Principal"
                          className={cn(
                            'w-full p-3 rounded-xl border transition-colors',
                            isDarkMode
                              ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-orange-500'
                              : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-orange-500',
                            'focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                          )}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <motion.button
                          onClick={handleCreateSession}
                          disabled={!newSessionName.trim() || isLoading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            'flex-1 flex items-center justify-center gap-2 p-3 rounded-xl font-medium transition-colors',
                            'bg-gradient-to-r from-green-500 to-green-600 text-white',
                            'disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-green-700'
                          )}
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                          Criar Sessão
                        </motion.button>
                        
                        <motion.button
                          onClick={() => {
                            setShowCreateForm(false)
                            setNewSessionName('')
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            'px-4 py-3 rounded-xl font-medium transition-colors',
                            isDarkMode
                              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          )}
                        >
                          Cancelar
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sessions List */}
              <div className="space-y-4">
                {sessions.length === 0 ? (
                  <div className="text-center py-8">
                    <Smartphone className={cn('w-12 h-12 mx-auto mb-3', isDarkMode ? 'text-slate-600' : 'text-gray-400')} />
                    <p className={cn('text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600')}>
                      Nenhuma conexão WhatsApp encontrada
                    </p>
                  </div>
                ) : (
                  sessions.map((session) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'p-4 rounded-xl border',
                        isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
                      )}
                    >
                      {/* Session Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(session.status)}
                          <div>
                            <h3 className={cn('font-medium', isDarkMode ? 'text-white' : 'text-gray-900')}>
                              {session.name}
                            </h3>
                            <p className={cn('text-sm', getStatusColor(session.status))}>
                              {getStatusText(session.status)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {session.status === 'SCAN_QR_CODE' && (
                            <motion.button
                              onClick={() => handleRetryQR(session.sessionId)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg text-blue-500 hover:bg-blue-500/10"
                              title="Atualizar QR Code"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </motion.button>
                          )}

                          {session.status === 'STOPPED' && (
                            <motion.button
                              onClick={() => handleReconnect(session.sessionId)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg text-green-500 hover:bg-green-500/10"
                              title="Reconectar"
                            >
                              <Wifi className="w-4 h-4" />
                            </motion.button>
                          )}

                          <motion.button
                            onClick={() => handleDelete(session.sessionId)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-500/10"
                            title="Deletar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>

                      {/* QR Code Display */}
                      {session.status === 'SCAN_QR_CODE' && session.qrCode && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center p-4 bg-white rounded-xl"
                        >
                          <img
                            src={`data:image/png;base64,${session.qrCode}`}
                            alt="QR Code WhatsApp"
                            className="w-48 h-48 mb-3"
                          />
                          <p className="text-sm text-gray-600 text-center">
                            Abra o WhatsApp no seu celular e escaneie este código
                          </p>
                        </motion.div>
                      )}

                      {/* Connection Info */}
                      {session.status === 'WORKING' && (
                        <div className={cn(
                          'p-3 rounded-lg',
                          isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
                        )}>
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Conectado com sucesso!</span>
                          </div>
                          {session.phoneNumber && (
                            <p className="text-sm text-green-600/80 mt-1">
                              Número: {session.phoneNumber}
                            </p>
                          )}
                          {session.profileName && (
                            <p className="text-sm text-green-600/80">
                              Nome: {session.profileName}
                            </p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Renderizar via portal no body
  return createPortal(modalContent, document.body)
}
