'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Wifi, WifiOff, Trash2, QrCode, Phone, User, Calendar, Loader2 } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { WhatsAppSimpleModal } from './WhatsAppSimpleModal'

interface WhatsAppSession {
  id: string
  sessionId: string
  name: string
  status: 'STARTING' | 'SCAN_QR_CODE' | 'WORKING' | 'FAILED' | 'STOPPED'
  phoneNumber?: string
  profileName?: string
  profilePicture?: string
  connectedAt?: string
  lastSeen?: string
}

interface WhatsAppConnectionManagerProps {
  isOpen: boolean
  onClose: () => void
}

export const WhatsAppConnectionManager: React.FC<WhatsAppConnectionManagerProps> = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme()
  const [sessions, setSessions] = useState<WhatsAppSession[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewConnectionModal, setShowNewConnectionModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState<WhatsAppSession | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchSessions()
    }
  }, [isOpen])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1]

      const response = await fetch('/api/whatsapp/sessions', {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      })

      if (response.ok) {
        const data = await response.json()
        setSessions(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Erro ao buscar sessões:', error)
      toast.error('Erro ao carregar conexões')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Deseja realmente desconectar este WhatsApp?')) return

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1]

      const response = await fetch(`/api/whatsapp/sessions?sessionId=${sessionId}`, {
        method: 'DELETE',
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      })

      if (response.ok) {
        toast.success('WhatsApp desconectado com sucesso')
        fetchSessions()
        window.dispatchEvent(new CustomEvent('whatsapp-disconnected'))
      } else {
        toast.error('Erro ao desconectar WhatsApp')
      }
    } catch (error) {
      console.error('Erro ao deletar sessão:', error)
      toast.error('Erro ao desconectar WhatsApp')
    }
  }

  const handleNewConnection = () => {
    setShowNewConnectionModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WORKING':
        return 'bg-green-500'
      case 'SCAN_QR_CODE':
        return 'bg-yellow-500'
      case 'STARTING':
        return 'bg-blue-500'
      case 'FAILED':
        return 'bg-red-500'
      case 'STOPPED':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'WORKING':
        return 'Conectado'
      case 'SCAN_QR_CODE':
        return 'Aguardando QR Code'
      case 'STARTING':
        return 'Iniciando...'
      case 'FAILED':
        return 'Falhou'
      case 'STOPPED':
        return 'Parado'
      default:
        return status
    }
  }

  if (!isOpen) return null

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
        style={{ paddingTop: '2rem', paddingBottom: '2rem' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl my-auto',
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/10">
            <div>
              <h2 className={cn(
                'text-2xl font-bold',
                isDarkMode ? 'text-white' : 'text-gray-900'
              )}>
                Gerenciar Conexões WhatsApp
              </h2>
              <p className={cn(
                'text-sm mt-1',
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              )}>
                Conecte múltiplas contas e gerencie todas em um só lugar
              </p>
            </div>
            <button
              onClick={onClose}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
              )}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              </div>
            ) : (
              <>
                {/* Sessions List */}
                <div className="space-y-4 mb-6">
                  {sessions.length === 0 ? (
                    <div className={cn(
                      'text-center py-12 rounded-xl border-2 border-dashed',
                      isDarkMode ? 'border-slate-700 text-gray-400' : 'border-gray-300 text-gray-500'
                    )}>
                      <WifiOff className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Nenhuma conexão WhatsApp</p>
                      <p className="text-sm mt-2">Clique em "Nova Conexão" para começar</p>
                    </div>
                  ) : (
                    sessions.map((session) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          'p-4 rounded-xl border transition-all',
                          isDarkMode
                            ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            {/* Avatar */}
                            <div className="relative">
                              {session.profilePicture ? (
                                <img
                                  src={session.profilePicture}
                                  alt={session.profileName || 'WhatsApp'}
                                  className="w-12 h-12 rounded-full"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                  <User className="w-6 h-6 text-white" />
                                </div>
                              )}
                              <div className={cn(
                                'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2',
                                isDarkMode ? 'border-slate-700' : 'border-white',
                                getStatusColor(session.status)
                              )} />
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                              <h3 className={cn(
                                'font-semibold',
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              )}>
                                {session.profileName || session.name}
                              </h3>
                              <div className="flex items-center gap-4 mt-1">
                                {session.phoneNumber && (
                                  <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <Phone className="w-3 h-3" />
                                    {session.phoneNumber}
                                  </div>
                                )}
                                <div className={cn(
                                  'flex items-center gap-1 text-sm',
                                  session.status === 'WORKING' ? 'text-green-500' : 'text-gray-500'
                                )}>
                                  {session.status === 'WORKING' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                                  {getStatusText(session.status)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {session.status === 'SCAN_QR_CODE' && (
                              <button
                                onClick={() => setSelectedSession(session)}
                                className={cn(
                                  'p-2 rounded-lg transition-colors',
                                  isDarkMode
                                    ? 'bg-orange-900/30 text-orange-400 hover:bg-orange-900/50'
                                    : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                                )}
                              >
                                <QrCode className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteSession(session.sessionId)}
                              className={cn(
                                'p-2 rounded-lg transition-colors',
                                isDarkMode
                                  ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                                  : 'bg-red-100 text-red-600 hover:bg-red-200'
                              )}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* New Connection Button */}
                <button
                  onClick={handleNewConnection}
                  className={cn(
                    'w-full p-4 rounded-xl border-2 border-dashed transition-all',
                    'flex items-center justify-center gap-2',
                    isDarkMode
                      ? 'border-orange-500/30 text-orange-400 hover:bg-orange-900/20'
                      : 'border-orange-500/30 text-orange-600 hover:bg-orange-50'
                  )}
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Nova Conexão WhatsApp</span>
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Modal para nova conexão */}
      {showNewConnectionModal && (
        <WhatsAppSimpleModal
          isOpen={showNewConnectionModal}
          onClose={() => {
            setShowNewConnectionModal(false)
            fetchSessions() // Recarregar sessões após criar nova
          }}
        />
      )}

      {/* Modal para mostrar QR Code de sessão existente - TODO: Implementar prop existingSessionId */}
      {/* {selectedSession && (
        <WhatsAppSimpleModal
          isOpen={!!selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )} */}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}
