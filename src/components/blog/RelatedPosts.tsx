'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'
import Link from 'next/link'

interface RelatedPost {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  slug: string
}

interface RelatedPostsProps {
  posts: RelatedPost[]
}

const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  const { isDarkMode } = useTheme()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short'
    })
  }

  if (posts.length === 0) return null

  return (
    <section className={`py-16 ${
      isDarkMode ? 'bg-slate-800' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            } mb-4`}>
              Artigos relacionados
            </h2>
            <p className={`text-lg ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Continue aprendendo com estes conteúdos selecionados
            </p>
          </motion.div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className={`h-full rounded-xl overflow-hidden ${
                    isDarkMode ? 'bg-slate-900' : 'bg-white'
                  } border ${
                    isDarkMode ? 'border-slate-700' : 'border-gray-200'
                  } shadow-sm hover:shadow-lg transition-all duration-300`}>
                    
                    {/* Image Placeholder */}
                    <div className="relative h-40 overflow-hidden">
                      <div className={`w-full h-full bg-gradient-to-br from-orange-100 to-red-100 ${
                        isDarkMode ? 'from-orange-900/20 to-red-900/20' : ''
                      } flex items-center justify-center`}>
                        <div className="text-4xl opacity-20">📖</div>
                      </div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {/* Meta Info */}
                      <div className={`flex items-center space-x-4 text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      } mb-3`}>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(post.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className={`font-bold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      } mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors duration-300`}>
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      } mb-4 line-clamp-2 leading-relaxed`}>
                        {post.excerpt}
                      </p>

                      {/* Read More */}
                      <motion.div
                        whileHover={{ x: 5 }}
                        className={`flex items-center space-x-1 text-sm font-medium ${
                          isDarkMode ? 'text-orange-400' : 'text-orange-500'
                        } group-hover:text-orange-600 transition-colors`}
                      >
                        <span>Ler artigo</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* View All Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/blog">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-600' 
                    : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
                } shadow-lg hover:shadow-xl`}
              >
                Ver todos os artigos
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default RelatedPosts
