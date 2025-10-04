'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Phone, MapPin, Calendar, Shield, Award, TrendingUp,
  DollarSign, Users, Ticket, FileText, BarChart3, Settings, Edit,
  Camera, Save, X, Check, AlertCircle, Crown, Star, Zap, Target,
  Briefcase, Building, CreditCard, Clock, Activity, MessageSquare,
  Bell, Lock, Eye, EyeOff, Upload, Download, Share2, Link as LinkIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserProfileProps {
  user: {
    id: string
    name: string
    email: string
    avatar?: string | null
    phone?: string | null
    role: 'ADMINISTRADOR' | 'ATENDENTE' | 'ASSINANTE' | 'AFILIADO' | 'CLIENTE'
    status: 'ATIVO' | 'INATIVO' | 'PENDENTE' | 'SUSPENSO'
    cpf?: string | null
    cnpj?: string | null
    city?: string | null
    state?: string | null
    address?: string | null
    createdAt: Date
    lastLoginAt?: Date | null
    // Dados específicos por role
    affiliateCode?: string | null
    totalEarnings?: number
    commissionRate?: number
    subscriptionPlan?: string | null
    subscriptionStatus?: string | null
  }
  stats?: {
    totalLeads?: number
    totalClients?: number
    totalRevenue?: number
    totalTickets?: number
    totalContracts?: number
    totalQuotes?: number
    conversionRate?: number
    avgResponseTime?: string
    satisfaction?: number
  }
  onUpdate?: (data: any) => Promise<void>
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, stats, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'settings' | 'security'>('overview')
  const [formData, setFormData] = useState(user)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Configuração por role
  const roleConfig = {
    ADMINISTRADOR: {
      title: 'Administrador',
      icon: Crown,
      color: 'from-purple-500 to-indigo-600',
      badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      description: 'Acesso total ao sistema',
      features: ['Gestão completa', 'Relatórios avançados', 'Configurações', 'Usuários']
    },
    ATENDENTE: {
      title: 'Atendente',
      icon: MessageSquare,
      color: 'from-blue-500 to-cyan-600',
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      description: 'Atendimento e suporte',
      features: ['Chat', 'Tickets', 'Agendamentos', 'Clientes']
    },
    ASSINANTE: {
      title: 'Assinante',
      icon: Star,
      color: 'from-yellow-500 to-orange-600',
      badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      description: 'Plano ativo',
      features: ['Dashboard', 'Eventos', 'Orçamentos', 'Contratos']
    },
    AFILIADO: {
      title: 'Afiliado',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      description: 'Programa de afiliados',
      features: ['Link de indicação', 'Comissões', 'Relatórios', 'Pagamentos']
    },
    CLIENTE: {
      title: 'Cliente',
      icon: User,
      color: 'from-gray-500 to-slate-600',
      badge: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
      description: 'Conta cliente',
      features: ['Meus eventos', 'Orçamentos', 'Contratos', 'Suporte']
    }
  }

  const config = roleConfig[user.role]
  const RoleIcon = config.icon

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onUpdate?.(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: User },
    { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'security', label: 'Segurança', icon: Lock }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header com Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Banner Gradient */}
          <div className={cn(
            'h-48 bg-gradient-to-r',
            config.color,
            'relative overflow-hidden'
          )}>
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
          </div>

          {/* Profile Info */}
          <div className="relative bg-white dark:bg-gray-800 px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-20">
              
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-white dark:bg-gray-700 p-2 shadow-xl">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className={cn(
                      'w-full h-full rounded-xl bg-gradient-to-br flex items-center justify-center',
                      config.color
                    )}>
                      <span className="text-4xl font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Camera className="w-5 h-5" />
                  </motion.button>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {user.name}
                    </h1>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={cn('px-3 py-1 rounded-full text-sm font-medium', config.badge)}>
                        <RoleIcon className="w-4 h-4 inline mr-1" />
                        {config.title}
                      </span>
                      <span className={cn(
                        'px-3 py-1 rounded-full text-sm font-medium',
                        user.status === 'ATIVO' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                        user.status === 'INATIVO' && 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
                        user.status === 'PENDENTE' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                        user.status === 'SUSPENSO' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      )}>
                        {user.status}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {config.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {config.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium shadow-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Editar Perfil
                      </motion.button>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSave}
                          disabled={isLoading}
                          className="px-4 py-2 bg-green-500 text-white rounded-xl font-medium shadow-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                        >
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Salvar
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => {
              const TabIcon = tab.icon
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap',
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-lg'
                      : 'bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800'
                  )}
                >
                  <TabIcon className="w-5 h-5" />
                  {tab.label}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <OverviewTab user={user} isEditing={isEditing} formData={formData} setFormData={setFormData} config={config} />
            )}
            {activeTab === 'stats' && (
              <StatsTab user={user} stats={stats} config={config} />
            )}
            {activeTab === 'settings' && (
              <SettingsTab user={user} />
            )}
            {activeTab === 'security' && (
              <SecurityTab user={user} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// Componente Overview Tab
const OverviewTab: React.FC<any> = ({ user, isEditing, formData, setFormData, config }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Informações Pessoais */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5" />
          Informações Pessoais
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome Completo
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-white font-medium">{user.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                {user.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Telefone
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                {user.phone || 'Não informado'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CPF/CNPJ
            </label>
            <p className="text-gray-900 dark:text-white font-medium">
              {user.cpf || user.cnpj || 'Não informado'}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Endereço
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                {user.address || 'Não informado'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cidade
            </label>
            <p className="text-gray-900 dark:text-white font-medium">
              {user.city || 'Não informado'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <p className="text-gray-900 dark:text-white font-medium">
              {user.state || 'Não informado'}
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar Info */}
      <div className="space-y-6">
        
        {/* Conta */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Conta
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Membro desde</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(user.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
            {user.lastLoginAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Último acesso</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(user.lastLoginAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Afiliado Info */}
        {user.role === 'AFILIADO' && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
            <h3 className="text-lg font-bold text-green-900 dark:text-green-400 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Programa de Afiliados
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-green-700 dark:text-green-400">Código de Afiliado</span>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm font-mono">
                    {user.affiliateCode}
                  </code>
                  <button className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700 dark:text-green-400">Comissão</span>
                <span className="text-lg font-bold text-green-900 dark:text-green-400">
                  {user.commissionRate}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700 dark:text-green-400">Total Ganho</span>
                <span className="text-lg font-bold text-green-900 dark:text-green-400">
                  R$ {user.totalEarnings?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Assinatura Info */}
        {user.role === 'ASSINANTE' && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
            <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-400 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Assinatura
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-700 dark:text-yellow-400">Plano</span>
                <span className="text-lg font-bold text-yellow-900 dark:text-yellow-400">
                  {user.subscriptionPlan || 'Premium'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-700 dark:text-yellow-400">Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">
                  {user.subscriptionStatus || 'Ativo'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente Stats Tab
const StatsTab: React.FC<any> = ({ user, stats, config }) => {
  const statCards = [
    { label: 'Total de Leads', value: stats?.totalLeads || 0, icon: Users, color: 'blue' },
    { label: 'Total de Clientes', value: stats?.totalClients || 0, icon: User, color: 'green' },
    { label: 'Receita Total', value: `R$ ${(stats?.totalRevenue || 0).toLocaleString('pt-BR')}`, icon: DollarSign, color: 'yellow' },
    { label: 'Tickets Abertos', value: stats?.totalTickets || 0, icon: Ticket, color: 'red' },
    { label: 'Contratos', value: stats?.totalContracts || 0, icon: FileText, color: 'purple' },
    { label: 'Orçamentos', value: stats?.totalQuotes || 0, icon: BarChart3, color: 'cyan' },
    { label: 'Taxa de Conversão', value: `${stats?.conversionRate || 0}%`, icon: TrendingUp, color: 'green' },
    { label: 'Tempo Médio de Resposta', value: stats?.avgResponseTime || '0min', icon: Clock, color: 'orange' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, idx) => {
        const StatIcon = stat.icon
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                `bg-${stat.color}-100 dark:bg-${stat.color}-900/30`
              )}>
                <StatIcon className={cn('w-6 h-6', `text-${stat.color}-600 dark:text-${stat.color}-400`)} />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </motion.div>
        )
      })}
    </div>
  )
}

// Componente Settings Tab
const SettingsTab: React.FC<any> = ({ user }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Configurações</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Notificações por Email</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receber atualizações por email</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  )
}

// Componente Security Tab
const SecurityTab: React.FC<any> = ({ user }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Segurança</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Senha Atual
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nova Senha
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirmar Nova Senha
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl font-medium shadow-lg hover:bg-blue-600 transition-colors">
          Alterar Senha
        </button>
      </div>
    </div>
  )
}
