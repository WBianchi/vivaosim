'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Loader2, Globe } from 'lucide-react'

interface EditSiteModalProps {
  site: any
  onClose: () => void
  onSuccess: () => void
}

export const EditSiteModal: React.FC<EditSiteModalProps> = ({ site, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customDomain: site.customDomain || '',
    configType: site.configType || 'MANUAL',
    primaryColor: site.primaryColor || '#FF6B35',
    secondaryColor: site.secondaryColor || '#004E89',
    segment: site.segment || '',
    serverType: site.serverType || 'VIVAOSIM',
    serverUrl: site.serverUrl || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/sites/assinantes/${site.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Site atualizado com sucesso!')
        onSuccess()
        onClose()
      } else {
        alert('❌ Erro: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao atualizar site:', error)
      alert('❌ Erro ao atualizar site')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Editar Site</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{site.subscriberName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Domínio Principal (readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Domínio Principal
            </label>
            <input
              type="text"
              value={site.domain}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            />
          </div>

          {/* Domínio Personalizado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Domínio Personalizado
            </label>
            <input
              type="text"
              value={formData.customDomain}
              onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
              placeholder="exemplo.com.br"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tipo de Configuração */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Configuração
              </label>
              <select
                value={formData.configType}
                onChange={(e) => setFormData({ ...formData, configType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="MANUAL">Manual</option>
                <option value="AI">IA</option>
              </select>
            </div>

            {/* Segmento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Segmento
              </label>
              <select
                value={formData.segment}
                onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Selecione</option>
                <option value="Casamento">Casamento</option>
                <option value="15 Anos">15 Anos</option>
                <option value="Aniversário">Aniversário</option>
                <option value="Corporativo">Corporativo</option>
                <option value="Formatura">Formatura</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Cor Principal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cor Principal
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Cor Secundária */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cor Secundária
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Tipo de Servidor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Servidor
            </label>
            <select
              value={formData.serverType}
              onChange={(e) => setFormData({ ...formData, serverType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="VIVAOSIM">Viva o Sim</option>
              <option value="PROPRIO">Servidor Próprio</option>
            </select>
          </div>

          {/* URL Servidor Próprio */}
          {formData.serverType === 'PROPRIO' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL do Servidor
              </label>
              <input
                type="url"
                value={formData.serverUrl}
                onChange={(e) => setFormData({ ...formData, serverUrl: e.target.value })}
                placeholder="https://servidor.exemplo.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
