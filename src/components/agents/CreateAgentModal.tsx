'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Bot, 
  Save,
  Brain,
  Target,
  Users,
  MessageSquare,
  Zap,
  Eye
} from 'lucide-react'

interface CreateAgentModalProps {
  onClose: () => void
  onSave: (agentData: any) => void
}

export const CreateAgentModal: React.FC<CreateAgentModalProps> = ({
  onClose,
  onSave
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    model: 'gpt-4',
    niche: 'geral',
    role: 'assistant',
    status: 'active',
    userTypes: [] as string[],
    activationModes: [] as string[],
    prompt: ''
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1]

      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          ...formData,
          integrations: {
            chat: { active: false, config: {} },
            kanban: { active: false, config: {} },
            columns: { active: false, config: {} }
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Agente criado:', data.agent)
        onSave(data.agent)
        handleClose()
      } else {
        const error = await response.json()
        console.error('❌ Erro ao criar agente:', error)
        alert('Erro ao criar agente: ' + (error.error || 'Erro desconhecido'))
      }
    } catch (error) {
      console.error('❌ Erro ao criar agente:', error)
      alert('Erro ao criar agente. Verifique sua conexão.')
    }
  }

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const toggleUserType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      userTypes: prev.userTypes.includes(type)
        ? prev.userTypes.filter(t => t !== type)
        : [...prev.userTypes, type]
    }))
  }

  const toggleActivationMode = (mode: string) => {
    setFormData(prev => ({
      ...prev,
      activationModes: prev.activationModes.includes(mode)
        ? prev.activationModes.filter(m => m !== mode)
        : [...prev.activationModes, mode]
    }))
  }

  const modelOptions = [
    { value: 'gpt-4', label: 'GPT-4', description: 'Modelo mais avançado da OpenAI' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: 'Modelo rápido e eficiente' },
    { value: 'claude-3', label: 'Claude 3', description: 'Modelo da Anthropic' },
    { value: 'claude-2', label: 'Claude 2', description: 'Versão anterior do Claude' },
    { value: 'gemini-pro', label: 'Gemini Pro', description: 'Modelo do Google' },
    { value: 'custom', label: 'Customizado', description: 'Modelo personalizado' }
  ]

  const nicheOptions = [
    { value: 'vendas', label: 'Vendas', description: 'Especializado em vendas e conversão' },
    { value: 'suporte', label: 'Suporte', description: 'Atendimento e resolução de problemas' },
    { value: 'marketing', label: 'Marketing', description: 'Campanhas e estratégias de marketing' },
    { value: 'juridico', label: 'Jurídico', description: 'Questões legais e compliance' },
    { value: 'financeiro', label: 'Financeiro', description: 'Análise financeira e relatórios' },
    { value: 'rh', label: 'Recursos Humanos', description: 'Gestão de pessoas e recrutamento' },
    { value: 'ti', label: 'Tecnologia', description: 'Suporte técnico e desenvolvimento' },
    { value: 'geral', label: 'Geral', description: 'Assistente de propósito geral' }
  ]

  const roleOptions = [
    { value: 'assistant', label: 'Assistente', description: 'Ajuda com tarefas gerais' },
    { value: 'consultant', label: 'Consultor', description: 'Fornece conselhos especializados' },
    { value: 'specialist', label: 'Especialista', description: 'Expert em área específica' },
    { value: 'analyst', label: 'Analista', description: 'Analisa dados e gera insights' },
    { value: 'advisor', label: 'Conselheiro', description: 'Orienta decisões estratégicas' },
    { value: 'moderator', label: 'Moderador', description: 'Modera conversas e interações' }
  ]

  const userTypeOptions = [
    { value: 'atendentes', label: 'Atendentes', description: 'Equipe de atendimento' },
    { value: 'admin', label: 'Administradores', description: 'Usuários administrativos' },
    { value: 'assinante', label: 'Assinantes', description: 'Clientes assinantes' }
  ]

  const activationModeOptions = [
    { value: 'chat', label: 'Chat', icon: MessageSquare, description: 'Integração com chat' },
    { value: 'kanban', label: 'Kanban', icon: Target, description: 'Ativação em quadros Kanban' },
    { value: 'columns', label: 'Colunas', icon: Zap, description: 'Ativação em colunas específicas' }
  ]

  const selectedModel = modelOptions.find(m => m.value === formData.model)
  const selectedNiche = nicheOptions.find(n => n.value === formData.niche)
  const selectedRole = roleOptions.find(r => r.value === formData.role)

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
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Novo Agente IA
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Crie um agente inteligente especializado
                  </p>
                </div>
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Informações Básicas */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Informações Básicas
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nome do Agente *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => updateFormData('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Ex: Assistente de Vendas Pro"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Modelo IA *
                      </label>
                      <select
                        required
                        value={formData.model}
                        onChange={(e) => updateFormData('model', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {modelOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {selectedModel && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {selectedModel.description}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => updateFormData('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="active">Ativo</option>
                        <option value="inactive">Inativo</option>
                        <option value="training">Em Treinamento</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Descrição *
                      </label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Descreva o propósito e especialidade do agente..."
                      />
                    </div>
                  </div>
                </div>

                {/* Especialização */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Especialização
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nicho *
                      </label>
                      <select
                        required
                        value={formData.niche}
                        onChange={(e) => updateFormData('niche', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {nicheOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {selectedNiche && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {selectedNiche.description}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Função *
                      </label>
                      <select
                        required
                        value={formData.role}
                        onChange={(e) => updateFormData('role', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {roleOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {selectedRole && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {selectedRole.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tipos de Usuário */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Tipos de Usuário
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Selecione quais tipos de usuário podem usar este agente:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {userTypeOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleUserType(option.value)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.userTypes.includes(option.value)
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {option.label}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {option.description}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Modos de Ativação */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Modos de Ativação
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Escolha onde este agente pode ser ativado:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {activationModeOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleActivationMode(option.value)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.activationModes.includes(option.value)
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <option.icon className="w-5 h-5 text-orange-600" />
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {option.label}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {option.description}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Prompt */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Prompt do Agente
                  </h3>
                  
                  <textarea
                    value={formData.prompt}
                    onChange={(e) => updateFormData('prompt', e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                    placeholder="Você é um agente especializado em... Seu objetivo é... Sempre responda de forma..."
                  />
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mt-3">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                      💡 Dicas para um bom prompt:
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Defina claramente o papel e responsabilidades</li>
                      <li>• Especifique o tom de voz e estilo</li>
                      <li>• Inclua diretrizes e limitações</li>
                      <li>• Forneça exemplos quando necessário</li>
                    </ul>
                  </div>
                </div>

                {/* Preview */}
                {formData.name && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Preview do Agente
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                          <Bot className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {formData.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedModel?.label} • {selectedNiche?.label} • {selectedRole?.label}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        {formData.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.userTypes.map((type) => (
                          <span key={type} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                            {userTypeOptions.find(opt => opt.value === type)?.label}
                          </span>
                        ))}
                        {formData.activationModes.map((mode) => (
                          <span key={mode} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {activationModeOptions.find(opt => opt.value === mode)?.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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
                  className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Criar Agente
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
