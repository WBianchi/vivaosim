'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface Benefit {
  title: string
  description: string
}

interface SegmentBenefitsProps {
  title: string
  subtitle?: string
  benefits: Benefit[]
  imageSrc?: string
  imagePosition?: 'left' | 'right'
}

export default function SegmentBenefits({ 
  title, 
  subtitle, 
  benefits, 
  imageSrc = '/placeholder-benefits.jpg',
  imagePosition = 'right'
}: SegmentBenefitsProps) {
  
  const contentOrder = imagePosition === 'left' ? 'order-2' : 'order-1'
  const imageOrder = imagePosition === 'left' ? 'order-1' : 'order-2'

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, x: imagePosition === 'left' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={contentOrder}
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {title}
            </h2>
            
            {subtitle && (
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                {subtitle}
              </p>
            )}

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Check className="w-5 h-5 text-orange-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: imagePosition === 'left' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={imageOrder}
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent" />
              <img 
                src={imageSrc}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
