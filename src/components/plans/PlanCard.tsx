'use client'

import { motion } from 'framer-motion'
import { 
  Package, 
  Users, 
  Eye,
  Edit3,
  Crown,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Star,
  TrendingUp,
  Gift,
  Zap
} from 'lucide-react'

interface PlanCardProps {
  plan: any
  index: number
  onClick: () => void
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  index,
  onClick
}) => {
  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuito'
    return `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }

  const formatPeriod = (period: string) => {
    switch (period) {
      case 'monthly': return '/mês'
      case 'quarterly': return '/trimestre'
      case 'semiannual': return '/semestre'
      case 'annual': return '/ano'
      default: return ''
    }
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
          color: 'text-red-600',
          bg: 'bg-red-100',
          border: 'border-red-200'
        }
      case 'draft':
        return {
          label: 'Rascunho',
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100',
          border: 'border-yellow-200'
        }
      default:
        return {
          label: 'Desconhecido',
          icon: Package,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          border: 'border-gray-200'
        }
    }
  }

  const statusConfig = getStatusConfig(plan.status)
  const isActive = plan.status === 'ACTIVE'
  const isFree = plan.price === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group ${
        plan.isPopular 
          ? 'border-purple-200 ring-2 ring-purple-100 dark:ring-purple-900/30' 
          : statusConfig.border
      }`}
      onClick={onClick}
    >
      {/* Popular Badge */}
      {plan.isPopular && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-bl-xl text-xs font-medium flex items-center gap-1">
          <Crown className="w-3 h-3" />
          Mais Popular
        </div>
      )}

      {/* Featured Badge */}
      {plan.isFeatured && (
        <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
          Destaque
        </div>
      )}

      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${statusConfig.bg} flex items-center justify-center shadow-sm`}>
              <Package className={`w-6 h-6 ${statusConfig.color}`} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                {plan.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 ${statusConfig.bg} ${statusConfig.color} rounded-full text-xs font-medium`}>
                  {statusConfig.label}
                </span>
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">
                  {formatPeriod(plan.period)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Preço */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatPrice(plan.price)}
            </span>
            {!isFree && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatPeriod(plan.period)}
              </span>
            )}
          </div>
          
        </div>

        {/* Descrição */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {plan.description}
        </p>

        {/* Status Badge */}
        {plan.status === 'INACTIVE' && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg mb-4">
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Plano Inativo
            </span>
          </div>
        )}

        {/* Features Preview */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Principais recursos:
          </h4>
          <div className="space-y-1">
            {plan.features.slice(0, 3).map((feature: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span className="line-clamp-1">{feature}</span>
              </div>
            ))}
            {plan.features.length > 3 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                +{plan.features.length - 3} recursos adicionais
              </p>
            )}
          </div>
        </div>

        {/* Assinantes */}
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Assinantes
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {plan.subscribers}
              </span>
              {plan.subscribers > 100 && (
                <TrendingUp className="w-3 h-3 text-green-500" />
              )}
            </div>
          </div>
        </div>

        {/* Período */}
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Cobrança: {formatPeriod(plan.period).replace('/', '')}
          </span>
        </div>

        {/* Rating simulado */}
        {plan.subscribers > 50 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className="w-3 h-3 text-yellow-400 fill-current" 
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              4.8 ({Math.floor(plan.subscribers * 0.7)} avaliações)
            </span>
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
            className="flex-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-3 h-3" />
            Ver Detalhes
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation()
              console.log('✏️ Editar plano:', plan.id)
            }}
            className="px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Edit3 className="w-3 h-3" />
            Editar
          </motion.button>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  )
}
