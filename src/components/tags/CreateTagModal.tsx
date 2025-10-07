'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Tag, 
  Save,
  Palette,
  Hash,
  Eye,
  Users,
  Search
} from 'lucide-react'
import { getAuthToken, getAuthHeaders } from '@/lib/auth-token'

interface CreateTagModalProps {
  onClose: () => void
  onSave: () => void
  tag?: any // Se fornecido, o modal estará em modo de edição
}

export const CreateTagModal: React.FC<CreateTagModalProps> = ({
  onClose,
  onSave,
  tag
}) => {
  const isEditMode = !!tag
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: tag?.name || '',
    description: tag?.description || '',
    color: tag?.color || '#f97316', // orange-500
    contactIds: [] as string[]
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [contacts, setContacts] = useState<any[]>([])
  const [contactSearch, setContactSearch] = useState('')

  useEffect(() => {
    setIsVisible(true)
    fetchContacts()
    if (isEditMode && tag) {
      fetchTagContacts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchContacts = async () => {
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch('/api/contacts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setContacts(data.contacts || [])
      }
    } catch (error) {
      console.error('Erro ao buscar contatos:', error)
    }
  }

  const fetchTagContacts = async () => {
    try {
      const token = getAuthToken()
      if (!token) return

      // Buscar os chatIds vinculados à tag
      const response = await fetch(`/api/tags?id=${tag.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const tagData = data.tag
        
        // Pegar os chatIds vinculados
        const chatIds = tagData.chatIds || []
        
        // Buscar contatos para encontrar quais estão vinculados
        const contactsResponse = await fetch('/api/contacts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (contactsResponse.ok) {
          const contactsData = await contactsResponse.json()
          const allContacts = contactsData.contacts || []
          
          // Encontrar IDs dos contatos que têm chatId vinculado
          const linkedContactIds = allContacts
            .filter((c: any) => c.whatsappChatId && chatIds.includes(c.whatsappChatId))
            .map((c: any) => c.id)
          
          setFormData(prev => ({
            ...prev,
            contactIds: linkedContactIds
          }))
        }
      }
    } catch (error) {
      console.error('Erro ao buscar contatos da tag:', error)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const token = getAuthToken()
      
      if (!token) {
        setError('Token de autenticação não encontrado. Faça login novamente.')
        setLoading(false)
        return
      }

      const url = isEditMode ? '/api/tags' : '/api/tags'
      const method = isEditMode ? 'PATCH' : 'POST'
      const payload = isEditMode
        ? { id: tag.id, name: formData.name, description: formData.description, color: formData.color, contactIds: formData.contactIds }
        : { name: formData.name, description: formData.description, color: formData.color, contactIds: formData.contactIds }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        onSave()
        handleClose()
      } else {
        const data = await response.json()
        setError(data.error || `Erro ao ${isEditMode ? 'atualizar' : 'criar'} tag`)
      }
    } catch (error) {
      console.error(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} tag:`, error)
      setError(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} tag`)
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const toggleContact = (contactId: string) => {
    setFormData(prev => ({
      ...prev,
      contactIds: prev.contactIds.includes(contactId)
        ? prev.contactIds.filter(id => id !== contactId)
        : [...prev.contactIds, contactId]
    }))
  }

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    contact.phone?.includes(contactSearch)
  )

  const colorOptions = [
    { value: '#ef4444', label: 'Vermelho', bg: 'bg-red-500', preview: 'bg-red-100 text-red-700', hex: '#ef4444' },
    { value: '#f97316', label: 'Laranja', bg: 'bg-orange-500', preview: 'bg-orange-100 text-orange-700', hex: '#f97316' },
    { value: '#eab308', label: 'Amarelo', bg: 'bg-yellow-500', preview: 'bg-yellow-100 text-yellow-700', hex: '#eab308' },
    { value: '#22c55e', label: 'Verde', bg: 'bg-green-500', preview: 'bg-green-100 text-green-700', hex: '#22c55e' },
    { value: '#3b82f6', label: 'Azul', bg: 'bg-blue-500', preview: 'bg-blue-100 text-blue-700', hex: '#3b82f6' },
    { value: '#a855f7', label: 'Roxo', bg: 'bg-purple-500', preview: 'bg-purple-100 text-purple-700', hex: '#a855f7' },
    { value: '#ec4899', label: 'Rosa', bg: 'bg-pink-500', preview: 'bg-pink-100 text-pink-700', hex: '#ec4899' },
    { value: '#6b7280', label: 'Cinza', bg: 'bg-gray-500', preview: 'bg-gray-100 text-gray-700', hex: '#6b7280' }
  ]

  const selectedColor = colorOptions.find(c => c.value === formData.color)

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
            className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {isEditMode ? 'Editar Tag' : 'Nova Tag'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isEditMode ? 'Atualize as informações da tag' : 'Crie uma tag para organizar seus conteúdos'}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Nome da Tag */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome da Tag *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Ex: Urgente, VIP, E-commerce..."
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Descreva o propósito desta tag..."
                  />
                </div>


                {/* Cor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Cor da Tag *
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {colorOptions.map((color) => (
                      <motion.button
                        key={color.value}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateFormData('color', color.value)}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                          formData.color === color.value
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className={`w-6 h-6 ${color.bg} rounded-full shadow-sm`}></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {color.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Vincular Contatos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Vincular Contatos (Opcional)
                  </label>
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    {/* Busca de Contatos */}
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Buscar contatos..."
                          value={contactSearch}
                          onChange={(e) => setContactSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>

                    {/* Lista de Contatos */}
                    <div className="max-h-48 overflow-y-auto">
                      {filteredContacts.length > 0 ? (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredContacts.map((contact) => (
                            <label
                              key={contact.id}
                              className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={formData.contactIds.includes(contact.id)}
                                onChange={() => toggleContact(contact.id)}
                                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {contact.name}
                                </p>
                                {contact.phone && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {contact.phone}
                                  </p>
                                )}
                              </div>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                          {contactSearch ? 'Nenhum contato encontrado' : 'Carregando contatos...'}
                        </div>
                      )}
                    </div>

                    {/* Contador de Selecionados */}
                    {formData.contactIds.length > 0 && (
                      <div className="p-2 bg-orange-50 dark:bg-orange-900/20 border-t border-orange-200 dark:border-orange-800">
                        <p className="text-xs text-orange-700 dark:text-orange-400 text-center">
                          {formData.contactIds.length} contato{formData.contactIds.length !== 1 ? 's' : ''} selecionado{formData.contactIds.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview da Tag */}
                {formData.name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Preview da Tag
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${selectedColor?.bg} rounded-lg flex items-center justify-center text-white`}>
                          <Tag className="w-4 h-4" />
                        </div>
                        <div>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 ${selectedColor?.preview} rounded-full text-sm font-medium`}>
                            <Hash className="w-3 h-3" />
                            {formData.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mensagem de Erro */}
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </motion.button>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {isEditMode ? 'Salvar Alterações' : 'Criar Tag'}
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
