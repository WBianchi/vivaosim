'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Calendar, User, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeProvider'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeroProps {
  title: string
  description: string
  breadcrumbs?: BreadcrumbItem[]
  showBackButton?: boolean
  backButtonText?: string
  backButtonHref?: string
  badge?: {
    text: string
    variant?: 'primary' | 'secondary' | 'success' | 'warning'
  }
  metadata?: {
    author?: string
    date?: string
    readTime?: string
  }
  backgroundPattern?: boolean
  size?: 'small' | 'medium' | 'large'
}

const PageHero: React.FC<PageHeroProps> = ({
  title,
  description,
  breadcrumbs,
  showBackButton = false,
  backButtonText = 'Voltar',
  backButtonHref = '/',
  badge,
  metadata,
  backgroundPattern = true,
  size = 'medium'
}) => {
  const { isDarkMode } = useTheme()

  const getBadgeStyles = (variant: string = 'primary') => {
    const variants = {
      primary: isDarkMode 
        ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' 
        : 'bg-orange-100 text-orange-700 border-orange-200',
      secondary: isDarkMode 
        ? 'bg-slate-700/50 text-slate-300 border-slate-600' 
        : 'bg-gray-100 text-gray-700 border-gray-200',
      success: isDarkMode 
        ? 'bg-green-500/20 text-green-300 border-green-500/30' 
        : 'bg-green-100 text-green-700 border-green-200',
      warning: isDarkMode 
        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' 
        : 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
    return variants[variant as keyof typeof variants] || variants.primary
  }

  const getSizeStyles = () => {
    const sizes = {
      small: 'py-12 md:py-16',
      medium: 'py-16 md:py-24',
      large: 'py-24 md:py-32'
    }
    return sizes[size]
  }

  return (
    <section className={`relative ${getSizeStyles()} ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    } overflow-hidden`}>
      
      {/* Background Pattern */}
      {backgroundPattern && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>
      )}

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900/50 via-transparent to-orange-900/10' 
          : 'bg-gradient-to-br from-white/50 via-transparent to-orange-50/50'
      }`} />

      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center space-x-2 mb-6"
            >
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  {item.href ? (
                    <Link 
                      href={item.href}
                      className={`text-sm ${
                        isDarkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-500'
                      } transition-colors`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {item.label}
                    </span>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight className={`w-4 h-4 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </motion.nav>
          )}

          {/* Back Button */}
          {showBackButton && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex justify-center mb-6"
            >
              <Link href={backButtonHref}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-slate-700' 
                      : 'bg-white/50 text-gray-600 hover:bg-white border border-gray-200'
                  } backdrop-blur-sm transition-all`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">{backButtonText}</span>
                </motion.button>
              </Link>
            </motion.div>
          )}

          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${
                getBadgeStyles(badge.variant)
              } backdrop-blur-sm`}>
                {badge.text}
              </div>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            } leading-tight`}
          >
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              {title.split(' ')[0]}
            </span>
            {title.split(' ').length > 1 && (
              <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                {' ' + title.split(' ').slice(1).join(' ')}
              </span>
            )}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`text-xl md:text-2xl ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } max-w-3xl mx-auto leading-relaxed`}
          >
            {description}
          </motion.p>

          {/* Metadata */}
          {metadata && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center justify-center space-x-6 mt-8"
            >
              {metadata.author && (
                <div className="flex items-center space-x-2">
                  <User className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {metadata.author}
                  </span>
                </div>
              )}
              {metadata.date && (
                <div className="flex items-center space-x-2">
                  <Calendar className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {metadata.date}
                  </span>
                </div>
              )}
              {metadata.readTime && (
                <div className="flex items-center space-x-2">
                  <Clock className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {metadata.readTime}
                  </span>
                </div>
              )}
            </motion.div>
          )}

        </div>
      </div>
    </section>
  )
}

export default PageHero
