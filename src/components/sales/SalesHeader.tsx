'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  CreditCard,
  Calendar,
  Users,
  Target,
  BarChart3,
  Filter
} from 'lucide-react'

interface SalesHeaderProps {
  onCreateSale: () => void
  onSearchChange: (search: string) => void
  searchTerm: string
  viewMode: 'grid' | 'table'
  onViewModeChange: (mode: 'grid' | 'table') => void
  onToggleFilters?: () => void
}

export const SalesHeader: React.FC<SalesHeaderProps> = ({
  onCreateSale,
  onSearchChange,
  searchTerm,
  viewMode,
  onViewModeChange,
  onToggleFilters
}) => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    activeSales: 0,
    pendingSales: 0,
    completedSales: 0,
    cancelledSales: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/subscribers')
      const data = await response.json()

      if (data.success) {
        const subscribers = data.data

        // Calcular estatísticas
        const totalSales = subscribers.filter((s: any) => s.subscription).length
        const totalRevenue = subscribers.reduce((sum: number, s: any) => {
          return sum + (s.plan?.price || 0)
        }, 0)
        
        const activeSales = subscribers.filter((s: any) => 
          s.subscription?.status === 'active'
        ).length
        
        const monthlyRevenue = subscribers
          .filter((s: any) => s.subscription?.status === 'active')
          .reduce((sum: number, s: any) => {
            return sum + (s.plan?.price || 0)
          }, 0)

        setStats({
          totalSales,
          totalRevenue,
          monthlyRevenue,
          activeSales,
          pendingSales: 0,
          completedSales: activeSales,
          cancelledSales: subscribers.filter((s: any) => 
            s.subscription?.status === 'canceled'
          ).length
        })
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }

  return (
    <div className="space-y-6">
      {/* Header Principal */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Vendas de Planos
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Acompanhe todas as vendas, receitas e métricas de conversão
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar vendas..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Toggle View */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 text-green-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewModeChange('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-gray-600 text-green-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Botão Filtros */}
          {onToggleFilters && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleFilters}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </motion.button>
          )}

          {/* Botão Criar Venda */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateSale}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-green-500/25"
          >
            <Plus className="w-4 h-4" />
            Nova Venda
          </motion.button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Receita Total
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? (
                  <span className="animate-pulse">Carregando...</span>
                ) : (
                  formatCurrency(stats.totalRevenue)
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 dark:text-green-400">
              +18% este mês
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Receita Mensal
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.monthlyRevenue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-sm text-blue-600 dark:text-blue-400">
              Meta: R$ 35.000
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Vendas
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalSales}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              +24 esta semana
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Vendas Ativas
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.activeSales}
              </p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center">
            <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
            <span className="text-xs text-green-600 dark:text-green-400">
              +2.1%
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Concluídas
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.completedSales}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {((stats.completedSales / stats.totalSales) * 100).toFixed(1)}% do total
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pendentes
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.pendingSales}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center">
            <span className="text-xs text-yellow-600 dark:text-yellow-400">
              Aguardando pagamento
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
