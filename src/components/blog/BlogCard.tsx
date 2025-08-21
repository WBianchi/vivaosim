'use client'

import React from 'react'
import { Clock, ArrowRight } from 'lucide-react'
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
    <article className="group">
      <Link href={`/blog/${post.slug}`}>
        <div className={`h-full rounded-lg overflow-hidden ${
          isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-50'
        } border ${
          isDarkMode ? 'border-slate-700' : 'border-gray-200'
        } transition-all duration-300 hover:border-orange-300`}>
          
          {/* Image */}
          <div className="relative h-40 overflow-hidden">
            <div className={`w-full h-full ${
              isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
            } flex items-center justify-center`}>
              <div className="text-4xl opacity-30">📝</div>
            </div>
            
            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                isDarkMode ? 'bg-slate-600 text-slate-200' : 'bg-gray-200 text-gray-700'
              }`}>
                {post.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Title */}
            <h3 className={`text-base font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            } mb-2 line-clamp-2 leading-tight group-hover:text-orange-500 transition-colors duration-200`}>
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            } mb-3 line-clamp-2 leading-relaxed`}>
              {post.excerpt}
            </p>

            {/* Meta Info */}
            <div className={`flex items-center justify-between text-xs ${
              isDarkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{post.readTime}</span>
              </div>
              
              <div className={`flex items-center space-x-1 text-xs font-medium ${
                isDarkMode ? 'text-orange-400' : 'text-orange-500'
              }`}>
                <span>Ler mais</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default BlogCard
