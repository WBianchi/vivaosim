'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  DollarSign, TrendingUp, TrendingDown, PieChart,
  Calculator, AlertTriangle, Download, Eye,
  CheckCircle, Clock, XCircle, Package
} from 'lucide-react'

export default function CustosClientePage() {
  const [contract, setContract] = useState<any>(null)
  const [expenses, setExpenses] = useState<any[]>([])
  const [costEstimate, setCostEstimate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Buscar contrato do cliente
      const contractRes = await fetch('/api/client/contract')
      const contractData = await contractRes.json()
      
      if (contractData.contract) {
        setContract(contractData.contract)
        
        // Buscar despesas do contrato
        const expensesRes = await fetch(`/api/expenses?contractId=${contractData.contract.id}`)
        const expensesData = await expensesRes.json()
        setExpenses(expensesData.expenses || [])
        
        // Buscar orçamento estimado
        const estimateRes = await fetch(`/api/cost-estimates?contractId=${contractData.contract.id}`)
        const estimateData = await estimateRes.json()
        if (estimateData.estimate) {
          setCostEstimate(estimateData.estimate)
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calcular estatísticas
  const stats = {
    totalEstimated: costEstimate?.totalEstimated || contract?.amount || 0,
    totalSpent: expenses.reduce((sum, exp) => sum + Number(exp.amount), 0),
    totalPaid: expenses.reduce((sum, exp) => sum + Number(exp.paidAmount), 0),
    totalPending: expenses.filter(e => e.status === 'PENDENTE').reduce((sum, exp) => sum + Number(exp.amount), 0),
    overdue: expenses.filter(e => e.status === 'ATRASADO').length,
    paid: expenses.filter(e => e.status === 'PAGO').length,
    pending: expenses.filter(e => e.status === 'PENDENTE').length
  }

  stats.remaining = stats.totalEstimated - stats.totalSpent

  // Agrupar por categoria
  const categoryMap: any = {}
  expenses.forEach(expense => {
    if (!categoryMap[expense.category]) {
      categoryMap[expense.category] = {
        category: expense.category,
        total: 0,
        paid: 0,
        count: 0
      }
    }
    categoryMap[expense.category].total += Number(expense.amount)
    categoryMap[expense.category].paid += Number(expense.paidAmount)
    categoryMap[expense.category].count += 1
  })

  const categoriesData = Object.values(categoryMap)

  const getCategoryIcon = (category: string) => {
    const icons: any = {
      SOM: '🎵',
      ILUMINACAO: '💡',
      FOTOGRAFIA: '📸',
      FILMAGEM: '🎥',
      DECORACAO: '🎨',
      BUFFET: '🍽️',
      LOCAL: '🏢',
      TRANSPORTE: '🚗',
      SEGURANCA: '🛡️',
      LIMPEZA: '🧹',
      EQUIPAMENTOS: '📦',
      PESSOAL: '👥',
      MARKETING: '📢',
      ADMINISTRATIVO: '📊',
      OUTROS: '➕'
    }
    return icons[category] || '📌'
  }

  const getCategoryLabel = (category: string) => {
    const labels: any = {
      SOM: 'Som e DJ',
      ILUMINACAO: 'Iluminação',
      FOTOGRAFIA: 'Fotografia',
      FILMAGEM: 'Filmagem',
      DECORACAO: 'Decoração',
      BUFFET: 'Buffet',
      LOCAL: 'Local',
      TRANSPORTE: 'Transporte',
      SEGURANCA: 'Segurança',
      LIMPEZA: 'Limpeza',
      EQUIPAMENTOS: 'Equipamentos',
      PESSOAL: 'Pessoal',
      MARKETING: 'Marketing',
      ADMINISTRATIVO: 'Administrativo',
      OUTROS: 'Outros'
    }
    return labels[category] || category
  }

  const getStatusBadge = (status: string) => {
    const badges: any = {
      PAGO: { label: 'Pago', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
      PENDENTE: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
      ATRASADO: { label: 'Atrasado', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: AlertTriangle },
      PARCIAL: { label: 'Parcial', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: TrendingUp },
      CANCELADO: { label: 'Cancelado', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400', icon: XCircle }
    }
    return badges[status] || badges.PENDENTE
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando custos...</p>
        </div>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-8">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-sm max-w-md">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Nenhum Contrato Encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Você ainda não possui um contrato ativo para visualizar os custos.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Controle de Custos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {contract.title} - {contract.numero}
            </p>
          </div>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Orçamento</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            R$ {Number(stats.totalEstimated).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total estimado
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs text-orange-600">
              {stats.totalEstimated > 0 ? ((stats.totalSpent / stats.totalEstimated) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            R$ {stats.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total gasto
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs text-green-600">
              {stats.totalSpent > 0 ? ((stats.totalPaid / stats.totalSpent) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <p className="text-2xl font-bold text-green-600 mb-1">
            R$ {stats.totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Já pago
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-xs text-gray-500">{stats.pending} itens</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600 mb-1">
            R$ {stats.totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            A pagar
          </p>
        </motion.div>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gastos por Categoria */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Gastos por Categoria
          </h3>
          
          {categoriesData.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                Nenhuma despesa registrada ainda
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {categoriesData.map((cat: any, index: number) => {
                const percentage = stats.totalEstimated > 0 ? (cat.total / stats.totalEstimated) * 100 : 0
                
                return (
                  <motion.div
                    key={cat.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getCategoryIcon(cat.category)}</span>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {getCategoryLabel(cat.category)}
                          </span>
                          <p className="text-xs text-gray-500">{cat.count} {cat.count === 1 ? 'item' : 'itens'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          R$ {cat.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-green-600">
                          R$ {cat.paid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} pago
                        </p>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        {/* Despesas Recentes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Despesas Recentes
            </h3>
            <span className="text-sm text-gray-500">{expenses.length} total</span>
          </div>
          
          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                Nenhuma despesa registrada
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              <AnimatePresence>
                {expenses.slice(0, 10).map((expense, index) => {
                  const badge = getStatusBadge(expense.status)
                  const StatusIcon = badge.icon
                  
                  return (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {expense.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500">
                            {getCategoryLabel(expense.category)}
                          </span>
                          {expense.dueDate && (
                            <span className="text-xs text-gray-500">
                              Vence: {new Date(expense.dueDate).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          R$ {Number(expense.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${badge.color} mt-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {badge.label}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Resumo de Status */}
      {expenses.length > 0 && (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Resumo de Status
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <p className="text-3xl font-bold text-green-600">{stats.paid}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pagas</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pendentes</p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Atrasadas</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <p className="text-3xl font-bold text-blue-600">{expenses.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
