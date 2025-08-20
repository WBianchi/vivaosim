'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'
import Link from 'next/link'

interface PostHeroProps {
  title: string
  excerpt: string
  category: string
  author: string
  authorAvatar: string
  date: string
  readTime: string
}

const PostHero = ({ title, excerpt, category, author, authorAvatar, date, readTime }: PostHeroProps) => {
  const { isDarkMode } = useTheme()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <section className={`relative py-16 lg:py-20 ${
      isDarkMode ? 'bg-slate-900' : 'bg-white'
    }`}>
      
      {/* Subtle background */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Cpath d='M20 20.5V18H0v-2h20v2.5zm0 1V22H0v2h20v-2.5zm0 1V26H0v2h20v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link 
              href="/blog"
              className={`inline-flex items-center space-x-2 text-sm ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              } transition-colors duration-300`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao blog</span>
            </Link>
          </motion.div>

          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <span className="px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white">
              {category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-3xl lg:text-5xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            } mb-6 leading-tight`}
          >
            {title}
          </motion.h1>
          
          {/* Excerpt */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`text-xl ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } mb-8 leading-relaxed`}
          >
            {excerpt}
          </motion.p>

          {/* Meta Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center justify-between gap-6"
          >
            <div className="flex items-center space-x-6">
              {/* Author */}
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{authorAvatar}</div>
                <div>
                  <p className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {author}
                  </p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Autor
                  </p>
                </div>
              </div>

              {/* Separator */}
              <div className={`w-px h-12 ${
                isDarkMode ? 'bg-slate-700' : 'bg-gray-300'
              }`} />

              {/* Date & Read Time */}
              <div className="space-y-2">
                <div className={`flex items-center space-x-2 text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(date)}</span>
                </div>
                <div className={`flex items-center space-x-2 text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span>{readTime} de leitura</span>
                </div>
              </div>
            </div>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${
                isDarkMode 
                  ? 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              } transition-all duration-300`}
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Compartilhar</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default PostHero
