'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Edit3, Copy, Mail, MessageSquare, Users, TrendingUp, Clock, CheckCircle, BarChart, Calendar } from 'lucide-react'

interface CampaignDetailsModalProps {
  campaign: any
  onClose: () => void
  onEdit?: () => void
}

export const CampaignDetailsModal: React.FC<CampaignDetailsModalProps> = ({ campaign, onClose, onEdit }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'recipients'>('overview')

  useEffect(() => { setIsVisible(true) }, [])
  const handleClose = () => { setIsVisible(false); setTimeout(onClose, 300) }
  const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR')

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={handleClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{campaign.name}</h2>
                  <span className="text-sm text-gray-600">{campaign.type}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {onEdit && <motion.button whileHover={{ scale: 1.05 }} onClick={() => { onEdit(); handleClose() }} className="p-2 hover:bg-gray-100 rounded-xl"><Edit3 className="w-5 h-5" /></motion.button>}
                <motion.button whileHover={{ scale: 1.05 }} onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></motion.button>
              </div>
            </div>

            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {['overview', 'metrics', 'recipients'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-3 ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}>
                  {tab === 'overview' ? 'Visão Geral' : tab === 'metrics' ? 'Métricas' : 'Destinatários'}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <Users className="w-5 h-5 text-blue-600 mb-2" />
                      <p className="text-2xl font-bold">{campaign.recipients.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Destinatários</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
                      <p className="text-2xl font-bold">{campaign.delivered.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Entregues</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <TrendingUp className="w-5 h-5 text-purple-600 mb-2" />
                      <p className="text-2xl font-bold">{campaign.openRate}%</p>
                      <p className="text-sm text-gray-600">Taxa Abertura</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl">
                      <BarChart className="w-5 h-5 text-orange-600 mb-2" />
                      <p className="text-2xl font-bold">{campaign.clickRate}%</p>
                      <p className="text-sm text-gray-600">Taxa Clique</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                    <h3 className="font-semibold mb-4">Conteúdo da Campanha</h3>
                    {campaign.subject && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Assunto</p>
                        <p className="font-medium">{campaign.subject}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Mensagem</p>
                      <p className="text-gray-700 dark:text-gray-300">{campaign.content}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Informações</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Canal:</span>
                          <div className="flex items-center gap-2">
                            {campaign.channel === 'email' && <Mail className="w-4 h-4" />}
                            {campaign.channel === 'whatsapp' && <MessageSquare className="w-4 h-4" />}
                            {campaign.channel === 'both' && (
                              <>
                                <Mail className="w-4 h-4" />
                                <MessageSquare className="w-4 h-4" />
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium capitalize">{campaign.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Template:</span>
                          <span className="font-medium">{campaign.template}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Datas</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Criada em:</span>
                          <span className="font-medium">{formatDate(campaign.createdAt)}</span>
                        </div>
                        {campaign.scheduledAt && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Agendada para:</span>
                            <span className="font-medium">{formatDate(campaign.scheduledAt)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Atualizada em:</span>
                          <span className="font-medium">{formatDate(campaign.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'metrics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                      <h4 className="font-medium mb-3">Envio</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Enviados:</span>
                          <span className="font-medium">{campaign.sent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Entregues:</span>
                          <span className="font-medium">{campaign.delivered.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Rejeitados:</span>
                          <span className="font-medium">{campaign.bounced}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                      <h4 className="font-medium mb-3">Engajamento</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Abertos:</span>
                          <span className="font-medium">{campaign.opened.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Clicados:</span>
                          <span className="font-medium">{campaign.clicked.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Descadastros:</span>
                          <span className="font-medium">{campaign.unsubscribed}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                      <h4 className="font-medium mb-3">Taxas</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Entrega:</span>
                          <span className="font-medium">{((campaign.delivered / campaign.sent) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Abertura:</span>
                          <span className="font-medium">{campaign.openRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Clique:</span>
                          <span className="font-medium">{campaign.clickRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                    <h3 className="font-semibold mb-4">Gráfico de Performance</h3>
                    <div className="h-64 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">📊 Gráficos seriam implementados aqui</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'recipients' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                    <h3 className="font-semibold mb-4">Lista de Destinatários</h3>
                    <p className="text-gray-600 mb-4">Total: {campaign.recipients.toLocaleString()} contatos</p>
                    <div className="space-y-2">
                      <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                        <p className="font-medium">Segmento: Todos os Clientes Ativos</p>
                        <p className="text-sm text-gray-600">Filtros aplicados: Status = Ativo</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-8 pt-6 border-t">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigator.clipboard.writeText(campaign.id)}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copiar ID
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => { if (onEdit) { onEdit(); handleClose() } }}
                  className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar Campanha
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
