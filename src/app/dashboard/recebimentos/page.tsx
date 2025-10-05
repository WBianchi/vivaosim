'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, TrendingUp, Calendar, Filter,
  Download, Eye, CheckCircle, Clock, XCircle,
  CreditCard, QrCode, User, Package, Receipt, MessageSquare
} from 'lucide-react'

export default function RecebimentosClientePage() {
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPeriod, setFilterPeriod] = useState('month')
  const [receivables, setReceivables] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalReceived: 0,
    pending: 0,
    processing: 0,
    failed: 0,
    thisMonth: 0,
    lastMonth: 0,
    growth: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  useEffect(() => {
    fetchRecebimentos()
  }, [])

  const fetchRecebimentos = async () => {
    try {
      const response = await fetch('/api/recebimentos')
      const data = await response.json()
      
      if (data.success) {
        setReceivables(data.recebimentos)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Erro ao buscar recebimentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredReceivables = receivables.filter(item => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false
    return true
  })

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
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredReceivables.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    Nenhum recebimento encontrado
                  </td>
                </tr>
              ) : filteredReceivables.map((item) => (
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
                      <button 
                        onClick={() => setSelectedItem(item)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      {item.mensagem && (
                        <button 
                          onClick={() => setSelectedItem(item)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                          title="Ver mensagem"
                        >
                          <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </button>
                      )}
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" title="Recibo">
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

      {/* Modal de Detalhes */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Detalhes do Recebimento</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Item</label>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedItem.item}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Valor</label>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    R$ {selectedItem.value.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Comprador</label>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedItem.buyer}</p>
                  {selectedItem.buyerEmail && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedItem.buyerEmail}</p>
                  )}
                  {selectedItem.buyerPhone && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedItem.buyerPhone}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Data</label>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedItem.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Método de Pagamento</label>
                  <div className="flex items-center gap-2">
                    {getPaymentIcon(selectedItem.payment)}
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedItem.payment}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Status</label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedItem.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedItem.status)}`}>
                      {getStatusLabel(selectedItem.status)}
                    </span>
                  </div>
                </div>
              </div>

              {selectedItem.transactionId && (
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">ID da Transação</label>
                  <code className="block mt-1 text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded">
                    {selectedItem.transactionId}
                  </code>
                </div>
              )}

              {selectedItem.mensagem && (
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Mensagem do Comprador
                  </label>
                  <div className="mt-2 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-gray-900 dark:text-white italic">"{selectedItem.mensagem}"</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Fechar
              </button>
              <button className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <Receipt className="w-4 h-4" />
                Gerar Recibo
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
