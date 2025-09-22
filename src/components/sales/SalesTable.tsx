'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronUp, 
  ChevronDown,
  Eye,
  Edit3,
  MoreVertical,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Package,
  CreditCard,
  User,
  Hash,
  DollarSign,
  Calendar,
  TrendingUp,
  Percent
} from 'lucide-react'

interface SalesTableProps {
  sales: any[]
  onSaleSelect: (sale: any) => void
}

type SortField = 'saleNumber' | 'customer' | 'plan' | 'amount' | 'status' | 'paymentStatus' | 'createdAt' | 'paidAt'
type SortDirection = 'asc' | 'desc'

export const SalesTable: React.FC<SalesTableProps> = ({
  sales,
  onSaleSelect
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

  const sortedSales = [...sales].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortField) {
      case 'saleNumber':
        aValue = a.saleNumber.toLowerCase()
        bValue = b.saleNumber.toLowerCase()
        break
      case 'customer':
        aValue = a.customer.name.toLowerCase()
        bValue = b.customer.name.toLowerCase()
        break
      case 'plan':
        aValue = a.plan.name.toLowerCase()
        bValue = b.plan.name.toLowerCase()
        break
      case 'amount':
        aValue = a.finalAmount
        bValue = b.finalAmount
        break
      case 'status':
        aValue = a.status
        bValue = b.status
        break
      case 'paymentStatus':
        aValue = a.paymentStatus
        bValue = b.paymentStatus
        break
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
        break
      case 'paidAt':
        aValue = a.paidAt ? new Date(a.paidAt).getTime() : 0
        bValue = b.paidAt ? new Date(b.paidAt).getTime() : 0
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
      case 'completed':
        return {
          label: 'Concluída',
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100'
        }
      case 'pending':
        return {
          label: 'Pendente',
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100'
        }
      case 'cancelled':
        return {
          label: 'Cancelada',
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-100'
        }
      case 'refunded':
        return {
          label: 'Reembolsada',
          icon: AlertTriangle,
          color: 'text-purple-600',
          bg: 'bg-purple-100'
        }
      default:
        return {
          label: 'Desconhecido',
          icon: ShoppingCart,
          color: 'text-gray-600',
          bg: 'bg-gray-100'
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
      case 'credit_card': return 'Cartão'
      case 'pix': return 'PIX'
      case 'bank_transfer': return 'Transferência'
      case 'boleto': return 'Boleto'
      case 'paypal': return 'PayPal'
      default: return method
    }
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-green-600 transition-colors"
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
                <SortButton field="saleNumber">Venda</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="customer">Cliente</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="plan">Plano</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="amount">Valor</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="status">Status</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="paymentStatus">Pagamento</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="createdAt">Data</SortButton>
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {sortedSales.map((sale, index) => {
              const statusConfig = getStatusConfig(sale.status)
              const paymentConfig = getPaymentStatusConfig(sale.paymentStatus)
              const hasDiscount = sale.discount > 0
              const isHighValue = sale.finalAmount > 200

              return (
                <motion.tr
                  key={sale.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                    isHighValue ? 'bg-green-50 dark:bg-green-900/10' : ''
                  }`}
                  onClick={() => onSaleSelect(sale)}
                >
                  {/* Venda */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${statusConfig.bg} rounded-lg flex items-center justify-center relative`}>
                        <ShoppingCart className={`w-5 h-5 ${statusConfig.color}`} />
                        {isHighValue && (
                          <TrendingUp className="absolute -top-1 -right-1 w-3 h-3 text-green-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Hash className="w-3 h-3 text-gray-400" />
                          <p className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                            {sale.saleNumber}
                          </p>
                          {hasDiscount && (
                            <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium flex items-center gap-1">
                              <Percent className="w-2 h-2" />
                              -{sale.discount}%
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Vendedor: {sale.seller}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Cliente */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                        {sale.customer.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                        {sale.customer.email}
                      </p>
                      {sale.customer.company && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-1">
                          {sale.customer.company}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Plano */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {sale.plan.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {sale.plan.period === 'monthly' ? 'Mensal' : 'Anual'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Valor */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {formatPrice(sale.finalAmount)}
                      </p>
                      {hasDiscount && (
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-500 line-through">
                            {formatPrice(sale.amount)}
                          </p>
                          <span className="text-xs text-green-600">
                            -{sale.discount}%
                          </span>
                        </div>
                      )}
                      {sale.commission > 0 && (
                        <p className="text-xs text-purple-600">
                          Comissão: {formatPrice(sale.commission)}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      <statusConfig.icon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
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
                          {getPaymentMethodLabel(sale.paymentMethod)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Data */}
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <p className="text-sm text-gray-900 dark:text-white">
                          {formatDate(sale.createdAt)}
                        </p>
                      </div>
                      {sale.paidAt && (
                        <p className="text-xs text-green-600 mt-1">
                          Pago: {formatDate(sale.paidAt)}
                        </p>
                      )}
                      {sale.activationDate && (
                        <p className="text-xs text-blue-600 mt-1">
                          Ativo: {formatDate(sale.activationDate)}
                        </p>
                      )}
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
                          onSaleSelect(sale)
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
                          console.log('✏️ Editar venda:', sale.id)
                        }}
                        className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                        title="Editar venda"
                      >
                        <Edit3 className="w-4 h-4 text-green-600" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('⚙️ Mais opções:', sale.id)
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
