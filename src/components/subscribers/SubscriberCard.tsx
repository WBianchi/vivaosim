'use client'

import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone,
  Building,
  Package,
  Calendar,
  CreditCard,
  Eye,
  Edit3,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  MapPin
} from 'lucide-react'

interface SubscriberCardProps {
  subscriber: any
  index: number
  onClick: () => void
}

export const SubscriberCard: React.FC<SubscriberCardProps> = ({
  subscriber,
  index,
  onClick
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const formatPrice = (price: number) => {
    return `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
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

  const getSubscriptionStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Ativa', color: 'text-green-600', bg: 'bg-green-100' }
      case 'trial':
        return { label: 'Teste', color: 'text-blue-600', bg: 'bg-blue-100' }
      case 'expired':
        return { label: 'Expirada', color: 'text-red-600', bg: 'bg-red-100' }
      case 'cancelled':
        return { label: 'Cancelada', color: 'text-gray-600', bg: 'bg-gray-100' }
      case 'pending':
        return { label: 'Pendente', color: 'text-yellow-600', bg: 'bg-yellow-100' }
      default:
        return { label: 'Desconhecida', color: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  const getPaymentStatusConfig = (status: string) => {
    switch (status) {
      case 'paid':
        return { label: 'Pago', color: 'text-green-600', bg: 'bg-green-100' }
      case 'pending':
        return { label: 'Pendente', color: 'text-yellow-600', bg: 'bg-yellow-100' }
      case 'failed':
        return { label: 'Falhou', color: 'text-red-600', bg: 'bg-red-100' }
      case 'overdue':
        return { label: 'Atraso', color: 'text-orange-600', bg: 'bg-orange-100' }
      case 'refunded':
        return { label: 'Reembolsado', color: 'text-purple-600', bg: 'bg-purple-100' }
      default:
        return { label: 'Desconhecido', color: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'credit_card': return 'Cartão de Crédito'
      case 'pix': return 'PIX'
      case 'bank_transfer': return 'Transferência'
      case 'boleto': return 'Boleto'
      default: return method
    }
  }

  const statusConfig = getStatusConfig(subscriber.status)
  const subscriptionConfig = getSubscriptionStatusConfig(subscriber.subscription.status)
  const paymentConfig = getPaymentStatusConfig(subscriber.payment.status)

  const isExpiringSoon = () => {
    if (!subscriber.subscription.endDate) return false
    const endDate = new Date(subscriber.subscription.endDate)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  }

  const isExpired = () => {
    if (!subscriber.subscription.endDate) return false
    const endDate = new Date(subscriber.subscription.endDate)
    const now = new Date()
    return endDate < now
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group ${
        isExpired() 
          ? 'border-red-200 ring-2 ring-red-100 dark:ring-red-900/30' 
          : isExpiringSoon()
          ? 'border-yellow-200 ring-2 ring-yellow-100 dark:ring-yellow-900/30'
          : statusConfig.border
      }`}
      onClick={onClick}
    >
      {/* Expired/Expiring Badge */}
      {isExpired() && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-bl-xl text-xs font-medium">
          Expirado
        </div>
      )}
      {isExpiringSoon() && !isExpired() && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 rounded-bl-xl text-xs font-medium">
          Expira em Breve
        </div>
      )}

      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${statusConfig.bg} flex items-center justify-center shadow-sm`}>
              {subscriber.avatar ? (
                <img 
                  src={subscriber.avatar} 
                  alt={subscriber.name}
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <User className={`w-6 h-6 ${statusConfig.color}`} />
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                {subscriber.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 ${statusConfig.bg} ${statusConfig.color} rounded-full text-xs font-medium`}>
                  {statusConfig.label}
                </span>
                <span className={`px-2 py-0.5 ${subscriptionConfig.bg} ${subscriptionConfig.color} rounded-full text-xs font-medium`}>
                  {subscriptionConfig.label}
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
                console.log('⚙️ Mais opções:', subscriber.id)
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Contato */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4" />
            <span className="line-clamp-1">{subscriber.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Phone className="w-4 h-4" />
            <span>{subscriber.phone}</span>
          </div>
          {subscriber.company && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Building className="w-4 h-4" />
              <span className="line-clamp-1">{subscriber.company}</span>
            </div>
          )}
        </div>

        {/* Plano */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {subscriber.plan.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
              {formatPrice(subscriber.plan.price)}
            </span>
            <span className="text-sm text-blue-600 dark:text-blue-400">
              /{subscriber.plan.period === 'monthly' ? 'mês' : 'ano'}
            </span>
          </div>
        </div>

        {/* Pagamento */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Pagamento
              </span>
            </div>
            <span className={`px-2 py-1 ${paymentConfig.bg} ${paymentConfig.color} rounded-full text-xs font-medium`}>
              {paymentConfig.label}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Método:</span>
              <span className="text-gray-900 dark:text-white">
                {getPaymentMethodLabel(subscriber.payment.method)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Pago:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formatPrice(subscriber.payment.totalPaid)}
              </span>
            </div>
          </div>
        </div>

        {/* Assinatura */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Início:</span>
            <span className="text-gray-900 dark:text-white">
              {formatDate(subscriber.subscription.startDate)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Vencimento:</span>
            <span className={`font-medium ${
              isExpired() ? 'text-red-600' : isExpiringSoon() ? 'text-yellow-600' : 'text-gray-900 dark:text-white'
            }`}>
              {formatDate(subscriber.subscription.endDate)}
            </span>
          </div>
          {subscriber.subscription.autoRenewal && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-3 h-3" />
              <span>Renovação automática</span>
            </div>
          )}
        </div>

        {/* Localização */}
        {subscriber.address && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">
              {subscriber.address.city}, {subscriber.address.state}
            </span>
          </div>
        )}

        {/* Último Login */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Último acesso: {formatDate(subscriber.lastLogin)}</span>
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
            className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-3 h-3" />
            Ver Detalhes
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation()
              console.log('✏️ Editar assinante:', subscriber.id)
            }}
            className="px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
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
