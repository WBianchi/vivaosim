'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Tag, 
  User, 
  Calendar, 
  Edit3,
  Trash2,
  TrendingUp,
  Hash,
  Activity,
  FileText,
  DollarSign,
  Clock,
  Ticket,
  BarChart3,
  Palette
} from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'

interface TagDetailsModalProps {
  tag: any
  onClose: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export const TagDetailsModal: React.FC<TagDetailsModalProps> = ({
  tag,
  onClose,
  onEdit,
  onDelete
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta tag?')) return
    
    setDeleting(true)
    try {
      const token = getAuthToken()
      if (!token) {
        alert('Token de autenticação não encontrado')
        return
      }

      const response = await fetch(`/api/tags?id=${tag.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        if (onDelete) onDelete()
        handleClose()
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao excluir tag')
      }
    } catch (error) {
      console.error('Erro ao excluir tag:', error)
      alert('Erro ao excluir tag')
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-BR')
  }

  const getColorConfig = (color: string) => {
    switch (color) {
      case 'red':
        return {
          bg: 'bg-red-500',
          lightBg: 'bg-red-100',
          text: 'text-red-700',
          name: 'Vermelho'
        }
      case 'orange':
        return {
          bg: 'bg-orange-500',
          lightBg: 'bg-orange-100',
          text: 'text-orange-700',
          name: 'Laranja'
        }
      case 'yellow':
        return {
          bg: 'bg-yellow-500',
          lightBg: 'bg-yellow-100',
          text: 'text-yellow-700',
          name: 'Amarelo'
        }
      case 'green':
        return {
          bg: 'bg-green-500',
          lightBg: 'bg-green-100',
          text: 'text-green-700',
          name: 'Verde'
        }
      case 'blue':
        return {
          bg: 'bg-blue-500',
          lightBg: 'bg-blue-100',
          text: 'text-blue-700',
          name: 'Azul'
        }
      case 'purple':
        return {
          bg: 'bg-purple-500',
          lightBg: 'bg-purple-100',
          text: 'text-purple-700',
          name: 'Roxo'
        }
      case 'pink':
        return {
          bg: 'bg-pink-500',
          lightBg: 'bg-pink-100',
          text: 'text-pink-700',
          name: 'Rosa'
        }
      case 'gray':
        return {
          bg: 'bg-gray-500',
          lightBg: 'bg-gray-100',
          text: 'text-gray-700',
          name: 'Cinza'
        }
      default:
        return {
          bg: 'bg-orange-500',
          lightBg: 'bg-orange-100',
          text: 'text-orange-700',
          name: 'Laranja'
        }
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'projeto':
        return Hash
      case 'cliente':
        return User
      case 'status':
        return Activity
      case 'prioridade':
        return TrendingUp
      default:
        return Tag
    }
  }

  const getUsageLevel = (count: number) => {
    if (count >= 50) return { label: 'Muito Alta', color: 'text-green-600', bg: 'bg-green-100' }
    if (count >= 10) return { label: 'Moderada', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    if (count >= 1) return { label: 'Baixa', color: 'text-orange-600', bg: 'bg-orange-100' }
    return { label: 'Não Usada', color: 'text-gray-600', bg: 'bg-gray-100' }
  }

  const colorConfig = getColorConfig(tag.color)
  const CategoryIcon = getCategoryIcon(tag.category || 'general')
  const usageLevel = getUsageLevel(tag.usageCount || 0)
  
  // Valores padrão para relatedItems caso não existam
  const relatedItems = tag.relatedItems || {
    contracts: 0,
    quotes: 0,
    schedules: 0,
    tickets: 0
  }
  const totalItems = Object.values(relatedItems).reduce((sum: number, count: any) => sum + (count as number), 0)

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
            className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${colorConfig.bg} rounded-xl flex items-center justify-center text-white shadow-sm`}>
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {tag.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <CategoryIcon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {tag.category}
                    </span>
                    <span className={`px-2 py-1 ${colorConfig.lightBg} ${colorConfig.text} rounded-full text-xs font-medium`}>
                      {tag.status === 'active' ? 'Ativa' : 'Inativa'}
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
                    title="Editar"
                  >
                    <Edit3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                )}
                
                {onDelete && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    disabled={deleting}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl transition-colors disabled:opacity-50"
                    title="Excluir"
                  >
                    <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
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
              {/* Descrição */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Descrição
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <p className="text-gray-700 dark:text-gray-300">
                    {tag.description}
                  </p>
                </div>
              </div>

              {/* Estatísticas de Uso */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Estatísticas de Uso
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Uso Geral */}
                  <div className={`${colorConfig.lightBg} p-6 rounded-xl`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className={`w-5 h-5 ${colorConfig.text}`} />
                        <span className={`font-medium ${colorConfig.text}`}>
                          Frequência de Uso
                        </span>
                      </div>
                      <span className={`px-3 py-1 ${usageLevel.bg} ${usageLevel.color} rounded-full text-sm font-medium`}>
                        {usageLevel.label}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className={`text-4xl font-bold ${colorConfig.text} mb-2`}>
                        {tag.usageCount}
                      </p>
                      <p className={`text-sm ${colorConfig.text}`}>
                        usos totais
                      </p>
                    </div>
                  </div>

                  {/* Total de Itens */}
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-4">
                      <Hash className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-700 dark:text-green-300">
                        Itens Relacionados
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-green-700 dark:text-green-300 mb-2">
                        {totalItems}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        itens marcados
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalhamento por Tipo */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Distribuição por Tipo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Contratos</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {relatedItems.contracts}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {totalItems > 0 ? Math.round((relatedItems.contracts / totalItems) * 100) : 0}% do total
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">Orçamentos</span>
                    </div>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {relatedItems.quotes}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {totalItems > 0 ? Math.round((relatedItems.quotes / totalItems) * 100) : 0}% do total
                    </p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Agendamentos</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {relatedItems.schedules}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">
                      {totalItems > 0 ? Math.round((relatedItems.schedules / totalItems) * 100) : 0}% do total
                    </p>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Ticket className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Tickets</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                      {relatedItems.tickets}
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-400">
                      {totalItems > 0 ? Math.round((relatedItems.tickets / totalItems) * 100) : 0}% do total
                    </p>
                  </div>
                </div>
              </div>

              {/* Informações da Tag */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Informações da Tag
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-4 h-4 ${colorConfig.bg} rounded-full`}></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cor</span>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {colorConfig.name}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CategoryIcon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</span>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white capitalize">
                      {tag.category}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {tag.status === 'active' ? 'Ativa' : 'Inativa'}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Criado por</span>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {tag.createdBy.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Datas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Criado</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDateTime(tag.createdAt)}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Última Atualização</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDateTime(tag.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
                  Editar Tag
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    console.log('📊 Ver relatório detalhado:', tag.id)
                  }}
                  className="px-4 py-3 border border-blue-300 hover:bg-blue-50 text-blue-600 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Relatório
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    console.log('🔍 Ver itens relacionados:', tag.id)
                  }}
                  className="px-4 py-3 border border-green-300 hover:bg-green-50 text-green-600 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Hash className="w-4 h-4" />
                  Ver Itens
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
