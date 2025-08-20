'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'
import Link from 'next/link'

interface NavigationPost {
  title: string
  slug: string
}

interface PostNavigationProps {
  previousPost?: NavigationPost
  nextPost?: NavigationPost
}

const PostNavigation = ({ previousPost, nextPost }: PostNavigationProps) => {
  const { isDarkMode } = useTheme()

  return (
    <section className={`py-12 ${
      isDarkMode ? 'bg-slate-900' : 'bg-white'
    }`}>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Previous Post */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={previousPost ? '' : 'opacity-0 pointer-events-none'}
            >
              {previousPost && (
                <Link href={`/blog/${previousPost.slug}`}>
                  <div className={`p-6 rounded-xl ${
                    isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-50 hover:bg-gray-100'
                  } border ${
                    isDarkMode ? 'border-slate-700' : 'border-gray-200'
                  } transition-all duration-300 group h-full`}>
                    <div className="flex items-center space-x-3 mb-3">
                      <ArrowLeft className={`w-4 h-4 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      } group-hover:text-orange-500 transition-colors`} />
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Artigo anterior
                      </span>
                    </div>
                    <h3 className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    } group-hover:text-orange-500 transition-colors line-clamp-2`}>
                      {previousPost.title}
                    </h3>
                  </div>
                </Link>
              )}
            </motion.div>

            {/* Next Post */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={nextPost ? '' : 'opacity-0 pointer-events-none'}
            >
              {nextPost && (
                <Link href={`/blog/${nextPost.slug}`}>
                  <div className={`p-6 rounded-xl ${
                    isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-50 hover:bg-gray-100'
                  } border ${
                    isDarkMode ? 'border-slate-700' : 'border-gray-200'
                  } transition-all duration-300 group h-full text-right`}>
                    <div className="flex items-center justify-end space-x-3 mb-3">
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Próximo artigo
                      </span>
                      <ArrowRight className={`w-4 h-4 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      } group-hover:text-orange-500 transition-colors`} />
                    </div>
                    <h3 className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    } group-hover:text-orange-500 transition-colors line-clamp-2`}>
                      {nextPost.title}
                    </h3>
                  </div>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PostNavigation
