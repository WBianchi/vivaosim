'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Play, 
  Pause,
  MessageSquare,
  Target,
  Zap,
  Settings,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'

interface AgentActivationModalProps {
  agent: any
  onClose: () => void
  onSave: (activationData: any) => void
}

export const AgentActivationModal: React.FC<AgentActivationModalProps> = ({
  agent,
  onClose,
  onSave
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activationData, setActivationData] = useState({
    chat: {
      active: agent.integrations.chat.active || false,
      autoResponse: agent.integrations.chat.config?.autoResponse || false,
      priority: agent.integrations.chat.config?.priority || 'medium',
      responseDelay: agent.integrations.chat.config?.responseDelay || 1
    },
    kanban: {
      active: agent.integrations.kanban.active || false,
      columns: agent.integrations.kanban.config?.columns || [],
      autoMove: agent.integrations.kanban.config?.autoMove || false,
      triggerConditions: agent.integrations.kanban.config?.triggerConditions || []
    },
    columns: {
      active: agent.integrations.columns.active || false,
      columnIds: agent.integrations.columns.config?.columnIds || [],
      autoAssign: agent.integrations.columns.config?.autoAssign || false,
      priority: agent.integrations.columns.config?.priority || 'normal'
    }
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('⚡ Salvando configurações de ativação:', activationData)
    onSave(activationData)
    handleClose()
  }

  const updateIntegration = (integration: string, key: string, value: any) => {
    setActivationData(prev => ({
      ...prev,
      [integration]: {
        ...prev[integration as keyof typeof prev],
        [key]: value
      }
    }))
  }

  const toggleIntegration = (integration: string) => {
    setActivationData(prev => ({
      ...prev,
      [integration]: {
        ...prev[integration as keyof typeof prev],
        active: !prev[integration as keyof typeof prev].active
      }
    }))
  }

  const addKanbanColumn = () => {
    const newColumn = prompt('Nome da coluna do Kanban:')
    if (newColumn && newColumn.trim()) {
      setActivationData(prev => ({
        ...prev,
        kanban: {
          ...prev.kanban,
          columns: [...prev.kanban.columns, newColumn.trim()]
        }
      }))
    }
  }

  const removeKanbanColumn = (index: number) => {
    setActivationData(prev => ({
      ...prev,
      kanban: {
        ...prev.kanban,
        columns: prev.kanban.columns.filter((_, i) => i !== index)
      }
    }))
  }

  const addColumnId = () => {
    const newColumnId = prompt('ID da coluna:')
    if (newColumnId && newColumnId.trim()) {
      setActivationData(prev => ({
        ...prev,
        columns: {
          ...prev.columns,
          columnIds: [...prev.columns.columnIds, newColumnId.trim()]
        }
      }))
    }
  }

  const removeColumnId = (index: number) => {
    setActivationData(prev => ({
      ...prev,
      columns: {
        ...prev.columns,
        columnIds: prev.columns.columnIds.filter((_, i) => i !== index)
      }
    }))
  }

  const activeIntegrationsCount = [
    activationData.chat.active,
    activationData.kanban.active,
    activationData.columns.active
  ].filter(Boolean).length

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
            className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
                  <Play className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Ativação do Agente
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Configure onde e como o agente "{agent.name}" será ativado
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activeIntegrationsCount}/3 Ativas
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Integrações configuradas
                  </p>
                </div>
                
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-8">
                {/* Chat Integration */}
                <div className={`p-6 rounded-2xl border-2 transition-all ${
                  activationData.chat.active 
                    ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activationData.chat.active ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <MessageSquare className={`w-5 h-5 ${
                          activationData.chat.active ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Integração com Chat
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Ative o agente para responder automaticamente em conversas
                        </p>
                      </div>
                    </div>
                    
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleIntegration('chat')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        activationData.chat.active
                          ? 'bg-blue-500 hover:bg-blue-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      {activationData.chat.active ? (
                        <>
                          <Pause className="w-4 h-4" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Ativar
                        </>
                      )}
                    </motion.button>
                  </div>

                  {activationData.chat.active && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Resposta Automática
                        </label>
                        <select
                          value={activationData.chat.autoResponse ? 'true' : 'false'}
                          onChange={(e) => updateIntegration('chat', 'autoResponse', e.target.value === 'true')}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="true">Ativada</option>
                          <option value="false">Desativada</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Prioridade
                        </label>
                        <select
                          value={activationData.chat.priority}
                          onChange={(e) => updateIntegration('chat', 'priority', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="low">Baixa</option>
                          <option value="medium">Média</option>
                          <option value="high">Alta</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Delay de Resposta (segundos)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          value={activationData.chat.responseDelay}
                          onChange={(e) => updateIntegration('chat', 'responseDelay', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Kanban Integration */}
                <div className={`p-6 rounded-2xl border-2 transition-all ${
                  activationData.kanban.active 
                    ? 'border-purple-200 bg-purple-50 dark:bg-purple-900/20' 
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activationData.kanban.active ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        <Target className={`w-5 h-5 ${
                          activationData.kanban.active ? 'text-purple-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Integração com Kanban
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Ative o agente para atuar em quadros Kanban específicos
                        </p>
                      </div>
                    </div>
                    
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleIntegration('kanban')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        activationData.kanban.active
                          ? 'bg-purple-500 hover:bg-purple-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      {activationData.kanban.active ? (
                        <>
                          <Pause className="w-4 h-4" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Ativar
                        </>
                      )}
                    </motion.button>
                  </div>

                  {activationData.kanban.active && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Colunas do Kanban
                          </label>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={addKanbanColumn}
                            className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm transition-colors"
                          >
                            Adicionar Coluna
                          </motion.button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {activationData.kanban.columns.map((column, index) => (
                            <span
                              key={index}
                              className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                            >
                              {column}
                              <button
                                type="button"
                                onClick={() => removeKanbanColumn(index)}
                                className="hover:text-purple-900"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={activationData.kanban.autoMove}
                            onChange={(e) => updateIntegration('kanban', 'autoMove', e.target.checked)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Mover cards automaticamente entre colunas
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Columns Integration */}
                <div className={`p-6 rounded-2xl border-2 transition-all ${
                  activationData.columns.active 
                    ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activationData.columns.active ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Zap className={`w-5 h-5 ${
                          activationData.columns.active ? 'text-green-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Integração com Colunas Específicas
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Ative o agente apenas em colunas específicas do Kanban
                        </p>
                      </div>
                    </div>
                    
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleIntegration('columns')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        activationData.columns.active
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      {activationData.columns.active ? (
                        <>
                          <Pause className="w-4 h-4" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Ativar
                        </>
                      )}
                    </motion.button>
                  </div>

                  {activationData.columns.active && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            IDs das Colunas
                          </label>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={addColumnId}
                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition-colors"
                          >
                            Adicionar ID
                          </motion.button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {activationData.columns.columnIds.map((columnId, index) => (
                            <span
                              key={index}
                              className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-mono"
                            >
                              {columnId}
                              <button
                                type="button"
                                onClick={() => removeColumnId(index)}
                                className="hover:text-green-900"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={activationData.columns.autoAssign}
                              onChange={(e) => updateIntegration('columns', 'autoAssign', e.target.checked)}
                              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Atribuição automática de cards
                            </span>
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Prioridade
                          </label>
                          <select
                            value={activationData.columns.priority}
                            onChange={(e) => updateIntegration('columns', 'priority', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="low">Baixa</option>
                            <option value="normal">Normal</option>
                            <option value="high">Alta</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Resumo */}
                <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                      Resumo da Configuração
                    </h3>
                  </div>
                  
                  <div className="space-y-2 text-sm text-orange-700 dark:text-orange-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        {activeIntegrationsCount} integração{activeIntegrationsCount !== 1 ? 'ões' : ''} ativa{activeIntegrationsCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {activationData.chat.active && (
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>
                          Chat: {activationData.chat.autoResponse ? 'Resposta automática' : 'Manual'} 
                          ({activationData.chat.priority} prioridade)
                        </span>
                      </div>
                    )}
                    
                    {activationData.kanban.active && (
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span>
                          Kanban: {activationData.kanban.columns.length} coluna{activationData.kanban.columns.length !== 1 ? 's' : ''} configurada{activationData.kanban.columns.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                    
                    {activationData.columns.active && (
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        <span>
                          Colunas: {activationData.columns.columnIds.length} ID{activationData.columns.columnIds.length !== 1 ? 's' : ''} configurado{activationData.columns.columnIds.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}

                    {activeIntegrationsCount === 0 && (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Nenhuma integração ativa - o agente não será executado</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </motion.button>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Salvar Configurações
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
