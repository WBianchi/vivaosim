'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Globe, Save, Loader2 } from 'lucide-react'

interface CreateSiteModalProps {
  onClose: () => void
  onSuccess: () => void
}

export const CreateSiteModal: React.FC<CreateSiteModalProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [formData, setFormData] = useState({
    subscriberId: '',
    planId: '',
    subscriptionId: '',
    domain: '',
    customDomain: '',
    configType: 'MANUAL',
    primaryColor: '#FF6B35',
    secondaryColor: '#004E89',
    segment: '',
    serverType: 'VIVAOSIM',
    serverUrl: ''
  })

  useEffect(() => {
    fetchSubscribers()
    fetchPlans()
  }, [])

  useEffect(() => {
    if (formData.subscriberId) {
      fetchSubscriptions(formData.subscriberId)
    }
  }, [formData.subscriberId])

  const fetchSubscribers = async () => {
    try {
      console.log('🔍 Buscando assinantes...')
      const response = await fetch('/api/users?role=ASSINANTE')
      const data = await response.json()
      console.log('📦 Assinantes recebidos:', data)
      if (data.success) {
        setSubscribers(data.data)
        console.log('✅ Total de assinantes:', data.data.length)
      }
    } catch (error) {
      console.error('❌ Erro ao buscar assinantes:', error)
    }
  }

  const fetchPlans = async () => {
    try {
      console.log('🔍 Buscando planos...')
      const response = await fetch('/api/plans')
      const data = await response.json()
      console.log('📦 Planos recebidos:', data)
      if (data.plans) {
        const activePlans = data.plans.filter((p: any) => p.status === 'ACTIVE')
        setPlans(activePlans)
        console.log('✅ Total de planos ativos:', activePlans.length)
      }
    } catch (error) {
      console.error('❌ Erro ao buscar planos:', error)
    }
  }

  const fetchSubscriptions = async (subscriberId: string) => {
    try {
      console.log('🔍 Buscando assinaturas para:', subscriberId)
      const response = await fetch(`/api/subscriptions?userId=${subscriberId}`)
      const data = await response.json()
      console.log('📦 Assinaturas recebidas:', data)
      if (data.success) {
        const activeSubscriptions = data.data.filter((s: any) => s.status === 'active')
        console.log('✅ Assinaturas ativas:', activeSubscriptions)
        setSubscriptions(activeSubscriptions)
      }
    } catch (error) {
      console.error('Erro ao buscar assinaturas:', error)
    }
  }

  const generateDomain = (subscriberName: string) => {
    const slug = subscriberName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '')
      .substring(0, 20)
    return `${slug}.vivaosim.com.br`
  }

  const handleSubscriberChange = (subscriberId: string) => {
    const subscriber = subscribers.find(s => s.id === subscriberId)
    setFormData({
      ...formData,
      subscriberId,
      domain: subscriber ? generateDomain(subscriber.name) : ''
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/sites/assinantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Site criado com sucesso!')
        onSuccess()
        onClose()
      } else {
        alert('❌ Erro: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao criar site:', error)
      alert('❌ Erro ao criar site')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Criar Novo Site</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Configure o site do assinante</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Assinante */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assinante *
            </label>
            <select
              required
              value={formData.subscriberId}
              onChange={(e) => handleSubscriberChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Selecione o assinante</option>
              {subscribers?.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name} - {sub.email}</option>
              ))}
            </select>
          </div>

          {/* Plano */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Plano *
            </label>
            <select
              required
              value={formData.planId}
              onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Selecione o plano</option>
              {plans?.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.name} - R$ {Number(plan.price).toFixed(2)}</option>
              ))}
            </select>
          </div>

          {/* Assinatura */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assinatura * {!formData.subscriberId && <span className="text-xs text-gray-500">(Selecione um assinante primeiro)</span>}
            </label>
            <select
              required
              value={formData.subscriptionId}
              onChange={(e) => setFormData({ ...formData, subscriptionId: e.target.value })}
              disabled={!formData.subscriberId}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            >
              <option value="">
                {(subscriptions?.length === 0 || !subscriptions) && formData.subscriberId 
                  ? 'Nenhuma assinatura ativa encontrada' 
                  : 'Selecione a assinatura'}
              </option>
              {subscriptions?.map(sub => (
                <option key={sub.id} value={sub.id}>
                  {sub.plan?.name} - {sub.status.toUpperCase()} - Expira: {sub.endDate ? new Date(sub.endDate).toLocaleDateString('pt-BR') : 'N/A'}
                </option>
              ))}
            </select>
            {subscriptions && subscriptions.length > 0 && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                ✅ {subscriptions.length} assinatura(s) ativa(s) encontrada(s)
              </p>
            )}
          </div>

          {/* Domínio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Domínio *
            </label>
            <input
              type="text"
              required
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              placeholder="exemplo.vivaosim.com.br"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Domínio Personalizado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Domínio Personalizado (opcional)
            </label>
            <input
              type="text"
              value={formData.customDomain}
              onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
              placeholder="exemplo.com.br"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tipo de Configuração */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Configuração
              </label>
              <select
                value={formData.configType}
                onChange={(e) => setFormData({ ...formData, configType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="MANUAL">Manual</option>
                <option value="AI">IA</option>
              </select>
            </div>

            {/* Segmento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Segmento
              </label>
              <select
                value={formData.segment}
                onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Selecione</option>
                <option value="Casamento">Casamento</option>
                <option value="15 Anos">15 Anos</option>
                <option value="Aniversário">Aniversário</option>
                <option value="Corporativo">Corporativo</option>
                <option value="Formatura">Formatura</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Cor Principal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cor Principal
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Cor Secundária */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cor Secundária
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Tipo de Servidor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Servidor
            </label>
            <select
              value={formData.serverType}
              onChange={(e) => setFormData({ ...formData, serverType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="VIVAOSIM">Viva o Sim</option>
              <option value="PROPRIO">Servidor Próprio</option>
            </select>
          </div>

          {/* URL Servidor Próprio */}
          {formData.serverType === 'PROPRIO' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL do Servidor
              </label>
              <input
                type="url"
                value={formData.serverUrl}
                onChange={(e) => setFormData({ ...formData, serverUrl: e.target.value })}
                placeholder="https://servidor.exemplo.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Criar Site
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
