'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Trash2, List, ChevronDown } from 'lucide-react'

interface SendListModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (listData: {
    title: string
    description: string
    buttonText: string
    sections: Array<{
      title: string
      rows: Array<{
        id: string
        title: string
        description?: string
      }>
    }>
  }) => void
  chatName: string
}

export const SendListModal: React.FC<SendListModalProps> = ({
  isOpen,
  onClose,
  onSend,
  chatName
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [buttonText, setButtonText] = useState('Ver opções')
  const [sections, setSections] = useState([
    {
      title: 'Seção 1',
      rows: [
        { id: '1', title: '', description: '' }
      ]
    }
  ])

  if (!isOpen) return null

  const addSection = () => {
    if (sections.length < 10) {
      setSections([
        ...sections,
        {
          title: `Seção ${sections.length + 1}`,
          rows: [{ id: Date.now().toString(), title: '', description: '' }]
        }
      ])
    }
  }

  const removeSection = (sectionIndex: number) => {
    if (sections.length > 1) {
      setSections(sections.filter((_, i) => i !== sectionIndex))
    }
  }

  const updateSectionTitle = (sectionIndex: number, value: string) => {
    const newSections = [...sections]
    newSections[sectionIndex].title = value
    setSections(newSections)
  }

  const addRow = (sectionIndex: number) => {
    const newSections = [...sections]
    if (newSections[sectionIndex].rows.length < 10) {
      newSections[sectionIndex].rows.push({
        id: Date.now().toString(),
        title: '',
        description: ''
      })
      setSections(newSections)
    }
  }

  const removeRow = (sectionIndex: number, rowIndex: number) => {
    const newSections = [...sections]
    if (newSections[sectionIndex].rows.length > 1) {
      newSections[sectionIndex].rows = newSections[sectionIndex].rows.filter((_, i) => i !== rowIndex)
      setSections(newSections)
    }
  }

  const updateRow = (sectionIndex: number, rowIndex: number, field: 'title' | 'description', value: string) => {
    const newSections = [...sections]
    newSections[sectionIndex].rows[rowIndex][field] = value
    setSections(newSections)
  }

  const handleSend = () => {
    if (!title.trim()) {
      alert('Digite um título para a lista')
      return
    }

    const validSections = sections.filter(section => 
      section.rows.some(row => row.title.trim())
    ).map(section => ({
      ...section,
      rows: section.rows.filter(row => row.title.trim())
    }))

    if (validSections.length === 0 || validSections.every(s => s.rows.length === 0)) {
      alert('Adicione pelo menos uma opção')
      return
    }

    onSend({
      title: title.trim(),
      description: description.trim(),
      buttonText: buttonText.trim() || 'Ver opções',
      sections: validSections
    })

    // Reset
    setTitle('')
    setDescription('')
    setButtonText('Ver opções')
    setSections([{ title: 'Seção 1', rows: [{ id: '1', title: '', description: '' }] }])
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <List className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Criar Lista
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Para: {chatName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Título */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título da Lista *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Escolha uma opção"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
              maxLength={60}
            />
          </div>

          {/* Descrição */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição da lista..."
              rows={2}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white resize-none"
              maxLength={1000}
            />
          </div>

          {/* Texto do Botão */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Texto do Botão
            </label>
            <input
              type="text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="Ver opções"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
              maxLength={20}
            />
          </div>

          {/* Seções */}
          <div className="space-y-4">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                    placeholder={`Seção ${sectionIndex + 1}`}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white font-medium"
                    maxLength={24}
                  />
                  {sections.length > 1 && (
                    <button
                      onClick={() => removeSection(sectionIndex)}
                      className="ml-2 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Linhas */}
                <div className="space-y-2">
                  {section.rows.map((row, rowIndex) => (
                    <div key={row.id} className="flex items-start space-x-2">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={row.title}
                          onChange={(e) => updateRow(sectionIndex, rowIndex, 'title', e.target.value)}
                          placeholder={`Opção ${rowIndex + 1}`}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white text-sm"
                          maxLength={24}
                        />
                        <input
                          type="text"
                          value={row.description}
                          onChange={(e) => updateRow(sectionIndex, rowIndex, 'description', e.target.value)}
                          placeholder="Descrição (opcional)"
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white text-sm"
                          maxLength={72}
                        />
                      </div>
                      {section.rows.length > 1 && (
                        <button
                          onClick={() => removeRow(sectionIndex, rowIndex)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {section.rows.length < 10 && (
                  <button
                    onClick={() => addRow(sectionIndex)}
                    className="mt-2 flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar opção</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {sections.length < 10 && (
            <button
              onClick={addSection}
              className="mt-4 flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar seção</span>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSend}
            disabled={!title.trim()}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Enviar Lista
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
