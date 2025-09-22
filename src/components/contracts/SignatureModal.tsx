'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  PenTool, 
  User, 
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Mail,
  Clock,
  Shield,
  FileText,
  Download
} from 'lucide-react'

interface SignatureModalProps {
  contract: any
  onClose: () => void
  onSave: (signatureData: any) => void
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  contract,
  onClose,
  onSave
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'status' | 'send' | 'settings'>('status')
  const [emailData, setEmailData] = useState({
    subject: `Assinatura do Contrato: ${contract.title}`,
    message: `Olá,\n\nSegue o link para assinatura do contrato "${contract.title}".\n\nPor favor, acesse o link abaixo para revisar e assinar o documento:\n\nAtenciosamente,\nEquipe VivaOSim`,
    sendReminder: true,
    reminderDays: 3
  })
  const [signatureSettings, setSignatureSettings] = useState({
    provider: contract.signatureProvider || 'internal',
    requireAuth: true,
    allowComments: true,
    expirationDays: 30
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleSendSignature = () => {
    const signatureData = {
      contractId: contract.id,
      action: 'send_signature',
      emailData,
      signatureSettings,
      timestamp: new Date().toISOString()
    }

    console.log('📧 Enviando para assinatura:', signatureData)
    onSave(signatureData)
    handleClose()
  }

  const handleResendSignature = (signatureId: string) => {
    console.log('🔄 Reenviando assinatura:', signatureId)
    // Lógica para reenviar
  }

  const handleCancelSignature = (signatureId: string) => {
    console.log('❌ Cancelando assinatura:', signatureId)
    // Lógica para cancelar
  }

  const copySignatureLink = () => {
    const link = `https://app.vivaosim.com/signature/${contract.id}`
    navigator.clipboard.writeText(link)
    console.log('📋 Link copiado:', link)
  }

  const getSignatureStatusConfig = (status: string) => {
    switch (status) {
      case 'signed':
        return {
          label: 'Assinado',
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100'
        }
      case 'pending':
        return {
          label: 'Pendente',
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100'
        }
      case 'rejected':
        return {
          label: 'Rejeitado',
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-100'
        }
      default:
        return {
          label: 'Não Definido',
          icon: AlertCircle,
          color: 'text-gray-600',
          bg: 'bg-gray-100'
        }
    }
  }

  const getProviderConfig = (provider: string) => {
    switch (provider) {
      case 'docusign':
        return {
          name: 'DocuSign',
          color: 'text-blue-600',
          bg: 'bg-blue-100',
          description: 'Assinatura via DocuSign'
        }
      case 'clicksign':
        return {
          name: 'ClickSign',
          color: 'text-green-600',
          bg: 'bg-green-100',
          description: 'Assinatura via ClickSign'
        }
      case 'internal':
        return {
          name: 'Sistema Interno',
          color: 'text-purple-600',
          bg: 'bg-purple-100',
          description: 'Assinatura digital interna'
        }
      case 'physical':
        return {
          name: 'Física',
          color: 'text-orange-600',
          bg: 'bg-orange-100',
          description: 'Assinatura em documento físico'
        }
      default:
        return {
          name: 'Não Definido',
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          description: 'Provedor não configurado'
        }
    }
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-BR')
  }

  const providerConfig = getProviderConfig(signatureSettings.provider)

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
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                  <PenTool className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Gerenciar Assinaturas
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {contract.title}
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

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {[
                { id: 'status', label: 'Status', icon: CheckCircle },
                { id: 'send', label: 'Enviar', icon: Send },
                { id: 'settings', label: 'Configurações', icon: Shield }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50 dark:bg-orange-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Status Tab */}
              {activeTab === 'status' && (
                <div className="space-y-6">
                  {/* Provedor Atual */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Provedor de Assinatura
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${providerConfig.bg} ${providerConfig.color}`}>
                        {providerConfig.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {providerConfig.description}
                    </p>
                    {contract.signatureUrl && (
                      <div className="mt-3 flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => window.open(contract.signatureUrl, '_blank')}
                          className="flex items-center gap-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Abrir Documento
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={copySignatureLink}
                          className="flex items-center gap-2 px-3 py-1 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          Copiar Link
                        </motion.button>
                      </div>
                    )}
                  </div>

                  {/* Lista de Assinaturas */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Status das Assinaturas
                    </h3>
                    <div className="space-y-3">
                      {contract.signatures?.map((signature: any, index: number) => {
                        const statusConfig = getSignatureStatusConfig(signature.status)
                        return (
                          <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full ${
                                  signature.party === 'client' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                                } flex items-center justify-center`}>
                                  <User className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {signature.name}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {signature.email} • {signature.party === 'client' ? 'Cliente' : 'Empresa'}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                                  {statusConfig.label}
                                </span>
                                {signature.signedAt && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatDateTime(signature.signedAt)}
                                  </p>
                                )}
                              </div>
                            </div>

                            {signature.status === 'pending' && (
                              <div className="flex gap-2 mt-3">
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleResendSignature(signature.id)}
                                  className="flex items-center gap-1 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm transition-colors"
                                >
                                  <Mail className="w-3 h-3" />
                                  Reenviar
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleCancelSignature(signature.id)}
                                  className="flex items-center gap-1 px-3 py-1 border border-red-300 hover:bg-red-50 text-red-600 rounded-lg text-sm transition-colors"
                                >
                                  <XCircle className="w-3 h-3" />
                                  Cancelar
                                </motion.button>
                              </div>
                            )}

                            {signature.rejectionReason && (
                              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                <p className="text-sm text-red-700 dark:text-red-300">
                                  <strong>Motivo da rejeição:</strong> {signature.rejectionReason}
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Send Tab */}
              {activeTab === 'send' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Enviar para Assinatura
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Assunto do Email
                        </label>
                        <input
                          type="text"
                          value={emailData.subject}
                          onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Mensagem
                        </label>
                        <textarea
                          value={emailData.message}
                          onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={emailData.sendReminder}
                            onChange={(e) => setEmailData(prev => ({ ...prev, sendReminder: e.target.checked }))}
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Enviar lembrete automático
                          </span>
                        </label>
                        
                        {emailData.sendReminder && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">após</span>
                            <input
                              type="number"
                              min="1"
                              max="30"
                              value={emailData.reminderDays}
                              onChange={(e) => setEmailData(prev => ({ ...prev, reminderDays: parseInt(e.target.value) }))}
                              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            />
                            <span className="text-sm text-gray-600">dias</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Preview dos Destinatários */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Destinatários
                    </h4>
                    <div className="space-y-2">
                      {contract.signatures?.filter((sig: any) => sig.status === 'pending').map((signature: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className={`w-8 h-8 rounded-full ${
                            signature.party === 'client' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                          } flex items-center justify-center`}>
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {signature.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {signature.email}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Configurações de Assinatura
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Provedor de Assinatura
                        </label>
                        <select
                          value={signatureSettings.provider}
                          onChange={(e) => setSignatureSettings(prev => ({ ...prev, provider: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="internal">Sistema Interno</option>
                          <option value="docusign">DocuSign</option>
                          <option value="clicksign">ClickSign</option>
                          <option value="physical">Assinatura Física</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Validade (dias)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={signatureSettings.expirationDays}
                          onChange={(e) => setSignatureSettings(prev => ({ ...prev, expirationDays: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={signatureSettings.requireAuth}
                            onChange={(e) => setSignatureSettings(prev => ({ ...prev, requireAuth: e.target.checked }))}
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Exigir autenticação para assinar
                          </span>
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={signatureSettings.allowComments}
                            onChange={(e) => setSignatureSettings(prev => ({ ...prev, allowComments: e.target.checked }))}
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Permitir comentários no documento
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 pt-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Fechar
              </motion.button>
              
              {activeTab === 'send' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendSignature}
                  className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Enviar para Assinatura
                </motion.button>
              )}

              {activeTab === 'settings' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    console.log('💾 Salvando configurações:', signatureSettings)
                    handleClose()
                  }}
                  className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Salvar Configurações
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
