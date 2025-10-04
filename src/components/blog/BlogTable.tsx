'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, Eye, Edit3, MoreVertical, FileText, Clock, Heart, MessageSquare, User } from 'lucide-react'

interface BlogTableProps {
  posts: any[]
  onPostSelect: (post: any) => void
}

type SortField = 'title' | 'viewCount' | 'likeCount' | 'commentCount' | 'publishedAt'
type SortDirection = 'asc' | 'desc'

export const BlogTable: React.FC<BlogTableProps> = ({ posts, onPostSelect }) => {
  const [sortField, setSortField] = useState<SortField>('publishedAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedPosts = [...posts].sort((a, b) => {
    let aValue: any, bValue: any

    switch (sortField) {
      case 'title':
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      case 'viewCount':
        aValue = a.viewCount || 0
        bValue = b.viewCount || 0
        break
      case 'likeCount':
        aValue = a.likeCount || 0
        bValue = b.likeCount || 0
        break
      case 'commentCount':
        aValue = a.commentCount || 0
        bValue = b.commentCount || 0
        break
      case 'publishedAt':
        aValue = a.publishedAt ? new Date(a.publishedAt).getTime() : new Date(a.createdAt).getTime()
        bValue = b.publishedAt ? new Date(b.publishedAt).getTime() : new Date(b.createdAt).getTime()
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR')

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return { label: 'Publicado', color: 'text-green-600', bg: 'bg-green-100' }
      case 'DRAFT': return { label: 'Rascunho', color: 'text-yellow-600', bg: 'bg-yellow-100' }
      case 'ARCHIVED': return { label: 'Arquivado', color: 'text-gray-600', bg: 'bg-gray-100' }
      default: return { label: 'Desconhecido', color: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      )}
    </button>
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="title">Título</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                Categoria
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="viewCount">Métricas</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                Autor
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="publishedAt">Publicação</SortButton>
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {sortedPosts.map((post, index) => {
              const statusConfig = getStatusConfig(post.status)

              return (
                <motion.tr
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => onPostSelect(post)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{post.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{post.slug}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {post.categories && post.categories.length > 0 ? (
                      <span className="text-sm text-gray-900 dark:text-white">{post.categories[0].name}</span>
                    ) : (
                      <span className="text-sm text-gray-500">Sem categoria</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span>{post.viewCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-gray-400" />
                        <span>{post.likeCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        <span>{post.commentCount || 0}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        {post.author?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">{post.author?.name || 'Autor'}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {post.publishedAt ? 'Publicado' : 'Criado'}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); onPostSelect(post) }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); console.log('✏️ Editar post:', post.id) }}
                        className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                        title="Editar post"
                      >
                        <Edit3 className="w-4 h-4 text-indigo-600" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); console.log('⚙️ Mais opções:', post.id) }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        title="Mais opções"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
