'use client'

import React from 'react'
import { Search } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'

interface BlogHeroProps {
  onSearch?: (query: string) => void
  onFilterChange?: (filter: string) => void
}

const BlogHero = ({ onSearch }: BlogHeroProps) => {
  const { isDarkMode } = useTheme()

  return (
    <section className={`pt-32 pb-16 border-b ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
    }`}>
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            
            {/* Content */}
            <div className="lg:w-1/2">
              <h1 className={`text-3xl lg:text-4xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Blog & Insights
              </h1>
              
              <p className={`text-lg leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Estratégias, tendências e dicas práticas para
                transformar seu negócio de eventos.
              </p>
            </div>

            {/* Search */}
            <div className="lg:w-1/2">
              <div className={`relative flex items-center ${
                isDarkMode ? 'bg-slate-800' : 'bg-gray-50'
              } rounded-lg border ${
                isDarkMode ? 'border-slate-700' : 'border-gray-200'
              } overflow-hidden`}>
                <Search className={`w-5 h-5 ml-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Buscar artigos..."
                  onChange={(e) => onSearch?.(e.target.value)}
                  className={`w-full px-4 py-3 bg-transparent ${
                    isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                  } focus:outline-none`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BlogHero
