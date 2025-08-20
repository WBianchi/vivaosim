'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { 
  Calendar,
  Clock,
  User,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Heart,
  Share2,
  Bookmark,
  Eye,
  MessageCircle,
  Tag,
  TrendingUp,
  Star,
  Play
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeProvider'

const PostsCarrousel = () => {
  const { isDarkMode } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [hoveredPost, setHoveredPost] = useState<number | null>(null)

  const categories = [
    { id: 'all', name: 'Todos', count: 24 },
    { id: 'tendencias', name: 'Tendências', count: 8 },
    { id: 'dicas', name: 'Dicas', count: 6 },
    { id: 'casos', name: 'Casos de Sucesso', count: 5 },
    { id: 'tecnologia', name: 'Tecnologia', count: 5 }
  ]

  const posts = [
    {
      id: 1,
      title: '10 Tendências de Casamentos para 2024 que Você Precisa Conhecer',
      excerpt: 'Descubra as principais tendências que estão moldando o mercado de casamentos e como aplicá-las em seus eventos.',
      category: 'tendencias',
      author: 'Marina Santos',
      authorAvatar: '👩‍💼',
      date: '2024-01-15',
      readTime: '5 min',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
      views: 2847,
      likes: 156,
      comments: 23,
      featured: true,
      tags: ['casamentos', 'tendências', '2024'],
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      id: 2,
      title: 'Como Aumentar Sua Receita em 200% com Automação de Vendas',
      excerpt: 'Estratégias comprovadas para automatizar seu funil de vendas e multiplicar seus resultados no mercado de eventos.',
      category: 'dicas',
      author: 'Carlos Mendes',
      authorAvatar: '👨‍💻',
      date: '2024-01-12',
      readTime: '8 min',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
      views: 4521,
      likes: 298,
      comments: 45,
      featured: false,
      tags: ['vendas', 'automação', 'receita'],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      title: 'Case: Como a Elegance Eventos Cresceu 300% em 6 Meses',
      excerpt: 'Conheça a história completa de transformação digital que levou uma empresa familiar ao topo do mercado.',
      category: 'casos',
      author: 'Ana Paula Costa',
      authorAvatar: '👩‍🎨',
      date: '2024-01-10',
      readTime: '12 min',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop',
      views: 3892,
      likes: 234,
      comments: 67,
      featured: true,
      tags: ['case', 'crescimento', 'sucesso'],
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 4,
      title: 'IA no Mercado de Eventos: O Futuro Chegou',
      excerpt: 'Como a inteligência artificial está revolucionando a gestão de eventos e criando novas oportunidades.',
      category: 'tecnologia',
      author: 'Roberto Silva',
      authorAvatar: '👨‍🔬',
      date: '2024-01-08',
      readTime: '6 min',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
      views: 1967,
      likes: 189,
      comments: 34,
      featured: false,
      tags: ['IA', 'tecnologia', 'futuro'],
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      id: 5,
      title: 'WhatsApp Business: Guia Completo para Eventos',
      excerpt: 'Maximize seu atendimento e vendas usando todas as funcionalidades do WhatsApp Business de forma estratégica.',
      category: 'dicas',
      author: 'Juliana Oliveira',
      authorAvatar: '👩‍💼',
      date: '2024-01-05',
      readTime: '10 min',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
      views: 5234,
      likes: 412,
      comments: 89,
      featured: true,
      tags: ['whatsapp', 'atendimento', 'vendas'],
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 6,
      title: 'Precificação Inteligente: Como Definir Preços que Vendem',
      excerpt: 'Metodologia completa para precificar seus serviços de forma competitiva e lucrativa no mercado atual.',
      category: 'dicas',
      author: 'Fernando Costa',
      authorAvatar: '👨‍💼',
      date: '2024-01-03',
      readTime: '7 min',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop',
      views: 2156,
      likes: 167,
      comments: 28,
      featured: false,
      tags: ['precificação', 'estratégia', 'lucro'],
      gradient: 'from-yellow-500 to-orange-500'
    }
  ]

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory)

  const visiblePosts = 3
  const maxIndex = Math.max(0, filteredPosts.length - visiblePosts)

  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [maxIndex, isAutoPlaying])

  const nextSlide = () => {
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1)
  }

  const prevSlide = () => {
    setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <section className={`relative py-20 lg:py-32 overflow-hidden ${
      isDarkMode ? 'bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800' : 'bg-gradient-to-b from-gray-50 via-white to-gray-50'
    }`}>
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 40, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
        />
        
        {/* Blog pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Crect x='10' y='10' width='30' height='20' rx='2'/%3E%3Crect x='10' y='35' width='80' height='2'/%3E%3Crect x='10' y='40' width='60' height='2'/%3E%3Crect x='10' y='45' width='70' height='2'/%3E%3Crect x='60' y='10' width='30' height='20' rx='2'/%3E%3Crect x='10' y='65' width='80' height='2'/%3E%3Crect x='10' y='70' width='50' height='2'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }} />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 backdrop-blur-sm mb-6"
          >
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>
              Blog & Insights
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className={`text-4xl lg:text-5xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            } mb-6`}
          >
            Conteúdo que{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              transforma
            </span>{' '}
            negócios
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className={`text-xl ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } max-w-3xl mx-auto leading-relaxed`}
          >
            Dicas, estratégias e insights exclusivos para você dominar 
            o mercado de eventos e multiplicar seus resultados.
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedCategory(category.id)
                setCurrentIndex(0)
              }}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : isDarkMode 
                    ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
              } border ${
                isDarkMode ? 'border-slate-700' : 'border-gray-200'
              }`}
            >
              {category.name}
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                selectedCategory === category.id
                  ? 'bg-white/20'
                  : isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
              }`}>
                {category.count}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Posts Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-6 z-20">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevSlide}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              className={`p-3 rounded-full ${
                isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-50'
              } border ${
                isDarkMode ? 'border-slate-700' : 'border-gray-200'
              } shadow-lg transition-all backdrop-blur-sm`}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 -right-6 z-20">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextSlide}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              className={`p-3 rounded-full ${
                isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-50'
              } border ${
                isDarkMode ? 'border-slate-700' : 'border-gray-200'
              } shadow-lg transition-all backdrop-blur-sm`}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Posts Grid */}
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: -currentIndex * (100 / visiblePosts) + '%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex"
              style={{ width: `${(filteredPosts.length / visiblePosts) * 100}%` }}
            >
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  onMouseEnter={() => {
                    setHoveredPost(post.id)
                    setIsAutoPlaying(false)
                  }}
                  onMouseLeave={() => {
                    setHoveredPost(null)
                    setIsAutoPlaying(true)
                  }}
                  className={`flex-shrink-0 px-4 ${
                    visiblePosts === 3 ? 'w-1/3' : 'w-1/2'
                  }`}
                >
                  <div className={`group relative h-full rounded-3xl overflow-hidden ${
                    isDarkMode ? 'bg-slate-800' : 'bg-white'
                  } border ${
                    isDarkMode ? 'border-slate-700' : 'border-gray-200'
                  } shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-xl`}>
                    
                    {/* Featured Badge */}
                    {post.featured && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-4 left-4 z-10 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg"
                      >
                        <Star className="w-3 h-3 inline mr-1" />
                        Destaque
                      </motion.div>
                    )}

                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center"
                      >
                        <div className={`w-full h-full bg-gradient-to-br ${post.gradient} opacity-80 flex items-center justify-center`}>
                          <Play className="w-12 h-12 text-white/80" />
                        </div>
                      </motion.div>
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Quick Actions */}
                      <AnimatePresence>
                        {hoveredPost === post.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-4 right-4 flex space-x-2"
                          >
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                            >
                              <Heart className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                            >
                              <Bookmark className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                            >
                              <Share2 className="w-4 h-4" />
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Category & Date */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${post.gradient} text-white`}>
                          {categories.find(cat => cat.id === post.category)?.name}
                        </span>
                        <div className={`flex items-center space-x-2 text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(post.date)}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className={`text-lg font-bold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      } mb-3 line-clamp-2 group-hover:text-blue-500 transition-colors`}>
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      } mb-4 line-clamp-3 leading-relaxed`}>
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className={`px-2 py-1 text-xs rounded-md ${
                              isDarkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Author & Stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200/20">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{post.authorAvatar}</div>
                          <div>
                            <p className={`text-sm font-semibold ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {post.author}
                            </p>
                            <div className={`flex items-center space-x-2 text-xs ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              <Clock className="w-3 h-3" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                        </div>

                        <div className={`flex items-center space-x-4 text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{post.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                      </div>

                      {/* Read More Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full mt-4 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300 ${
                          post.featured
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl'
                            : isDarkMode 
                              ? 'bg-slate-700 text-white hover:bg-slate-600' 
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        <span>Ler artigo</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 scale-125'
                    : isDarkMode ? 'bg-slate-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold flex items-center space-x-2 shadow-lg mx-auto"
          >
            <span>Ver todos os artigos</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
          
          <p className={`text-sm mt-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            📚 +200 artigos • 🎯 Conteúdo exclusivo • 🚀 Atualizações semanais
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default PostsCarrousel
