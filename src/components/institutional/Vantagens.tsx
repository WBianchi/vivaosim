'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Rocket, 
  Target, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Clock,
  Award,
  Heart
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'

const Vantagens = () => {
  const { isDarkMode } = useTheme()
  const [activeCard, setActiveCard] = useState(0)

  const vantagens = [
    {
      icon: Rocket,
      title: 'Implementação Rápida',
      subtitle: 'Comece em minutos',
      description: 'Setup completo em menos de 5 minutos. Nossa equipe te acompanha desde o primeiro login até o primeiro evento confirmado.',
      features: ['Onboarding guiado', 'Migração de dados', 'Treinamento incluído'],
      color: 'from-orange-500 to-red-500',
      bgPattern: 'from-orange-50 to-red-50',
      darkBgPattern: 'from-orange-900/10 to-red-900/10'
    },
    {
      icon: Target,
      title: 'Foco no Resultado',
      subtitle: 'ROI comprovado',
      description: 'Metodologia testada por +50k profissionais. Aumento médio de 127% no faturamento nos primeiros 6 meses.',
      features: ['Métricas em tempo real', 'Relatórios de ROI', 'Consultoria estratégica'],
      color: 'from-blue-500 to-cyan-500',
      bgPattern: 'from-blue-50 to-cyan-50',
      darkBgPattern: 'from-blue-900/10 to-cyan-900/10'
    },
    {
      icon: Zap,
      title: 'Automação Total',
      subtitle: 'IA que trabalha 24/7',
      description: 'Inteligência artificial que aprende com seu negócio e automatiza 85% das tarefas repetitivas.',
      features: ['Respostas automáticas', 'Agendamento inteligente', 'Workflows personalizados'],
      color: 'from-purple-500 to-pink-500',
      bgPattern: 'from-purple-50 to-pink-50',
      darkBgPattern: 'from-purple-900/10 to-pink-900/10'
    },
    {
      icon: Shield,
      title: 'Segurança Máxima',
      subtitle: 'Proteção enterprise',
      description: 'Criptografia militar, backup automático e compliance total com LGPD. Seus dados estão 100% seguros.',
      features: ['SSL 256-bit', 'Backup automático', 'Compliance LGPD'],
      color: 'from-green-500 to-emerald-500',
      bgPattern: 'from-green-50 to-emerald-50',
      darkBgPattern: 'from-green-900/10 to-emerald-900/10'
    }
  ]

  return (
    <section className={`relative py-20 lg:py-32 overflow-hidden ${
      isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-white via-gray-50 to-white'
    }`}>
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 40, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-conic from-orange-400 via-pink-400 via-blue-400 to-purple-400 rounded-full blur-3xl opacity-10"
        />
        
        {/* Hexagon pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Cpath d='M40 0l20 20-20 20-20-20z M0 40l20 20-20 20-20-20z M40 40l20 20-20 20-20-20z M80 40l20 20-20 20-20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
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
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200/50 backdrop-blur-sm mb-6"
          >
            <Target className="w-4 h-4 text-purple-500" />
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-purple-400' : 'text-purple-600'
            }`}>
              Vantagens competitivas
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
            Por que somos{' '}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              diferentes
            </span>
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
            Não somos apenas mais uma ferramenta. Somos o parceiro estratégico que vai 
            revolucionar a forma como você gerencia eventos.
          </motion.p>
        </motion.div>

        {/* Interactive Cards */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Cards Navigation */}
          <div className="space-y-4">
            {vantagens.map((vantagem, index) => {
              const IconComponent = vantagem.icon
              return (
                <motion.div
                  key={vantagem.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => setActiveCard(index)}
                  className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-500 ${
                    activeCard === index
                      ? isDarkMode 
                        ? 'bg-slate-800 border-purple-500/50 shadow-2xl' 
                        : 'bg-white border-purple-200 shadow-2xl'
                      : isDarkMode
                        ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800' 
                        : 'bg-white/50 border-gray-200/50 hover:bg-white'
                  } border backdrop-blur-xl group`}
                >
                  {/* Active indicator */}
                  {activeCard === index && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${vantagem.color} rounded-r-full`}
                    />
                  )}

                  <div className="flex items-start space-x-4">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${vantagem.color} flex items-center justify-center shadow-lg ${
                        activeCard === index ? 'shadow-xl' : ''
                      }`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </motion.div>

                    <div className="flex-1">
                      <h3 className={`text-lg font-bold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      } mb-1`}>
                        {vantagem.title}
                      </h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-purple-400' : 'text-purple-600'
                      } font-medium mb-2`}>
                        {vantagem.subtitle}
                      </p>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      } leading-relaxed`}>
                        {vantagem.description}
                      </p>
                    </div>

                    <motion.div
                      animate={{ x: activeCard === index ? 5 : 0 }}
                      className={`p-2 rounded-lg ${
                        activeCard === index 
                          ? 'bg-purple-500 text-white' 
                          : isDarkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                      } transition-all duration-300`}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Active Card Details */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCard}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className={`relative p-8 rounded-3xl ${
                  isDarkMode ? 'bg-slate-800' : 'bg-white'
                } border ${
                  isDarkMode ? 'border-slate-700' : 'border-gray-200'
                } shadow-2xl backdrop-blur-xl overflow-hidden`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  isDarkMode ? vantagens[activeCard].darkBgPattern : vantagens[activeCard].bgPattern
                } opacity-50`} />
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 opacity-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className={`w-full h-full bg-gradient-to-r ${vantagens[activeCard].color} rounded-full blur-xl`}
                  />
                </div>

                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${vantagens[activeCard].color} flex items-center justify-center mb-6 shadow-lg`}
                  >
                    {React.createElement(vantagens[activeCard].icon, { className: "w-8 h-8 text-white" })}
                  </motion.div>

                  {/* Content */}
                  <h3 className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  } mb-2`}>
                    {vantagens[activeCard].title}
                  </h3>
                  
                  <p className={`text-lg ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  } mb-6 leading-relaxed`}>
                    {vantagens[activeCard].description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {vantagens[activeCard].features.map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <CheckCircle className={`w-5 h-5 text-green-500`} />
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 bg-gradient-to-r ${vantagens[activeCard].color} text-white rounded-xl font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-shadow`}
                  >
                    <span>Explorar esta vantagem</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-6 mt-16"
        >
          {[
            { icon: Users, value: '50k+', label: 'Clientes ativos', color: 'text-blue-500' },
            { icon: TrendingUp, value: '127%', label: 'ROI médio', color: 'text-green-500' },
            { icon: Clock, value: '5min', label: 'Setup completo', color: 'text-orange-500' },
            { icon: Award, value: '99.9%', label: 'Uptime garantido', color: 'text-purple-500' }
          ].map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`text-center p-6 rounded-2xl ${
                  isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                } border ${
                  isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'
                } backdrop-blur-sm`}
              >
                <IconComponent className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <div className={`text-3xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                } mb-1`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default Vantagens
