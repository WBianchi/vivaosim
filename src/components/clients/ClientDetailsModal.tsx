'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Users, 
  Edit3,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  Clock,
  Crown,
  Copy,
  Settings,
  CheckCircle,
  AlertTriangle,
  Star,
  TrendingUp
} from 'lucide-react'

interface ClientDetailsModalProps {
  client: any
  onClose: () => void
  onEdit?: () => void
}

export const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
  client,
  onClose,
  onEdit
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'contracts' | 'tickets' | 'meetings'>('overview')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-BR')
  }

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Ativo', color: 'text-green-600', bg: 'bg-green-100' }
      case 'inactive':
        return { label: 'Inativo', color: 'text-gray-600', bg: 'bg-gray-100' }
      case 'pending':
        return { label: 'Pendente', color: 'text-yellow-600', bg: 'bg-yellow-100' }
      case 'blocked':
        return { label: 'Bloqueado', color: 'text-red-600', bg: 'bg-red-100' }
      default:
        return { label: 'Desconhecido', color: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  const statusConfig = getStatusConfig(client.status)
  const isVip = client.type === 'vip'

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
            className="relative w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shadow-sm">
                    {client.avatar ? (
                      <img 
                        src={client.avatar} 
                        alt={client.name}
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      <Users className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  {isVip && (
                    <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {client.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                    {client.company && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {client.company}
                      </span>
                    )}
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

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {[
                { id: 'overview', label: 'Visão Geral', icon: User },
                { id: 'contracts', label: 'Contratos', icon: FileText },
                { id: 'tickets', label: 'Tickets', icon: MessageSquare },
                { id: 'meetings', label: 'Reuniões', icon: Calendar }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-green-600 border-b-2 border-green-600 bg-green-50 dark:bg-green-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Métricas Principais */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">Valor Total</span>
                      </div>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {formatCurrency(client.totalValue)}
                      </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Contratos</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {client.contracts.length}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        {client.contracts.filter((c: any) => c.status === 'active').length} ativos
                      </p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Tickets</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                        {client.tickets.length}
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">
                        {client.tickets.filter((t: any) => t.status === 'resolved').length} resolvidos
                      </p>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Reuniões</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                        {client.meetings.length}
                      </p>
                      <p className="text-xs text-orange-600 dark:text-orange-400">
                        {client.meetings.filter((m: any) => m.status === 'scheduled').length} agendadas
                      </p>
                    </div>
                  </div>

                  {/* Informações Pessoais */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Informações de Contato
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Mail className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</span>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {client.email}
                          </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Phone className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</span>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {client.phone}
                          </p>
                        </div>

                        {client.company && (
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <Building className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Empresa</span>
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {client.company}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Endereço e Documentos
                      </h3>
                      <div className="space-y-4">
                        {client.address && (
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Endereço</span>
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {client.address.street}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {client.address.city}, {client.address.state} - {client.address.zipCode}
                            </p>
                          </div>
                        )}

                        {client.documents.cpf && (
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CPF</span>
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {client.documents.cpf}
                            </p>
                          </div>
                        )}

                        {client.documents.cnpj && (
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <Building className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CNPJ</span>
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {client.documents.cnpj}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Assinatura Atual */}
                  {client.subscription.status !== 'none' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                      <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-4">
                        Assinatura Atual
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-blue-600 dark:text-blue-400">Plano</p>
                          <p className="font-bold text-blue-800 dark:text-blue-200">
                            {client.subscription.plan}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-blue-600 dark:text-blue-400">Valor Mensal</p>
                          <p className="font-bold text-blue-800 dark:text-blue-200">
                            {formatCurrency(client.subscription.value)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-blue-600 dark:text-blue-400">Vencimento</p>
                          <p className="font-bold text-blue-800 dark:text-blue-200">
                            {client.subscription.endDate ? formatDate(client.subscription.endDate) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tags e Notas */}
                  {(client.tags?.length > 0 || client.notes) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {client.tags?.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {client.tags.map((tag: string) => (
                              <span 
                                key={tag}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {client.notes && (
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Observações</h3>
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl">
                            <p className="text-gray-700 dark:text-gray-300">{client.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Contracts Tab */}
              {activeTab === 'contracts' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Contratos ({client.contracts.length})
                  </h3>
                  {client.contracts.length > 0 ? (
                    <div className="space-y-3">
                      {client.contracts.map((contract: any) => (
                        <div key={contract.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {contract.title}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              contract.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {contract.status === 'active' ? 'Ativo' : 'Expirado'}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Valor</p>
                              <p className="font-medium">{formatCurrency(contract.value)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Início</p>
                              <p className="font-medium">{formatDate(contract.startDate)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Fim</p>
                              <p className="font-medium">{formatDate(contract.endDate)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Nenhum contrato encontrado</p>
                  )}
                </div>
              )}

              {/* Tickets Tab */}
              {activeTab === 'tickets' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Tickets de Suporte ({client.tickets.length})
                  </h3>
                  {client.tickets.length > 0 ? (
                    <div className="space-y-3">
                      {client.tickets.map((ticket: any) => (
                        <div key={ticket.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {ticket.title}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              ticket.status === 'resolved' ? 'bg-green-100 text-green-700' : 
                              ticket.status === 'escalated' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {ticket.status === 'resolved' ? 'Resolvido' : 
                               ticket.status === 'escalated' ? 'Escalado' : 'Em Andamento'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Prioridade: {ticket.priority === 'high' ? 'Alta' : ticket.priority === 'medium' ? 'Média' : 'Baixa'}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {formatDateTime(ticket.createdAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Nenhum ticket encontrado</p>
                  )}
                </div>
              )}

              {/* Meetings Tab */}
              {activeTab === 'meetings' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Reuniões ({client.meetings.length})
                  </h3>
                  {client.meetings.length > 0 ? (
                    <div className="space-y-3">
                      {client.meetings.map((meeting: any) => (
                        <div key={meeting.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {meeting.title}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              meeting.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {meeting.status === 'scheduled' ? 'Agendada' : 'Realizada'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDateTime(meeting.date)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Nenhuma reunião encontrada</p>
                  )}
                </div>
              )}

              {/* Ações */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigator.clipboard.writeText(client.id)
                    console.log('📋 ID copiado:', client.id)
                  }}
                  className="px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copiar ID
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (onEdit) {
                      onEdit()
                      handleClose()
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar Cliente
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    console.log('⚙️ Configurações:', client.id)
                  }}
                  className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Configurar
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
