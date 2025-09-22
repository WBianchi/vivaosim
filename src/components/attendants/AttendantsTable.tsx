'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronUp, 
  ChevronDown,
  Eye,
  Edit3,
  MoreVertical,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  Star,
  Mail,
  Phone,
  Users,
  TrendingUp
} from 'lucide-react'

interface AttendantsTableProps {
  attendants: any[]
  onAttendantSelect: (attendant: any) => void
}

type SortField = 'name' | 'department' | 'rating' | 'activeChats' | 'responseTime' | 'ticketsResolved' | 'joinedAt'
type SortDirection = 'asc' | 'desc'

export const AttendantsTable: React.FC<AttendantsTableProps> = ({
  attendants,
  onAttendantSelect
}) => {
  const [sortField, setSortField] = useState<SortField>('rating')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedAttendants = [...attendants].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'department':
        aValue = a.department.toLowerCase()
        bValue = b.department.toLowerCase()
        break
      case 'rating':
        aValue = a.rating
        bValue = b.rating
        break
      case 'activeChats':
        aValue = a.activeChats
        bValue = b.activeChats
        break
      case 'responseTime':
        aValue = a.responseTime
        bValue = b.responseTime
        break
      case 'ticketsResolved':
        aValue = a.ticketsResolved
        bValue = b.ticketsResolved
        break
      case 'joinedAt':
        aValue = new Date(a.joinedAt).getTime()
        bValue = new Date(b.joinedAt).getTime()
        break
      default:
        return 0
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1
    }
    return 0
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes.toFixed(1)}min`
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    return `${hours}h ${mins}min`
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          label: 'Ativo',
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100'
        }
      case 'inactive':
        return {
          label: 'Inativo',
          icon: XCircle,
          color: 'text-gray-600',
          bg: 'bg-gray-100'
        }
      case 'suspended':
        return {
          label: 'Suspenso',
          icon: AlertTriangle,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100'
        }
      case 'training':
        return {
          label: 'Treinamento',
          icon: Clock,
          color: 'text-blue-600',
          bg: 'bg-blue-100'
        }
      default:
        return {
          label: 'Desconhecido',
          icon: User,
          color: 'text-gray-600',
          bg: 'bg-gray-100'
        }
    }
  }

  const getOnlineStatusConfig = (status: string) => {
    switch (status) {
      case 'online':
        return { label: 'Online', color: 'bg-green-500' }
      case 'offline':
        return { label: 'Offline', color: 'bg-gray-500' }
      case 'away':
        return { label: 'Ausente', color: 'bg-yellow-500' }
      case 'busy':
        return { label: 'Ocupado', color: 'bg-red-500' }
      default:
        return { label: 'Desconhecido', color: 'bg-gray-500' }
    }
  }

  const getDepartmentConfig = (department: string) => {
    switch (department) {
      case 'support':
        return { label: 'Suporte Técnico', color: 'text-blue-600' }
      case 'sales':
        return { label: 'Vendas', color: 'text-green-600' }
      case 'billing':
        return { label: 'Financeiro', color: 'text-purple-600' }
      case 'general':
        return { label: 'Geral', color: 'text-gray-600' }
      case 'vip':
        return { label: 'VIP', color: 'text-orange-600' }
      default:
        return { label: 'Outros', color: 'text-gray-600' }
    }
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-blue-600 transition-colors"
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? 
          <ChevronUp className="w-4 h-4" /> : 
          <ChevronDown className="w-4 h-4" />
      )}
    </button>
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="name">Atendente</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="department">Departamento</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="activeChats">Chats Ativos</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="rating">Avaliação</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="responseTime">Tempo Resposta</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="ticketsResolved">Performance</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="joinedAt">Entrada</SortButton>
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {sortedAttendants.map((attendant, index) => {
              const statusConfig = getStatusConfig(attendant.status)
              const onlineConfig = getOnlineStatusConfig(attendant.onlineStatus)
              const departmentConfig = getDepartmentConfig(attendant.department)
              const isOverloaded = attendant.activeChats >= attendant.maxChats * 0.8
              const hasHighRating = attendant.rating >= 4.5

              return (
                <motion.tr
                  key={attendant.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                    hasHighRating ? 'bg-yellow-50 dark:bg-yellow-900/10' : 
                    isOverloaded ? 'bg-red-50 dark:bg-red-900/10' : ''
                  }`}
                  onClick={() => onAttendantSelect(attendant)}
                >
                  {/* Atendente */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`w-10 h-10 ${statusConfig.bg} rounded-lg flex items-center justify-center`}>
                          {attendant.avatar ? (
                            <img 
                              src={attendant.avatar} 
                              alt={attendant.name}
                              className="w-full h-full rounded-lg object-cover"
                            />
                          ) : (
                            <User className={`w-5 h-5 ${statusConfig.color}`} />
                          )}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${onlineConfig.color} rounded-full border-2 border-white dark:border-gray-800`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                            {attendant.name}
                          </p>
                          {hasHighRating && (
                            <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                              Top
                            </span>
                          )}
                          {isOverloaded && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                              Sobrecarregado
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {attendant.role}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{attendant.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{attendant.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Departamento */}
                  <td className="px-6 py-4">
                    <span className={`font-medium ${departmentConfig.color}`}>
                      {departmentConfig.label}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                        <statusConfig.icon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 ${onlineConfig.color} rounded-full`} />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {onlineConfig.label}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Chats Ativos */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {attendant.activeChats}/{attendant.maxChats}
                        </p>
                        <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-1">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              isOverloaded ? 'bg-red-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${(attendant.activeChats / attendant.maxChats) * 100}%` }}
                          />
                        </div>
                        {attendant.currentClients.length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <Users className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {attendant.currentClients.length} clientes
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Avaliação */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {attendant.rating.toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {attendant.totalRatings} avaliações
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Tempo Resposta */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatTime(attendant.responseTime)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Tempo médio
                      </p>
                    </div>
                  </td>

                  {/* Performance */}
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {attendant.ticketsResolved}/{attendant.ticketsTotal}
                        </p>
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      </div>
                      <p className="text-xs text-green-600">
                        {((attendant.ticketsResolved / attendant.ticketsTotal) * 100).toFixed(0)}% resolvidos
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Resolução: {formatTime(attendant.resolutionTime)}
                      </p>
                    </div>
                  </td>

                  {/* Entrada */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDate(attendant.joinedAt)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Horário: {attendant.workingHours}
                      </p>
                    </div>
                  </td>

                  {/* Ações */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onAttendantSelect(attendant)
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('✏️ Editar atendente:', attendant.id)
                        }}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Editar atendente"
                      >
                        <Edit3 className="w-4 h-4 text-blue-600" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('⚙️ Mais opções:', attendant.id)
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        title="Mais opções"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
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
