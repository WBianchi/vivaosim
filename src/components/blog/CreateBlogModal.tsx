'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Save, Sparkles, Tag, Search, Link, Image, Calendar, Eye, Lock, Users, Globe } from 'lucide-react'

interface CreateBlogModalProps {
  onClose: () => void
  onSave: (postData: any) => void
  post?: any
}

export const CreateBlogModal: React.FC<CreateBlogModalProps> = ({ onClose, onSave, post }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content')
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'technology',
    tags: '',
    status: 'draft',
    visibility: 'public',
    featuredImage: '',
    author: 'Admin',
    seo: {
      title: '',
      description: '',
      keywords: '',
      ogImage: ''
    }
  })

  useEffect(() => {
    setIsVisible(true)
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        category: post.category || 'technology',
        tags: post.tags?.join(', ') || '',
        status: post.status || 'draft',
        visibility: post.visibility || 'public',
        featuredImage: post.featuredImage || '',
        author: post.author || 'Admin',
        seo: {
          title: post.seo?.title || '',
          description: post.seo?.description || '',
          keywords: post.seo?.keywords?.join(', ') || '',
          ogImage: post.seo?.ogImage || ''
        }
      })
    }
  }, [post])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const postData = {
      id: post?.id || `post-${Date.now()}`,
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      seo: {
        ...formData.seo,
        keywords: formData.seo.keywords.split(',').map(k => k.trim()).filter(k => k)
      },
      views: post?.views || 0,
      likes: post?.likes || 0,
      comments: post?.comments || 0,
      readTime: Math.ceil(formData.content.split(' ').length / 200),
      publishedAt: formData.status === 'published' ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    }

    onSave(postData)
    handleClose()
  }

  const generateWithAI = (field: string) => {
    console.log(`🤖 Gerando ${field} com IA...`)
    // Aqui você integraria com a API do DeepSeek
  }

  const generateSlug = () => {
    const slug = formData.title.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setFormData(prev => ({ ...prev, slug }))
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={handleClose} />
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {post ? 'Editar Post' : 'Novo Post'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {post ? 'Atualize o conteúdo' : 'Crie conteúdo otimizado com IA'}
                  </p>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>

            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {['content', 'seo', 'settings'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-3 ${activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}>
                  {tab === 'content' ? 'Conteúdo' : tab === 'seo' ? 'SEO' : 'Configurações'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {activeTab === 'content' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        placeholder="Título do post"
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => generateWithAI('title')}
                        className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-lg flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        IA
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slug</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        placeholder="url-do-post"
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        onClick={generateSlug}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg"
                      >
                        Gerar
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resumo *</label>
                    <div className="flex gap-2">
                      <textarea
                        required
                        rows={3}
                        value={formData.excerpt}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        placeholder="Breve descrição do post"
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => generateWithAI('excerpt')}
                        className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-lg flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        IA
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Conteúdo Completo *</label>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-end">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          onClick={() => generateWithAI('content')}
                          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          Gerar Conteúdo com IA
                        </motion.button>
                      </div>
                      <textarea
                        required
                        rows={10}
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        placeholder="Escreva o conteúdo completo do post..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoria</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="technology">Tecnologia</option>
                        <option value="marketing">Marketing</option>
                        <option value="business">Negócios</option>
                        <option value="tutorial">Tutorial</option>
                        <option value="news">Notícias</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.tags}
                          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                          placeholder="tag1, tag2, tag3"
                        />
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          onClick={() => generateWithAI('tags')}
                          className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-lg"
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl mb-6">
                    <h4 className="font-medium text-indigo-800 dark:text-indigo-200 mb-2">💡 Otimização SEO com IA</h4>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                      Use a IA para gerar meta tags otimizadas, palavras-chave relevantes e descrições que melhoram seu ranking.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título SEO</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.seo.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, seo: { ...prev.seo, title: e.target.value } }))}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        placeholder="Título otimizado para SEO"
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => generateWithAI('seo-title')}
                        className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-lg"
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meta Descrição</label>
                    <div className="flex gap-2">
                      <textarea
                        rows={3}
                        value={formData.seo.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, seo: { ...prev.seo, description: e.target.value } }))}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        placeholder="Descrição para mecanismos de busca"
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => generateWithAI('seo-description')}
                        className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-lg"
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Palavras-chave</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.seo.keywords}
                        onChange={(e) => setFormData(prev => ({ ...prev, seo: { ...prev.seo, keywords: e.target.value } }))}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        placeholder="palavra1, palavra2, palavra3"
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => generateWithAI('keywords')}
                        className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-lg"
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Open Graph Image</label>
                    <input
                      type="url"
                      value={formData.seo.ogImage}
                      onChange={(e) => setFormData(prev => ({ ...prev, seo: { ...prev.seo, ogImage: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Imagem Destacada</label>
                    <input
                      type="url"
                      value={formData.featuredImage}
                      onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="draft">Rascunho</option>
                        <option value="published">Publicado</option>
                        <option value="scheduled">Agendado</option>
                        <option value="archived">Arquivado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Visibilidade</label>
                      <select
                        value={formData.visibility}
                        onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="public">Público</option>
                        <option value="private">Privado</option>
                        <option value="members">Membros</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Autor</label>
                    <select
                      value={formData.author}
                      onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Editor">Editor</option>
                      <option value="Guest">Convidado</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancelar
                </motion.button>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {post ? 'Atualizar' : 'Criar'} Post
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
