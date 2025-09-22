'use client'

import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Video, 
  Phone,
  CheckCircle, 
  XCircle,
  Play,
  AlertCircle,
  Eye,
  Edit3,
  Trash2,
  ExternalLink
} from 'lucide-react'

interface ScheduleCardProps {
  schedule: any
  index: number
  onClick: () => void
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule, index, onClick }) => {
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
    return new Date(date).toLocaleDateString('pt-BR')
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
          bg: 'bg-blue-100',
          border: 'border-blue-200'
        }
      case 'in_progress':
        return {
          label: 'Em Andamento',
          icon: Play,
          color: 'text-orange-600',
          bg: 'bg-orange-100',
          border: 'border-orange-200'
        }
      case 'completed':
        return {
          label: 'Concluído',
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100',
          border: 'border-green-200'
        }
      case 'cancelled':
        return {
          label: 'Cancelado',
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-100',
          border: 'border-red-200'
        }
      default:
        return {
          label: 'Desconhecido',
          icon: AlertCircle,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          border: 'border-gray-200'
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
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

  const statusConfig = getStatusConfig(schedule.status)
  const FormatIcon = getFormatIcon(schedule.format)

  const isToday = new Date(schedule.dateTime).toDateString() === new Date().toDateString()
  const isPast = new Date(schedule.dateTime) < new Date()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-800 transition-all cursor-pointer group ${
        isToday ? 'ring-2 ring-orange-200 dark:ring-orange-800' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
              {schedule.title}
            </h3>
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(schedule.priority)}`} />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {schedule.description}
          </p>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${statusConfig.bg} ${statusConfig.border} border`}>
          <statusConfig.icon className={`w-3 h-3 ${statusConfig.color}`} />
          <span className={`text-xs font-medium ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Data e Hora */}
      <div className={`flex items-center gap-3 mb-4 p-3 rounded-xl ${
        isToday ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-700'
      }`}>
        <Calendar className={`w-4 h-4 ${isToday ? 'text-orange-600' : 'text-gray-600'}`} />
        <div className="flex-1">
          <p className={`font-medium text-sm ${isToday ? 'text-orange-900 dark:text-orange-100' : 'text-gray-900 dark:text-white'}`}>
            {formatDate(schedule.dateTime)}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{formatTime(schedule.dateTime)} ({schedule.duration}min)</span>
          </div>
        </div>
        {isToday && (
          <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full font-medium">
            HOJE
          </span>
        )}
      </div>

      {/* Cliente */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-sm font-semibold">
          {schedule.client.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
            {schedule.client.name}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
            {schedule.client.email}
          </p>
        </div>
      </div>

      {/* Formato e Local */}
      <div className="flex items-center gap-2 mb-4">
        <FormatIcon className="w-4 h-4 text-gray-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {schedule.location}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {getTypeLabel(schedule.type)}
          </p>
        </div>
        {schedule.meetingUrl && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              window.open(schedule.meetingUrl, '_blank')
            }}
            className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded transition-colors"
            title="Abrir link da reunião"
          >
            <ExternalLink className="w-3 h-3" />
          </motion.button>
        )}
      </div>

      {/* Agente */}
      <div className="flex items-center gap-2 mb-4 text-xs text-gray-600 dark:text-gray-400">
        <User className="w-3 h-3" />
        <span>Agente: {schedule.agent.name}</span>
      </div>

      {/* Tags */}
      {schedule.tags && schedule.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {schedule.tags.slice(0, 2).map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {schedule.tags.length > 2 && (
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
              +{schedule.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Ações */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              console.log('👁️ Visualizar agendamento:', schedule.id)
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
              console.log('✏️ Editar agendamento:', schedule.id)
            }}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded transition-colors"
            title="Editar"
          >
            <Edit3 className="w-3 h-3" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              if (confirm(`Deseja cancelar o agendamento "${schedule.title}"?`)) {
                console.log('🗑️ Cancelar agendamento:', schedule.id)
              }
            }}
            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded transition-colors"
            title="Cancelar"
          >
            <Trash2 className="w-3 h-3" />
          </motion.button>
        </div>

        <div className="text-xs text-gray-500">
          {isPast ? 'Passado' : 'Futuro'}
        </div>
      </div>
    </motion.div>
  )
}
