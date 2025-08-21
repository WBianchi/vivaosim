'use client'

import React from 'react'
import { motion } from 'framer-motion'
import BlogCard from './BlogCard'
import { useTheme } from '@/contexts/ThemeProvider'

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

interface BlogGridProps {
  posts: BlogPost[]
  loading?: boolean
}

const BlogGrid = ({ posts, loading = false }: BlogGridProps) => {
  const { isDarkMode } = useTheme()

  if (loading) {
    return (
      <section className={`py-16 ${
        isDarkMode ? 'bg-slate-900' : 'bg-white'
      }`}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
              <div
                key={index}
                className={`h-96 rounded-2xl ${
                  isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
                } animate-pulse`}
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (posts.length === 0) {
    return (
      <section className={`py-16 ${
        isDarkMode ? 'bg-slate-900' : 'bg-white'
      }`}>
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📝</div>
            <h3 className={`text-xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            } mb-2`}>
              Nenhum artigo encontrado
            </h3>
            <p className={`${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Tente ajustar os filtros ou buscar por outros termos.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`py-16 ${
      isDarkMode ? 'bg-slate-900' : 'bg-white'
    }`}>
      <div className="container mx-auto px-6">
        
        {/* Results Count */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          } mb-8`}
        >
          {posts.length} {posts.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
        </motion.div>

        {/* Featured Banner */}
        <div className={`mb-12 p-8 rounded-2xl border-2 border-dashed ${
          isDarkMode ? 'border-slate-700 bg-slate-800/30' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="text-center">
            <div className={`text-lg font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Espaço para Banner Principal
            </div>
            <div className={`text-sm ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              728 x 90px ou responsivo
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {posts.map((post, index) => {
            // Adicionar banner lateral após cada 8 posts
            const shouldShowBanner = (index + 1) % 8 === 0 && index < posts.length - 1
            
            return (
              <React.Fragment key={post.id}>
                <BlogCard 
                  post={post} 
                  index={index}
                />
                {shouldShowBanner && (
                  <div className={`col-span-full my-8 p-6 rounded-xl border-2 border-dashed ${
                    isDarkMode ? 'border-slate-700 bg-slate-800/20' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="text-center">
                      <div className={`text-base font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Banner Intermediário
                      </div>
                      <div className={`text-sm ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Banner responsivo ou 320 x 100px
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Sidebar Banner */}
        <div className={`mt-12 p-6 rounded-xl border-2 border-dashed ${
          isDarkMode ? 'border-slate-700 bg-slate-800/20' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="text-center">
            <div className={`text-base font-medium mb-1 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Banner Lateral/Rodapé
            </div>
            <div className={`text-sm ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              300 x 250px ou responsivo
            </div>
          </div>
        </div>

        {/* Load More Button */}
        {posts.length >= 12 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700' 
                  : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
              } shadow-lg hover:shadow-xl`}
            >
              Carregar mais artigos
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default BlogGrid
