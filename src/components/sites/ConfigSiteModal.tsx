'use client'

import { motion } from 'framer-motion'
import { X, Settings, ExternalLink, Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'

interface ConfigSiteModalProps {
  site: any
  onClose: () => void
}

export const ConfigSiteModal: React.FC<ConfigSiteModalProps> = ({ site, onClose }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Configurações do Site</h2>
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

        <div className="space-y-6">
          {/* Informações Gerais */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Informações do Site
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Domínio Principal:</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-white dark:bg-gray-800 px-3 py-1 rounded border border-gray-200 dark:border-gray-600">
                    {site.domain}
                  </code>
                  <button
                    onClick={() => copyToClipboard(site.domain)}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {site.customDomain && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Domínio Personalizado:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-white dark:bg-gray-800 px-3 py-1 rounded border border-gray-200 dark:border-gray-600">
                      {site.customDomain}
                    </code>
                    <button
                      onClick={() => copyToClipboard(site.customDomain)}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    >
                      {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  site.status === 'active' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {site.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Plano:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{site.plan}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Configuração:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {site.configType === 'AI' ? '🤖 IA' : '✋ Manual'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Servidor:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {site.serverType === 'VIVAOSIM' ? '☁️ Viva o Sim' : '🖥️ Próprio'}
                </span>
              </div>
            </div>
          </div>

          {/* Cores */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Cores do Site</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cor Principal</p>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                    style={{ backgroundColor: site.primaryColor }}
                  />
                  <code className="text-sm bg-white dark:bg-gray-800 px-3 py-1.5 rounded border border-gray-200 dark:border-gray-600">
                    {site.primaryColor}
                  </code>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cor Secundária</p>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                    style={{ backgroundColor: site.secondaryColor }}
                  />
                  <code className="text-sm bg-white dark:bg-gray-800 px-3 py-1.5 rounded border border-gray-200 dark:border-gray-600">
                    {site.secondaryColor}
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Estatísticas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-400">Visitantes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{site.visitors || 0}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-400">Conversões</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{site.conversions || 0}</p>
              </div>
            </div>
          </div>

          {/* Datas */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Datas Importantes</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Criado em:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(site.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              {site.activatedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ativado em:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(site.activatedAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
              {site.expiresAt && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Expira em:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(site.expiresAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  )
}
