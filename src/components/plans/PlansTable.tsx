'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronUp, 
  ChevronDown,
  Eye,
  Edit3,
  MoreVertical,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Crown,
  Gift,
  Calendar,
  TrendingUp
} from 'lucide-react'

interface PlansTableProps {
  plans: any[]
  onPlanSelect: (plan: any) => void
}

type SortField = 'name' | 'category' | 'price' | 'status' | 'subscribers' | 'period' | 'createdAt'
type SortDirection = 'asc' | 'desc'

export const PlansTable: React.FC<PlansTableProps> = ({
  plans,
  onPlanSelect
}) => {
  const [sortField, setSortField] = useState<SortField>('subscribers')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedPlans = [...plans].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'category':
        aValue = a.category.toLowerCase()
        bValue = b.category.toLowerCase()
        break
      case 'price':
        aValue = a.price
        bValue = b.price
        break
      case 'status':
        aValue = a.status
        bValue = b.status
        break
      case 'subscribers':
        aValue = a.subscribers
        bValue = b.subscribers
        break
      case 'period':
        aValue = a.period
        bValue = b.period
        break
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
        break
      default:
        return 0
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1
    }
    return 0
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuito'
    return `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }

  const formatPeriod = (period: string) => {
    switch (period) {
      case 'monthly': return 'Mensal'
      case 'quarterly': return 'Trimestral'
      case 'semiannual': return 'Semestral'
      case 'annual': return 'Anual'
      default: return period
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          label: 'Ativo',
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100'
        }
      case 'inactive':
        return {
          label: 'Inativo',
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-100'
        }
      case 'draft':
        return {
          label: 'Rascunho',
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100'
        }
      default:
        return {
          label: 'Desconhecido',
          icon: Package,
          color: 'text-gray-600',
          bg: 'bg-gray-100'
        }
    }
  }

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'basic':
        return { label: 'Básico', color: 'text-gray-600' }
      case 'professional':
        return { label: 'Profissional', color: 'text-blue-600' }
      case 'premium':
        return { label: 'Premium', color: 'text-purple-600' }
      case 'enterprise':
        return { label: 'Enterprise', color: 'text-orange-600' }
      case 'custom':
        return { label: 'Personalizado', color: 'text-indigo-600' }
      default:
        return { label: 'Padrão', color: 'text-gray-600' }
    }
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-purple-600 transition-colors"
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? 
          <ChevronUp className="w-4 h-4" /> : 
          <ChevronDown className="w-4 h-4" />
      )}
    </button>
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="name">Plano</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="category">Categoria</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="price">Preço</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="period">Período</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="status">Status</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="subscribers">Assinantes</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                Recursos
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="createdAt">Criado</SortButton>
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {sortedPlans.map((plan, index) => {
              const statusConfig = getStatusConfig(plan.status)
              const categoryConfig = getCategoryConfig(plan.category)
              const hasDiscount = plan.discount > 0
              const isFree = plan.price === 0

              return (
                <motion.tr
                  key={plan.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => onPlanSelect(plan)}
                >
                  {/* Plano */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${statusConfig.bg} rounded-lg flex items-center justify-center relative`}>
                        <Package className={`w-5 h-5 ${statusConfig.color}`} />
                        {plan.isPopular && (
                          <Crown className="absolute -top-1 -right-1 w-3 h-3 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                            {plan.name}
                          </p>
                          {plan.isPopular && (
                            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                              Popular
                            </span>
                          )}
                          {hasDiscount && !isFree && (
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium flex items-center gap-1">
                              <Gift className="w-2 h-2" />
                              -{plan.discount}%
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                          {plan.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Categoria */}
                  <td className="px-6 py-4">
                    <span className={`font-medium ${categoryConfig.color}`}>
                      {categoryConfig.label}
                    </span>
                  </td>

                  {/* Preço */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {formatPrice(plan.price)}
                      </p>
                      {hasDiscount && !isFree && (
                        <p className="text-sm text-gray-500 line-through">
                          {formatPrice(plan.originalPrice)}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Período */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatPeriod(plan.period)}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      <statusConfig.icon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                  </td>

                  {/* Assinantes */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {plan.subscribers.toLocaleString()}
                      </span>
                      {plan.subscribers > 100 && (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      )}
                    </div>
                  </td>

                  {/* Recursos */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {plan.features.length} recursos
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {plan.features.slice(0, 2).map((feature: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs"
                          >
                            {feature.split(' ').slice(0, 2).join(' ')}
                          </span>
                        ))}
                        {plan.features.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{plan.features.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Criado */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDate(plan.createdAt)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Atualizado: {formatDate(plan.updatedAt)}
                      </p>
                    </div>
                  </td>

                  {/* Ações */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onPlanSelect(plan)
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('✏️ Editar plano:', plan.id)
                        }}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Editar plano"
                      >
                        <Edit3 className="w-4 h-4 text-blue-600" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('⚙️ Mais opções:', plan.id)
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        title="Mais opções"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
