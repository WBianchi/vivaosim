'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  Shield, 
  TrendingUp, 
  Clock, 
  Users, 
  BarChart3,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'

const Beneficios = () => {
  const { isDarkMode } = useTheme()

  const beneficios = [
    {
      icon: Zap,
      title: 'Automação Inteligente',
      description: 'IA que aprende com seu negócio e automatiza tarefas repetitivas, liberando tempo para o que realmente importa.',
      stats: '85% menos tempo manual',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      darkBgColor: 'from-yellow-900/20 to-orange-900/20'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Proteção de dados com criptografia militar e compliance total com LGPD. Seus clientes podem confiar.',
      stats: '99.9% uptime garantido',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      darkBgColor: 'from-green-900/20 to-emerald-900/20'
    },
    {
      icon: TrendingUp,
      title: 'Crescimento Acelerado',
      description: 'Insights poderosos que identificam oportunidades e otimizam sua estratégia de vendas automaticamente.',
      stats: '+127% ROI médio',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      darkBgColor: 'from-blue-900/20 to-cyan-900/20'
    },
    {
      icon: Clock,
      title: 'Eficiência Máxima',
      description: 'Workflows otimizados que eliminam gargalos e aceleram a entrega de projetos complexos.',
      stats: '3x mais produtividade',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      darkBgColor: 'from-purple-900/20 to-pink-900/20'
    },
    {
      icon: Users,
      title: 'Colaboração Perfeita',
      description: 'Equipes sincronizadas em tempo real com ferramentas que facilitam a comunicação e o trabalho em conjunto.',
      stats: '90% satisfação da equipe',
      color: 'from-indigo-400 to-blue-500',
      bgColor: 'from-indigo-50 to-blue-50',
      darkBgColor: 'from-indigo-900/20 to-blue-900/20'
    },
    {
      icon: BarChart3,
      title: 'Análises Avançadas',
      description: 'Dashboards inteligentes que transformam dados em decisões estratégicas para o seu negócio.',
      stats: 'Decisões 5x mais rápidas',
      color: 'from-rose-400 to-red-500',
      bgColor: 'from-rose-50 to-red-50',
      darkBgColor: 'from-rose-900/20 to-red-900/20'
    }
  ]

  return (
    <section className={`relative py-20 lg:py-32 overflow-hidden ${
      isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-b from-white via-gray-50 to-white'
    }`}>
      
      {/* Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 5
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
        
        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`,
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
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-200/50 backdrop-blur-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-orange-400' : 'text-orange-600'
            }`}>
              Por que escolher o Viva o Sim?
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
            Benefícios que{' '}
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              transformam
            </span>{' '}
            seu negócio
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
            Descubra como nossa plataforma revoluciona a gestão de eventos com tecnologia de ponta, 
            automação inteligente e resultados comprovados por milhares de profissionais.
          </motion.p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beneficios.map((beneficio, index) => {
            const IconComponent = beneficio.icon
            return (
              <motion.div
                key={beneficio.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className={`relative group p-8 rounded-3xl ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700/50' 
                    : 'bg-white border-gray-200/50'
                } border backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  isDarkMode ? beneficio.darkBgColor : beneficio.bgColor
                } opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Floating elements */}
                <motion.div
                  animate={{ 
                    y: [0, -5, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5
                  }}
                  className="absolute -top-2 -right-2 w-16 h-16 opacity-10 group-hover:opacity-20 transition-opacity"
                >
                  <div className={`w-full h-full bg-gradient-to-r ${beneficio.color} rounded-full blur-xl`} />
                </motion.div>

                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${beneficio.color} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className={`text-xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  } mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:${beneficio.color} group-hover:bg-clip-text transition-all duration-300`}>
                    {beneficio.title}
                  </h3>
                  
                  <p className={`${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  } mb-4 leading-relaxed`}>
                    {beneficio.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${
                      isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100'
                    } group-hover:bg-gradient-to-r group-hover:${beneficio.color} group-hover:text-white transition-all duration-300`}>
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-semibold">{beneficio.stats}</span>
                    </div>
                    
                    <motion.div
                      whileHover={{ x: 5 }}
                      className={`p-2 rounded-lg ${
                        isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100'
                      } group-hover:bg-white/20 transition-all duration-300 cursor-pointer`}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>

                {/* Hover effect border */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${beneficio.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`} />
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className={`inline-flex items-center space-x-4 px-8 py-4 rounded-2xl ${
            isDarkMode ? 'bg-slate-800/50' : 'bg-white'
          } border ${
            isDarkMode ? 'border-slate-700' : 'border-gray-200'
          } shadow-lg backdrop-blur-sm`}>
            <div className="flex -space-x-2">
              {[1,2,3,4,5].map((i) => (
                <motion.div 
                  key={i}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`w-10 h-10 rounded-full bg-gradient-to-r ${
                    i % 2 === 0 ? 'from-orange-400 to-pink-400' : 'from-blue-400 to-purple-400'
                  } border-2 border-white flex items-center justify-center shadow-lg`}
                >
                  <CheckCircle className="w-5 h-5 text-white" />
                </motion.div>
              ))}
            </div>
            <div className="text-left">
              <p className={`font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                +50.000 profissionais já transformaram seus negócios
              </p>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Junte-se aos líderes do mercado de eventos
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Beneficios
