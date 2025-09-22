'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, MoreVertical, Calendar, User, Tag, MessageSquare, Phone, Mail, Clock, DollarSign, Star } from 'lucide-react'

export const FunnelKanban: React.FC = () => {
  const [draggedCard, setDraggedCard] = useState<string | null>(null)

  const columns = [
    {
      id: 'leads',
      title: 'Novos Leads',
      color: 'bg-blue-500',
      cards: [
        {
          id: 'lead-1',
          name: 'João Silva',
          company: 'Tech Solutions',
          value: 'R$ 5.000',
          priority: 'high',
          tags: ['WhatsApp', 'Site'],
          avatar: '👤',
          lastContact: '2h atrás',
          score: 85
        },
        {
          id: 'lead-2',
          name: 'Maria Santos',
          company: 'Digital Agency',
          value: 'R$ 3.500',
          priority: 'medium',
          tags: ['Email', 'Indicação'],
          avatar: '👩',
          lastContact: '5h atrás',
          score: 72
        },
        {
          id: 'lead-3',
          name: 'Pedro Costa',
          company: 'E-commerce Plus',
          value: 'R$ 8.000',
          priority: 'high',
          tags: ['Instagram', 'Ads'],
          avatar: '👨',
          lastContact: '1d atrás',
          score: 90
        }
      ]
    },
    {
      id: 'qualified',
      title: 'Qualificados',
      color: 'bg-purple-500',
      cards: [
        {
          id: 'qual-1',
          name: 'Ana Oliveira',
          company: 'StartUp X',
          value: 'R$ 12.000',
          priority: 'high',
          tags: ['Hot Lead', 'Urgente'],
          avatar: '👩‍💼',
          lastContact: '30min atrás',
          score: 95
        },
        {
          id: 'qual-2',
          name: 'Carlos Lima',
          company: 'Consulting Pro',
          value: 'R$ 7.500',
          priority: 'medium',
          tags: ['Reunião agendada'],
          avatar: '👨‍💼',
          lastContact: '3h atrás',
          score: 88
        }
      ]
    },
    {
      id: 'negotiation',
      title: 'Em Negociação',
      color: 'bg-orange-500',
      cards: [
        {
          id: 'neg-1',
          name: 'Empresa ABC',
          company: 'ABC Corp',
          value: 'R$ 25.000',
          priority: 'high',
          tags: ['Proposta enviada', 'Follow-up'],
          avatar: '🏢',
          lastContact: '1h atrás',
          score: 92
        },
        {
          id: 'neg-2',
          name: 'Roberto Dias',
          company: 'Innovation Lab',
          value: 'R$ 15.000',
          priority: 'medium',
          tags: ['Desconto solicitado'],
          avatar: '👨‍🔬',
          lastContact: '4h atrás',
          score: 78
        }
      ]
    },
    {
      id: 'closed',
      title: 'Fechados',
      color: 'bg-green-500',
      cards: [
        {
          id: 'closed-1',
          name: 'Tech Giants',
          company: 'TG Solutions',
          value: 'R$ 45.000',
          priority: 'completed',
          tags: ['Contrato assinado', 'Pago'],
          avatar: '🎯',
          lastContact: 'Hoje',
          score: 100
        }
      ]
    },
    {
      id: 'lost',
      title: 'Perdidos',
      color: 'bg-red-500',
      cards: [
        {
          id: 'lost-1',
          name: 'XYZ Company',
          company: 'XYZ Ltd',
          value: 'R$ 10.000',
          priority: 'low',
          tags: ['Preço', 'Concorrência'],
          avatar: '❌',
          lastContact: '2d atrás',
          score: 45
        }
      ]
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'low': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-80"
          >
            {/* Header da coluna */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 ${column.color} rounded-full`}></div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {column.title}
                </h3>
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded-full">
                  {column.cards.length}
                </span>
              </div>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {column.cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  draggable
                  onDragStart={() => setDraggedCard(card.id)}
                  onDragEnd={() => setDraggedCard(null)}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gray-50 dark:bg-gray-700 rounded-xl p-4 cursor-move border-2 transition-all ${
                    draggedCard === card.id 
                      ? 'border-blue-500 opacity-50' 
                      : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {/* Header do card */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{card.avatar}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {card.name}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {card.company}
                        </p>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                      <MoreVertical className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  {/* Valor e Score */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-bold text-gray-900 dark:text-white">
                        {card.value}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className={`w-4 h-4 ${getScoreColor(card.score)}`} />
                      <span className={`text-sm font-medium ${getScoreColor(card.score)}`}>
                        {card.score}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-white dark:bg-gray-600 text-xs text-gray-600 dark:text-gray-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {card.lastContact}
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                        <MessageSquare className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                        <Phone className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                        <Mail className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Área de drop */}
              <div className="h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center">
                <p className="text-sm text-gray-400">Arraste cards aqui</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
