'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, UserPlus, Save, User, Mail, Phone, Package, Upload, Image as ImageIcon, AlertCircle, Globe } from 'lucide-react'

interface CreateSubscriberModalProps {
  onClose: () => void
  onSave: (subscriberData: any) => void
  subscriber?: any
}

export const CreateSubscriberModal: React.FC<CreateSubscriberModalProps> = ({
  onClose,
  onSave,
  subscriber
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [plans, setPlans] = useState<any[]>([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    subdomain: '',
    document: '',
    company: '',
    status: 'active',
    planId: '',
    avatar: ''
  })

  useEffect(() => {
    setIsVisible(true)
    fetchPlans()
    
    if (subscriber) {
      const cpfCnpj = subscriber.cpf || subscriber.cnpj || ''
      setFormData({
        name: subscriber.name || '',
        email: subscriber.email || '',
        phone: subscriber.phone || '',
        password: '',
        subdomain: subscriber.subdomain || '',
        document: cpfCnpj,
        company: subscriber.company || '',
        status: subscriber.status || 'active',
        planId: subscriber.plan?.id || subscriber.subscription?.planId || '',
        avatar: subscriber.avatar || ''
      })
      if (subscriber.avatar) {
        setImagePreview(subscriber.avatar)
      }
      console.log('📝 Carregando assinante para edição:', {
        planId: subscriber.plan?.id,
        subscriptionPlanId: subscriber.subscription?.planId,
        document: cpfCnpj
      })
    }
  }, [subscriber])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans')
      const data = await response.json()
      
      if (data.plans) {
        setPlans(data.plans.filter((p: any) => p.status === 'ACTIVE'))
      }
    } catch (error) {
      console.error('Erro ao buscar planos:', error)
    } finally {
      setLoadingPlans(false)
    }
  }

  // Máscara de telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
  }

  // Máscara de CPF/CNPJ
  const formatDocument = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    
    if (numbers.length <= 11) {
      // CPF: 000.000.000-00
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
    } else {
      // CNPJ: 00.000.000/0000-00
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5')
    }
  }

  // Validação de senha
  const checkPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++
    setPasswordStrength(strength)
    return strength
  }

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return { label: 'Fraca', color: 'text-red-600', bg: 'bg-red-500' }
      case 2:
        return { label: 'Média', color: 'text-yellow-600', bg: 'bg-yellow-500' }
      case 3:
        return { label: 'Boa', color: 'text-blue-600', bg: 'bg-blue-500' }
      case 4:
        return { label: 'Forte', color: 'text-green-600', bg: 'bg-green-500' }
      default:
        return { label: '', color: '', bg: '' }
    }
  }

  // Upload de imagem
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB')
      return
    }

    try {
      setUploading(true)

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formDataUpload
      })

      const data = await response.json()

      if (data.success) {
        setFormData(prev => ({ ...prev, avatar: data.url }))
        console.log('✅ Imagem enviada:', data.url)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('❌ Erro ao enviar imagem:', error)
      alert('Erro ao enviar imagem. Tente novamente.')
      setImagePreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar senha forte
    if (!subscriber && passwordStrength < 3) {
      alert('⚠️ A senha deve ser forte! Use maiúsculas, minúsculas, números e caracteres especiais.')
      return
    }

    // Validar plano
    if (!formData.planId) {
      alert('⚠️ Selecione um plano!')
      return
    }
    
    const subscriberData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      subdomain: formData.subdomain,
      planId: formData.planId,
      avatar: formData.avatar,
      document: formData.document,
      company: formData.company
    }

    console.log('📤 Enviando dados do assinante:', subscriberData)

    onSave(subscriberData)
    handleClose()
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {subscriber ? 'Editar Assinante' : 'Novo Assinante'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {subscriber ? 'Atualize as informações' : 'Adicione um novo assinante'}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!!subscriber}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="email@exemplo.com"
                  />
                  {subscriber && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      O email não pode ser alterado
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value)
                      setFormData(prev => ({ ...prev, phone: formatted }))
                    }}
                    maxLength={15}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CPF/CNPJ *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.document}
                    onChange={(e) => {
                      const formatted = formatDocument(e.target.value)
                      setFormData(prev => ({ ...prev, document: formatted }))
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    maxLength={18}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Empresa (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Nome da empresa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4 text-orange-500" />
                    Plano *
                  </label>
                  <select
                    required
                    value={formData.planId}
                    onChange={(e) => setFormData(prev => ({ ...prev, planId: e.target.value }))}
                    disabled={loadingPlans}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
                  >
                    <option value="">
                      {loadingPlans ? 'Carregando planos...' : 'Selecione um plano'}
                    </option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - R$ {plan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / {
                          plan.period === 'MONTHLY' ? 'mês' :
                          plan.period === 'QUARTERLY' ? 'trimestre' :
                          plan.period === 'SEMIANNUAL' ? 'semestre' :
                          plan.period === 'ANNUAL' ? 'ano' : 'vitalício'
                        }
                      </option>
                    ))}
                  </select>
                  {plans.length === 0 && !loadingPlans && (
                    <p className="text-xs text-red-500 mt-1">
                      ⚠️ Nenhum plano ativo encontrado. Crie planos em /dashboard/planos
                    </p>
                  )}
                </div>

                {/* Senha */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Senha {!subscriber && '*'}
                  </label>
                  <input
                    type="password"
                    required={!subscriber}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, password: e.target.value }))
                      checkPasswordStrength(e.target.value)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder={subscriber ? "Deixe em branco para manter" : "Mínimo 8 caracteres"}
                    minLength={8}
                  />
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${getPasswordStrengthLabel().bg}`}
                            style={{ width: `${(passwordStrength / 4) * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${getPasswordStrengthLabel().color}`}>
                          {getPasswordStrengthLabel().label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Use maiúsculas, minúsculas, números e caracteres especiais
                      </p>
                    </div>
                  )}
                </div>

                {/* Subdomínio */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subdomínio * <span className="text-xs text-gray-500">(será: subdominio.vivaosim.com.br)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-orange-500" />
                    <input
                      type="text"
                      required
                      value={formData.subdomain}
                      onChange={(e) => {
                        const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                        setFormData(prev => ({ ...prev, subdomain: value }))
                      }}
                      disabled={!!subscriber}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="meuevento"
                      pattern="[a-z0-9-]+"
                    />
                    <span className="text-sm text-gray-500">.vivaosim.com.br</span>
                  </div>
                  {subscriber && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      O subdomínio não pode ser alterado
                    </p>
                  )}
                </div>

                {/* Upload Avatar */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Foto de Perfil (Opcional)
                  </label>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-10 h-10 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg transition-colors shadow-lg shadow-orange-500/25"
                      >
                        {uploading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Fazer Upload
                          </>
                        )}
                      </button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        JPG, PNG ou GIF • Máximo 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </motion.button>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
                >
                  <Save className="w-4 h-4" />
                  {subscriber ? 'Atualizar' : 'Criar'} Assinante
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
