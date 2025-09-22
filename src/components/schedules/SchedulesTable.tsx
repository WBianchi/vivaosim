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
  ExternalLink,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import { useState } from 'react'

interface SchedulesTableProps {
  schedules: any[]
  onScheduleSelect: (schedule: any) => void
}

export const SchedulesTable: React.FC<SchedulesTableProps> = ({ schedules, onScheduleSelect }) => {
  const [sortField, setSortField] = useState<string>('dateTime')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
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

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedSchedules = [...schedules].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    // Tratamento especial para campos aninhados
    if (sortField === 'client') {
      aValue = a.client.name
      bValue = b.client.name
    } else if (sortField === 'agent') {
      aValue = a.agent.name
      bValue = b.agent.name
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />
  }

  const isToday = (date: string) => {
    return new Date(date).toDateString() === new Date().toDateString()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th 
                onClick={() => handleSort('title')}
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Agendamento
                  <SortIcon field="title" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('client')}
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Cliente
                  <SortIcon field="client" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('dateTime')}
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Data/Hora
                  <SortIcon field="dateTime" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('agent')}
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Agente
                  <SortIcon field="agent" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Formato/Local
              </th>
              <th 
                onClick={() => handleSort('status')}
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Status
                  <SortIcon field="status" />
                </div>
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedSchedules.map((schedule, index) => {
              const statusConfig = getStatusConfig(schedule.status)
              const FormatIcon = getFormatIcon(schedule.format)
              const todaySchedule = isToday(schedule.dateTime)
              
              return (
                <motion.tr
                  key={schedule.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onScheduleSelect(schedule)}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                    todaySchedule ? 'bg-orange-50 dark:bg-orange-900/10' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(schedule.priority)} mr-3`} />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {schedule.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {getTypeLabel(schedule.type)} • {schedule.duration}min
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs font-semibold mr-3">
                        {schedule.client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {schedule.client.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {schedule.client.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-4 h-4 ${todaySchedule ? 'text-orange-600' : 'text-gray-600'}`} />
                      <div>
                        <div className={`text-sm font-medium ${todaySchedule ? 'text-orange-900 dark:text-orange-100' : 'text-gray-900 dark:text-white'}`}>
                          {formatDate(schedule.dateTime)}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(schedule.dateTime).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      {todaySchedule && (
                        <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                          HOJE
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {schedule.agent.name}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FormatIcon className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="text-sm text-gray-900 dark:text-white truncate max-w-xs">
                          {schedule.location}
                        </div>
                        {schedule.meetingUrl && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(schedule.meetingUrl, '_blank')
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Link da reunião
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${statusConfig.bg}`}>
                      <statusConfig.icon className={`w-3 h-3 ${statusConfig.color}`} />
                      <span className={`text-xs font-medium ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onScheduleSelect(schedule)
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
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
