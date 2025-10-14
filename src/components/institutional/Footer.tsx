'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter,
  Youtube,
  ArrowRight,
  Shield,
  Award,
  Clock,
  Users,
  Star,
  CheckCircle,
  TrendingUp,
  Calendar,
  Truck,
  Megaphone,
  Zap,
  DollarSign,
  BarChart3,
  FileText,
  Home,
  Search,
  MessageCircle,
  Bell,
  User
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'

const Footer = () => {
  const [email, setEmail] = useState('')
  const { isDarkMode } = useTheme()

  // Add padding to body on mobile to prevent content being hidden behind fixed footer
  useEffect(() => {
    const addBodyPadding = () => {
      if (window.innerWidth < 768) {
        document.body.style.paddingBottom = '80px'
      } else {
        document.body.style.paddingBottom = '0px'
      }
    }

    addBodyPadding()
    window.addEventListener('resize', addBodyPadding)
    
    return () => {
      document.body.style.paddingBottom = '0px'
      window.removeEventListener('resize', addBodyPadding)
    }
  }, [])

  const solucoesLinks = [
    { name: 'Vendas', href: '/solucoes/vendas', icon: TrendingUp },
    { name: 'Relacionamento', href: '/solucoes/relacionamento', icon: Users },
    { name: 'Planejamento', href: '/solucoes/planejamento', icon: Calendar },
    { name: 'Logística', href: '/solucoes/logistica', icon: Truck },
    { name: 'Marketing', href: '/solucoes/marketing', icon: Megaphone },
    { name: 'Automação', href: '/solucoes/automacao', icon: Zap },
    { name: 'Finanças', href: '/solucoes/financas', icon: DollarSign },
    { name: 'Análises', href: '/solucoes/analises', icon: BarChart3 },
    { name: 'Fiscal e Jurídico', href: '/solucoes/fiscal', icon: FileText }
  ]

  const segmentosLinks = [
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

  const empresaLinks = [
    { name: 'Sobre Nós', href: '/sobre' },
    { name: 'Nossa História', href: '/historia' },
    { name: 'Equipe', href: '/equipe' },
    { name: 'Carreiras', href: '/carreiras' },
    { name: 'Imprensa', href: '/imprensa' },
    { name: 'Parceiros', href: '/parceiros' }
  ]

  const recursosLinks = [
    { name: 'Central de Ajuda', href: '/ajuda' },
    { name: 'Documentação', href: '/docs' },
    { name: 'API', href: '/api' },
    { name: 'Webinars', href: '/webinars' },
    { name: 'Casos de Sucesso', href: '/casos-sucesso' },
    { name: 'Templates', href: '/templates' }
  ]

  const legalLinks = [
    { name: 'Termos de Uso', href: '/termos' },
    { name: 'Política de Privacidade', href: '/privacidade' },
    { name: 'Cookies', href: '/cookies' },
    { name: 'LGPD', href: '/lgpd' }
  ]

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email)
    setEmail('')
  }

  return (
    <footer className={`relative ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    } border-t ${
      isDarkMode ? 'border-slate-800' : 'border-gray-200'
    } overflow-hidden`}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Newsletter CTA Section */}
      <div className={`relative ${
        isDarkMode ? 'bg-gradient-to-r from-slate-800 to-slate-900' : 'bg-gradient-to-r from-orange-500 to-orange-600'
      } py-16`}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Fique por dentro das novidades
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Receba dicas exclusivas, atualizações de produto e conteúdos especiais 
                para fazer seus eventos serem ainda mais incríveis.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu melhor e-mail"
                    className={`w-full px-6 py-4 rounded-xl ${
                      isDarkMode 
                        ? 'bg-white/10 text-white placeholder-white/70 border border-white/20' 
                        : 'bg-white/20 text-white placeholder-white/80 border border-white/30'
                    } backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition-all`}
                    required
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className={`px-8 py-4 ${
                    isDarkMode 
                      ? 'bg-orange-500 hover:bg-orange-600' 
                      : 'bg-white hover:bg-gray-100 text-orange-600'
                  } rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all shadow-lg`}
                >
                  <Send className="w-5 h-5" />
                  <span>Inscrever</span>
                </motion.button>
              </form>
              
              <p className="text-white/70 text-sm mt-4">
                📧 Mais de 50.000 profissionais já recebem nossas dicas semanais
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
            
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">V</span>
                </div>
                <span className={`text-3xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Viva o Sim
                </span>
              </div>
              
              <p className={`text-lg ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              } mb-6 leading-relaxed`}>
                A plataforma mais completa para gestão de eventos. 
                Transformamos ideias em experiências inesquecíveis.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-slate-800/50' : 'bg-white'
                } border ${
                  isDarkMode ? 'border-slate-700' : 'border-gray-200'
                } shadow-sm`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <Users className="w-5 h-5 text-orange-500" />
                    <span className={`text-2xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>50k+</span>
                  </div>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Clientes ativos</p>
                </div>
                
                <div className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-slate-800/50' : 'bg-white'
                } border ${
                  isDarkMode ? 'border-slate-700' : 'border-gray-200'
                } shadow-sm`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <span className={`text-2xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>1M+</span>
                  </div>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Eventos realizados</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    (11) 99999-9999
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-orange-500" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    contato@vivaosim.com.br
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Av. Paulista, 1000 - São Paulo, SP
                  </span>
                </div>
              </div>
            </div>

            {/* Soluções */}
            <div>
              <h3 className={`text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } mb-6`}>
                Soluções
              </h3>
              <ul className="space-y-3">
                {solucoesLinks.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <li key={item.name}>
                      <Link 
                        href={item.href}
                        className={`flex items-center space-x-2 ${
                          isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-600 hover:text-orange-500'
                        } transition-colors group`}
                      >
                        <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Segmentos */}
            <div>
              <h3 className={`text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } mb-6`}>
                Segmentos
              </h3>
              <ul className="space-y-3">
                {segmentosLinks.map((item) => {
                  const slug = item
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/\s+/g, '-')
                  
                  return (
                    <li key={item}>
                      <Link 
                        href={`/segmentos/${slug}`}
                        className={`flex items-center space-x-2 ${
                          isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-600 hover:text-orange-500'
                        } transition-colors group`}
                      >
                        <div className="w-2 h-2 rounded-full bg-orange-500 group-hover:scale-125 transition-transform" />
                        <span className="text-sm">{item}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h3 className={`text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } mb-6`}>
                Empresa
              </h3>
              <ul className="space-y-3">
                {empresaLinks.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className={`${
                        isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-600 hover:text-orange-500'
                      } transition-colors hover:translate-x-1 transform duration-200 block`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <h4 className={`text-sm font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                } mb-4`}>
                  Recursos
                </h4>
                <ul className="space-y-2">
                  {recursosLinks.map((item) => (
                    <li key={item.name}>
                      <Link 
                        href={item.href}
                        className={`text-sm ${
                          isDarkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-500 hover:text-orange-500'
                        } transition-colors`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Suporte & Legal */}
            <div>
              <h3 className={`text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } mb-6`}>
                Suporte
              </h3>
              
              {/* Trust Badges */}
              <div className="space-y-4 mb-8">
                <div className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-slate-800/50' : 'bg-white'
                } border ${
                  isDarkMode ? 'border-slate-700' : 'border-gray-200'
                } shadow-sm`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>100% Seguro</span>
                  </div>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>SSL e LGPD</p>
                </div>
                
                <div className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-slate-800/50' : 'bg-white'
                } border ${
                  isDarkMode ? 'border-slate-700' : 'border-gray-200'
                } shadow-sm`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Suporte 24/7</span>
                  </div>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Chat e WhatsApp</p>
                </div>
                
                <div className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-slate-800/50' : 'bg-white'
                } border ${
                  isDarkMode ? 'border-slate-700' : 'border-gray-200'
                } shadow-sm`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Premiado</span>
                  </div>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Melhor CRM 2024</p>
                </div>
              </div>

              {/* Legal Links */}
              <div>
                <h4 className={`text-sm font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                } mb-4`}>
                  Legal
                </h4>
                <ul className="space-y-2">
                  {legalLinks.map((item) => (
                    <li key={item.name}>
                      <Link 
                        href={item.href}
                        className={`text-sm ${
                          isDarkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-500 hover:text-orange-500'
                        } transition-colors`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`border-t ${
        isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-gray-100/50'
      } py-8`}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            
            {/* Copyright */}
            <div className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              © 2024 Viva o Sim. Todos os direitos reservados. 
              <span className="mx-2">•</span>
              Feito com ❤️ em São Paulo
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Siga-nos:
              </span>
              {[
                { icon: Instagram, href: 'https://instagram.com/vivaosim', label: 'Instagram' },
                { icon: Linkedin, href: 'https://linkedin.com/company/vivaosim', label: 'LinkedIn' },
                { icon: Facebook, href: 'https://facebook.com/vivaosim', label: 'Facebook' },
                { icon: Youtube, href: 'https://youtube.com/vivaosim', label: 'YouTube' },
                { icon: Twitter, href: 'https://twitter.com/vivaosim', label: 'Twitter' }
              ].map((social) => {
                const IconComponent = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-lg ${
                      isDarkMode 
                        ? 'bg-slate-800 text-gray-400 hover:text-orange-400 hover:bg-slate-700' 
                        : 'bg-white text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                    } border ${
                      isDarkMode ? 'border-slate-700' : 'border-gray-200'
                    } transition-all shadow-sm`}
                    aria-label={social.label}
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </div>

            {/* Back to Top */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-slate-800 text-gray-400 hover:text-orange-400 hover:bg-slate-700' 
                  : 'bg-white text-gray-600 hover:text-orange-500 hover:bg-orange-50'
              } border ${
                isDarkMode ? 'border-slate-700' : 'border-gray-200'
              } transition-all shadow-sm text-sm`}
            >
              <span>Voltar ao topo</span>
              <ArrowRight className="w-4 h-4 rotate-[-90deg]" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Fixed */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
        <div className={`${
          isDarkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-gray-200'
        } backdrop-blur-xl border-t shadow-2xl`}>
          <div className="grid grid-cols-5 h-16">
            <Link 
              href="/"
              className="flex flex-col items-center justify-center gap-1 group"
            >
              <Home className={`w-6 h-6 ${
                isDarkMode ? 'text-gray-400 group-hover:text-orange-400' : 'text-gray-600 group-hover:text-orange-500'
              } transition-colors`} />
              <span className={`text-xs ${
                isDarkMode ? 'text-gray-400 group-hover:text-orange-400' : 'text-gray-600 group-hover:text-orange-500'
              }`}>Início</span>
            </Link>
            
            <Link 
              href="/ajuda"
              className="flex flex-col items-center justify-center gap-1 group"
            >
              <Search className={`w-6 h-6 ${
                isDarkMode ? 'text-gray-400 group-hover:text-orange-400' : 'text-gray-600 group-hover:text-orange-500'
              } transition-colors`} />
              <span className={`text-xs ${
                isDarkMode ? 'text-gray-400 group-hover:text-orange-400' : 'text-gray-600 group-hover:text-orange-500'
              }`}>Buscar</span>
            </Link>
            
            <button 
              onClick={() => {
                const planosSection = document.getElementById('planos')
                planosSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="flex flex-col items-center justify-center gap-1 -mt-8"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs text-orange-500 font-semibold mt-1">Planos</span>
            </button>
            
            <Link 
              href="/chat"
              className="flex flex-col items-center justify-center gap-1 group relative"
            >
              <MessageCircle className={`w-6 h-6 ${
                isDarkMode ? 'text-gray-400 group-hover:text-orange-400' : 'text-gray-600 group-hover:text-orange-500'
              } transition-colors`} />
              <span className={`text-xs ${
                isDarkMode ? 'text-gray-400 group-hover:text-orange-400' : 'text-gray-600 group-hover:text-orange-500'
              }`}>Suporte</span>
              <span className="absolute top-0 right-6 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>
            
            <Link 
              href="/login"
              className="flex flex-col items-center justify-center gap-1 group"
            >
              <User className={`w-6 h-6 ${
                isDarkMode ? 'text-gray-400 group-hover:text-orange-400' : 'text-gray-600 group-hover:text-orange-500'
              } transition-colors`} />
              <span className={`text-xs ${
                isDarkMode ? 'text-gray-400 group-hover:text-orange-400' : 'text-gray-600 group-hover:text-orange-500'
              }`}>Conta</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
