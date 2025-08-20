'use client'

import React, { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Award,
  Clock,
  Heart,
  Zap,
  Target,
  Globe,
  Shield,
  Star,
  Rocket
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'

const Numeros = () => {
  const { isDarkMode } = useTheme()
  const [counters, setCounters] = useState({
    clientes: 0,
    eventos: 0,
    receita: 0,
    satisfacao: 0,
    economia: 0,
    uptime: 0
  })

  const finalNumbers = {
    clientes: 50000,
    eventos: 1200000,
    receita: 2100,
    satisfacao: 98,
    economia: 85,
    uptime: 99.9
  }

  const stats = [
    {
      key: 'clientes',
      icon: Users,
      value: counters.clientes,
      suffix: '+',
      label: 'Clientes ativos',
      description: 'Profissionais que confiam na nossa plataforma',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      darkBgColor: 'from-blue-900/20 to-cyan-900/20'
    },
    {
      key: 'eventos',
      icon: Calendar,
      value: counters.eventos,
      suffix: '+',
      label: 'Eventos realizados',
      description: 'Momentos especiais criados com nossa tecnologia',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      darkBgColor: 'from-purple-900/20 to-pink-900/20'
    },
    {
      key: 'receita',
      icon: TrendingUp,
      value: counters.receita,
      prefix: 'R$ ',
      suffix: 'M+',
      label: 'Receita gerada',
      description: 'Faturamento dos nossos clientes em 2024',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      darkBgColor: 'from-green-900/20 to-emerald-900/20'
    },
    {
      key: 'satisfacao',
      icon: Heart,
      value: counters.satisfacao,
      suffix: '%',
      label: 'Satisfação',
      description: 'Clientes que recomendam nossa plataforma',
      color: 'from-red-500 to-pink-500',
      bgColor: 'from-red-50 to-pink-50',
      darkBgColor: 'from-red-900/20 to-pink-900/20'
    },
    {
      key: 'economia',
      icon: Clock,
      value: counters.economia,
      suffix: '%',
      label: 'Economia de tempo',
      description: 'Redução no tempo de gestão operacional',
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'from-orange-50 to-yellow-50',
      darkBgColor: 'from-orange-900/20 to-yellow-900/20'
    },
    {
      key: 'uptime',
      icon: Shield,
      value: counters.uptime,
      suffix: '%',
      label: 'Disponibilidade',
      description: 'Garantia de funcionamento da plataforma',
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'from-indigo-50 to-blue-50',
      darkBgColor: 'from-indigo-900/20 to-blue-900/20'
    }
  ]

  const achievements = [
    { icon: Award, text: '#1 Plataforma de Eventos do Brasil', color: 'text-yellow-500' },
    { icon: Star, text: 'Melhor CRM de Eventos 2024', color: 'text-purple-500' },
    { icon: Rocket, text: 'Startup Mais Inovadora', color: 'text-blue-500' },
    { icon: Globe, text: 'Expansão Internacional', color: 'text-green-500' }
  ]

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    const intervals = Object.keys(finalNumbers).map(key => {
      const finalValue = finalNumbers[key as keyof typeof finalNumbers]
      const increment = finalValue / steps

      return setInterval(() => {
        setCounters(prev => ({
          ...prev,
          [key]: Math.min(prev[key as keyof typeof prev] + increment, finalValue)
        }))
      }, stepDuration)
    })

    const timeout = setTimeout(() => {
      intervals.forEach(clearInterval)
      setCounters(finalNumbers)
    }, duration)

    return () => {
      intervals.forEach(clearInterval)
      clearTimeout(timeout)
    }
  }, [])

  const formatNumber = (num: number, key: string) => {
    if (key === 'clientes') return Math.floor(num).toLocaleString()
    if (key === 'eventos') return Math.floor(num).toLocaleString()
    if (key === 'receita') return Math.floor(num).toLocaleString()
    if (key === 'uptime') return num.toFixed(1)
    return Math.floor(num)
  }

  return (
    <section className={`relative py-20 lg:py-32 overflow-hidden ${
      isDarkMode ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-b from-white via-gray-50 to-white'
    }`}>
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated number patterns */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 opacity-5"
        >
          <div className="text-9xl font-bold text-orange-500">50K</div>
        </motion.div>
        
        <motion.div
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 35, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 opacity-5"
        >
          <div className="text-9xl font-bold text-blue-500">1.2M</div>
        </motion.div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Cpath d='M10 10h10v10H10zM30 10h10v10H30zM50 10h10v10H50zM70 10h10v10H70zM10 30h10v10H10zM30 30h10v10H30zM50 30h10v10H50zM70 30h10v10H70z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
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
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-green-400' : 'text-green-600'
            }`}>
              Números que impressionam
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
            Resultados que{' '}
            <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              falam por si
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
            Mais de 5 anos transformando o mercado de eventos no Brasil. 
            Conheça os números que comprovam nossa liderança.
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className={`relative group p-8 rounded-3xl ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700/50' 
                    : 'bg-white/80 border-gray-200/50'
                } border backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  isDarkMode ? stat.darkBgColor : stat.bgColor
                } opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Animated background element */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 10, 
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 2
                  }}
                  className="absolute -top-4 -right-4 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity"
                >
                  <div className={`w-full h-full bg-gradient-to-r ${stat.color} rounded-full blur-xl`} />
                </motion.div>

                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Number */}
                  <div className="mb-4">
                    <motion.div 
                      className={`text-4xl lg:text-5xl font-bold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      } mb-2 font-mono`}
                    >
                      {stat.prefix}{formatNumber(stat.value, stat.key)}{stat.suffix}
                    </motion.div>
                    <h3 className={`text-lg font-semibold ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    } mb-2`}>
                      {stat.label}
                    </h3>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    } leading-relaxed`}>
                      {stat.description}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className={`w-full h-2 ${
                    isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
                  } rounded-full overflow-hidden`}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      transition={{ duration: 1.5, delay: index * 0.2 }}
                      viewport={{ once: true }}
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Achievements */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className={`p-8 rounded-3xl ${
            isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
          } border ${
            isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'
          } backdrop-blur-xl shadow-xl`}
        >
          <h3 className={`text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          } text-center mb-8`}>
            Reconhecimentos e Conquistas
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon
              return (
                <motion.div
                  key={achievement.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 rounded-2xl border border-gray-200/20 hover:bg-white/10 transition-all duration-300"
                >
                  <IconComponent className={`w-12 h-12 ${achievement.color} mx-auto mb-4`} />
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  } leading-relaxed`}>
                    {achievement.text}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(34, 197, 94, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold flex items-center space-x-2 shadow-lg mx-auto"
          >
            <span>Faça parte destes números</span>
            <Target className="w-5 h-5" />
          </motion.button>
          
          <p className={`text-sm mt-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            🚀 Junte-se a +50k profissionais • 📈 Cresça 127% mais rápido • ⚡ Comece hoje mesmo
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Numeros
