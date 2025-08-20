'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Menu, X, Sun, Moon, Phone, TrendingUp, Users, Calendar, Truck, Megaphone, Zap, DollarSign, BarChart3, FileText, BookOpen } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { isDarkMode, toggleTheme } = useTheme()

  const solucoesItems = [
    { name: 'Vendas', description: 'Gerencie todo processo de vendas e propostas comerciais', icon: TrendingUp },
    { name: 'Relacionamento', description: 'CRM completo para gestão de clientes e leads', icon: Users },
    { name: 'Planejamento', description: 'Organize e planeje seus eventos com eficiência', icon: Calendar },
    { name: 'Logística', description: 'Controle operacional e gestão de recursos', icon: Truck },
    { name: 'Marketing', description: 'Campanhas digitais e automação de marketing', icon: Megaphone },
    { name: 'Automação', description: 'Processos automatizados e workflows inteligentes', icon: Zap },
    { name: 'Finanças', description: 'Gestão financeira completa e controle de custos', icon: DollarSign },
    { name: 'Análises', description: 'Relatórios avançados e dashboards em tempo real', icon: BarChart3 },
    { name: 'Fiscal e Jurídico', description: 'Compliance, contratos e documentos legais', icon: FileText }
  ]

  const segmentosItems = [
    'Assessoria Cerimonial',
    'Bandas e Artistas', 
    'Coquetelarias',
    'Buffet',
    'Agências',
    'Decoração de Eventos',
    'Recreação',
    'Espaço de Eventos',
    'Fotografia e Filmagem',
    'Áudio Iluminação',
    'Produtores de Eventos',
    'Palestrantes'
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDarkMode ? 'bg-slate-900/80' : 'bg-white/80'
      } backdrop-blur-xl border-b border-white/20 shadow-2xl`}
      style={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: isDarkMode
          ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        transform: 'skewY(-0.5deg)',
        transformOrigin: 'top left'
      }}
    >
      <div className="transform skew-y-0.5">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <div className={`w-10 h-10 rounded-xl ${
                isDarkMode ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-orange-500 to-orange-600'
              } flex items-center justify-center shadow-lg`}>
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }">
                Viva o Sim
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4">
              
              {/* Soluções Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('solucoes')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isDarkMode ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100/80'
                } backdrop-blur-sm`}>
                  <span className="font-medium">Soluções</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                <AnimatePresence>
                  {activeDropdown === 'solucoes' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-full left-0 mt-2 w-[500px] ${
                        isDarkMode ? 'bg-slate-800/95' : 'bg-white/95'
                      } backdrop-blur-xl rounded-2xl shadow-2xl border ${
                        isDarkMode ? 'border-white/10' : 'border-gray-200/50'
                      } p-6`}
                      style={{
                        boxShadow: isDarkMode
                          ? '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                          : '0 20px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        {solucoesItems.map((item, index) => {
                          const IconComponent = item.icon
                          return (
                            <motion.a
                              key={item.name}
                              href="#"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`p-3 rounded-xl transition-all duration-300 ${
                                isDarkMode 
                                  ? 'hover:bg-white/10 text-white' 
                                  : 'hover:bg-gray-50 text-gray-900'
                              } group border ${
                                isDarkMode ? 'border-white/5' : 'border-gray-100'
                              } hover:border-orange-200`}
                            >
                              <div className="flex items-start space-x-2">
                                <div className={`p-1.5 rounded-lg ${
                                  isDarkMode ? 'bg-orange-500/20' : 'bg-orange-50'
                                } group-hover:bg-orange-500/30 transition-colors`}>
                                  <IconComponent className="w-4 h-4 text-orange-500" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-semibold group-hover:text-orange-500 transition-colors mb-0.5">
                                    {item.name}
                                  </div>
                                  <div className={`text-xs leading-relaxed ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    {item.description}
                                  </div>
                                </div>
                              </div>
                            </motion.a>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Segmentos Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('segmentos')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isDarkMode ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100/80'
                } backdrop-blur-sm`}>
                  <span className="font-medium">Segmentos</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                <AnimatePresence>
                  {activeDropdown === 'segmentos' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-full left-0 mt-2 w-[500px] ${
                        isDarkMode ? 'bg-slate-800/95' : 'bg-white/95'
                      } backdrop-blur-xl rounded-2xl shadow-2xl border ${
                        isDarkMode ? 'border-white/10' : 'border-gray-200/50'
                      } p-6`}
                      style={{
                        boxShadow: isDarkMode
                          ? '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                          : '0 20px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      <div className="grid grid-cols-3 gap-2">
                        {segmentosItems.map((item, index) => (
                          <motion.a
                            key={item}
                            href="#"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className={`p-2.5 rounded-xl transition-all duration-300 ${
                              isDarkMode 
                                ? 'hover:bg-white/10 text-white border border-white/5' 
                                : 'hover:bg-gray-50 text-gray-900 border border-gray-100'
                            } group text-xs font-medium hover:text-orange-500 hover:border-orange-200`}
                          >
                            <div className="flex items-center space-x-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                isDarkMode ? 'bg-orange-400' : 'bg-orange-500'
                              } group-hover:scale-125 transition-transform`}></div>
                              <span className="truncate">{item}</span>
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <a href="#planos" className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                isDarkMode ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100/80'
              } backdrop-blur-sm font-medium`}>
                Planos
              </a>

              <a href="#sobre" className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                isDarkMode ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100/80'
              } backdrop-blur-sm font-medium`}>
                Empresa
              </a>

              <Link href="/blog" className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-300 ${
                isDarkMode ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100/80'
              } backdrop-blur-sm font-medium`}>
                <BookOpen className="w-4 h-4" />
                <span>Blog</span>
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              
              {/* Phone */}
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <Phone className={`w-4 h-4 ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`} />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  (11) 99999-9999
                </span>
              </div>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDarkMode ? 'bg-white/10 text-white' : 'bg-gray-100/80 text-gray-700'
                } backdrop-blur-sm`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>

              {/* Entrar Button */}
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`hidden md:block px-6 py-2 rounded-xl transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' 
                      : 'bg-gray-100/80 text-gray-700 border border-gray-200/50 hover:bg-gray-200/80'
                  } backdrop-blur-sm font-medium`}
                >
                  Entrar
                </motion.button>
              </Link>

              {/* CTA Button */}
              <a href="#planos">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(249, 115, 22, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 backdrop-blur-sm"
                >
                  Começar agora
                </motion.button>
              </a>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMenu}
                className={`lg:hidden p-2 rounded-lg ${
                  isDarkMode ? 'text-white' : 'text-gray-700'
                }`}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`lg:hidden ${
              isDarkMode ? 'bg-slate-900/95' : 'bg-white/95'
            } backdrop-blur-xl border-t ${
              isDarkMode ? 'border-white/10' : 'border-gray-200/50'
            }`}
          >
            <div className="container mx-auto px-6 py-6 space-y-4">
              <Link href="/solucoes" className={`block py-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } font-medium`}>
                Soluções
              </Link>
              <Link href="/segmentos" className={`block py-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } font-medium`}>
                Segmentos
              </Link>
              <Link href="/planos" className={`block py-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } font-medium`}>
                Planos
              </Link>
              <Link href="/empresa" className={`block py-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } font-medium`}>
                Empresa
              </Link>
              <Link href="/blog" className={`block py-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } font-medium`}>
                Blog
              </Link>
              <div className="pt-4 border-t border-gray-200/20">
                <button className={`block w-full text-left py-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                } font-medium`}>
                  Entrar
                </button>
                <button className="w-full mt-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium">
                  Começar agora
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header
