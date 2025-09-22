'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, TrendingUp, TrendingDown, PieChart,
  Users, ShoppingCart, Receipt, Calculator,
  Plus, Filter, Download, Eye, AlertTriangle
} from 'lucide-react'

export default function CustosClientePage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'overview' | 'details'>('overview')

  const totalBudget = 45000
  const totalSpent = 28500
  const remaining = totalBudget - totalSpent

  const categories = [
    { name: 'Decoração', budget: 8000, spent: 6500, icon: '🎨', color: 'bg-purple-500' },
    { name: 'Buffet', budget: 15000, spent: 12000, icon: '🍽️', color: 'bg-orange-500' },
    { name: 'Som/Iluminação', budget: 5000, spent: 4200, icon: '🎵', color: 'bg-blue-500' },
    { name: 'Fotografia', budget: 3500, spent: 2800, icon: '📸', color: 'bg-pink-500' },
    { name: 'Flores', budget: 4000, spent: 2000, icon: '🌺', color: 'bg-red-500' },
    { name: 'Convites', budget: 1500, spent: 1000, icon: '💌', color: 'bg-indigo-500' },
  ]

  const expenses = [
    { id: 1, description: 'Entrada Decoração', category: 'Decoração', value: 3000, date: '2024-01-15', status: 'paid' },
    { id: 2, description: '50% Buffet', category: 'Buffet', value: 7500, date: '2024-01-20', status: 'paid' },
    { id: 3, description: 'Teste de Som', category: 'Som/Iluminação', value: 500, date: '2024-01-25', status: 'paid' },
    { id: 4, description: 'Sinal Fotógrafo', category: 'Fotografia', value: 1000, date: '2024-02-01', status: 'paid' },
    { id: 5, description: 'Flores - Parcela 1', category: 'Flores', value: 2000, date: '2024-02-10', status: 'pending' },
  ]

  const guests = {
    total: 150,
    confirmed: 98,
    pending: 42,
    declined: 10
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Controle de Custos</h1>
            <p className="text-gray-600 dark:text-gray-400">Gerencie o orçamento do seu evento</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtrar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Despesa
          </motion.button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <Calculator className="w-8 h-8 text-blue-500" />
            <span className="text-xs text-gray-500">100%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            R$ {totalBudget.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Orçamento Total</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingDown className="w-8 h-8 text-orange-500" />
            <span className="text-xs text-orange-600">{((totalSpent/totalBudget)*100).toFixed(0)}%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            R$ {totalSpent.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Gasto</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <span className="text-xs text-green-600">{((remaining/totalBudget)*100).toFixed(0)}%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            R$ {remaining.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Disponível</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-purple-500" />
            <span className="text-xs text-purple-600">{guests.confirmed}/{guests.total}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{guests.total}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Convidados</p>
        </motion.div>
      </div>

      {/* Gráfico de Categorias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Gastos por Categoria</h3>
          
          <div className="space-y-4">
            {categories.map((category, index) => {
              const percentage = (category.spent / category.budget) * 100
              const isOverBudget = category.spent > category.budget
              
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        R$ {category.spent.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-xs text-gray-500">
                        de R$ {category.budget.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`h-full ${isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      />
                    </div>
                    {isOverBudget && (
                      <div className="absolute -right-1 top-1/2 -translate-y-1/2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Lista de Despesas Recentes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Despesas Recentes</h3>
            <button className="text-sm text-orange-600 hover:text-orange-700">Ver todas</button>
          </div>
          
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{expense.description}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">{expense.category}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(expense.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    R$ {expense.value.toLocaleString('pt-BR')}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    expense.status === 'paid' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {expense.status === 'paid' ? 'Pago' : 'Pendente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumo de Convidados */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Status dos Convidados</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{guests.total}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total</p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <p className="text-3xl font-bold text-green-600">{guests.confirmed}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Confirmados</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
            <p className="text-3xl font-bold text-yellow-600">{guests.pending}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pendentes</p>
          </div>
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <p className="text-3xl font-bold text-red-600">{guests.declined}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Recusaram</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Custo por convidado</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                R$ {(totalBudget / guests.total).toFixed(2)}
              </p>
            </div>
            <Calculator className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>
    </div>
  )
}
