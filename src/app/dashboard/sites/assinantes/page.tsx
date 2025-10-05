'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, Plus, Search, Filter, Eye, Edit3, 
  Trash2, Power, PowerOff, ExternalLink, 
  Users, Calendar, TrendingUp, Settings,
  Copy, CheckCircle, AlertTriangle, Clock
} from 'lucide-react'
import { 
  FaGlobe, 
  FaCheckCircle, 
  FaUsers, 
  FaChartLine,
  FaPlus,
  FaExclamationTriangle,
  FaClock
} from 'react-icons/fa'
import { CreateSiteModal } from '@/components/sites/CreateSiteModal'
import { EditSiteModal } from '@/components/sites/EditSiteModal'
import { ConfigSiteModal } from '@/components/sites/ConfigSiteModal'

export default function SitesAssinantesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedSite, setSelectedSite] = useState<any>(null)
  const [showNewSiteModal, setShowNewSiteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [sites, setSites] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalSites: 0,
    activeSites: 0,
    expiredSites: 0,
    suspendedSites: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSites()
  }, [])

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/sites/assinantes')
      const data = await response.json()
      
      if (data.success) {
        setSites(data.data)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Erro ao buscar sites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (siteId: string, currentStatus: string) => {
    try {
      const action = currentStatus === 'active' ? 'deactivate' : 'activate'
      
      const response = await fetch(`/api/sites/assinantes/${siteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      const data = await response.json()

      if (data.success) {
        fetchSites() // Recarregar lista
      } else {
        alert('Erro: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      alert('Erro ao alterar status do site')
    }
  }

  // Mock de sites dos assinantes (removido - agora vem da API)
  const mockSites = [
    {
      id: 1,
      subscriberName: 'João Silva & Maria Costa',
      domain: 'joaosilva.vivaosim.com.br',
      customDomain: null,
      status: 'active',
      plan: 'Premium',
      subscription: 'Ativa',
      createdAt: '2024-01-15',
      activatedAt: '2024-01-16',
      expiresAt: '2025-01-15',
      configType: 'AI',
      primaryColor: '#FF6B35',
      segment: 'Casamento',
      serverType: 'VIVAOSIM',
      visitors: 1250,
      conversions: 45
    },
    {
      id: 2,
      subscriberName: 'Pedro & Ana Oliveira',
      domain: 'pedrooliveira.vivaosim.com.br',
      customDomain: 'pedroana.com.br',
      status: 'active',
      plan: 'Business',
      subscription: 'Ativa',
      createdAt: '2024-01-10',
      activatedAt: '2024-01-11',
      expiresAt: '2025-01-10',
      configType: 'Manual',
      primaryColor: '#004E89',
      segment: 'Casamento',
      serverType: 'VIVAOSIM',
      visitors: 890,
      conversions: 32
    },
    {
      id: 3,
      subscriberName: 'Lucas Almeida',
      domain: 'lucas15anos.vivaosim.com.br',
      customDomain: null,
      status: 'expired',
      plan: 'Basic',
      subscription: 'Expirada',
      createdAt: '2023-12-20',
      activatedAt: '2023-12-21',
      expiresAt: '2024-01-20',
      configType: 'Manual',
      primaryColor: '#8B5CF6',
      segment: '15 Anos',
      serverType: 'VIVAOSIM',
      visitors: 450,
      conversions: 18
    },
    {
      id: 4,
      subscriberName: 'Empresa XYZ',
      domain: 'empresaxyz.vivaosim.com.br',
      customDomain: 'evento.empresaxyz.com.br',
      status: 'suspended',
      plan: 'Enterprise',
      subscription: 'Suspensa',
      createdAt: '2024-01-25',
      activatedAt: null,
      expiresAt: '2025-01-25',
      configType: 'AI',
      primaryColor: '#10B981',
      segment: 'Corporativo',
      serverType: 'PROPRIO',
      visitors: 0,
      conversions: 0
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'expired': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'suspended': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'pending': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo'
      case 'expired': return 'Expirado'
      case 'suspended': return 'Suspenso'
      case 'pending': return 'Pendente'
      default: return status
    }
  }

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.subscriberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            <p className="text-gray-600 dark:text-gray-400">Gerencie os sites vinculados aos planos e assinaturas</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewSiteModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl flex items-center gap-2 shadow-lg shadow-orange-500/30"
        >
          <FaPlus className="w-4 h-4" />
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
            <FaGlobe className="w-8 h-8 text-blue-500" />
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
            <FaCheckCircle className="w-8 h-8 text-green-500" />
            <span className="text-xs text-green-600 font-medium">Ativos</span>
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
            <FaExclamationTriangle className="w-8 h-8 text-red-500" />
            <span className="text-xs text-red-600 font-medium">Expirados</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.expiredSites}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Sites Expirados</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <FaClock className="w-8 h-8 text-yellow-500" />
            <span className="text-xs text-yellow-600 font-medium">Suspensos</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.suspendedSites}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Sites Suspensos</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por assinante ou domínio..."
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
            <option value="expired">Expirados</option>
            <option value="suspended">Suspensos</option>
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
                    {site.subscriberName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {site.segment} • Plano {site.plan}
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

            {/* Site Info */}
            <div className="p-6 bg-gray-50 dark:bg-gray-700/50">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Configuração</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {site.configType === 'AI' ? '🤖 IA' : '✋ Manual'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Servidor</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {site.serverType === 'VIVAOSIM' ? '☁️ Viva o Sim' : '🖥️ Próprio'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Expira em</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(site.expiresAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cor Principal</p>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border border-gray-300"
                      style={{ backgroundColor: site.primaryColor }}
                    />
                    <p className="font-semibold text-gray-900 dark:text-white text-xs">
                      {site.primaryColor}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(`https://${site.domain}`, '_blank')}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
                  title="Visualizar site"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm font-medium">Ver Site</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedSite(site)
                    setShowEditModal(true)
                  }}
                  className="p-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  title="Editar site"
                >
                  <Edit3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedSite(site)
                    setShowConfigModal(true)
                  }}
                  className="p-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  title="Configurações"
                >
                  <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToggleStatus(site.id, site.status)}
                  className={`p-2.5 rounded-lg transition-all ${
                    site.status === 'active' 
                      ? 'bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50'
                      : 'bg-green-100 hover:bg-green-200 text-green-600 dark:bg-green-900/30 dark:hover:bg-green-900/50'
                  }`}
                  title={site.status === 'active' ? 'Desativar site' : 'Ativar site'}
                >
                  {site.status === 'active' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>

            {/* Footer Info */}
            <div className="px-6 py-3 bg-gray-100 dark:bg-gray-900/50 flex items-center justify-between text-xs text-gray-500">
              <span>Criado em {new Date(site.createdAt).toLocaleDateString('pt-BR')}</span>
              <span>Assinatura: {site.subscription}</span>
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

      {/* Modal Criar Site */}
      {showNewSiteModal && (
        <CreateSiteModal
          onClose={() => setShowNewSiteModal(false)}
          onSuccess={fetchSites}
        />
      )}

      {/* Modal Editar Site */}
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

      {/* Modal Configurações */}
      {showConfigModal && selectedSite && (
        <ConfigSiteModal
          site={selectedSite}
          onClose={() => {
            setShowConfigModal(false)
            setSelectedSite(null)
          }}
        />
      )}
    </div>
  )
}
