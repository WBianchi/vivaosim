'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Menu, X, Sun, Moon, Phone, TrendingUp, Users, Calendar, Truck, Megaphone, Zap, DollarSign, BarChart3, FileText, LogOut, User, MessageSquare, Columns3, UserCircle, Wallet, Settings, Briefcase, GitBranch, MessageCircle, BookOpen, PieChart } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'
import { useAuth } from '@/contexts/AuthContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [logoConfig, setLogoConfig] = useState<{ 
    logo: string | null
    logoSize: string
    logoWidth: number
    logoHeight: number
  }>({ logo: null, logoSize: 'medium', logoWidth: 40, logoHeight: 40 })
  const { isDarkMode, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  // Calcular tamanho da logo
  const getLogoSize = () => {
    const sizes: Record<string, number> = {
      small: 32,
      medium: 40,
      large: 56,
      custom: logoConfig.logoHeight
    }
    return sizes[logoConfig.logoSize] || 40
  }

  // Carregar logo do site
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const response = await fetch('/api/settings/site')
        const data = await response.json()
        if (data.success && data.config) {
          setLogoConfig({
            logo: data.config.logo,
            logoSize: data.config.logoSize || 'medium',
            logoWidth: data.config.logoWidth || 40,
            logoHeight: data.config.logoHeight || 40
          })
        }
      } catch (error) {
        console.error('❌ Erro ao carregar logo:', error)
      }
    }
    
    loadLogo()

    // Listener para atualização em tempo real
    const handleConfigUpdate = (event: any) => {
      const config = event.detail
      if (config) {
        setLogoConfig({
          logo: config.logo,
          logoSize: config.logoSize || 'medium',
          logoWidth: config.logoWidth || 40,
          logoHeight: config.logoHeight || 40
        })
      }
    }

    window.addEventListener('siteConfigUpdated', handleConfigUpdate)
    return () => window.removeEventListener('siteConfigUpdated', handleConfigUpdate)
  }, [])

  const solucoesItems = [
    { name: 'Vendas', description: 'Gerencie todo processo de vendas e propostas comerciais', icon: TrendingUp, href: '/solucoes/vendas' },
    { name: 'Relacionamento', description: 'CRM completo para gestão de clientes e leads', icon: Users, href: '/solucoes/relacionamento' },
    { name: 'Planejamento', description: 'Organize e planeje seus eventos com eficiência', icon: Calendar, href: '/solucoes/planejamento' },
    { name: 'Logística', description: 'Controle operacional e gestão de recursos', icon: Truck, href: '/solucoes/logistica' },
    { name: 'Marketing', description: 'Campanhas digitais e automação de marketing', icon: Megaphone, href: '/solucoes/marketing' },
    { name: 'Automação', description: 'Processos automatizados e workflows inteligentes', icon: Zap, href: '/solucoes/automacao' },
    { name: 'Finanças', description: 'Gestão financeira completa e controle de custos', icon: DollarSign, href: '/solucoes/financas' },
    { name: 'Análises', description: 'Relatórios avançados e dashboards em tempo real', icon: BarChart3, href: '/solucoes/analises' },
    { name: 'Fiscal e Jurídico', description: 'Compliance, contratos e documentos legais', icon: FileText, href: '/solucoes/fiscal' }
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

  // Menu items baseado no role
  const getMenuItems = () => {
    const baseItems = [
      { label: 'Meu Perfil', icon: User, href: '/profile', color: 'orange' }
    ]

    if (user?.role === 'ADMINISTRADOR') {
      return [
        { label: 'Visão Geral', icon: BarChart3, href: '/dashboard', color: 'orange' },
        { label: 'Chat ao Vivo', icon: MessageSquare, href: '/chat', color: 'orange' },
        { label: 'Kanban', icon: Columns3, href: '/kanban', color: 'orange' },
        { label: 'Atendentes', icon: UserCircle, href: '/attendants', color: 'orange' },
        { label: 'Financeiro', icon: Wallet, href: '/financial', color: 'orange' },
        { label: 'Usuários', icon: Users, href: '/users', color: 'orange' },
        { label: 'Sites', icon: Briefcase, href: '/sites', color: 'orange' },
        { label: 'Marketing', icon: Megaphone, href: '/marketing', color: 'orange' },
        { label: 'Fluxograma', icon: GitBranch, href: '/flowchart', color: 'orange' },
        { label: 'Agentes', icon: MessageCircle, href: '/agents', color: 'orange' },
        { label: 'Chat Interno', icon: MessageCircle, href: '/internal-chat', color: 'orange' },
        { label: 'Blog', icon: BookOpen, href: '/blog', color: 'orange' },
        { label: 'Relatórios', icon: PieChart, href: '/reports', color: 'orange' },
        { label: 'Configurações', icon: Settings, href: '/settings', color: 'orange' },
        ...baseItems
      ]
    }

    if (user?.role === 'ATENDENTE') {
      return [
        { label: 'Dashboard', icon: BarChart3, href: '/dashboard', color: 'orange' },
        { label: 'Chat ao Vivo', icon: MessageSquare, href: '/chat', color: 'orange' },
        { label: 'Kanban', icon: Columns3, href: '/kanban', color: 'orange' },
        { label: 'Chat Interno', icon: MessageCircle, href: '/internal-chat', color: 'orange' },
        ...baseItems
      ]
    }

    if (user?.role === 'ASSINANTE') {
      return [
        { label: 'Dashboard', icon: BarChart3, href: '/dashboard', color: 'orange' },
        { label: 'Meus Eventos', icon: Calendar, href: '/events', color: 'orange' },
        { label: 'Orçamentos', icon: DollarSign, href: '/quotes', color: 'orange' },
        { label: 'Contratos', icon: FileText, href: '/contracts', color: 'orange' },
        ...baseItems
      ]
    }

    return baseItems
  }

  const menuItems = getMenuItems()

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
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 md:space-x-3"
            >
              {logoConfig.logo ? (
                <img 
                  src={logoConfig.logo} 
                  alt="Viva o Sim" 
                  style={{ 
                    height: `${getLogoSize()}px`,
                    width: logoConfig.logoSize === 'custom' ? `${logoConfig.logoWidth}px` : 'auto'
                  }}
                  className="object-contain"
                />
              ) : (
                <>
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl ${
                    isDarkMode ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-orange-500 to-orange-600'
                  } flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-lg md:text-xl">V</span>
                  </div>
                  <span className={`text-lg md:text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Viva o Sim
                  </span>
                </>
              )}
            </motion.div>

            {/* Desktop Navigaetsion */}
            <nav className="hidden lg:flex items-center space-x-4">
              
              {/* Soluções Dropdowsn */}
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
                            <Link
                              key={item.name}
                              href={item.href}
                            >
                              <motion.div
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
                              </motion.div>
                            </Link>
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
                        {segmentosItems.map((item, index) => {
                          const slug = item.toLowerCase()
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .replace(/\s+/g, '-')
                          
                          return (
                            <Link
                              key={item}
                              href={`/segmentos/${slug}`}
                            >
                              <motion.div
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
                              </motion.div>
                            </Link>
                          )
                        })}
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
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-1 md:space-x-3">
              
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

              {/* User Menu / Entrar Button */}
              {user ? (
                <div 
                  className="relative hidden md:block"
                  onMouseEnter={() => setActiveDropdown('user')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' 
                        : 'bg-gray-100/80 text-gray-700 border border-gray-200/50 hover:bg-gray-200/80'
                    } backdrop-blur-sm font-medium`}
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <span className="max-w-32 truncate">{user.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </motion.button>

                  <AnimatePresence>
                    {activeDropdown === 'user' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute top-full right-0 mt-2 w-72 ${
                          isDarkMode ? 'bg-slate-800/95' : 'bg-white/95'
                        } backdrop-blur-xl rounded-2xl shadow-2xl border ${
                          isDarkMode ? 'border-white/10' : 'border-gray-200/50'
                        } overflow-hidden`}
                        style={{
                          boxShadow: isDarkMode
                            ? '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                            : '0 20px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                        }}
                      >
                        {/* Header do Dropdown */}
                        <div className={`px-4 py-4 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200/50'} bg-gradient-to-r from-orange-500/10 to-orange-600/10`}>
                          <div className="flex items-center space-x-3">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full ring-2 ring-orange-500/20" />
                            ) : (
                              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600">
                                <span className="text-white font-bold text-lg">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {user.name}
                              </p>
                              <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {user.email}
                              </p>
                              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                {user.role}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Menu Items */}
                        <div className="p-2 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-transparent">
                          {menuItems.map((item, idx) => {
                            const ItemIcon = item.icon
                            return (
                              <Link key={idx} href={item.href}>
                                <motion.button 
                                  whileHover={{ x: 4 }}
                                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all ${
                                    isDarkMode ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    isDarkMode ? 'bg-orange-500/20' : 'bg-orange-50'
                                  }`}>
                                    <ItemIcon className="w-4 h-4 text-orange-500" />
                                  </div>
                                  <span className="text-sm font-medium">{item.label}</span>
                                </motion.button>
                              </Link>
                            )
                          })}

                          <div className={`my-2 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200/50'}`} />

                          <motion.button 
                            whileHover={{ x: 4 }}
                            onClick={logout}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all text-red-500 ${
                              isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isDarkMode ? 'bg-red-500/20' : 'bg-red-50'
                            }`}>
                              <LogOut className="w-4 h-4 text-red-500" />
                            </div>
                            <span className="text-sm font-medium">Sair</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
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
              )}

              {/* CTA Button */}
              <a href="#planos" className="hidden md:block">
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
              <a href="#sobre" className={`block py-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } font-medium`}>
                Empresa
              </a>
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
