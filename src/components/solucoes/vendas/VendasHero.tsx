'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeProvider'

const VendasHero = () => {
  const { isDarkMode } = useTheme()

  return (
    <section className={`relative min-h-screen flex items-center overflow-hidden ${
      isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-500 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern */}
      <div className={`absolute inset-0 ${
        isDarkMode ? 'opacity-[0.02]' : 'opacity-[0.03]'
      }`} style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, ${isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'} 1px, transparent 0)`,
        backgroundSize: '24px 24px'
      }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Content Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium ${
                  isDarkMode 
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                    : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                } backdrop-blur-sm`}
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                CRM de Vendas Inteligente
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className={`text-5xl lg:text-6xl font-bold leading-tight ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Venda Mais,
                <br />
                <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  Stress Menos
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className={`text-xl leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Transforme leads em clientes fiéis com automação inteligente, 
                follow-ups personalizados e pipeline visual que converte mais.
              </motion.p>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-wrap gap-8"
              >
                {[
                  { value: '300%', label: 'Mais Conversões' },
                  { value: '85%', label: 'Menos Tempo' },
                  { value: '24/7', label: 'Automação' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-2xl font-bold ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      {stat.value}
                    </div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                >
                  Começar Vendendo Mais
                  <motion.svg 
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 border-2 font-semibold rounded-xl transition-all duration-300 ${
                    isDarkMode 
                      ? 'border-slate-600 text-white hover:bg-slate-800' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Ver Demo Gratuita
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Visual Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              {/* Main Dashboard Mockup */}
              <div className={`relative p-6 rounded-2xl shadow-2xl ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'
              } backdrop-blur-sm border ${
                isDarkMode ? 'border-slate-700' : 'border-white/20'
              }`}>
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs ${
                    isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-500/10 text-green-600'
                  }`}>
                    Live
                  </div>
                </div>

                {/* Sales Pipeline */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Pipeline de Vendas
                    </h3>
                    <div className="text-blue-500 font-bold">R$ 147.500</div>
                  </div>

                  {/* Pipeline Stages */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { stage: 'Leads', count: 23, color: 'bg-blue-500' },
                      { stage: 'Contato', count: 15, color: 'bg-yellow-500' },
                      { stage: 'Proposta', count: 8, color: 'bg-orange-500' },
                      { stage: 'Fechado', count: 5, color: 'bg-green-500' }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                        className={`p-3 rounded-lg ${
                          isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'
                        }`}
                      >
                        <div className={`w-full h-2 rounded-full ${item.color} mb-2`}></div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.stage}
                        </div>
                        <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.count}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent Activities */}
                  <div className="space-y-2 pt-4">
                    {[
                      'João Silva - Proposta enviada',
                      'Maria Costa - Follow-up agendado',
                      'Pedro Oliveira - Contrato assinado'
                    ].map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 1.2 + (index * 0.1) }}
                        className={`flex items-center space-x-3 p-2 rounded-lg ${
                          isDarkMode ? 'bg-slate-700/30' : 'bg-gray-50/50'
                        }`}
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {activity}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className={`absolute -top-4 -right-4 p-4 rounded-xl ${
                  isDarkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'
                } backdrop-blur-sm border ${
                  isDarkMode ? 'border-blue-500/30' : 'border-blue-500/20'
                }`}
              >
                <div className="text-blue-500 font-bold text-lg">+47%</div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Conversão
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                className={`absolute -bottom-4 -left-4 p-4 rounded-xl ${
                  isDarkMode ? 'bg-green-500/20' : 'bg-green-500/10'
                } backdrop-blur-sm border ${
                  isDarkMode ? 'border-green-500/30' : 'border-green-500/20'
                }`}
              >
                <div className="text-green-500 font-bold text-lg">R$ 23k</div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Hoje
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VendasHero
