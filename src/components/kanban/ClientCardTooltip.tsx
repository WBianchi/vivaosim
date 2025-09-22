'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  DollarSign, 
  Ticket, 
  FileSignature, 
  Tag,
  Edit3,
  Trash2,
  Eye,
  Clock
} from 'lucide-react'

interface ClientItem {
  id: string
  title: string
  status: string
  value?: number
  date: string
  description?: string
  type: 'quote' | 'schedule' | 'ticket' | 'contract' | 'tag'
}

interface ClientCardTooltipProps {
  client: any
  onEditItem: (type: string, item: ClientItem) => void
  onDeleteItem: (type: string, itemId: string) => void
  onViewItem: (type: string, item: ClientItem) => void
}

const mockData = {
  quotes: [
    {
      id: '1',
      title: 'Orçamento Website',
      status: 'pendente',
      value: 5000,
      date: '2024-01-15',
      description: 'Desenvolvimento de website institucional',
      type: 'quote' as const
    },
    {
      id: '2', 
      title: 'Orçamento App Mobile',
      status: 'aprovado',
      value: 12000,
      date: '2024-01-10',
      description: 'Aplicativo mobile para e-commerce',
      type: 'quote' as const
    }
  ],
  schedules: [
    {
      id: '1',
      title: 'Reunião de Briefing',
      status: 'agendado',
      date: '2024-01-20T10:00',
      description: 'Definir escopo do projeto',
      type: 'schedule' as const
    },
    {
      id: '2',
      title: 'Apresentação Proposta',
      status: 'concluido',
      date: '2024-01-18T14:30',
      description: 'Apresentar proposta técnica',
      type: 'schedule' as const
    }
  ],
  tickets: [
    {
      id: '1',
      title: 'Bug no checkout',
      status: 'aberto',
      date: '2024-01-19',
      description: 'Erro ao finalizar compra',
      type: 'ticket' as const
    },
    {
      id: '2',
      title: 'Melhoria no design',
      status: 'em_andamento',
      date: '2024-01-17',
      description: 'Ajustar cores do header',
      type: 'ticket' as const
    }
  ],
  contracts: [
    {
      id: '1',
      title: 'Contrato Desenvolvimento',
      status: 'assinado',
      value: 15000,
      date: '2024-01-12',
      description: 'Desenvolvimento completo da plataforma',
      type: 'contract' as const
    }
  ],
  tags: [
    {
      id: '1',
      title: 'Cliente Premium',
      status: 'ativo',
      date: '2024-01-01',
      description: 'Cliente com desconto especial',
      type: 'tag' as const
    },
    {
      id: '2',
      title: 'Urgente',
      status: 'ativo', 
      date: '2024-01-19',
      description: 'Prioridade alta',
      type: 'tag' as const
    }
  ]
}

export const ClientCardTooltip: React.FC<ClientCardTooltipProps> = ({
  client,
  onEditItem,
  onDeleteItem,
  onViewItem
}) => {
  const [hoveredItem, setHoveredItem] = useState<ClientItem | null>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'text-yellow-600 bg-yellow-100'
      case 'aprovado': case 'assinado': case 'agendado': return 'text-green-600 bg-green-100'
      case 'concluido': return 'text-blue-600 bg-blue-100'
      case 'aberto': case 'em_andamento': return 'text-orange-600 bg-orange-100'
      case 'ativo': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'quote': return <DollarSign className="w-4 h-4" />
      case 'schedule': return <Calendar className="w-4 h-4" />
      case 'ticket': return <Ticket className="w-4 h-4" />
      case 'contract': return <FileSignature className="w-4 h-4" />
      case 'tag': return <Tag className="w-4 h-4" />
      default: return null
    }
  }

  const sections = [
    { key: 'quotes', title: 'Orçamentos', data: mockData.quotes, color: 'text-green-600' },
    { key: 'schedules', title: 'Agendamentos', data: mockData.schedules, color: 'text-blue-600' },
    { key: 'tickets', title: 'Tickets', data: mockData.tickets, color: 'text-red-600' },
    { key: 'contracts', title: 'Contratos', data: mockData.contracts, color: 'text-purple-600' },
    { key: 'tags', title: 'Tags', data: mockData.tags, color: 'text-orange-600' }
  ]

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detalhes - {client.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Informações completas do cliente
          </p>
        </div>

        {/* Content */}
        <div className="max-h-80 overflow-y-auto">
          {sections.map((section) => (
            <div key={section.key} className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-semibold ${section.color} flex items-center gap-2`}>
                  {getIcon(section.key)}
                  {section.title}
                </h4>
                <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {section.data.length}
                </span>
              </div>

              <div className="space-y-2">
                {section.data.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">
                    Nenhum {section.title.toLowerCase()} encontrado
                  </p>
                ) : (
                  section.data.map((item) => (
                    <motion.div
                      key={item.id}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="group p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer relative"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-gray-900 dark:text-white">
                              {item.title}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.type === 'schedule' ? formatDateTime(item.date) : formatDate(item.date)}
                            </span>
                            {item.value && (
                              <span className="flex items-center gap-1 text-green-600 font-medium">
                                <DollarSign className="w-3 h-3" />
                                {formatCurrency(item.value)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              onViewItem(section.key, item)
                            }}
                            className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded transition-colors"
                            title="Visualizar"
                          >
                            <Eye className="w-3 h-3" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              onEditItem(section.key, item)
                            }}
                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-400 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="w-3 h-3" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (confirm(`Deseja excluir "${item.title}"?`)) {
                                onDeleteItem(section.key, item.id)
                              }
                            }}
                            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Tooltip com detalhes do item */}
                      <AnimatePresence>
                        {hoveredItem?.id === item.id && (
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="absolute left-full top-0 ml-2 w-72 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 p-4 rounded-lg shadow-xl z-60"
                          >
                            <h5 className="font-semibold mb-2">{item.title}</h5>
                            {item.description && (
                              <p className="text-sm mb-3 opacity-90">{item.description}</p>
                            )}
                            
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="opacity-70">Status:</span>
                                <p className="font-medium">{item.status}</p>
                              </div>
                              <div>
                                <span className="opacity-70">Data:</span>
                                <p className="font-medium">
                                  {item.type === 'schedule' ? formatDateTime(item.date) : formatDate(item.date)}
                                </p>
                              </div>
                              {item.value && (
                                <div className="col-span-2">
                                  <span className="opacity-70">Valor:</span>
                                  <p className="font-medium text-green-400 dark:text-green-600">
                                    {formatCurrency(item.value)}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => onViewItem(section.key, item)}
                                className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors"
                              >
                                Visualizar
                              </button>
                              <button
                                onClick={() => onEditItem(section.key, item)}
                                className="flex-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 dark:bg-gray-400 dark:hover:bg-gray-500 text-white dark:text-gray-900 rounded text-xs font-medium transition-colors"
                              >
                                Editar
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
