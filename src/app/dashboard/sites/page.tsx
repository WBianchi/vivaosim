'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, Plus, Search, Filter, Eye, Edit3, 
  Trash2, Power, PowerOff, ExternalLink, 
  Users, Calendar, TrendingUp, Settings,
  Copy, CheckCircle, AlertTriangle, Clock
} from 'lucide-react'

export default function SitesAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedSite, setSelectedSite] = useState<any>(null)
  const [showNewSiteModal, setShowNewSiteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)

  // Mock de sites dos assinantes
  const sites = [
    {
      id: 1,
      clientName: 'João Silva & Maria Costa',
      domain: 'joaosilva.vivaosim.com.br',
      customDomain: null,
      status: 'active',
      plan: 'Premium',
      createdAt: '2024-01-15',
      lastUpdate: '2024-01-20',
      visitors: 1250,
      conversions: 45,
      template: 'Elegant',
      eventDate: '2024-06-15',
      eventType: 'Casamento'
    },
    {
      id: 2,
      clientName: 'Pedro & Ana Oliveira',
      domain: 'pedrooliveira.vivaosim.com.br',
      customDomain: 'pedroana.com.br',
      status: 'active',
      plan: 'Business',
      createdAt: '2024-01-10',
      lastUpdate: '2024-01-22',
      visitors: 890,
      conversions: 32,
      template: 'Modern',
      eventDate: '2024-07-20',
      eventType: 'Casamento'
    },
    {
      id: 3,
      clientName: 'Lucas Almeida',
      domain: 'lucas15anos.vivaosim.com.br',
      customDomain: null,
      status: 'inactive',
      plan: 'Basic',
      createdAt: '2023-12-20',
      lastUpdate: '2024-01-05',
      visitors: 450,
      conversions: 18,
      template: 'Classic',
      eventDate: '2024-03-10',
      eventType: '15 Anos'
    },
    {
      id: 4,
      clientName: 'Empresa XYZ',
      domain: 'empresaxyz.vivaosim.com.br',
      customDomain: 'evento.empresaxyz.com.br',
      status: 'pending',
      plan: 'Enterprise',
      createdAt: '2024-01-25',
      lastUpdate: '2024-01-25',
      visitors: 0,
      conversions: 0,
      template: 'Corporate',
      eventDate: '2024-04-05',
      eventType: 'Corporativo'
    }
  ]

  const stats = {
    totalSites: sites.length,
    activeSites: sites.filter(s => s.status === 'active').length,
    totalVisitors: sites.reduce((acc, s) => acc + s.visitors, 0),
    totalConversions: sites.reduce((acc, s) => acc + s.conversions, 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'inactive': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo'
      case 'inactive': return 'Inativo'
      case 'pending': return 'Pendente'
      default: return status
    }
  }

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.domain.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || site.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sites dos Assinantes</h1>
            <p className="text-gray-600 dark:text-gray-400">Gerencie todos os sites criados na plataforma</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewSiteModal(true)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Novo Site
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <Globe className="w-8 h-8 text-blue-500" />
            <span className="text-xs text-blue-600 font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSites}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Sites Criados</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <span className="text-xs text-green-600 font-medium">Online</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeSites}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Sites Ativos</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-purple-500" />
            <span className="text-xs text-purple-600 font-medium">+23%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalVisitors.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Visitantes</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-orange-500" />
            <span className="text-xs text-orange-600 font-medium">+15%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalConversions}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Conversões</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou domínio..."
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
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
            <option value="pending">Pendentes</option>
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
                    {site.clientName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {site.eventType} • {site.eventDate}
                  </p>
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
                    href={`https://${site.domain}`} 
                    target="_blank"
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    {site.domain}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                {site.customDomain && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-500" />
                    <a 
                      href={`https://${site.customDomain}`} 
                      target="_blank"
                      className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                    >
                      {site.customDomain}
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">Plano</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{site.plan}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Visitantes</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {site.visitors.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Conversões</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{site.conversions}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.open(`/site-gerado-ia`, '_blank')}
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
                  onClick={() => {
                    setSelectedSite(site)
                    setShowConfigModal(true)
                  }}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Config</span>
                </button>
                <button 
                  className={`p-2 rounded-lg transition-colors ${
                    site.status === 'active' 
                      ? 'bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50'
                      : 'bg-green-100 hover:bg-green-200 text-green-600 dark:bg-green-900/30 dark:hover:bg-green-900/50'
                  }`}
                >
                  {site.status === 'active' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Footer Info */}
            <div className="px-6 py-3 bg-gray-100 dark:bg-gray-900/50 flex items-center justify-between text-xs text-gray-500">
              <span>Criado em {new Date(site.createdAt).toLocaleDateString('pt-BR')}</span>
              <span>Template: {site.template}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSites.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center">
          <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Nenhum site encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Tente ajustar os filtros ou criar um novo site
          </p>
        </div>
      )}

      {/* Modal Novo Site */}
      {showNewSiteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Criar Novo Site</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome do Cliente
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ex: João Silva & Maria Costa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Evento
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Casamento</option>
                  <option>15 Anos</option>
                  <option>Aniversário</option>
                  <option>Corporativo</option>
                  <option>Formatura</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data do Evento
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plano
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Basic</option>
                  <option>Premium</option>
                  <option>Business</option>
                  <option>Enterprise</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewSiteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Criar site
                  setShowNewSiteModal(false)
                }}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                Criar Site
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Editar */}
      {showEditModal && selectedSite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Editar Site</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome do Cliente
                </label>
                <input
                  type="text"
                  defaultValue={selectedSite.clientName}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Domínio Personalizado
                </label>
                <input
                  type="text"
                  defaultValue={selectedSite.customDomain}
                  placeholder="exemplo.com.br"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Template
                </label>
                <select 
                  defaultValue={selectedSite.template}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option>Elegant</option>
                  <option>Modern</option>
                  <option>Classic</option>
                  <option>Corporate</option>
                  <option>Minimal</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedSite(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Salvar alterações
                  setShowEditModal(false)
                  setSelectedSite(null)
                }}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                Salvar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Configurações */}
      {showConfigModal && selectedSite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Configurações do Site</h2>
            
            <div className="space-y-6">
              {/* SEO */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">SEO & Meta Tags</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Título da Página"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <textarea
                    placeholder="Descrição"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Analytics */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Analytics</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Google Analytics ID"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Facebook Pixel ID"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Recursos */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Recursos</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Lista de Presentes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Confirmação de Presença</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Galeria de Fotos</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Mural de Recados</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowConfigModal(false)
                  setSelectedSite(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Salvar configurações
                  setShowConfigModal(false)
                  setSelectedSite(null)
                }}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                Salvar Configurações
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
