'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, TrendingUp, Calendar, Filter,
  Download, Eye, CheckCircle, Clock, XCircle,
  CreditCard, QrCode, User, Package, Receipt
} from 'lucide-react'

export default function RecebimentosClientePage() {
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPeriod, setFilterPeriod] = useState('month')

  const receivables = [
    {
      id: 1,
      item: 'Cota de Lua de Mel - Maldivas',
      buyer: 'Maria Silva',
      value: 500,
      date: '2024-01-20',
      status: 'paid',
      payment: 'PIX',
      transactionId: 'PIX2024012001'
    },
    {
      id: 2,
      item: 'Kit Chá de Cozinha Premium',
      buyer: 'João Santos',
      value: 250,
      date: '2024-01-22',
      status: 'paid',
      payment: 'Cartão Crédito',
      transactionId: 'CC2024012201'
    },
    {
      id: 3,
      item: 'Jogo de Toalhas Bordadas',
      buyer: 'Ana Costa',
      value: 180,
      date: '2024-01-25',
      status: 'pending',
      payment: 'PIX',
      transactionId: null
    },
    {
      id: 4,
      item: 'Aparelho de Jantar Completo',
      buyer: 'Pedro Oliveira',
      value: 450,
      date: '2024-01-26',
      status: 'paid',
      payment: 'Cartão Débito',
      transactionId: 'CD2024012601'
    },
    {
      id: 5,
      item: 'Cota Viagem Nacional',
      buyer: 'Carla Mendes',
      value: 300,
      date: '2024-01-28',
      status: 'paid',
      payment: 'PIX',
      transactionId: 'PIX2024012801'
    },
    {
      id: 6,
      item: 'Smart TV 55"',
      buyer: 'Roberto Lima',
      value: 2500,
      date: '2024-01-30',
      status: 'processing',
      payment: 'Cartão Crédito 3x',
      transactionId: 'CC2024013001'
    },
    {
      id: 7,
      item: 'Cota de Lua de Mel - Maldivas',
      buyer: 'Fernanda Souza',
      value: 500,
      date: '2024-02-01',
      status: 'paid',
      payment: 'PIX',
      transactionId: 'PIX2024020101'
    },
    {
      id: 8,
      item: 'Kit Chá de Cozinha Premium',
      buyer: 'Lucas Almeida',
      value: 250,
      date: '2024-02-02',
      status: 'failed',
      payment: 'Cartão Crédito',
      transactionId: null
    }
  ]

  const stats = {
    totalReceived: 4180,
    pending: 180,
    processing: 2500,
    failed: 250,
    thisMonth: 3430,
    lastMonth: 750,
    growth: 357.3
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />
      case 'processing': return <Clock className="w-4 h-4 text-blue-600" />
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'failed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago'
      case 'pending': return 'Pendente'
      case 'processing': return 'Processando'
      case 'failed': return 'Falhou'
      default: return status
    }
  }

  const getPaymentIcon = (payment: string) => {
    if (payment.includes('PIX')) return <QrCode className="w-4 h-4 text-green-600" />
    if (payment.includes('Cartão')) return <CreditCard className="w-4 h-4 text-blue-600" />
    return <DollarSign className="w-4 h-4 text-gray-600" />
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recebimentos</h1>
            <p className="text-gray-600 dark:text-gray-400">Acompanhe os pagamentos da lista de presentes</p>
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
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <span className="text-xs text-green-600 font-medium">85%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            R$ {stats.totalReceived.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Recebido</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-yellow-500" />
            <span className="text-xs text-yellow-600 font-medium">3%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            R$ {stats.pending.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Pendente</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-blue-500" />
            <span className="text-xs text-blue-600 font-medium">10%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            R$ {stats.processing.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Processando</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-orange-500" />
            <span className="text-xs text-orange-600 font-medium">+{stats.growth}%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            R$ {stats.thisMonth.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Este Mês</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Todos os Status</option>
            <option value="paid">Pagos</option>
            <option value="pending">Pendentes</option>
            <option value="processing">Processando</option>
            <option value="failed">Falhados</option>
          </select>
          
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="today">Hoje</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
            <option value="year">Este Ano</option>
            <option value="all">Todos</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Data</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Item</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Comprador</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Valor</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Pagamento</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">ID Transação</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {receivables.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {new Date(item.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.item}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{item.buyer}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      R$ {item.value.toLocaleString('pt-BR')}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {getPaymentIcon(item.payment)}
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.payment}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {item.transactionId ? (
                      <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {item.transactionId}
                      </code>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                        <Receipt className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Métodos de Pagamento</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <QrCode className="w-6 h-6 text-green-500" />
                <span className="font-medium text-gray-900 dark:text-white">PIX</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">R$ 1.800</p>
                <p className="text-xs text-gray-500">4 transações</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-500" />
                <span className="font-medium text-gray-900 dark:text-white">Cartão</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">R$ 3.200</p>
                <p className="text-xs text-gray-500">3 transações</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Compradores</h3>
          <div className="space-y-3">
            {['Maria Silva', 'Roberto Lima', 'João Santos'].map((buyer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-600">#{index + 1}</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{buyer}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    R$ {index === 0 ? '500' : index === 1 ? '2.500' : '250'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
