'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Save, Sparkles, Mail, MessageSquare, Users, Calendar, Clock, FileText, Image, Link } from 'lucide-react'

interface CreateCampaignModalProps {
  onClose: () => void
  onSave: (campaignData: any) => void
  campaign?: any
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ onClose, onSave, campaign }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'recipients' | 'schedule'>('content')
  const [formData, setFormData] = useState({
    name: '',
    type: 'promotional',
    channel: 'both',
    subject: '',
    content: '',
    template: '',
    recipients: [],
    schedule: 'immediate',
    scheduledAt: ''
  })

  useEffect(() => {
    setIsVisible(true)
    if (campaign) {
      setFormData({
        name: campaign.name || '',
        type: campaign.type || 'promotional',
        channel: campaign.channel || 'both',
        subject: campaign.subject || '',
        content: campaign.content || '',
        template: campaign.template || '',
        recipients: campaign.recipients || [],
        schedule: campaign.schedule || 'immediate',
        scheduledAt: campaign.scheduledAt || ''
      })
    }
  }, [campaign])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const campaignData = {
      id: campaign?.id || `camp-${Date.now()}`,
      ...formData,
      status: formData.schedule === 'immediate' ? 'active' : 'scheduled',
      recipients: 1000, // Mock
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0,
      openRate: 0,
      clickRate: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    onSave(campaignData)
    handleClose()
  }

  const generateWithAI = (field: string) => {
    console.log(`🤖 Gerando ${field} com IA...`)
    // Aqui você integraria com a API de IA
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={handleClose} />
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {campaign ? 'Editar Campanha' : 'Nova Campanha'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {campaign ? 'Atualize a campanha' : 'Crie campanhas com IA'}
                  </p>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>

            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {['content', 'recipients', 'schedule'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-3 ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}>
                  {tab === 'content' ? 'Conteúdo' : tab === 'recipients' ? 'Destinatários' : 'Agendamento'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {activeTab === 'content' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome da Campanha *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Black Friday 2024"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="promotional">Promocional</option>
                        <option value="transactional">Transacional</option>
                        <option value="newsletter">Newsletter</option>
                        <option value="notification">Notificação</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Canal</label>
                      <select
                        value={formData.channel}
                        onChange={(e) => setFormData(prev => ({ ...prev, channel: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="email">Email</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="both">Email + WhatsApp</option>
                      </select>
                    </div>
                  </div>

                  {(formData.channel === 'email' || formData.channel === 'both') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assunto do Email</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Assunto do email"
                        />
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          onClick={() => generateWithAI('subject')}
                          className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          IA
                        </motion.button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Conteúdo da Mensagem *</label>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            <FileText className="w-4 h-4 text-gray-600" />
                          </button>
                          <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            <Image className="w-4 h-4 text-gray-600" />
                          </button>
                          <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            <Link className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          onClick={() => generateWithAI('content')}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          Gerar com IA
                        </motion.button>
                      </div>
                      <textarea
                        required
                        rows={8}
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Digite o conteúdo da mensagem..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Template</label>
                    <select
                      value={formData.template}
                      onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione um template</option>
                      <option value="black-friday">Black Friday</option>
                      <option value="newsletter">Newsletter</option>
                      <option value="welcome">Boas-vindas</option>
                      <option value="payment-reminder">Lembrete de Pagamento</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'recipients' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Segmentação Inteligente</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Selecione os destinatários da sua campanha com base em segmentos pré-definidos ou crie filtros personalizados.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Segmento</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <input type="radio" name="segment" className="text-blue-600" defaultChecked />
                        <div>
                          <p className="font-medium">Todos os Contatos</p>
                          <p className="text-sm text-gray-600">1.234 contatos</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <input type="radio" name="segment" className="text-blue-600" />
                        <div>
                          <p className="font-medium">Clientes Ativos</p>
                          <p className="text-sm text-gray-600">892 contatos</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <input type="radio" name="segment" className="text-blue-600" />
                        <div>
                          <p className="font-medium">Leads Qualificados</p>
                          <p className="text-sm text-gray-600">342 contatos</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filtros Adicionais</label>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                        + Localização
                      </button>
                      <button type="button" className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                        + Idade
                      </button>
                      <button type="button" className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                        + Última Compra
                      </button>
                      <button type="button" className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                        + Tags
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'schedule' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quando enviar?</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <input
                          type="radio"
                          name="schedule"
                          value="immediate"
                          checked={formData.schedule === 'immediate'}
                          onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                          className="text-blue-600"
                        />
                        <div>
                          <p className="font-medium">Enviar Agora</p>
                          <p className="text-sm text-gray-600">A campanha será enviada imediatamente</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <input
                          type="radio"
                          name="schedule"
                          value="scheduled"
                          checked={formData.schedule === 'scheduled'}
                          onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                          className="text-blue-600"
                        />
                        <div>
                          <p className="font-medium">Agendar</p>
                          <p className="text-sm text-gray-600">Escolha uma data e hora específica</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <input
                          type="radio"
                          name="schedule"
                          value="recurring"
                          checked={formData.schedule === 'recurring'}
                          onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                          className="text-blue-600"
                        />
                        <div>
                          <p className="font-medium">Recorrente</p>
                          <p className="text-sm text-gray-600">Enviar periodicamente</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {formData.schedule === 'scheduled' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data e Hora</label>
                      <input
                        type="datetime-local"
                        value={formData.scheduledAt}
                        onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  {formData.schedule === 'recurring' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frequência</label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                        <option>Diariamente</option>
                        <option>Semanalmente</option>
                        <option>Quinzenalmente</option>
                        <option>Mensalmente</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancelar
                </motion.button>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {campaign ? 'Atualizar' : 'Criar'} Campanha
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
