'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Volume2, 
  Maximize, 
  RotateCcw,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'

const Demo = () => {
  const { isDarkMode } = useTheme()
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeDevice, setActiveDevice] = useState('desktop')

  const devices = [
    { id: 'desktop', name: 'Desktop', icon: Monitor },
    { id: 'tablet', name: 'Tablet', icon: Tablet },
    { id: 'mobile', name: 'Mobile', icon: Smartphone }
  ]

  const demoFeatures = [
    { text: 'Dashboard em tempo real', completed: true },
    { text: 'Gestão de leads automática', completed: true },
    { text: 'Integração WhatsApp', completed: true },
    { text: 'Relatórios inteligentes', completed: false },
    { text: 'Automação de workflows', completed: false }
  ]

  return (
    <section className={`relative py-20 lg:py-32 overflow-hidden ${
      isDarkMode ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-b from-gray-50 via-white to-gray-50'
    }`}>
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated mesh gradient */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 90, 180, 270, 360],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-conic from-orange-400 via-pink-400 to-purple-400 rounded-full blur-3xl opacity-10"
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
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
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 backdrop-blur-sm mb-6"
          >
            <Play className="w-4 h-4 text-blue-500" />
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>
              Veja a plataforma em ação
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
            Demonstração{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              interativa
            </span>{' '}
            da plataforma
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className={`text-xl ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } max-w-3xl mx-auto leading-relaxed`}
          >
            Explore todas as funcionalidades em uma demonstração completa. 
            Veja como o Viva o Sim pode revolucionar a gestão dos seus eventos.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Demo Video/Interface */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Device Selector */}
            <div className="flex justify-center mb-8">
              <div className={`inline-flex p-1 rounded-2xl ${
                isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
              } border ${
                isDarkMode ? 'border-slate-700' : 'border-gray-200'
              }`}>
                {devices.map((device) => {
                  const IconComponent = device.icon
                  return (
                    <motion.button
                      key={device.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveDevice(device.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                        activeDevice === device.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : isDarkMode 
                            ? 'text-gray-400 hover:text-white hover:bg-slate-700' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">{device.name}</span>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Demo Interface */}
            <motion.div
              key={activeDevice}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`relative ${
                activeDevice === 'mobile' ? 'max-w-sm mx-auto' :
                activeDevice === 'tablet' ? 'max-w-md mx-auto' :
                'w-full'
              }`}
            >
              <div className={`relative ${
                isDarkMode ? 'bg-slate-800' : 'bg-white'
              } rounded-3xl shadow-2xl border ${
                isDarkMode ? 'border-slate-700' : 'border-gray-200'
              } overflow-hidden backdrop-blur-xl`}>
                
                {/* Browser/App Header */}
                <div className={`flex items-center justify-between p-4 ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'
                } border-b ${
                  isDarkMode ? 'border-slate-600' : 'border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      app.vivaosim.com.br
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </motion.button>
                  </div>
                </div>

                {/* Demo Content */}
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center relative overflow-hidden">
                  
                  {/* Animated Dashboard Elements */}
                  <AnimatePresence mode="wait">
                    {isPlaying ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-4 grid grid-cols-2 gap-4"
                      >
                        {/* Animated Cards */}
                        {[1,2,3,4].map((i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className={`p-4 rounded-xl ${
                              isDarkMode ? 'bg-slate-700/50' : 'bg-white/80'
                            } backdrop-blur-sm border ${
                              isDarkMode ? 'border-slate-600' : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <div className={`w-3 h-3 rounded-full ${
                                i % 2 === 0 ? 'bg-green-500' : 'bg-blue-500'
                              }`}></div>
                              <div className={`h-2 ${
                                isDarkMode ? 'bg-slate-600' : 'bg-gray-200'
                              } rounded flex-1`}></div>
                            </div>
                            <div className={`h-4 ${
                              isDarkMode ? 'bg-slate-600' : 'bg-gray-200'
                            } rounded mb-2`}></div>
                            <div className={`h-2 ${
                              isDarkMode ? 'bg-slate-600' : 'bg-gray-200'
                            } rounded w-2/3`}></div>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto cursor-pointer shadow-lg"
                          onClick={() => setIsPlaying(true)}
                        >
                          <Play className="w-8 h-8 text-white ml-1" />
                        </motion.div>
                        <p className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Clique para iniciar a demonstração
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Floating particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 0.8, 0.3],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut"
                      }}
                      className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + (i % 2) * 40}%`
                      }}
                    />
                  ))}
                </div>

                {/* Controls */}
                <div className={`flex items-center justify-between p-4 ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'
                } border-t ${
                  isDarkMode ? 'border-slate-600' : 'border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-lg ${
                        isDarkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-200'
                      } transition-colors`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-lg ${
                        isDarkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-200'
                      } transition-colors`}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-lg ${
                      isDarkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-200'
                    } transition-colors`}
                  >
                    <Maximize className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Features List */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } mb-6`}>
                O que você verá na demonstração
              </h3>
              
              <div className="space-y-4">
                {demoFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <motion.div
                      animate={feature.completed ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        feature.completed 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                          : isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
                      }`}
                    >
                      {feature.completed && <CheckCircle className="w-4 h-4 text-white" />}
                    </motion.div>
                    <span className={`${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    } ${feature.completed ? 'font-medium' : ''}`}>
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Agendar demonstração personalizada</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <p className={`text-sm text-center ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                ⚡ Demonstração de 15 minutos • 🎯 Focada no seu negócio • 📞 Sem compromisso
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Demo
