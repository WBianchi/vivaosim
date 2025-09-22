'use client'

import { motion } from 'framer-motion'
import { 
  Package, 
  Plus, 
  Search, 
  Filter,
  DollarSign,
  Users,
  TrendingUp,
  Crown,
  Calendar,
  Gift
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

  const createPlan = () => {
    console.log('➕ Criar novo plano')
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
          Nenhum plano encontrado
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
          Não encontramos planos que correspondam aos filtros aplicados. 
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
            onClick={createPlan}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Plano
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
        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <Package className="w-16 h-16 text-white" />
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
          <DollarSign className="w-6 h-6 text-white" />
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
          className="absolute -bottom-2 -left-2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Users className="w-6 h-6 text-white" />
        </motion.div>
      </div>

      {/* Título e Descrição */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Seus planos de assinatura aparecerão aqui
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-lg">
        Crie planos de assinatura personalizados para monetizar seus serviços, 
        definir preços e gerenciar assinantes de forma eficiente.
      </p>

      {/* Benefícios dos Planos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full max-w-2xl">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 text-center"
        >
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            Receita Recorrente
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Fluxo de caixa previsível
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 text-center"
        >
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            Gestão de Assinantes
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Controle total dos clientes
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 text-center"
        >
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            Escalabilidade
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cresça sem limites
          </p>
        </motion.div>
      </div>

      {/* Tipos de Planos */}
      <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-800 mb-8 w-full max-w-2xl">
        <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Tipos de Planos Disponíveis:
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm text-purple-700 dark:text-purple-300">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span>Plano Básico</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Plano Profissional</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Plano Premium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>Plano Enterprise</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Plano Gratuito</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            <span>Plano Personalizado</span>
          </div>
        </div>
      </div>

      {/* Períodos de Cobrança */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800 mb-8 w-full max-w-2xl">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Períodos de Cobrança:
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">Mensal, Trimestral, Semestral e Anual</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Flexibilidade total para seus clientes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Gift className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">Descontos Automáticos</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Incentive planos anuais com descontos</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Crown className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">Períodos de Teste</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Ofereça trials gratuitos personalizados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas Motivacionais */}
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800 mb-8 w-full max-w-2xl">
        <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
          💰 Benefícios dos Planos de Assinatura:
        </h4>
        <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
          <li>• Receita recorrente previsível</li>
          <li>• Maior valor do tempo de vida do cliente (LTV)</li>
          <li>• Redução de custos de aquisição</li>
          <li>• Relacionamento duradouro com clientes</li>
        </ul>
      </div>

      {/* Botão de Ação */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={createPlan}
        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300"
      >
        <Plus className="w-6 h-6" />
        Criar Primeiro Plano
      </motion.button>

      {/* Dica */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
        💡 Dica: Comece com um plano básico e evolua conforme a demanda dos seus clientes
      </p>
    </motion.div>
  )
}
