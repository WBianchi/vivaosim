'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, ClipboardList, Plus, Search, Clock, User, Pin, Save, XCircle } from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'
import { motion, AnimatePresence } from 'framer-motion'

interface AllNotesSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatId?: string
}

export function AllNotesSidebar({ isOpen, onClose, chatId }: AllNotesSidebarProps) {
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    isPinned: false
  })

  useEffect(() => {
    if (isOpen) {
      fetchNotes()
    }
  }, [isOpen, chatId])

  const fetchNotes = async () => {
    setLoading(true)
    try {
      const token = getAuthToken()
      if (!token) {
        console.log('⚠️ AllNotesSidebar: Token não encontrado')
        setLoading(false)
        return
      }

      const url = chatId 
        ? `/api/anotacoes?chatId=${chatId}`
        : '/api/anotacoes'

      console.log(`🔍 AllNotesSidebar: Buscando anotações... (chatId: ${chatId || 'todos'})`)
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      console.log('📝 AllNotesSidebar: Resposta da API:', data)
      
      if (data.anotacoes) {
        setNotes(data.anotacoes)
        console.log(`✅ AllNotesSidebar: ${data.anotacoes.length} anotações carregadas`)
      }
    } catch (error) {
      console.error('❌ AllNotesSidebar: Erro ao buscar anotações:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const token = getAuthToken()
      if (!token) {
        alert('❌ Você precisa estar logado')
        setIsSaving(false)
        return
      }

      const noteData = {
        title: formData.title,
        content: formData.content || null,
        category: formData.category,
        isPinned: formData.isPinned,
        chatId: chatId || null,
        contactId: null // TODO: vincular com contact se existir
      }

      console.log('📝 Criando anotação:', noteData)

      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(noteData)
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Anotação criada:', result.note)
        
        // Recarregar lista
        await fetchNotes()
        
        // Resetar formulário
        setFormData({
          title: '',
          content: '',
          category: 'general',
          isPinned: false
        })
        setShowCreateForm(false)
        
        alert(`✅ Anotação "${result.note.title}" criada com sucesso!`)
      } else {
        const error = await response.json()
        console.error('❌ Erro:', error)
        alert(`❌ Erro: ${error.error}`)
      }
    } catch (error) {
      console.error('❌ Erro ao criar anotação:', error)
      alert('❌ Erro de conexão')
    } finally {
      setIsSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'general',
      isPinned: false
    })
    setShowCreateForm(false)
  }

  const filteredNotes = notes.filter(note => 
    note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      'general': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      'important': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'todo': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'idea': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'contact': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    }
    return colors[category || 'general'] || colors.general
  }

  const getCategoryLabel = (category?: string) => {
    const labels: Record<string, string> = {
      'general': 'Geral',
      'important': 'Importante',
      'todo': 'Para Fazer',
      'idea': 'Ideia',
      'contact': 'Contato'
    }
    return labels[category || 'general'] || 'Geral'
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <Dialog.Content 
          className="fixed right-0 top-0 h-full w-[480px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300"
          aria-describedby="notes-description"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <Dialog.Title asChild>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {chatId ? 'Anotações deste Chat' : 'Todas as Anotações'}
                  </h2>
                </Dialog.Title>
                <Dialog.Description asChild>
                  <p id="notes-description" className="text-xs text-gray-500 dark:text-gray-400">
                    {notes.length} anotação(ões) encontrada(s)
                  </p>
                </Dialog.Description>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Busca */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar anotações..."
                className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Lista de Anotações */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {searchTerm ? 'Nenhuma anotação encontrada' : 'Nenhuma anotação ainda'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                      note.isPinned 
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700' 
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-cyan-300 dark:hover:border-cyan-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {note.isPinned && (
                            <Pin className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" />
                          )}
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                            {note.title || 'Sem título'}
                          </h3>
                        </div>
                        {note.category && (
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(note.category)}`}>
                            {getCategoryLabel(note.category)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {note.content && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3 whitespace-pre-wrap">
                        {note.content}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-3">
                        {note.createdBy && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{note.createdBy.name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(note.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      {note.updatedAt && note.updatedAt !== note.createdAt && (
                        <span className="text-xs italic">Editado</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Formulário de Criação (Expansível) */}
          <AnimatePresence>
            {showCreateForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <form onSubmit={handleCreateNote} className="p-4 space-y-4 bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Nova Anotação
                    </h3>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    >
                      <XCircle className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white text-sm"
                      placeholder="Ex: Lembrete importante"
                      required
                      disabled={isSaving}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Conteúdo
                    </label>
                    <textarea
                      rows={4}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white text-sm resize-none"
                      placeholder="Detalhes da anotação..."
                      disabled={isSaving}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Categoria
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white text-sm"
                        disabled={isSaving}
                      >
                        <option value="general">📋 Geral</option>
                        <option value="important">⚠️ Importante</option>
                        <option value="todo">✅ Para Fazer</option>
                        <option value="idea">💡 Ideia</option>
                        <option value="contact">📞 Contato</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Fixar?
                      </label>
                      <select
                        value={formData.isPinned ? 'true' : 'false'}
                        onChange={(e) => setFormData({ ...formData, isPinned: e.target.value === 'true' })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white text-sm"
                        disabled={isSaving}
                      >
                        <option value="false">Não</option>
                        <option value="true">Sim</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={isSaving}
                      className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving || !formData.title}
                      className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Salvar
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Button */}
          {!showCreateForm && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                onClick={() => setShowCreateForm(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Nova Anotação
              </motion.button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
