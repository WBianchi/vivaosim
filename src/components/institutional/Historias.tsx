'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  Calendar,
  Award,
  ChevronDown,
  ChevronUp,
  Play,
  Quote,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Heart,
  Star
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'

const Historias = () => {
  const { isDarkMode } = useTheme()
  const [activeStory, setActiveStory] = useState(0)
  const [expandedMetric, setExpandedMetric] = useState<number | null>(null)

  const stories = [
    {
      id: 1,
      company: 'Elegance Eventos',
      industry: 'Casamentos de Luxo',
      founder: 'Marina Santos',
      avatar: '👩‍💼',
      timeline: '6 meses',
      challenge: 'Gestão manual de 200+ leads mensais causava perda de 40% das oportunidades',
      solution: 'Implementação completa do Viva o Sim com automação de WhatsApp e CRM integrado',
      results: {
        revenue: { before: 'R$ 80K/mês', after: 'R$ 280K/mês', growth: '+250%' },
        efficiency: { before: '60h/semana', after: '25h/semana', growth: '-58%' },
        conversion: { before: '12%', after: '34%', growth: '+183%' },
        satisfaction: { before: '3.2/5', after: '4.9/5', growth: '+53%' }
      },
      quote: 'O Viva o Sim não apenas automatizou nossos processos, mas revolucionou completamente nossa forma de trabalhar. Hoje conseguimos focar no que realmente importa: criar experiências únicas.',
      video: 'https://example.com/video1',
      color: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-50',
      darkBgGradient: 'from-pink-900/20 to-rose-900/20'
    },
    {
      id: 2,
      company: 'Premium Casamentos',
      industry: 'Eventos Corporativos',
      founder: 'Carlos Mendes',
      avatar: '👨‍💻',
      timeline: '4 meses',
      challenge: 'Dificuldade em escalar operação sem perder qualidade no atendimento',
      solution: 'IA conversacional 24/7 + automação de contratos digitais e follow-ups',
      results: {
        revenue: { before: 'R$ 150K/mês', after: 'R$ 420K/mês', growth: '+180%' },
        efficiency: { before: '80h/semana', after: '35h/semana', growth: '-56%' },
        conversion: { before: '18%', after: '45%', growth: '+150%' },
        satisfaction: { before: '3.8/5', after: '4.8/5', growth: '+26%' }
      },
      quote: 'A IA do Viva o Sim responde nossos clientes melhor que muitos atendentes humanos. É impressionante como ela entende o contexto e personaliza cada conversa.',
      video: 'https://example.com/video2',
      color: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      darkBgGradient: 'from-blue-900/20 to-cyan-900/20'
    },
    {
      id: 3,
      company: 'Momentos Únicos',
      industry: 'Festas Infantis',
      founder: 'Ana Paula Costa',
      avatar: '👩‍🎨',
      timeline: '8 meses',
      challenge: 'Crescimento desorganizado resultava em retrabalho e clientes insatisfeitos',
      solution: 'Implementação gradual com foco em organização de processos e relatórios',
      results: {
        revenue: { before: 'R$ 45K/mês', after: 'R$ 165K/mês', growth: '+267%' },
        efficiency: { before: '70h/semana', after: '30h/semana', growth: '-57%' },
        conversion: { before: '15%', after: '38%', growth: '+153%' },
        satisfaction: { before: '3.5/5', after: '4.7/5', growth: '+34%' }
      },
      quote: 'Conseguimos organizar nosso caos criativo sem perder a essência. Hoje temos controle total sobre cada projeto e nossos clientes percebem a diferença na qualidade.',
      video: 'https://example.com/video3',
      color: 'from-purple-500 to-indigo-500',
      bgGradient: 'from-purple-50 to-indigo-50',
      darkBgGradient: 'from-purple-900/20 to-indigo-900/20'
    }
  ]

  const currentStory = stories[activeStory]

  const nextStory = () => {
    setActiveStory((prev) => (prev + 1) % stories.length)
  }

  const prevStory = () => {
    setActiveStory((prev) => (prev - 1 + stories.length) % stories.length)
  }

  return (
    <section className={`relative py-20 lg:py-32 overflow-hidden ${
      isDarkMode ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-b from-white via-gray-50 to-white'
    }`}>
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 35, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-1/4 right-1/3 w-96 h-96 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-3xl"
        />
        
        {/* Success symbols */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Cpath d='M60 20l12 24 24 4-18 16 6 24-24-14-24 14 6-24-18-16 24-4z'/%3E%3Ccircle cx='30' cy='90' r='8'/%3E%3Cpath d='M90 80l8 8 16-16'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px'
          }} />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-200/50 backdrop-blur-sm mb-6"
          >
            <Award className="w-4 h-4 text-green-500" />
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-green-400' : 'text-green-600'
            }`}>
              Histórias de Sucesso
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className={`text-4xl lg:text-5xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            } mb-6`}
          >
            Transformações{' '}
            <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              reais
            </span>{' '}
            de negócios
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className={`text-xl ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } max-w-3xl mx-auto leading-relaxed`}
          >
            Conheça empresas que multiplicaram seus resultados e revolucionaram 
            seus processos com nossa plataforma.
          </motion.p>
        </motion.div>

        {/* Story Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="flex space-x-4">
            {stories.map((story, index) => (
              <motion.button
                key={story.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveStory(index)}
                className={`p-4 rounded-2xl transition-all duration-300 ${
                  activeStory === index
                    ? `bg-gradient-to-r ${story.color} text-white shadow-lg`
                    : isDarkMode 
                      ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                } border ${
                  isDarkMode ? 'border-slate-700' : 'border-gray-200'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{story.avatar}</div>
                  <div className="text-sm font-semibold">{story.company}</div>
                  <div className="text-xs opacity-75">{story.industry}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Story */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStory}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <div className={`relative p-8 lg:p-12 rounded-3xl ${
              isDarkMode ? 'bg-slate-800' : 'bg-white'
            } border ${
              isDarkMode ? 'border-slate-700' : 'border-gray-200'
            } shadow-2xl backdrop-blur-xl overflow-hidden`}>
              
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${
                isDarkMode ? currentStory.darkBgGradient : currentStory.bgGradient
              } opacity-50`} />
              
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                
                {/* Story Content */}
                <div>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="text-4xl">{currentStory.avatar}</div>
                    <div>
                      <h3 className={`text-2xl font-bold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {currentStory.company}
                      </h3>
                      <p className={`${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {currentStory.industry} • {currentStory.founder}
                      </p>
                    </div>
                  </div>

                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r ${currentStory.color} text-white text-sm font-semibold mb-6`}>
                    <Target className="w-4 h-4" />
                    <span>Transformação em {currentStory.timeline}</span>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className={`text-lg font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      } mb-2`}>
                        Desafio
                      </h4>
                      <p className={`${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      } leading-relaxed`}>
                        {currentStory.challenge}
                      </p>
                    </div>

                    <div>
                      <h4 className={`text-lg font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      } mb-2`}>
                        Solução
                      </h4>
                      <p className={`${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      } leading-relaxed`}>
                        {currentStory.solution}
                      </p>
                    </div>

                    <div className={`p-6 rounded-2xl ${
                      isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'
                    } border-l-4 border-gradient-to-b ${currentStory.color}`}>
                      <Quote className="w-8 h-8 text-gray-400 mb-4" />
                      <blockquote className={`text-lg italic ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      } leading-relaxed`}>
                        &ldquo;{currentStory.quote}&rdquo;
                      </blockquote>
                      <p className={`mt-4 font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {currentStory.founder}, {currentStory.company}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Results Metrics */}
                <div className="space-y-6">
                  <h4 className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  } text-center mb-8`}>
                    Resultados Alcançados
                  </h4>

                  {Object.entries(currentStory.results).map(([key, metric], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-6 rounded-2xl ${
                        isDarkMode ? 'bg-slate-700/50' : 'bg-white'
                      } border ${
                        isDarkMode ? 'border-slate-600' : 'border-gray-200'
                      } hover:shadow-lg transition-all duration-300 cursor-pointer`}
                      onClick={() => setExpandedMetric(expandedMetric === index ? null : index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className={`font-semibold ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {key === 'revenue' ? 'Receita Mensal' :
                               key === 'efficiency' ? 'Tempo de Trabalho' :
                               key === 'conversion' ? 'Taxa de Conversão' :
                               'Satisfação do Cliente'}
                            </h5>
                            <div className={`text-2xl font-bold bg-gradient-to-r ${currentStory.color} bg-clip-text text-transparent`}>
                              {metric.growth}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className={`${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              De: {metric.before}
                            </span>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                            <span className={`font-semibold ${
                              isDarkMode ? 'text-green-400' : 'text-green-600'
                            }`}>
                              Para: {metric.after}
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className={`w-full h-2 ${
                            isDarkMode ? 'bg-slate-600' : 'bg-gray-200'
                          } rounded-full mt-4 overflow-hidden`}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 1.5, delay: index * 0.2 }}
                              className={`h-full bg-gradient-to-r ${currentStory.color} rounded-full`}
                            />
                          </div>
                        </div>
                        
                        <motion.div
                          animate={{ rotate: expandedMetric === index ? 180 : 0 }}
                          className="ml-4"
                        >
                          <ChevronDown className="w-5 h-5" />
                        </motion.div>
                      </div>

                      <AnimatePresence>
                        {expandedMetric === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-gray-200/20"
                          >
                            <p className={`text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {key === 'revenue' ? 'Aumento significativo na receita através de melhor conversão e retenção de clientes.' :
                               key === 'efficiency' ? 'Redução drástica no tempo gasto em tarefas administrativas e operacionais.' :
                               key === 'conversion' ? 'Melhoria na qualificação de leads e processo de vendas automatizado.' :
                               'Aumento na satisfação através de melhor atendimento e organização.'}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}

                  {/* Video CTA */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-6 rounded-2xl bg-gradient-to-r ${currentStory.color} text-white font-semibold flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    <Play className="w-6 h-6" />
                    <span>Assistir depoimento completo</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className="flex justify-center space-x-3 mt-12">
          {stories.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              onClick={() => setActiveStory(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === activeStory
                  ? `bg-gradient-to-r ${currentStory.color} scale-125`
                  : isDarkMode ? 'bg-slate-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(34, 197, 94, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold flex items-center space-x-2 shadow-lg mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            <span>Seja a próxima história de sucesso</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
          
          <p className={`text-sm mt-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            🎯 Resultados em 30 dias • 📈 Crescimento garantido • 🚀 Suporte especializado
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Historias
