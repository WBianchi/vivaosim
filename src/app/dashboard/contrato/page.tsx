'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Calendar, DollarSign, MessageCircle, 
  CheckCircle, Clock, AlertTriangle, Download,
  Eye, Edit3, Send, Phone, Mail, MapPin, User,
  PenTool, Check, X, FileSignature, Shield
} from 'lucide-react'
import SignatureCanvas from '@/components/contracts/SignatureCanvas'

export default function ContratoClientePage() {
  const [activeTab, setActiveTab] = useState<'contrato' | 'conversas'>('contrato')
  const [contractData, setContractData] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showSignatureModal, setShowSignatureModal] = useState(false)

  useEffect(() => {
    fetchContractData()
    fetchMessages()
  }, [])

  const fetchContractData = async () => {
    try {
      const response = await fetch('/api/contratos/my-contract')
      const data = await response.json()
      if (data.success) {
        setContractData(data.contract)
      }
    } catch (error) {
      console.error('Erro ao buscar contrato:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contratos/messages')
      const data = await response.json()
      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error)
    }
  }

  const handleSaveSignature = async (signature: string) => {
    try {
      const response = await fetch('/api/contratos/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId: contractData?.id,
          signature
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('✅ Contrato assinado com sucesso!')
        setShowSignatureModal(false)
        fetchContractData()
      } else {
        alert('❌ ' + data.error)
      }
    } catch (error) {
      alert('❌ Erro ao salvar assinatura')
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: any = {
      draft: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400', label: 'Rascunho', icon: Edit3 },
      active: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Ativo', icon: CheckCircle },
      completed: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Concluído', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Cancelado', icon: X }
    }
    const badge = badges[status] || badges.draft
    const Icon = badge.icon
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${badge.color}`}>
        <Icon className="w-4 h-4" />
        {badge.label}
      </span>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meu Contrato</h1>
              <p className="text-gray-600 dark:text-gray-400">Gerencie todos os detalhes do seu evento</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {contractData && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={async () => {
                  const { generateContractPDF } = await import('@/lib/pdf-generator')
                  generateContractPDF(contractData)
                }}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl flex items-center gap-2 font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Baixar PDF
              </motion.button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
          <button
            onClick={() => setActiveTab('contrato')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'contrato'
                ? 'bg-white dark:bg-gray-600 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Contrato
          </button>
          <button
            onClick={() => setActiveTab('conversas')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'conversas'
                ? 'bg-white dark:bg-gray-600 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Histórico de Conversa
          </button>
        </div>
      </div>

      {/* Tab: Contrato */}
      {activeTab === 'contrato' && (
        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : !contractData ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Nenhum contrato encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Entre em contato com seu atendente para criar um contrato
              </p>
            </div>
          ) : (
            <>
              {/* Informações do Contrato */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna Principal */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Cabeçalho do Contrato */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {contractData.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                          Contrato Nº {contractData.numero}
                        </p>
                      </div>
                      {getStatusBadge(contractData.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Calendar className="w-5 h-5 text-orange-500" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Data do Evento</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {contractData.eventDate 
                              ? new Date(contractData.eventDate).toLocaleDateString('pt-BR')
                              : 'Não definida'
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Valor Total</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            R$ {(typeof contractData.amount === 'object' 
                              ? Number(contractData.amount) 
                              : contractData.amount
                            ).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo do Contrato */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Conteúdo do Contrato
                    </h3>
                    {contractData.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {contractData.description}
                      </p>
                    )}
                    {contractData.content ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <div 
                          className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          {contractData.content}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <FileText className="w-12 h-12 mx-auto text-yellow-500 mb-3" />
                        <p className="text-yellow-700 dark:text-yellow-400 font-medium mb-2">
                          Conteúdo do contrato não disponível
                        </p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-500">
                          O atendente ainda não adicionou o conteúdo completo do contrato
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Assinaturas */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <FileSignature className="w-5 h-5" />
                      Assinaturas
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Assinatura do Cliente */}
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Sua Assinatura</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Cliente</p>
                          </div>
                          {contractData.clientSignedAt && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>

                        {contractData.clientSignature ? (
                          <div className="space-y-3">
                            <img 
                              src={contractData.clientSignature} 
                              alt="Assinatura do Cliente"
                              className="w-full h-32 object-contain bg-white rounded-lg border"
                            />
                            <p className="text-xs text-gray-500 text-center">
                              Assinado em {new Date(contractData.clientSignedAt).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <PenTool className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            <button
                              onClick={() => setShowSignatureModal(true)}
                              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                            >
                              Assinar Contrato
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Assinatura do Prestador */}
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Assinatura do Prestador</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {contractData.assignedTo?.name || 'Viva o Sim'}
                            </p>
                          </div>
                          {contractData.providerSignedAt && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>

                        {contractData.providerSignature ? (
                          <div className="space-y-3">
                            <img 
                              src={contractData.providerSignature} 
                              alt="Assinatura do Prestador"
                              className="w-full h-32 object-contain bg-white rounded-lg border"
                            />
                            <p className="text-xs text-gray-500 text-center">
                              Assinado em {new Date(contractData.providerSignedAt).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Shield className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            <p className="text-sm text-gray-500">Aguardando assinatura</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status das Assinaturas */}
                    {contractData.clientSignature && contractData.providerSignature && (
                      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <div>
                            <p className="font-semibold text-green-700 dark:text-green-400">
                              Contrato Totalmente Assinado
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-500">
                              Ambas as partes assinaram o contrato. Documento válido juridicamente.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Resumo Financeiro */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Resumo Financeiro
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Valor Total</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          R$ {(typeof contractData.amount === 'object' 
                            ? Number(contractData.amount) 
                            : contractData.amount
                          ).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informações do Atendente */}
                  {contractData.assignedTo && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Seu Atendente
                      </h3>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {contractData.assignedTo.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {contractData.assignedTo.email}
                          </p>
                        </div>
                      </div>

                      <button className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Iniciar Conversa
                      </button>
                    </div>
                  )}

                  {/* Datas Importantes */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Datas Importantes
                    </h3>
                    
                    <div className="space-y-3">
                      {contractData.eventDate && (
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-orange-500" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Data do Evento</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(contractData.eventDate).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Criado em</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {new Date(contractData.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Tab: Conversas */}
      {activeTab === 'conversas' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Histórico de Conversas com Atendente
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Todas as mensagens trocadas via WhatsApp com seu atendente
            </p>
          </div>
          
          <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Nenhuma conversa registrada ainda</p>
                <p className="text-sm text-gray-400 mt-2">
                  As mensagens trocadas via WhatsApp aparecerão aqui
                </p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex gap-3 ${msg.fromMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.fromMe 
                      ? 'bg-orange-100 dark:bg-orange-900/30' 
                      : 'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    {msg.fromMe ? (
                      <User className="w-5 h-5 text-orange-600" />
                    ) : (
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className={`flex-1 max-w-[70%]`}>
                    <div className={`rounded-2xl p-4 ${
                      msg.fromMe
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}>
                      {!msg.fromMe && (
                        <p className="text-xs font-semibold mb-1 opacity-70">
                          {msg.senderName || 'Atendente'}
                        </p>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                      {msg.mediaUrl && (
                        <img 
                          src={msg.mediaUrl} 
                          alt="Mídia" 
                          className="mt-2 rounded-lg max-w-full cursor-pointer hover:opacity-90"
                        />
                      )}
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${msg.fromMe ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.timestamp).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal de Assinatura */}
      <AnimatePresence>
        {showSignatureModal && (
          <SignatureCanvas
            title="Assine o Contrato"
            onSave={handleSaveSignature}
            onCancel={() => setShowSignatureModal(false)}
            existingSignature={contractData?.clientSignature}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
