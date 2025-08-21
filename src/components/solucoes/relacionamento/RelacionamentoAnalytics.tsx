'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeProvider'

const RelacionamentoAnalytics = () => {
  const { isDarkMode } = useTheme()
  const [selectedMetric, setSelectedMetric] = useState(0)
  const [animatedValues, setAnimatedValues] = useState({
    nps: 0,
    retention: 0,
    ltv: 0,
    satisfaction: 0
  })

  const metrics = [
    {
      title: 'Net Promoter Score (NPS)',
      value: 73,
      target: 80,
      trend: '+12%',
      description: 'Mede a probabilidade de recomendação',
      icon: '🎯',
      color: 'from-emerald-500 to-teal-600',
      details: {
        promoters: '67%',
        passives: '21%',
        detractors: '12%',
        benchmark: 'Acima da média do setor (45)'
      }
    },
    {
      title: 'Taxa de Retenção',
      value: 94,
      target: 95,
      trend: '+8%',
      description: 'Clientes que renovam contratos',
      icon: '🔄',
      color: 'from-blue-500 to-indigo-600',
      details: {
        monthly: '98.2%',
        annual: '94.1%',
        cohort: 'Q1/2024: 96.8%',
        benchmark: 'Top quartil da indústria'
      }
    },
    {
      title: 'Lifetime Value (LTV)',
      value: 24500,
      target: 30000,
      trend: '+18%',
      description: 'Valor total do relacionamento',
      icon: '💎',
      color: 'from-purple-500 to-pink-600',
      details: {
        avgMonthly: 'R$ 2.890',
        avgDuration: '18 meses',
        expansion: '+23% upsell rate',
        benchmark: '40% acima da média'
      }
    },
    {
      title: 'Satisfação Geral',
      value: 91,
      target: 93,
      trend: '+5%',
      description: 'Score médio de satisfação',
      icon: '😍',
      color: 'from-yellow-500 to-orange-600',
      details: {
        support: '9.2/10',
        product: '8.8/10',
        implementation: '9.1/10',
        benchmark: 'Excelência comprovada'
      }
    }
  ]

  const channels = [
    { name: 'Email', engagement: 78, conversions: 23, icon: '📧' },
    { name: 'WhatsApp', engagement: 89, conversions: 45, icon: '📱' },
    { name: 'Phone', engagement: 67, conversions: 78, icon: '📞' },
    { name: 'In-app', engagement: 92, conversions: 34, icon: '💬' },
    { name: 'SMS', engagement: 45, conversions: 12, icon: '📲' },
    { name: 'Video Call', engagement: 95, conversions: 89, icon: '📹' }
  ]

  const cohortData = [
    { month: 'Jan', retention: 100, churn: 0, expansion: 0 },
    { month: 'Fev', retention: 96, churn: 4, expansion: 8 },
    { month: 'Mar', retention: 94, churn: 2, expansion: 15 },
    { month: 'Abr', retention: 92, churn: 2, expansion: 23 },
    { month: 'Mai', retention: 91, churn: 1, expansion: 28 },
    { month: 'Jun', retention: 90, churn: 1, expansion: 31 }
  ]

  // Animate values on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues({
        nps: 73,
        retention: 94,
        ltv: 245,
        satisfaction: 91
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className={`py-24 relative overflow-hidden ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
              isDarkMode ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-500/10 text-purple-600'
            }`}>
              📊 Analytics Avançado
            </div>
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Insights que{' '}
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Transformam
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Dashboards inteligentes que revelam o verdadeiro valor dos seus relacionamentos
            </p>
          </motion.div>

          {/* Main Metrics Cards */}
          <div className="grid lg:grid-cols-4 gap-6 mb-16">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                  selectedMetric === index
                    ? isDarkMode ? 'bg-slate-700/50 border-2 border-purple-500/50' : 'bg-white border-2 border-purple-200 shadow-lg'
                    : isDarkMode ? 'bg-slate-800/50 border border-slate-700 hover:bg-slate-700/30' : 'bg-white border border-gray-200 hover:shadow-md'
                }`}
                onClick={() => setSelectedMetric(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} flex-shrink-0`}>
                    <span className="text-2xl">{metric.icon}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-sm font-medium ${
                    isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {metric.trend}
                  </div>
                </div>

                <div className="mb-3">
                  <div className={`text-3xl font-bold mb-1 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {metric.title === 'Lifetime Value (LTV)' 
                      ? `R$ ${(animatedValues.ltv * 100).toLocaleString()}`
                      : `${index === 0 ? animatedValues.nps : index === 1 ? animatedValues.retention : animatedValues.satisfaction}${metric.title !== 'Lifetime Value (LTV)' ? '%' : ''}`
                    }
                  </div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Meta: {metric.title === 'Lifetime Value (LTV)' ? `R$ ${metric.target.toLocaleString()}` : `${metric.target}%`}
                  </div>
                </div>

                <h3 className={`font-semibold text-lg mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {metric.title}
                </h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {metric.description}
                </p>

                {/* Progress Bar */}
                <div className={`mt-4 h-2 rounded-full ${
                  isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
                }`}>
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${metric.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(metric.value / metric.target) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detailed Analysis */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            
            {/* Selected Metric Details */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedMetric}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className={`p-8 rounded-2xl ${
                    isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                  } shadow-xl`}
                >
                  <div className="flex items-center mb-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${metrics[selectedMetric].color} mr-4`}>
                      <span className="text-3xl">{metrics[selectedMetric].icon}</span>
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {metrics[selectedMetric].title}
                      </h3>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Análise Detalhada
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {Object.entries(metrics[selectedMetric].details).map(([key, value], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`p-4 rounded-lg ${
                          isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'
                        }`}
                      >
                        <div className={`font-semibold text-lg mb-1 bg-gradient-to-r ${metrics[selectedMetric].color} bg-clip-text text-transparent`}>
                          {value}
                        </div>
                        <div className={`text-sm capitalize ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Channel Performance */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`p-6 rounded-2xl ${
                isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
              } shadow-xl`}
            >
              <h3 className={`text-xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                📢 Performance por Canal
              </h3>

              <div className="space-y-4">
                {channels.map((channel, index) => (
                  <motion.div
                    key={channel.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-slate-700/30' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">{channel.icon}</span>
                        <span className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {channel.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${
                          isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                        }`}>
                          {channel.conversions}% conv
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          Engajamento
                        </span>
                        <span>{channel.engagement}%</span>
                      </div>
                      <div className={`h-2 rounded-full ${
                        isDarkMode ? 'bg-slate-600' : 'bg-gray-200'
                      }`}>
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${channel.engagement}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Cohort Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-8 rounded-2xl ${
              isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
            } shadow-xl mb-16`}
          >
            <div className="text-center mb-8">
              <h3 className={`text-2xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                📈 Análise de Coorte
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Comportamento dos clientes ao longo do tempo
              </p>
            </div>

            <div className="grid grid-cols-6 gap-4">
              {cohortData.map((data, index) => (
                <motion.div
                  key={data.month}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`p-4 rounded-lg mb-2 ${
                    isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'
                  }`}>
                    <div className={`text-2xl font-bold mb-1 ${
                      isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                    }`}>
                      {data.retention}%
                    </div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Retenção
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {data.month}
                  </div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    +{data.expansion}% exp
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-center p-8 rounded-2xl ${
              isDarkMode ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30' : 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200'
            }`}
          >
            <h3 className={`text-2xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Transforme Dados em Decisões
            </h3>
            <p className={`text-lg mb-6 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Dashboards que mostram não apenas o que aconteceu, mas o que fazer em seguida
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: '99,9% Uptime', icon: '⚡' },
                { label: 'Real-time', icon: '🔄' },
                { label: 'IA Predictive', icon: '🤖' },
                { label: 'Custom Reports', icon: '📊' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex items-center px-4 py-2 rounded-full ${
                    isDarkMode ? 'bg-slate-700/50 text-gray-300' : 'bg-white text-gray-700 shadow-sm'
                  }`}
                >
                  <span className="mr-2">{feature.icon}</span>
                  <span className="font-medium">{feature.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default RelacionamentoAnalytics
