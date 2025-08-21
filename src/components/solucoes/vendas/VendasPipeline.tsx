'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeProvider'

const VendasPipeline = () => {
  const { isDarkMode } = useTheme()
  const [activeStage, setActiveStage] = useState(0)

  const pipelineStages = [
    {
      name: 'Captura de Leads',
      icon: '🎯',
      description: 'Formulários inteligentes que capturam leads qualificados automaticamente',
      features: [
        'Landing pages otimizadas',
        'Formulários dinâmicos', 
        'Integração com redes sociais',
        'Chat bot qualificador'
      ],
      color: 'from-blue-500 to-blue-600',
      deals: 47,
      value: 'R$ 94.000'
    },
    {
      name: 'Qualificação',
      icon: '🔍',
      description: 'IA analisa e pontua leads baseado no potencial de conversão',
      features: [
        'Scoring automático',
        'Perfil comportamental',
        'Priorização inteligente',
        'Segmentação avançada'
      ],
      color: 'from-indigo-500 to-indigo-600',
      deals: 32,
      value: 'R$ 128.000'
    },
    {
      name: 'Nutrição',
      icon: '🌱',
      description: 'Sequências personalizadas que educam e aproximam o cliente',
      features: [
        'Email marketing automático',
        'Conteúdo personalizado',
        'WhatsApp integrado',
        'Follow-ups inteligentes'
      ],
      color: 'from-purple-500 to-purple-600',
      deals: 28,
      value: 'R$ 156.000'
    },
    {
      name: 'Proposta',
      icon: '📋',
      description: 'Propostas personalizadas geradas automaticamente',
      features: [
        'Templates profissionais',
        'Cálculo automático',
        'Assinatura digital',
        'Tracking de visualização'
      ],
      color: 'from-orange-500 to-orange-600',
      deals: 19,
      value: 'R$ 190.000'
    },
    {
      name: 'Fechamento',
      icon: '🎉',
      description: 'Automatiza contratos, pagamentos e onboarding',
      features: [
        'Contratos automáticos',
        'Gateway de pagamento',
        'Onboarding guiado',
        'Análise pós-venda'
      ],
      color: 'from-green-500 to-green-600',
      deals: 12,
      value: 'R$ 240.000'
    }
  ]

  return (
    <section className={`py-24 relative overflow-hidden ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-br from-orange-500/10 to-green-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-500/10 text-blue-600'
            }`}>
              Pipeline Inteligente
            </div>
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Do Lead ao 
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                {" "}Fechamento
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Cada etapa otimizada com automação inteligente que multiplica suas conversões
            </p>
          </motion.div>

          {/* Pipeline Visualization */}
          <div className="relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 transform -translate-y-1/2">
              <div className={`w-full h-full rounded-full ${
                isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
              }`}></div>
              {/* Progress line */}
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${((activeStage + 1) / pipelineStages.length) * 100}%` }}
                transition={{ duration: 2, delay: 0.5 }}
              ></motion.div>
            </div>

            {/* Stages */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
              {pipelineStages.map((stage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                  onHoverStart={() => setActiveStage(index)}
                >
                  {/* Stage Card */}
                  <motion.div
                    whileHover={{ y: -10, scale: 1.05 }}
                    className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                      isDarkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'
                    } backdrop-blur-sm hover:shadow-2xl`}
                  >
                    {/* Stage Number & Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stage.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                        {index + 1}
                      </div>
                      <div className="text-3xl">{stage.icon}</div>
                    </div>

                    {/* Stage Info */}
                    <h3 className={`font-bold text-lg mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {stage.name}
                    </h3>

                    <p className={`text-sm mb-4 leading-relaxed ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {stage.description}
                    </p>

                    {/* Stats */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Negócios
                        </span>
                        <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {stage.deals}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Valor
                        </span>
                        <span className={`font-bold text-green-500`}>
                          {stage.value}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className={`w-full h-2 rounded-full mt-4 ${
                      isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
                    }`}>
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${stage.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(stage.deals / 50) * 100}%` }}
                        transition={{ duration: 1.5, delay: index * 0.2 }}
                      ></motion.div>
                    </div>

                    {/* Hover Effect Glow */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stage.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  </motion.div>

                  {/* Stage Details Popup */}
                  <AnimatePresence>
                    {activeStage === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-4 p-4 rounded-xl z-20 min-w-[280px] ${
                          isDarkMode ? 'bg-slate-800 border border-slate-600' : 'bg-white border border-gray-200'
                        } shadow-2xl`}
                      >
                        <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Recursos Inclusos:
                        </h4>
                        <ul className="space-y-2">
                          {stage.features.map((feature, idx) => (
                            <li key={idx} className={`flex items-center text-sm ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stage.color} mr-3 flex-shrink-0`}></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        {/* Arrow */}
                        <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 ${
                          isDarkMode ? 'bg-slate-800 border-l border-t border-slate-600' : 'bg-white border-l border-t border-gray-200'
                        }`}></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Success Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className={`mt-16 p-8 rounded-2xl ${
                isDarkMode ? 'bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-slate-600' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100'
              } backdrop-blur-sm`}
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: 'Taxa de Conversão', value: '47%', icon: '📈' },
                  { label: 'Tempo Médio', value: '12 dias', icon: '⏱️' },
                  { label: 'Valor Médio', value: 'R$ 18.5k', icon: '💰' },
                  { label: 'ROI Médio', value: '340%', icon: '🚀' }
                ].map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl mb-2">{metric.icon}</div>
                    <div className={`text-2xl font-bold mb-1 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {metric.value}
                    </div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VendasPipeline
