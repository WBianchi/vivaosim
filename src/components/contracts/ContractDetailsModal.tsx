'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  FileText, 
  User, 
  Calendar, 
  Clock,
  Edit3,
  Download,
  Send,
  DollarSign,
  Tag,
  CheckCircle,
  XCircle,
  AlertCircle,
  PenTool,
  Shield,
  ExternalLink,
  Paperclip
} from 'lucide-react'

interface ContractDetailsModalProps {
  contract: any
  onClose: () => void
  onEdit?: () => void
  onSignatureRequest?: () => void
}

export const ContractDetailsModal: React.FC<ContractDetailsModalProps> = ({
  contract,
  onClose,
  onEdit,
  onSignatureRequest
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'draft':
        return {
          label: 'Rascunho',
          icon: Edit3,
          color: 'text-gray-600',
          bg: 'bg-gray-100'
        }
      case 'pending_signature':
        return {
          label: 'Aguardando Assinatura',
          icon: PenTool,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100'
        }
      case 'signed':
        return {
          label: 'Assinado',
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100'
        }
      case 'rejected':
        return {
          label: 'Rejeitado',
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-100'
        }
      case 'expired':
        return {
          label: 'Expirado',
          icon: Clock,
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

  const getSignatureProviderConfig = (provider: string) => {
    switch (provider) {
      case 'docusign':
        return {
          label: 'DocuSign',
          color: 'text-blue-600',
          bg: 'bg-blue-100'
        }
      case 'clicksign':
        return {
          label: 'ClickSign',
          color: 'text-green-600',
          bg: 'bg-green-100'
        }
      case 'internal':
        return {
          label: 'Sistema Interno',
          color: 'text-purple-600',
          bg: 'bg-purple-100'
        }
      case 'physical':
        return {
          label: 'Assinatura Física',
          color: 'text-orange-600',
          bg: 'bg-orange-100'
        }
      default:
        return {
          label: 'Não Definido',
          color: 'text-gray-600',
          bg: 'bg-gray-100'
        }
    }
  }

  const getSignatureStatusConfig = (status: string) => {
    switch (status) {
      case 'signed':
        return {
          label: 'Assinado',
          color: 'text-green-600',
          bg: 'bg-green-100'
        }
      case 'pending':
        return {
          label: 'Pendente',
          color: 'text-yellow-600',
          bg: 'bg-yellow-100'
        }
      case 'rejected':
        return {
          label: 'Rejeitado',
          color: 'text-red-600',
          bg: 'bg-red-100'
        }
      default:
        return {
          label: 'Não Definido',
          color: 'text-gray-600',
          bg: 'bg-gray-100'
        }
    }
  }

  const statusConfig = getStatusConfig(contract.status)
  const providerConfig = getSignatureProviderConfig(contract.signatureProvider)

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
            className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {contract.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${providerConfig.bg} ${providerConfig.color}`}>
                      {providerConfig.label}
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
              {/* Valor e Informações Básicas */}
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl mb-6">
                <div className="text-center">
                  <p className="text-sm text-green-600 dark:text-green-400 mb-2">Valor do Contrato</p>
                  <p className="text-4xl font-bold text-green-700 dark:text-green-300">
                    {formatCurrency(contract.value)}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                    Duração: {contract.terms?.duration || 'Não especificada'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informações do Cliente */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Cliente
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold text-lg">
                        {contract.client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {contract.client.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {contract.client.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p><strong>Documento:</strong> {contract.client.document}</p>
                    </div>
                  </div>
                </div>

                {/* Informações do Agente */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Agente Responsável
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                        {contract.agent.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {contract.agent.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Agente Responsável
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Descrição
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <p className="text-gray-700 dark:text-gray-300">
                    {contract.description}
                  </p>
                </div>
              </div>

              {/* Termos do Contrato */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Termos do Contrato
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Duração</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {contract.terms?.duration || 'Não especificada'}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pagamento</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {contract.terms?.paymentTerms || 'Não especificado'}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Entrega</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {contract.terms?.deliveryDate ? formatDate(contract.terms.deliveryDate) : 'Não especificada'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status das Assinaturas */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <PenTool className="w-5 h-5" />
                  Status das Assinaturas
                </h3>
                <div className="space-y-3">
                  {contract.signatures?.map((signature: any, index: number) => {
                    const sigStatusConfig = getSignatureStatusConfig(signature.status)
                    return (
                      <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              signature.status === 'signed' ? 'bg-green-500' :
                              signature.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {signature.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {signature.email} • {signature.party === 'client' ? 'Cliente' : 'Empresa'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${sigStatusConfig.bg} ${sigStatusConfig.color}`}>
                              {sigStatusConfig.label}
                            </span>
                            {signature.signedAt && (
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDateTime(signature.signedAt)}
                              </p>
                            )}
                            {signature.rejectedAt && (
                              <p className="text-xs text-red-500 mt-1">
                                Rejeitado em {formatDateTime(signature.rejectedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                        {signature.rejectionReason && (
                          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-700 dark:text-red-300">
                              <strong>Motivo da rejeição:</strong> {signature.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Anexos */}
              {contract.attachments && contract.attachments.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Paperclip className="w-5 h-5" />
                    Anexos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {contract.attachments.map((attachment: any, index: number) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {attachment.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {attachment.size}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {contract.tags && contract.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {contract.tags.map((tag: string) => (
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

              {/* Datas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Criado</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(contract.createdAt)}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Atualizado</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(contract.updatedAt)}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Expira</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(contract.expiresAt)}
                  </p>
                </div>

                {contract.signedAt && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">Assinado</span>
                    </div>
                    <p className="font-semibold text-green-700 dark:text-green-300">
                      {formatDate(contract.signedAt)}
                    </p>
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
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
                  Editar Contrato
                </motion.button>
                
                {contract.status === 'pending_signature' && onSignatureRequest && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSignatureRequest()
                      handleClose()
                    }}
                    className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <PenTool className="w-4 h-4" />
                    Gerenciar Assinaturas
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    console.log('📥 Download PDF:', contract.id)
                  }}
                  className="px-4 py-3 border border-green-300 hover:bg-green-50 text-green-600 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </motion.button>

                {contract.signatureUrl && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      window.open(contract.signatureUrl, '_blank')
                    }}
                    className="px-4 py-3 border border-blue-300 hover:bg-blue-50 text-blue-600 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Abrir
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
