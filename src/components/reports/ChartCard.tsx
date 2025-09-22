'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeProvider'

interface ChartCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  className
}) => {
  const { isDarkMode } = useTheme()

  return (
    <motion.div
      className={cn(
        'p-6 rounded-2xl border backdrop-blur-sm',
        isDarkMode
          ? 'bg-slate-800/50 border-slate-700/50'
          : 'bg-white/50 border-gray-200/50',
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className={cn(
          'text-lg font-semibold',
          isDarkMode ? 'text-white' : 'text-gray-900'
        )}>
          {title}
        </h3>
        {subtitle && (
          <p className={cn(
            'text-sm mt-1',
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          )}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </motion.div>
  )
}
