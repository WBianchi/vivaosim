'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  ShoppingCart, 
  Edit3,
  User,
  Mail,
  Building,
  Package,
  CreditCard,
  Calendar,
  DollarSign,
  Hash,
  Copy,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'

interface SaleDetailsModalProps {
  sale: any
  onClose: () => void
  onEdit?: () => void
}

export const SaleDetailsModal: React.FC<SaleDetailsModalProps> = ({
  sale,
  onClose,
  onEdit
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

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
        return { label: 'Concluída', color: 'text-green-600', bg: 'bg-green-100' }
      case 'pending':
        return { label: 'Pendente', color: 'text-yellow-600', bg: 'bg-yellow-100' }
      case 'cancelled':
        return { label: 'Cancelada', color: 'text-red-600', bg: 'bg-red-100' }
      case 'refunded':
        return { label: 'Reembolsada', color: 'text-purple-600', bg: 'bg-purple-100' }
      default:
        return { label: 'Desconhecido', color: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  const statusConfig = getStatusConfig(sale.status)

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Detalhes da Venda
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Hash className="w-3 h-3 text-gray-400" />
                    <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                      {sale.saleNumber}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onEdit && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onEdit()
                      handleClose()
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    <Edit3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status e Valores */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Valor Original</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatPrice(sale.amount)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Desconto</p>
                  <p className="text-lg font-bold text-orange-600">
                    {sale.discount}%
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                  <p className="text-sm text-green-600 dark:text-green-400 mb-1">Valor Final</p>
                  <p className="text-lg font-bold text-green-700 dark:text-green-300">
                    {formatPrice(sale.finalAmount)}
                  </p>
                </div>
              </div>

              {/* Cliente e Plano */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informações do Cliente
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                      <p className="font-medium text-gray-900 dark:text-white">{sale.customer.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{sale.customer.email}</span>
                      </div>
                      {sale.customer.company && (
                        <div className="flex items-center gap-2 mt-1">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{sale.customer.company}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Plano Vendido
                  </h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                    <p className="font-medium text-blue-800 dark:text-blue-200">{sale.plan.name}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                      {formatPrice(sale.plan.price)} / {sale.plan.period === 'monthly' ? 'mês' : 'ano'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pagamento */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Informações de Pagamento
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Método</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {sale.paymentMethod === 'credit_card' ? 'Cartão de Crédito' :
                       sale.paymentMethod === 'pix' ? 'PIX' :
                       sale.paymentMethod === 'bank_transfer' ? 'Transferência' : 'Boleto'}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                    <p className="font-medium text-gray-900 dark:text-white">{sale.paymentStatus}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Comissão</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(sale.commission)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Datas */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Timeline da Venda
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Venda Criada</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{formatDateTime(sale.createdAt)}</p>
                    </div>
                  </div>
                  
                  {sale.paidAt && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Pagamento Confirmado</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatDateTime(sale.paidAt)}</p>
                      </div>
                    </div>
                  )}

                  {sale.activationDate && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Plano Ativado</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatDateTime(sale.activationDate)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notas */}
              {sale.notes && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Observações</h3>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl">
                    <p className="text-gray-700 dark:text-gray-300">{sale.notes}</p>
                  </div>
                </div>
              )}

              {/* Vendedor */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Vendedor Responsável</h4>
                <p className="text-purple-700 dark:text-purple-300">{sale.seller}</p>
              </div>

              {/* Ações */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigator.clipboard.writeText(sale.id)
                    console.log('📋 ID copiado:', sale.id)
                  }}
                  className="px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copiar ID
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (onEdit) {
                      onEdit()
                      handleClose()
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar Venda
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
