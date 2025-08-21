'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Phone, Mail, Calendar, Play, Download, ExternalLink, Users } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeProvider'

interface CTAButton {
  text: string
  href: string
  variant: 'primary' | 'secondary' | 'outline' | 'ghost'
  icon?: 'arrow' | 'phone' | 'mail' | 'calendar' | 'play' | 'download' | 'external' | 'users'
  external?: boolean
}

interface CTASectionProps {
  title: string
  description: string
  buttons: CTAButton[]
  variant?: 'default' | 'gradient' | 'image' | 'minimal'
  backgroundImage?: string
  badge?: string
  stats?: Array<{
    value: string
    label: string
  }>
  size?: 'small' | 'medium' | 'large'
}

const CTASection: React.FC<CTASectionProps> = ({
  title,
  description,
  buttons,
  variant = 'default',
  backgroundImage,
  badge,
  stats,
  size = 'medium'
}) => {
  const { isDarkMode } = useTheme()

  const getIcon = (iconType?: string) => {
    const icons = {
      arrow: ArrowRight,
      phone: Phone,
      mail: Mail,
      calendar: Calendar,
      play: Play,
      download: Download,
      external: ExternalLink,
      users: Users
    }
    return icons[iconType as keyof typeof icons] || ArrowRight
  }

  const getButtonStyles = (buttonVariant: string) => {
    const variants = {
      primary: isDarkMode
        ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500 hover:border-orange-600'
        : 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500 hover:border-orange-600',
      secondary: isDarkMode
        ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700 hover:border-slate-600'
        : 'bg-gray-900 hover:bg-gray-800 text-white border-gray-900 hover:border-gray-800',
      outline: isDarkMode
        ? 'bg-transparent hover:bg-orange-500/10 text-orange-400 border-orange-400 hover:border-orange-300'
        : 'bg-transparent hover:bg-orange-50 text-orange-500 border-orange-500 hover:border-orange-600',
      ghost: isDarkMode
        ? 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30'
        : 'bg-black/10 hover:bg-black/20 text-gray-900 border-black/20 hover:border-black/30'
    }
    return variants[buttonVariant as keyof typeof variants] || variants.primary
  }

  const getSizeStyles = () => {
    const sizes = {
      small: 'py-12 md:py-16',
      medium: 'py-16 md:py-24',
      large: 'py-24 md:py-32'
    }
    return sizes[size]
  }

  const renderButton = (button: CTAButton, index: number) => {
    const IconComponent = getIcon(button.icon)
    
    const buttonContent = (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 border backdrop-blur-sm shadow-lg hover:shadow-xl ${
          getButtonStyles(button.variant)
        }`}
      >
        <span>{button.text}</span>
        <IconComponent className="w-5 h-5" />
      </motion.button>
    )

    if (button.external) {
      return (
        <motion.a
          key={index}
          href={button.href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
          viewport={{ once: true }}
        >
          {buttonContent}
        </motion.a>
      )
    }

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
        viewport={{ once: true }}
      >
        <Link href={button.href}>
          {buttonContent}
        </Link>
      </motion.div>
    )
  }

  const getBackgroundStyles = () => {
    if (variant === 'gradient') {
      return isDarkMode
        ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-orange-900/20'
        : 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700'
    }
    
    if (variant === 'image' && backgroundImage) {
      return `bg-cover bg-center bg-no-repeat`
    }
    
    if (variant === 'minimal') {
      return isDarkMode ? 'bg-slate-900/50' : 'bg-gray-50/50'
    }
    
    return isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
  }

  return (
    <section 
      className={`relative ${getSizeStyles()} ${getBackgroundStyles()} overflow-hidden`}
      style={variant === 'image' && backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      
      {/* Background Elements */}
      {variant !== 'minimal' && (
        <>
          {/* Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }} />
          </div>

          {/* Overlay */}
          {(variant === 'image' || variant === 'gradient') && (
            <div className={`absolute inset-0 ${
              variant === 'image' 
                ? 'bg-black/60' 
                : isDarkMode ? 'bg-slate-900/20' : 'bg-white/10'
            }`} />
          )}
        </>
      )}

      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex justify-center mb-6"
            >
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${
                variant === 'gradient' || variant === 'image'
                  ? 'bg-white/20 text-white border-white/30 backdrop-blur-sm'
                  : isDarkMode
                    ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                    : 'bg-orange-100 text-orange-700 border-orange-200'
              }`}>
                {badge}
              </div>
            </motion.div>
          )}

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight ${
              variant === 'gradient' || variant === 'image'
                ? 'text-white'
                : isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            {title}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${
              variant === 'gradient' || variant === 'image'
                ? 'text-white/90'
                : isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {description}
          </motion.p>

          {/* Stats */}
          {stats && stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-center justify-center space-x-8 md:space-x-12 mb-8"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-2xl md:text-3xl font-bold mb-1 ${
                    variant === 'gradient' || variant === 'image'
                      ? 'text-white'
                      : isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm ${
                    variant === 'gradient' || variant === 'image'
                      ? 'text-white/80'
                      : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {buttons.map((button, index) => renderButton(button, index))}
          </div>

        </div>
      </div>
    </section>
  )
}

export default CTASection
