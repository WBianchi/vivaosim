'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeProvider'

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: LucideIcon
  color: 'blue' | 'green' | 'purple' | 'orange' | 'indigo' | 'yellow' | 'emerald' | 'rose'
}

const colorVariants = {
  blue: {
    bg: 'from-blue-500/10 to-blue-600/10',
    icon: 'text-blue-500',
    border: 'border-blue-500/20'
  },
  green: {
    bg: 'from-green-500/10 to-green-600/10',
    icon: 'text-green-500',
    border: 'border-green-500/20'
  },
  purple: {
    bg: 'from-purple-500/10 to-purple-600/10',
    icon: 'text-purple-500',
    border: 'border-purple-500/20'
  },
  orange: {
    bg: 'from-orange-500/10 to-orange-600/10',
    icon: 'text-orange-500',
    border: 'border-orange-500/20'
  },
  indigo: {
    bg: 'from-indigo-500/10 to-indigo-600/10',
    icon: 'text-indigo-500',
    border: 'border-indigo-500/20'
  },
  yellow: {
    bg: 'from-yellow-500/10 to-yellow-600/10',
    icon: 'text-yellow-500',
    border: 'border-yellow-500/20'
  },
  emerald: {
    bg: 'from-emerald-500/10 to-emerald-600/10',
    icon: 'text-emerald-500',
    border: 'border-emerald-500/20'
  },
  rose: {
    bg: 'from-rose-500/10 to-rose-600/10',
    icon: 'text-rose-500',
    border: 'border-rose-500/20'
  }
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color
}) => {
  const { isDarkMode } = useTheme()
  const colors = colorVariants[color]

  return (
    <motion.div
      className={cn(
        'relative p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300',
        isDarkMode
          ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70'
          : 'bg-white/50 border-gray-200/50 hover:bg-white/80',
        'hover:shadow-lg hover:scale-105'
      )}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Background Gradient */}
      <div className={cn(
        'absolute inset-0 rounded-2xl bg-gradient-to-br opacity-30',
        colors.bg
      )} />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            isDarkMode ? 'bg-slate-700/50' : 'bg-white/50',
            colors.border,
            'border'
          )}>
            <Icon className={cn('w-6 h-6', colors.icon)} />
          </div>
          
          <div className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
            trend === 'up'
              ? isDarkMode 
                ? 'bg-green-900/30 text-green-400'
                : 'bg-green-100 text-green-600'
              : isDarkMode
                ? 'bg-red-900/30 text-red-400'
                : 'bg-red-100 text-red-600'
          )}>
            {trend === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {change}
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className={cn(
            'text-2xl font-bold mb-1',
            isDarkMode ? 'text-white' : 'text-gray-900'
          )}>
            {value}
          </h3>
          <p className={cn(
            'text-sm font-medium',
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          )}>
            {title}
          </p>
        </div>

        {/* Sparkline Effect */}
        <div className="absolute bottom-0 right-0 w-16 h-8 overflow-hidden opacity-20">
          <svg viewBox="0 0 64 32" className="w-full h-full">
            <motion.path
              d="M0,20 Q16,10 32,15 T64,8"
              stroke={colors.icon.replace('text-', '#')}
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}
