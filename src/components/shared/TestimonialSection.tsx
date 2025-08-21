'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'
import { useState } from 'react'

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar?: string
  featured?: boolean
}

interface TestimonialSectionProps {
  title?: string
  subtitle?: string
  description?: string
  testimonials: Testimonial[]
  variant?: 'carousel' | 'grid' | 'featured' | 'cards'
  showRatings?: boolean
  autoplay?: boolean
  columns?: 1 | 2 | 3
}

const TestimonialSection: React.FC<TestimonialSectionProps> = ({
  title,
  subtitle,
  description,
  testimonials,
  variant = 'grid',
  showRatings = true,
  autoplay = false,
  columns = 2
}) => {
  const { isDarkMode } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  React.useEffect(() => {
    if (autoplay && variant === 'carousel') {
      const interval = setInterval(nextTestimonial, 5000)
      return () => clearInterval(interval)
    }
  }, [autoplay, variant])

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? 'text-yellow-400 fill-current'
                : isDarkMode ? 'text-gray-600' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const renderTestimonialCard = (testimonial: Testimonial, index: number) => (
    <motion.div
      key={testimonial.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`relative p-8 rounded-2xl ${
        isDarkMode 
          ? 'bg-slate-800/50 border-slate-700' 
          : 'bg-white border-gray-200'
      } border backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group`}
    >
      {/* Quote Icon */}
      <div className={`absolute -top-4 left-8 w-8 h-8 rounded-full ${
        isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'
      } flex items-center justify-center`}>
        <Quote className={`w-4 h-4 ${
          isDarkMode ? 'text-orange-400' : 'text-orange-500'
        }`} />
      </div>

      {/* Rating */}
      {showRatings && (
        <div className="mb-4">
          {renderStars(testimonial.rating)}
        </div>
      )}

      {/* Content */}
      <blockquote className={`text-lg ${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
      } leading-relaxed mb-6 italic`}>
        "{testimonial.content}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center space-x-4">
        {testimonial.avatar ? (
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className={`w-12 h-12 rounded-full ${
            isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
          } flex items-center justify-center`}>
            <span className={`text-lg font-semibold ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {testimonial.name.charAt(0)}
            </span>
          </div>
        )}
        
        <div>
          <h4 className={`font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {testimonial.name}
          </h4>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {testimonial.role} • {testimonial.company}
          </p>
        </div>
      </div>
    </motion.div>
  )

  const renderFeaturedTestimonial = (testimonial: Testimonial) => (
    <motion.div
      key={testimonial.id}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`relative p-12 rounded-3xl ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700' 
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
      } border backdrop-blur-sm shadow-2xl text-center max-w-4xl mx-auto`}
    >
      {/* Large Quote */}
      <div className={`w-16 h-16 rounded-full ${
        isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'
      } flex items-center justify-center mx-auto mb-8`}>
        <Quote className={`w-8 h-8 ${
          isDarkMode ? 'text-orange-400' : 'text-orange-500'
        }`} />
      </div>

      {/* Rating */}
      {showRatings && (
        <div className="flex justify-center mb-6">
          {renderStars(testimonial.rating)}
        </div>
      )}

      {/* Content */}
      <blockquote className={`text-2xl md:text-3xl ${
        isDarkMode ? 'text-gray-200' : 'text-gray-800'
      } leading-relaxed mb-8 font-light italic max-w-3xl mx-auto`}>
        "{testimonial.content}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center justify-center space-x-4">
        {testimonial.avatar ? (
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className={`w-16 h-16 rounded-full ${
            isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
          } flex items-center justify-center`}>
            <span className={`text-xl font-semibold ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {testimonial.name.charAt(0)}
            </span>
          </div>
        )}
        
        <div>
          <h4 className={`text-xl font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {testimonial.name}
          </h4>
          <p className={`${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {testimonial.role} • {testimonial.company}
          </p>
        </div>
      </div>
    </motion.div>
  )

  const getGridCols = () => {
    const colsMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 lg:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
    return colsMap[columns]
  }

  return (
    <section className={`py-16 ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-6">
        
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className={`text-lg ${
                  isDarkMode ? 'text-orange-400' : 'text-orange-500'
                } font-medium mb-4`}
              >
                {subtitle}
              </motion.p>
            )}
            
            {title && (
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className={`text-3xl md:text-4xl lg:text-5xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                } max-w-4xl mx-auto leading-tight`}
              >
                {title}
              </motion.h2>
            )}
          </div>
        )}

        {/* Testimonials */}
        {variant === 'carousel' ? (
          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                {renderTestimonialCard(testimonials[currentIndex], 0)}
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <button
                onClick={prevTestimonial}
                className={`p-3 rounded-full ${
                  isDarkMode 
                    ? 'bg-slate-800 text-white hover:bg-slate-700' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                } border ${
                  isDarkMode ? 'border-slate-700' : 'border-gray-200'
                } transition-all`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentIndex
                        ? isDarkMode ? 'bg-orange-400' : 'bg-orange-500'
                        : isDarkMode ? 'bg-slate-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className={`p-3 rounded-full ${
                  isDarkMode 
                    ? 'bg-slate-800 text-white hover:bg-slate-700' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                } border ${
                  isDarkMode ? 'border-slate-700' : 'border-gray-200'
                } transition-all`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : variant === 'featured' ? (
          <div>
            {testimonials.find(t => t.featured) && 
              renderFeaturedTestimonial(testimonials.find(t => t.featured)!)
            }
          </div>
        ) : (
          <div className={`grid ${getGridCols()} gap-8`}>
            {testimonials.map((testimonial, index) => 
              renderTestimonialCard(testimonial, index)
            )}
          </div>
        )}

      </div>
    </section>
  )
}

export default TestimonialSection
