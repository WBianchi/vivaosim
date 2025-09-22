'use client'

import { motion } from 'framer-motion'
import { FileText, Eye, Clock, Heart, MessageSquare, Tag, User, Calendar, TrendingUp, Edit3, MoreVertical } from 'lucide-react'

interface BlogCardProps {
  post: any
  index: number
  onClick: () => void
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, index, onClick }) => {
  const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR')

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'published': return { label: 'Publicado', color: 'text-green-600', bg: 'bg-green-100' }
      case 'draft': return { label: 'Rascunho', color: 'text-yellow-600', bg: 'bg-yellow-100' }
      case 'scheduled': return { label: 'Agendado', color: 'text-blue-600', bg: 'bg-blue-100' }
      case 'archived': return { label: 'Arquivado', color: 'text-gray-600', bg: 'bg-gray-100' }
      default: return { label: 'Desconhecido', color: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'technology': return { label: 'Tecnologia', color: 'text-blue-600', bg: 'bg-blue-100' }
      case 'marketing': return { label: 'Marketing', color: 'text-purple-600', bg: 'bg-purple-100' }
      case 'business': return { label: 'Negócios', color: 'text-green-600', bg: 'bg-green-100' }
      case 'tutorial': return { label: 'Tutorial', color: 'text-orange-600', bg: 'bg-orange-100' }
      case 'news': return { label: 'Notícias', color: 'text-red-600', bg: 'bg-red-100' }
      default: return { label: 'Geral', color: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  const statusConfig = getStatusConfig(post.status)
  const categoryConfig = getCategoryConfig(post.category)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group"
      onClick={onClick}
    >
      {post.featuredImage && (
        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryConfig.bg} ${categoryConfig.color}`}>
              {categoryConfig.label}
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {post.excerpt}
            </p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); console.log('⚙️ Mais opções:', post.id) }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {(post.tags || []).slice(0, 3).map((tag: string) => (
            <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{post.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{post.comments}</span>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{post.author}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {post.publishedAt ? formatDate(post.publishedAt) : 'Não publicado'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{post.readTime} min</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  )
}

export default BlogCard
