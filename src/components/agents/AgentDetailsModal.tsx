'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Bot, 
  User, 
  Calendar, 
  Edit3,
  Brain,
  Activity,
  AlertTriangle,
  TrendingUp,
  Clock,
  MessageSquare,
  Target,
  Zap,
  Users,
  Play,
  BarChart3,
  Code,
  Settings
} from 'lucide-react'

interface AgentDetailsModalProps {
  agent: any
  onClose: () => void
  onEdit?: () => void
  onActivation?: () => void
}

export const AgentDetailsModal: React.FC<AgentDetailsModalProps> = ({
  agent,
  onClose,
  onEdit,
  onActivation
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'integrations' | 'prompt'>('overview')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-BR')
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
        return { label: 'GPT-3.5 Turbo', color: 'text-blue-600' }
      case 'claude-3':
        return { label: 'Claude 3', color: 'text-orange-600' }
      default:
        return { label: 'Modelo', color: 'text-gray-600' }
    }
  }

  const statusConfig = getStatusConfig(agent.status)
  const modelConfig = getModelConfig(agent.model)
  const activeIntegrations = Object.values(agent.integrations).filter((int: any) => int.active).length

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${statusConfig.bg} rounded-xl flex items-center justify-center shadow-sm`}>
                  <statusConfig.icon className={`w-6 h-6 ${statusConfig.color}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {agent.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 ${modelConfig.color}`}>
                      {modelConfig.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onEdit && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onEdit()
                      handleClose()
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    <Edit3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {[
                { id: 'overview', label: 'Visão Geral', icon: Bot },
                { id: 'performance', label: 'Performance', icon: BarChart3 },
                { id: 'integrations', label: 'Integrações', icon: Settings },
                { id: 'prompt', label: 'Prompt', icon: Code }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50 dark:bg-orange-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Descrição */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Descrição
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                      <p className="text-gray-700 dark:text-gray-300">
                        {agent.description}
                      </p>
                    </div>
                  </div>

                  {/* Performance Resumida */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-700 dark:text-blue-300">Interações</span>
                      </div>
                      <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                        {agent.usage.totalInteractions.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-700 dark:text-green-300">Taxa Sucesso</span>
                      </div>
                      <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                        {agent.usage.successRate}%
                      </p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-purple-700 dark:text-purple-300">Tempo Médio</span>
                      </div>
                      <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                        {agent.usage.avgResponseTime}s
                      </p>
                    </div>
                  </div>

                  {/* Integrações Ativas */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Integrações Ativas ({activeIntegrations}/3)
                    </h3>
                    <div className="flex gap-4">
                      {agent.integrations.chat.active && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg">
                          <MessageSquare className="w-4 h-4" />
                          Chat
                        </div>
                      )}
                      {agent.integrations.kanban.active && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg">
                          <Target className="w-4 h-4" />
                          Kanban
                        </div>
                      )}
                      {agent.integrations.columns.active && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg">
                          <Zap className="w-4 h-4" />
                          Colunas
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === 'performance' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Métricas de Performance
                    </h4>
                    <div className="h-48 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        📊 Gráficos de performance seriam implementados aqui
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Integrations Tab */}
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Chat */}
                    <div className={`p-6 rounded-xl border-2 ${
                      agent.integrations.chat.active 
                        ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
                    }`}>
                      <div className="flex items-center gap-3 mb-4">
                        <MessageSquare className="w-8 h-8 text-blue-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Chat</h4>
                          <p className="text-sm text-blue-600">
                            {agent.integrations.chat.active ? 'Ativo' : 'Inativo'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Kanban */}
                    <div className={`p-6 rounded-xl border-2 ${
                      agent.integrations.kanban.active 
                        ? 'border-purple-200 bg-purple-50 dark:bg-purple-900/20' 
                        : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
                    }`}>
                      <div className="flex items-center gap-3 mb-4">
                        <Target className="w-8 h-8 text-purple-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Kanban</h4>
                          <p className="text-sm text-purple-600">
                            {agent.integrations.kanban.active ? 'Ativo' : 'Inativo'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Columns */}
                    <div className={`p-6 rounded-xl border-2 ${
                      agent.integrations.columns.active 
                        ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                        : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
                    }`}>
                      <div className="flex items-center gap-3 mb-4">
                        <Zap className="w-8 h-8 text-green-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Colunas</h4>
                          <p className="text-sm text-green-600">
                            {agent.integrations.columns.active ? 'Ativo' : 'Inativo'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Prompt Tab */}
              {activeTab === 'prompt' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Prompt do Agente
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                      <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                        {agent.prompt}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (onEdit) {
                      onEdit()
                      handleClose()
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar Agente
                </motion.button>
                
                {agent.status === 'active' && onActivation && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onActivation()
                      handleClose()
                    }}
                    className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Gerenciar Ativação
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
