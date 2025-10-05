'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { 
  X, 
  Tag, 
  Plus,
  Save,
  Loader2,
  Palette
} from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'

interface TagSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatId: string
  contactId?: string
  contactName?: string
}

export function TagSidebar({ isOpen, onClose, chatId, contactId, contactName }: TagSidebarProps) {
  const [loading, setLoading] = useState(false)
  const [allTags, setAllTags] = useState<any[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#3B82F6') // azul padrão
  const [showCreateTag, setShowCreateTag] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchTags()
      fetchChatTags()
    }
  }, [isOpen, chatId])

  const fetchTags = async () => {
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch('/api/tags', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setAllTags(data.tags || [])
    } catch (error) {
      console.error('Erro ao buscar tags:', error)
    }
  }

  const fetchChatTags = async () => {
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch(`/api/tags/by-chats?chatIds=${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success && data.tagsByChat[chatId]) {
        const tagIds = data.tagsByChat[chatId].map((t: any) => t.id)
        setSelectedTags(tagIds)
      }
    } catch (error) {
      console.error('Erro ao buscar tags do chat:', error)
    }
  }

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return

    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newTagName,
          color: newTagColor,
        })
      })

      const data = await response.json()
      
      if (data.tag) {
        setAllTags([...allTags, data.tag])
        setNewTagName('')
        setNewTagColor('#3B82F6')
        setShowCreateTag(false)
        
        // Toast de sucesso
        const toast = document.createElement('div')
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] flex items-center gap-2'
        toast.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="font-medium">Tag criada com sucesso!</span>
        `
        document.body.appendChild(toast)
        setTimeout(() => toast.remove(), 3000)
      }
    } catch (error) {
      console.error('Erro ao criar tag:', error)
      alert('❌ Erro ao criar tag')
    }
  }

  const handleSave = async () => {
    setLoading(true)
    
    try {
      const token = getAuthToken()
      if (!token) {
        alert('❌ Token de autenticação não encontrado')
        setLoading(false)
        return
      }

      // Atualizar tags do chat
      const response = await fetch(`/api/chats/${chatId}/tags`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tagIds: selectedTags
        })
      })

      const data = await response.json()

      if (data.success) {
        // Toast de sucesso
        const toast = document.createElement('div')
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] flex items-center gap-2'
        toast.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="font-medium">Tags atualizadas com sucesso!</span>
        `
        document.body.appendChild(toast)
        setTimeout(() => toast.remove(), 3000)

        onClose()
      }
    } catch (error) {
      console.error('Erro ao salvar tags:', error)
      alert('❌ Erro ao atualizar tags')
    } finally {
      setLoading(false)
    }
  }

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId))
    } else {
      setSelectedTags([...selectedTags, tagId])
    }
  }

  const predefinedColors = [
    '#3B82F6', // blue
    '#F97316', // orange
    '#10B981', // green
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#EF4444', // red
    '#F59E0B', // amber
    '#06B6D4', // cyan
  ]

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <Dialog.Content className="fixed right-0 top-0 h-full w-[480px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Gerenciar Tags
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {contactName || 'Chat'}
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

          {/* Conteúdo */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Criar Nova Tag */}
            {showCreateTag ? (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Nova Tag</h3>
                
                <input
                  type="text"
                  placeholder="Nome da tag"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Cor</label>
                  <div className="flex gap-2">
                    {predefinedColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setNewTagColor(color)}
                        className={`w-8 h-8 rounded-lg transition-all ${newTagColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCreateTag}
                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Criar Tag
                  </button>
                  <button
                    onClick={() => setShowCreateTag(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowCreateTag(true)}
                className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nova Tag
              </button>
            )}

            {/* Lista de Tags */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tags Disponíveis</h3>
              
              {allTags.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  Nenhuma tag criada ainda
                </p>
              ) : (
                allTags.map(tag => (
                  <label
                    key={tag.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => toggleTag(tag.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: tag.color + '20' }}
                    >
                      <Tag className="w-4 h-4" style={{ color: tag.color }} />
                    </div>
                    <span className="flex-1 font-medium text-gray-900 dark:text-white">
                      {tag.name}
                    </span>
                    <div 
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{ 
                        backgroundColor: tag.color + '20',
                        color: tag.color
                      }}
                    >
                      {tag.name}
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Tags
                </>
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
