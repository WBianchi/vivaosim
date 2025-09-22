'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronUp, 
  ChevronDown,
  Eye,
  Edit3,
  MoreVertical,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Package,
  CreditCard,
  Calendar,
  Building,
  Mail,
  Phone
} from 'lucide-react'

interface SubscribersTableProps {
  subscribers: any[]
  onSubscriberSelect: (subscriber: any) => void
}

type SortField = 'name' | 'email' | 'plan' | 'status' | 'subscriptionStatus' | 'paymentStatus' | 'createdAt' | 'endDate'
type SortDirection = 'asc' | 'desc'

export const SubscribersTable: React.FC<SubscribersTableProps> = ({
  subscribers,
  onSubscriberSelect
}) => {
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedSubscribers = [...subscribers].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'email':
        aValue = a.email.toLowerCase()
        bValue = b.email.toLowerCase()
        break
      case 'plan':
        aValue = a.plan.name.toLowerCase()
        bValue = b.plan.name.toLowerCase()
        break
      case 'status':
        aValue = a.status
        bValue = b.status
        break
      case 'subscriptionStatus':
        aValue = a.subscription.status
        bValue = b.subscription.status
        break
      case 'paymentStatus':
        aValue = a.payment.status
        bValue = b.payment.status
        break
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
        break
      case 'endDate':
        aValue = new Date(a.subscription.endDate || 0).getTime()
        bValue = new Date(b.subscription.endDate || 0).getTime()
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
    return `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
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
          color: 'text-gray-600',
          bg: 'bg-gray-100'
        }
      case 'suspended':
        return {
          label: 'Suspenso',
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100'
        }
      case 'blocked':
        return {
          label: 'Bloqueado',
          icon: AlertTriangle,
          color: 'text-red-600',
          bg: 'bg-red-100'
        }
      default:
        return {
          label: 'Desconhecido',
          icon: User,
          color: 'text-gray-600',
          bg: 'bg-gray-100'
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

  const isExpiringSoon = (endDate: string) => {
    if (!endDate) return false
    const end = new Date(endDate)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  }

  const isExpired = (endDate: string) => {
    if (!endDate) return false
    const end = new Date(endDate)
    const now = new Date()
    return end < now
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-blue-600 transition-colors"
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
                <SortButton field="name">Assinante</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="plan">Plano</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="status">Status</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="subscriptionStatus">Assinatura</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="paymentStatus">Pagamento</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="endDate">Vencimento</SortButton>
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
            {sortedSubscribers.map((subscriber, index) => {
              const statusConfig = getStatusConfig(subscriber.status)
              const subscriptionConfig = getSubscriptionStatusConfig(subscriber.subscription.status)
              const paymentConfig = getPaymentStatusConfig(subscriber.payment.status)
              const expiringSoon = isExpiringSoon(subscriber.subscription.endDate)
              const expired = isExpired(subscriber.subscription.endDate)

              return (
                <motion.tr
                  key={subscriber.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                    expired ? 'bg-red-50 dark:bg-red-900/10' : expiringSoon ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''
                  }`}
                  onClick={() => onSubscriberSelect(subscriber)}
                >
                  {/* Assinante */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${statusConfig.bg} rounded-lg flex items-center justify-center`}>
                        {subscriber.avatar ? (
                          <img 
                            src={subscriber.avatar} 
                            alt={subscriber.name}
                            className="w-full h-full rounded-lg object-cover"
                          />
                        ) : (
                          <User className={`w-5 h-5 ${statusConfig.color}`} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                          {subscriber.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                            {subscriber.email}
                          </p>
                        </div>
                        {subscriber.company && (
                          <div className="flex items-center gap-2 mt-1">
                            <Building className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-1">
                              {subscriber.company}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Plano */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {subscriber.plan.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatPrice(subscriber.plan.price)}/{subscriber.plan.period === 'monthly' ? 'mês' : 'ano'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      <statusConfig.icon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                  </td>

                  {/* Assinatura */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${subscriptionConfig.bg} ${subscriptionConfig.color}`}>
                      {subscriptionConfig.label}
                    </span>
                    {subscriber.subscription.autoRenewal && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600">Auto renovação</span>
                      </div>
                    )}
                  </td>

                  {/* Pagamento */}
                  <td className="px-6 py-4">
                    <div>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${paymentConfig.bg} ${paymentConfig.color}`}>
                        {paymentConfig.label}
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        <CreditCard className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Total: {formatPrice(subscriber.payment.totalPaid)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Vencimento */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className={`text-sm font-medium ${
                          expired ? 'text-red-600' : expiringSoon ? 'text-yellow-600' : 'text-gray-900 dark:text-white'
                        }`}>
                          {formatDate(subscriber.subscription.endDate)}
                        </p>
                        {expired && (
                          <span className="text-xs text-red-600">Expirado</span>
                        )}
                        {expiringSoon && !expired && (
                          <span className="text-xs text-yellow-600">Expira em breve</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Criado */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDate(subscriber.createdAt)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {subscriber.phone}
                        </span>
                      </div>
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
                          onSubscriberSelect(subscriber)
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
                          console.log('✏️ Editar assinante:', subscriber.id)
                        }}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Editar assinante"
                      >
                        <Edit3 className="w-4 h-4 text-blue-600" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('⚙️ Mais opções:', subscriber.id)
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
