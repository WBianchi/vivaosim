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
  TrendingUp,
  Eye,
  Globe,
  ExternalLink
} from 'lucide-react'
import { EditClientModal } from './EditClientModal'
import { ViewAllClientModal } from './ViewAllClientModal'

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
  const [activeTab, setActiveTab] = useState<'overview'>('overview')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewAllModal, setShowViewAllModal] = useState(false)
  const [clientData, setClientData] = useState(client)
  const [siteData, setSiteData] = useState<any>(null)

  useEffect(() => {
    setIsVisible(true)
    fetchSiteData()
  }, [])

  const fetchSiteData = async () => {
    try {
      const response = await fetch(`/api/contacts/${client.id}/site`)
      const data = await response.json()
      if (data.success && data.site) {
        setSiteData(data.site)
      }
    } catch (error) {
      console.error('Erro ao buscar site:', error)
    }
  }

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

  const formatCurrency = (value?: number) => {
    if (!value) return 'R$ 0,00'
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
    <>
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowViewAllModal(true)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Ver Tudo
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEditModal(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <Edit3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.button>
                
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
                        {client.contracts?.length || 0}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        {client.contracts?.filter((c: any) => c.status === 'active').length || 0} ativos
                      </p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Tickets</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                        {client.tickets?.length || 0}
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">
                        {client.tickets?.filter((t: any) => t.status === 'resolved').length || 0} resolvidos
                      </p>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Reuniões</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                        {client.meetings?.length || 0}
                      </p>
                      <p className="text-xs text-orange-600 dark:text-orange-400">
                        {client.meetings?.filter((m: any) => m.status === 'scheduled').length || 0} agendadas
                      </p>
                    </div>
                  </div>

                  {/* Site do Cliente */}
                  {siteData && (
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-xl border-2 border-orange-200 dark:border-orange-700">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-orange-500 rounded-xl">
                            <Globe className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Site do Evento</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{siteData.nomeEvento}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          siteData.status === 'PUBLICADO' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {siteData.status}
                        </span>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Globe className="w-5 h-5 text-orange-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">URL do Site</p>
                            <a
                              href={`https://${siteData.subdominio}.vivaosim.com.br`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition truncate block"
                            >
                              {siteData.subdominio}.vivaosim.com.br
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`https://${siteData.subdominio}.vivaosim.com.br`)
                              alert('✅ Link copiado!')
                            }}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                            title="Copiar link"
                          >
                            <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <a
                            href={`https://${siteData.subdominio}.vivaosim.com.br`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                            title="Abrir site"
                          >
                            <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </a>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{siteData.visualizacoes || 0}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Visualizações</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{siteData.produtos?.length || 0}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Presentes</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{siteData.convidados?.length || 0}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Convidados</p>
                        </div>
                      </div>
                    </div>
                  )}

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
                              {client.address?.street}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {client.address?.city}, {client.address?.state} - {client.address?.zipCode}
                            </p>
                          </div>
                        )}

                        {client.documents?.cpf && (
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

                        {client.documents?.cnpj && (
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
                  {client.subscription?.status !== 'none' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                      <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-4">
                        Assinatura Atual
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-blue-600 dark:text-blue-400">Plano</p>
                          <p className="font-bold text-blue-800 dark:text-blue-200">
                            {client.subscription?.plan}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-blue-600 dark:text-blue-400">Valor Mensal</p>
                          <p className="font-bold text-blue-800 dark:text-blue-200">
                            {formatCurrency(client.subscription?.value || 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-blue-600 dark:text-blue-400">Vencimento</p>
                          <p className="font-bold text-blue-800 dark:text-blue-200">
                            {client.subscription?.endDate ? formatDate(client.subscription.endDate) : 'N/A'}
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
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

      {/* Modals */}
      {showEditModal && (
        <EditClientModal
          client={client}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false)
            window.location.reload() // Recarrega para atualizar dados
          }}
        />
      )}

      {showViewAllModal && (
        <ViewAllClientModal
          clientId={client.id}
          clientName={client.name}
          onClose={() => setShowViewAllModal(false)}
        />
      )}
    </>
  )
}
