'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeProvider'

const VendasROI = () => {
  const { isDarkMode } = useTheme()
  const [animatedValues, setAnimatedValues] = useState({
    revenue: 0,
    leads: 0,
    time: 0,
    conversion: 0
  })

  useEffect(() => {
    const targets = {
      revenue: 150000,
      leads: 340,
      time: 75,
      conversion: 47
    }

    const animateValue = (key: keyof typeof targets, target: number, duration = 2000) => {
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        
        setAnimatedValues(prev => ({
          ...prev,
          [key]: Math.round(target * easeOut)
        }))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }

    // Stagger animations
    setTimeout(() => animateValue('revenue', targets.revenue), 500)
    setTimeout(() => animateValue('leads', targets.leads), 800)
    setTimeout(() => animateValue('time', targets.time), 1100)
    setTimeout(() => animateValue('conversion', targets.conversion), 1400)
  }, [])

  const scenarios = [
    {
      title: 'Sem o Sistema',
      problems: [
        'Leads perdidos no WhatsApp',
        'Follow-up manual esquecido',
        'Propostas em planilhas',
        'Sem controle de pipeline'
      ],
      results: {
        leads: 50,
        conversion: 12,
        revenue: 35000,
        time: 40
      },
      color: 'from-red-500 to-red-600',
      icon: '😰'
    },
    {
      title: 'Com o Viva o Sim',
      benefits: [
        'Leads capturados automaticamente',
        'Follow-up inteligente 24/7',
        'Propostas profissionais geradas',
        'Pipeline visual completo'
      ],
      results: {
        leads: 340,
        conversion: 47,
        revenue: 150000,
        time: 15
      },
      color: 'from-green-500 to-green-600',
      icon: '🚀'
    }
  ]

  return (
    <section className={`py-24 relative overflow-hidden ${
      isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
    }`}>
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
              isDarkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-500/10 text-green-600'
            }`}>
              Retorno Garantido
            </div>
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Veja o Impacto
              <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                {" "}Financeiro
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Calculadora baseada em dados reais de mais de 500 empresas de eventos
            </p>
          </motion.div>

          {/* ROI Calculator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`mb-20 p-8 rounded-3xl ${
              isDarkMode ? 'bg-slate-800/50 border border-slate-600' : 'bg-white/80 border border-white/50'
            } backdrop-blur-sm shadow-2xl`}
          >
            <div className="text-center mb-8">
              <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Simulação para sua Empresa
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Baseado no perfil médio de empresas do setor
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  label: 'Faturamento Mensal', 
                  value: animatedValues.revenue, 
                  prefix: 'R$ ', 
                  format: (v: number) => v.toLocaleString(),
                  icon: '💰',
                  color: 'text-green-500'
                },
                { 
                  label: 'Leads Qualificados', 
                  value: animatedValues.leads, 
                  prefix: '', 
                  format: (v: number) => v.toString(),
                  icon: '🎯',
                  color: 'text-blue-500'
                },
                { 
                  label: 'Conversão', 
                  value: animatedValues.conversion, 
                  prefix: '', 
                  suffix: '%',
                  format: (v: number) => v.toString(),
                  icon: '📈',
                  color: 'text-purple-500'
                },
                { 
                  label: 'Tempo Economizado', 
                  value: animatedValues.time, 
                  prefix: '', 
                  suffix: '%',
                  format: (v: number) => v.toString(),
                  icon: '⏰',
                  color: 'text-orange-500'
                }
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`text-center p-6 rounded-2xl ${
                    isDarkMode ? 'bg-slate-700/30' : 'bg-gray-50/50'
                  }`}
                >
                  <div className="text-3xl mb-3">{metric.icon}</div>
                  <div className={`text-3xl font-bold mb-2 ${metric.color}`}>
                    {metric.prefix}{metric.format(metric.value)}{metric.suffix}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {metric.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ROI Highlight */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className={`mt-8 p-6 rounded-2xl text-center ${
                isDarkMode ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30' : 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200'
              }`}
            >
              <div className="text-4xl mb-2">🚀</div>
              <div className={`text-4xl font-bold mb-2 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent`}>
                ROI de 340% em 6 meses
              </div>
              <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Cada R$ 1 investido retorna R$ 3,40
              </div>
            </motion.div>
          </motion.div>

          {/* Before vs After Comparison */}
          <div className="grid lg:grid-cols-2 gap-8">
            {scenarios.map((scenario, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`p-8 rounded-3xl ${
                  isDarkMode ? 'bg-slate-800/50 border border-slate-600' : 'bg-white/80 border border-white/50'
                } backdrop-blur-sm shadow-xl relative overflow-hidden`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${scenario.color} opacity-5`}></div>
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="text-5xl mb-4">{scenario.icon}</div>
                    <h3 className={`text-2xl font-bold mb-4 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {scenario.title}
                    </h3>
                  </div>

                  {/* Problems/Benefits */}
                  <div className="mb-8">
                    <ul className="space-y-3">
                      {(scenario.problems || scenario.benefits)?.map((item, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: idx * 0.1 }}
                          className={`flex items-center text-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mr-3 ${
                            scenario.problems ? 'bg-red-500' : 'bg-green-500'
                          }`}></div>
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Results */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl text-center ${
                      isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'
                    }`}>
                      <div className={`text-2xl font-bold mb-1 ${
                        scenario.problems ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {scenario.results.leads}
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Leads/mês
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl text-center ${
                      isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'
                    }`}>
                      <div className={`text-2xl font-bold mb-1 ${
                        scenario.problems ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {scenario.results.conversion}%
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Conversão
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl text-center ${
                      isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'
                    }`}>
                      <div className={`text-2xl font-bold mb-1 ${
                        scenario.problems ? 'text-red-500' : 'text-green-500'
                      }`}>
                        R$ {(scenario.results.revenue / 1000).toFixed(0)}k
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Faturamento
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl text-center ${
                      isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'
                    }`}>
                      <div className={`text-2xl font-bold mb-1 ${
                        scenario.problems ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {scenario.results.time}h
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Trabalho/sem
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Investment Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`mt-16 p-8 rounded-3xl ${
              isDarkMode ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-800/50' : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200'
            }`}
          >
            <div className="text-center mb-8">
              <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Análise de Investimento
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Compare o custo vs. benefício em apenas 6 meses
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-3">💸</div>
                <div className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                  R$ 497/mês
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Investimento Sistema
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-3">📈</div>
                <div className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  +R$ 115k
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Aumento Faturamento
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-3">🏆</div>
                <div className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  340%
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Retorno sobre Investimento
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default VendasROI
