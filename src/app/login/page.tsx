'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, User, Facebook, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeProvider'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaGoogle } from 'react-icons/fa'

function LoginForm() {
  const { login } = useAuth()
  const { isDarkMode } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const [logoConfig, setLogoConfig] = useState<{ 
    logo: string | null
    logoSize: string
    logoWidth: number
    logoHeight: number
  }>({ logo: null, logoSize: 'medium', logoWidth: 40, logoHeight: 40 })
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotMessage, setForgotMessage] = useState('')

  // Calcular tamanho da logo
  const getLogoSize = () => {
    const sizes: Record<string, number> = {
      small: 32,
      medium: 64,
      large: 80,
      custom: logoConfig.logoHeight
    }
    return sizes[logoConfig.logoSize] || 64
  }

  // Carregar logo do site
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const response = await fetch('/api/settings/site')
        const data = await response.json()
        if (data.success && data.config) {
          setLogoConfig({
            logo: data.config.logo,
            logoSize: data.config.logoSize || 'medium',
            logoWidth: data.config.logoWidth || 40,
            logoHeight: data.config.logoHeight || 40
          })
        }
      } catch (error) {
        console.error('❌ Erro ao carregar logo:', error)
      }
    }
    
    loadLogo()

    // Listener para atualização em tempo real
    const handleConfigUpdate = (event: any) => {
      const config = event.detail
      if (config) {
        setLogoConfig({
          logo: config.logo,
          logoSize: config.logoSize || 'medium',
          logoWidth: config.logoWidth || 40,
          logoHeight: config.logoHeight || 40
        })
      }
    }

    window.addEventListener('siteConfigUpdated', handleConfigUpdate)
    return () => window.removeEventListener('siteConfigUpdated', handleConfigUpdate)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    console.log('🚀 INÍCIO LOGIN - handleSubmit')

    try {
      // Fazer requisição direta para testar
      console.log('📡 Fazendo fetch direto...')
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password, 
          rememberMe: formData.rememberMe 
        }),
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response ok:', response.ok)
      
      const data = await response.json()
      console.log('📦 Response completa:', data)
      
      if (data.success) {
        console.log('✅ LOGIN SUCESSO - dados recebidos')
        console.log('👤 Role do usuário:', data.data.user.role)
        console.log('🔑 Token recebido:', data.data.accessToken ? 'SIM' : 'NÃO')
        
        // Setar cookies com 7 dias de duração (sem secure para localhost)
        const maxAge = 7 * 24 * 60 * 60 // 7 dias em segundos
        document.cookie = `accessToken=${data.data.accessToken}; path=/; max-age=${maxAge}; samesite=lax`
        
        // Também salvar no localStorage como backup
        localStorage.setItem('accessToken', data.data.accessToken)
        
        // Redirecionar baseado no role (URL consistente com middleware)
        let redirectUrl = '/dashboard'
        
        if (data.data.user.role === 'CLIENTE') {
          redirectUrl = '/cliente'
        } else if (data.data.user.role === 'ADMINISTRADOR' || data.data.user.role === 'ATENDENTE' || data.data.user.role === 'ASSINANTE') {
          redirectUrl = '/dashboard'
        }
        
        console.log('🔄 Redirecionando para:', redirectUrl)
        
        // Usar window.location.href para garantir reload completo e carregar o AuthContext
        window.location.href = redirectUrl
      } else {
        console.error('❌ Login falhou:', data.error)
        setError(data.error)
      }
    } catch (error: any) {
      console.error('❌ Erro na requisição:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      })

      const data = await response.json()
      if (data.success) {
        setForgotMessage('Instruções enviadas para seu email!')
        setTimeout(() => setShowForgotPassword(false), 2000)
      } else {
        setError(data.error)
      }
    } catch (error: any) {
      setError('Erro ao enviar email de recuperação')
    } finally {
      setForgotLoading(false)
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
        className={`w-full max-w-md p-8 rounded-3xl shadow-2xl border backdrop-blur-xl relative z-10 ${
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
        <div className="text-center mb-8">
          {logoConfig.logo ? (
            <div className="flex justify-center mb-4">
              <img 
                src={logoConfig.logo} 
                alt="Viva o Sim" 
                style={{ 
                  height: `${getLogoSize()}px`,
                  width: logoConfig.logoSize === 'custom' ? `${logoConfig.logoWidth * 1.6}px` : 'auto'
                }}
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg mb-3">
                <span className="text-white font-bold text-2xl">V</span>
              </div>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Viva o Sim
              </h2>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                CRM Eventos
              </p>
            </div>
          )}
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Bem-vindo de volta
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
            Entre na sua conta para continuar
          </p>
        </div>

        {/* Social Login */}
        <div className="space-y-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl border transition-all ${
              isDarkMode 
                ? 'bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FaGoogle className="w-5 h-5 text-red-500" />
            <span>Continuar com Google</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl border transition-all ${
              isDarkMode 
                ? 'bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Facebook className="w-5 h-5 text-blue-600" />
            <span>Continuar com Facebook</span>
          </motion.button>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'}`}></div>
          <span className={`px-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            ou
          </span>
          <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'}`}></div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                  isDarkMode 
                    ? 'bg-slate-700/50 border-slate-600 text-white focus:border-orange-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Senha
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-all ${
                  isDarkMode 
                    ? 'bg-slate-700/50 border-slate-600 text-white focus:border-orange-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                placeholder="Sua senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
                }`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="mr-2 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Lembrar-me
              </span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
            >
              Esqueci minha senha
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Entrar</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-6">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Não tem uma conta?{' '}
          </span>
          <Link 
            href="/cadastro" 
            className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            Criar conta
          </Link>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowForgotPassword(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md p-6 rounded-2xl shadow-2xl ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
            } border`}
          >
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Esqueceu sua senha?
            </h3>
            
            {forgotMessage ? (
              <div className="text-center p-4">
                <Sparkles className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-green-600 font-medium">{forgotMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Digite seu email para receber instruções de recuperação.
                </p>
                
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  className={`w-full px-4 py-3 rounded-xl border mb-4 ${
                    isDarkMode 
                      ? 'bg-slate-700/50 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                  placeholder="seu@email.com"
                />
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                      isDarkMode 
                        ? 'border-slate-600 text-gray-300 hover:bg-slate-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all disabled:opacity-50"
                  >
                    {forgotLoading ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <LoginForm />
    </Suspense>
  )
}
