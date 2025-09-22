'use client'

import { motion } from 'framer-motion'
import { Users, UserCheck, Briefcase, Trophy, TrendingUp, ArrowRight, Eye, MessageSquare, Calendar, DollarSign } from 'lucide-react'

interface FunnelStagesProps {
  selectedStage: string | null
  onSelectStage: (stage: string | null) => void
}

export const FunnelStages: React.FC<FunnelStagesProps> = ({ selectedStage, onSelectStage }) => {
  const stages = [
    {
      id: 'visitors',
      name: 'Visitantes',
      count: 12450,
      percentage: 100,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      icon: Eye,
      description: 'Pessoas que visitaram o site',
      metrics: {
        'Páginas vistas': '48.2K',
        'Tempo médio': '2m 45s',
        'Taxa de rejeição': '42%'
      }
    },
    {
      id: 'leads',
      name: 'Leads',
      count: 3890,
      percentage: 31.2,
      color: 'from-indigo-400 to-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      icon: Users,
      description: 'Contatos capturados',
      metrics: {
        'Formulários': '2.1K',
        'WhatsApp': '1.2K',
        'Landing Pages': '590'
      }
    },
    {
      id: 'qualified',
      name: 'Qualificados',
      count: 892,
      percentage: 7.2,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      icon: UserCheck,
      description: 'Leads com potencial',
      metrics: {
        'Score médio': '78',
        'Engajamento': '65%',
        'Resposta': '3h'
      }
    },
    {
      id: 'opportunities',
      name: 'Oportunidades',
      count: 234,
      percentage: 1.9,
      color: 'from-pink-400 to-pink-600',
      bgColor: 'bg-pink-100 dark:bg-pink-900/30',
      icon: Briefcase,
      description: 'Em negociação',
      metrics: {
        'Propostas': '156',
        'Reuniões': '89',
        'Follow-ups': '234'
      }
    },
    {
      id: 'customers',
      name: 'Clientes',
      count: 67,
      percentage: 0.5,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      icon: Trophy,
      description: 'Vendas fechadas',
      metrics: {
        'Ticket médio': 'R$ 2.2K',
        'LTV': 'R$ 8.5K',
        'Churn': '5%'
      }
    }
  ]

  return (
    <div className="space-y-6">
      {/* Visualização do Funil */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const Icon = stage.icon
            const isSelected = selectedStage === stage.id
            
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelectStage(isSelected ? null : stage.id)}
                className="cursor-pointer"
              >
                <div className={`relative transition-all ${isSelected ? 'scale-105' : ''}`}>
                  {/* Barra do funil */}
                  <div className="relative h-20 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r ${stage.color} rounded-xl`}
                    />
                    
                    {/* Conteúdo */}
                    <div className="relative h-full flex items-center justify-between px-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${stage.bgColor} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        </div>
                        
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {stage.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {stage.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stage.count.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {stage.percentage}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Seta conectora */}
                  {index < stages.length - 1 && (
                    <div className="flex justify-center -my-2 relative z-10">
                      <ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-600 rotate-90" />
                    </div>
                  )}
                </div>

                {/* Detalhes expandidos */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                  >
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(stage.metrics).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{key}</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <button className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-600">
                        Ver detalhes
                      </button>
                      <button className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-600">
                        Exportar dados
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Taxa de conversão entre estágios */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Taxas de Conversão</h4>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">31.2%</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Visitante → Lead</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">22.9%</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Lead → Qualificado</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-600">26.2%</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Qualificado → Oportunidade</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">28.6%</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Oportunidade → Cliente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
