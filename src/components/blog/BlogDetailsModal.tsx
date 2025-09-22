'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Edit3, Eye, Clock, Heart, MessageSquare, Tag, User, Calendar, Link, Search, TrendingUp, Copy } from 'lucide-react'

interface BlogDetailsModalProps {
  post: any
  onClose: () => void
  onEdit?: () => void
}

export const BlogDetailsModal: React.FC<BlogDetailsModalProps> = ({ post, onClose, onEdit }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'analytics'>('content')

  useEffect(() => { setIsVisible(true) }, [])
  const handleClose = () => { setIsVisible(false); setTimeout(onClose, 300) }
  const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR')

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={handleClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{post.title}</h2>
                  <span className="text-sm text-gray-600">{post.slug}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {onEdit && <motion.button whileHover={{ scale: 1.05 }} onClick={() => { onEdit(); handleClose() }} className="p-2 hover:bg-gray-100 rounded-xl"><Edit3 className="w-5 h-5" /></motion.button>}
                <motion.button whileHover={{ scale: 1.05 }} onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></motion.button>
              </div>
            </div>

            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {['content', 'seo', 'analytics'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-3 ${activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}>
                  {tab === 'content' ? 'Conteúdo' : tab === 'seo' ? 'SEO' : 'Analytics'}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'content' && (
                <div className="space-y-6">
                  {post.featuredImage && (
                    <div className="rounded-xl overflow-hidden">
                      <img src={post.featuredImage} alt={post.title} className="w-full h-64 object-cover" />
                    </div>
                  )}
                  
                  <div className="prose max-w-none">
                    <p className="text-gray-600 dark:text-gray-400">{post.excerpt}</p>
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-gray-600" />
                        <span>{post.views} visualizações</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-gray-600" />
                        <span>{post.likes} curtidas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-gray-600" />
                        <span>{post.comments} comentários</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <span>{post.readTime} min de leitura</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                    <h3 className="font-semibold mb-4">Meta Tags SEO</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Título SEO</p>
                        <p className="font-medium">{post.seo.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Meta Descrição</p>
                        <p className="text-gray-700 dark:text-gray-300">{post.seo.description}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Palavras-chave</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {post.seo.keywords.map((keyword: string) => (
                            <span key={keyword} className="px-2 py-1 bg-white dark:bg-gray-800 rounded text-sm">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Open Graph Image</p>
                        <p className="text-sm text-blue-600">{post.seo.ogImage}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <Eye className="w-5 h-5 text-blue-600 mb-2" />
                      <p className="text-2xl font-bold">{post.views}</p>
                      <p className="text-sm text-gray-600">Visualizações</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <TrendingUp className="w-5 h-5 text-green-600 mb-2" />
                      <p className="text-2xl font-bold">{((post.likes / post.views) * 100).toFixed(1)}%</p>
                      <p className="text-sm text-gray-600">Taxa de Engajamento</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <Clock className="w-5 h-5 text-purple-600 mb-2" />
                      <p className="text-2xl font-bold">{post.readTime}min</p>
                      <p className="text-sm text-gray-600">Tempo Médio</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                    <h3 className="font-semibold mb-4">Informações do Post</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Autor:</span>
                        <span className="font-medium">{post.author}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Categoria:</span>
                        <span className="font-medium capitalize">{post.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium capitalize">{post.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Visibilidade:</span>
                        <span className="font-medium capitalize">{post.visibility}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Publicado em:</span>
                        <span className="font-medium">{post.publishedAt ? formatDate(post.publishedAt) : 'Não publicado'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Atualizado em:</span>
                        <span className="font-medium">{formatDate(post.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-8 pt-6 border-t">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug}`)}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copiar Link
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => { if (onEdit) { onEdit(); handleClose() } }}
                  className="flex-1 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar Post
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
