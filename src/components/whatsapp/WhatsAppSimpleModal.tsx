'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, QrCode, Loader2, CheckCircle, AlertCircle, Wifi } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface WhatsAppSimpleModalProps {
  isOpen: boolean
  onClose: () => void
}

export const WhatsAppSimpleModal: React.FC<WhatsAppSimpleModalProps> = ({
  isOpen,
  onClose
}) => {
  const { isDarkMode } = useTheme()
  const { user, accessToken } = useAuth()
  const [isMounted, setIsMounted] = useState(false)
  const [status, setStatus] = useState<'idle' | 'creating' | 'qr_ready' | 'connected' | 'error'>('idle')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Controlar montagem
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Criar sessão automaticamente quando modal abre
  useEffect(() => {
    if (isOpen && user && status === 'idle') {
      createWhatsAppSession()
    }
  }, [isOpen, user, status])

  const createWhatsAppSession = async () => {
    if (!user || !accessToken) return

    // Prevenir múltiplas chamadas simultâneas
    if (status === 'creating') {
      console.log('⚠️ Criação já em andamento, ignorando...')
      return
    }

    setStatus('creating')
    setError(null)

    try {
      console.log('🚀 Criando sessão WhatsApp para:', user.name)
      
      // Criar sessão via nossa API
      const response = await fetch('/api/whatsapp/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          name: `${user.name || user.email} - ${Date.now()}`
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Falha ao criar sessão')
      }

      const data = await response.json()
      const session = data.session
      setSessionId(session.sessionId)

      console.log('✅ Sessão criada:', session.sessionId)

      // Aguardar QR Code se temos sessionId válido
      if (session.sessionId && session.sessionId !== 'undefined') {
        setTimeout(() => {
          fetchQRCode(session.sessionId)
        }, 3000)
      } else {
        console.error('❌ SessionId inválido:', session.sessionId)
        setError('SessionId inválido recebido do servidor')
        setStatus('error')
      }

    } catch (err) {
      console.error('❌ Erro ao criar sessão:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setStatus('error')
    }
  }

  const checkSessionStatus = async (sessionId: string) => {
    if (!accessToken) return

    try {
      console.log('🔍 Verificando status da sessão:', sessionId)
      
      const response = await fetch(`/api/whatsapp/sessions/${sessionId}/status`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('📊 Status da sessão:', data.status)
        
        if (data.status === 'WORKING') {
          console.log('🎉 WhatsApp conectado com sucesso!')
          setStatus('connected')
          return true
        }
        
        if (data.status === 'FAILED') {
          console.log('❌ Sessão falhou')
          setError('Sessão falhou. Tente novamente.')
          setStatus('error')
          return true
        }
      }
      
      return false
    } catch (err) {
      console.error('❌ Erro ao verificar status:', err)
      return false
    }
  }

  const fetchQRCode = async (sessionId: string) => {
    if (!accessToken) return

    // Primeiro verificar se a sessão já está conectada
    const isConnected = await checkSessionStatus(sessionId)
    if (isConnected) return

    try {
      console.log('📱 Buscando QR Code para sessão:', sessionId)
      
      const response = await fetch(`/api/whatsapp/sessions/${sessionId}/qr`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      console.log('📡 Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('📄 Response data:', data)
        
        if (data.qr) {
          console.log('✅ QR Code obtido! Tamanho:', data.qr.length)
          setQrCode(data.qr)
          setStatus('qr_ready')
          
          // Iniciar verificação periódica de status
          setTimeout(() => checkSessionPeriodically(sessionId), 2000)
          return
        }
      } else {
        const errorData = await response.json()
        console.log('⚠️ Erro na resposta:', errorData)
      }
      
      console.log('⏳ QR Code ainda não disponível, tentando novamente em 3s...')
      setTimeout(() => fetchQRCode(sessionId), 3000)
      
    } catch (err) {
      console.error('❌ Erro ao buscar QR Code:', err)
      setTimeout(() => fetchQRCode(sessionId), 3000)
    }
  }

  const checkSessionPeriodically = async (sessionId: string) => {
    if (status === 'connected' || status === 'error') return
    
    const isConnected = await checkSessionStatus(sessionId)
    if (!isConnected) {
      // Continuar verificando a cada 2 segundos
      setTimeout(() => checkSessionPeriodically(sessionId), 2000)
    }
  }

  const handleClose = () => {
    setStatus('idle')
    setQrCode(null)
    setSessionId(null)
    setError(null)
    onClose()
  }

  if (!isMounted) return null

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'w-full max-w-md mx-4 rounded-2xl shadow-2xl border',
              isDarkMode
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-gray-200'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Wifi className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    WhatsApp
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Conectar sua conta
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {status === 'creating' && (
                <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 mx-auto text-blue-500 animate-spin mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Criando sessão...
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Preparando conexão com WhatsApp
                  </p>
                </div>
              )}

              {status === 'qr_ready' && qrCode && (
                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg mb-4 shadow-inner">
                    <img 
                      src={`data:image/png;base64,${qrCode}`}
                      alt="QR Code WhatsApp"
                      className="w-full h-auto max-w-[200px] mx-auto"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Escaneie o QR Code
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <p>1. Abra o WhatsApp no seu celular</p>
                    <p>2. Toque em Mais opções ⋮ → Dispositivos conectados</p>
                    <p>3. Toque em Conectar um dispositivo</p>
                    <p>4. Aponte seu celular para esta tela</p>
                  </div>
                </div>
              )}

              {status === 'connected' && (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    WhatsApp Conectado!
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Sua conta foi conectada com sucesso
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              )}

              {status === 'error' && (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Erro na Conexão
                  </h3>
                  <p className="text-red-500 text-sm mb-4">
                    {error}
                  </p>
                  <button
                    onClick={() => {
                      setStatus('idle')
                      setError(null)
                      createWhatsAppSession()
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Tentar Novamente
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <button
                onClick={handleClose}
                className="w-full py-2 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}
