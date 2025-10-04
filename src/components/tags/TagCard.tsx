'use client'

import { motion } from 'framer-motion'
import { 
  Tag, 
  TrendingUp, 
  User, 
  Calendar,
  MoreVertical,
  Eye,
  Edit3,
  Hash,
  Activity,
  FileText,
  DollarSign,
  Clock,
  Ticket
} from 'lucide-react'

interface TagCardProps {
  tag: any
  index: number
  onClick: () => void
}

export const TagCard: React.FC<TagCardProps> = ({
  tag,
  index,
  onClick
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const getColorConfig = (color: string) => {
    // Aceita hex colors
    const isHex = color.startsWith('#')
    if (isHex) {
      return {
        bg: 'bg-orange-500',
        lightBg: 'bg-orange-100',
        text: 'text-orange-700',
        border: 'border-orange-200',
        hex: color
      }
    }

    switch (color) {
      case 'red':
        return {
          bg: 'bg-red-500',
          lightBg: 'bg-red-100',
          text: 'text-red-700',
          border: 'border-red-200'
        }
      case 'orange':
        return {
          bg: 'bg-orange-500',
          lightBg: 'bg-orange-100',
          text: 'text-orange-700',
          border: 'border-orange-200'
        }
      case 'yellow':
        return {
          bg: 'bg-yellow-500',
          lightBg: 'bg-yellow-100',
          text: 'text-yellow-700',
          border: 'border-yellow-200'
        }
      case 'green':
        return {
          bg: 'bg-green-500',
          lightBg: 'bg-green-100',
          text: 'text-green-700',
          border: 'border-green-200'
        }
      case 'blue':
        return {
          bg: 'bg-blue-500',
          lightBg: 'bg-blue-100',
          text: 'text-blue-700',
          border: 'border-blue-200'
        }
      case 'purple':
        return {
          bg: 'bg-purple-500',
          lightBg: 'bg-purple-100',
          text: 'text-purple-700',
          border: 'border-purple-200'
        }
      case 'pink':
        return {
          bg: 'bg-pink-500',
          lightBg: 'bg-pink-100',
          text: 'text-pink-700',
          border: 'border-pink-200'
        }
      case 'gray':
        return {
          bg: 'bg-gray-500',
          lightBg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-200'
        }
      default:
        return {
          bg: 'bg-orange-500',
          lightBg: 'bg-orange-100',
          text: 'text-orange-700',
          border: 'border-orange-200'
        }
    }
  }

  const getCategoryIcon = (category?: string) => {
    return Tag
  }

  const getUsageLevel = (count: number) => {
    if (count >= 50) return { label: 'Muito Alta', color: 'text-green-600' }
    if (count >= 10) return { label: 'Moderada', color: 'text-yellow-600' }
    if (count >= 1) return { label: 'Baixa', color: 'text-orange-600' }
    return { label: 'Não Usada', color: 'text-gray-600' }
  }

  const colorConfig = getColorConfig(tag.color)
  const CategoryIcon = getCategoryIcon(tag.category)
  const usageLevel = getUsageLevel(tag.usageCount || 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 ${colorConfig.border} hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${colorConfig.bg} rounded-xl flex items-center justify-center text-white shadow-sm`}>
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                {tag.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <CategoryIcon className="w-3 h-3 text-gray-600" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {tag.usageCount || 0} usos
                </span>
              </div>
            </div>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                console.log('⚙️ Mais opções:', tag.id)
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Descrição */}
        {tag.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {tag.description}
          </p>
        )}

        {/* Estatísticas de Uso */}
        <div className={`${colorConfig.lightBg} p-4 rounded-xl mb-4`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-4 h-4 ${colorConfig.text}`} />
              <span className={`text-sm font-medium ${colorConfig.text}`}>
                Frequência de Uso
              </span>
            </div>
            <span className={`text-xs ${usageLevel.color} font-medium`}>
              {usageLevel.label}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${colorConfig.text}`}>
              {tag.usageCount || 0}
            </span>
            <span className={`text-sm ${colorConfig.text}`}>
              usos
            </span>
          </div>
        </div>

        {/* Chats Relacionados */}
        {tag.chats && tag.chats.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Hash className="w-3 h-3 text-gray-600" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Chats</span>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {tag.chats.length}
            </p>
          </div>
        )}

        {/* Criador */}
        {tag.createdBy && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
              {tag.createdBy.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Criado por {tag.createdBy.name || 'Usuário'}
            </span>
          </div>
        )}

        {/* Data */}
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Criado em {formatDate(tag.createdAt)}
          </span>
        </div>
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
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation()
              console.log('✏️ Editar tag:', tag.id)
            }}
            className="px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Edit3 className="w-3 h-3" />
            Editar
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
