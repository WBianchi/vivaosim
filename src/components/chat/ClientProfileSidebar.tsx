'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, User, Tag, Ticket, Calendar, FileText, FileSignature, 
  DollarSign, Globe, Users, Gift, ShoppingCart, StickyNote,
  Save, Mail, Phone, Building, MapPin, Edit2, Key, RefreshCw, Send
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ClientProfileSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatId: string
  contactName: string
  contactPhone: string
}

type TabType = 'perfil' | 'tags' | 'ticket' | 'reuniao' | 'orcamento' | 'contrato' | 'custos' | 'site' | 'convidados' | 'presentes' | 'vendas' | 'anotacoes'

export const ClientProfileSidebar: React.FC<ClientProfileSidebarProps> = ({
  isOpen,
  onClose,
  chatId,
  contactName,
  contactPhone
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('perfil')
  const [clientData, setClientData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: contactName || '',
    email: '',
    phone: contactPhone || '',
    company: '',
    type: 'individual',
    status: 'active',
    priority: 'medium',
    source: 'whatsapp',
    attendant: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    documents: {
      cpf: '',
      cnpj: ''
    },
    tags: '',
    notes: '',
    password: '',
    sendCredentials: false
  })

  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'tags', label: 'Tags', icon: Tag },
    { id: 'ticket', label: 'Ticket', icon: Ticket },
    { id: 'reuniao', label: 'Reunião', icon: Calendar },
    { id: 'orcamento', label: 'Orçamento', icon: FileText },
    { id: 'contrato', label: 'Contrato', icon: FileSignature },
    { id: 'custos', label: 'Custos', icon: DollarSign },
    { id: 'site', label: 'Site', icon: Globe },
    { id: 'convidados', label: 'Convidados', icon: Users },
    { id: 'presentes', label: 'Presentes', icon: Gift },
    { id: 'vendas', label: 'Vendas', icon: ShoppingCart },
    { id: 'anotacoes', label: 'Anotações', icon: StickyNote },
  ] as const

  useEffect(() => {
    if (isOpen) {
      fetchOrCreateClient()
    }
  }, [isOpen, chatId])

  const fetchOrCreateClient = async () => {
    try {
      setLoading(true)
      console.log('🔍 Buscando/criando cliente para chat:', chatId)

      // Buscar se já existe cliente vinculado ao chat
      const response = await fetch(`/api/clients/by-chat/${chatId}`)
      
      if (response.ok) {
        const client = await response.json()
        console.log('✅ Cliente encontrado:', client)
        setClientData(client)
        setFormData({
          name: client.name || contactName,
          email: client.email || '',
          phone: client.phone || contactPhone,
          company: client.company || '',
          type: client.type || 'individual',
          status: client.status || 'active',
          priority: client.priority || 'medium',
          source: client.source || 'whatsapp',
          attendant: client.attendant || '',
          address: client.address || {
            street: '',
            city: '',
            state: '',
            zipCode: ''
          },
          documents: client.documents || {
            cpf: '',
            cnpj: ''
          },
          tags: client.tags?.join(', ') || '',
          notes: client.notes || '',
          password: '',
          sendCredentials: false
        })
      } else {
        // Criar novo cliente automaticamente
        console.log('📝 Criando novo cliente para o chat')
        const newClient = await createClient()
        if (newClient) {
          setClientData(newClient)
          setFormData({
            name: newClient.name || contactName,
            email: newClient.email || '',
            phone: newClient.phone || contactPhone,
            company: newClient.company || '',
            type: newClient.type || 'individual',
            status: newClient.status || 'active',
            priority: newClient.priority || 'medium',
            source: newClient.source || 'whatsapp',
            attendant: newClient.attendant || '',
            address: newClient.address || {
              street: '',
              city: '',
              state: '',
              zipCode: ''
            },
            documents: newClient.documents || {
              cpf: '',
              cnpj: ''
            },
            tags: newClient.tags?.join(', ') || '',
            notes: newClient.notes || '',
            password: '',
            sendCredentials: false
          })
        } else {
          console.error('❌ Falha ao criar cliente')
        }
      }
    } catch (error) {
      console.error('❌ Erro ao buscar/criar cliente:', error)
    } finally {
      setLoading(false)
    }
  }

  const createClient = async () => {
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactName || 'Cliente WhatsApp',
          phone: contactPhone,
          email: '',
          type: 'individual',
          status: 'active',
          priority: 'medium',
          source: 'whatsapp',
          whatsappChatId: chatId
        })
      })

      if (!response.ok) throw new Error('Erro ao criar cliente')

      const newClient = await response.json()
      console.log('✅ Cliente criado:', newClient)
      return newClient
    } catch (error) {
      console.error('❌ Erro ao criar cliente:', error)
      return null
    }
  }

  const generatePassword = () => {
    const length = 12
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'
    let password = ''
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setFormData(prev => ({ ...prev, password }))
  }

  const sendCredentialsByWhatsApp = async () => {
    try {
      if (!formData.email || !formData.password) {
        alert('Por favor, preencha o email e gere uma senha primeiro')
        return
      }

      const message = `🔐 *Credenciais de Acesso - Viva o Sim*\n\n` +
        `Olá ${formData.name}! Suas credenciais de acesso ao sistema:\n\n` +
        `📧 *Email:* ${formData.email}\n` +
        `🔑 *Senha:* ${formData.password}\n\n` +
        `🌐 *Acesse:* https://vivaosim.com.br/login\n\n` +
        `_Guarde essas informações em local seguro._`

      const response = await fetch('/api/whatsapp/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: chatId,
          message: message
        })
      })

      if (response.ok) {
        alert('✅ Credenciais enviadas por WhatsApp com sucesso!')
        setFormData(prev => ({ ...prev, sendCredentials: false }))
      } else {
        throw new Error('Erro ao enviar mensagem')
      }
    } catch (error) {
      console.error('❌ Erro ao enviar credenciais:', error)
      alert('❌ Erro ao enviar credenciais por WhatsApp')
    }
  }

  const handleSave = async () => {
    try {
      if (!clientData || !clientData.id) {
        console.error('❌ Cliente não encontrado para salvar')
        return
      }

      console.log('💾 Salvando dados do cliente...')

      const response = await fetch(`/api/clients/${clientData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
        })
      })

      if (!response.ok) throw new Error('Erro ao salvar cliente')

      console.log('✅ Cliente atualizado com sucesso')
      
      // Enviar credenciais por WhatsApp se solicitado
      if (formData.sendCredentials && formData.email && formData.password) {
        await sendCredentialsByWhatsApp()
      }

      await fetchOrCreateClient()
    } catch (error) {
      console.error('❌ Erro ao salvar cliente:', error)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {contactName || 'Cliente'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {contactPhone}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 px-6 scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap',
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {activeTab === 'perfil' && (
                    <PerfilTab formData={formData} setFormData={setFormData} />
                  )}
                  {activeTab === 'tags' && <TagsTab clientData={clientData} />}
                  {activeTab === 'ticket' && <TicketTab clientData={clientData} />}
                  {activeTab === 'reuniao' && <ReuniaoTab clientData={clientData} />}
                  {activeTab === 'orcamento' && <OrcamentoTab clientData={clientData} />}
                  {activeTab === 'contrato' && <ContratoTab clientData={clientData} />}
                  {activeTab === 'custos' && <CustosTab clientData={clientData} />}
                  {activeTab === 'site' && <SiteTab clientData={clientData} />}
                  {activeTab === 'convidados' && <ConvidadosTab clientData={clientData} />}
                  {activeTab === 'presentes' && <PresentesTab clientData={clientData} />}
                  {activeTab === 'vendas' && <VendasTab clientData={clientData} />}
                  {activeTab === 'anotacoes' && <AnotacoesTab formData={formData} setFormData={setFormData} />}
                </>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Tab Components
const PerfilTab = ({ formData, setFormData }: any) => (
  <div className="space-y-6">
    <div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <User className="w-5 h-5" />
        Informações Básicas
      </h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nome do cliente"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="email@cliente.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Telefone (WhatsApp)
          </label>
          <input
            type="tel"
            value={formData.phone}
            disabled
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed"
            placeholder="(11) 99999-9999"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Telefone vinculado ao WhatsApp (não editável)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Empresa (Opcional)
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, company: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nome da empresa"
          />
        </div>
      </div>
    </div>

    <div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Tag className="w-5 h-5" />
        Classificação
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de Cliente
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="individual">Pessoa Física</option>
            <option value="company">Pessoa Jurídica</option>
            <option value="vip">Cliente VIP</option>
            <option value="prospect">Prospect</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="pending">Pendente</option>
            <option value="blocked">Bloqueado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prioridade
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, priority: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Origem
          </label>
          <select
            value={formData.source}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, source: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="website">Website</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="google">Google Ads</option>
            <option value="referral">Indicação</option>
          </select>
        </div>
      </div>
    </div>

    <div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5" />
        Endereço (Opcional)
      </h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Logradouro
          </label>
          <input
            type="text"
            value={formData.address.street}
            onChange={(e) => setFormData((prev: any) => ({ 
              ...prev, 
              address: { ...prev.address, street: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Rua, Avenida, etc."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cidade
            </label>
            <input
              type="text"
              value={formData.address.city}
              onChange={(e) => setFormData((prev: any) => ({ 
                ...prev, 
                address: { ...prev.address, city: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Cidade"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <input
              type="text"
              value={formData.address.state}
              onChange={(e) => setFormData((prev: any) => ({ 
                ...prev, 
                address: { ...prev.address, state: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="UF"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            CEP
          </label>
          <input
            type="text"
            value={formData.address.zipCode}
            onChange={(e) => setFormData((prev: any) => ({ 
              ...prev, 
              address: { ...prev.address, zipCode: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="00000-000"
          />
        </div>
      </div>
    </div>

    {/* Acesso ao Sistema */}
    <div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Key className="w-5 h-5" />
        Acesso ao Sistema
      </h3>
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
            Configure as credenciais de acesso do cliente à plataforma
          </p>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Senha de Acesso
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, password: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Clique para gerar senha"
                />
                <button
                  type="button"
                  onClick={() => {
                    const length = 12
                    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'
                    let password = ''
                    for (let i = 0; i < length; i++) {
                      password += charset.charAt(Math.floor(Math.random() * charset.length))
                    }
                    setFormData((prev: any) => ({ ...prev, password }))
                  }}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Gerar
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <input
                type="checkbox"
                id="sendCredentials"
                checked={formData.sendCredentials}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, sendCredentials: e.target.checked }))}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="sendCredentials" className="flex-1 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                <div className="font-medium flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Enviar credenciais por WhatsApp
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ao salvar, enviará email, senha e link de acesso (https://vivaosim.com.br/login)
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const TagsTab = ({ clientData }: any) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-gray-900 dark:text-white">Gerenciar Tags</h3>
    <p className="text-gray-600 dark:text-gray-400">Tags do cliente em desenvolvimento...</p>
  </div>
)

const TicketTab = ({ clientData }: any) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-gray-900 dark:text-white">Tickets</h3>
    <p className="text-gray-600 dark:text-gray-400">Lista de tickets em desenvolvimento...</p>
  </div>
)

const ReuniaoTab = ({ clientData }: any) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-gray-900 dark:text-white">Reuniões Agendadas</h3>
    <p className="text-gray-600 dark:text-gray-400">Agenda de reuniões em desenvolvimento...</p>
  </div>
)

const OrcamentoTab = ({ clientData }: any) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-gray-900 dark:text-white">Orçamentos</h3>
    <p className="text-gray-600 dark:text-gray-400">Lista de orçamentos em desenvolvimento...</p>
  </div>
)

const ContratoTab = ({ clientData }: any) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-gray-900 dark:text-white">Contratos</h3>
    <p className="text-gray-600 dark:text-gray-400">Contratos do cliente em desenvolvimento...</p>
  </div>
)

const CustosTab = ({ clientData }: any) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-gray-900 dark:text-white">Custos</h3>
    <p className="text-gray-600 dark:text-gray-400">Controle de custos em desenvolvimento...</p>
  </div>
)

const SiteTab = ({ clientData }: any) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-gray-900 dark:text-white">Site do Cliente</h3>
    <p className="text-gray-600 dark:text-gray-400">Informações do site em desenvolvimento...</p>
  </div>
)

const ConvidadosTab = ({ clientData }: any) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-gray-900 dark:text-white">Convidados</h3>
    <p className="text-gray-600 dark:text-gray-400">Lista de convidados em desenvolvimento...</p>
  </div>
)

const PresentesTab = ({ clientData }: any) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-gray-900 dark:text-white">Lista de Presentes</h3>
    <p className="text-gray-600 dark:text-gray-400">Gerenciamento de presentes em desenvolvimento...</p>
  </div>
)

const VendasTab = ({ clientData }: any) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-gray-900 dark:text-white">Histórico de Vendas</h3>
    <p className="text-gray-600 dark:text-gray-400">Vendas realizadas em desenvolvimento...</p>
  </div>
)

const AnotacoesTab = ({ formData, setFormData }: any) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-gray-900 dark:text-white">Anotações</h3>
    <textarea
      rows={12}
      value={formData.notes}
      onChange={(e) => setFormData((prev: any) => ({ ...prev, notes: e.target.value }))}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Adicione observações importantes sobre o cliente..."
    />
  </div>
)
