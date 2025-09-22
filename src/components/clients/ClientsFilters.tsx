'use client'

import { motion } from 'framer-motion'
import { 
  Filter, 
  Users, 
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Building,
  User,
  Crown,
  MessageSquare,
  FileText,
  Calendar,
  DollarSign,
  Star
} from 'lucide-react'

interface FiltersProps {
  filters: {
    status: string
    type: string
    attendant: string
    priority: string
    source: string
    subscription: string
  }
  onFiltersChange: (filters: any) => void
}

export const ClientsFilters: React.FC<FiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const statusOptions = [
    { value: 'all', label: 'Todos os Status', icon: Users, color: 'text-gray-600' },
    { value: 'active', label: 'Ativo', icon: CheckCircle, color: 'text-green-600' },
    { value: 'inactive', label: 'Inativo', icon: XCircle, color: 'text-red-600' },
    { value: 'pending', label: 'Pendente', icon: Clock, color: 'text-yellow-600' },
    { value: 'blocked', label: 'Bloqueado', icon: AlertTriangle, color: 'text-red-600' }
  ]

  const typeOptions = [
    { value: 'all', label: 'Todos os Tipos' },
    { value: 'individual', label: 'Pessoa Física' },
    { value: 'company', label: 'Pessoa Jurídica' },
    { value: 'vip', label: 'Cliente VIP' },
    { value: 'prospect', label: 'Prospect' }
  ]

  const attendantOptions = [
    { value: 'all', label: 'Todos os Atendentes' },
    { value: 'ana-silva', label: 'Ana Silva' },
    { value: 'carlos-oliveira', label: 'Carlos Oliveira' },
    { value: 'mariana-santos', label: 'Mariana Santos' },
    { value: 'rafael-costa', label: 'Rafael Costa' },
    { value: 'fernanda-lima', label: 'Fernanda Lima' },
    { value: 'unassigned', label: 'Sem Atendente' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'Todas as Prioridades' },
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
    { value: 'urgent', label: 'Urgente' }
  ]

  const sourceOptions = [
    { value: 'all', label: 'Todas as Origens' },
    { value: 'website', label: 'Website' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'google', label: 'Google Ads' },
    { value: 'referral', label: 'Indicação' },
    { value: 'phone', label: 'Telefone' },
    { value: 'email', label: 'Email' }
  ]

  const subscriptionOptions = [
    { value: 'all', label: 'Todas as Assinaturas' },
    { value: 'active', label: 'Assinatura Ativa' },
    { value: 'expired', label: 'Assinatura Expirada' },
    { value: 'trial', label: 'Período de Teste' },
    { value: 'cancelled', label: 'Cancelada' },
    { value: 'none', label: 'Sem Assinatura' }
  ]

  const updateFilters = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      status: 'all',
      type: 'all',
      attendant: 'all',
      priority: 'all',
      source: 'all',
      subscription: 'all'
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== 'all' && value !== ''
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Filtros de Clientes
          </h3>
          {hasActiveFilters && (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
              Ativos
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            Limpar filtros
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => updateFilters('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de Cliente
          </label>
          <select
            value={filters.type}
            onChange={(e) => updateFilters('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Atendente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Atendente Responsável
          </label>
          <select
            value={filters.attendant}
            onChange={(e) => updateFilters('attendant', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {attendantOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Prioridade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prioridade
          </label>
          <select
            value={filters.priority}
            onChange={(e) => updateFilters('priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Origem */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Origem
          </label>
          <select
            value={filters.source}
            onChange={(e) => updateFilters('source', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {sourceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Assinatura */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Assinatura
          </label>
          <select
            value={filters.subscription}
            onChange={(e) => updateFilters('subscription', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {subscriptionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtros Rápidos por Status */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Status Rápidos:
        </p>
        <div className="flex flex-wrap gap-2">
          {statusOptions.slice(1).map((status) => (
            <motion.button
              key={status.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('status', status.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.status === status.value
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <status.icon className={`w-3 h-3 ${status.color}`} />
              {status.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filtros por Tipo de Cliente */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Tipos de Cliente:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'individual', label: 'Pessoa Física', icon: User, color: 'text-blue-600' },
            { value: 'company', label: 'Empresa', icon: Building, color: 'text-purple-600' },
            { value: 'vip', label: 'VIP', icon: Crown, color: 'text-yellow-600' },
            { value: 'prospect', label: 'Prospect', icon: Star, color: 'text-orange-600' }
          ].map((type) => (
            <motion.button
              key={type.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('type', type.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.type === type.value
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <type.icon className={`w-3 h-3 ${type.color}`} />
              {type.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filtros por Prioridade */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Prioridades:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'low', label: 'Baixa', color: 'text-gray-600' },
            { value: 'medium', label: 'Média', color: 'text-blue-600' },
            { value: 'high', label: 'Alta', color: 'text-orange-600' },
            { value: 'urgent', label: 'Urgente', color: 'text-red-600' }
          ].map((priority) => (
            <motion.button
              key={priority.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('priority', priority.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.priority === priority.value
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                priority.value === 'low' ? 'bg-gray-500' :
                priority.value === 'medium' ? 'bg-blue-500' :
                priority.value === 'high' ? 'bg-orange-500' : 'bg-red-500'
              }`} />
              {priority.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filtros por Origem */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Principais Origens:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'website', label: 'Website', icon: MessageSquare, color: 'text-blue-600' },
            { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, color: 'text-green-600' },
            { value: 'google', label: 'Google Ads', icon: DollarSign, color: 'text-red-600' },
            { value: 'referral', label: 'Indicação', icon: Users, color: 'text-purple-600' }
          ].map((source) => (
            <motion.button
              key={source.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('source', source.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.source === source.value
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <source.icon className={`w-3 h-3 ${source.color}`} />
              {source.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filtros por Assinatura */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Status da Assinatura:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'active', label: 'Ativa', color: 'text-green-600' },
            { value: 'trial', label: 'Teste', color: 'text-blue-600' },
            { value: 'expired', label: 'Expirada', color: 'text-orange-600' },
            { value: 'cancelled', label: 'Cancelada', color: 'text-red-600' }
          ].map((sub) => (
            <motion.button
              key={sub.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('subscription', sub.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.subscription === sub.value
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                sub.value === 'active' ? 'bg-green-500' :
                sub.value === 'trial' ? 'bg-blue-500' :
                sub.value === 'expired' ? 'bg-orange-500' : 'bg-red-500'
              }`} />
              {sub.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
