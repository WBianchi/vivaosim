'use client'

import { motion } from 'framer-motion'
import { 
  FileText, 
  Search, 
  Filter,
  Plus
} from 'lucide-react'

interface EmptyStateProps {
  filters: any
  searchTerm: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({ filters, searchTerm }) => {
  const hasActiveFilters = Object.values(filters).some(value => 
    value !== 'all' && value !== ''
  ) || searchTerm !== ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="max-w-md mx-auto">
        {hasActiveFilters ? (
          <>
            {/* Filtros Ativos - Nenhum resultado */}
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum orçamento encontrado
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Não encontramos orçamentos que correspondam aos filtros aplicados. 
              Tente ajustar os critérios de busca.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Limpar Filtros
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                Novo Orçamento
              </motion.button>
            </div>
          </>
        ) : (
          <>
            {/* Nenhum orçamento cadastrado */}
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum orçamento ainda
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Você ainda não possui orçamentos cadastrados. 
              Crie seu primeiro orçamento para começar a gerenciar suas propostas.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              Criar Primeiro Orçamento
            </motion.button>

            {/* Dicas */}
            <div className="mt-10 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                💡 Dicas para começar:
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Crie orçamentos detalhados com itens e valores específicos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Defina prazos de validade para criar urgência</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Acompanhe o status de cada proposta enviada</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Use tags para organizar orçamentos por categoria</span>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
