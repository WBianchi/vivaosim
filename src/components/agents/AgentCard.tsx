'use client'

import { motion } from 'framer-motion'
import { 
  Bot, 
  Brain, 
  Activity, 
  Users, 
  MessageSquare,
  Target,
  Zap,
  Eye,
  Edit3,
  Trash2,
  Play,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface AgentCardProps {
  agent: any
  index: number
  onClick: () => void
  onActivationRequest: () => void
  onEdit?: (agent: any) => void
  onDelete?: (agentId: string) => void
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  index,
  onClick,
  onActivationRequest,
  onEdit,
  onDelete
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const formatRelativeTime = (date: string) => {
    const now = new Date()
    const agentDate = new Date(date)
    const diffTime = Math.abs(now.getTime() - agentDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Hoje'
    if (diffDays === 2) return 'Ontem'
    if (diffDays <= 7) return `${diffDays - 1} dias atrás`
    return formatDate(date)
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          label: 'Ativo',
          icon: Activity,
          color: 'text-green-600',
          bg: 'bg-green-100',
          border: 'border-green-200'
        }
      case 'inactive':
        return {
          label: 'Inativo',
          icon: Bot,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          border: 'border-gray-200'
        }
      case 'training':
        return {
          label: 'Em Treinamento',
          icon: Brain,
          color: 'text-blue-600',
          bg: 'bg-blue-100',
          border: 'border-blue-200'
        }
      case 'error':
        return {
          label: 'Com Erro',
          icon: AlertTriangle,
          color: 'text-red-600',
          bg: 'bg-red-100',
          border: 'border-red-200'
        }
      default:
        return {
          label: 'Desconhecido',
          icon: Bot,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          border: 'border-gray-200'
        }
    }
  }

  const getModelConfig = (model: string) => {
    switch (model) {
      case 'gpt-4':
        return { label: 'GPT-4', color: 'text-purple-600', bg: 'bg-purple-100' }
      case 'gpt-3.5-turbo':
        return { label: 'GPT-3.5', color: 'text-blue-600', bg: 'bg-blue-100' }
      case 'claude-3':
        return { label: 'Claude 3', color: 'text-orange-600', bg: 'bg-orange-100' }
      case 'claude-2':
        return { label: 'Claude 2', color: 'text-orange-600', bg: 'bg-orange-100' }
      case 'gemini-pro':
        return { label: 'Gemini Pro', color: 'text-green-600', bg: 'bg-green-100' }
      case 'custom':
        return { label: 'Customizado', color: 'text-indigo-600', bg: 'bg-indigo-100' }
      default:
        return { label: 'Modelo', color: 'text-gray-600', bg: 'bg-gray-100' }
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

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'assistant':
        return { label: 'Assistente', icon: Bot }
      case 'consultant':
        return { label: 'Consultor', icon: Brain }
      case 'specialist':
        return { label: 'Especialista', icon: Target }
      case 'analyst':
        return { label: 'Analista', icon: TrendingUp }
      case 'advisor':
        return { label: 'Conselheiro', icon: CheckCircle }
      case 'moderator':
        return { label: 'Moderador', icon: Users }
      default:
        return { label: 'Função', icon: Bot }
    }
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600'
    if (rate >= 75) return 'text-yellow-600'
    if (rate >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const statusConfig = getStatusConfig(agent.status)
  const modelConfig = getModelConfig(agent.model)
  const nicheConfig = getNicheConfig(agent.niche)
  const roleConfig = getRoleConfig(agent.role)

  const isActive = agent.status === 'active'
  const hasError = agent.status === 'error'
  const activeIntegrations = Object.values(agent.integrations).filter((int: any) => int.active).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 ${statusConfig.border} hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group ${
        hasError ? 'ring-2 ring-red-200 dark:ring-red-800' : ''
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${statusConfig.bg} flex items-center justify-center shadow-sm`}>
              <statusConfig.icon className={`w-6 h-6 ${statusConfig.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-1">
                {agent.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 ${statusConfig.bg} ${statusConfig.color} rounded-full text-xs font-medium`}>
                  {statusConfig.label}
                </span>
                <span className={`px-2 py-0.5 ${modelConfig.bg} ${modelConfig.color} rounded-full text-xs font-medium`}>
                  {modelConfig.label}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(agent)
                }}
                className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                title="Editar agente"
              >
                <Edit3 className="w-4 h-4" />
              </motion.button>
            )}
            {onDelete && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(agent.id)
                }}
                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                title="Excluir agente"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Nicho e Função */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 ${nicheConfig.color} rounded-lg text-xs font-medium`}>
            <Target className="w-3 h-3" />
            {nicheConfig.label}
          </span>
          <span className={`flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-medium`}>
            <roleConfig.icon className="w-3 h-3" />
            {roleConfig.label}
          </span>
        </div>

        {/* Descrição */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {agent.description}
        </p>

        {/* Estatísticas de Performance */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-gray-600" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Interações</span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {agent.usage.totalInteractions.toLocaleString()}
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="w-3 h-3 text-gray-600" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Taxa Sucesso</span>
              </div>
              <p className={`text-lg font-bold ${getSuccessRateColor(agent.usage.successRate)}`}>
                {agent.usage.successRate}%
              </p>
            </div>
          </div>
        </div>

        {/* Tempo de Resposta */}
        <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Tempo Médio de Resposta
            </span>
          </div>
          <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
            {agent.usage.avgResponseTime}s
          </span>
        </div>

        {/* Tipos de Usuário */}
        <div className="mb-4">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Disponível para:</p>
          <div className="flex flex-wrap gap-1">
            {agent.userTypes.map((type: string) => (
              <span
                key={type}
                className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs"
              >
                {type === 'atendentes' ? 'Atendentes' : type === 'admin' ? 'Admin' : 'Assinantes'}
              </span>
            ))}
          </div>
        </div>

        {/* Integrações Ativas */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-600 dark:text-gray-400">Integrações Ativas:</p>
            <span className="text-xs font-medium text-gray-900 dark:text-white">
              {activeIntegrations}/3
            </span>
          </div>
          <div className="flex gap-2">
            {agent.integrations.chat.active && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                <MessageSquare className="w-3 h-3" />
                Chat
              </div>
            )}
            {agent.integrations.kanban.active && (
              <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                <Target className="w-3 h-3" />
                Kanban
              </div>
            )}
            {agent.integrations.columns.active && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                <Zap className="w-3 h-3" />
                Colunas
              </div>
            )}
          </div>
        </div>

        {/* Última Utilização */}
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Último uso: {formatRelativeTime(agent.usage.lastUsed)}
          </span>
        </div>

        {/* Criador */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
            {agent.createdBy.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Criado por {agent.createdBy.name}
          </span>
        </div>

        {/* Alerta para agentes com erro */}
        {hasError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700 dark:text-red-300 font-medium">
                Agente com Problemas - Verificar Configuração
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 pb-6">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
            className="flex-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-3 h-3" />
            Ver Detalhes
          </motion.button>
          
          {isActive && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation()
                onActivationRequest()
              }}
              className="px-3 py-2 border border-green-300 hover:bg-green-50 text-green-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-3 h-3" />
              Ativar
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
