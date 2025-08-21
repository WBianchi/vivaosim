'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeProvider'

const RelacionamentoJornada = () => {
  const { isDarkMode } = useTheme()
  const [activeStage, setActiveStage] = useState(0)

  const journeyStages = [
    {
      title: 'Descoberta',
      description: 'Primeiro contato e interesse inicial',
      icon: '🔍',
      duration: '0-7 dias',
      touchpoints: [
        'Website/Landing Pages',
        'Redes Sociais',
        'Anúncios Online',
        'Indicações/Referências'
      ],
      actions: [
        'Captura de lead qualificado',
        'Welcome sequence automática',
        'Conteúdo educativo inicial',
        'Score de interesse'
      ],
      metrics: [
        { label: 'Taxa Conversão', value: '15.7%' },
        { label: 'Tempo Médio', value: '3.2 dias' }
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Consideração',
      description: 'Avaliação ativa da solução',
      icon: '🤔',
      duration: '7-30 dias',
      touchpoints: [
        'Demo/Apresentação',
        'Trial/Teste Gratuito',
        'Consultoria Comercial',
        'Cases de Sucesso'
      ],
      actions: [
        'Demonstrações personalizadas',
        'Comparativos detalhados',
        'ROI calculators',
        'Prova de conceito'
      ],
      metrics: [
        { label: 'Taxa Conversão', value: '28.4%' },
        { label: 'Tempo Médio', value: '18 dias' }
      ],
      color: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'Decisão',
      description: 'Processo de compra e fechamento',
      icon: '✅',
      duration: '30-45 dias',
      touchpoints: [
        'Proposta Comercial',
        'Negociação Termos',
        'Aprovação Interna',
        'Assinatura Contrato'
      ],
      actions: [
        'Proposta personalizada',
        'Suporte à aprovação',
        'Urgência estratégica',
        'Onboarding planejado'
      ],
      metrics: [
        { label: 'Taxa Conversão', value: '67.2%' },
        { label: 'Tempo Médio', value: '12 dias' }
      ],
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Onboarding',
      description: 'Implementação e primeiros resultados',
      icon: '🚀',
      duration: '45-90 dias',
      touchpoints: [
        'Kick-off Meeting',
        'Treinamentos',
        'Implementação',
        'Go-Live Support'
      ],
      actions: [
        'Plano de implementação',
        'Success manager dedicado',
        'Treinamento intensivo',
        'Quick wins identificados'
      ],
      metrics: [
        { label: 'Taxa Sucesso', value: '89.6%' },
        { label: 'Time to Value', value: '21 dias' }
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Crescimento',
      description: 'Expansão e maximização de valor',
      icon: '📈',
      duration: '90+ dias',
      touchpoints: [
        'Health Checks',
        'Quarterly Reviews',
        'Expansion Opportunities',
        'Advocacy Programs'
      ],
      actions: [
        'Upsell/Cross-sell',
        'Renewal antecipado',
        'Programa embaixador',
        'Feedback contínuo'
      ],
      metrics: [
        { label: 'Expansion Rate', value: '145%' },
        { label: 'Retention', value: '94.8%' }
      ],
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  return (
    <section className={`py-24 relative overflow-hidden ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
              🗺️ Customer Journey
            </div>
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Mapeie Toda a{' '}
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Jornada
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Visualize e otimize cada etapa da experiência do cliente para máxima conversão e retenção
            </p>
          </motion.div>

          {/* Journey Timeline */}
          <div className="relative mb-16">
            {/* Progress Line */}
            <div className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-500 via-orange-500 via-purple-500 to-yellow-500 rounded-full opacity-30"></div>
            
            <div className="flex justify-between items-start relative">
              {journeyStages.map((stage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex-1 cursor-pointer transition-all duration-300 ${
                    index < journeyStages.length - 1 ? 'mr-4' : ''
                  }`}
                  onClick={() => setActiveStage(index)}
                >
                  <div className="flex flex-col items-center">
                    {/* Stage Icon */}
                    <motion.div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${stage.color} flex items-center justify-center text-2xl mb-4 shadow-lg relative z-10 ${
                        activeStage === index ? 'scale-110' : 'scale-100'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {stage.icon}
                    </motion.div>
                    
                    {/* Stage Info */}
                    <div className="text-center">
                      <h3 className={`font-bold text-lg mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {stage.title}
                      </h3>
                      <p className={`text-sm mb-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {stage.duration}
                      </p>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        activeStage === index 
                          ? 'bg-gradient-to-r ' + stage.color + ' text-white'
                          : isDarkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {activeStage === index ? 'Selecionado' : 'Clique para ver'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stage Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className={`p-8 rounded-2xl ${
                isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
              } shadow-2xl`}
            >
              <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Stage Overview */}
                <div>
                  <div className={`flex items-center mb-4`}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${journeyStages[activeStage].color} flex items-center justify-center text-2xl mr-4`}>
                      {journeyStages[activeStage].icon}
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {journeyStages[activeStage].title}
                      </h3>
                      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {journeyStages[activeStage].description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {journeyStages[activeStage].metrics.map((metric, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {metric.label}:
                        </span>
                        <span className={`font-bold text-lg bg-gradient-to-r ${journeyStages[activeStage].color} bg-clip-text text-transparent`}>
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Touchpoints */}
                <div>
                  <h4 className={`font-semibold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    📱 Pontos de Contato:
                  </h4>
                  <div className="space-y-3">
                    {journeyStages[activeStage].touchpoints.map((touchpoint, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`p-3 rounded-lg ${
                          isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'
                        }`}
                      >
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {touchpoint}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h4 className={`font-semibold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    🎯 Ações Estratégicas:
                  </h4>
                  <div className="space-y-3">
                    {journeyStages[activeStage].actions.map((action, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`p-3 rounded-lg border-l-4 border-gradient-to-b ${journeyStages[activeStage].color} ${
                          isDarkMode ? 'bg-slate-700/30 border-l-blue-500' : 'bg-blue-50 border-l-blue-500'
                        }`}
                      >
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {action}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`mt-16 p-8 rounded-2xl ${
              isDarkMode ? 'bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600' : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
            }`}
          >
            <div className="text-center mb-8">
              <h3 className={`text-2xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Jornada Otimizada
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Resultados comprovados de uma jornada bem mapeada
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: '340%', label: 'Conversão Geral', icon: '🎯' },
                { value: '67%', label: 'Redução CAC', icon: '💰' },
                { value: '28 dias', label: 'Ciclo Médio', icon: '⚡' },
                { value: '94.8%', label: 'Satisfação', icon: '😍' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className={`text-3xl font-bold mb-1 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
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
        </div>
      </div>
    </section>
  )
}

export default RelacionamentoJornada
