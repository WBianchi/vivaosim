'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeProvider'

const PlanejamentoHero = () => {
  const { isDarkMode } = useTheme()
  const [activeMetric, setActiveMetric] = useState(0)
  const [animatedValues, setAnimatedValues] = useState({
    accuracy: 0,
    efficiency: 0,
    roi: 0
  })

  const heroMetrics = [
    {
      title: 'Precisão Preditiva',
      value: 94,
      suffix: '%',
      description: 'Assertividade nas previsões de demanda',
      color: 'from-blue-500 to-cyan-500',
      icon: '🎯'
    },
    {
      title: 'Eficiência Operacional',
      value: 87,
      suffix: '%',
      description: 'Otimização de recursos e processos',
      color: 'from-emerald-500 to-teal-500',
      icon: '⚡'
    },
    {
      title: 'ROI Planejamento',
      value: 340,
      suffix: '%',
      description: 'Retorno sobre investimento médio',
      color: 'from-purple-500 to-pink-500',
      icon: '💰'
    }
  ]

  const planningFeatures = [
    {
      icon: '🔮',
      title: 'Previsão IA',
      description: 'Machine Learning para demanda futura'
    },
    {
      icon: '📊',
      title: 'Cenários Dinâmicos',
      description: 'Múltiplos cenários de planejamento'
    },
    {
      icon: '🎛️',
      title: 'Controle Total',
      description: 'Ajustes em tempo real'
    },
    {
      icon: '📈',
      title: 'Otimização Contínua',
      description: 'Melhoria automática dos modelos'
    }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues({
        accuracy: 94,
        efficiency: 87,
        roi: 340
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % heroMetrics.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className={`relative min-h-screen flex items-center overflow-hidden ${
      isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-white via-blue-50 to-purple-50'
    }`}>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 100, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
          className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
        
        {/* Grid Pattern */}
        <div className={`absolute inset-0 ${
          isDarkMode ? 'opacity-5' : 'opacity-10'
        }`} style={{
          backgroundImage: `linear-gradient(${isDarkMode ? '#ffffff' : '#000000'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                  isDarkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                }`}
              >
                <span className="mr-2">🎯</span>
                Planejamento Estratégico
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className={`text-5xl lg:text-6xl font-bold leading-tight mb-6 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Planejar o{' '}
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 bg-clip-text text-transparent animate-pulse">
                  Futuro
                </span>
                <br />
                Nunca Foi Tão{' '}
                <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  Preciso
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className={`text-xl leading-relaxed mb-8 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                IA avançada que transforma dados históricos em insights preditivos,
                permitindo decisões estratégicas com{' '}
                <span className={`font-bold ${
                  isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                }`}>94% de precisão</span>.
              </motion.p>

              {/* Feature Pills */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                {planningFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className={`flex items-center px-4 py-2 rounded-full ${
                      isDarkMode ? 'bg-slate-700/50 text-gray-300 border border-slate-600' : 'bg-white text-gray-700 border border-gray-200 shadow-sm'
                    } hover:scale-105 transition-transform duration-200`}
                  >
                    <span className="mr-2">{feature.icon}</span>
                    <span className="font-medium text-sm">{feature.title}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Começar Planejamento
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 font-semibold rounded-xl border-2 transition-all duration-200 ${
                    isDarkMode 
                      ? 'border-slate-600 text-white hover:bg-slate-700' 
                      : 'border-gray-200 text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Ver Demonstração
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Side - Interactive Metrics Dashboard */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              {/* Dashboard Container */}
              <div className={`p-8 rounded-3xl backdrop-blur-lg ${
                isDarkMode 
                  ? 'bg-slate-800/60 border border-slate-700 shadow-2xl' 
                  : 'bg-white/60 border border-white/20 shadow-2xl'
              }`}>
                
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Planning Dashboard
                  </h3>
                  <div className={`flex items-center px-3 py-1 rounded-full ${
                    isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-medium">Live</span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {heroMetrics.map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: activeMetric === index ? 1.05 : 1 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                        activeMetric === index
                          ? isDarkMode ? 'bg-gradient-to-br from-slate-700 to-slate-600 border-2 border-blue-500/50' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200'
                          : isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveMetric(index)}
                    >
                      <div className="text-center">
                        <div className={`text-2xl mb-2`}>{metric.icon}</div>
                        <div className={`text-2xl font-bold mb-1 bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                          {index === 0 ? animatedValues.accuracy : index === 1 ? animatedValues.efficiency : animatedValues.roi}
                          {metric.suffix}
                        </div>
                        <div className={`text-xs font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {metric.title}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Active Metric Detail */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMetric}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 rounded-2xl ${
                      isDarkMode ? 'bg-slate-600/30' : 'bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${heroMetrics[activeMetric].color} mr-3`}>
                        <span className="text-white text-lg">{heroMetrics[activeMetric].icon}</span>
                      </div>
                      <div>
                        <h4 className={`font-bold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {heroMetrics[activeMetric].title}
                        </h4>
                        <p className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {heroMetrics[activeMetric].description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className={`h-2 rounded-full ${
                      isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
                    }`}>
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${heroMetrics[activeMetric].color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${
                          activeMetric === 0 ? animatedValues.accuracy : 
                          activeMetric === 1 ? animatedValues.efficiency : 
                          Math.min(animatedValues.roi / 4, 100)
                        }%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Mock Chart Area */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className={`mt-6 h-32 rounded-2xl ${
                    isDarkMode ? 'bg-slate-600/20' : 'bg-gray-100/50'
                  } flex items-end justify-between p-4`}
                >
                  {/* Animated Bars */}
                  {[65, 78, 45, 89, 92, 78, 85, 76, 94].map((height, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.8, delay: 1.2 + index * 0.1 }}
                      className={`w-8 bg-gradient-to-t ${
                        index % 3 === 0 ? 'from-blue-500 to-purple-500' :
                        index % 3 === 1 ? 'from-emerald-500 to-cyan-500' :
                        'from-purple-500 to-pink-500'
                      } rounded-t-lg`}
                    />
                  ))}
                </motion.div>
              </div>

              {/* Floating Info Cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                className={`absolute -top-4 -left-4 p-3 rounded-xl ${
                  isDarkMode ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                } backdrop-blur-sm`}
              >
                <span className="text-sm font-medium">+28% este mês</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.7 }}
                className={`absolute -bottom-4 -right-4 p-3 rounded-xl ${
                  isDarkMode ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-50 text-blue-600 border border-blue-200'
                } backdrop-blur-sm`}
              >
                <span className="text-sm font-medium">IA Ativa</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PlanejamentoHero
