'use client'

import { motion } from 'framer-motion'
import { 
  ShoppingCart, 
  User, 
  Mail,
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
  TrendingUp,
  Hash,
  Percent
} from 'lucide-react'

interface SaleCardProps {
  sale: any
  index: number
  onClick: () => void
}

export const SaleCard: React.FC<SaleCardProps> = ({
  sale,
  index,
  onClick
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-BR')
  }

  const formatPrice = (price: number) => {
    return `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Concluída',
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100',
          border: 'border-green-200'
        }
      case 'pending':
        return {
          label: 'Pendente',
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100',
          border: 'border-yellow-200'
        }
      case 'cancelled':
        return {
          label: 'Cancelada',
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-100',
          border: 'border-red-200'
        }
      case 'refunded':
        return {
          label: 'Reembolsada',
          icon: AlertTriangle,
          color: 'text-purple-600',
          bg: 'bg-purple-100',
          border: 'border-purple-200'
        }
      default:
        return {
          label: 'Desconhecido',
          icon: ShoppingCart,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          border: 'border-gray-200'
        }
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
      case 'processing':
        return { label: 'Processando', color: 'text-blue-600', bg: 'bg-blue-100' }
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
      case 'paypal': return 'PayPal'
      default: return method
    }
  }

  const statusConfig = getStatusConfig(sale.status)
  const paymentConfig = getPaymentStatusConfig(sale.paymentStatus)
  const hasDiscount = sale.discount > 0
  const isHighValue = sale.finalAmount > 200

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group ${
        isHighValue 
          ? 'border-green-200 ring-2 ring-green-100 dark:ring-green-900/30' 
          : statusConfig.border
      }`}
      onClick={onClick}
    >
      {/* High Value Badge */}
      {isHighValue && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-bl-xl text-xs font-medium flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Alto Valor
        </div>
      )}

      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
          <Percent className="w-3 h-3" />
          -{sale.discount}%
        </div>
      )}

      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${statusConfig.bg} flex items-center justify-center shadow-sm`}>
              <ShoppingCart className={`w-6 h-6 ${statusConfig.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Hash className="w-3 h-3 text-gray-400" />
                <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                  {sale.saleNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 ${statusConfig.bg} ${statusConfig.color} rounded-full text-xs font-medium`}>
                  {statusConfig.label}
                </span>
                <span className={`px-2 py-0.5 ${paymentConfig.bg} ${paymentConfig.color} rounded-full text-xs font-medium`}>
                  {paymentConfig.label}
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
                console.log('⚙️ Mais opções:', sale.id)
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Cliente */}
        <div className="mb-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1 mb-2">
            {sale.customer.name}
          </h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Mail className="w-4 h-4" />
              <span className="line-clamp-1">{sale.customer.email}</span>
            </div>
            {sale.customer.company && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Building className="w-4 h-4" />
                <span className="line-clamp-1">{sale.customer.company}</span>
              </div>
            )}
          </div>
        </div>

        {/* Plano */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {sale.plan.name}
            </span>
          </div>
          <div className="space-y-1">
            {hasDiscount ? (
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                    {formatPrice(sale.finalAmount)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(sale.amount)}
                  </span>
                </div>
                <span className="text-xs text-green-600 dark:text-green-400">
                  Desconto de {sale.discount}%
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                {formatPrice(sale.finalAmount)}
              </span>
            )}
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
                {getPaymentMethodLabel(sale.paymentMethod)}
              </span>
            </div>
            {sale.commission > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Comissão:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatPrice(sale.commission)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Datas */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Criada:</span>
            <span className="text-gray-900 dark:text-white">
              {formatDate(sale.createdAt)}
            </span>
          </div>
          {sale.paidAt && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Paga:</span>
              <span className="text-green-600 font-medium">
                {formatDate(sale.paidAt)}
              </span>
            </div>
          )}
          {sale.activationDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Ativação:</span>
              <span className="text-blue-600 font-medium">
                {formatDate(sale.activationDate)}
              </span>
            </div>
          )}
        </div>

        {/* Vendedor */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <User className="w-4 h-4" />
          <span>Vendedor: {sale.seller}</span>
        </div>

        {/* Notas */}
        {sale.notes && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-xl mb-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 line-clamp-2">
              📝 {sale.notes}
            </p>
          </div>
        )}
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
              console.log('✏️ Editar venda:', sale.id)
            }}
            className="px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Edit3 className="w-3 h-3" />
            Editar
          </motion.button>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  )
}
