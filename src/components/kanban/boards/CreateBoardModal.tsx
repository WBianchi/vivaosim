'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HiXMark, 
  HiSparkles, 
  HiWrenchScrewdriver, 
  HiUsers, 
  HiCircleStack, 
  HiBriefcase, 
  HiShoppingCart, 
  HiChatBubbleBottomCenterText 
} from 'react-icons/hi2'

interface CreateBoardModalProps {
  onClose: () => void
  onBoardCreated?: () => void // Callback para atualizar lista
}

export const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ onClose, onBoardCreated }) => {
  const [step, setStep] = useState<'choose' | 'manual' | 'ai'>('choose')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [aiPrompt, setAiPrompt] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  const templates = [
    {
      id: 'sales',
      name: 'Pipeline de Vendas',
      description: 'Gerencie leads desde o primeiro contato até o fechamento',
      icon: HiBriefcase,
      color: 'from-blue-500 to-cyan-500',
      columns: ['Novos Leads', 'Qualificados', 'Proposta', 'Negociação', 'Fechados']
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      description: 'Gestão de pedidos e relacionamento com clientes online',
      icon: HiShoppingCart,
      color: 'from-green-500 to-emerald-500',
      columns: ['Carrinho Abandonado', 'Pedido Confirmado', 'Em Produção', 'Enviado', 'Entregue']
    },
    {
      id: 'support',
      name: 'Suporte ao Cliente',
      description: 'Acompanhe tickets e solicitações de suporte',
      icon: HiChatBubbleBottomCenterText,
      color: 'from-purple-500 to-pink-500',
      columns: ['Novo Ticket', 'Em Análise', 'Aguardando Cliente', 'Em Resolução', 'Resolvido']
    },
    {
      id: 'project',
      name: 'Gestão de Projetos',
      description: 'Acompanhe projetos e entregas para clientes',
      icon: HiUsers,
      color: 'from-orange-500 to-red-500',
      columns: ['Briefing', 'Em Desenvolvimento', 'Revisão', 'Aprovação', 'Entregue']
    }
  ]

  const createBoard = async (boardData: any) => {
    try {
      console.log('🚀 Criando quadro:', boardData)
      
      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(boardData)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao criar quadro')
      }
      
      const result = await response.json()
      console.log('✅ Quadro criado com sucesso:', result)
      
      // Atualizar lista de quadros
      if (onBoardCreated) {
        onBoardCreated()
      }
      
      onClose()
      alert(`✅ Quadro criado com sucesso!`)
      
    } catch (error) {
      console.error('❌ Erro ao criar quadro:', error)
      alert(`❌ Erro ao criar quadro: ${error}`)
    }
  }

  const handleAIGenerate = async () => {
    setIsGenerating(true)
    
    await createBoard({
      name: aiPrompt.substring(0, 50) || 'Quadro IA',
      description: aiPrompt,
      color: 'from-purple-500 to-pink-500',
      template: 'sales' // Usar template sales por padrão
    })
    
    setIsGenerating(false)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Criar Novo Quadro
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Configure seu quadro kanban do jeito que precisar
                </p>
              </div>
              
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <HiXMark className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'choose' && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Como você quer criar seu quadro?
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* IA Option */}
                  <motion.button
                    onClick={() => setStep('ai')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-6 border-2 border-dashed border-purple-300 hover:border-purple-500 rounded-xl transition-colors group"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiSparkles className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        🤖 Criar com IA (Recomendado)
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        A IA criará automaticamente as colunas, importará clientes do banco e chats do WhatsApp
                      </p>
                    </div>
                  </motion.button>

                  {/* Manual Option */}
                  <motion.button
                    onClick={() => setStep('manual')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-6 border-2 border-dashed border-gray-300 hover:border-gray-500 rounded-xl transition-colors group"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiWrenchScrewdriver className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        ⚙️ Configuração Manual
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Escolha um template pronto ou configure tudo do zero
                      </p>
                    </div>
                  </motion.button>
                </div>
              </div>
            )}

            {step === 'ai' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <motion.button
                    onClick={() => setStep('choose')}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    ← Voltar
                  </motion.button>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    🤖 Criação Inteligente com IA
                  </h3>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-700">
                  <div className="flex items-start gap-3">
                    <HiSparkles className="w-6 h-6 text-purple-600 dark:text-purple-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
                        Como funciona?
                      </h4>
                      <ul className="text-sm text-purple-700 dark:text-purple-400 space-y-1">
                        <li>✨ Descreva seu negócio ou nicho</li>
                        <li>🎯 A IA criará colunas personalizadas</li>
                        <li>📊 Importará clientes existentes do banco</li>
                        <li>💬 Integrará chats do WhatsApp automaticamente</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descreva seu negócio ou processo:
                  </label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ex: Sou uma agência de marketing digital que atende pequenas empresas. Preciso acompanhar leads desde o primeiro contato até o fechamento do contrato..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Importar clientes do banco de dados</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Integrar chats do WhatsApp</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <motion.button
                    onClick={() => setStep('choose')}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Cancelar
                  </motion.button>
                  
                  <motion.button
                    onClick={handleAIGenerate}
                    disabled={!aiPrompt.trim() || isGenerating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <HiSparkles className="w-4 h-4" />
                        Gerar com IA
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 'manual' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <motion.button
                    onClick={() => setStep('choose')}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    ← Voltar
                  </motion.button>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    ⚙️ Configuração Manual
                  </h3>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                    Escolha um template:
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map((template) => {
                      const Icon = template.icon
                      return (
                        <motion.button
                          key={template.id}
                          onClick={() => setSelectedTemplate(template.id)}
                          whileHover={{ scale: 1.02 }}
                          className={`
                            p-4 border-2 rounded-xl transition-all text-left
                            ${selectedTemplate === template.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {template.name}
                              </h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {template.description}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {template.columns.slice(0, 3).map((column, i) => (
                                  <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                    {column}
                                  </span>
                                ))}
                                {template.columns.length > 3 && (
                                  <span className="text-xs text-gray-500">+{template.columns.length - 3}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <motion.button
                    onClick={() => setStep('choose')}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Cancelar
                  </motion.button>
                  
                  <motion.button
                    onClick={async () => {
                      const template = templates.find(t => t.id === selectedTemplate)
                      if (template) {
                        await createBoard({
                          name: template.name,
                          description: template.description,
                          color: template.color,
                          template: template.id
                        })
                      }
                    }}
                    disabled={!selectedTemplate}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Criar Quadro
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
