'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ShoppingCart, Plus, Package, DollarSign, Eye, Edit3, Trash2, Sparkles
} from 'lucide-react'

interface Produto {
  id: string
  nome: string
  descricao: string | null
  imagem: string | null
  preco: number
  quantidade: number
  vendidos: number
  categoria: string | null
  ativo: boolean
  destaque: boolean
}

interface Stats {
  total: number
  ativos: number
  vendidos: number
  totalArrecadado: number
}

export default function ComprasPage() {
  const [loading, setLoading] = useState(true)
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    ativos: 0,
    vendidos: 0,
    totalArrecadado: 0
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null)

  useEffect(() => {
    fetchProdutos()
  }, [])

  const fetchProdutos = async () => {
    try {
      const response = await fetch('/api/produtos')
      const data = await response.json()
      
      if (data.success) {
        setProdutos(data.produtos)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este produto?')) return

    try {
      const response = await fetch(`/api/produtos/${id}`, { method: 'DELETE' })
      const data = await response.json()

      if (data.success) {
        alert('✅ Produto removido')
        fetchProdutos()
      } else {
        alert('❌ ' + data.error)
      }
    } catch (error) {
      alert('❌ Erro')
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
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Presentes</h1>
            <p className="text-gray-600 dark:text-gray-400">Gerencie sua lista de presentes</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Adicionar Presente
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<Package className="w-6 h-6 text-blue-500" />} 
          value={stats.total} 
          label="Total de Presentes" 
        />
        <StatCard 
          icon={<Eye className="w-6 h-6 text-green-500" />} 
          value={stats.ativos} 
          label="Ativos" 
        />
        <StatCard 
          icon={<ShoppingCart className="w-6 h-6 text-purple-500" />} 
          value={stats.vendidos} 
          label="Vendidos" 
        />
        <StatCard 
          icon={<DollarSign className="w-6 h-6 text-orange-500" />} 
          value={`R$ ${stats.totalArrecadado.toFixed(2)}`} 
          label="Arrecadado" 
        />
      </div>

      {/* Lista de Produtos */}
      {produtos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map((produto) => (
            <motion.div
              key={produto.id}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border overflow-hidden"
            >
              {produto.imagem ? (
                <img 
                  src={produto.imagem} 
                  alt={produto.nome}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{produto.nome}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    produto.ativo 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {produto.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                {produto.descricao && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {produto.descricao}
                  </p>
                )}

                {produto.categoria && (
                  <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded text-xs mb-3">
                    {produto.categoria}
                  </span>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      R$ {Number(produto.preco).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">{produto.vendidos}</span> / {produto.quantidade} vendidos
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedProduto(produto)
                      setShowEditModal(true)
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(produto.id)}
                    className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Modals */}
      {showAddModal && (
        <AddModal 
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchProdutos()
            setShowAddModal(false)
          }}
        />
      )}

      {showEditModal && selectedProduto && (
        <EditModal 
          produto={selectedProduto}
          onClose={() => {
            setShowEditModal(false)
            setSelectedProduto(null)
          }}
          onSuccess={() => {
            fetchProdutos()
            setShowEditModal(false)
            setSelectedProduto(null)
          }}
        />
      )}
    </div>
  )
}

function StatCard({ icon, value, label }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border">
      {icon}
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center">
      <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Nenhum presente cadastrado</h3>
      <p className="text-gray-600 dark:text-gray-400">Adicione seu primeiro presente para os convidados</p>
    </div>
  )
}

function AddModal({ onClose, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ 
    nome: '', 
    descricao: '', 
    imagem: '', 
    preco: '', 
    quantidade: 1, 
    categoria: '' 
  })

  const [gerandoDescricao, setGerandoDescricao] = useState(false)

  const gerarDescricaoIA = async () => {
    if (!form.nome) {
      alert('Digite o nome do presente primeiro')
      return
    }

    setGerandoDescricao(true)
    try {
      // Aqui você integraria com a IA (DeepSeek/OpenAI)
      // Por enquanto, simulação
      await new Promise(resolve => setTimeout(resolve, 2000))
      const descricao = `${form.nome} é um presente especial e único, perfeito para celebrar momentos inesquecíveis. Com qualidade superior e design elegante, este item será uma lembrança duradoura do seu evento especial.`
      setForm({ ...form, descricao })
      alert('✅ Descrição gerada pela IA!')
    } catch (error) {
      alert('❌ Erro ao gerar descrição')
    } finally {
      setGerandoDescricao(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('❌ Imagem muito grande! Máximo 5MB')
      return
    }

    // Criar FormData para upload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'produtos')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (data.success) {
        setForm({ ...form, imagem: data.url }) // Salva apenas a URL
      } else {
        alert('❌ Erro ao fazer upload da imagem')
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('❌ Erro ao fazer upload')
    }
  }

  const formatCurrency = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    // Converte para centavos
    const cents = Number(numbers) / 100
    // Formata como moeda
    return cents.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value)
    setForm({ ...form, preco: formatted })
  }

  const submit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    
    // Converter preço formatado para número
    const precoNumero = Number(form.preco.replace(/\./g, '').replace(',', '.'))
    
    const res = await fetch('/api/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, preco: precoNumero })
    })
    const data = await res.json()
    setLoading(false)
    if (data.success) { alert('✅ Produto adicionado'); onSuccess(); } else alert('❌ ' + data.error)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Adicionar Presente</h2>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <input 
            required 
            placeholder="Nome do presente *" 
            value={form.nome} 
            onChange={e => setForm({...form, nome: e.target.value})} 
            className="w-full px-4 py-2 border rounded-lg" 
          />
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium">Descrição</label>
              <button
                type="button"
                onClick={gerarDescricaoIA}
                disabled={gerandoDescricao}
                className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {gerandoDescricao ? 'Gerando...' : 'Gerar com IA'}
              </button>
            </div>
            <textarea 
              placeholder="Descrição do presente" 
              value={form.descricao} 
              onChange={e => setForm({...form, descricao: e.target.value})} 
              rows={3} 
              className="w-full px-4 py-2 border rounded-lg" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Imagem do Presente</label>
            <div className="border-2 border-dashed rounded-lg p-4">
              {form.imagem ? (
                <div className="relative">
                  <img src={form.imagem} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-2" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, imagem: '' })}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2 py-8">
                  <Package className="w-12 h-12 text-gray-400" />
                  <span className="text-sm text-gray-600">Clique para fazer upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Preço *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
              <input 
                required 
                placeholder="0,00" 
                value={form.preco} 
                onChange={handlePrecoChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg" 
              />
            </div>
          </div>
          
          <input 
            type="number" 
            required 
            min="1" 
            placeholder="Quantidade disponível *" 
            value={form.quantidade} 
            onChange={e => setForm({...form, quantidade: +e.target.value})} 
            className="w-full px-4 py-2 border rounded-lg" 
          />
          
          <input 
            placeholder="Categoria (ex: Eletrodomésticos)" 
            value={form.categoria} 
            onChange={e => setForm({...form, categoria: e.target.value})} 
            className="w-full px-4 py-2 border rounded-lg" 
          />

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg">{loading ? 'Salvando...' : 'Adicionar'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function EditModal({ produto, onClose, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: produto.nome,
    descricao: produto.descricao || '',
    imagem: produto.imagem || '',
    preco: Number(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    quantidade: produto.quantidade,
    categoria: produto.categoria || '',
    ativo: produto.ativo
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('❌ Imagem muito grande! Máximo 5MB')
      return
    }

    // Criar FormData para upload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'produtos')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (data.success) {
        setForm({ ...form, imagem: data.url }) // Salva apenas a URL
      } else {
        alert('❌ Erro ao fazer upload da imagem')
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('❌ Erro ao fazer upload')
    }
  }

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    const cents = Number(numbers) / 100
    return cents.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value)
    setForm({ ...form, preco: formatted })
  }

  const submit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    
    const precoNumero = Number(form.preco.replace(/\./g, '').replace(',', '.'))
    
    const res = await fetch(`/api/produtos/${produto.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, preco: precoNumero })
    })
    const data = await res.json()
    setLoading(false)
    if (data.success) { alert('✅ Atualizado'); onSuccess(); } else alert('❌ ' + data.error)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Editar Presente</h2>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <input 
            required 
            placeholder="Nome do presente" 
            value={form.nome} 
            onChange={e => setForm({...form, nome: e.target.value})} 
            className="w-full px-4 py-2 border rounded-lg" 
          />
          
          <textarea 
            placeholder="Descrição" 
            value={form.descricao} 
            onChange={e => setForm({...form, descricao: e.target.value})} 
            rows={3} 
            className="w-full px-4 py-2 border rounded-lg" 
          />

          <div>
            <label className="block text-sm font-medium mb-2">Imagem do Presente</label>
            <div className="border-2 border-dashed rounded-lg p-4">
              {form.imagem ? (
                <div className="relative">
                  <img src={form.imagem} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-2" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, imagem: '' })}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2 py-8">
                  <Package className="w-12 h-12 text-gray-400" />
                  <span className="text-sm text-gray-600">Clique para fazer upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Preço *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
              <input 
                required 
                placeholder="0,00" 
                value={form.preco} 
                onChange={handlePrecoChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg" 
              />
            </div>
          </div>
          
          <input 
            type="number" 
            required 
            min="1" 
            placeholder="Quantidade disponível"
            value={form.quantidade} 
            onChange={e => setForm({...form, quantidade: +e.target.value})} 
            className="w-full px-4 py-2 border rounded-lg" 
          />
          
          <input 
            placeholder="Categoria" 
            value={form.categoria} 
            onChange={e => setForm({...form, categoria: e.target.value})} 
            className="w-full px-4 py-2 border rounded-lg" 
          />
          
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.ativo} onChange={e => setForm({...form, ativo: e.target.checked})} />
            <span className="text-sm font-medium">Produto ativo</span>
          </label>
          
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg">{loading ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
