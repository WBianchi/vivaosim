'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, UserPlus, Search, Mail, Phone, 
  Check, X, Clock, Edit3, Trash2
} from 'lucide-react'

interface Convidado {
  id: string
  nome: string
  email: string | null
  telefone: string | null
  numeroConvites: number
  status: 'PENDENTE' | 'CONFIRMADO' | 'RECUSADO'
  observacoes: string | null
  presenteEvento: boolean
}

interface Stats {
  total: number
  confirmados: number
  pendentes: number
  recusados: number
  totalConvites: number
  presentes: number
}

export default function ConvidadosPage() {
  const [loading, setLoading] = useState(true)
  const [convidados, setConvidados] = useState<Convidado[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    confirmados: 0,
    pendentes: 0,
    recusados: 0,
    totalConvites: 0,
    presentes: 0
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedConvidado, setSelectedConvidado] = useState<Convidado | null>(null)

  useEffect(() => {
    fetchConvidados()
  }, [])

  const fetchConvidados = async () => {
    try {
      const response = await fetch('/api/convidados')
      const data = await response.json()
      
      console.log('📊 Dados recebidos:', data)
      
      if (data.success) {
        setConvidados(data.convidados || [])
        setStats(data.stats || {
          total: 0,
          confirmados: 0,
          pendentes: 0,
          recusados: 0,
          totalConvites: 0,
          presentes: 0
        })
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este convidado?')) return

    try {
      const response = await fetch(`/api/convidados/${id}`, { method: 'DELETE' })
      const data = await response.json()

      if (data.success) {
        alert('✅ Convidado removido')
        fetchConvidados()
      } else {
        alert('❌ ' + data.error)
      }
    } catch (error) {
      alert('❌ Erro')
    }
  }

  const filteredConvidados = convidados.filter(c => {
    const matchesSearch = c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || c.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMADO': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'PENDENTE': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'RECUSADO': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Convidados</h1>
            <p className="text-gray-600 dark:text-gray-400">Gerencie sua lista de convidados</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Adicionar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <StatCard icon={<Users className="w-6 h-6 text-blue-500" />} value={stats?.total || 0} label="Total" />
        <StatCard icon={<Check className="w-6 h-6 text-green-500" />} value={stats?.confirmados || 0} label="Confirmados" />
        <StatCard icon={<Clock className="w-6 h-6 text-yellow-500" />} value={stats?.pendentes || 0} label="Pendentes" />
        <StatCard icon={<X className="w-6 h-6 text-red-500" />} value={stats?.recusados || 0} label="Recusados" />
        <StatCard icon={<Users className="w-6 h-6 text-purple-500" />} value={stats?.totalConvites || 0} label="Convites" />
        <StatCard icon={<Check className="w-6 h-6 text-orange-500" />} value={stats?.presentes || 0} label="Presentes" />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
          >
            <option value="all">Todos</option>
            <option value="CONFIRMADO">Confirmados</option>
            <option value="PENDENTE">Pendentes</option>
            <option value="RECUSADO">Recusados</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      {filteredConvidados.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Convites</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredConvidados.map((c) => (
                <tr key={c.id}>
                  <td className="px-6 py-4">
                    <p className="font-medium">{c.nome}</p>
                    {c.observacoes && <p className="text-sm text-gray-500">{c.observacoes}</p>}
                  </td>
                  <td className="px-6 py-4">
                    {c.email && <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4" />{c.email}</div>}
                    {c.telefone && <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4" />{c.telefone}</div>}
                  </td>
                  <td className="px-6 py-4">{c.numeroConvites}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedConvidado(c); setShowEditModal(true); }} className="p-2 hover:bg-gray-100 rounded">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-2 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState />
      )}

      {showAddModal && <AddModal onClose={() => setShowAddModal(false)} onSuccess={() => { fetchConvidados(); setShowAddModal(false); }} />}
      {showEditModal && selectedConvidado && (
        <EditModal 
          convidado={selectedConvidado}
          onClose={() => { setShowEditModal(false); setSelectedConvidado(null); }}
          onSuccess={() => { fetchConvidados(); setShowEditModal(false); setSelectedConvidado(null); }}
        />
      )}
    </div>
  )
}

function StatCard({ icon, value, label }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border">
      {icon}
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center">
      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Nenhum convidado</h3>
      <p className="text-gray-600">Adicione seu primeiro convidado</p>
    </div>
  )
}

function AddModal({ onClose, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const [loadingSite, setLoadingSite] = useState(true)
  const [siteId, setSiteId] = useState('')
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', numeroConvites: 1, observacoes: '' })

  useEffect(() => {
    fetch('/api/sites/clientes/my-site')
      .then(r => r.json())
      .then(d => {
        console.log('📋 Site data:', d)
        if (d.success && d.site) {
          setSiteId(d.site.id)
          console.log('✅ SiteId carregado:', d.site.id)
        } else {
          console.log('❌ Sem site vinculado')
        }
      })
      .catch(err => console.error('Erro ao buscar site:', err))
      .finally(() => setLoadingSite(false))
  }, [])

  const submit = async (e: any) => {
    e.preventDefault()
    
    if (!siteId) {
      alert('❌ Você precisa ter um site vinculado para adicionar convidados. Entre em contato com o atendente.')
      return
    }

    console.log('📤 Enviando:', { siteId, ...form })
    
    setLoading(true)
    const res = await fetch('/api/convidados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteId, ...form })
    })
    const data = await res.json()
    setLoading(false)
    if (data.success) { alert('✅ Adicionado'); onSuccess(); } else alert('❌ ' + data.error)
  }

  if (loadingSite) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!siteId) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Site não encontrado</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Você precisa ter um site vinculado para gerenciar convidados. Entre em contato com seu atendente.
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
          >
            Entendi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Adicionar Convidado</h2>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <input required placeholder="Nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          <input type="tel" placeholder="Telefone" value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          <input type="number" required min="1" placeholder="Convites" value={form.numeroConvites} onChange={e => setForm({...form, numeroConvites: +e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          <textarea placeholder="Observações" value={form.observacoes} onChange={e => setForm({...form, observacoes: e.target.value})} rows={3} className="w-full px-4 py-2 border rounded-lg" />
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg">{loading ? 'Salvando...' : 'Adicionar'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function EditModal({ convidado, onClose, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: convidado.nome,
    email: convidado.email || '',
    telefone: convidado.telefone || '',
    numeroConvites: convidado.numeroConvites,
    status: convidado.status,
    observacoes: convidado.observacoes || '',
    presenteEvento: convidado.presenteEvento
  })

  const submit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch(`/api/convidados/${convidado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setLoading(false)
    if (data.success) { alert('✅ Atualizado'); onSuccess(); } else alert('❌ ' + data.error)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Editar Convidado</h2>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <input required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          <input type="tel" value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          <input type="number" required min="1" value={form.numeroConvites} onChange={e => setForm({...form, numeroConvites: +e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          <select required value={form.status} onChange={e => setForm({...form, status: e.target.value as any})} className="w-full px-4 py-2 border rounded-lg">
            <option value="PENDENTE">Pendente</option>
            <option value="CONFIRMADO">Confirmado</option>
            <option value="RECUSADO">Recusado</option>
          </select>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.presenteEvento} onChange={e => setForm({...form, presenteEvento: e.target.checked})} />
            Presente no evento
          </label>
          <textarea value={form.observacoes} onChange={e => setForm({...form, observacoes: e.target.value})} rows={3} className="w-full px-4 py-2 border rounded-lg" />
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg">{loading ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
