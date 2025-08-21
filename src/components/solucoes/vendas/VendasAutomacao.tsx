'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeProvider'

const VendasAutomacao = () => {
  const { isDarkMode } = useTheme()
  const [activeAutomation, setActiveAutomation] = useState(0)

  const automations = [
    {
      title: 'Follow-up Inteligente',
      description: 'Sequências personalizadas que nunca deixam um lead esfriar',
      icon: '🎯',
      triggers: [
        'Lead não responde em 3 dias',
        'Proposta visualizada mas não respondida', 
        'Cliente em dúvida sobre preço',
        'Reunião agendada se aproximando'
      ],
      actions: [
        'Email personalizado enviado',
        'WhatsApp automático disparado',
        'Tarefa criada para vendedor',
        'Lembrete no calendário'
      ],
      results: '+73% taxa de resposta',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Nutrição de Leads',
      description: 'Eduque leads com conteúdo relevante até ficarem prontos para comprar',
      icon: '🌱',
      triggers: [
        'Lead baixa material',
        'Visita página de preços',
        'Abre 3+ emails consecutivos',
        'Compartilha conteúdo'
      ],
      actions: [
        'Série educativa disparada',
        'Cases de sucesso enviados',
        'Convite para webinar',
        'Desconto especial ofertado'
      ],
      results: '+156% leads qualificados',
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Recuperação de Carrinho',
      description: 'Resgata propostas abandonadas e fecha mais vendas',
      icon: '🔄',
      triggers: [
        'Proposta não visualizada em 24h',
        'Cliente abandona checkout',
        'Orçamento expirou',
        'Desconto especial liberado'
      ],
      actions: [
        'Lembrete urgente enviado',
        'Ligação agendada automaticamente',
        'Desconto progressivo aplicado',
        'Social proof destacado'
      ],
      results: '+89% conversões recuperadas',
      color: 'from-orange-500 to-red-600'
    },
    {
      title: 'Pós-Venda Automático',
      description: 'Transforma clientes em fãs e promotores da marca',
      icon: '⭐',
      triggers: [
        'Contrato assinado',
        'Evento realizado',
        'Feedback solicitado',
        'Renovação se aproximando'
      ],
      actions: [
        'Onboarding guiado iniciado',
        'Pesquisa de satisfação enviada',
        'Upsell personalizado oferecido',
        'Programa de indicação ativado'
      ],
      results: '+240% lifetime value',
      color: 'from-purple-500 to-pink-600'
    }
  ]

  return (
    <section className={`py-24 relative overflow-hidden ${
      isDarkMode ? 'bg-slate-800' : 'bg-white'
    }`}>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              isDarkMode ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-500/10 text-purple-600'
            }`}>
              Automação 24/7
            </div>
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Venda Enquanto{' '}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Você Dorme
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Automações inteligentes que trabalham incansavelmente para multiplicar suas vendas
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              {automations.map((automation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    activeAutomation === index 
                      ? isDarkMode ? 'bg-slate-700/50 border-2 border-purple-500/50' : 'bg-purple-50 border-2 border-purple-200'
                      : isDarkMode ? 'bg-slate-700/20 border border-slate-600 hover:bg-slate-700/40' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveAutomation(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${automation.color} flex-shrink-0`}>
                      <span className="text-2xl">{automation.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {automation.title}
                      </h3>
                      <p className={`text-sm leading-relaxed mb-3 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {automation.description}
                      </p>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-500/10 text-green-600'
                      }`}>
                        {automation.results}
                      </div>
                    </div>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                      activeAutomation === index
                        ? 'bg-purple-500 text-white'
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

            <div className="lg:sticky lg:top-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeAutomation}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className={`p-8 rounded-2xl ${
                    isDarkMode ? 'bg-slate-700/30 border border-slate-600' : 'bg-white border border-gray-200'
                  } shadow-2xl`}
                >
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${automations[activeAutomation].color} mb-4`}>
                      <span className="text-4xl">{automations[activeAutomation].icon}</span>
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {automations[activeAutomation].title}
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {automations[activeAutomation].description}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className={`font-semibold mb-4 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        🎬 Disparadores:
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {automations[activeAutomation].triggers.map((trigger, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                            className={`p-3 rounded-lg text-sm ${
                              isDarkMode ? 'bg-slate-600/50 text-gray-300' : 'bg-gray-50 text-gray-600'
                            }`}
                          >
                            {trigger}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-500 text-white"
                      >
                        ↓
                      </motion.div>
                    </div>

                    <div>
                      <h4 className={`font-semibold mb-4 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        ⚡ Ações Automáticas:
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {automations[activeAutomation].actions.map((action, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 + 0.3 }}
                            className={`p-3 rounded-lg text-sm border-2 border-dashed ${
                              isDarkMode ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-green-500/50 bg-green-500/5 text-green-600'
                            }`}
                          >
                            {action}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className={`p-4 rounded-xl text-center ${
                        isDarkMode ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30' : 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200'
                      }`}
                    >
                      <div className="text-2xl mb-2">🎉</div>
                      <div className={`font-bold text-lg ${
                        isDarkMode ? 'text-green-400' : 'text-green-600'
                      }`}>
                        {automations[activeAutomation].results}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`mt-20 p-8 rounded-2xl ${
              isDarkMode ? 'bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-500' : 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200'
            }`}
          >
            <div className="text-center mb-8">
              <h3 className={`text-2xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Resultados Comprovados
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Métricas reais de clientes que usam nossas automações
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: '24/7', label: 'Funcionamento', icon: '🕒' },
                { value: '0%', label: 'Leads Perdidos', icon: '🎯' },
                { value: '400%', label: 'Mais Follow-ups', icon: '📞' },
                { value: '67%', label: 'Menos Trabalho Manual', icon: '🤖' }
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

export default VendasAutomacao
