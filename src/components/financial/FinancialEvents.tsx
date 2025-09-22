'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, DollarSign, Users, MapPin, Clock, CheckCircle, AlertTriangle, TrendingUp, Edit3, Eye, Plus } from 'lucide-react'

interface FinancialEventsProps {
  selectedEvent: any
  onSelectEvent: (event: any) => void
}

export const FinancialEvents: React.FC<FinancialEventsProps> = ({ selectedEvent, onSelectEvent }) => {
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('cards')

  const events = [
    {
      id: '1',
      name: 'Casamento Silva & Costa',
      client: 'João Silva',
      date: '2024-02-15',
      venue: 'Espaço Celebration',
      guests: 150,
      status: 'active',
      budget: 45000,
      spent: 32500,
      revenue: 55000,
      profit: 22500,
      progress: 72,
      items: [
        { name: 'Decoração', budget: 8000, spent: 7500, status: 'completed' },
        { name: 'Buffet', budget: 15000, spent: 12000, status: 'in_progress' },
        { name: 'Som/Iluminação', budget: 5000, spent: 4800, status: 'completed' },
        { name: 'Fotografia', budget: 3500, spent: 3200, status: 'completed' },
        { name: 'Flores', budget: 4000, spent: 2500, status: 'in_progress' },
        { name: 'Convites', budget: 1500, spent: 1500, status: 'completed' },
        { name: 'Brindes', budget: 2000, spent: 1000, status: 'pending' }
      ]
    },
    {
      id: '2',
      name: 'Aniversário 15 Anos Maria',
      client: 'Ana Maria Santos',
      date: '2024-03-20',
      venue: 'Salão Diamante',
      guests: 200,
      status: 'planning',
      budget: 35000,
      spent: 8500,
      revenue: 42000,
      profit: 33500,
      progress: 24,
      items: [
        { name: 'Decoração', budget: 10000, spent: 2000, status: 'in_progress' },
        { name: 'Buffet', budget: 12000, spent: 3000, status: 'pending' },
        { name: 'DJ', budget: 2500, spent: 2500, status: 'completed' },
        { name: 'Vestido', budget: 5000, spent: 0, status: 'pending' },
        { name: 'Fotografia', budget: 3500, spent: 1000, status: 'in_progress' }
      ]
    },
    {
      id: '3',
      name: 'Formatura Turma 2024',
      client: 'Comissão de Formatura',
      date: '2024-04-10',
      venue: 'Centro de Convenções',
      guests: 500,
      status: 'completed',
      budget: 80000,
      spent: 78500,
      revenue: 95000,
      profit: 16500,
      progress: 100,
      items: [
        { name: 'Local', budget: 20000, spent: 20000, status: 'completed' },
        { name: 'Decoração', budget: 15000, spent: 14800, status: 'completed' },
        { name: 'Buffet', budget: 25000, spent: 24500, status: 'completed' },
        { name: 'Som/Iluminação', budget: 8000, spent: 7800, status: 'completed' },
        { name: 'Fotografia/Video', budget: 7000, spent: 6900, status: 'completed' },
        { name: 'Convites', budget: 3000, spent: 2800, status: 'completed' },
        { name: 'Lembranças', budget: 2000, spent: 1700, status: 'completed' }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'planning': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'completed': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getItemStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-600" />
      case 'pending': return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Controle Financeiro de Eventos
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded ${viewMode === 'cards' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
            >
              Lista
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium"
          >
            <Plus className="w-4 h-4" />
            Novo Evento
          </motion.button>
        </div>
      </div>

      {/* Lista de Eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Header do Card */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{event.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.client}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                  {event.status === 'active' ? 'Em Andamento' : event.status === 'planning' ? 'Planejamento' : 'Concluído'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  {new Date(event.date).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  {event.guests} convidados
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {event.venue}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <TrendingUp className="w-4 h-4" />
                  {event.progress}% concluído
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="mb-4">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${event.progress}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full ${event.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                  />
                </div>
              </div>

              {/* Métricas Financeiras */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Orçamento</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    R$ {event.budget.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Gasto</p>
                  <p className="text-lg font-bold text-orange-600">
                    R$ {event.spent.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Receita</p>
                  <p className="text-lg font-bold text-blue-600">
                    R$ {event.revenue.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Lucro</p>
                  <p className="text-lg font-bold text-green-600">
                    R$ {event.profit.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Lista de Itens */}
            <div className="p-6">
              <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Detalhamento de Custos</h5>
              <div className="space-y-2">
                {event.items.slice(0, 4).map((item) => (
                  <div key={item.name} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div className="flex items-center gap-2">
                      {getItemStatusIcon(item.status)}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        R$ {item.spent.toLocaleString()} / {item.budget.toLocaleString()}
                      </span>
                      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.spent > item.budget ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min((item.spent / item.budget) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {event.items.length > 4 && (
                  <p className="text-sm text-gray-500 text-center pt-2">
                    +{event.items.length - 4} itens
                  </p>
                )}
              </div>

              {/* Ações */}
              <div className="flex gap-2 mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectEvent(event)}
                  className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Ver Detalhes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
