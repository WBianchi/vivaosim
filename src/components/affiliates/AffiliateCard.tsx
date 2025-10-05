'use client'

import { motion } from 'framer-motion'
import { User, Mail, Phone, Eye, Edit3, Trash2, CheckCircle, XCircle, Clock, AlertTriangle, DollarSign, TrendingUp, Link, Calendar, Award, Percent } from 'lucide-react'

interface AffiliateCardProps {
  affiliate: any
  index: number
  onClick: () => void
  onEdit: (affiliate: any) => void
  onDelete: (affiliateId: string) => void
}

export const AffiliateCard: React.FC<AffiliateCardProps> = ({ affiliate, index, onClick, onEdit, onDelete }) => {
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
      case 'paid': return { label: 'Pago', color: 'text-green-600', bg: 'bg-green-100' }
      case 'pending': return { label: 'Pendente', color: 'text-yellow-600', bg: 'bg-yellow-100' }
      case 'overdue': return { label: 'Atrasado', color: 'text-red-600', bg: 'bg-red-100' }
      case 'processing': return { label: 'Processando', color: 'text-blue-600', bg: 'bg-blue-100' }
      default: return { label: 'Desconhecido', color: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  const getPerformanceConfig = (performance: string) => {
    switch (performance) {
      case 'excellent': return { label: 'Excelente', color: 'text-green-600', bg: 'bg-green-100' }
      case 'good': return { label: 'Boa', color: 'text-blue-600', bg: 'bg-blue-100' }
      case 'average': return { label: 'Média', color: 'text-yellow-600', bg: 'bg-yellow-100' }
      case 'poor': return { label: 'Baixa', color: 'text-red-600', bg: 'bg-red-100' }
      default: return { label: 'N/A', color: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  const statusConfig = getStatusConfig(affiliate.status)
  const paymentConfig = getPaymentStatusConfig(affiliate.paymentStatus)
  const performanceConfig = getPerformanceConfig(affiliate.performance)
  const isTopPerformer = affiliate.performance === 'excellent'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group ${
        isTopPerformer ? 'border-purple-200 ring-2 ring-purple-100 dark:ring-purple-900/30' : 'border-gray-200 dark:border-gray-700'
      }`}
      onClick={onClick}
    >
      {isTopPerformer && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-bl-xl text-xs font-medium flex items-center gap-1">
          <Award className="w-3 h-3" />
          Top Performer
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${statusConfig.bg} flex items-center justify-center shadow-sm`}>
              {affiliate.avatar ? (
                <img src={affiliate.avatar} alt={affiliate.name} className="w-full h-full rounded-xl object-cover" />
              ) : (
                <User className={`w-6 h-6 ${statusConfig.color}`} />
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">{affiliate.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 ${statusConfig.bg} ${statusConfig.color} rounded-full text-xs font-medium`}>
                  {statusConfig.label}
                </span>
                <span className={`px-2 py-0.5 ${performanceConfig.bg} ${performanceConfig.color} rounded-full text-xs font-medium`}>
                  {performanceConfig.label}
                </span>
              </div>
            </div>
          </div>

        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4" />
            <span className="line-clamp-1">{affiliate.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Phone className="w-4 h-4" />
            <span>{affiliate.phone}</span>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Comissões</span>
            </div>
            <span className={`px-2 py-1 ${paymentConfig.bg} ${paymentConfig.color} rounded-full text-xs font-medium`}>
              {paymentConfig.label}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-purple-600 dark:text-purple-400">Total</p>
              <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                {formatCurrency(affiliate.totalCommissions)}
              </p>
            </div>
            <div>
              <p className="text-xs text-purple-600 dark:text-purple-400">Este Mês</p>
              <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                {formatCurrency(affiliate.monthlyCommissions)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">Vendas</span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{affiliate.salesCount}</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Percent className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">Conversão</span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{affiliate.conversionRate}%</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">Taxa</span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{affiliate.commissionRate}%</span>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Link className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Link de Afiliado</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-600 dark:text-blue-400 truncate">
              {affiliate.shareableLink}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                navigator.clipboard.writeText(affiliate.shareableLink)
                console.log('📋 Link copiado')
              }}
              className="text-blue-600 hover:text-blue-700 text-xs"
            >
              Copiar
            </motion.button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <Calendar className="w-4 h-4" />
          <span>Afiliado desde: {formatDate(affiliate.createdAt)}</span>
        </div>

        {affiliate.lastSale && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Última venda: {formatDate(affiliate.lastSale)}</span>
          </div>
        )}
      </div>

      <div className="px-6 pb-6">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => { e.stopPropagation(); onClick() }}
            className="flex-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-3 h-3" />
            Ver Detalhes
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => { e.stopPropagation(); onEdit(affiliate) }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Edit3 className="w-3 h-3" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => { 
              e.stopPropagation()
              if (confirm(`Tem certeza que deseja excluir o afiliado ${affiliate.name}?`)) {
                onDelete(affiliate.id)
              }
            }}
            className="px-3 py-2 border border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-3 h-3" />
          </motion.button>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  )
}
