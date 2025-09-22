'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, Eye, Edit3, MoreVertical, User, CheckCircle, XCircle, Clock, AlertTriangle, DollarSign, TrendingUp, Percent, Award } from 'lucide-react'

interface AffiliatesTableProps {
  affiliates: any[]
  onAffiliateSelect: (affiliate: any) => void
}

type SortField = 'name' | 'status' | 'totalCommissions' | 'salesCount' | 'conversionRate' | 'joinedAt'
type SortDirection = 'asc' | 'desc'

export const AffiliatesTable: React.FC<AffiliatesTableProps> = ({ affiliates, onAffiliateSelect }) => {
  const [sortField, setSortField] = useState<SortField>('totalCommissions')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedAffiliates = [...affiliates].sort((a, b) => {
    let aValue: any, bValue: any

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'totalCommissions':
        aValue = a.totalCommissions
        bValue = b.totalCommissions
        break
      case 'salesCount':
        aValue = a.salesCount
        bValue = b.salesCount
        break
      case 'conversionRate':
        aValue = a.conversionRate
        bValue = b.conversionRate
        break
      case 'joinedAt':
        aValue = new Date(a.joinedAt).getTime()
        bValue = new Date(b.joinedAt).getTime()
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR')
  const formatCurrency = (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active': return { label: 'Ativo', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' }
      case 'inactive': return { label: 'Inativo', icon: XCircle, color: 'text-gray-600', bg: 'bg-gray-100' }
      case 'pending': return { label: 'Pendente', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' }
      case 'suspended': return { label: 'Suspenso', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' }
      default: return { label: 'Desconhecido', icon: User, color: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  const getPaymentStatusConfig = (status: string) => {
    switch (status) {
      case 'paid': return { label: 'Pago', color: 'text-green-600' }
      case 'pending': return { label: 'Pendente', color: 'text-yellow-600' }
      case 'overdue': return { label: 'Atrasado', color: 'text-red-600' }
      case 'processing': return { label: 'Processando', color: 'text-blue-600' }
      default: return { label: 'Desconhecido', color: 'text-gray-600' }
    }
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-purple-600 transition-colors"
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
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
                <SortButton field="name">Afiliado</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="totalCommissions">Comissões</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="salesCount">Performance</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                Pagamento
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="joinedAt">Cadastro</SortButton>
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {sortedAffiliates.map((affiliate, index) => {
              const statusConfig = getStatusConfig(affiliate.status)
              const paymentConfig = getPaymentStatusConfig(affiliate.paymentStatus)
              const isTopPerformer = affiliate.performance === 'excellent'

              return (
                <motion.tr
                  key={affiliate.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                    isTopPerformer ? 'bg-purple-50 dark:bg-purple-900/10' : ''
                  }`}
                  onClick={() => onAffiliateSelect(affiliate)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`w-10 h-10 ${statusConfig.bg} rounded-lg flex items-center justify-center`}>
                          {affiliate.avatar ? (
                            <img src={affiliate.avatar} alt={affiliate.name} className="w-full h-full rounded-lg object-cover" />
                          ) : (
                            <User className={`w-5 h-5 ${statusConfig.color}`} />
                          )}
                        </div>
                        {isTopPerformer && (
                          <Award className="absolute -top-1 -right-1 w-4 h-4 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{affiliate.name}</p>
                        <p className="text-sm text-gray-500">{affiliate.email}</p>
                        <p className="text-xs text-gray-400">{affiliate.phone}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      <statusConfig.icon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(affiliate.totalCommissions)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Este mês: {formatCurrency(affiliate.monthlyCommissions)}
                      </p>
                      <p className="text-xs text-purple-600">
                        Taxa: {affiliate.commissionRate}%
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">{affiliate.salesCount} vendas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{affiliate.conversionRate}% conversão</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <span className={`text-sm font-medium ${paymentConfig.color}`}>
                        {paymentConfig.label}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {affiliate.paymentMethod === 'pix' ? 'PIX' : 
                         affiliate.paymentMethod === 'bank_transfer' ? 'Transferência' : 'Outro'}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDate(affiliate.joinedAt)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Última venda: {formatDate(affiliate.lastSale)}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); onAffiliateSelect(affiliate) }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); console.log('✏️ Editar afiliado:', affiliate.id) }}
                        className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                        title="Editar afiliado"
                      >
                        <Edit3 className="w-4 h-4 text-purple-600" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); console.log('⚙️ Mais opções:', affiliate.id) }}
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
