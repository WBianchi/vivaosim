'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronUp, 
  ChevronDown,
  Eye,
  Edit3,
  Play,
  MoreVertical,
  Bot,
  Activity,
  Brain,
  AlertTriangle,
  TrendingUp,
  Clock,
  MessageSquare,
  Target,
  Zap,
  Users
} from 'lucide-react'

interface AgentsTableProps {
  agents: any[]
  onAgentSelect: (agent: any) => void
  onActivationRequest: (agent: any) => void
}

type SortField = 'name' | 'model' | 'niche' | 'status' | 'usage' | 'successRate' | 'createdAt'
type SortDirection = 'asc' | 'desc'

export const AgentsTable: React.FC<AgentsTableProps> = ({
  agents,
  onAgentSelect,
  onActivationRequest
}) => {
  const [sortField, setSortField] = useState<SortField>('usage')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedAgents = [...agents].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'model':
        aValue = a.model.toLowerCase()
        bValue = b.model.toLowerCase()
        break
      case 'niche':
        aValue = a.niche.toLowerCase()
        bValue = b.niche.toLowerCase()
        break
      case 'status':
        aValue = a.status
        bValue = b.status
        break
      case 'usage':
        aValue = a.usage.totalInteractions
        bValue = b.usage.totalInteractions
        break
      case 'successRate':
        aValue = a.usage.successRate
        bValue = b.usage.successRate
        break
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
        break
      default:
        return 0
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1
    }
    return 0
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          label: 'Ativo',
          icon: Activity,
          color: 'text-green-600',
          bg: 'bg-green-100'
        }
      case 'inactive':
        return {
          label: 'Inativo',
          icon: Bot,
          color: 'text-gray-600',
          bg: 'bg-gray-100'
        }
      case 'training':
        return {
          label: 'Em Treinamento',
          icon: Brain,
          color: 'text-blue-600',
          bg: 'bg-blue-100'
        }
      case 'error':
        return {
          label: 'Com Erro',
          icon: AlertTriangle,
          color: 'text-red-600',
          bg: 'bg-red-100'
        }
      default:
        return {
          label: 'Desconhecido',
          icon: Bot,
          color: 'text-gray-600',
          bg: 'bg-gray-100'
        }
    }
  }

  const getModelConfig = (model: string) => {
    switch (model) {
      case 'gpt-4':
        return { label: 'GPT-4', color: 'text-purple-600' }
      case 'gpt-3.5-turbo':
        return { label: 'GPT-3.5', color: 'text-blue-600' }
      case 'claude-3':
        return { label: 'Claude 3', color: 'text-orange-600' }
      case 'claude-2':
        return { label: 'Claude 2', color: 'text-orange-600' }
      case 'gemini-pro':
        return { label: 'Gemini Pro', color: 'text-green-600' }
      case 'custom':
        return { label: 'Customizado', color: 'text-indigo-600' }
      default:
        return { label: 'Modelo', color: 'text-gray-600' }
    }
  }

  const getNicheConfig = (niche: string) => {
    switch (niche) {
      case 'vendas':
        return { label: 'Vendas', color: 'text-green-600' }
      case 'suporte':
        return { label: 'Suporte', color: 'text-blue-600' }
      case 'marketing':
        return { label: 'Marketing', color: 'text-purple-600' }
      case 'juridico':
        return { label: 'Jurídico', color: 'text-red-600' }
      case 'financeiro':
        return { label: 'Financeiro', color: 'text-yellow-600' }
      case 'rh':
        return { label: 'RH', color: 'text-pink-600' }
      case 'ti':
        return { label: 'TI', color: 'text-indigo-600' }
      default:
        return { label: 'Geral', color: 'text-gray-600' }
    }
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600'
    if (rate >= 75) return 'text-yellow-600'
    if (rate >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-orange-600 transition-colors"
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? 
          <ChevronUp className="w-4 h-4" /> : 
          <ChevronDown className="w-4 h-4" />
      )}
    </button>
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="name">Agente</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="model">Modelo</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="niche">Nicho</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="status">Status</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="usage">Performance</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                Integrações
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                Usuários
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="createdAt">Criado</SortButton>
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {sortedAgents.map((agent, index) => {
              const statusConfig = getStatusConfig(agent.status)
              const modelConfig = getModelConfig(agent.model)
              const nicheConfig = getNicheConfig(agent.niche)
              const isActive = agent.status === 'active'
              const hasError = agent.status === 'error'
              const activeIntegrations = Object.values(agent.integrations).filter((int: any) => int.active).length

              return (
                <motion.tr
                  key={agent.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                    hasError ? 'bg-red-50 dark:bg-red-900/10' : ''
                  }`}
                  onClick={() => onAgentSelect(agent)}
                >
                  {/* Agente */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${statusConfig.bg} rounded-lg flex items-center justify-center`}>
                        <statusConfig.icon className={`w-5 h-5 ${statusConfig.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                          {agent.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                          {agent.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Modelo */}
                  <td className="px-6 py-4">
                    <span className={`font-medium ${modelConfig.color}`}>
                      {modelConfig.label}
                    </span>
                  </td>

                  {/* Nicho */}
                  <td className="px-6 py-4">
                    <span className={`font-medium ${nicheConfig.color}`}>
                      {nicheConfig.label}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      <statusConfig.icon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                  </td>

                  {/* Performance */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {agent.usage.totalInteractions.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">interações</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${getSuccessRateColor(agent.usage.successRate)}`}>
                          {agent.usage.successRate}%
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">sucesso</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-gray-600" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {agent.usage.avgResponseTime}s
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Integrações */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                        {activeIntegrations}/3
                      </span>
                      {agent.integrations.chat.active && (
                        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center" title="Chat">
                          <MessageSquare className="w-3 h-3 text-blue-600" />
                        </div>
                      )}
                      {agent.integrations.kanban.active && (
                        <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center" title="Kanban">
                          <Target className="w-3 h-3 text-purple-600" />
                        </div>
                      )}
                      {agent.integrations.columns.active && (
                        <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center" title="Colunas">
                          <Zap className="w-3 h-3 text-green-600" />
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Usuários */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {agent.userTypes.map((type: string) => (
                        <span
                          key={type}
                          className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs"
                        >
                          {type === 'atendentes' ? 'Atendentes' : type === 'admin' ? 'Admin' : 'Assinantes'}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Criado */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDate(agent.createdAt)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                          {agent.createdBy.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {agent.createdBy.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Ações */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onAgentSelect(agent)
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </motion.button>

                      {isActive && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            onActivationRequest(agent)
                          }}
                          className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                          title="Ativar agente"
                        >
                          <Play className="w-4 h-4 text-green-600" />
                        </motion.button>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('✏️ Editar agente:', agent.id)
                        }}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Editar agente"
                      >
                        <Edit3 className="w-4 h-4 text-blue-600" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('⚙️ Mais opções:', agent.id)
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        title="Mais opções"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
