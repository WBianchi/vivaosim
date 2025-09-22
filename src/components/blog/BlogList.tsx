'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BlogCard } from './BlogCard'
import { BlogTable } from './BlogTable'
import { EmptyState } from './EmptyState'

interface BlogListProps {
  filters: any
  searchTerm: string
  viewMode: 'grid' | 'table'
  onPostSelect: (post: any) => void
}

const mockPosts = [
  {
    id: 'post-001',
    title: 'Como Implementar IA no Atendimento ao Cliente',
    slug: 'como-implementar-ia-atendimento-cliente',
    excerpt: 'Descubra as melhores práticas para integrar inteligência artificial no seu sistema de atendimento e melhorar a experiência do cliente.',
    content: 'Conteúdo completo do post aqui...',
    author: 'Admin',
    authorAvatar: null,
    category: 'technology',
    tags: ['IA', 'Atendimento', 'Tecnologia', 'Automação'],
    status: 'published',
    visibility: 'public',
    featuredImage: 'https://via.placeholder.com/800x400',
    views: 1234,
    likes: 89,
    comments: 23,
    readTime: 5,
    publishedAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    seo: {
      title: 'Como Implementar IA no Atendimento ao Cliente | Blog',
      description: 'Guia completo sobre implementação de IA no atendimento',
      keywords: ['IA', 'atendimento', 'cliente', 'automação'],
      ogImage: 'https://via.placeholder.com/1200x630'
    }
  },
  {
    id: 'post-002',
    title: '10 Estratégias de Marketing Digital para 2024',
    slug: '10-estrategias-marketing-digital-2024',
    excerpt: 'As tendências mais importantes do marketing digital que você precisa conhecer para ter sucesso em 2024.',
    content: 'Conteúdo completo do post aqui...',
    author: 'Editor',
    authorAvatar: null,
    category: 'marketing',
    tags: ['Marketing', 'Digital', 'Estratégias', '2024'],
    status: 'published',
    visibility: 'public',
    featuredImage: 'https://via.placeholder.com/800x400',
    views: 2456,
    likes: 156,
    comments: 45,
    readTime: 8,
    publishedAt: '2024-01-18T14:30:00Z',
    updatedAt: '2024-01-19T09:15:00Z',
    seo: {
      title: '10 Estratégias de Marketing Digital para 2024',
      description: 'Descubra as principais tendências de marketing digital',
      keywords: ['marketing', 'digital', 'estratégias', '2024'],
      ogImage: 'https://via.placeholder.com/1200x630'
    }
  },
  {
    id: 'post-003',
    title: 'Guia Completo de SEO para Iniciantes',
    slug: 'guia-completo-seo-iniciantes',
    excerpt: 'Aprenda os fundamentos do SEO e como otimizar seu site para os mecanismos de busca.',
    content: 'Conteúdo completo do post aqui...',
    author: 'Guest',
    authorAvatar: null,
    category: 'tutorial',
    tags: ['SEO', 'Tutorial', 'Iniciantes', 'Google'],
    status: 'draft',
    visibility: 'private',
    featuredImage: 'https://via.placeholder.com/800x400',
    views: 0,
    likes: 0,
    comments: 0,
    readTime: 12,
    publishedAt: null,
    updatedAt: '2024-01-25T16:45:00Z',
    seo: {
      title: 'Guia Completo de SEO para Iniciantes',
      description: 'Tutorial completo sobre SEO para quem está começando',
      keywords: ['SEO', 'tutorial', 'iniciantes', 'otimização'],
      ogImage: 'https://via.placeholder.com/1200x630'
    }
  }
]

export const BlogList: React.FC<BlogListProps> = ({
  filters, searchTerm, viewMode, onPostSelect
}) => {
  const [posts] = useState(mockPosts)
  const [loading] = useState(false)

  const filteredPosts = posts.filter((post) => {
    if (filters.status !== 'all' && post.status !== filters.status) return false
    if (filters.category !== 'all' && post.category !== filters.category) return false
    if (filters.author !== 'all' && post.author.toLowerCase() !== filters.author) return false
    if (filters.visibility !== 'all' && post.visibility !== filters.visibility) return false

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesTitle = post.title.toLowerCase().includes(searchLower)
      const matchesExcerpt = post.excerpt.toLowerCase().includes(searchLower)
      const matchesTags = post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      if (!matchesTitle && !matchesExcerpt && !matchesTags) return false
    }

    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (filteredPosts.length === 0) {
    return <EmptyState filters={filters} searchTerm={searchTerm} />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} encontrado{filteredPosts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPosts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                index={index}
                onClick={() => onPostSelect(post)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <BlogTable
          posts={filteredPosts}
          onPostSelect={onPostSelect}
        />
      )}
    </div>
  )
}
