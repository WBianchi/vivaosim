'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  Quote, 
  ArrowLeft, 
  ArrowRight,
  Play,
  Users,
  Award,
  TrendingUp,
  Heart,
  Sparkles
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'

const Avaliacoes = () => {
  const { isDarkMode } = useTheme()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: 'Marina Santos',
      role: 'CEO',
      company: 'Elegance Eventos',
      image: '👩‍💼',
      rating: 5,
      text: 'O Viva o Sim revolucionou nosso negócio. Em 6 meses aumentamos nossa receita em 180% e reduzimos o tempo de gestão em 70%. A automação é simplesmente perfeita!',
      results: '+180% receita',
      category: 'Crescimento',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 2,
      name: 'Carlos Mendes',
      role: 'Diretor',
      company: 'Premium Casamentos',
      image: '👨‍💻',
      rating: 5,
      text: 'Nunca vi uma plataforma tão completa. O CRM integrado com WhatsApp e a IA que responde clientes 24/7 transformou nossa operação. Recomendo de olhos fechados!',
      results: '24/7 atendimento',
      category: 'Automação',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      name: 'Ana Paula Costa',
      role: 'Fundadora',
      company: 'Momentos Únicos',
      image: '👩‍🎨',
      rating: 5,
      text: 'A organização que o sistema trouxe para nossa empresa é incrível. Conseguimos gerenciar 3x mais eventos com a mesma equipe. O ROI foi imediato!',
      results: '3x mais eventos',
      category: 'Produtividade',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 4,
      name: 'Roberto Silva',
      role: 'Sócio',
      company: 'Festa Total',
      image: '👨‍🍳',
      rating: 5,
      text: 'O suporte é excepcional e a plataforma é muito intuitiva. Em 2 semanas já estávamos operando 100%. Os relatórios me dão insights que nunca tive antes.',
      results: '100% operacional',
      category: 'Implementação',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 5,
      name: 'Juliana Oliveira',
      role: 'Diretora Comercial',
      company: 'Sonho Real Eventos',
      image: '👩‍💼',
      rating: 5,
      text: 'A integração com todas as ferramentas que já usávamos foi perfeita. Não perdemos nenhum dado e ganhamos muito mais funcionalidades. Simplesmente fantástico!',
      results: 'Integração perfeita',
      category: 'Tecnologia',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const stats = [
    { value: '4.9/5', label: 'Avaliação média', icon: Star },
    { value: '2.847', label: 'Avaliações', icon: Users },
    { value: '98%', label: 'Recomendam', icon: Heart },
    { value: '#1', label: 'Ranking Brasil', icon: Award }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className={`relative py-20 lg:py-32 overflow-hidden ${
      isDarkMode ? 'bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800' : 'bg-gradient-to-b from-gray-50 via-white to-gray-50'
    }`}>
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl"
        />
        
        {/* Quote patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-16.569 13.431-30 30-30s30 13.431 30 30-13.431 30-30 30-30-13.431-30-30zm30-20c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
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
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-200/50 backdrop-blur-sm mb-6"
          >
            <Star className="w-4 h-4 text-yellow-500" />
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
            }`}>
              Avaliado como #1 do Brasil
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
            O que nossos{' '}
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              clientes
            </span>{' '}
            dizem
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
            Mais de 50.000 profissionais já transformaram seus negócios. 
            Veja os resultados reais de quem confia no Viva o Sim.
          </motion.p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`text-center p-6 rounded-2xl ${
                  isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                } border ${
                  isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'
                } backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
              >
                <IconComponent className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                <div className={`text-2xl font-bold ${
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

        {/* Main Testimonial */}
        <div className="relative max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className={`relative p-8 lg:p-12 rounded-3xl ${
                isDarkMode ? 'bg-slate-800' : 'bg-white'
              } border ${
                isDarkMode ? 'border-slate-700' : 'border-gray-200'
              } shadow-2xl backdrop-blur-xl overflow-hidden`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${testimonials[currentTestimonial].color} opacity-5`} />
              
              {/* Quote icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute top-8 right-8 opacity-10"
              >
                <Quote className="w-24 h-24" />
              </motion.div>

              <div className="relative z-10 grid lg:grid-cols-3 gap-8 items-center">
                
                {/* Avatar & Info */}
                <div className="text-center lg:text-left">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-24 h-24 mx-auto lg:mx-0 mb-4 text-6xl"
                  >
                    {testimonials[currentTestimonial].image}
                  </motion.div>
                  
                  <h3 className={`text-xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  } mb-1`}>
                    {testimonials[currentTestimonial].name}
                  </h3>
                  
                  <p className={`${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  } mb-2`}>
                    {testimonials[currentTestimonial].role}
                  </p>
                  
                  <p className={`text-sm font-semibold bg-gradient-to-r ${testimonials[currentTestimonial].color} bg-clip-text text-transparent`}>
                    {testimonials[currentTestimonial].company}
                  </p>

                  {/* Rating */}
                  <div className="flex justify-center lg:justify-start space-x-1 mt-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                      >
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Testimonial Text */}
                <div className="lg:col-span-2">
                  <motion.blockquote
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className={`text-lg lg:text-xl ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    } leading-relaxed mb-6 italic`}
                  >
                    &ldquo;{testimonials[currentTestimonial].text}&rdquo;
                  </motion.blockquote>

                  {/* Results Badge */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center space-x-4"
                  >
                    <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r ${testimonials[currentTestimonial].color} text-white shadow-lg`}>
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-semibold">{testimonials[currentTestimonial].results}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full ${
                      isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
                    } text-sm`}>
                      {testimonials[currentTestimonial].category}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className={`p-3 rounded-full ${
                isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-50'
              } border ${
                isDarkMode ? 'border-slate-700' : 'border-gray-200'
              } shadow-lg transition-all`}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>

            {/* Dots */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 scale-125'
                      : isDarkMode ? 'bg-slate-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className={`p-3 rounded-full ${
                isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-50'
              } border ${
                isDarkMode ? 'border-slate-700' : 'border-gray-200'
              } shadow-lg transition-all`}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
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
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(249, 115, 22, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold flex items-center space-x-2 shadow-lg mx-auto"
          >
            <span>Junte-se aos nossos clientes satisfeitos</span>
            <Sparkles className="w-5 h-5" />
          </motion.button>
          
          <p className={`text-sm mt-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            ⭐ Teste grátis por 14 dias • 🚀 Setup em 5 minutos • 💬 Suporte 24/7
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Avaliacoes
