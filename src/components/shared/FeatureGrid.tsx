'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Check, 
  TrendingUp, 
  Target, 
  Users, 
  BarChart3, 
  Phone, 
  Calendar,
  DollarSign,
  Mail,
  MessageSquare,
  FileText,
  Zap,
  CheckCircle,
  Clock,
  Award,
  PieChart,
  Mic,
  Video,
  Network,
  Shield,
  BarChart,
  Calculator,
  Utensils,
  Palette,
  Gift,
  Music,
  Camera,
  List,
  Play
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'

interface Feature {
  title: string
  description: string
  icon: string
  benefits?: string[]
  link?: {
    text: string
    href: string
  }
}

interface FeatureGridProps {
  title?: string
  subtitle?: string
  description?: string
  features: Feature[]
  columns?: 2 | 3 | 4
  variant?: 'default' | 'cards' | 'list' | 'minimal' | 'gradient'
  showAnimation?: boolean
}

const FeatureGrid: React.FC<FeatureGridProps> = ({
  title,
  subtitle,
  description,
  features,
  columns = 3,
  variant = 'default',
  showAnimation = true
}) => {
  const { isDarkMode } = useTheme()

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      'trending-up': TrendingUp,
      'target': Target,
      'users': Users,
      'bar-chart-3': BarChart3,
      'phone': Phone,
      'calendar': Calendar,
      'dollar-sign': DollarSign,
      'mail': Mail,
      'message-square': MessageSquare,
      'file-text': FileText,
      'zap': Zap,
      'check-circle': CheckCircle,
      'clock': Clock,
      'award': Award,
      'pie-chart': PieChart,
      'mic': Mic,
      'video': Video,
      'network': Network,
      'shield': Shield,
      'bar-chart': BarChart,
      'calculator': Calculator,
      'utensils': Utensils,
      'palette': Palette,
      'gift': Gift,
      'music': Music,
      'camera': Camera,
      'list': List,
      'play': Play
    }
    return icons[iconName] || Target
  }

  const getGridCols = () => {
    const colsMap = {
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    }
    return colsMap[columns]
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const renderFeatureCard = (feature: Feature, index: number) => {
    const IconComponent = getIcon(feature.icon)

    if (variant === 'cards') {
      return (
        <motion.div
          key={index}
          variants={showAnimation ? itemVariants : {}}
          whileHover={{ y: -5, scale: 1.02 }}
          className={`p-8 rounded-2xl ${
            isDarkMode 
              ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800/70' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          } border backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl group`}
        >
          <div className={`w-16 h-16 rounded-xl ${
            isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'
          } flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
            <IconComponent className={`w-8 h-8 ${
              isDarkMode ? 'text-orange-400' : 'text-orange-500'
            }`} />
          </div>
          
          <h3 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {feature.title}
          </h3>
          
          <p className={`${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          } leading-relaxed mb-6`}>
            {feature.description}
          </p>

          {feature.benefits && feature.benefits.length > 0 && (
            <ul className="space-y-2 mb-6">
              {feature.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <Check className={`w-4 h-4 ${
                    isDarkMode ? 'text-green-400' : 'text-green-500'
                  }`} />
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {feature.link && (
            <a
              href={feature.link.href}
              className={`inline-flex items-center space-x-2 text-sm font-medium ${
                isDarkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-500 hover:text-orange-600'
              } transition-colors group`}
            >
              <span>{feature.link.text}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          )}
        </motion.div>
      )
    }

    if (variant === 'list') {
      return (
        <motion.div
          key={index}
          variants={showAnimation ? itemVariants : {}}
          className={`flex items-start space-x-4 p-6 rounded-xl ${
            isDarkMode 
              ? 'bg-slate-800/30 hover:bg-slate-800/50' 
              : 'bg-gray-50 hover:bg-white'
          } transition-all duration-300 group`}
        >
          <div className={`w-12 h-12 rounded-lg ${
            isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'
          } flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
            <IconComponent className={`w-6 h-6 ${
              isDarkMode ? 'text-orange-400' : 'text-orange-500'
            }`} />
          </div>
          
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {feature.title}
            </h3>
            
            <p className={`${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } leading-relaxed`}>
              {feature.description}
            </p>

            {feature.link && (
              <a
                href={feature.link.href}
                className={`inline-flex items-center space-x-1 text-sm font-medium mt-3 ${
                  isDarkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-500 hover:text-orange-600'
                } transition-colors group`}
              >
                <span>{feature.link.text}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </div>
        </motion.div>
      )
    }

    if (variant === 'minimal') {
      return (
        <motion.div
          key={index}
          variants={showAnimation ? itemVariants : {}}
          className="text-center group"
        >
          <div className={`w-20 h-20 rounded-full ${
            isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'
          } flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
            <IconComponent className={`w-10 h-10 ${
              isDarkMode ? 'text-orange-400' : 'text-orange-500'
            }`} />
          </div>
          
          <h3 className={`text-xl font-semibold mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {feature.title}
          </h3>
          
          <p className={`${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          } leading-relaxed`}>
            {feature.description}
          </p>
        </motion.div>
      )
    }

    // Default variant
    return (
      <motion.div
        key={index}
        variants={showAnimation ? itemVariants : {}}
        whileHover={{ scale: 1.02 }}
        className={`p-6 rounded-xl ${
          isDarkMode 
            ? 'bg-slate-800/30 hover:bg-slate-800/50' 
            : 'bg-white/50 hover:bg-white'
        } backdrop-blur-sm transition-all duration-300 border ${
          isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'
        } group`}
      >
        <div className={`w-14 h-14 rounded-xl ${
          isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'
        } flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <IconComponent className={`w-7 h-7 ${
            isDarkMode ? 'text-orange-400' : 'text-orange-500'
          }`} />
        </div>
        
        <h3 className={`text-lg font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {feature.title}
        </h3>
        
        <p className={`${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        } leading-relaxed text-sm`}>
          {feature.description}
        </p>
      </motion.div>
    )
  }

  return (
    <section className={`py-16 ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-6">
        
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {subtitle && (
              <motion.p
                initial={showAnimation ? { opacity: 0, y: 20 } : {}}
                whileInView={showAnimation ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className={`text-lg ${
                  isDarkMode ? 'text-orange-400' : 'text-orange-500'
                } font-medium mb-4`}
              >
                {subtitle}
              </motion.p>
            )}
            
            {title && (
              <motion.h2
                initial={showAnimation ? { opacity: 0, y: 30 } : {}}
                whileInView={showAnimation ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className={`text-3xl md:text-4xl lg:text-5xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                } max-w-4xl mx-auto leading-tight`}
              >
                {title}
              </motion.h2>
            )}
          </div>
        )}

        {/* Features Grid */}
        <motion.div
          initial={showAnimation ? "hidden" : "visible"}
          whileInView={showAnimation ? "visible" : "visible"}
          viewport={{ once: true }}
          variants={containerVariants}
          className={`grid ${getGridCols()} gap-8`}
        >
          {features.map((feature, index) => renderFeatureCard(feature, index))}
        </motion.div>

      </div>
    </section>
  )
}

export default FeatureGrid
