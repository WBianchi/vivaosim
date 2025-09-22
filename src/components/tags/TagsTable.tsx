'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronUp, 
  ChevronDown,
  Eye,
  Edit3,
  MoreVertical,
  Tag,
  TrendingUp,
  User,
  Calendar,
  Hash,
  Activity
} from 'lucide-react'

interface TagsTableProps {
  tags: any[]
  onTagSelect: (tag: any) => void
}

type SortField = 'name' | 'category' | 'usageCount' | 'status' | 'createdAt'
type SortDirection = 'asc' | 'desc'

export const TagsTable: React.FC<TagsTableProps> = ({
  tags,
  onTagSelect
}) => {
  const [sortField, setSortField] = useState<SortField>('usageCount')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedTags = [...tags].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'category':
        aValue = a.category.toLowerCase()
        bValue = b.category.toLowerCase()
        break
      case 'usageCount':
        aValue = a.usageCount
        bValue = b.usageCount
        break
      case 'status':
        aValue = a.status
        bValue = b.status
        break
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
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

  const getColorConfig = (color: string) => {
    switch (color) {
      case 'red':
        return { bg: 'bg-red-500', text: 'text-red-700', lightBg: 'bg-red-100' }
      case 'orange':
        return { bg: 'bg-orange-500', text: 'text-orange-700', lightBg: 'bg-orange-100' }
      case 'yellow':
        return { bg: 'bg-yellow-500', text: 'text-yellow-700', lightBg: 'bg-yellow-100' }
      case 'green':
        return { bg: 'bg-green-500', text: 'text-green-700', lightBg: 'bg-green-100' }
      case 'blue':
        return { bg: 'bg-blue-500', text: 'text-blue-700', lightBg: 'bg-blue-100' }
      case 'purple':
        return { bg: 'bg-purple-500', text: 'text-purple-700', lightBg: 'bg-purple-100' }
      case 'pink':
        return { bg: 'bg-pink-500', text: 'text-pink-700', lightBg: 'bg-pink-100' }
      case 'gray':
        return { bg: 'bg-gray-500', text: 'text-gray-700', lightBg: 'bg-gray-100' }
      default:
        return { bg: 'bg-orange-500', text: 'text-orange-700', lightBg: 'bg-orange-100' }
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
                <SortButton field="name">Tag</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="category">Categoria</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                Cor
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="usageCount">Uso</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                Itens Relacionados
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="status">Status</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <SortButton field="createdAt">Criado</SortButton>
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {sortedTags.map((tag, index) => {
              const colorConfig = getColorConfig(tag.color)
              const CategoryIcon = getCategoryIcon(tag.category)
              const usageLevel = getUsageLevel(tag.usageCount)
              const totalItems = Object.values(tag.relatedItems).reduce((sum: number, count: any) => sum + count, 0)

              return (
                <motion.tr
                  key={tag.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => onTagSelect(tag)}
                >
                  {/* Tag */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${colorConfig.bg} rounded-lg flex items-center justify-center text-white`}>
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {tag.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                          {tag.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Categoria */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white capitalize">
                        {tag.category}
                      </span>
                    </div>
                  </td>

                  {/* Cor */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 ${colorConfig.bg} rounded-full`}></div>
                      <span className="text-sm text-gray-900 dark:text-white capitalize">
                        {tag.color}
                      </span>
                    </div>
                  </td>

                  {/* Uso */}
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg text-gray-900 dark:text-white">
                          {tag.usageCount}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          usos
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${usageLevel.bg} ${usageLevel.color}`}>
                        {usageLevel.label}
                      </span>
                    </div>
                  </td>

                  {/* Itens Relacionados */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Total:
                        </span>
                        <span className="text-sm font-bold text-orange-600">
                          {totalItems}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <div>Contratos: {tag.relatedItems.contracts}</div>
                        <div>Orçamentos: {tag.relatedItems.quotes}</div>
                        <div>Agendamentos: {tag.relatedItems.schedules}</div>
                        <div>Tickets: {tag.relatedItems.tickets}</div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      tag.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      <Activity className="w-3 h-3" />
                      {tag.status === 'active' ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>

                  {/* Criado */}
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {formatDate(tag.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                          {tag.createdBy.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {tag.createdBy.name}
                        </span>
                      </div>
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
                          onTagSelect(tag)
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
                          console.log('✏️ Editar tag:', tag.id)
                        }}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Editar tag"
                      >
                        <Edit3 className="w-4 h-4 text-blue-600" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('⚙️ Mais opções:', tag.id)
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
