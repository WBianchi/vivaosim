'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeProvider'

const RelacionamentoSegmentacao = () => {
  const { isDarkMode } = useTheme()
  const [activeSegment, setActiveSegment] = useState(0)

  const segments = [
    {
      title: 'VIP Champions',
      description: 'Clientes de alto valor que promovem sua marca',
      icon: '👑',
      criteria: [
        'LTV > R$ 50.000',
        'NPS Score ≥ 9',
        'Engajamento 90%+',
        'Indicações ativas'
      ],
      actions: [
        'Atendimento prioritário',
        'Acesso antecipado',
        'Eventos exclusivos',
        'Programa embaixador'
      ],
      count: '127',
      revenue: '40%',
      color: 'from-yellow-500 to-amber-600',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30'
    },
    {
      title: 'Fiéis Crescentes',
      description: 'Base sólida com potencial de crescimento',
      icon: '📈',
      criteria: [
        'LTV R$ 10k - 50k',
        'NPS Score 7-8',
        'Recorrência alta',
        'Upsell receptivo'
      ],
      actions: [
        'Ofertas personalizadas',
        'Cross-sell estratégico',
        'Conteúdo educativo',
        'Feedback surveys'
      ],
      count: '843',
      revenue: '35%',
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30'
    },
    {
      title: 'Novos Promissores',
      description: 'Clientes recentes com grande potencial',
      icon: '✨',
      criteria: [
        'Cliente < 6 meses',
        'Engajamento alto',
        'Perfil target',
        'Crescimento rápido'
      ],
      actions: [
        'Onboarding VIP',
        'Check-ins frequentes',
        'Aceleração value',
        'Nurturing intensivo'
      ],
      count: '312',
      revenue: '15%',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      title: 'Risco de Churn',
      description: 'Clientes que precisam de atenção urgente',
      icon: '🚨',
      criteria: [
        'Engajamento < 30%',
        'NPS Score ≤ 6',
        'Sem compras 90d',
        'Suporte recorrente'
      ],
      actions: [
        'Outreach imediato',
        'Oferta de retenção',
        'Success manager',
        'Recovery campaign'
      ],
      count: '156',
      revenue: '10%',
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30'
    }
  ]

  return (
    <section className={`py-24 relative overflow-hidden ${
      isDarkMode ? 'bg-slate-800' : 'bg-white'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
              🎯 Segmentação Inteligente
            </div>
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Cada Cliente é{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                Único
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              IA avançada categoriza automaticamente seus clientes para estratégias personalizadas
            </p>
          </motion.div>

          {/* Segments Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {segments.map((segment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                  activeSegment === index 
                    ? `${segment.bgColor} ${segment.borderColor} scale-105` 
                    : isDarkMode ? 'bg-slate-700/20 border-slate-600 hover:bg-slate-700/40' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => setActiveSegment(index)}
                whileHover={{ scale: activeSegment === index ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${segment.color} flex-shrink-0`}>
                      <span className="text-2xl">{segment.icon}</span>
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg mb-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {segment.title}
                      </h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {segment.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-2xl font-bold mb-1 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {segment.count}
                    </div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      clientes
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className={`font-semibold mb-2 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      📋 Critérios:
                    </h4>
                    <ul className="space-y-1">
                      {segment.criteria.map((criterion, idx) => (
                        <li key={idx} className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          • {criterion}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className={`font-semibold mb-2 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      🎯 Ações:
                    </h4>
                    <ul className="space-y-1">
                      {segment.actions.map((action, idx) => (
                        <li key={idx} className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          • {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={`pt-4 border-t ${
                  isDarkMode ? 'border-slate-600' : 'border-gray-200'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Impacto na Receita
                    </span>
                    <span className={`text-lg font-bold bg-gradient-to-r ${segment.color} bg-clip-text text-transparent`}>
                      {segment.revenue}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Insights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`p-8 rounded-2xl ${
              isDarkMode ? 'bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-500' : 'bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200'
            }`}
          >
            <div className="text-center mb-8">
              <h3 className={`text-2xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Inteligência de Segmentação
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                IA analisa 50+ variáveis para segmentação automática precisa
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: '98.7%', label: 'Precisão IA', icon: '🧠' },
                { value: '24/7', label: 'Auto-Update', icon: '⚡' },
                { value: '340%', label: 'ROI Médio', icon: '📊' },
                { value: '50+', label: 'Data Points', icon: '🎯' }
              ].map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl mb-2">{insight.icon}</div>
                  <div className={`text-3xl font-bold mb-1 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {insight.value}
                  </div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {insight.label}
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

export default RelacionamentoSegmentacao
