'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, User, Phone, MapPin, FileText, Facebook, Building } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeProvider'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaGoogle } from 'react-icons/fa'

export default function CadastroPage() {
  const { register } = useAuth()
  const { isDarkMode } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [step, setStep] = useState(1)
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    state: '',
    country: 'BR',
    cpf: '',
    cnpj: '',
    accountType: 'pessoa_fisica' // pessoa_fisica ou pessoa_juridica
  })

  useEffect(() => {
    // Capturar código do afiliado e plano da URL
    const ref = searchParams.get('ref')
    const plan = searchParams.get('plan')
    
    if (ref) {
      setAffiliateCode(ref)
      console.log('🔗 Cadastro via afiliado:', ref)
    }
    
    if (plan) {
      setSelectedPlanId(plan)
      console.log('📦 Plano selecionado:', plan)
    }
  }, [searchParams])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (formData.password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres')
      return
    }

    setError('')
    setLoading(true)

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        ...(formData.accountType === 'pessoa_fisica' ? { cpf: formData.cpf } : { cnpj: formData.cnpj }),
        affiliateCode, // Passar código do afiliado
        planId: selectedPlanId // Passar plano selecionado
      }

      await register(userData)
      
      // Se veio de afiliado, registrar conversão
      if (affiliateCode) {
        try {
          await fetch('/api/affiliates/convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: affiliateCode,
              planId: selectedPlanId
            })
          })
          console.log('✅ Conversão registrada para afiliado:', affiliateCode)
        } catch (error) {
          console.error('Erro ao registrar conversão:', error)
        }
      }
      
      router.push('/verify-email')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Preencha todos os campos obrigatórios')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem')
        return
      }
    }
    setError('')
    setStep(step + 1)
  }

  const prevStep = () => {
    setError('')
    setStep(step - 1)
  }

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})$/, '$1-$2')
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${
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
        className={`w-full max-w-lg p-8 rounded-3xl shadow-2xl border backdrop-blur-xl relative z-10 ${
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
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">V</span>
            </div>
          </div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Criar sua conta
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
            Junte-se a milhares de profissionais
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Etapa {step} de 2
            </span>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {Math.round((step / 2) * 100)}%
            </span>
          </div>
          <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 2) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {step === 1 && (
          <>
            {/* Social Registration */}
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

            {/* Step 1 Form */}
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nome completo *
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                      isDarkMode 
                        ? 'bg-slate-700/50 border-slate-600 text-white focus:border-orange-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email *
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
                  Senha *
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
                    placeholder="Mínimo 8 caracteres"
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

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Confirmar senha *
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-all ${
                      isDarkMode 
                        ? 'bg-slate-700/50 border-slate-600 text-white focus:border-orange-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                    placeholder="Confirme sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                      isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
                    }`}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={nextStep}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                <span>Continuar</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
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

            {/* Step 2 Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Account Type */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tipo de conta
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setFormData({ ...formData, accountType: 'pessoa_fisica', cnpj: '' })}
                    className={`p-4 rounded-xl border transition-all ${
                      formData.accountType === 'pessoa_fisica'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : isDarkMode 
                          ? 'border-slate-600 text-gray-300 hover:bg-slate-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <User className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Pessoa Física</div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setFormData({ ...formData, accountType: 'pessoa_juridica', cpf: '' })}
                    className={`p-4 rounded-xl border transition-all ${
                      formData.accountType === 'pessoa_juridica'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : isDarkMode 
                          ? 'border-slate-600 text-gray-300 hover:bg-slate-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Building className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Pessoa Jurídica</div>
                  </motion.button>
                </div>
              </div>

              {/* Document */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {formData.accountType === 'pessoa_fisica' ? 'CPF' : 'CNPJ'}
                </label>
                <div className="relative">
                  <FileText className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    value={formData.accountType === 'pessoa_fisica' ? formData.cpf : formData.cnpj}
                    onChange={(e) => {
                      const formatted = formData.accountType === 'pessoa_fisica' 
                        ? formatCPF(e.target.value)
                        : formatCNPJ(e.target.value)
                      setFormData({ 
                        ...formData, 
                        [formData.accountType === 'pessoa_fisica' ? 'cpf' : 'cnpj']: formatted 
                      })
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                      isDarkMode 
                        ? 'bg-slate-700/50 border-slate-600 text-white focus:border-orange-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                    placeholder={formData.accountType === 'pessoa_fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Telefone
                </label>
                <div className="relative">
                  <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                      isDarkMode 
                        ? 'bg-slate-700/50 border-slate-600 text-white focus:border-orange-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Cidade
                  </label>
                  <div className="relative">
                    <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                        isDarkMode 
                          ? 'bg-slate-700/50 border-slate-600 text-white focus:border-orange-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                      placeholder="Sua cidade"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Estado
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${
                      isDarkMode 
                        ? 'bg-slate-700/50 border-slate-600 text-white focus:border-orange-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                  >
                    <option value="">Estado</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="PR">Paraná</option>
                    <option value="SC">Santa Catarina</option>
                    {/* Add more states as needed */}
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={prevStep}
                  className={`flex-1 px-6 py-3 rounded-xl border transition-all ${
                    isDarkMode 
                      ? 'border-slate-600 text-gray-300 hover:bg-slate-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Voltar
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Criar conta</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </>
        )}

        {/* Login Link */}
        <div className="text-center mt-6">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Já tem uma conta?{' '}
          </span>
          <Link 
            href="/login" 
            className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            Fazer login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
