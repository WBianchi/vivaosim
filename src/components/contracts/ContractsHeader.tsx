'use client'

import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  FileSignature,
  DollarSign,
  CheckCircle2,
  Clock,
  Users
} from 'lucide-react'

interface ContractsHeaderProps {
  onCreateContract: () => void
  viewMode: 'grid' | 'table'
  onViewModeChange: (mode: 'grid' | 'table') => void
  searchTerm: string
  onSearchChange: (term: string) => void
}

export const ContractsHeader: React.FC<ContractsHeaderProps> = ({
  onCreateContract,
  viewMode,
  onViewModeChange,
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="mb-8">
      {/* Título e Ações */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Contratos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie contratos e assinaturas digitais
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar contratos..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
            />
          </div>

          {/* Toggle View Mode */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Vista em Grade"
            >
              <Grid3X3 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewModeChange('table')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Vista em Tabela"
            >
              <List className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Botão Criar Contrato */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreateContract}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Contrato
          </motion.button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors"
        >
          <FileSignature className="w-4 h-4" />
          Contratos Pendentes
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" />
          Assinados Hoje
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-colors"
        >
          <Users className="w-4 h-4" />
          Por Cliente
        </motion.button>
      </div>
    </div>
  )
}
