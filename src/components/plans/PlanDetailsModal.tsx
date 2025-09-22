'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Package, 
  Edit3,
  Users,
  DollarSign,
  Calendar,
  CheckCircle,
  Crown,
  Gift,
  TrendingUp,
  BarChart3,
  Star,
  Zap,
  Eye,
  Copy
} from 'lucide-react'

interface PlanDetailsModalProps {
  plan: any
  onClose: () => void
  onEdit?: () => void
}

export const PlanDetailsModal: React.FC<PlanDetailsModalProps> = ({
  plan,
  onClose,
  onEdit
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'subscribers' | 'analytics'>('overview')

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
          icon: X,
          color: 'text-red-600',
          bg: 'bg-red-100'
        }
      case 'draft':
        return {
          label: 'Rascunho',
          icon: Eye,
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

  const statusConfig = getStatusConfig(plan.status)
  const hasDiscount = plan.discount > 0
  const isFree = plan.price === 0
  const monthlyRevenue = plan.subscribers * plan.price

  // Mock analytics data
  const analyticsData = {
    conversionRate: 12.5,
    churnRate: 3.2,
    avgLifetime: 18,
    satisfaction: 4.7
  }

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
                <div className={`w-12 h-12 ${statusConfig.bg} rounded-xl flex items-center justify-center shadow-sm relative`}>
                  <Package className={`w-6 h-6 ${statusConfig.color}`} />
                  {plan.isPopular && (
                    <Crown className="absolute -top-1 -right-1 w-4 h-4 text-purple-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {plan.name}
                    </h2>
                    {plan.isPopular && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        Mais Popular
                      </span>
                    )}
                    {hasDiscount && !isFree && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                        <Gift className="w-3 h-3" />
                        -{plan.discount}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatPeriod(plan.period)}
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
                { id: 'overview', label: 'Visão Geral', icon: Package },
                { id: 'features', label: 'Recursos', icon: CheckCircle },
                { id: 'subscribers', label: 'Assinantes', icon: Users },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50 dark:bg-purple-900/20'
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
                  {/* Preço e Métricas */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-purple-700 dark:text-purple-300">Preço</span>
                      </div>
                      <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                        {formatPrice(plan.price)}
                      </p>
                      {hasDiscount && !isFree && (
                        <p className="text-sm text-gray-500 line-through mt-1">
                          {formatPrice(plan.originalPrice)}
                        </p>
                      )}
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-700 dark:text-blue-300">Assinantes</span>
                      </div>
                      <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                        {plan.subscribers.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-700 dark:text-green-300">Receita/Mês</span>
                      </div>
                      <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                        {formatPrice(monthlyRevenue)}
                      </p>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-orange-600" />
                        <span className="font-medium text-orange-700 dark:text-orange-300">Avaliação</span>
                      </div>
                      <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                        {analyticsData.satisfaction}
                      </p>
                    </div>
                  </div>

                  {/* Descrição */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Descrição
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                      <p className="text-gray-700 dark:text-gray-300">
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  {/* Trial Info */}
                  {plan.trial.enabled && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                          Período de Teste
                        </h3>
                      </div>
                      <p className="text-blue-700 dark:text-blue-300">
                        Este plano oferece {plan.trial.days} dias de teste gratuito para novos assinantes.
                      </p>
                    </div>
                  )}

                  {/* Datas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Criado</span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatDate(plan.createdAt)}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Atualizado</span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatDate(plan.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Features Tab */}
              {activeTab === 'features' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recursos */}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Recursos Inclusos ({plan.features.length})
                      </h3>
                      <div className="space-y-3">
                        {plan.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Benefícios */}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Benefícios ({plan.benefits.length})
                      </h3>
                      <div className="space-y-3">
                        {plan.benefits.map((benefit: string, index: number) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Gift className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Vantagens */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Vantagens Competitivas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {plan.advantages.map((advantage: string, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                          <Star className="w-5 h-5 text-purple-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{advantage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Subscribers Tab */}
              {activeTab === 'subscribers' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Estatísticas de Assinantes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">{plan.subscribers}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total de Assinantes</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">{analyticsData.conversionRate}%</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Taxa de Conversão</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-orange-600">{analyticsData.avgLifetime}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Meses Médios</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                      📊 Lista detalhada de assinantes seria implementada aqui
                    </p>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                      <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Taxa de Conversão</h4>
                      <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{analyticsData.conversionRate}%</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl">
                      <h4 className="font-medium text-red-700 dark:text-red-300 mb-2">Taxa de Churn</h4>
                      <p className="text-3xl font-bold text-red-700 dark:text-red-300">{analyticsData.churnRate}%</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                      <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">Lifetime Médio</h4>
                      <p className="text-3xl font-bold text-green-700 dark:text-green-300">{analyticsData.avgLifetime}m</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                      <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">Satisfação</h4>
                      <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{analyticsData.satisfaction}/5</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Gráficos de Performance
                    </h4>
                    <div className="h-64 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        📈 Gráficos de analytics seriam implementados aqui
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
                    navigator.clipboard.writeText(plan.id)
                    console.log('📋 ID copiado:', plan.id)
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
                  className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar Plano
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
