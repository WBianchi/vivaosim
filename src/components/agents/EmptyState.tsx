'use client'

import { motion } from 'framer-motion'
import { 
  Bot, 
  Plus, 
  Search, 
  Filter,
  Brain,
  MessageSquare,
  Target,
  Zap,
  Users,
  TrendingUp
} from 'lucide-react'

interface EmptyStateProps {
  filters: any
  searchTerm: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  filters,
  searchTerm
}) => {
  const hasActiveFilters = Object.values(filters).some(value => 
    value !== 'all' && value !== ''
  ) || searchTerm.trim() !== ''

  const clearFilters = () => {
    window.location.reload() // Simples reload para limpar filtros
  }

  const createAgent = () => {
    console.log('➕ Criar novo agente')
  }

  if (hasActiveFilters) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 px-8"
      >
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <Search className="w-12 h-12 text-gray-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Nenhum agente encontrado
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
          Não encontramos agentes que correspondam aos filtros aplicados. 
          Tente ajustar os critérios de busca ou limpar os filtros.
        </p>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Limpar Filtros
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={createAgent}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Agente
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-8"
    >
      {/* Ícone Principal */}
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
          <Bot className="w-16 h-16 text-white" />
        </div>
        
        {/* Ícones Flutuantes */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-2 -right-2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Brain className="w-6 h-6 text-white" />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, 10, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute -bottom-2 -left-2 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </motion.div>
      </div>

      {/* Título e Descrição */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Seus agentes IA aparecerão aqui
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-lg">
        Crie agentes de inteligência artificial especializados para automatizar tarefas, 
        responder clientes e otimizar seus processos de negócio.
      </p>

      {/* Benefícios dos Agentes IA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full max-w-2xl">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 text-center"
        >
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            Atendimento 24/7
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Resposta instantânea para clientes
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 text-center"
        >
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            IA Especializada
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Agentes treinados para seu nicho
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 text-center"
        >
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            Produtividade
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Automatize tarefas repetitivas
          </p>
        </motion.div>
      </div>

      {/* Tipos de Agentes */}
      <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-800 mb-8 w-full max-w-2xl">
        <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-3 flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Tipos de Agentes Disponíveis:
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm text-orange-700 dark:text-orange-300">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Assistente de Vendas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Suporte Técnico</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Marketing Digital</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Consultor Jurídico</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Analista Financeiro</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
            <span>Assistente de RH</span>
          </div>
        </div>
      </div>

      {/* Modos de Ativação */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800 mb-8 w-full max-w-2xl">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          3 Formas de Ativar seus Agentes:
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">Chat Integrado</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Resposta automática em conversas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">Kanban Ativo</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Automação em quadros Kanban</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">Colunas Específicas</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Ativação em colunas do Kanban</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas Motivacionais */}
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800 mb-8 w-full max-w-2xl">
        <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
          🚀 Benefícios comprovados dos Agentes IA:
        </h4>
        <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
          <li>• Redução de 80% no tempo de resposta</li>
          <li>• Aumento de 65% na satisfação do cliente</li>
          <li>• Economia de 50% em custos operacionais</li>
          <li>• Disponibilidade 24/7 sem interrupções</li>
        </ul>
      </div>

      {/* Botão de Ação */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={createAgent}
        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300"
      >
        <Plus className="w-6 h-6" />
        Criar Primeiro Agente
      </motion.button>

      {/* Dica */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
        🤖 Dica: Cada usuário pode gerenciar seus próprios agentes (atendentes, admin, assinantes)
      </p>
    </motion.div>
  )
}
