'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Camera, Save, Lock, Bell, Shield,
  Mail, Phone, MapPin, Calendar, Heart,
  CreditCard, FileText, Settings, LogOut,
  Check, Edit3, AlertTriangle
} from 'lucide-react'

export default function MeuPerfilClientePage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'event' | 'security' | 'notifications'>('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    address: '',
    city: '',
    state: '',
    avatar: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      
      console.log('📊 Dados recebidos:', data)
      
      if (data.success && data.user) {
        setUser(data.user)
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          cpf: data.user.cpf || '',
          address: data.user.address || '',
          city: data.user.city || '',
          state: data.user.state || '',
          avatar: data.user.avatar || ''
        })
        console.log('✅ Dados carregados com sucesso')
      } else {
        console.error('❌ Erro nos dados:', data.error)
      }
    } catch (error) {
      console.error('❌ Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Perfil atualizado com sucesso!')
        setUser(data.user)
        setIsEditing(false)
        fetchUserData()
      } else {
        alert('❌ ' + (data.error || 'Erro ao atualizar perfil'))
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('❌ Erro ao atualizar perfil')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('❌ As senhas não coincidem')
      return
    }

    if (passwordData.newPassword.length < 6) {
      alert('❌ A senha deve ter no mínimo 6 caracteres')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/users/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Senha alterada com sucesso!')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        alert('❌ ' + (data.error || 'Erro ao alterar senha'))
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('❌ Erro ao alterar senha')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  user?.name?.substring(0, 2).toUpperCase() || 'US'
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-orange-500 hover:bg-orange-600 rounded-full cursor-pointer transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input 
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setFormData({ ...formData, avatar: reader.result as string })
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </label>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                  Conta Ativa
                </span>
                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium">
                  {user?.role === 'CLIENTE' ? 'Cliente' : user?.role === 'ASSINANTE' ? 'Assinante' : 'Colaborador'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Salvando...' : 'Salvar'}
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Editar Perfil
              </motion.button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'personal'
                ? 'bg-white dark:bg-gray-600 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Dados Pessoais
          </button>
          <button
            onClick={() => setActiveTab('event')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'event'
                ? 'bg-white dark:bg-gray-600 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Dados do Evento
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'security'
                ? 'bg-white dark:bg-gray-600 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Segurança
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'notifications'
                ? 'bg-white dark:bg-gray-600 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Notificações
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'personal' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Informações Pessoais</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    disabled={true}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-gray-900 dark:text-white cursor-not-allowed opacity-60"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">O e-mail não pode ser alterado</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telefone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CPF
                </label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Endereço
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Informações do Contrato</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Número do Contrato</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{user?.contractNumber || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Plano</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{user?.plan || 'Básico'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                    Ativo
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">Ver Contrato</span>
                  </div>
                  <Check className="w-4 h-4 text-green-500" />
                </button>

                <button className="w-full p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">Pagamentos</span>
                  </div>
                  <span className="text-sm text-gray-500">3/6</span>
                </button>

                <button className="w-full p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">Configurações</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'event' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Informações do Evento</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome do(a) Parceiro(a)
                </label>
                <div className="relative">
                  <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value=""
                    disabled={!isEditing}
                    placeholder="Nome do parceiro(a)"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data do Casamento
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value=""
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Local do Evento
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value=""
                    disabled={!isEditing}
                    placeholder="Local do evento"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Cronograma</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Contrato Assinado</span>
                </div>
                <span className="text-xs text-gray-500">15/01/2024</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Local Reservado</span>
                </div>
                <span className="text-xs text-gray-500">20/01/2024</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Degustação</span>
                </div>
                <span className="text-xs text-gray-500">10/03/2024</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Ensaio</span>
                </div>
                <span className="text-xs text-gray-500">10/06/2024</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Configurações de Segurança</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Alterar Senha</h4>
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Senha atual"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="password"
                  placeholder="Nova senha"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="password"
                  placeholder="Confirmar nova senha"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button 
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50"
                >
                  {saving ? 'Atualizando...' : 'Atualizar Senha'}
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Autenticação de Dois Fatores</h4>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">2FA Desativado</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Adicione uma camada extra de segurança</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">
                  Ativar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Preferências de Notificação</h3>
          
          <div className="space-y-4">
            {[
              { title: 'Atualizações do Evento', description: 'Receba notificações sobre mudanças no seu evento', enabled: true },
              { title: 'Confirmações de Convidados', description: 'Seja notificado quando convidados confirmarem presença', enabled: true },
              { title: 'Lembretes de Pagamento', description: 'Receba lembretes sobre pagamentos pendentes', enabled: false },
              { title: 'Novidades da Plataforma', description: 'Fique por dentro das novidades e atualizações', enabled: false },
              { title: 'Mensagens de Fornecedores', description: 'Receba mensagens dos seus fornecedores', enabled: true },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
