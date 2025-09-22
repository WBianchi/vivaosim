'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  User, 
  Edit3,
  Mail,
  Phone,
  Building,
  MapPin,
  Package,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  FileText,
  BarChart3,
  Settings,
  Copy
} from 'lucide-react'

interface SubscriberDetailsModalProps {
  subscriber: any
  onClose: () => void
  onEdit?: () => void
}

export const SubscriberDetailsModal: React.FC<SubscriberDetailsModalProps> = ({
  subscriber,
  onClose,
  onEdit
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'subscription' | 'payments' | 'activity'>('overview')

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

  const statusConfig = getStatusConfig(subscriber.status)
  const subscriptionConfig = getSubscriptionStatusConfig(subscriber.subscription.status)
  const paymentConfig = getPaymentStatusConfig(subscriber.payment.status)

  // Mock payment history
  const paymentHistory = [
    {
      id: 'pay-001',
      date: '2024-01-15T10:00:00Z',
      amount: 99.90,
      status: 'paid',
      method: 'credit_card',
      description: 'Plano Profissional - Janeiro 2024'
    },
    {
      id: 'pay-002',
      date: '2023-12-15T10:00:00Z',
      amount: 99.90,
      status: 'paid',
      method: 'credit_card',
      description: 'Plano Profissional - Dezembro 2023'
    }
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${statusConfig.bg} rounded-xl flex items-center justify-center shadow-sm`}>
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
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {subscriber.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${subscriptionConfig.bg} ${subscriptionConfig.color}`}>
                      {subscriptionConfig.label}
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

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {[
                { id: 'overview', label: 'Visão Geral', icon: User },
                { id: 'subscription', label: 'Assinatura', icon: Package },
                { id: 'payments', label: 'Pagamentos', icon: CreditCard },
                { id: 'activity', label: 'Atividade', icon: BarChart3 }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Informações Pessoais */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Informações Pessoais
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Mail className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</span>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {subscriber.email}
                          </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Phone className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</span>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {subscriber.phone}
                          </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Documento</span>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {subscriber.document}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Informações Comerciais
                      </h3>
                      <div className="space-y-4">
                        {subscriber.company && (
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <Building className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Empresa</span>
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {subscriber.company}
                            </p>
                          </div>
                        )}

                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Endereço</span>
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {subscriber.address.street}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {subscriber.address.city}, {subscriber.address.state}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              CEP: {subscriber.address.zipCode}
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Último Acesso</span>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatDateTime(subscriber.lastLogin)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Datas Importantes */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cadastrado</span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatDate(subscriber.createdAt)}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Atualizado</span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatDate(subscriber.updatedAt)}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Pago</span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatPrice(subscriber.payment.totalPaid)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Subscription Tab */}
              {activeTab === 'subscription' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Plano Atual: {subscriber.plan.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-blue-600 dark:text-blue-400">Preço</p>
                        <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                          {formatPrice(subscriber.plan.price)}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          /{subscriber.plan.period === 'monthly' ? 'mês' : 'ano'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-600 dark:text-blue-400">Status</p>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${subscriptionConfig.bg} ${subscriptionConfig.color}`}>
                          {subscriptionConfig.label}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-blue-600 dark:text-blue-400">Renovação</p>
                        <p className="font-semibold text-blue-800 dark:text-blue-200">
                          {subscriber.subscription.autoRenewal ? 'Automática' : 'Manual'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Datas da Assinatura</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Início:</span>
                          <span className="font-medium">{formatDate(subscriber.subscription.startDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Vencimento:</span>
                          <span className="font-medium">{formatDate(subscriber.subscription.endDate)}</span>
                        </div>
                        {subscriber.subscription.renewalDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Próxima Renovação:</span>
                            <span className="font-medium">{formatDate(subscriber.subscription.renewalDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Configurações</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Renovação Automática:</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            subscriber.subscription.autoRenewal 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {subscriber.subscription.autoRenewal ? 'Ativa' : 'Inativa'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">ID da Assinatura:</span>
                          <span className="font-mono text-sm">{subscriber.subscription.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === 'payments' && (
                <div className="space-y-6">
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Status do Pagamento
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-green-600 dark:text-green-400">Status Atual</p>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${paymentConfig.bg} ${paymentConfig.color}`}>
                          {paymentConfig.label}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-green-600 dark:text-green-400">Método</p>
                        <p className="font-semibold text-green-800 dark:text-green-200">
                          {subscriber.payment.method === 'credit_card' ? 'Cartão de Crédito' : 
                           subscriber.payment.method === 'pix' ? 'PIX' : 
                           subscriber.payment.method === 'bank_transfer' ? 'Transferência' : 'Boleto'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-green-600 dark:text-green-400">Total Pago</p>
                        <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                          {formatPrice(subscriber.payment.totalPaid)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Histórico de Pagamentos</h4>
                    <div className="space-y-3">
                      {paymentHistory.map((payment) => (
                        <div key={payment.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {payment.description}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {formatDate(payment.date)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900 dark:text-white">
                                {formatPrice(payment.amount)}
                              </p>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                payment.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {payment.status === 'paid' ? 'Pago' : 'Falhou'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Atividade do Assinante
                    </h4>
                    <div className="h-64 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        📊 Gráficos de atividade seriam implementados aqui
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigator.clipboard.writeText(subscriber.id)
                    console.log('📋 ID copiado:', subscriber.id)
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
                  className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar Assinante
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    console.log('⚙️ Gerenciar assinatura:', subscriber.subscription.id)
                  }}
                  className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Gerenciar
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
