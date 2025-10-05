'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Headphones, 
  Edit3,
  User,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  Star,
  Users,
  TrendingUp,
  Calendar,
  CheckCircle,
  BarChart3,
  Copy,
  Settings
} from 'lucide-react'

interface AttendantDetailsModalProps {
  attendant: any
  onClose: () => void
  onEdit?: () => void
}

export const AttendantDetailsModal: React.FC<AttendantDetailsModalProps> = ({
  attendant,
  onClose,
  onEdit
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'clients' | 'activity'>('overview')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-BR')
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes.toFixed(1)}min`
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    return `${hours}h ${mins}min`
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Ativo', color: 'text-green-600', bg: 'bg-green-100' }
      case 'inactive':
        return { label: 'Inativo', color: 'text-gray-600', bg: 'bg-gray-100' }
      case 'suspended':
        return { label: 'Suspenso', color: 'text-yellow-600', bg: 'bg-yellow-100' }
      case 'training':
        return { label: 'Treinamento', color: 'text-blue-600', bg: 'bg-blue-100' }
      default:
        return { label: 'Desconhecido', color: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  const getOnlineStatusConfig = (status: string) => {
    switch (status) {
      case 'online':
        return { label: 'Online', color: 'bg-green-500' }
      case 'offline':
        return { label: 'Offline', color: 'bg-gray-500' }
      case 'away':
        return { label: 'Ausente', color: 'bg-yellow-500' }
      case 'busy':
        return { label: 'Ocupado', color: 'bg-red-500' }
      default:
        return { label: 'Desconhecido', color: 'bg-gray-500' }
    }
  }

  const statusConfig = getStatusConfig(attendant.status || 'active')
  const onlineConfig = getOnlineStatusConfig(attendant.onlineStatus || 'offline')

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center shadow-sm">
                    {attendant.avatar ? (
                      <img 
                        src={attendant.avatar} 
                        alt={attendant.name}
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-orange-600" />
                    )}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${onlineConfig.color} rounded-full border-2 border-white dark:border-gray-900`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {attendant.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {attendant.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onEdit && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onEdit()
                      handleClose()
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    <Edit3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {[
                { id: 'overview', label: 'Visão Geral', icon: User },
                { id: 'performance', label: 'Performance', icon: BarChart3 },
                { id: 'clients', label: 'Clientes Ativos', icon: Users },
                { id: 'activity', label: 'Atividade', icon: Clock }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50 dark:bg-orange-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Métricas Principais */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Avaliação</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                        {(attendant.rating || 0).toFixed(1)}
                      </p>
                      <p className="text-xs text-orange-600 dark:text-orange-400">
                        {attendant.totalRatings || 0} avaliações
                      </p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">Chats Ativos</span>
                      </div>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {attendant.activeChats || 0}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        de {attendant.maxChats || 8} máximo
                      </p>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Tempo Resposta</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                        {formatTime(attendant.responseTime || 0)}
                      </p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Taxa Resolução</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                        {(attendant.ticketsTotal ? ((attendant.ticketsResolved || 0) / attendant.ticketsTotal) * 100 : 0).toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  {/* Informações Pessoais */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Informações Pessoais
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Mail className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</span>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {attendant.email}
                          </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Phone className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</span>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {attendant.phone}
                          </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Horário de Trabalho</span>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {attendant.workingHours || '08:00 - 18:00'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Status e Departamento
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-3 h-3 ${onlineConfig.color} rounded-full`} />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Online</span>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {onlineConfig.label}
                          </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Headphones className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Departamento</span>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white capitalize">
                            {attendant.department || 'Geral'}
                          </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Data de Entrada</span>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatDate(attendant.joinedAt || attendant.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === 'performance' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                      <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Satisfação</h4>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {attendant.performance?.satisfaction || 0}
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                      <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">Primeira Resposta</h4>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {attendant.performance?.firstResponseTime || 0}s
                      </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                      <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">Taxa Resolução</h4>
                      <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                        {attendant.performance?.resolutionRate || 0}%
                      </p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                      <h4 className="font-medium text-orange-700 dark:text-orange-300 mb-2">Escalação</h4>
                      <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                        {attendant.performance?.escalationRate || 0}%
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Gráfico de Performance
                    </h4>
                    <div className="h-64 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        📊 Gráficos de performance seriam implementados aqui
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Clients Tab */}
              {activeTab === 'clients' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-4">
                      Clientes em Atendimento ({(attendant.currentClients || []).length})
                    </h3>
                    {(attendant.currentClients || []).length > 0 ? (
                      <div className="space-y-3">
                        {(attendant.currentClients || []).map((client: any) => (
                          <div key={client.id} className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {client.name}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Chat ID: {client.chatId}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-blue-600">
                                  {Math.floor((new Date().getTime() - new Date(client.startTime).getTime()) / 60000)}min
                                </p>
                                <p className="text-xs text-gray-500">
                                  Iniciado: {formatDateTime(client.startTime)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-blue-700 dark:text-blue-300 text-center py-8">
                        Nenhum cliente em atendimento no momento
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Atividade Recente
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Último Login</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDateTime(attendant.lastActivity)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Tickets Resolvidos Hoje</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {Math.floor(attendant.ticketsResolved * 0.3)} tickets
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigator.clipboard.writeText(attendant.id)
                    console.log('📋 ID copiado:', attendant.id)
                  }}
                  className="px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copiar ID
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (onEdit) {
                      onEdit()
                      handleClose()
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar Atendente
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    console.log('⚙️ Configurações:', attendant.id)
                  }}
                  className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Configurar
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
