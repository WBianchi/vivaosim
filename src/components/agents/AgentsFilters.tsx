'use client'

import { motion } from 'framer-motion'
import { 
  Filter, 
  Bot, 
  Activity, 
  Users, 
  MessageSquare,
  Zap,
  Brain,
  Target,
  Shield,
  Eye
} from 'lucide-react'

interface FiltersProps {
  filters: {
    status: string
    model: string
    niche: string
    role: string
    userType: string
    activationMode: string
  }
  onFiltersChange: (filters: any) => void
}

export const AgentsFilters: React.FC<FiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const statusOptions = [
    { value: 'all', label: 'Todos os Status', icon: Eye, color: 'text-gray-600' },
    { value: 'active', label: 'Ativo', icon: Activity, color: 'text-green-600' },
    { value: 'inactive', label: 'Inativo', icon: Bot, color: 'text-gray-600' },
    { value: 'training', label: 'Em Treinamento', icon: Brain, color: 'text-blue-600' },
    { value: 'error', label: 'Com Erro', icon: Shield, color: 'text-red-600' }
  ]

  const modelOptions = [
    { value: 'all', label: 'Todos os Modelos' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'claude-3', label: 'Claude 3' },
    { value: 'claude-2', label: 'Claude 2' },
    { value: 'gemini-pro', label: 'Gemini Pro' },
    { value: 'custom', label: 'Modelo Customizado' }
  ]

  const nicheOptions = [
    { value: 'all', label: 'Todos os Nichos' },
    { value: 'vendas', label: 'Vendas' },
    { value: 'suporte', label: 'Suporte' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'juridico', label: 'Jurídico' },
    { value: 'financeiro', label: 'Financeiro' },
    { value: 'rh', label: 'Recursos Humanos' },
    { value: 'ti', label: 'Tecnologia' },
    { value: 'geral', label: 'Geral' }
  ]

  const roleOptions = [
    { value: 'all', label: 'Todas as Funções' },
    { value: 'assistant', label: 'Assistente' },
    { value: 'consultant', label: 'Consultor' },
    { value: 'specialist', label: 'Especialista' },
    { value: 'analyst', label: 'Analista' },
    { value: 'advisor', label: 'Conselheiro' },
    { value: 'moderator', label: 'Moderador' }
  ]

  const userTypeOptions = [
    { value: 'all', label: 'Todos os Tipos' },
    { value: 'atendentes', label: 'Atendentes' },
    { value: 'admin', label: 'Administradores' },
    { value: 'assinante', label: 'Assinantes' }
  ]

  const activationModeOptions = [
    { value: 'all', label: 'Todos os Modos' },
    { value: 'chat', label: 'Chat' },
    { value: 'kanban', label: 'Kanban' },
    { value: 'columns', label: 'Colunas do Kanban' }
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
      model: 'all',
      niche: 'all',
      role: 'all',
      userType: 'all',
      activationMode: 'all'
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
            Filtros
          </h3>
          {hasActiveFilters && (
            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
              Ativos
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Modelo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Modelo IA
          </label>
          <select
            value={filters.model}
            onChange={(e) => updateFilters('model', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {modelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Nicho */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nicho
          </label>
          <select
            value={filters.niche}
            onChange={(e) => updateFilters('niche', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {nicheOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Função */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Função
          </label>
          <select
            value={filters.role}
            onChange={(e) => updateFilters('role', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de Usuário */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Usuários
          </label>
          <select
            value={filters.userType}
            onChange={(e) => updateFilters('userType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {userTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Modo de Ativação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ativação
          </label>
          <select
            value={filters.activationMode}
            onChange={(e) => updateFilters('activationMode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {activationModeOptions.map((option) => (
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
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <status.icon className={`w-3 h-3 ${status.color}`} />
              {status.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filtros por Modo de Ativação */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Modos de Ativação:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'chat', label: 'Chat', icon: MessageSquare, color: 'text-blue-600' },
            { value: 'kanban', label: 'Kanban', icon: Target, color: 'text-purple-600' },
            { value: 'columns', label: 'Colunas', icon: Zap, color: 'text-green-600' }
          ].map((mode) => (
            <motion.button
              key={mode.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('activationMode', mode.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.activationMode === mode.value
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <mode.icon className={`w-3 h-3 ${mode.color}`} />
              {mode.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filtros por Tipo de Usuário */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Tipos de Usuário:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'atendentes', label: 'Atendentes', color: 'text-blue-600' },
            { value: 'admin', label: 'Admin', color: 'text-red-600' },
            { value: 'assinante', label: 'Assinantes', color: 'text-green-600' }
          ].map((type) => (
            <motion.button
              key={type.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilters('userType', type.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.userType === type.value
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Users className={`w-3 h-3 ${type.color}`} />
              {type.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
