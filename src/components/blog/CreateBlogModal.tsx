'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Save, Sparkles, Tag, Search, Link, Image, Calendar, Eye, Lock, Users, Globe } from 'lucide-react'
import { getAuthToken, getAuthHeaders } from '@/lib/auth-token'

interface CreateBlogModalProps {
  onClose: () => void
  onSave: () => void
  post?: any
}

export const CreateBlogModal: React.FC<CreateBlogModalProps> = ({ onClose, onSave, post }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content')
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    status: 'DRAFT',
    visibility: 'PUBLIC',
    coverImage: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setIsVisible(true)
    if (post) {
      setFormData({
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        status: post.status || 'DRAFT',
        visibility: post.visibility || 'PUBLIC',
        coverImage: post.coverImage || '',
        metaTitle: post.metaTitle || '',
        metaDescription: post.metaDescription || '',
        metaKeywords: post.metaKeywords || ''
      })
    }
  }, [post])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const token = getAuthToken()
      
      if (!token) {
        setError('Token de autenticação não encontrado. Faça login novamente.')
        setLoading(false)
        return
      }

      const method = post?.id ? 'PATCH' : 'POST'
      const body = post?.id 
        ? { id: post.id, ...formData }
        : formData

      const response = await fetch('/api/blog', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        onSave()
        handleClose()
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao salvar post')
      }
    } catch (error) {
      console.error('Erro ao salvar post:', error)
      setError('Erro ao salvar post')
    } finally {
      setLoading(false)
    }
  }

  const generateWithAI = (field: string) => {
    console.log(`🤖 Gerando ${field} com IA...`)
    // Aqui você integraria com a API do DeepSeek
  }

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))
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
                        value={formData.metaTitle}
                        onChange={(e) => updateFormData('metaTitle', e.target.value)}
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
                        value={formData.metaDescription}
                        onChange={(e) => updateFormData('metaDescription', e.target.value)}
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
                        value={formData.metaKeywords}
                        onChange={(e) => updateFormData('metaKeywords', e.target.value)}
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

                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Imagem de Capa</label>
                    <input
                      type="url"
                      value={formData.coverImage}
                      onChange={(e) => updateFormData('coverImage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => updateFormData('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="DRAFT">Rascunho</option>
                        <option value="PUBLISHED">Publicado</option>
                        <option value="ARCHIVED">Arquivado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Visibilidade</label>
                      <select
                        value={formData.visibility}
                        onChange={(e) => updateFormData('visibility', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="PUBLIC">Público</option>
                        <option value="PRIVATE">Privado</option>
                        <option value="UNLISTED">Não Listado</option>
                      </select>
                    </div>
                  </div>

                </div>
              )}

              {/* Mensagem de Erro */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
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
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {post ? 'Atualizar' : 'Criar'} Post
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
