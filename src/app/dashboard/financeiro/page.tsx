'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Calendar,
  Users,
  Package,
  CreditCard,
  PieChart,
  BarChart3,
  Plus,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import CreateExpenseModal from '@/components/financial/CreateExpenseModal'
import CreateSupplierModal from '@/components/financial/CreateSupplierModal'

export default function FinanceiroPage() {
  const [stats, setStats] = useState<any>(null)
  const [expenses, setExpenses] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'overview' | 'expenses' | 'suppliers'>('overview')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  
  // Modais
  const [showCreateExpenseModal, setShowCreateExpenseModal] = useState(false)
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<any>(null)
  const [showCreateSupplierModal, setShowCreateSupplierModal] = useState(false)
  const [showEditSupplierModal, setShowEditSupplierModal] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [filterCategory, filterStatus])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Buscar estatísticas
      const statsRes = await fetch('/api/expenses/stats')
      const statsData = await statsRes.json()
      if (statsData.success) {
        setStats(statsData.stats)
      }

      // Buscar despesas
      const expensesRes = await fetch(`/api/expenses?category=${filterCategory}&status=${filterStatus}`)
      const expensesData = await expensesRes.json()
      setExpenses(expensesData.expenses || [])

      // Buscar fornecedores
      const suppliersRes = await fetch('/api/suppliers')
      const suppliersData = await suppliersRes.json()
      setSuppliers(suppliersData.suppliers || [])

    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: 'all', label: 'Todas' },
    { value: 'SOM', label: 'Som e DJ' },
    { value: 'ILUMINACAO', label: 'Iluminação' },
    { value: 'FOTOGRAFIA', label: 'Fotografia' },
    { value: 'FILMAGEM', label: 'Filmagem' },
    { value: 'DECORACAO', label: 'Decoração' },
    { value: 'BUFFET', label: 'Buffet' },
    { value: 'LOCAL', label: 'Local' },
    { value: 'TRANSPORTE', label: 'Transporte' },
    { value: 'OUTROS', label: 'Outros' }
  ]

  const statuses = [
    { value: 'all', label: 'Todos' },
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'PAGO', label: 'Pago' },
    { value: 'ATRASADO', label: 'Atrasado' },
    { value: 'PARCIAL', label: 'Parcial' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Gestão Financeira
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Controle completo de despesas, fornecedores e orçamentos
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm">
        <button
          onClick={() => setViewMode('overview')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
            viewMode === 'overview'
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <PieChart className="w-4 h-4 inline mr-2" />
          Visão Geral
        </button>
        <button
          onClick={() => setViewMode('expenses')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
            viewMode === 'expenses'
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <CreditCard className="w-4 h-4 inline mr-2" />
          Despesas
        </button>
        <button
          onClick={() => setViewMode('suppliers')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
            viewMode === 'suppliers'
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Fornecedores
        </button>
      </div>

      {/* Estatísticas */}
      {stats && viewMode === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              R$ {stats.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stats.total} despesas
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Pago</span>
            </div>
            <p className="text-2xl font-bold text-green-600 mb-1">
              R$ {stats.totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {((stats.totalPaid / stats.totalAmount) * 100).toFixed(1)}% do total
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Pendente</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 mb-1">
              R$ {stats.totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A pagar
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Atrasadas</span>
            </div>
            <p className="text-2xl font-bold text-red-600 mb-1">
              {stats.overdue}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stats.upcoming} próximas a vencer
            </p>
          </motion.div>
        </div>
      )}

      {/* Conteúdo por Aba */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Carregando dados...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Visão Geral */}
          {viewMode === 'overview' && stats && (
            <div className="space-y-6">
              {/* Gráficos por Categoria */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Despesas por Categoria
                </h3>
                
                {stats.byCategory.length === 0 ? (
                  <div className="text-center py-12">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Nenhuma despesa registrada ainda
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats.byCategory.map((cat: any, index: number) => {
                      const percentage = stats.totalAmount > 0 ? (Number(cat._sum.amount) / stats.totalAmount) * 100 : 0
                      
                      return (
                        <motion.div
                          key={cat.category}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{getCategoryIcon(cat.category)}</span>
                              <div>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {getCategoryLabel(cat.category)}
                                </span>
                                <p className="text-xs text-gray-500">{cat._count} {cat._count === 1 ? 'despesa' : 'despesas'}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                R$ {Number(cat._sum.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                              <p className="text-xs text-green-600">
                                R$ {Number(cat._sum.paidAmount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} pago
                              </p>
                            </div>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(percentage, 100)}%` }}
                              transition={{ duration: 0.5, delay: index * 0.05 }}
                              className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                            />
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Status das Despesas */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Status das Despesas
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {stats.byStatus.map((status: any) => {
                    const badge = getStatusBadge(status.status)
                    const StatusIcon = badge.icon
                    
                    return (
                      <div key={status.status} className={`text-center p-4 rounded-xl ${badge.color.replace('text-', 'bg-').replace('700', '50').replace('400', '50')}`}>
                        <StatusIcon className="w-8 h-8 mx-auto mb-2 text-gray-700 dark:text-gray-300" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{status._count}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{badge.label}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          R$ {Number(status._sum.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Aba Despesas */}
          {viewMode === 'expenses' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
              {/* Filtros */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Categoria
                    </label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    >
                      {statuses.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-7">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setFilterCategory('all')
                        setFilterStatus('all')
                      }}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                    >
                      Limpar
                    </motion.button>
                  </div>

                  <div className="pt-7">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowCreateExpenseModal(true)}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Nova Despesa
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Tabela de Despesas */}
              <div className="overflow-x-auto">
                {expenses.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Nenhuma despesa encontrada
                    </p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Despesa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Categoria
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Fornecedor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Valor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Vencimento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {expenses.map((expense) => {
                        const badge = getStatusBadge(expense.status)
                        const StatusIcon = badge.icon
                        
                        return (
                          <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {expense.title}
                                </p>
                                {expense.contract && (
                                  <p className="text-xs text-gray-500">
                                    {expense.contract.numero}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getCategoryIcon(expense.category)}</span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {getCategoryLabel(expense.category)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <p className="text-sm text-gray-900 dark:text-white">
                                {expense.supplier?.name || '-'}
                              </p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                  R$ {Number(expense.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                                {Number(expense.paidAmount) > 0 && (
                                  <p className="text-xs text-green-600">
                                    R$ {Number(expense.paidAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} pago
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <p className="text-sm text-gray-900 dark:text-white">
                                {expense.dueDate ? new Date(expense.dueDate).toLocaleDateString('pt-BR') : '-'}
                              </p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${badge.color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {badge.label}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedExpense(expense)
                                    setShowEditExpenseModal(true)
                                  }}
                                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Aba Fornecedores */}
          {viewMode === 'suppliers' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Fornecedores Cadastrados
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateSupplierModal(true)}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Novo Fornecedor
                </motion.button>
              </div>

              {/* Grid de Fornecedores */}
              {suppliers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Nenhum fornecedor cadastrado
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {suppliers.map((supplier, index) => (
                    <motion.div
                      key={supplier.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">{getCategoryIcon(supplier.category)}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {supplier.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {getCategoryLabel(supplier.category)}
                            </p>
                          </div>
                        </div>
                        {supplier.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {supplier.rating}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        {supplier.phone && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            📞 {supplier.phone}
                          </p>
                        )}
                        {supplier.email && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ✉️ {supplier.email}
                          </p>
                        )}
                        {supplier.pixKey && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            💳 PIX: {supplier.pixKey}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div>
                          <p className="text-xs text-gray-500">Despesas</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {supplier._count?.expenses || 0}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedSupplier(supplier)
                            setShowEditSupplierModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modais */}
      {showCreateExpenseModal && (
        <CreateExpenseModal
          onClose={() => setShowCreateExpenseModal(false)}
          onSuccess={() => fetchData()}
        />
      )}

      {showCreateSupplierModal && (
        <CreateSupplierModal
          onClose={() => setShowCreateSupplierModal(false)}
          onSuccess={() => fetchData()}
        />
      )}
    </div>
  )
}

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
    ATRASADO: { label: 'Atrasado', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: AlertCircle },
    PARCIAL: { label: 'Parcial', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: TrendingUp },
    CANCELADO: { label: 'Cancelado', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400', icon: XCircle }
  }
  return badges[status] || badges.PENDENTE
}
