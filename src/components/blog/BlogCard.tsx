'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight, User } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  authorAvatar: string
  date: string
  readTime: string
  image?: string
  slug: string
}

interface BlogCardProps {
  post: BlogPost
  index?: number
}

const BlogCard = ({ post, index = 0 }: BlogCardProps) => {
  const { isDarkMode } = useTheme()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`}>
        <div className={`h-full rounded-2xl overflow-hidden ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        } border ${
          isDarkMode ? 'border-slate-700' : 'border-gray-200'
        } shadow-sm hover:shadow-xl transition-all duration-500`}>
          
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <div className={`w-full h-full bg-gradient-to-br from-orange-100 to-red-100 ${
              isDarkMode ? 'from-orange-900/20 to-red-900/20' : ''
            } flex items-center justify-center`}>
              <div className="text-6xl opacity-20">📝</div>
            </div>
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white">
                {post.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Meta Info */}
            <div className={`flex items-center justify-between text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            } mb-3`}>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(post.date)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 className={`text-lg font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            } mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors duration-300`}>
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            } mb-4 line-clamp-3 leading-relaxed`}>
              {post.excerpt}
            </p>

            {/* Author & CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200/20">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{post.authorAvatar}</div>
                <div>
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {post.author}
                  </p>
                </div>
              </div>

              <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-center space-x-1 text-sm font-medium ${
                  isDarkMode ? 'text-orange-400' : 'text-orange-500'
                } group-hover:text-orange-600 transition-colors`}
              >
                <span>Ler mais</span>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default BlogCard
