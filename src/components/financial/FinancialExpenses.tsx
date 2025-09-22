'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Receipt, Plus, Filter, Download, TrendingUp, TrendingDown, Calendar, Tag, DollarSign, AlertTriangle } from 'lucide-react'

interface FinancialExpensesProps {
  period: string
}

export const FinancialExpenses: React.FC<FinancialExpensesProps> = ({ period }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const expenses = [
    {
      id: '1',
      description: 'Compra de Flores - Casamento Silva',
      category: 'Decoração',
      amount: 2500,
      date: '2024-01-25',
      status: 'paid',
      event: 'Casamento Silva & Costa',
      supplier: 'Floricultura Primavera',
      paymentMethod: 'PIX'
    },
    {
      id: '2',
      description: 'Aluguel de Som e Iluminação',
      category: 'Equipamentos',
      amount: 4800,
      date: '2024-01-24',
      status: 'paid',
      event: 'Casamento Silva & Costa',
      supplier: 'Pro Audio Eventos',
      paymentMethod: 'Boleto'
    },
    {
      id: '3',
      description: 'Buffet Completo - 200 pessoas',
      category: 'Alimentação',
      amount: 12000,
      date: '2024-01-23',
      status: 'pending',
      event: 'Aniversário 15 Anos Maria',
      supplier: 'Sabor & Arte Buffet',
      paymentMethod: 'Cartão'
    },
    {
      id: '4',
      description: 'Fotografia e Filmagem',
      category: 'Mídia',
      amount: 3200,
      date: '2024-01-22',
      status: 'paid',
      event: 'Casamento Silva & Costa',
      supplier: 'Studio Memories',
      paymentMethod: 'Transferência'
    },
    {
      id: '5',
      description: 'Decoração Completa Salão',
      category: 'Decoração',
      amount: 7500,
      date: '2024-01-21',
      status: 'overdue',
      event: 'Formatura Turma 2024',
      supplier: 'Decor Plus',
      paymentMethod: 'Boleto'
    }
  ]

  const categories = [
    { name: 'Decoração', total: 18500, count: 12, trend: 'up', percentage: 15.2 },
    { name: 'Alimentação', total: 32000, count: 8, trend: 'down', percentage: -5.8 },
    { name: 'Equipamentos', total: 12800, count: 6, trend: 'up', percentage: 8.4 },
    { name: 'Mídia', total: 9600, count: 4, trend: 'up', percentage: 12.3 },
    { name: 'Espaço', total: 15000, count: 3, trend: 'down', percentage: -2.1 },
    { name: 'Outros', total: 5300, count: 15, trend: 'up', percentage: 3.7 }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'overdue': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago'
      case 'pending': return 'Pendente'
      case 'overdue': return 'Vencido'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com resumo */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Controle de Despesas</h3>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium"
            >
              <Plus className="w-4 h-4" />
              Nova Despesa
            </motion.button>
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-red-600" />
              <span className="text-xs text-red-600 font-medium">+8.3%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ 93.200</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total de Despesas</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <Receipt className="w-5 h-5 text-green-600" />
              <span className="text-xs text-green-600 font-medium">72%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ 67.100</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Despesas Pagas</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-yellow-600" />
              <span className="text-xs text-yellow-600 font-medium">23%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ 21.400</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pendentes</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-xs text-red-600 font-medium">5%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ 4.700</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Vencidas</p>
          </div>
        </div>

        {/* Categorias */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((category) => (
            <motion.button
              key={category.name}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedCategory(category.name)}
              className={`p-3 rounded-xl border-2 transition-all ${
                selectedCategory === category.name
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Tag className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                {category.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 text-green-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-600" />
                )}
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white text-left">
                {category.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-left">
                R$ {(category.total / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-gray-500 text-left">
                {category.count} itens
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tabela de Despesas */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Descrição
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Categoria
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Evento
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Fornecedor
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Data
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Valor
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {expenses.map((expense) => (
                <motion.tr
                  key={expense.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {expense.description}
                    </p>
                    <p className="text-xs text-gray-500">{expense.paymentMethod}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Tag className="w-3 h-3" />
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {expense.event}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {expense.supplier}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(expense.date).toLocaleDateString('pt-BR')}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      R$ {expense.amount.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(expense.status)}`}>
                      {getStatusLabel(expense.status)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
