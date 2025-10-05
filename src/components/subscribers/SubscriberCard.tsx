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
  MapPin,
  Trash2,
  Archive,
  Globe
} from 'lucide-react'

interface SubscriberCardProps {
  subscriber: any
  index: number
  onClick: () => void
  onEdit?: (subscriber: any) => void
  onDelete?: (subscriber: any) => void
  onArchive?: (subscriber: any) => void
}

export const SubscriberCard: React.FC<SubscriberCardProps> = ({
  subscriber,
  index,
  onClick,
  onEdit,
  onDelete,
  onArchive
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

  const statusConfig = getStatusConfig(subscriber.status || 'active')
  const subscriptionConfig = getSubscriptionStatusConfig(subscriber.subscription?.status || 'pending')
  const paymentConfig = getPaymentStatusConfig(subscriber.payment?.status || 'pending')

  const isExpiringSoon = () => {
    if (!subscriber.subscription?.endDate) return false
    const endDate = new Date(subscriber.subscription.endDate)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  }

  const isExpired = () => {
    if (!subscriber.subscription?.endDate) return false
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
      className={`relative bg-white dark:bg-gray-800 rounded-3xl shadow-sm border-2 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group ${
        isExpired() 
          ? 'border-red-200 ring-2 ring-red-100 dark:ring-red-900/30' 
          : isExpiringSoon()
          ? 'border-yellow-200 ring-2 ring-yellow-100 dark:ring-yellow-900/30'
          : statusConfig.border
      }`}
      onClick={onClick}
    >
      {/* Badges */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
        {/* Contador Badge */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2">
          <span className="text-2xl">#{index + 1}</span>
        </div>
        
        {/* Status Badges com contador de dias */}
        {isExpired() && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            <div className="flex flex-col items-start">
              <span>EXPIRADO</span>
              <span className="text-xs opacity-90">Renovar agora!</span>
            </div>
          </div>
        )}
        {!isExpired() && isExpiringSoon() && (() => {
          const endDate = new Date(subscriber.subscription.endDate)
          const now = new Date()
          const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          return (
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg">
              <Clock className="w-4 h-4" />
              <div className="flex flex-col items-start">
                <span>{daysLeft} {daysLeft === 1 ? 'DIA' : 'DIAS'}</span>
                <span className="text-xs opacity-90">para expirar</span>
              </div>
            </div>
          )
        })()}
      </div>

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
            <div className="flex-1 pr-20">
              <h3 className="font-extrabold text-gray-900 dark:text-white text-2xl line-clamp-1 tracking-tight">
                {subscriber.name}
              </h3>
              {subscriber.subdomain && (
                <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold mt-1 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {subscriber.subdomain}.vivaosim.com.br
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 ${statusConfig.bg} ${statusConfig.color} rounded-full text-xs font-medium`}>
                  {statusConfig.label}
                </span>
                <span className={`px-2 py-0.5 ${subscriptionConfig.bg} ${subscriptionConfig.color} rounded-full text-xs font-medium`}>
                  {subscriptionConfig.label}
                </span>
                {subscriber.plan && (
                  <span className={`px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded-full text-xs font-medium`}>
                    {subscriber.plan.name}
                  </span>
                )}
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
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
            <Mail className="w-4 h-4" />
            <span className="line-clamp-1">{subscriber.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
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
        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-900/10 p-4 rounded-xl mb-4 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-5 h-5 text-orange-600" />
            <span className="text-base font-bold text-orange-700 dark:text-orange-300">
              {subscriber.plan?.name || 'Sem plano'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-orange-700 dark:text-orange-300">
              {formatPrice(subscriber.plan?.price || 0)}
            </span>
            <span className="text-sm text-orange-600 dark:text-orange-400 font-semibold">
              /{subscriber.plan?.period === 'monthly' || subscriber.plan?.period === 'MONTHLY' ? 'mês' : 'ano'}
            </span>
          </div>
        </div>

        {/* Pagamento */}
        {subscriber.payment && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pagamento
                </span>
              </div>
              <div>
                <span className={`px-2 py-0.5 ${paymentConfig.bg} ${paymentConfig.color} rounded-full text-xs font-medium`}>
                  {paymentConfig.label}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {subscriber.payment.method ? getPaymentMethodLabel(subscriber.payment.method) : 'N/A'}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Total Pago:</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {formatPrice(subscriber.payment.totalPaid || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Último Pagamento:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {subscriber.payment.lastPayment ? formatDate(subscriber.payment.lastPayment) : subscriber.subscription?.startDate ? formatDate(subscriber.subscription.startDate) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Assinatura */}
        {subscriber.subscription && (
          <div className="space-y-2 mb-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Início:</span>
              <span className="text-gray-900 dark:text-white font-semibold">
                {subscriber.subscription.startDate ? formatDate(subscriber.subscription.startDate) : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Vencimento:</span>
              <span className={`font-bold ${
                isExpired() ? 'text-red-600' : isExpiringSoon() ? 'text-yellow-600' : 'text-gray-900 dark:text-white'
              }`}>
                {subscriber.subscription.endDate ? formatDate(subscriber.subscription.endDate) : 'N/A'}
              </span>
            </div>
            {subscriber.subscription.autoRenewal && (
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <CheckCircle className="w-3 h-3" />
                <span>Renovação automática</span>
              </div>
            )}
          </div>
        )}

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
        <div className="flex gap-2 mb-2">
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
                onEdit(subscriber)
              }
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Edit3 className="w-3 h-3" />
          </motion.button>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation()
              if (onArchive && confirm('Deseja arquivar este assinante?')) {
                onArchive(subscriber)
              }
            }}
            className="flex-1 px-3 py-2 border border-yellow-300 dark:border-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Archive className="w-3 h-3" />
            Arquivar
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation()
              if (onDelete && confirm('⚠️ Tem certeza que deseja EXCLUIR este assinante? Esta ação não pode ser desfeita!')) {
                onDelete(subscriber)
              }
            }}
            className="flex-1 px-3 py-2 border border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-3 h-3" />
            Excluir
          </motion.button>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  )
}
