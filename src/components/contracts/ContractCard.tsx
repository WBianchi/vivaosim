'use client'

import { motion } from 'framer-motion'
import { 
  FileText, 
  DollarSign, 
  User, 
  Calendar,
  PenTool,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ExternalLink,
  Edit3,
  Eye,
  Trash2
} from 'lucide-react'

interface ContractCardProps {
  contract: any
  index: number
  onClick: () => void
  onSignatureRequest: () => void
  onEdit: () => void
  onDelete: () => void
}

export const ContractCard: React.FC<ContractCardProps> = ({
  contract,
  index,
  onClick,
  onSignatureRequest,
  onEdit,
  onDelete
}) => {
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'draft':
        return {
          label: 'Rascunho',
          icon: Edit3,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          border: 'border-gray-200'
        }
      case 'pending_signature':
        return {
          label: 'Aguardando Assinatura',
          icon: PenTool,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100',
          border: 'border-yellow-200'
        }
      case 'signed':
        return {
          label: 'Assinado',
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100',
          border: 'border-green-200'
        }
      case 'rejected':
        return {
          label: 'Rejeitado',
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-100',
          border: 'border-red-200'
        }
      case 'expired':
        return {
          label: 'Expirado',
          icon: Clock,
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

  const getProviderConfig = (provider: string) => {
    switch (provider) {
      case 'docusign':
        return { label: 'DocuSign', color: 'text-blue-600' }
      case 'clicksign':
        return { label: 'ClickSign', color: 'text-green-600' }
      case 'internal':
        return { label: 'Interno', color: 'text-purple-600' }
      case 'physical':
        return { label: 'Física', color: 'text-orange-600' }
      default:
        return { label: 'N/A', color: 'text-gray-600' }
    }
  }

  const getSignatureProgress = () => {
    if (!contract.signatures) return { signed: 0, total: 0, percentage: 0 }
    
    const signed = contract.signatures.filter((sig: any) => sig.status === 'signed').length
    const total = contract.signatures.length
    const percentage = total > 0 ? (signed / total) * 100 : 0
    
    return { signed, total, percentage }
  }

  const isExpiringSoon = () => {
    const expirationDate = new Date(contract.expiresAt)
    const today = new Date()
    const diffTime = expirationDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0
  }

  const statusConfig = getStatusConfig(contract.status)
  const providerConfig = getProviderConfig(contract.signatureProvider)
  const signatureProgress = getSignatureProgress()
  const expiringSoon = isExpiringSoon()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 ${statusConfig.border} hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-1">
                {contract.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
                <span className={`text-xs font-medium ${providerConfig.color}`}>
                  {providerConfig.label}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                if (confirm('Tem certeza que deseja excluir este contrato?')) {
                  onDelete()
                }
              }}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              title="Excluir"
            >
              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
            </motion.button>
          </div>
        </div>

        {/* Valor */}
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">Valor</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(contract.value)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Cliente */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
            {contract.client.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {contract.client.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {contract.client.email}
            </p>
          </div>
        </div>

        {/* Progresso das Assinaturas */}
        {contract.signatures && contract.signatures.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Assinaturas
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {signatureProgress.signed}/{signatureProgress.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  signatureProgress.percentage === 100 ? 'bg-green-500' : 'bg-orange-500'
                }`}
                style={{ width: `${signatureProgress.percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Agente */}
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {contract.agent.name}
          </span>
        </div>

        {/* Datas */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3 h-3 text-gray-600" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Criado</span>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {formatDate(contract.createdAt)}
            </p>
          </div>
          
          <div className={`p-3 rounded-lg ${expiringSoon ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700'}`}>
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className={`w-3 h-3 ${expiringSoon ? 'text-red-600' : 'text-gray-600'}`} />
              <span className={`text-xs ${expiringSoon ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
                Expira
              </span>
            </div>
            <p className={`text-sm font-medium ${expiringSoon ? 'text-red-700 dark:text-red-300' : 'text-gray-900 dark:text-white'}`}>
              {formatDate(contract.expiresAt)}
            </p>
          </div>
        </div>

        {/* Tags */}
        {contract.tags && contract.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {contract.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {contract.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                +{contract.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Warning para expiração */}
        {expiringSoon && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700 dark:text-red-300 font-medium">
                Expira em breve!
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 pb-6">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
            className="flex-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-3 h-3" />
            Ver Detalhes
          </motion.button>
          
          {contract.status === 'pending_signature' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation()
                onSignatureRequest()
              }}
              className="px-3 py-2 border border-purple-300 hover:bg-purple-50 text-purple-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <PenTool className="w-3 h-3" />
              Assinaturas
            </motion.button>
          )}
          
          {contract.signatureUrl && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation()
                window.open(contract.signatureUrl, '_blank')
              }}
              className="px-3 py-2 border border-blue-300 hover:bg-blue-50 text-blue-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-3 h-3" />
              Abrir
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
