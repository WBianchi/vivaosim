'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeProvider'

const RelacionamentoAutomacao = () => {
  const { isDarkMode } = useTheme()
  const [activeFlow, setActiveFlow] = useState(0)

  const automationFlows = [
    {
      title: 'Boas-vindas Personalizadas',
      description: 'Sequência de onboarding adaptativa para novos clientes',
      icon: '👋',
      trigger: 'Novo cliente registrado',
      steps: [
        'Welcome email personalizado',
        'Agendamento call inicial',
        'Guia de primeiros passos',
        'Apresentação success manager'
      ],
      conditions: [
        'Segmento do cliente',
        'Canal de aquisição',
        'Tamanho da conta',
        'Histórico de engajamento'
      ],
      metrics: {
        activation: '89%',
        satisfaction: '9.2/10',
        timeToValue: '5 dias'
      },
      color: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Retenção Proativa',
      description: 'Identifica e previne churn antes que aconteça',
      icon: '🛡️',
      trigger: 'Score de saúde < 70',
      steps: [
        'Alerta para success manager',
        'Outreach personalizado',
        'Reunião de check-in',
        'Plano de recuperação'
      ],
      conditions: [
        'Diminuição uso produto',
        'Feedback negativo',
        'Atraso pagamentos',
        'Redução engajamento'
      ],
      metrics: {
        prevention: '78%',
        recovery: '64%',
        satisfaction: '8.7/10'
      },
      color: 'from-red-500 to-pink-600'
    },
    {
      title: 'Expansão Inteligente',
      description: 'Identifica oportunidades de upsell/cross-sell',
      icon: '📈',
      trigger: 'Cliente com alta adoção',
      steps: [
        'Análise padrões uso',
        'Identificação necessidades',
        'Proposta personalizada',
        'Implementação expansão'
      ],
      conditions: [
        'Usage > 80% features',
        'NPS Score ≥ 8',
        'Growth stage company',
        'Budget disponível'
      ],
      metrics: {
        conversion: '45%',
        expansion: '178%',
        revenue: '+67%'
      },
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Advocacy Program',
      description: 'Transforma clientes satisfeitos em promotores',
      icon: '🌟',
      trigger: 'NPS Score ≥ 9',
      steps: [
        'Convite programa advocacy',
        'Criação case study',
        'Participação eventos',
        'Programa referência'
      ],
      conditions: [
        'Cliente há > 6 meses',
        'Resultados mensuráveis',
        'Executivo engajado',
        'Marca reconhecida'
      ],
      metrics: {
        participation: '34%',
        referrals: '12/mês',
        influence: '890%'
      },
      color: 'from-yellow-500 to-orange-600'
    }
  ]

  return (
    <section className={`py-24 relative overflow-hidden ${
      isDarkMode ? 'bg-slate-800' : 'bg-white'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
              isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-500/10 text-emerald-600'
            }`}>
              🤖 Automação Inteligente
            </div>
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Relacionamentos{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                Automáticos
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              IA cuida dos seus clientes 24/7 com flows personalizados para cada momento da jornada
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Flow Selector */}
            <div className="space-y-6">
              {automationFlows.map((flow, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    activeFlow === index 
                      ? isDarkMode ? 'bg-slate-700/50 border-2 border-emerald-500/50' : 'bg-emerald-50 border-2 border-emerald-200'
                      : isDarkMode ? 'bg-slate-700/20 border border-slate-600 hover:bg-slate-700/40' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveFlow(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${flow.color} flex-shrink-0`}>
                      <span className="text-2xl">{flow.icon}</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {flow.title}
                      </h3>
                      <p className={`text-sm leading-relaxed mb-3 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {flow.description}
                      </p>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        isDarkMode ? 'bg-slate-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}>
                        Trigger: {flow.trigger}
                      </div>
                    </div>

                    <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                      activeFlow === index
                        ? 'bg-emerald-500 text-white'
                        : isDarkMode ? 'bg-slate-600 text-gray-400' : 'bg-gray-200 text-gray-500'
                    }`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Flow Details */}
            <div className="lg:sticky lg:top-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFlow}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className={`p-8 rounded-2xl ${
                    isDarkMode ? 'bg-slate-700/30 border border-slate-600' : 'bg-white border border-gray-200'
                  } shadow-2xl`}
                >
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${automationFlows[activeFlow].color} mb-4`}>
                      <span className="text-4xl">{automationFlows[activeFlow].icon}</span>
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {automationFlows[activeFlow].title}
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {automationFlows[activeFlow].description}
                    </p>
                  </div>

                  {/* Flow Visualization */}
                  <div className="space-y-6">
                    
                    {/* Conditions */}
                    <div>
                      <h4 className={`font-semibold mb-4 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        🎯 Condições de Ativação:
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {automationFlows[activeFlow].conditions.map((condition, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                            className={`p-3 rounded-lg text-sm ${
                              isDarkMode ? 'bg-slate-600/50 text-gray-300' : 'bg-gray-50 text-gray-600'
                            }`}
                          >
                            {condition}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-500 text-white"
                      >
                        ↓
                      </motion.div>
                    </div>

                    {/* Steps */}
                    <div>
                      <h4 className={`font-semibold mb-4 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        ⚡ Passos Automáticos:
                      </h4>
                      <div className="space-y-3">
                        {automationFlows[activeFlow].steps.map((step, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 + 0.3 }}
                            className={`flex items-center p-3 rounded-lg border-l-4 ${
                              isDarkMode ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-emerald-50 border-emerald-500 text-emerald-700'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${automationFlows[activeFlow].color} flex items-center justify-center text-white text-xs font-bold mr-3`}>
                              {idx + 1}
                            </div>
                            <span className="text-sm">{step}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Metrics */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className={`p-4 rounded-xl ${
                        isDarkMode ? 'bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-600' : 'bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200'
                      }`}
                    >
                      <div className="text-center mb-4">
                        <h4 className={`font-semibold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          📊 Métricas de Performance
                        </h4>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(automationFlows[activeFlow].metrics).map(([key, value], index) => (
                          <div key={key} className="text-center">
                            <div className={`text-lg font-bold mb-1 bg-gradient-to-r ${automationFlows[activeFlow].color} bg-clip-text text-transparent`}>
                              {value}
                            </div>
                            <div className={`text-xs capitalize ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`mt-20 p-8 rounded-2xl ${
              isDarkMode ? 'bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-500' : 'bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200'
            }`}
          >
            <div className="text-center mb-8">
              <h3 className={`text-2xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Automação que Funciona
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Resultados comprovados de quem automatizou relacionamentos
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: '24/7', label: 'Sempre Ativo', icon: '🔄' },
                { value: '89%', label: 'Taxa Efetividade', icon: '🎯' },
                { value: '340%', label: 'ROI Médio', icon: '💰' },
                { value: '67%', label: 'Redução Churn', icon: '🛡️' }
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

export default RelacionamentoAutomacao
