'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, 
  X, 
  Crown,
  Zap,
  Star,
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
  Shield,
  Headphones,
  Sparkles,
  ArrowRight,
  Gift,
  Timer
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'
import PaymentModal from './PaymentModal'

const Planos = () => {
  const { isDarkMode } = useTheme()
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [billingCycle, setBillingCycle] = useState('annual')
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<any>(null)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans?status=active')
      const data = await response.json()
      if (data.plans) {
        setPlans(data.plans)
      }
    } catch (error) {
      console.error('Erro ao buscar planos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPlan = (plan: any) => {
    setSelectedPlanForPayment(plan)
    setShowPaymentModal(true)
  }

  const getPlanIcon = (index: number) => {
    const icons = [Zap, Crown, Star]
    return icons[index % icons.length]
  }

  const getPlanColor = (index: number) => {
    const colors = [
      { gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50', darkBg: 'from-blue-900/20 to-cyan-900/20' },
      { gradient: 'from-orange-500 to-red-500', bg: 'from-orange-50 to-red-50', darkBg: 'from-orange-900/20 to-red-900/20' },
      { gradient: 'from-purple-500 to-pink-500', bg: 'from-purple-50 to-pink-50', darkBg: 'from-purple-900/20 to-pink-900/20' }
    ]
    return colors[index % colors.length]
  }

  const additionalFeatures = [
    { icon: Calendar, text: 'Agenda sincronizada', color: 'text-blue-500' },
    { icon: MessageSquare, text: 'Chat em tempo real', color: 'text-green-500' },
    { icon: BarChart3, text: 'Analytics avançados', color: 'text-purple-500' },
    { icon: Shield, text: 'Segurança enterprise', color: 'text-red-500' }
  ]

  const getPrice = (plan: any) => {
    return Number(plan.price || 0)
  }

  const formatFeatures = (features: any) => {
    if (!features) return []
    if (typeof features === 'string') {
      try {
        return JSON.parse(features)
      } catch {
        return []
      }
    }
    return features
  }

  if (loading) {
    return (
      <section className={`relative py-20 lg:py-32 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="container mx-auto px-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        </div>
      </section>
    )
  }

  return (
    <section className={`relative py-20 lg:py-32 overflow-hidden ${
      isDarkMode ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-b from-white via-gray-50 to-white'
    }`}>
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-400/10 to-red-400/10 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
        />

        {/* Price symbols pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Ctext x='20' y='40' font-size='24' font-weight='bold'%3E$%3C/text%3E%3Ctext x='70' y='80' font-size='20'%3E€%3C/text%3E%3Ctext x='30' y='100' font-size='18'%3ER$%3C/text%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px'
          }} />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-200/50 backdrop-blur-sm mb-6"
          >
            <Crown className="w-4 h-4 text-orange-500" />
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-orange-400' : 'text-orange-600'
            }`}>
              Planos e Preços
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className={`text-4xl lg:text-5xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            } mb-6`}
          >
            Escolha o plano{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              perfeito
            </span>{' '}
            para você
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className={`text-xl ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } max-w-3xl mx-auto leading-relaxed mb-8`}
          >
            Transforme seu negócio de eventos com nossa plataforma completa. 
            Teste grátis por 14 dias, sem compromisso.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center justify-center space-x-4"
          >
            <span className={`${billingCycle === 'monthly' ? 'font-semibold' : 'font-normal'} ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Mensal
            </span>
            <motion.button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={`relative w-16 h-8 rounded-full ${
                billingCycle === 'annual' ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gray-300'
              } transition-all duration-300`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ x: billingCycle === 'annual' ? 32 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </motion.button>
            <span className={`${billingCycle === 'annual' ? 'font-semibold' : 'font-normal'} ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Anual
            </span>
            {billingCycle === 'annual' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm rounded-full font-semibold"
              >
                Economize até 30%
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const IconComponent = getPlanIcon(index)
            const colorScheme = getPlanColor(index)
            const isSelected = selectedPlan === plan.id
            const price = getPrice(plan)
            const features = formatFeatures(plan.features)
            const isPopular = index === 1
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative group cursor-pointer p-8 rounded-3xl border-2 transition-all duration-500 ${
                  isSelected || isPopular
                    ? `border-orange-500 ${isDarkMode ? 'bg-slate-800/80' : 'bg-white'} shadow-2xl shadow-orange-500/20`
                    : `${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-white/80'} hover:border-orange-300`
                } backdrop-blur-xl`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-full shadow-lg z-20"
                  >
                    MAIS POPULAR
                  </motion.div>
                )}

                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  isDarkMode ? colorScheme.darkBg : colorScheme.bg
                } opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className={`relative z-10 ${isPopular ? 'pt-8' : ''}`}>
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${colorScheme.gradient} flex items-center justify-center mb-4 mx-auto shadow-lg`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h3 className={`text-2xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    } mb-2`}>
                      {plan.name}
                    </h3>
                    
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {plan.description || 'Plano completo'}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center space-x-2 mb-2">
                      <span className={`text-4xl font-bold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        R$ {price}
                      </span>
                      <span className={`text-lg ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        /mês
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8 min-h-[200px]">
                    {features.map((feature: any, featureIndex: number) => (
                      <motion.div
                        key={feature.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: featureIndex * 0.05 }}
                        viewport={{ once: true }}
                        onMouseEnter={() => setHoveredFeature(feature.name)}
                        onMouseLeave={() => setHoveredFeature(null)}
                        className="flex items-center space-x-3 group/feature cursor-pointer"
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          feature.included 
                            ? 'bg-green-500' 
                            : isDarkMode ? 'bg-slate-600' : 'bg-gray-300'
                        }`}>
                          {feature.included ? (
                            <Check className="w-3 h-3 text-white" />
                          ) : (
                            <X className="w-3 h-3 text-gray-500" />
                          )}
                        </div>
                        <span className={`text-sm ${
                          feature.included 
                            ? isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        } group-hover/feature:text-orange-500 transition-colors`}>
                          {typeof feature === 'string' ? feature : feature.name || feature.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelectPlan(plan)
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300 ${
                      isPopular || isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl'
                        : isDarkMode 
                          ? 'bg-slate-700 text-white hover:bg-slate-600' 
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <span>Assinar agora</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                  
                  <p className={`text-xs text-center mt-3 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    14 dias grátis • Cancele quando quiser
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Additional Features */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className={`p-8 rounded-3xl ${
            isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
          } border ${
            isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'
          } backdrop-blur-xl shadow-xl`}
        >
          <h3 className={`text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          } text-center mb-8`}>
            Todos os planos incluem
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 rounded-2xl border border-gray-200/20 hover:bg-white/10 transition-all duration-300"
                >
                  <IconComponent className={`w-12 h-12 ${feature.color} mx-auto mb-4`} />
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {feature.text}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(249, 115, 22, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold flex items-center space-x-2 shadow-lg mx-auto"
          >
            <Gift className="w-5 h-5" />
            <span>Teste grátis por 14 dias</span>
            <Sparkles className="w-5 h-5" />
          </motion.button>
          
          <p className={`text-sm mt-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            🎯 Sem cartão de crédito • 🚀 Ativação imediata • 💬 Suporte especializado
          </p>
        </motion.div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlanForPayment && (
        <PaymentModal
          plan={selectedPlanForPayment}
          onClose={() => {
            setShowPaymentModal(false)
            setSelectedPlanForPayment(null)
          }}
        />
      )}
    </section>
  )
}

export default Planos
