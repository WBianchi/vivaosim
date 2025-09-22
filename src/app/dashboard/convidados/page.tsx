'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, UserPlus, Upload, Download, Send,
  Check, X, Clock, Filter, Search, Mail,
  Phone, MapPin, QrCode, Printer, Share2
} from 'lucide-react'

export default function ConvidadosClientePage() {
  const [activeTab, setActiveTab] = useState<'list' | 'tables' | 'statistics'>('list')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddGuest, setShowAddGuest] = useState(false)

  const guests = [
    {
      id: 1,
      name: 'Maria Silva',
      email: 'maria@email.com',
      phone: '(11) 98765-4321',
      status: 'confirmed',
      table: 5,
      companions: 2,
      dietary: 'Vegetariana'
    },
    {
      id: 2,
      name: 'João Santos',
      email: 'joao@email.com',
      phone: '(11) 91234-5678',
      status: 'pending',
      table: null,
      companions: 1,
      dietary: null
    },
    {
      id: 3,
      name: 'Ana Costa',
      email: 'ana@email.com',
      phone: '(11) 95555-5555',
      status: 'declined',
      table: null,
      companions: 0,
      dietary: null
    },
    {
      id: 4,
      name: 'Pedro Oliveira',
      email: 'pedro@email.com',
      phone: '(11) 94444-4444',
      status: 'confirmed',
      table: 3,
      companions: 3,
      dietary: 'Sem glúten'
    },
    {
      id: 5,
      name: 'Carla Mendes',
      email: 'carla@email.com',
      phone: '(11) 93333-3333',
      status: 'confirmed',
      table: 5,
      companions: 1,
      dietary: null
    }
  ]

  const tables = [
    { number: 1, capacity: 10, occupied: 8, guests: ['Família Silva', 'Família Costa'] },
    { number: 2, capacity: 10, occupied: 10, guests: ['Amigos do Trabalho'] },
    { number: 3, capacity: 8, occupied: 6, guests: ['Pedro Oliveira', 'Família Oliveira'] },
    { number: 4, capacity: 8, occupied: 4, guests: ['Primos'] },
    { number: 5, capacity: 10, occupied: 7, guests: ['Maria Silva', 'Carla Mendes', 'Outros'] },
    { number: 6, capacity: 6, occupied: 0, guests: [] },
  ]

  const statistics = {
    total: 150,
    confirmed: 98,
    pending: 42,
    declined: 10,
    confirmationRate: 65.3,
    averageCompanions: 1.8
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'declined': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado'
      case 'pending': return 'Pendente'
      case 'declined': return 'Recusou'
      default: return status
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Convidados</h1>
            <p className="text-gray-600 dark:text-gray-400">Gerencie a lista de convidados do seu evento</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Importar
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
            onClick={() => setShowAddGuest(true)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Adicionar
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.total}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 shadow-sm border border-green-200 dark:border-green-800"
        >
          <p className="text-2xl font-bold text-green-600">{statistics.confirmed}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Confirmados</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 shadow-sm border border-yellow-200 dark:border-yellow-800"
        >
          <p className="text-2xl font-bold text-yellow-600">{statistics.pending}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Pendentes</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 shadow-sm border border-red-200 dark:border-red-800"
        >
          <p className="text-2xl font-bold text-red-600">{statistics.declined}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Recusaram</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.confirmationRate}%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Taxa Confirmação</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.averageCompanions}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Média Acompanhantes</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-1 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'list'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Lista de Convidados
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'tables'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Organização de Mesas
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'statistics'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Estatísticas
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'list' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Filters */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar convidado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">Todos</option>
                <option value="confirmed">Confirmados</option>
                <option value="pending">Pendentes</option>
                <option value="declined">Recusaram</option>
              </select>
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Mais filtros
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Nome</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Contato</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Mesa</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Acompanhantes</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{guest.name}</p>
                        {guest.dietary && (
                          <p className="text-xs text-gray-500">{guest.dietary}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="w-3 h-3" />
                          {guest.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="w-3 h-3" />
                          {guest.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {guest.table ? (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium">
                          Mesa {guest.table}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900 dark:text-white">{guest.companions}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(guest.status)}`}>
                        {getStatusLabel(guest.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                          <Send className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                          <QrCode className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tables' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map((table, index) => (
            <motion.div
              key={table.number}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Mesa {table.number}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  table.occupied === table.capacity
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : table.occupied > 0
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {table.occupied}/{table.capacity}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {table.guests.length > 0 ? (
                  table.guests.map((guest, i) => (
                    <div key={i} className="text-sm text-gray-600 dark:text-gray-400">
                      • {guest}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">Mesa vazia</p>
                )}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm">
                  Editar
                </button>
                <button className="flex-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm">
                  Adicionar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'statistics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Confirmações por Período</h3>
            {/* Gráfico aqui */}
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-gray-400">Gráfico de confirmações</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Distribuição por Mesa</h3>
            {/* Gráfico aqui */}
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-gray-400">Gráfico de distribuição</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Guest */}
      {showAddGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Adicionar Convidado</h3>
            {/* Form aqui */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddGuest(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
                Adicionar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
