'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, Plus, Search, Filter, Eye, Edit3, 
  Trash2, Power, PowerOff, ExternalLink, 
  Users, Calendar, TrendingUp, Settings,
  Copy, CheckCircle, AlertTriangle, Clock, Heart
} from 'lucide-react'
import { 
  FaHeart, 
  FaCheckCircle, 
  FaUsers, 
  FaChartLine,
  FaGlobe,
  FaShoppingBag,
  FaGift
} from 'react-icons/fa'

export default function SitesClientesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedSite, setSelectedSite] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showNewSiteModal, setShowNewSiteModal] = useState(false)
  const [sites, setSites] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalSites: 0,
    publicados: 0,
    rascunhos: 0,
    expirados: 0,
    totalProdutos: 0,
    totalConvidados: 0,
    totalRecebimentos: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSites()
  }, [])

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/sites/clientes')
      const data = await response.json()
      
      if (data.success) {
        setSites(data.sites)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Erro ao buscar sites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este site?')) return
    
    try {
      const response = await fetch(`/api/sites/clientes/${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('✅ Site excluído com sucesso!')
        fetchSites()
      }
    } catch (error) {
      console.error('Erro ao excluir site:', error)
      alert('❌ Erro ao excluir site')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLICADO': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'RASCUNHO': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'PAUSADO': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
      case 'EXPIRADO': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PUBLICADO': return 'Publicado'
      case 'RASCUNHO': return 'Rascunho'
      case 'PAUSADO': return 'Pausado'
      case 'EXPIRADO': return 'Expirado'
      default: return status
    }
  }

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.nomeEvento.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.subdominio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.contact?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || site.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <FaHeart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sites dos Clientes</h1>
            <p className="text-gray-600 dark:text-gray-400">Gerencie os sites dos seus clientes</p>
          </div>
        </div>
        <button
          onClick={() => setShowNewSiteModal(true)}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Site
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <FaGlobe className="w-8 h-8 text-purple-500" />
            <span className="text-xs text-purple-600 font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSites}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Sites de Clientes</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <FaCheckCircle className="w-8 h-8 text-green-500" />
            <span className="text-xs text-green-600 font-medium">Publicados</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.publicados}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Sites Ativos</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <FaUsers className="w-8 h-8 text-blue-500" />
            <span className="text-xs text-blue-600 font-medium">Convidados</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalConvidados.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total de Convidados</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <FaGift className="w-8 h-8 text-orange-500" />
            <span className="text-xs text-orange-600 font-medium">Presentes</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProdutos}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total de Produtos</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente, assinante ou domínio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Todos os Status</option>
            <option value="PUBLICADO">Publicados</option>
            <option value="RASCUNHO">Rascunhos</option>
            <option value="PAUSADO">Pausados</option>
            <option value="EXPIRADO">Expirados</option>
          </select>
        </div>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSites.map((site, index) => (
          <motion.div
            key={site.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Site Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {site.nomeEvento}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {site.tipoEvento.replace('_', ' ')} • {new Date(site.dataEvento).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    👤 Cliente: {site.contact?.name || 'N/A'}
                  </p>
                  {site.atendente && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      👨‍💼 Atendente: {site.atendente.name}
                    </p>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(site.status)}`}>
                  {getStatusLabel(site.status)}
                </span>
              </div>

              {/* Domains */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <a 
                    href={`https://${site.subdominio}.vivaosim.com.br`} 
                    target="_blank"
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    {site.subdominio}.vivaosim.com.br
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                {site.dominioCustom && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-500" />
                    <a 
                      href={`https://${site.dominioCustom}`} 
                      target="_blank"
                      className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                    >
                      {site.dominioCustom}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Site Stats */}
            <div className="p-6 bg-gray-50 dark:bg-gray-700/50">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Produtos</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{site._count?.produtos || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Convidados</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {site._count?.convidados || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Vendas</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{site._count?.recebimentos || 0}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.open(`https://${site.subdominio}.vivaosim.com.br`, '_blank')}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Visualizar</span>
                </button>
                <button 
                  onClick={() => {
                    setSelectedSite(site)
                    setShowEditModal(true)
                  }}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="text-sm">Editar</span>
                </button>
                <button 
                  onClick={() => handleDelete(site.id)}
                  className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Footer Info */}
            <div className="px-6 py-3 bg-gray-100 dark:bg-gray-900/50 flex items-center justify-between text-xs text-gray-500">
              <span>Criado em {new Date(site.createdAt).toLocaleDateString('pt-BR')}</span>
              <span>Evento: {new Date(site.dataEvento).toLocaleDateString('pt-BR')}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSites.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Nenhum site de cliente encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Clique em "Novo Site" para criar o primeiro site de cliente
          </p>
        </div>
      )}

      {/* Modals */}
      {showNewSiteModal && <NewSiteModal onClose={() => setShowNewSiteModal(false)} onSuccess={fetchSites} />}
      {showEditModal && selectedSite && (
        <EditSiteModal 
          site={selectedSite} 
          onClose={() => {
            setShowEditModal(false)
            setSelectedSite(null)
          }} 
          onSuccess={fetchSites} 
        />
      )}
    </div>
  )
}

function NewSiteModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [contacts, setContacts] = useState<any[]>([])
  const [formData, setFormData] = useState({
    contactId: '',
    tipoEvento: 'CASAMENTO',
    nomeEvento: '',
    dataEvento: '',
    localEvento: '',
    descricaoEvento: '',
    subdominio: '',
    corPrimaria: '#FF6B35',
    corSecundaria: '#004E89',
    corDestaque: '#FFC857'
  })

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts?limit=1000')
      const data = await response.json()
      if (data.contacts) {
        setContacts(data.contacts)
      }
    } catch (error) {
      console.error('Erro ao buscar contatos:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/sites/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Site criado com sucesso!')
        onSuccess()
        onClose()
      } else {
        alert('❌ ' + (data.error || 'Erro ao criar site'))
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('❌ Erro ao criar site')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Criar Novo Site</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Preencha os dados do site do cliente
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cliente *
            </label>
            <select
              required
              value={formData.contactId}
              onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Selecione um cliente</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.name} {contact.phone ? `- ${contact.phone}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Evento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Evento *
            </label>
            <select
              required
              value={formData.tipoEvento}
              onChange={(e) => setFormData({ ...formData, tipoEvento: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="CASAMENTO">Casamento</option>
              <option value="ANOS_15">15 Anos</option>
              <option value="ANIVERSARIO">Aniversário</option>
              <option value="FORMATURA">Formatura</option>
              <option value="CORPORATIVO">Corporativo</option>
              <option value="CHA_BEBE">Chá de Bebê</option>
              <option value="CHA_PANELA">Chá de Panela</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>

          {/* Nome do Evento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Evento *
            </label>
            <input
              type="text"
              required
              value={formData.nomeEvento}
              onChange={(e) => setFormData({ ...formData, nomeEvento: e.target.value })}
              placeholder="Ex: Casamento Ana & Carlos"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Data do Evento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data do Evento *
            </label>
            <input
              type="date"
              required
              value={formData.dataEvento}
              onChange={(e) => setFormData({ ...formData, dataEvento: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Local do Evento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Local do Evento
            </label>
            <input
              type="text"
              value={formData.localEvento}
              onChange={(e) => setFormData({ ...formData, localEvento: e.target.value })}
              placeholder="Ex: Salão de Festas Villa Real"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Subdomínio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subdomínio *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={formData.subdominio}
                onChange={(e) => setFormData({ ...formData, subdominio: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                placeholder="ana-carlos"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <span className="text-sm text-gray-500">.vivaosim.com.br</span>
            </div>
          </div>

          {/* Cores */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cor Primária
              </label>
              <input
                type="color"
                value={formData.corPrimaria}
                onChange={(e) => setFormData({ ...formData, corPrimaria: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cor Secundária
              </label>
              <input
                type="color"
                value={formData.corSecundaria}
                onChange={(e) => setFormData({ ...formData, corSecundaria: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cor Destaque
              </label>
              <input
                type="color"
                value={formData.corDestaque}
                onChange={(e) => setFormData({ ...formData, corDestaque: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição do Evento
            </label>
            <textarea
              value={formData.descricaoEvento}
              onChange={(e) => setFormData({ ...formData, descricaoEvento: e.target.value })}
              placeholder="Uma breve descrição sobre o evento..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4">
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
              className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Site'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function EditSiteModal({ site, onClose, onSuccess }: { site: any; onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nomeEvento: site.nomeEvento || '',
    tipoEvento: site.tipoEvento || 'CASAMENTO',
    dataEvento: site.dataEvento ? new Date(site.dataEvento).toISOString().split('T')[0] : '',
    localEvento: site.localEvento || '',
    descricaoEvento: site.descricaoEvento || '',
    subdominio: site.subdominio || '',
    dominioCustom: site.dominioCustom || '',
    corPrimaria: site.corPrimaria || '#FF6B35',
    corSecundaria: site.corSecundaria || '#004E89',
    corDestaque: site.corDestaque || '#FFC857',
    status: site.status || 'RASCUNHO',
    logo: site.logo || '',
    banner: site.banner || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/sites/clientes/${site.id}`, {
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
        alert('❌ ' + (data.error || 'Erro ao atualizar site'))
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('❌ Erro ao atualizar site')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Editar Site</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Atualize os dados do site: {site.nomeEvento}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status *
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="RASCUNHO">Rascunho</option>
              <option value="PUBLICADO">Publicado</option>
              <option value="PAUSADO">Pausado</option>
              <option value="EXPIRADO">Expirado</option>
            </select>
          </div>

          {/* Tipo de Evento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Evento *
            </label>
            <select
              required
              value={formData.tipoEvento}
              onChange={(e) => setFormData({ ...formData, tipoEvento: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="CASAMENTO">Casamento</option>
              <option value="ANOS_15">15 Anos</option>
              <option value="ANIVERSARIO">Aniversário</option>
              <option value="FORMATURA">Formatura</option>
              <option value="CORPORATIVO">Corporativo</option>
              <option value="CHA_BEBE">Chá de Bebê</option>
              <option value="CHA_PANELA">Chá de Panela</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>

          {/* Nome do Evento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Evento *
            </label>
            <input
              type="text"
              required
              value={formData.nomeEvento}
              onChange={(e) => setFormData({ ...formData, nomeEvento: e.target.value })}
              placeholder="Ex: Casamento Ana & Carlos"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Data do Evento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data do Evento *
            </label>
            <input
              type="date"
              required
              value={formData.dataEvento}
              onChange={(e) => setFormData({ ...formData, dataEvento: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Local do Evento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Local do Evento
            </label>
            <input
              type="text"
              value={formData.localEvento}
              onChange={(e) => setFormData({ ...formData, localEvento: e.target.value })}
              placeholder="Ex: Salão de Festas Villa Real"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Subdomínio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subdomínio *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={formData.subdominio}
                onChange={(e) => setFormData({ ...formData, subdominio: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                placeholder="ana-carlos"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <span className="text-sm text-gray-500">.vivaosim.com.br</span>
            </div>
          </div>

          {/* Domínio Customizado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Domínio Customizado (Opcional)
            </label>
            <input
              type="text"
              value={formData.dominioCustom}
              onChange={(e) => setFormData({ ...formData, dominioCustom: e.target.value })}
              placeholder="Ex: meueventoespecial.com.br"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* URLs de Imagens */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL da Logo
              </label>
              <input
                type="text"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL do Banner
              </label>
              <input
                type="text"
                value={formData.banner}
                onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Cores */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cor Primária
              </label>
              <input
                type="color"
                value={formData.corPrimaria}
                onChange={(e) => setFormData({ ...formData, corPrimaria: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cor Secundária
              </label>
              <input
                type="color"
                value={formData.corSecundaria}
                onChange={(e) => setFormData({ ...formData, corSecundaria: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cor Destaque
              </label>
              <input
                type="color"
                value={formData.corDestaque}
                onChange={(e) => setFormData({ ...formData, corDestaque: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição do Evento
            </label>
            <textarea
              value={formData.descricaoEvento}
              onChange={(e) => setFormData({ ...formData, descricaoEvento: e.target.value })}
              placeholder="Uma breve descrição sobre o evento..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4">
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
              className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
