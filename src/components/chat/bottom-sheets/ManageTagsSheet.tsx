'use client'

import { Tag, Plus, X } from 'lucide-react'
import { useState } from 'react'

interface ManageTagsSheetProps {
  chat: any
  clientData?: any
  onClose: () => void
}

export const ManageTagsSheet: React.FC<ManageTagsSheetProps> = ({ chat, clientData, onClose }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(['WhatsApp', 'Lead Qualificado'])
  const [newTag, setNewTag] = useState('')

  const suggestedTags = [
    { name: 'Interessado', color: 'bg-green-100 text-green-800' },
    { name: 'Potencial Alto', color: 'bg-blue-100 text-blue-800' },
    { name: 'Orçamento Enviado', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Cliente VIP', color: 'bg-purple-100 text-purple-800' },
    { name: 'Negociação', color: 'bg-orange-100 text-orange-800' },
    { name: 'Prospecção', color: 'bg-cyan-100 text-cyan-800' },
  ]

  const handleAddTag = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      setSelectedTags([...selectedTags, tagName])
    }
  }

  const handleRemoveTag = (tagName: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagName))
  }

  const handleCreateNewTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleSaveTags = async () => {
    console.log('🏷️ Salvando tags...')
    
    try {
      const response = await fetch(`/api/contacts/${clientData?.id}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: selectedTags })
      })

      if (response.ok) {
        console.log('✅ Tags atualizadas')
        onClose()
        alert(`✅ Tags atualizadas para ${clientData?.name || 'cliente'}!`)
      } else {
        const error = await response.json()
        console.error('❌ Erro:', error)
        alert(`❌ Erro ao salvar tags: ${error.error}`)
      }
    } catch (error) {
      console.error('❌ Erro na requisição:', error)
      alert('❌ Erro de conexão.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Tag className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Gerenciar Tags
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Organize as tags de {clientData?.name || 'este cliente'}
        </p>
      </div>

      {/* Tags atuais */}
      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
        <h4 className="font-medium text-orange-900 dark:text-orange-300 mb-3">
          🏷️ Tags Selecionadas ({selectedTags.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 text-orange-600 hover:text-orange-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedTags.length === 0 && (
            <p className="text-gray-500 text-sm">Nenhuma tag selecionada</p>
          )}
        </div>
      </div>

      {/* Tags sugeridas */}
      <div>
        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
          💡 Tags Sugeridas
        </h4>
        <div className="flex flex-wrap gap-2">
          {suggestedTags.map(tag => (
            <button
              key={tag.name}
              onClick={() => handleAddTag(tag.name)}
              disabled={selectedTags.includes(tag.name)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedTags.includes(tag.name)
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : `${tag.color} hover:opacity-80 cursor-pointer`
              }`}
            >
              {selectedTags.includes(tag.name) ? '✓ ' : '+ '}
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* Criar nova tag */}
      <div>
        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
          ➕ Criar Nova Tag
        </h4>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateNewTag()}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
            placeholder="Nome da nova tag..."
          />
          <button
            onClick={handleCreateNewTag}
            disabled={!newTag.trim()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSaveTags}
          className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
        >
          Salvar Tags ({selectedTags.length})
        </button>
      </div>
    </div>
  )
}
