'use client'

import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  Target,
  Tag,
  Plus,
  TrendingUp,
  Clock,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Crown,
  Star,
  MoreVertical,
  Users,
  Eye,
  Edit3
} from 'lucide-react'

interface ClientCardProps {
  client: any
  index: number
  onClick: () => void
  onDelete?: () => void
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  index,
  onClick,
  onDelete
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
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
      case 'pending':
        return {
          label: 'Pendente',
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100',
          border: 'border-yellow-200'
        }
      case 'blocked':
        return {
          label: 'Bloqueado',
          icon: AlertTriangle,
          color: 'text-red-600',
          bg: 'bg-red-100',
          border: 'border-red-200'
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

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'individual':
        return { label: 'Pessoa Física', color: 'text-blue-600', bg: 'bg-blue-100', icon: User }
      case 'company':
        return { label: 'Empresa', color: 'text-purple-600', bg: 'bg-purple-100', icon: Building }
      case 'vip':
        return { label: 'Cliente VIP', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Crown }
      case 'prospect':
        return { label: 'Prospect', color: 'text-orange-600', bg: 'bg-orange-100', icon: Star }
      default:
        return { label: 'Outros', color: 'text-gray-600', bg: 'bg-gray-100', icon: User }
    }
  }

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'low':
        return { label: 'Baixa', color: 'bg-gray-500' }
      case 'medium':
        return { label: 'Média', color: 'bg-blue-500' }
      case 'high':
        return { label: 'Alta', color: 'bg-orange-500' }
      case 'urgent':
        return { label: 'Urgente', color: 'bg-red-500' }
      default:
        return { label: 'Normal', color: 'bg-gray-500' }
    }
  }

  const getSubscriptionConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Ativa', color: 'text-green-600', bg: 'bg-green-100' }
      case 'trial':
        return { label: 'Teste', color: 'text-blue-600', bg: 'bg-blue-100' }
      case 'expired':
        return { label: 'Expirada', color: 'text-orange-600', bg: 'bg-orange-100' }
      case 'cancelled':
        return { label: 'Cancelada', color: 'text-red-600', bg: 'bg-red-100' }
      case 'none':
        return { label: 'Sem Assinatura', color: 'text-gray-600', bg: 'bg-gray-100' }
      default:
        return { label: 'Desconhecido', color: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  const statusConfig = getStatusConfig(client.status)
  const typeConfig = getTypeConfig(client.type)
  const priorityConfig = getPriorityConfig(client.priority)
  const subscriptionConfig = getSubscriptionConfig(client.subscription?.status || 'inactive')
  const isVip = client.type === 'vip'
  const hasHighValue = (client.totalValue || 0) > 1000

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group ${
        isVip 
          ? 'border-yellow-200 ring-2 ring-yellow-100 dark:ring-yellow-900/30' 
          : hasHighValue
          ? 'border-green-200 ring-2 ring-green-100 dark:ring-green-900/30'
          : statusConfig.border
      }`}
      onClick={onClick}
    >
      {/* VIP Badge */}
      {isVip && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 rounded-bl-xl text-xs font-medium flex items-center gap-1">
          <Crown className="w-3 h-3" />
          VIP
        </div>
      )}

      {/* High Value Badge */}
      {hasHighValue && !isVip && (
        <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          Alto Valor
        </div>
      )}

      {/* Priority Indicator */}
      <div className={`absolute top-4 right-4 w-3 h-3 ${priorityConfig.color} rounded-full`} title={`Prioridade: ${priorityConfig.label}`} />

      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${statusConfig.bg} flex items-center justify-center shadow-sm`}>
              {client.avatar ? (
                <img 
                  src={client.avatar} 
                  alt={client.name}
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <typeConfig.icon className={`w-6 h-6 ${typeConfig.color}`} />
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                {client.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 ${statusConfig.bg} ${statusConfig.color} rounded-full text-xs font-medium`}>
                  {statusConfig.label}
                </span>
                <span className={`px-2 py-0.5 ${typeConfig.bg} ${typeConfig.color} rounded-full text-xs font-medium`}>
                  {typeConfig.label}
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
                console.log('⚙️ Mais opções:', client.id)
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Empresa */}
        {client.company && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Building className="w-4 h-4" />
              <span className="line-clamp-1">{client.company}</span>
            </div>
          </div>
        )}

        {/* Contato */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4" />
            <span className="line-clamp-1">{client.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Phone className="w-4 h-4" />
            <span>{client.phone}</span>
          </div>
          {client.address && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{client.address.city}, {client.address.state}</span>
            </div>
          )}
        </div>

        {/* Assinatura */}
        {client.subscription?.status && client.subscription.status !== 'none' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {client.subscription.plan || 'Plano'}
                </span>
              </div>
              <span className={`px-2 py-1 ${subscriptionConfig.bg} ${subscriptionConfig.color} rounded-full text-xs font-medium`}>
                {subscriptionConfig.label}
              </span>
            </div>
            {client.subscription.value && client.subscription.value > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                  {formatCurrency(client.subscription.value)}
                </span>
                {client.subscription.endDate && (
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    até {formatDate(client.subscription.endDate)}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Valor Total */}
        {client.totalValue > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl mb-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Valor Total Gerado
              </span>
            </div>
            <span className="text-lg font-bold text-green-700 dark:text-green-300">
              {formatCurrency(client.totalValue)}
            </span>
          </div>
        )}

        {/* Atendente */}
        {client.attendantName && (
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Atendente Responsável
              </span>
            </div>
            <span className="text-sm text-purple-700 dark:text-purple-300">
              {client.attendantName}
            </span>
          </div>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <FileText className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">Contratos</span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {client.contracts?.length || 0}
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MessageSquare className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">Tickets</span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {client.tickets?.length || 0}
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">Reuniões</span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {client.meetings?.length || 0}
            </span>
          </div>
        </div>

        {/* Tags */}
        {client.tags && client.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1 mb-2">
              <Tag className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {client.tags.slice(0, 3).map((tag: string) => (
                <span 
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {client.tags && client.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded text-xs">
                  +{client.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Último Contato */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <Clock className="w-4 h-4" />
          <span>Último contato: {formatDate(client.lastContact)}</span>
        </div>

        {/* Data de Cadastro */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>Cliente desde: {formatDate(client.createdAt)}</span>
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
            className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-3 h-3" />
            Ver Detalhes
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation()
              console.log('✏️ Editar cliente:', client.id)
            }}
            className="px-3 py-2 border border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Edit3 className="w-3 h-3" />
            Editar
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={async (e) => {
              e.stopPropagation()
              if (confirm('Tem certeza que deseja excluir este cliente?')) {
                try {
                  const response = await fetch(`/api/contacts?id=${client.id}`, {
                    method: 'DELETE'
                  })
                  
                  if (response.ok) {
                    onDelete?.()
                  } else {
                    alert('Erro ao excluir cliente')
                  }
                } catch (error) {
                  console.error('Erro ao excluir:', error)
                  alert('Erro ao excluir cliente')
                }
              }
            }}
            className="px-3 py-2 border border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-3 h-3" />
            Excluir
          </motion.button>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  )
}
