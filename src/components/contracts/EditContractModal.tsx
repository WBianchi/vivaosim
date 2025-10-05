'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Save, FileText, DollarSign, Calendar, User, PenTool, Download } from 'lucide-react'
import SignatureCanvas from './SignatureCanvas'

interface EditContractModalProps {
  contract: any
  onClose: () => void
  onSave: (data: any) => void
}

export default function EditContractModal({ contract, onClose, onSave }: EditContractModalProps) {
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    amount: 0,
    eventDate: '',
    startDate: '',
    endDate: ''
  })

  // Atualizar formData quando o contrato mudar
  useEffect(() => {
    if (contract && contract.id) {
      console.log('📋 Contrato recebido:', contract)
      
      // Buscar dados completos do contrato
      const fetchFullContract = async () => {
        try {
          const response = await fetch(`/api/contracts/${contract.id}`)
          const data = await response.json()
          
          if (data.contract) {
            const fullContract = data.contract
            console.log('📋 Dados completos:', fullContract)

            // Converter amount de Decimal para number
            const amountValue = !fullContract.amount ? 0 : (
              typeof fullContract.amount === 'object' && fullContract.amount !== null 
                ? Number(fullContract.amount) 
                : fullContract.amount
            )

            setFormData({
              title: fullContract.title || '',
              description: fullContract.description || '',
              content: fullContract.content || '',
              amount: amountValue,
              eventDate: fullContract.eventDate ? new Date(fullContract.eventDate).toISOString().split('T')[0] : '',
              startDate: fullContract.startDate ? new Date(fullContract.startDate).toISOString().split('T')[0] : '',
              endDate: fullContract.endDate ? new Date(fullContract.endDate).toISOString().split('T')[0] : ''
            })
          }
        } catch (error) {
          console.error('Erro ao buscar contrato completo:', error)
          
          // Fallback: usar dados do contrato passado
          const amountValue = !contract.amount ? 0 : (
            typeof contract.amount === 'object' && contract.amount !== null 
              ? Number(contract.amount) 
              : contract.amount
          )

          setFormData({
            title: contract.title || '',
            description: contract.description || '',
            content: contract.content || '',
            amount: amountValue,
            eventDate: contract.eventDate ? new Date(contract.eventDate).toISOString().split('T')[0] : '',
            startDate: contract.startDate ? new Date(contract.startDate).toISOString().split('T')[0] : '',
            endDate: contract.endDate ? new Date(contract.endDate).toISOString().split('T')[0] : ''
          })
        }
      }

      fetchFullContract()
    }
  }, [contract])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch(`/api/contracts/${contract.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        onSave(data.contract)
        onClose()
      } else {
        alert('❌ ' + data.error)
      }
    } catch (error) {
      alert('❌ Erro ao atualizar contrato')
    } finally {
      setLoading(false)
    }
  }

  const handleSignature = async (signature: string) => {
    try {
      const response = await fetch(`/api/contracts/${contract.id}/sign-provider`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature })
      })

      const data = await response.json()
      
      if (data.success) {
        alert('✅ Contrato assinado com sucesso!')
        setShowSignatureModal(false)
        // Atualizar o contrato local com a assinatura
        contract.providerSignature = signature
        contract.providerSignedAt = new Date().toISOString()
        // Notificar o pai para atualizar a lista
        onSave(data.contract)
      } else {
        alert('❌ ' + data.error)
      }
    } catch (error) {
      alert('❌ Erro ao salvar assinatura')
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Contrato</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{contract.numero}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título do Contrato *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Conteúdo Completo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Conteúdo do Contrato
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                placeholder="Digite o conteúdo completo do contrato aqui..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Este é o texto que será exibido para o cliente assinar
              </p>
            </div>

            {/* Valor e Datas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Valor *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Data do Evento
                </label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data Início
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Status de Assinatura */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Status de Assinaturas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    contract.providerSignature ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <User className={`w-5 h-5 ${contract.providerSignature ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Prestador</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {contract.providerSignature ? '✅ Assinado' : '⏳ Pendente'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    contract.clientSignature ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <User className={`w-5 h-5 ${contract.clientSignature ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Cliente</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {contract.clientSignature ? '✅ Assinado' : '⏳ Pendente'}
                    </p>
                  </div>
                </div>
              </div>

              {!contract.providerSignature && (
                <button
                  type="button"
                  onClick={() => setShowSignatureModal(true)}
                  className="mt-4 w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <PenTool className="w-4 h-4" />
                  Assinar como Prestador
                </button>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={async () => {
                  const { generateContractPDF } = await import('@/lib/pdf-generator')
                  generateContractPDF(contract)
                }}
                className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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

      {/* Modal de Assinatura */}
      {showSignatureModal && (
        <SignatureCanvas
          title="Assinar como Prestador"
          onSave={handleSignature}
          onCancel={() => setShowSignatureModal(false)}
          existingSignature={contract.providerSignature}
        />
      )}
    </>
  )
}
