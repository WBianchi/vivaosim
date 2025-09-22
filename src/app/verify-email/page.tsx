'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'
import { useAuth } from '@/contexts/AuthContext'
import { useSearchParams } from 'next/navigation'

export default function VerifyEmailPage() {
  const { isDarkMode } = useTheme()
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error' | 'verifying'>('pending')
  const [message, setMessage] = useState('')
  const [resendLoading, setResendLoading] = useState(false)

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    }
  }, [token])

  const verifyEmail = async (verificationToken: string) => {
    setVerificationStatus('verifying')
    
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationToken })
      })

      const data = await response.json()

      if (data.success) {
        setVerificationStatus('success')
        setMessage('Email verificado com sucesso!')
      } else {
        setVerificationStatus('error')
        setMessage(data.error || 'Erro ao verificar email')
      }
    } catch (error) {
      setVerificationStatus('error')
      setMessage('Erro ao verificar email')
    }
  }

  const resendVerification = async () => {
    if (!user?.email) return

    setResendLoading(true)
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      })

      const data = await response.json()
      if (data.success) {
        setMessage('Email de verificação reenviado!')
      } else {
        setMessage(data.error || 'Erro ao reenviar email')
      }
    } catch (error) {
      setMessage('Erro ao reenviar email')
    } finally {
      setResendLoading(false)
    }
  }

  const getIcon = () => {
    switch (verificationStatus) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />
      case 'error':
        return <AlertCircle className="w-16 h-16 text-red-500" />
      case 'verifying':
        return <RefreshCw className="w-16 h-16 text-orange-500 animate-spin" />
      default:
        return <Mail className="w-16 h-16 text-orange-500" />
    }
  }

  const getTitle = () => {
    switch (verificationStatus) {
      case 'success':
        return 'Email verificado!'
      case 'error':
        return 'Erro na verificação'
      case 'verifying':
        return 'Verificando email...'
      default:
        return 'Verifique seu email'
    }
  }

  const getDescription = () => {
    switch (verificationStatus) {
      case 'success':
        return 'Sua conta foi ativada com sucesso. Agora você pode acessar todos os recursos da plataforma.'
      case 'error':
        return message || 'Houve um problema ao verificar seu email. Tente novamente ou solicite um novo link.'
      case 'verifying':
        return 'Aguarde enquanto verificamos seu email...'
      default:
        return `Enviamos um link de verificação para ${user?.email || 'seu email'}. Clique no link para ativar sua conta.`
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${
      isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-gray-50 via-white to-orange-50'
    }`}>
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-orange-400/10 to-pink-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-md p-8 rounded-3xl shadow-2xl border backdrop-blur-xl relative z-10 text-center ${
          isDarkMode 
            ? 'bg-slate-800/90 border-slate-700' 
            : 'bg-white/90 border-gray-200'
        }`}
        style={{
          boxShadow: isDarkMode
            ? '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 20px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">V</span>
          </div>
        </div>

        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          {getIcon()}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
        >
          {getTitle()}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`text-sm leading-relaxed mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
        >
          {getDescription()}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          {verificationStatus === 'success' && (
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                Acessar dashboard
              </motion.button>
            </Link>
          )}

          {(verificationStatus === 'pending' || verificationStatus === 'error') && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resendVerification}
              disabled={resendLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {resendLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  <span>Reenviar email</span>
                </>
              )}
            </motion.button>
          )}

          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full px-6 py-3 rounded-xl border transition-all ${
                isDarkMode 
                  ? 'border-slate-600 text-gray-300 hover:bg-slate-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Voltar ao login
            </motion.button>
          </Link>
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`text-xs mt-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}
        >
          Não recebeu o email? Verifique sua caixa de spam ou{' '}
          <button
            onClick={resendVerification}
            className="text-orange-500 hover:text-orange-600 underline"
          >
            solicite um novo
          </button>
        </motion.p>
      </motion.div>
    </div>
  )
}
