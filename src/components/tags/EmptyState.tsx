'use client'

import { motion } from 'framer-motion'
import { 
  Tag, 
  Plus, 
  Search, 
  Filter,
  Hash,
  Palette,
  TrendingUp,
  Zap
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

  const createTag = () => {
    console.log('➕ Criar nova tag')
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
          Nenhuma tag encontrada
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
          Não encontramos tags que correspondam aos filtros aplicados. 
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
            onClick={createTag}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Tag
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
          <Tag className="w-16 h-16 text-white" />
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
          <Hash className="w-6 h-6 text-white" />
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
          <Palette className="w-6 h-6 text-white" />
        </motion.div>
      </div>

      {/* Título e Descrição */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Suas tags aparecerão aqui
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-lg">
        Organize e categorize seus conteúdos com tags inteligentes. 
        Crie um sistema de classificação eficiente para contratos, orçamentos, agendamentos e tickets.
      </p>

      {/* Benefícios das Tags */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full max-w-2xl">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 text-center"
        >
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Hash className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            Organização
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Categorize itens por projeto, cliente ou status
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 text-center"
        >
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            Busca Rápida
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Encontre rapidamente o que precisa
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
            Análise
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Acompanhe tendências e padrões
          </p>
        </motion.div>
      </div>

      {/* Exemplos de Tags */}
      <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-800 mb-8 w-full max-w-2xl">
        <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Exemplos de Tags Úteis:
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'Urgente', color: 'bg-red-500' },
            { name: 'VIP', color: 'bg-purple-500' },
            { name: 'E-commerce', color: 'bg-blue-500' },
            { name: 'Marketing', color: 'bg-green-500' },
            { name: 'Concluído', color: 'bg-gray-500' },
            { name: 'Em Andamento', color: 'bg-yellow-500' }
          ].map((tag, index) => (
            <motion.div
              key={tag.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 rounded-full border border-orange-200 dark:border-orange-700"
            >
              <div className={`w-3 h-3 ${tag.color} rounded-full`}></div>
              <span className="text-sm text-orange-700 dark:text-orange-300">
                {tag.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dicas */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 mb-8 w-full max-w-2xl">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
          💡 Dicas para usar tags eficientemente:
        </h4>
        <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
          <li>• Use cores para identificar categorias rapidamente</li>
          <li>• Crie tags específicas mas não muito detalhadas</li>
          <li>• Mantenha consistência nos nomes das tags</li>
          <li>• Revise e organize suas tags periodicamente</li>
        </ul>
      </div>

      {/* Botão de Ação */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={createTag}
        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300"
      >
        <Plus className="w-6 h-6" />
        Criar Primeira Tag
      </motion.button>

      {/* Dica */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
        🏷️ Dica: Tags podem ser aplicadas a contratos, orçamentos, agendamentos e tickets
      </p>
    </motion.div>
  )
}
