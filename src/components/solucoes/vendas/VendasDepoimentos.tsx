'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeProvider'

const VendasDepoimentos = () => {
  const { isDarkMode } = useTheme()
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const testimonials = [
    {
      name: 'Carla Mendonça',
      role: 'Diretora Comercial',
      company: 'Eventos Premium SP',
      avatar: '/avatars/carla.jpg',
      story: 'Antes do Viva o Sim, perdíamos 60% dos leads por falta de follow-up. Hoje convertemos 8 em cada 10 contatos.',
      metrics: {
        before: { leads: 120, conversion: 15, revenue: 45000 },
        after: { leads: 340, conversion: 47, revenue: 180000 }
      },
      highlight: '+300% em conversões',
      industry: 'Eventos Corporativos',
      teamSize: '15-30 pessoas',
      timeUsing: '14 meses'
    },
    {
      name: 'Roberto Silva',
      role: 'CEO',
      company: 'Festas & Cia',
      avatar: '/avatars/roberto.jpg',
      story: 'O sistema mudou nossa empresa. Automatizamos 80% do processo comercial e triplicamos o faturamento.',
      metrics: {
        before: { leads: 80, conversion: 12, revenue: 28000 },
        after: { leads: 280, conversion: 43, revenue: 95000 }
      },
      highlight: '+240% em faturamento',
      industry: 'Festas Sociais',
      teamSize: '8-15 pessoas',
      timeUsing: '11 meses'
    },
    {
      name: 'Ana Paula Costa',
      role: 'Sócia-Fundadora',
      company: 'Weddings Dreams',
      avatar: '/avatars/ana.jpg',
      story: 'Conseguimos organizar 3x mais casamentos sem aumentar a equipe. O follow-up automático é revolucionário.',
      metrics: {
        before: { leads: 60, conversion: 20, revenue: 85000 },
        after: { leads: 200, conversion: 55, revenue: 240000 }
      },
      highlight: '+182% em eventos',
      industry: 'Casamentos',
      teamSize: '5-10 pessoas', 
      timeUsing: '18 meses'
    },
    {
      name: 'Marcos Oliveira',
      role: 'Diretor de Vendas',
      company: 'Mega Produções',
      avatar: '/avatars/marcos.jpg',
      story: 'Nunca mais perdemos um lead. O pipeline visual nos deu controle total sobre as oportunidades.',
      metrics: {
        before: { leads: 200, conversion: 8, revenue: 120000 },
        after: { leads: 450, conversion: 38, revenue: 350000 }
      },
      highlight: '+375% em leads',
      industry: 'Eventos Corporativos',
      teamSize: '30+ pessoas',
      timeUsing: '22 meses'
    }
  ]

  const currentTestimonial = testimonials[activeTestimonial]

  return (
    <section className={`py-24 relative overflow-hidden ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
              isDarkMode ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-500/10 text-orange-600'
            }`}>
              Casos de Sucesso
            </div>
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Histórias
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {" "}Reais
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Empresas que transformaram seus resultados com nosso sistema de vendas
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Testimonial Selector */}
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    activeTestimonial === index
                      ? isDarkMode ? 'bg-slate-800 border-2 border-orange-500/50' : 'bg-white border-2 border-orange-200 shadow-lg'
                      : isDarkMode ? 'bg-slate-800/30 border border-slate-600 hover:bg-slate-800/50' : 'bg-white/50 border border-gray-200 hover:bg-white hover:shadow-md'
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg mb-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {testimonial.name}
                      </h3>
                      <p className={`text-sm mb-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {testimonial.role} • {testimonial.company}
                      </p>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-500/10 text-orange-600'
                      }`}>
                        {testimonial.highlight}
                      </div>
                    </div>

                    <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                      activeTestimonial === index
                        ? 'bg-orange-500 text-white'
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

            {/* Testimonial Details */}
            <div className="lg:sticky lg:top-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className={`p-8 rounded-3xl ${
                    isDarkMode ? 'bg-slate-800/50 border border-slate-600' : 'bg-white border border-gray-200'
                  } shadow-2xl`}
                >
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-2xl">
                        {currentTestimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {currentTestimonial.name}
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                      {currentTestimonial.role} • {currentTestimonial.company}
                    </p>
                    
                    {/* Company Info */}
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                      <span className={`px-3 py-1 rounded-full ${
                        isDarkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {currentTestimonial.industry}
                      </span>
                      <span className={`px-3 py-1 rounded-full ${
                        isDarkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {currentTestimonial.teamSize}
                      </span>
                      <span className={`px-3 py-1 rounded-full ${
                        isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-500/10 text-green-600'
                      }`}>
                        Usando há {currentTestimonial.timeUsing}
                      </span>
                    </div>
                  </div>

                  {/* Story Quote */}
                  <motion.blockquote
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className={`text-lg leading-relaxed mb-8 text-center italic ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    "{currentTestimonial.story}"
                  </motion.blockquote>

                  {/* Metrics Comparison */}
                  <div className="space-y-6">
                    <h4 className={`font-semibold text-center mb-4 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Resultados Antes vs Depois:
                    </h4>

                    {/* Before/After Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Before */}
                      <div className={`p-4 rounded-xl ${
                        isDarkMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'
                      }`}>
                        <div className="text-center">
                          <div className="text-2xl mb-2">😰</div>
                          <h5 className={`font-semibold mb-3 ${
                            isDarkMode ? 'text-red-400' : 'text-red-600'
                          }`}>
                            Antes
                          </h5>
                          <div className="space-y-2">
                            <div>
                              <span className={`text-2xl font-bold ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {currentTestimonial.metrics.before.leads}
                              </span>
                              <div className={`text-xs ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                leads/mês
                              </div>
                            </div>
                            <div>
                              <span className={`text-2xl font-bold ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {currentTestimonial.metrics.before.conversion}%
                              </span>
                              <div className={`text-xs ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                conversão
                              </div>
                            </div>
                            <div>
                              <span className={`text-lg font-bold ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                R$ {(currentTestimonial.metrics.before.revenue / 1000).toFixed(0)}k
                              </span>
                              <div className={`text-xs ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                faturamento
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* After */}
                      <div className={`p-4 rounded-xl ${
                        isDarkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'
                      }`}>
                        <div className="text-center">
                          <div className="text-2xl mb-2">🚀</div>
                          <h5 className={`font-semibold mb-3 ${
                            isDarkMode ? 'text-green-400' : 'text-green-600'
                          }`}>
                            Depois
                          </h5>
                          <div className="space-y-2">
                            <div>
                              <span className={`text-2xl font-bold ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {currentTestimonial.metrics.after.leads}
                              </span>
                              <div className={`text-xs ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                leads/mês
                              </div>
                            </div>
                            <div>
                              <span className={`text-2xl font-bold ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {currentTestimonial.metrics.after.conversion}%
                              </span>
                              <div className={`text-xs ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                conversão
                              </div>
                            </div>
                            <div>
                              <span className={`text-lg font-bold ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                R$ {(currentTestimonial.metrics.after.revenue / 1000).toFixed(0)}k
                              </span>
                              <div className={`text-xs ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                faturamento
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Growth Highlight */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className={`p-4 rounded-xl text-center ${
                        isDarkMode ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30' : 'bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200'
                      }`}
                    >
                      <div className="text-3xl mb-2">📈</div>
                      <div className={`text-xl font-bold ${
                        isDarkMode ? 'text-orange-400' : 'text-orange-600'
                      }`}>
                        {currentTestimonial.highlight}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mt-16"
          >
            <p className={`text-xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Quer resultados como estes?
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center group"
            >
              Começar Minha Transformação
              <motion.svg 
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default VendasDepoimentos
