'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Headphones, Save, User, Mail, Phone, Clock, Settings, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react'

interface CreateAttendantModalProps {
  onClose: () => void
  onSave: (attendantData: any) => void
  attendant?: any
}

export const CreateAttendantModal: React.FC<CreateAttendantModalProps> = ({
  onClose,
  onSave,
  attendant
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Atendente',
    department: 'eventos',
    status: 'active',
    maxChats: 8,
    workingHours: '08:00 - 18:00',
    avatar: ''
  })

  useEffect(() => {
    setIsVisible(true)
    if (attendant) {
      setFormData({
        name: attendant.name || '',
        email: attendant.email || '',
        phone: attendant.phone || '',
        password: '',
        role: attendant.role || 'Atendente',
        department: attendant.department || 'eventos',
        status: attendant.status || 'active',
        maxChats: attendant.maxChats || 8,
        workingHours: attendant.workingHours || '08:00 - 18:00',
        avatar: attendant.avatar || ''
      })
      if (attendant.avatar) {
        setImagePreview(attendant.avatar)
      }
    }
  }, [attendant])

  // Máscara de telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
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

  // Upload de imagem para Vercel Blob
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo e tamanho
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

      // Preview local
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload via API
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData
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
    
    // Validar senha forte ao criar novo atendente
    if (!attendant && passwordStrength < 3) {
      alert('⚠️ A senha deve ser forte! Use maiúsculas, minúsculas, números e caracteres especiais.')
      return
    }
    
    console.log('📝 handleSubmit chamado no modal')
    console.log('📋 formData:', formData)
    
    const attendantData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      avatar: formData.avatar || null
    }

    console.log('💾 Salvando atendente:', attendantData)
    console.log('🔧 onSave function:', typeof onSave)
    
    onSave(attendantData)
    
    console.log('✅ onSave chamado!')
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
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {attendant ? 'Editar Atendente' : 'Novo Atendente'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {attendant ? 'Atualize as informações' : 'Adicione um novo membro à equipe'}
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
              {/* Informações Pessoais */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações Pessoais
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nome do atendente"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!!attendant}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="email@empresa.com"
                      />
                      {attendant && (
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
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(11) 99999-9999"
                        maxLength={15}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Senha {!attendant && '*'}
                    </label>
                    <input
                      type="password"
                      required={!attendant}
                      value={formData.password}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, password: e.target.value }))
                        checkPasswordStrength(e.target.value)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder={attendant ? "Deixe em branco para manter" : "Mínimo 8 caracteres"}
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
                </div>
              </div>

              {/* Configurações de Trabalho */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configurações de Trabalho
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Departamento *
                    </label>
                    <select
                      required
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="eventos">Eventos Corporativos</option>
                      <option value="festas">Festas e Celebrações</option>
                      <option value="casamentos">Casamentos</option>
                      <option value="formaturas">Formaturas</option>
                      <option value="aniversarios">Aniversários</option>
                      <option value="feiras">Feiras e Exposições</option>
                      <option value="congressos">Congressos e Seminários</option>
                      <option value="shows">Shows e Entretenimento</option>
                      <option value="esportivos">Eventos Esportivos</option>
                      <option value="sociais">Eventos Sociais</option>
                      <option value="vendas">Vendas e Comercial</option>
                      <option value="financeiro">Financeiro</option>
                      <option value="suporte">Suporte Técnico</option>
                      <option value="vip">Atendimento VIP</option>
                      <option value="geral">Atendimento Geral</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                      <option value="training">Em Treinamento</option>
                      <option value="suspended">Suspenso</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Máximo de Chats Simultâneos
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.maxChats}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxChats: parseInt(e.target.value) || 8 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Horário de Trabalho
                    </label>
                    <input
                      type="text"
                      value={formData.workingHours}
                      onChange={(e) => setFormData(prev => ({ ...prev, workingHours: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="08:00 - 18:00"
                    />
                  </div>
                </div>
              </div>

              {/* Avatar */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Foto de Perfil (Opcional)
                </h3>
                <div className="flex items-start gap-4">
                  {/* Preview */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Upload */}
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
                    {formData.avatar && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Imagem carregada com sucesso
                      </p>
                    )}
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
                  {attendant ? 'Atualizar' : 'Criar'} Atendente
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
