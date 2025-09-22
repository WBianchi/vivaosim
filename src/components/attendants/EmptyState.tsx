'use client'

import { motion } from 'framer-motion'
import { 
  Headphones, 
  Plus, 
  Search, 
  Filter,
  Users,
  MessageSquare,
  Clock,
  Star,
  TrendingUp,
  CheckCircle
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
    window.location.reload()
  }

  const createAttendant = () => {
    console.log('➕ Criar novo atendente')
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
          Nenhum atendente encontrado
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
          Não encontramos atendentes que correspondam aos filtros aplicados. 
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
            onClick={createAttendant}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Atendente
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
        <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
          <Headphones className="w-16 h-16 text-white" />
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
          className="absolute -top-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <MessageSquare className="w-6 h-6 text-white" />
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
          className="absolute -bottom-2 -left-2 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Star className="w-6 h-6 text-white" />
        </motion.div>
      </div>

      {/* Título e Descrição */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Sua equipe de atendimento aparecerá aqui
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-lg">
        Gerencie sua equipe de atendimento, monitore performance em tempo real e 
        garanta a melhor experiência para seus clientes.
      </p>

      {/* Benefícios da Equipe */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full max-w-2xl">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 text-center"
        >
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            Gestão Completa
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Controle total da equipe
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
            Performance Real
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Métricas em tempo real
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 text-center"
        >
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            Qualidade Garantida
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Avaliações e feedback
          </p>
        </motion.div>
      </div>

      {/* Funcionalidades */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800 mb-8 w-full max-w-2xl">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
          <Headphones className="w-5 h-5" />
          Funcionalidades de Gestão:
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm text-blue-700 dark:text-blue-300">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Status Online/Offline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Chats em Tempo Real</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Avaliações de Clientes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>Tempo de Atendimento</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Controle de Carga</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            <span>Relatórios Detalhados</span>
          </div>
        </div>
      </div>

      {/* Departamentos */}
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-800 mb-8 w-full max-w-2xl">
        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Departamentos Disponíveis:
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Headphones className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">Suporte Técnico</p>
              <p className="text-sm text-green-700 dark:text-green-300">Resolução de problemas técnicos</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">Vendas</p>
              <p className="text-sm text-green-700 dark:text-green-300">Consultoria e fechamento de negócios</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">Financeiro</p>
              <p className="text-sm text-green-700 dark:text-green-300">Questões de cobrança e pagamento</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas Motivacionais */}
      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800 mb-8 w-full max-w-2xl">
        <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
          📊 Benefícios de uma Equipe Bem Gerenciada:
        </h4>
        <ul className="space-y-1 text-sm text-purple-700 dark:text-purple-300">
          <li>• Aumento de 45% na satisfação do cliente</li>
          <li>• Redução de 60% no tempo de resposta</li>
          <li>• Melhoria de 35% na taxa de resolução</li>
          <li>• Crescimento de 25% na produtividade</li>
        </ul>
      </div>

      {/* Botão de Ação */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={createAttendant}
        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300"
      >
        <Plus className="w-6 h-6" />
        Adicionar Primeiro Atendente
      </motion.button>

      {/* Dica */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
        💡 Dica: Integre com WhatsApp Business API para atendimento automático via chat
      </p>
    </motion.div>
  )
}
