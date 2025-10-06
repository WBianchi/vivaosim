'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  CreditCard, 
  Smartphone,
  Check,
  Copy,
  QrCode,
  Lock,
  Shield,
  Zap,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Info
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'

interface PaymentModalProps {
  plan: any
  onClose: () => void
}

const PaymentModal: React.FC<PaymentModalProps> = ({ plan, onClose }) => {
  const { isDarkMode } = useTheme()
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix')
  const [step, setStep] = useState<'payment-method' | 'pix-details' | 'card-details'>('payment-method')
  const [pixCopied, setPixCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  // Mock PIX data
  const pixCode = 'pix123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  const pixQRCode = 'https://via.placeholder.com/300x300.png?text=QR+Code+PIX'

  // Card form state
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    cpf: '',
    email: '',
    phone: ''
  })

  const handlePixCopy = () => {
    navigator.clipboard.writeText(pixCode)
    setPixCopied(true)
    setTimeout(() => setPixCopied(false), 2000)
  }

  const handleSelectPaymentMethod = (method: 'pix' | 'card') => {
    setPaymentMethod(method)
    setStep(method === 'pix' ? 'pix-details' : 'card-details')
  }

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simular processamento
    setTimeout(() => {
      setLoading(false)
      alert('🎉 Pagamento processado com sucesso! (Simulação)')
      onClose()
    }, 2000)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`
    }
    return v
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl ${
            isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`sticky top-0 z-10 p-6 border-b backdrop-blur-sm ${
            isDarkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-gray-200'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Finalizar Assinatura
                </h2>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Plano: <span className="font-semibold text-orange-500">{plan.name}</span> • R$ {Number(plan.price).toFixed(2)}/mês
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                }`}
              >
                <X className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </motion.button>
            </div>
          </div>

          <div className="p-6">
            {/* Step 1: Payment Method Selection */}
            {step === 'payment-method' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Escolha sua forma de pagamento
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Pagamento seguro e criptografado
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* PIX Option */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectPaymentMethod('pix')}
                    className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all ${
                      isDarkMode 
                        ? 'bg-slate-800 border-slate-700 hover:border-orange-500' 
                        : 'bg-white border-gray-200 hover:border-orange-500'
                    }`}
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                      >
                        <Smartphone className="w-10 h-10 text-white" />
                      </motion.div>
                      <h4 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        PIX
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Pagamento instantâneo
                      </p>
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500">Aprovação imediata</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Card Option */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectPaymentMethod('card')}
                    className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all ${
                      isDarkMode 
                        ? 'bg-slate-800 border-slate-700 hover:border-orange-500' 
                        : 'bg-white border-gray-200 hover:border-orange-500'
                    }`}
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                      >
                        <CreditCard className="w-10 h-10 text-white" />
                      </motion.div>
                      <h4 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Cartão de Crédito
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Parcele em até 12x
                      </p>
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-blue-500">100% seguro</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Security badges */}
                <div className={`mt-8 p-6 rounded-xl border ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-center gap-8">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        SSL Seguro
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-green-500" />
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Dados Criptografados
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        PCI Compliant
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: PIX Details */}
            {step === 'pix-details' && (
              <div className="space-y-6">
                <button
                  onClick={() => setStep('payment-method')}
                  className={`text-sm flex items-center gap-2 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  ← Voltar
                </button>

                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <QrCode className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Pagar com PIX
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Escaneie o QR Code ou copie o código
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* QR Code */}
                  <div className="space-y-4">
                    <div className={`p-6 rounded-2xl border-2 border-dashed ${
                      isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-gray-300 bg-gray-50'
                    }`}>
                      <img
                        src={pixQRCode}
                        alt="QR Code PIX"
                        className="w-full max-w-[300px] mx-auto rounded-xl"
                      />
                    </div>
                    <div className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Abra seu app de pagamento e escaneie o código
                    </div>
                  </div>

                  {/* PIX Code */}
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Ou copie o código PIX:
                      </label>
                      <div className={`p-4 rounded-xl border ${
                        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <code className={`text-xs break-all ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {pixCode}
                        </code>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePixCopy}
                      className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                    >
                      {pixCopied ? (
                        <>
                          <Check className="w-5 h-5" />
                          Código Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5" />
                          Copiar Código PIX
                        </>
                      )}
                    </motion.button>

                    <div className={`p-4 rounded-xl ${
                      isDarkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                    }`}>
                      <div className="flex gap-3">
                        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                          <p className="font-semibold mb-1">Como pagar:</p>
                          <ol className="list-decimal list-inside space-y-1">
                            <li>Copie o código PIX acima</li>
                            <li>Abra seu app de pagamento</li>
                            <li>Cole o código e confirme</li>
                            <li>Seu acesso será liberado automaticamente</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Card Details */}
            {step === 'card-details' && (
              <div className="space-y-6">
                <button
                  onClick={() => setStep('payment-method')}
                  className={`text-sm flex items-center gap-2 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  ← Voltar
                </button>

                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Dados do Cartão
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Preencha os dados do seu cartão de crédito
                  </p>
                </div>

                <form onSubmit={handleCardSubmit} className="space-y-6">
                  {/* Card Number */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Número do Cartão *
                    </label>
                    <div className="relative">
                      <CreditCard className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="1234 5678 9012 3456"
                        value={cardData.cardNumber}
                        onChange={(e) => setCardData({ ...cardData, cardNumber: formatCardNumber(e.target.value) })}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                          isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Card Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Nome no Cartão *
                    </label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        required
                        placeholder="NOME COMPLETO"
                        value={cardData.cardName}
                        onChange={(e) => setCardData({ ...cardData, cardName: e.target.value.toUpperCase() })}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                          isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Expiry Date */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Validade *
                      </label>
                      <div className="relative">
                        <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <input
                          type="text"
                          required
                          maxLength={5}
                          placeholder="MM/AA"
                          value={cardData.expiryDate}
                          onChange={(e) => setCardData({ ...cardData, expiryDate: formatExpiryDate(e.target.value) })}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                            isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300'
                          }`}
                        />
                      </div>
                    </div>

                    {/* CVV */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        CVV *
                      </label>
                      <div className="relative">
                        <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <input
                          type="text"
                          required
                          maxLength={4}
                          placeholder="123"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                            isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* CPF */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      CPF *
                    </label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        required
                        maxLength={14}
                        placeholder="000.000.000-00"
                        value={cardData.cpf}
                        onChange={(e) => setCardData({ ...cardData, cpf: e.target.value })}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                          isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        E-mail *
                      </label>
                      <div className="relative">
                        <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <input
                          type="email"
                          required
                          placeholder="seu@email.com"
                          value={cardData.email}
                          onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                            isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Telefone *
                      </label>
                      <div className="relative">
                        <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <input
                          type="tel"
                          required
                          placeholder="(00) 00000-0000"
                          value={cardData.phone}
                          onChange={(e) => setCardData({ ...cardData, phone: e.target.value })}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                            isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processando...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Finalizar Pagamento - R$ {Number(plan.price).toFixed(2)}
                      </>
                    )}
                  </motion.button>

                  <div className={`text-center text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Lock className="w-3 h-3 inline mr-1" />
                    Seus dados estão protegidos e criptografados
                  </div>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PaymentModal
