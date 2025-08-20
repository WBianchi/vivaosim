'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeProvider'

interface BlogFiltersProps {
  categories: Array<{
    id: string
    name: string
    count: number
  }>
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

const BlogFilters = ({ categories, activeCategory, onCategoryChange }: BlogFiltersProps) => {
  const { isDarkMode } = useTheme()

  return (
    <section className={`py-8 ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(category.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : isDarkMode 
                    ? 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category.name}
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                activeCategory === category.id
                  ? 'bg-white/20'
                  : isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
              }`}>
                {category.count}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogFilters
