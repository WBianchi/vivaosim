'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Video, 
  Phone,
  Edit3,
  Trash2,
  ExternalLink,
  Mail,
  Users,
  FileText,
  Tag,
  CheckCircle,
  XCircle,
  Play,
  AlertCircle
} from 'lucide-react'

interface ScheduleDetailsModalProps {
  schedule: any
  onClose: () => void
  onEdit?: () => void
}

export const ScheduleDetailsModal: React.FC<ScheduleDetailsModalProps> = ({
  schedule,
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

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'scheduled':
        return {
          label: 'Agendado',
          icon: Clock,
          color: 'text-blue-600',
          bg: 'bg-blue-100'
        }
      case 'in_progress':
        return {
          label: 'Em Andamento',
          icon: Play,
          color: 'text-orange-600',
          bg: 'bg-orange-100'
        }
      case 'completed':
        return {
          label: 'Concluído',
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100'
        }
      case 'cancelled':
        return {
          label: 'Cancelado',
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-100'
        }
      default:
        return {
          label: 'Desconhecido',
          icon: AlertCircle,
          color: 'text-gray-600',
          bg: 'bg-gray-100'
        }
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'online': return Video
      case 'phone': return Phone
      case 'in_person': return MapPin
      case 'hybrid': return Video
      default: return MapPin
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'meeting': return 'Reunião'
      case 'call': return 'Ligação'
      case 'visit': return 'Visita'
      case 'presentation': return 'Apresentação'
      case 'followup': return 'Follow-up'
      default: return type
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const statusConfig = getStatusConfig(schedule.status)
  const FormatIcon = getFormatIcon(schedule.format)
  const isToday = new Date(schedule.dateTime).toDateString() === new Date().toDateString()

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {schedule.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(schedule.priority)}`}>
                      {schedule.priority === 'high' ? 'Alta' : 
                       schedule.priority === 'medium' ? 'Média' : 'Baixa'} prioridade
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
            <div className="p-6">
              {/* Data e Hora */}
              <div className={`p-4 rounded-xl mb-6 ${
                isToday ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800' : 'bg-gray-50 dark:bg-gray-800'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className={`w-5 h-5 ${isToday ? 'text-orange-600' : 'text-gray-600'}`} />
                  <h3 className={`font-semibold ${isToday ? 'text-orange-900 dark:text-orange-100' : 'text-gray-900 dark:text-white'}`}>
                    {formatDate(schedule.dateTime)}
                  </h3>
                  {isToday && (
                    <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                      HOJE
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(schedule.dateTime)} • {schedule.duration} minutos</span>
                </div>
              </div>

              {/* Informações do Cliente */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações do Cliente
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold text-lg">
                      {schedule.client.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {schedule.client.name}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {schedule.client.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {schedule.client.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Local e Formato */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FormatIcon className="w-5 h-5" />
                  Local e Formato
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tipo</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {getTypeLabel(schedule.type)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Formato</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {schedule.format === 'online' ? 'Online' :
                         schedule.format === 'in_person' ? 'Presencial' :
                         schedule.format === 'phone' ? 'Telefone' : 'Híbrido'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Local</p>
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {schedule.location}
                        </p>
                        {schedule.meetingUrl && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.open(schedule.meetingUrl, '_blank')}
                            className="flex items-center gap-2 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Abrir Link
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Descrição
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <p className="text-gray-700 dark:text-gray-300">
                    {schedule.description}
                  </p>
                </div>
              </div>

              {/* Observações */}
              {schedule.notes && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Observações
                  </h3>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
                    <p className="text-yellow-800 dark:text-yellow-200">
                      {schedule.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Tags */}
              {schedule.tags && schedule.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {schedule.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Informações do Agente */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Agente Responsável
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {schedule.agent.name}
                  </p>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (onEdit) {
                      onEdit()
                      handleClose()
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar Agendamento
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (confirm(`Deseja cancelar o agendamento "${schedule.title}"?`)) {
                      console.log('🗑️ Cancelar agendamento:', schedule.id)
                      handleClose()
                    }
                  }}
                  className="px-4 py-3 border border-red-300 hover:bg-red-50 text-red-600 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Cancelar
                </motion.button>
              </div>

              {/* Timestamps */}
              <div className="text-center text-sm text-gray-500 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                Criado em: {formatDateTime(schedule.createdAt)}
                <br />
                Atualizado em: {formatDateTime(schedule.updatedAt)}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
