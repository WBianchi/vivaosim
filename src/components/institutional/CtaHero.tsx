'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  ArrowRight, 
  Sparkles, 
  Users, 
  MessageCircle, 
  Calendar, 
  BarChart3, 
  Zap,
  CheckCircle,
  TrendingUp,
  Star,
  Heart,
  Target,
  Rocket
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'

const CtaHero = () => {
  const { isDarkMode } = useTheme()
  const [currentCard, setCurrentCard] = useState(0)

  // Simulated CRM data for animation
  const crmCards = [
    { 
      id: 1, 
      type: 'lead', 
      name: 'Maria Silva', 
      event: 'Casamento', 
      status: 'Novo Lead',
      value: 'R$ 25.000',
      icon: Heart,
      color: 'from-pink-500 to-rose-500'
    },
    { 
      id: 2, 
      type: 'client', 
      name: 'João Santos', 
      event: 'Aniversário', 
      status: 'Em Negociação',
      value: 'R$ 15.000',
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 3, 
      type: 'event', 
      name: 'Ana Costa', 
      event: 'Corporativo', 
      status: 'Confirmado',
      value: 'R$ 45.000',
      icon: Target,
      color: 'from-green-500 to-emerald-500'
    }
  ]

  const notifications = [
    { text: "Novo lead cadastrado!", icon: Sparkles },
    { text: "Evento confirmado!", icon: CheckCircle },
    { text: "Meta mensal atingida!", icon: TrendingUp },
    { text: "Cliente satisfeito ⭐⭐⭐⭐⭐", icon: Star }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % crmCards.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className={`relative py-12 md:py-20 lg:py-32 overflow-hidden ${
      isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-gray-50 via-white to-orange-50'
    }`}>
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated background shapes */}
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

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
          
          {/* Left Side - CRM Animation */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative order-2 lg:order-1 hidden lg:block"
          >
            {/* Main CRM Dashboard */}
            <div className={`relative ${
              isDarkMode ? 'bg-slate-800/90' : 'bg-white/90'
            } backdrop-blur-xl rounded-3xl shadow-2xl border ${
              isDarkMode ? 'border-slate-700' : 'border-gray-200'
            } p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500`}>
              
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Dashboard CRM</h3>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Tempo real</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Leads', value: '1,247', change: '+12%', color: 'text-blue-500' },
                  { label: 'Eventos', value: '89', change: '+8%', color: 'text-green-500' },
                  { label: 'Receita', value: 'R$ 2.1M', change: '+23%', color: 'text-orange-500' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className={`p-4 rounded-xl ${
                      isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'
                    } border ${
                      isDarkMode ? 'border-slate-600' : 'border-gray-200'
                    }`}
                  >
                    <p className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>{stat.label}</p>
                    <p className={`text-lg font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{stat.value}</p>
                    <p className={`text-xs ${stat.color}`}>{stat.change}</p>
                  </motion.div>
                ))}
              </div>

              {/* Animated CRM Cards */}
              <div className="space-y-3">
                <AnimatePresence mode="wait">
                  {crmCards.map((card, index) => {
                    const IconComponent = card.icon
                    return (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, x: -20, scale: 0.9 }}
                        animate={{ 
                          opacity: index === currentCard ? 1 : 0.6,
                          x: 0,
                          scale: index === currentCard ? 1 : 0.95,
                          y: index === currentCard ? 0 : index * 5
                        }}
                        transition={{ duration: 0.5 }}
                        className={`p-4 rounded-xl border ${
                          isDarkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-white border-gray-200'
                        } ${index === currentCard ? 'ring-2 ring-orange-500/50' : ''}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className={`font-semibold ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>{card.name}</p>
                              <span className={`text-sm font-bold ${
                                isDarkMode ? 'text-orange-400' : 'text-orange-600'
                              }`}>{card.value}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className={`text-sm ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>{card.event}</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                card.status === 'Confirmado' 
                                  ? 'bg-green-100 text-green-700' 
                                  : card.status === 'Em Negociação'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {card.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Floating Notifications */}
            <AnimatePresence>
              {notifications.map((notification, index) => {
                const IconComponent = notification.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -100, scale: 0.8 }}
                    animate={{ 
                      opacity: [0, 1, 1, 0],
                      x: [-100, 20, 20, 100],
                      scale: [0.8, 1, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 4,
                      delay: index * 2,
                      repeat: Infinity,
                      repeatDelay: 8
                    }}
                    className={`absolute ${
                      index % 2 === 0 ? 'top-20 -right-10' : 'bottom-20 -left-10'
                    } ${
                      isDarkMode ? 'bg-slate-800' : 'bg-white'
                    } rounded-xl shadow-lg border ${
                      isDarkMode ? 'border-slate-700' : 'border-gray-200'
                    } p-4 flex items-center space-x-3 backdrop-blur-sm`}
                  >
                    <IconComponent className="w-5 h-5 text-orange-500" />
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {notification.text}
                    </span>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {/* Floating Elements */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Rocket className="w-6 h-6 text-white" />
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-4 -left-4 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Zap className="w-5 h-5 text-white" />
            </motion.div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="order-1 lg:order-2 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-200/50 backdrop-blur-sm mb-6 mt-20 md:mt-0 mx-auto lg:mx-0"
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-orange-400' : 'text-orange-600'
              }`}>
                #1 Plataforma de Eventos do Brasil
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`text-3xl md:text-4xl lg:text-6xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } mb-4 md:mb-6 leading-tight`}
            >
              Transforme seus{' '}
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                eventos
              </span>{' '}
              em experiências{' '}
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                inesquecíveis
              </span>
            </motion.h1>

            {/* Paragraph */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={`text-base md:text-xl ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              } mb-6 md:mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0`}
            >
              A plataforma completa que conecta todos os aspectos do seu negócio de eventos. 
              Gerencie leads, organize projetos e maximize seus resultados com inteligência artificial.
            </motion.p>

            {/* Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(249, 115, 22, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const planosSection = document.getElementById('planos')
                  planosSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all cursor-pointer text-sm md:text-base"
              >
                <span>Começar gratuitamente</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const planosSection = document.getElementById('planos')
                  planosSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className={`px-6 md:px-8 py-3 md:py-4 ${
                  isDarkMode 
                    ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700' 
                    : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                } border rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg transition-all backdrop-blur-sm cursor-pointer text-sm md:text-base`}
              >
                <Play className="w-4 h-4 md:w-5 md:h-5" />
                <span>Ver demonstração</span>
              </motion.button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col md:flex-row items-center md:items-center justify-center lg:justify-start gap-4 md:space-x-6 mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-200/50"
            >
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-r ${
                      i % 2 === 0 ? 'from-orange-400 to-pink-400' : 'from-blue-400 to-purple-400'
                    } border-2 border-white flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">{i}</span>
                    </div>
                  ))}
                </div>
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  +50.000 profissionais confiam
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className={`text-sm ml-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  4.9/5 (2.847 avaliações)
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default CtaHero
