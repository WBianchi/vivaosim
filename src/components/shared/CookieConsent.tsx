'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, Settings, Check, Shield, Eye, BarChart3 } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  })
  const { isDarkMode } = useTheme()

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setTimeout(() => setIsVisible(true), 2000)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    }
    setPreferences(allAccepted)
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted))
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    }
    setPreferences(onlyNecessary)
    localStorage.setItem('cookie-consent', JSON.stringify(onlyNecessary))
    setIsVisible(false)
  }

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    setIsVisible(false)
    setShowSettings(false)
  }

  const cookieTypes = [
    {
      id: 'necessary',
      name: 'Cookies Necessários',
      description: 'Essenciais para o funcionamento básico do site',
      icon: Shield,
      required: true
    },
    {
      id: 'functional',
      name: 'Cookies Funcionais',
      description: 'Melhoram a experiência e funcionalidades do site',
      icon: Settings,
      required: false
    },
    {
      id: 'analytics',
      name: 'Cookies de Análise',
      description: 'Nos ajudam a entender como você usa nosso site',
      icon: BarChart3,
      required: false
    },
    {
      id: 'marketing',
      name: 'Cookies de Marketing',
      description: 'Personalizam anúncios e conteúdo relevante',
      icon: Eye,
      required: false
    }
  ]

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-6 left-6 right-6 z-50 max-w-md mx-auto lg:left-auto lg:right-6 lg:mx-0"
      >
        <div className={`relative rounded-2xl overflow-hidden ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        } border ${
          isDarkMode ? 'border-slate-700' : 'border-gray-200'
        } shadow-2xl backdrop-blur-xl`}
        style={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
        }}>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500" />
          
          <div className="p-6">
            {!showSettings ? (
              <>
                {/* Main Cookie Notice */}
                <div className="flex items-start space-x-4 mb-6">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg"
                  >
                    <Cookie className="w-6 h-6 text-white" />
                  </motion.div>
                  
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    } mb-2`}>
                      Cookies & Privacidade
                    </h3>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    } leading-relaxed`}>
                      Usamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdo. 
                      Você pode escolher quais cookies aceitar.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3">
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAcceptAll}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Aceitar Todos
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleRejectAll}
                      className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-slate-700 text-gray-300 hover:bg-slate-600 border border-slate-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                      }`}
                    >
                      Rejeitar
                    </motion.button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSettings(true)}
                    className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                      isDarkMode 
                        ? 'text-orange-400 hover:bg-slate-700' 
                        : 'text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Personalizar Cookies</span>
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                {/* Cookie Settings */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Configurações de Cookies
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowSettings(false)}
                    className={`p-2 rounded-lg ${
                      isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                    } transition-colors`}
                  >
                    <X className={`w-5 h-5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                  </motion.button>
                </div>

                {/* Cookie Types */}
                <div className="space-y-4 mb-6">
                  {cookieTypes.map((type, index) => {
                    const Icon = type.icon
                    const isEnabled = preferences[type.id as keyof typeof preferences]
                    
                    return (
                      <motion.div
                        key={type.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl border ${
                          isDarkMode ? 'border-slate-700 bg-slate-700/30' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isEnabled 
                                ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white' 
                                : isDarkMode ? 'bg-slate-600 text-gray-400' : 'bg-gray-200 text-gray-500'
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            
                            <div className="flex-1">
                              <h4 className={`font-semibold text-sm ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              } mb-1`}>
                                {type.name}
                              </h4>
                              <p className={`text-xs ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {type.description}
                              </p>
                            </div>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => !type.required && setPreferences(prev => ({
                              ...prev,
                              [type.id]: !prev[type.id as keyof typeof prev]
                            }))}
                            disabled={type.required}
                            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                              isEnabled 
                                ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                                : isDarkMode ? 'bg-slate-600' : 'bg-gray-300'
                            } ${type.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <motion.div
                              animate={{ x: isEnabled ? 24 : 2 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            />
                          </motion.button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Save Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSavePreferences}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Preferências</span>
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CookieConsent
