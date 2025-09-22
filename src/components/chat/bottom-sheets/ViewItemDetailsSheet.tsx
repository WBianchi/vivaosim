'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Calendar, 
  DollarSign, 
  Ticket, 
  FileSignature, 
  Tag,
  Edit3,
  Clock,
  User,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'

interface ViewItemDetailsSheetProps {
  itemType: string
  itemData: any
  onClose: () => void
  onEdit?: () => void
}

export const ViewItemDetailsSheet: React.FC<ViewItemDetailsSheetProps> = ({
  itemType,
  itemData,
  onClose,
  onEdit
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

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

  const getIcon = () => {
    switch (itemType) {
      case 'quotes': return <DollarSign className="w-6 h-6" />
      case 'schedules': return <Calendar className="w-6 h-6" />
      case 'tickets': return <Ticket className="w-6 h-6" />
      case 'contracts': return <FileSignature className="w-6 h-6" />
      case 'tags': return <Tag className="w-6 h-6" />
      default: return null
    }
  }

  const getTypeTitle = () => {
    switch (itemType) {
      case 'quotes': return 'Orçamento'
      case 'schedules': return 'Agendamento'
      case 'tickets': return 'Ticket'
      case 'contracts': return 'Contrato'
      case 'tags': return 'Tag'
      default: return 'Item'
    }
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

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
                  {getIcon()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {getTypeTitle()}: {itemData.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(itemData.status)}`}>
                      {itemData.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onEdit && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onEdit()
                      handleClose()
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    <Edit3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Informações principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Informações Gerais
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Data:</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {itemType === 'schedules' ? formatDateTime(itemData.date) : formatDate(itemData.date)}
                        </p>
                      </div>
                    </div>
                    
                    {itemData.value && (
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Valor:</span>
                          <p className="font-medium text-green-600 dark:text-green-400 text-lg">
                            {formatCurrency(itemData.value)}
                          </p>
                        </div>
                      </div>
                    )}

                    {itemData.assignedTo && (
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Responsável:</span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {itemData.assignedTo}
                          </p>
                        </div>
                      </div>
                    )}

                    {itemData.priority && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Prioridade:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          itemData.priority === 'high' ? 'text-red-600 bg-red-100' :
                          itemData.priority === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                          'text-green-600 bg-green-100'
                        }`}>
                          {itemData.priority === 'high' ? 'Alta' : 
                           itemData.priority === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detalhes específicos por tipo */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Detalhes Específicos
                  </h3>
                  
                  {itemType === 'schedules' && (
                    <div className="space-y-3">
                      {itemData.location && (
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Local:</span>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {itemData.location}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {itemData.duration && (
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Duração:</span>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {itemData.duration} minutos
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {itemType === 'contracts' && (
                    <div className="space-y-3">
                      {itemData.startDate && (
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Data de Início:</span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatDate(itemData.startDate)}
                          </p>
                        </div>
                      )}
                      
                      {itemData.endDate && (
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Data de Fim:</span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatDate(itemData.endDate)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Descrição */}
              {itemData.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Descrição
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {itemData.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Notas/Observações */}
              {itemData.notes && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Observações
                  </h3>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
                    <p className="text-yellow-800 dark:text-yellow-200 whitespace-pre-wrap">
                      {itemData.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Ações */}
              {onEdit && (
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onEdit()
                      handleClose()
                    }}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Editar {getTypeTitle()}
                  </motion.button>
                </div>
              )}

              {/* Timestamp */}
              <div className="text-center text-sm text-gray-500 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                Criado em: {formatDateTime(itemData.createdAt || itemData.date)}
                {itemData.updatedAt && (
                  <span className="block mt-1">
                    Atualizado em: {formatDateTime(itemData.updatedAt)}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
