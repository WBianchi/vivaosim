'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronUp, 
  ChevronDown,
  Eye,
  PenTool,
  ExternalLink,
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Edit3,
  DollarSign,
  User,
  Calendar
} from 'lucide-react'

interface ContractsTableProps {
  contracts: any[]
  onContractSelect: (contract: any) => void
  onSignatureRequest: (contract: any) => void
}

type SortField = 'title' | 'client' | 'agent' | 'value' | 'status' | 'createdAt' | 'expiresAt'
type SortDirection = 'asc' | 'desc'

export const ContractsTable: React.FC<ContractsTableProps> = ({
  contracts,
  onContractSelect,
  onSignatureRequest
}) => {
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedContracts = [...contracts].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortField) {
      case 'title':
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      case 'client':
        aValue = a.client.name.toLowerCase()
        bValue = b.client.name.toLowerCase()
        break
      case 'agent':
        aValue = a.agent.name.toLowerCase()
        bValue = b.agent.name.toLowerCase()
        break
      case 'value':
        aValue = a.value
        bValue = b.value
        break
      case 'status':
        aValue = a.status
        bValue = b.status
        break
      case 'createdAt':
      case 'expiresAt':
        aValue = new Date(a[sortField]).getTime()
        bValue = new Date(b[sortField]).getTime()
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

  const getSignatureProgress = (signatures: any[]) => {
    if (!signatures) return { signed: 0, total: 0, percentage: 0 }
    
    const signed = signatures.filter((sig: any) => sig.status === 'signed').length
    const total = signatures.length
    const percentage = total > 0 ? (signed / total) * 100 : 0
    
    return { signed, total, percentage }
  }

  const isExpiringSoon = (expiresAt: string) => {
    const expirationDate = new Date(expiresAt)
    const today = new Date()
    const diffTime = expirationDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-orange-600 transition-colors"
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
                <SortButton field="title">Contrato</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="client">Cliente</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="value">Valor</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="status">Status</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                Assinaturas
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="agent">Agente</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="expiresAt">Expira</SortButton>
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {sortedContracts.map((contract, index) => {
              const statusConfig = getStatusConfig(contract.status)
              const signatureProgress = getSignatureProgress(contract.signatures)
              const expiringSoon = isExpiringSoon(contract.expiresAt)

              return (
                <motion.tr
                  key={contract.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => onContractSelect(contract)}
                >
                  {/* Contrato */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                          {contract.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(contract.createdAt)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Cliente */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                        {contract.client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {contract.client.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {contract.client.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Valor */}
                  <td className="px-6 py-4">
                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">
                        {formatCurrency(contract.value)}
                      </p>
                      {contract.terms?.duration && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {contract.terms.duration}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      <statusConfig.icon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                  </td>

                  {/* Assinaturas */}
                  <td className="px-6 py-4">
                    <div className="w-24">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {signatureProgress.signed}/{signatureProgress.total}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {Math.round(signatureProgress.percentage)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            signatureProgress.percentage === 100 ? 'bg-green-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${signatureProgress.percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Agente */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {contract.agent.name}
                      </span>
                    </div>
                  </td>

                  {/* Expira */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-4 h-4 ${expiringSoon ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`} />
                      <span className={`text-sm ${expiringSoon ? 'text-red-600 font-medium' : 'text-gray-900 dark:text-white'}`}>
                        {formatDate(contract.expiresAt)}
                      </span>
                    </div>
                    {expiringSoon && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3 text-red-600" />
                        <span className="text-xs text-red-600 font-medium">
                          Expira em breve
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Ações */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onContractSelect(contract)
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </motion.button>

                      {contract.status === 'pending_signature' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            onSignatureRequest(contract)
                          }}
                          className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                          title="Gerenciar assinaturas"
                        >
                          <PenTool className="w-4 h-4 text-purple-600" />
                        </motion.button>
                      )}

                      {contract.signatureUrl && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(contract.signatureUrl, '_blank')
                          }}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Abrir documento"
                        >
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                        </motion.button>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('⚙️ Mais opções:', contract.id)
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
