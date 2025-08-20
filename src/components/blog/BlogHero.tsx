'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, TrendingUp } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'

interface BlogHeroProps {
  onSearch?: (query: string) => void
  onFilterChange?: (filter: string) => void
}

const BlogHero = ({ onSearch, onFilterChange }: BlogHeroProps) => {
  const { isDarkMode } = useTheme()

  return (
    <section className={`relative py-20 lg:py-24 ${
      isDarkMode ? 'bg-slate-900' : 'bg-white'
    }`}>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Cpath d='M10 10h40v2H10zM10 20h30v2H10zM10 30h35v2H10zM10 40h25v2H10z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-200/30 backdrop-blur-sm mb-8"
          >
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-orange-400' : 'text-orange-600'
            }`}>
              Blog & Insights
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-4xl lg:text-6xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            } mb-6`}
          >
            Insights que{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              transformam
            </span>{' '}
            negócios
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`text-xl ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } mb-12 leading-relaxed max-w-3xl mx-auto`}
          >
            Estratégias, dicas e tendências do mercado de eventos para você 
            dominar seu nicho e multiplicar seus resultados.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className={`relative flex items-center ${
              isDarkMode ? 'bg-slate-800' : 'bg-white'
            } rounded-2xl border ${
              isDarkMode ? 'border-slate-700' : 'border-gray-200'
            } shadow-lg backdrop-blur-sm overflow-hidden`}>
              
              <div className="flex-1 flex items-center">
                <Search className={`w-5 h-5 ml-6 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Buscar artigos, dicas, estratégias..."
                  onChange={(e) => onSearch?.(e.target.value)}
                  className={`w-full px-4 py-4 bg-transparent ${
                    isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                  } focus:outline-none`}
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:shadow-lg transition-all duration-300"
              >
                <Filter className="w-4 h-4" />
                <span>Filtrar</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center items-center space-x-8 mt-12"
          >
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                200+
              </div>
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Artigos
              </div>
            </div>
            
            <div className={`w-px h-8 ${
              isDarkMode ? 'bg-slate-700' : 'bg-gray-300'
            }`} />
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                50K+
              </div>
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Leitores
              </div>
            </div>
            
            <div className={`w-px h-8 ${
              isDarkMode ? 'bg-slate-700' : 'bg-gray-300'
            }`} />
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Semanal
              </div>
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Novos posts
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default BlogHero
