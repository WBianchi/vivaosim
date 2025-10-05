'use client'

import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone,
  MessageSquare,
  Clock,
  Star,
  Eye,
  Edit3,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Headphones,
  Users,
  TrendingUp,
  Calendar
} from 'lucide-react'

interface AttendantCardProps {
  attendant: any
  index: number
  onClick: () => void
  onEdit?: (attendant: any) => void
}

export const AttendantCard: React.FC<AttendantCardProps> = ({
  attendant,
  index,
  onClick,
  onEdit
}) => {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes.toFixed(1)}min`
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    return `${hours}h ${mins}min`
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          label: 'Ativo',
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100',
          border: 'border-green-200'
        }
      case 'inactive':
        return {
          label: 'Inativo',
          icon: XCircle,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          border: 'border-gray-200'
        }
      case 'suspended':
        return {
          label: 'Suspenso',
          icon: AlertTriangle,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100',
          border: 'border-yellow-200'
        }
      case 'training':
        return {
          label: 'Treinamento',
          icon: Clock,
          color: 'text-blue-600',
          bg: 'bg-blue-100',
          border: 'border-blue-200'
        }
      default:
        return {
          label: 'Desconhecido',
          icon: User,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          border: 'border-gray-200'
        }
    }
  }

  const getOnlineStatusConfig = (status: string) => {
    switch (status) {
      case 'online':
        return { label: 'Online', color: 'bg-green-500', textColor: 'text-green-600' }
      case 'offline':
        return { label: 'Offline', color: 'bg-gray-500', textColor: 'text-gray-600' }
      case 'away':
        return { label: 'Ausente', color: 'bg-yellow-500', textColor: 'text-yellow-600' }
      case 'busy':
        return { label: 'Ocupado', color: 'bg-red-500', textColor: 'text-red-600' }
      default:
        return { label: 'Desconhecido', color: 'bg-gray-500', textColor: 'text-gray-600' }
    }
  }

  const getDepartmentConfig = (department: string) => {
    switch (department) {
      case 'support':
        return { label: 'Suporte Técnico', color: 'text-blue-600', bg: 'bg-blue-100' }
      case 'sales':
        return { label: 'Vendas', color: 'text-green-600', bg: 'bg-green-100' }
      case 'billing':
        return { label: 'Financeiro', color: 'text-purple-600', bg: 'bg-purple-100' }
      case 'general':
        return { label: 'Geral', color: 'text-gray-600', bg: 'bg-gray-100' }
      case 'vip':
        return { label: 'VIP', color: 'text-orange-600', bg: 'bg-orange-100' }
      default:
        return { label: 'Outros', color: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  const statusConfig = getStatusConfig(attendant.status || 'active')
  const onlineConfig = getOnlineStatusConfig(attendant.onlineStatus || 'offline')
  const departmentConfig = getDepartmentConfig(attendant.department || 'general')
  const isOverloaded = (attendant.activeChats || 0) >= (attendant.maxChats || 8) * 0.8
  const hasHighRating = (attendant.rating || 0) >= 4.5

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative bg-white dark:bg-gray-800 rounded-3xl shadow-sm border-2 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group ${
        hasHighRating 
          ? 'border-yellow-200 ring-2 ring-yellow-100 dark:ring-yellow-900/30' 
          : 'border-gray-200 dark:border-gray-700'
      } ${
        isOverloaded 
          ? 'ring-2 ring-red-100 dark:ring-red-900/30' 
          : ''
      }`}
      onClick={onClick}
    >
      {hasHighRating && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 rounded-bl-xl text-xs font-medium flex items-center gap-1">
          <Star className="w-3 h-3" />
          Top Performer
        </div>
      )}
      {/* Overloaded Badge */}
      {isOverloaded && (
        <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
          Sobrecarregado
        </div>
      )}

      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-12 h-12 rounded-xl ${statusConfig.bg} flex items-center justify-center shadow-sm`}>
                {attendant.avatar ? (
                  <img 
                    src={attendant.avatar} 
                    alt={attendant.name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <User className={`w-6 h-6 ${statusConfig.color}`} />
                )}
              </div>
              {/* Status Online Indicator */}
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${onlineConfig.color} rounded-full border-2 border-white dark:border-gray-800`} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                {attendant.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 ${statusConfig.bg} ${statusConfig.color} rounded-full text-xs font-medium`}>
                  {statusConfig.label}
                </span>
                <span className={`px-2 py-0.5 ${departmentConfig.bg} ${departmentConfig.color} rounded-full text-xs font-medium`}>
                  {departmentConfig.label}
                </span>
              </div>
            </div>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                console.log('⚙️ Mais opções:', attendant.id)
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Cargo e Status Online */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {attendant.role}
          </p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 ${onlineConfig.color} rounded-full`} />
            <span className={`text-sm ${onlineConfig.textColor} font-medium`}>
              {onlineConfig.label}
            </span>
          </div>
        </div>

        {/* Contato */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4" />
            <span className="line-clamp-1">{attendant.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Phone className="w-4 h-4" />
            <span>{attendant.phone}</span>
          </div>
        </div>

        {/* Avaliação */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                Avaliação
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                {(attendant.rating || 0).toFixed(1)}
              </span>
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
            </div>
          </div>
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            {attendant.totalRatings || 0} avaliações
          </p>
        </div>

        {/* Chats Ativos */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Chats Ativos
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                {attendant.activeChats || 0}
              </span>
              <span className="text-sm text-blue-600 dark:text-blue-400">
                /{attendant.maxChats || 8}
              </span>
            </div>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((attendant.activeChats || 0) / (attendant.maxChats || 8)) * 100}%` }}
            />
          </div>
        </div>

        {/* Performance */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Tempo Resposta:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatTime(attendant.responseTime || 0)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Tickets Resolvidos:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {attendant.ticketsResolved || 0}/{attendant.ticketsTotal || 0}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Orçamentos:</span>
            <span className="font-medium text-blue-600">
              {attendant.metrics?.totalQuotes || 0} ({attendant.metrics?.approvedQuotes || 0} aprovados)
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Contratos:</span>
            <span className="font-medium text-green-600">
              {attendant.metrics?.totalContracts || 0} fechados
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Agendamentos:</span>
            <span className="font-medium text-purple-600">
              {attendant.metrics?.totalSchedules || 0} ({attendant.metrics?.completedSchedules || 0} concluídos)
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Taxa de Resolução:</span>
            <span className="font-medium text-orange-600">
              {(attendant.ticketsTotal ? ((attendant.ticketsResolved || 0) / attendant.ticketsTotal) * 100 : 0).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Clientes Atuais */}
        {(attendant.currentClients || []).length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Atendendo Agora ({(attendant.currentClients || []).length})
              </span>
            </div>
            <div className="space-y-2">
              {(attendant.currentClients || []).slice(0, 3).map((client: any) => (
                <div key={client.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300 line-clamp-1">
                    {client.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.floor((new Date().getTime() - new Date(client.startTime).getTime()) / 60000)}min
                  </span>
                </div>
              ))}
              {(attendant.currentClients || []).length > 3 && (
                <p className="text-xs text-gray-500 text-center">
                  +{(attendant.currentClients || []).length - 3} clientes
                </p>
              )}
            </div>
          </div>
        )}

        {/* Horário de Trabalho */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <Clock className="w-4 h-4" />
          <span>Horário: {attendant.workingHours || '08:00 - 18:00'}</span>
        </div>

        {/* Data de Entrada */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>Desde: {formatDate(attendant.joinedAt || attendant.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
          >
            <Eye className="w-4 h-4" />
            Ver Detalhes
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation()
              if (onEdit) {
                onEdit(attendant)
              }
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Edit3 className="w-3 h-3" />
            Editar
          </motion.button>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  )
}
