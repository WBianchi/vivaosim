'use client'

import { motion } from 'framer-motion'
import { 
  DollarSign, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Eye,
  Edit3,
  Trash2,
  Download
} from 'lucide-react'

interface QuoteCardProps {
  quote: any
  index: number
  onClick: () => void
  onEdit?: (quote: any) => void
  onDelete?: (quoteId: string) => void
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote, index, onClick, onEdit, onDelete }) => {
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
      case 'pending':
        return {
          label: 'Pendente',
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100',
          border: 'border-yellow-200'
        }
      case 'approved':
        return {
          label: 'Aprovado',
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
          icon: AlertCircle,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          border: 'border-gray-200'
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const statusConfig = getStatusConfig(quote.status)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-800 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
              {quote.title}
            </h3>
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(quote.priority)}`} />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {quote.description}
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

      {/* Cliente */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-sm font-semibold">
          {quote.client.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
            {quote.client.name}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
            {quote.client.email}
          </p>
        </div>
      </div>

      {/* Valor */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="text-lg font-bold text-green-600">
            {formatCurrency(quote.value)}
          </span>
        </div>
        
        <div className="text-right">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {quote.items.length} {quote.items.length === 1 ? 'item' : 'itens'}
          </p>
        </div>
      </div>

      {/* Datas e Agente */}
      <div className="space-y-2 mb-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Criado: {formatDate(quote.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Expira: {formatDate(quote.expiresAt)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>Agente: {quote.agent.name}</span>
        </div>
      </div>

      {/* Tags */}
      {quote.tags && quote.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {quote.tags.slice(0, 2).map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {quote.tags.length > 2 && (
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
              +{quote.tags.length - 2}
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
              console.log('👁️ Visualizar orçamento:', quote.id)
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
              onEdit?.(quote)
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
              console.log('📥 Download orçamento:', quote.id)
            }}
            className="p-1.5 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded transition-colors"
            title="Download PDF"
          >
            <Download className="w-3 h-3" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              if (confirm(`Deseja excluir o orçamento "${quote.title}"?`)) {
                onDelete?.(quote.id)
              }
            }}
            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-3 h-3" />
          </motion.button>
        </div>

        <div className="text-xs text-gray-500">
          Atualizado {formatDate(quote.updatedAt)}
        </div>
      </div>
    </motion.div>
  )
}
