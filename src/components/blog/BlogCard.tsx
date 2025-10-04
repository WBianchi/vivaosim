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
      case 'PUBLISHED': return { label: 'Publicado', color: 'text-green-600', bg: 'bg-green-100' }
      case 'DRAFT': return { label: 'Rascunho', color: 'text-yellow-600', bg: 'bg-yellow-100' }
      case 'ARCHIVED': return { label: 'Arquivado', color: 'text-gray-600', bg: 'bg-gray-100' }
      default: return { label: 'Desconhecido', color: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  const statusConfig = getStatusConfig(post.status)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group"
      onClick={onClick}
    >
      {post.coverImage && (
        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {post.categories && post.categories.length > 0 && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                {post.categories[0].name}
              </span>
            </div>
          )}
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
              <span>{post.viewCount || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{post.likeCount || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{post.commentCount || 0}</span>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
              {post.author?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{post.author?.name || 'Autor'}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-gray-600" />
              <span className="text-xs text-gray-600 dark:text-gray-400">{post.tags.length}</span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  )
}

export default BlogCard
