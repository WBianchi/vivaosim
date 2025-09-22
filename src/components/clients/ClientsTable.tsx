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
  Building,
  Crown,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  FileText,
  MessageSquare,
  Users,
  Star,
  MapPin
} from 'lucide-react'

interface ClientsTableProps {
  clients: any[]
  onClientSelect: (client: any) => void
}

type SortField = 'name' | 'company' | 'status' | 'type' | 'totalValue' | 'lastContact' | 'createdAt' | 'priority'
type SortDirection = 'asc' | 'desc'

export const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  onClientSelect
}) => {
  const [sortField, setSortField] = useState<SortField>('lastContact')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedClients = [...clients].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'company':
        aValue = (a.company || '').toLowerCase()
        bValue = (b.company || '').toLowerCase()
        break
      case 'status':
        aValue = a.status
        bValue = b.status
        break
      case 'type':
        aValue = a.type
        bValue = b.type
        break
      case 'totalValue':
        aValue = a.totalValue
        bValue = b.totalValue
        break
      case 'lastContact':
        aValue = new Date(a.lastContact).getTime()
        bValue = new Date(b.lastContact).getTime()
        break
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
        break
      case 'priority':
        const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 }
        aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
        bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
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

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
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
      case 'pending':
        return {
          label: 'Pendente',
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100'
        }
      case 'blocked':
        return {
          label: 'Bloqueado',
          icon: AlertTriangle,
          color: 'text-red-600',
          bg: 'bg-red-100'
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

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'individual':
        return { label: 'PF', color: 'text-blue-600', bg: 'bg-blue-100', icon: User }
      case 'company':
        return { label: 'PJ', color: 'text-purple-600', bg: 'bg-purple-100', icon: Building }
      case 'vip':
        return { label: 'VIP', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Crown }
      case 'prospect':
        return { label: 'Prospect', color: 'text-orange-600', bg: 'bg-orange-100', icon: Star }
      default:
        return { label: 'Outros', color: 'text-gray-600', bg: 'bg-gray-100', icon: User }
    }
  }

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'low':
        return { label: 'Baixa', color: 'bg-gray-500' }
      case 'medium':
        return { label: 'Média', color: 'bg-blue-500' }
      case 'high':
        return { label: 'Alta', color: 'bg-orange-500' }
      case 'urgent':
        return { label: 'Urgente', color: 'bg-red-500' }
      default:
        return { label: 'Normal', color: 'bg-gray-500' }
    }
  }

  const getSubscriptionConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Ativa', color: 'text-green-600' }
      case 'trial':
        return { label: 'Teste', color: 'text-blue-600' }
      case 'expired':
        return { label: 'Expirada', color: 'text-orange-600' }
      case 'cancelled':
        return { label: 'Cancelada', color: 'text-red-600' }
      case 'none':
        return { label: 'Sem Assinatura', color: 'text-gray-600' }
      default:
        return { label: 'Desconhecido', color: 'text-gray-600' }
    }
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-green-600 transition-colors"
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
                <SortButton field="name">Cliente</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="type">Tipo</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="status">Status</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                Assinatura
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="totalValue">Valor Total</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                Atendente
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="lastContact">Último Contato</SortButton>
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {sortedClients.map((client, index) => {
              const statusConfig = getStatusConfig(client.status)
              const typeConfig = getTypeConfig(client.type)
              const priorityConfig = getPriorityConfig(client.priority)
              const subscriptionConfig = getSubscriptionConfig(client.subscription.status)
              const isVip = client.type === 'vip'
              const hasHighValue = client.totalValue > 1000

              return (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                    isVip ? 'bg-yellow-50 dark:bg-yellow-900/10' : 
                    hasHighValue ? 'bg-green-50 dark:bg-green-900/10' : ''
                  }`}
                  onClick={() => onClientSelect(client)}
                >
                  {/* Cliente */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`w-10 h-10 ${statusConfig.bg} rounded-lg flex items-center justify-center`}>
                          {client.avatar ? (
                            <img 
                              src={client.avatar} 
                              alt={client.name}
                              className="w-full h-full rounded-lg object-cover"
                            />
                          ) : (
                            <typeConfig.icon className={`w-5 h-5 ${typeConfig.color}`} />
                          )}
                        </div>
                        <div className={`absolute -top-1 -right-1 w-3 h-3 ${priorityConfig.color} rounded-full border-2 border-white dark:border-gray-800`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                            {client.name}
                          </p>
                          {isVip && (
                            <Crown className="w-4 h-4 text-yellow-600" />
                          )}
                          {hasHighValue && !isVip && (
                            <DollarSign className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500 line-clamp-1">{client.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{client.phone}</span>
                          </div>
                        </div>
                        {client.company && (
                          <div className="flex items-center gap-1 mt-1">
                            <Building className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500 line-clamp-1">{client.company}</span>
                          </div>
                        )}
                        {client.address && (
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{client.address.city}, {client.address.state}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Tipo */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${typeConfig.bg} ${typeConfig.color}`}>
                      <typeConfig.icon className="w-3 h-3" />
                      {typeConfig.label}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      <statusConfig.icon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                  </td>

                  {/* Assinatura */}
                  <td className="px-6 py-4">
                    <div>
                      {client.subscription.status !== 'none' ? (
                        <>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {client.subscription.plan}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs ${subscriptionConfig.color} font-medium`}>
                              {subscriptionConfig.label}
                            </span>
                            {client.subscription.value > 0 && (
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {formatCurrency(client.subscription.value)}
                              </span>
                            )}
                          </div>
                          {client.subscription.endDate && (
                            <p className="text-xs text-gray-500 mt-1">
                              até {formatDate(client.subscription.endDate)}
                            </p>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">Sem assinatura</span>
                      )}
                    </div>
                  </td>

                  {/* Valor Total */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(client.totalValue)}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{client.contracts.length}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{client.tickets.length}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{client.meetings.length}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Atendente */}
                  <td className="px-6 py-4">
                    {client.attendantName ? (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {client.attendantName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Não atribuído</span>
                    )}
                  </td>

                  {/* Último Contato */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDate(client.lastContact)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Cliente desde: {formatDate(client.createdAt)}
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
                          onClientSelect(client)
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
                          console.log('✏️ Editar cliente:', client.id)
                        }}
                        className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                        title="Editar cliente"
                      >
                        <Edit3 className="w-4 h-4 text-green-600" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('⚙️ Mais opções:', client.id)
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
