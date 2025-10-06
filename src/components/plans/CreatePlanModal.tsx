'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Package, Save, Plus, Trash2, CheckCircle, Crown, Eye, Sparkles, Loader2 } from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'

interface CreatePlanModalProps {
  onClose: () => void
  onSave: () => void
  plan?: any
}

export const CreatePlanModal: React.FC<CreatePlanModalProps> = ({ onClose, onSave, plan }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'ACTIVE',
    period: 'MONTHLY',
    price: 0,
    isFeatured: false,
    isPopular: false,
    maxUsers: undefined as number | undefined,
    maxProjects: undefined as number | undefined,
    maxStorage: undefined as number | undefined,
    maxApiCalls: undefined as number | undefined,
    features: [] as string[],
    displayOrder: 0
  })
  const [newFeature, setNewFeature] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatingDescription, setGeneratingDescription] = useState(false)
  const [generatingFeatures, setGeneratingFeatures] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    if (plan) {
      setFormData({
        name: plan.name || '',
        description: plan.description || '',
        status: plan.status || 'ACTIVE',
        period: plan.period || 'MONTHLY',
        price: plan.price || 0,
        isFeatured: plan.isFeatured || false,
        isPopular: plan.isPopular || false,
        maxUsers: plan.maxUsers,
        maxProjects: plan.maxProjects,
        maxStorage: plan.maxStorage,
        maxApiCalls: plan.maxApiCalls,
        features: Array.isArray(plan.features) ? plan.features : [],
        displayOrder: plan.displayOrder || 0
      })
    }
  }, [plan])

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
        setError('Token de autenticação não encontrado')
        setLoading(false)
        return
      }

      const method = plan?.id ? 'PATCH' : 'POST'
      const body = plan?.id ? { id: plan.id, ...formData } : formData

      const response = await fetch('/api/plans', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        onSave()
        handleClose()
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao salvar plano')
      }
    } catch (error) {
      setError('Erro ao salvar plano')
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }))
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }))
  }

  const generateDescription = async () => {
    if (!formData.name.trim()) {
      setError('Por favor, preencha o nome do plano primeiro')
      return
    }

    setGeneratingDescription(true)
    setError('')

    try {
      const response = await fetch('/api/ai/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Gere uma descrição profissional e atrativa para um plano de assinatura chamado "${formData.name}" com preço de ${formData.price > 0 ? `R$ ${formData.price}` : 'gratuito'} ${formData.period}. A descrição deve ter no máximo 2 linhas e destacar o valor e benefícios principais do plano.`
        })
      })

      const data = await response.json()

      if (response.ok && data.content) {
        updateFormData('description', data.content)
      } else {
        setError(data.error || 'Erro ao gerar descrição')
      }
    } catch (error) {
      console.error('Erro ao gerar descrição:', error)
      setError('Erro ao gerar descrição com IA')
    } finally {
      setGeneratingDescription(false)
    }
  }

  const generateFeatures = async () => {
    if (!formData.name.trim()) {
      setError('Por favor, preencha o nome do plano primeiro')
      return
    }

    setGeneratingFeatures(true)
    setError('')

    try {
      const response = await fetch('/api/ai/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Liste 8 recursos/funcionalidades específicas e profissionais para um plano de assinatura chamado "${formData.name}" com preço de ${formData.price > 0 ? `R$ ${formData.price}` : 'gratuito'} ${formData.period}. Retorne apenas a lista de recursos, um por linha, sem numeração, sem markdown, sem formatação extra. Cada recurso deve ser objetivo e claro.`
        })
      })

      const data = await response.json()

      if (response.ok && data.content) {
        const features = data.content
          .split('\n')
          .map((f: string) => f.trim().replace(/^[-*•]\s*/, ''))
          .filter((f: string) => f.length > 0 && f.length < 100)
        
        setFormData(prev => ({ ...prev, features: [...features] }))
      } else {
        setError(data.error || 'Erro ao gerar recursos')
      }
    } catch (error) {
      console.error('Erro ao gerar recursos:', error)
      setError('Erro ao gerar recursos com IA')
    } finally {
      setGeneratingFeatures(false)
    }
  }

  const statusOptions = [
    { value: 'ACTIVE', label: 'Ativo' },
    { value: 'INACTIVE', label: 'Inativo' },
    { value: 'ARCHIVED', label: 'Arquivado' }
  ]

  const periodOptions = [
    { value: 'MONTHLY', label: 'Mensal' },
    { value: 'QUARTERLY', label: 'Trimestral' },
    { value: 'SEMIANNUAL', label: 'Semestral' },
    { value: 'ANNUAL', label: 'Anual' },
    { value: 'LIFETIME', label: 'Vitalício' }
  ]

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuito'
    return 'R$ ' + price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white">
                  <Package className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {plan ? 'Editar Plano' : 'Novo Plano'}
                </h2>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Informações do Plano</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Nome *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => updateFormData('name', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                        placeholder="Ex: Plano Profissional"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium">Descrição</label>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={generateDescription}
                          disabled={generatingDescription || !formData.name.trim()}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                        >
                          {generatingDescription ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Gerando...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3 h-3" />
                              Gerar com IA
                            </>
                          )}
                        </motion.button>
                      </div>
                      <textarea
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                        placeholder="Descreva o plano ou use IA para gerar..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Preço (R$) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => updateFormData('price', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Período *</label>
                      <select
                        value={formData.period}
                        onChange={(e) => updateFormData('period', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                      >
                        {periodOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Status *</label>
                      <select
                        value={formData.status}
                        onChange={(e) => updateFormData('status', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                      >
                        {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.isPopular}
                          onChange={(e) => updateFormData('isPopular', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Popular</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={(e) => updateFormData('isFeatured', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Destaque</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Recursos ({formData.features.length})
                    </h3>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={generateFeatures}
                      disabled={generatingFeatures || !formData.name.trim()}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                    >
                      {generatingFeatures ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          Gerar com IA
                        </>
                      )}
                    </motion.button>
                  </div>
                  
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700"
                      placeholder="Adicionar recurso manualmente..."
                    />
                    <button type="button" onClick={addFeature} className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm">{feature}</span>
                        <button type="button" onClick={() => removeFeature(idx)} className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.name && (
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Preview
                    </h3>
                    <div className="bg-white dark:bg-gray-800 border-2 border-purple-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold">{formData.name}</h4>
                        {formData.isPopular && <Crown className="w-4 h-4 text-purple-600" />}
                      </div>
                      <p className="text-3xl font-bold text-purple-600 mb-2">{formatPrice(formData.price)}</p>
                      <p className="text-sm text-gray-600 mb-3">{formData.description}</p>
                      <div className="space-y-1">
                        {formData.features.slice(0, 3).map((feat, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>{feat}</span>
                          </div>
                        ))}
                        {formData.features.length > 3 && (
                          <p className="text-xs text-gray-500">+{formData.features.length - 3} recursos</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border rounded-xl font-medium"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-xl font-medium flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Salvando...' : plan ? 'Atualizar' : 'Criar Plano'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
