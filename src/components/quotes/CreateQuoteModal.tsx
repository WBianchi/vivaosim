'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAuthToken } from '@/lib/auth-token'
import { 
  X, 
  DollarSign, 
  User, 
  Plus,
  Trash2,
  Save,
  FileText,
  Tag,
  Calendar
} from 'lucide-react'

interface CreateQuoteModalProps {
  onClose: () => void
  onSave: () => void
  quote?: any // Se fornecido, o modal estará em modo de edição
}

interface QuoteItem {
  name: string
  quantity: number
  price: number
}

export const CreateQuoteModal: React.FC<CreateQuoteModalProps> = ({
  onClose,
  onSave,
  quote
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isEditMode = !!quote
  const [formData, setFormData] = useState({
    title: quote?.title || '',
    description: quote?.description || '',
    contactId: quote?.contactId || '',
    validUntil: quote?.validUntil ? new Date(quote.validUntil).toISOString().slice(0, 10) : '',
    discount: quote?.discount || 0,
    chatId: quote?.chatId || ''
  })
  const [items, setItems] = useState<QuoteItem[]>(
    quote?.items?.length > 0
      ? quote.items.map((item: any) => ({
          name: item.name || item.description || '',
          quantity: item.quantity || 1,
          price: item.unitPrice || item.price || 0
        }))
      : [{ name: '', quantity: 1, price: 0 }]
  )
  const [contacts, setContacts] = useState<any[]>([])

  useEffect(() => {
    setIsVisible(true)
    
    // Definir data de validade padrão para 30 dias (somente se não estiver editando)
    if (!isEditMode) {
      const expireDate = new Date()
      expireDate.setDate(expireDate.getDate() + 30)
      setFormData(prev => ({
        ...prev,
        validUntil: expireDate.toISOString().slice(0, 10)
      }))
    }

    // Buscar contatos
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

    fetchContacts()
  }, [])

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
        setError('Token de autenticação não encontrado')
        setLoading(false)
        return
      }

      const quoteItems = items
        .filter(item => item.name.trim() !== '')
        .map(item => ({
          name: item.name,
          description: '',
          quantity: Number(item.quantity),
          unitPrice: Number(item.price),
          total: Number(item.quantity) * Number(item.price)
        }))

      const payload = isEditMode
        ? {
            id: quote.id,
            title: formData.title,
            description: formData.description || null,
            validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : null,
            discount: formData.discount ? Number(formData.discount) : null,
            chatId: formData.chatId || null,
            items: quoteItems
          }
        : {
            title: formData.title,
            description: formData.description || null,
            contactId: formData.contactId,
            validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : null,
            discount: formData.discount ? Number(formData.discount) : null,
            chatId: formData.chatId || null,
            items: quoteItems
          }

      const method = isEditMode ? 'PATCH' : 'POST'

      const response = await fetch('/api/quotes', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        onSave()
        handleClose()
      } else {
        const data = await response.json()
        setError(data.error || `Erro ao ${isEditMode ? 'atualizar' : 'criar'} orçamento`)
      }
    } catch (error) {
      console.error(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} orçamento:`, error)
      setError(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} orçamento`)
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

  const addItem = () => {
    setItems(prev => [...prev, { name: '', quantity: 1, price: 0 }])
  }

  const updateItem = (index: number, field: keyof QuoteItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ))
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index))
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
  }

  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0)

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
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {isEditMode ? 'Editar Orçamento' : 'Novo Orçamento'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Crie um orçamento detalhado para o cliente
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informações Básicas */}
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Informações Básicas
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Título do Orçamento *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => updateFormData('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Ex: Website Institucional"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Data de Validade
                      </label>
                      <input
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) => updateFormData('validUntil', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Desconto (R$)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.discount}
                        onChange={(e) => updateFormData('discount', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Descrição
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Descreva o projeto ou serviço..."
                      />
                    </div>
                  </div>
                </div>

                {/* Cliente - Somente no modo criação */}
                {!isEditMode && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Cliente
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Selecionar Cliente *
                      </label>
                      <select
                        required
                        value={formData.contactId}
                        onChange={(e) => updateFormData('contactId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Selecione um cliente</option>
                        {contacts.map((contact) => (
                          <option key={contact.id} value={contact.id}>
                            {contact.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Itens do Orçamento */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Itens do Orçamento
                    </h3>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addItem}
                      className="flex items-center gap-2 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      Adicionar Item
                    </motion.button>
                  </div>

                  <div className="space-y-3 mb-4">
                    {items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="col-span-6">
                          <input
                            type="text"
                            placeholder="Nome do item/serviço"
                            value={item.name}
                            onChange={(e) => updateItem(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="Qtd"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            placeholder="Valor unitário"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div className="col-span-1 flex items-center justify-center">
                          {items.length > 1 && (
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem(index)}
                              className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-green-700 dark:text-green-300">
                        Valor Total:
                      </span>
                      <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {formatCurrency(totalValue)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </motion.button>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Criar Orçamento
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
