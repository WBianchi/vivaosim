'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { 
  X, 
  Tag, 
  Search,
  Filter,
  Plus
} from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'

interface AllTagsSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatId?: string // Opcional: se passar, filtra apenas tags desse chat
}

export function AllTagsSidebar({ isOpen, onClose, chatId }: AllTagsSidebarProps) {
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    if (isOpen) {
      fetchTags()
    }
  }, [isOpen, chatId])

  const fetchTags = async () => {
    setLoading(true)
    try {
      const token = getAuthToken()
      if (!token) {
        console.log('⚠️ AllTagsSidebar: Token não encontrado')
        setLoading(false)
        return
      }

      // Se chatId foi passado, buscar apenas tags desse chat
      if (chatId) {
        console.log(`🔍 AllTagsSidebar: Buscando tags do chat ${chatId}...`)
        
        const response = await fetch(`/api/tags/by-chats?chatIds=${chatId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        
        console.log('📊 AllTagsSidebar: Resposta da API (chat específico):', data)
        
        if (data.success) {
          const chatTags = data.tagsByChat[chatId] || []
          setTags(chatTags)
          console.log(`✅ AllTagsSidebar: ${chatTags.length} tags do chat carregadas`)
        }
      } else {
        // Buscar todas as tags
        console.log('🔍 AllTagsSidebar: Buscando todas as tags...')

        const response = await fetch('/api/tags', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        
        console.log('📊 AllTagsSidebar: Resposta da API (todas):', data)
        
        if (data.tags) {
          setTags(data.tags || [])
          console.log(`✅ AllTagsSidebar: ${data.tags?.length || 0} tags carregadas`)
        }
      }
    } catch (error) {
      console.error('❌ AllTagsSidebar: Erro ao buscar tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || tag.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <Dialog.Content className="fixed right-0 top-0 h-full w-[480px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {chatId ? 'Tags deste Chat' : 'Todas as Tags'}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {chatId ? 'Tags desta conversa' : 'Gerencie suas tags'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Filtros */}
            <div className="p-4 space-y-3 border-b border-gray-200 dark:border-gray-700">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filtro de Categoria */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas Categorias</option>
                  <option value="CLIENTE">Cliente</option>
                  <option value="LEAD">Lead</option>
                  <option value="ORCAMENTO">Orçamento</option>
                  <option value="CONTRATO">Contrato</option>
                  <option value="TICKET">Ticket</option>
                </select>
              </div>
            </div>

            {/* Lista de Tags */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredTags.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Tag className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma tag encontrada</p>
                </div>
              ) : (
                filteredTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: tag.color + '20' }}
                        >
                          <Tag className="w-4 h-4" style={{ color: tag.color }} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {tag.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {tag.category}
                          </p>
                        </div>
                      </div>
                      <div 
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{ 
                          backgroundColor: tag.color + '20',
                          color: tag.color
                        }}
                      >
                        {tag.name}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer com botão de criar */}
            {!chatId && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  Nova Tag
                </button>
              </div>
            )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
