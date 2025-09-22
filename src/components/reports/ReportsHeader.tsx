'use client'

import { motion } from 'framer-motion'
import { FileText, Download, Printer, Share2, Calendar, TrendingUp, BarChart3, PieChart, Activity, FileSpreadsheet } from 'lucide-react'

interface ReportsHeaderProps {
  selectedReport: string
  onReportChange: (report: string) => void
}

export const ReportsHeader: React.FC<ReportsHeaderProps> = ({ selectedReport, onReportChange }) => {
  const reportTypes = [
    { id: 'overview', label: 'Visão Geral', icon: Activity },
    { id: 'sales', label: 'Vendas', icon: TrendingUp },
    { id: 'customers', label: 'Clientes', icon: BarChart3 },
    { id: 'products', label: 'Produtos', icon: PieChart },
    { id: 'financial', label: 'Financeiro', icon: FileSpreadsheet }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Relatórios & Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Acompanhe o desempenho completo da plataforma</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Compartilhar"
          >
            <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Imprimir"
          >
            <Printer className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25"
          >
            <Download className="w-4 h-4" />
            Exportar
          </motion.button>
        </div>
      </div>

      {/* Tabs de tipos de relatório */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {reportTypes.map((type) => {
          const Icon = type.icon
          return (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onReportChange(type.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                selectedReport === type.id
                  ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {type.label}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
