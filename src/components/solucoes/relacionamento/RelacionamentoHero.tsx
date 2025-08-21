'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeProvider'

const RelacionamentoHero = () => {
  const { isDarkMode } = useTheme()

  const stats = [
    { value: '98%', label: 'Satisfação', color: 'text-emerald-500' },
    { value: '340%', label: 'Mais Retenção', color: 'text-blue-500' },
    { value: '67%', label: 'Redução Churn', color: 'text-purple-500' },
    { value: '24h', label: 'Resposta Média', color: 'text-orange-500' }
  ]

  return (
    <section className={`py-24 lg:py-32 relative overflow-hidden ${
      isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-white via-blue-50/30 to-white'
    }`}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-1/2 -right-1/2 w-full h-full rounded-full ${
          isDarkMode ? 'bg-gradient-to-l from-blue-600/10 to-purple-600/10' : 'bg-gradient-to-l from-blue-200/20 to-purple-200/20'
        } blur-3xl`} />
        <div className={`absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full ${
          isDarkMode ? 'bg-gradient-to-r from-emerald-600/10 to-blue-600/10' : 'bg-gradient-to-r from-emerald-200/20 to-blue-200/20'
        } blur-3xl`} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-8 ${
                isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-200'
              }`}>
                🤝 CRM Inteligente
              </div>
              
              <h1 className={`text-5xl lg:text-7xl font-bold mb-8 leading-tight ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Relacionamentos que{' '}
                <span className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Duram
                </span>
              </h1>
              
              <p className={`text-xl lg:text-2xl mb-10 leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Transforme cada interação em uma oportunidade de fortalecer vínculos e 
                aumentar o lifetime value dos seus clientes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-2xl font-semibold text-lg shadow-2xl shadow-emerald-500/25"
                >
                  Começar Relacionamento
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 rounded-2xl font-semibold text-lg border-2 transition-all ${
                    isDarkMode 
                      ? 'border-slate-600 text-white hover:border-emerald-500 hover:bg-emerald-500/10' 
                      : 'border-gray-200 text-gray-900 hover:border-emerald-500 hover:bg-emerald-50'
                  }`}
                >
                  Ver Demonstração
                </motion.button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                    className={`p-4 rounded-xl ${
                      isDarkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white/80 border border-gray-200'
                    } backdrop-blur-sm`}
                  >
                    <div className={`text-2xl font-bold mb-1 ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CRM Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className={`relative rounded-3xl p-6 ${
                isDarkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white/90 border border-gray-200'
              } backdrop-blur-xl shadow-2xl`}>
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    CRM Dashboard
                  </div>
                </div>

                {/* Customer Cards */}
                <div className="space-y-4">
                  {[
                    { name: 'Ana Silva', company: 'Tech Corp', score: 95, status: 'hot' },
                    { name: 'Carlos Lima', company: 'Digital Inc', score: 88, status: 'warm' },
                    { name: 'Maria Santos', company: 'Innovation Ltd', score: 76, status: 'cold' }
                  ].map((customer, index) => (
                    <motion.div
                      key={customer.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className={`p-4 rounded-xl border ${
                        isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`font-semibold mb-1 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {customer.name}
                          </div>
                          <div className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {customer.company}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            customer.status === 'hot' 
                              ? 'bg-red-100 text-red-700' 
                              : customer.status === 'warm'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {customer.score}%
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Activity Feed */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
                  <div className={`text-sm font-medium mb-3 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Atividades Recentes
                  </div>
                  <div className="space-y-2">
                    {[
                      '📧 Email enviado para Ana Silva',
                      '📞 Ligação agendada com Carlos Lima',
                      '🎯 Follow-up automático disparado'
                    ].map((activity, index) => (
                      <motion.div
                        key={activity}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {activity}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RelacionamentoHero
