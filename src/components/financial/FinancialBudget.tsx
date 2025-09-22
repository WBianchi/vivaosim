'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, FileText, Building2, Trophy, Clock, CheckCircle, XCircle, AlertTriangle, Plus, Download, Eye, Edit3 } from 'lucide-react'

export const FinancialBudget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'budgets' | 'bids'>('budgets')

  const budgets = [
    {
      id: '1',
      title: 'Orçamento Casamento Premium',
      client: 'Família Oliveira',
      event: 'Casamento 300 convidados',
      value: 85000,
      items: 45,
      status: 'approved',
      validity: '2024-02-28',
      created: '2024-01-15',
      margin: 35,
      details: [
        { category: 'Decoração', value: 18000, margin: 40 },
        { category: 'Buffet', value: 32000, margin: 35 },
        { category: 'Som/Iluminação', value: 12000, margin: 45 },
        { category: 'Fotografia/Vídeo', value: 8000, margin: 50 },
        { category: 'Espaço', value: 15000, margin: 20 }
      ]
    },
    {
      id: '2',
      title: 'Orçamento Formatura 2024',
      client: 'Colégio São José',
      event: 'Formatura Ensino Médio',
      value: 120000,
      items: 62,
      status: 'pending',
      validity: '2024-03-15',
      created: '2024-01-20',
      margin: 28,
      details: [
        { category: 'Local', value: 25000, margin: 20 },
        { category: 'Decoração', value: 22000, margin: 35 },
        { category: 'Buffet', value: 45000, margin: 30 },
        { category: 'Entretenimento', value: 15000, margin: 40 },
        { category: 'Fotografia/Vídeo', value: 13000, margin: 45 }
      ]
    },
    {
      id: '3',
      title: 'Orçamento Debutante',
      client: 'Ana Paula Santos',
      event: '15 Anos - 150 convidados',
      value: 42000,
      items: 38,
      status: 'negotiation',
      validity: '2024-02-20',
      created: '2024-01-18',
      margin: 32,
      details: [
        { category: 'Decoração', value: 12000, margin: 40 },
        { category: 'Buffet', value: 18000, margin: 35 },
        { category: 'DJ/Som', value: 3500, margin: 50 },
        { category: 'Fotografia', value: 4500, margin: 45 },
        { category: 'Vestido/Produção', value: 4000, margin: 10 }
      ]
    }
  ]

  const bids = [
    {
      id: '1',
      title: 'Licitação Prefeitura - Festa Junina',
      entity: 'Prefeitura Municipal',
      type: 'Pregão Eletrônico',
      number: 'PE 023/2024',
      value: 250000,
      deadline: '2024-02-10',
      status: 'preparing',
      requirements: 12,
      competitors: 5,
      winChance: 75,
      documents: [
        { name: 'Certidão Negativa', status: 'ready' },
        { name: 'Balanço Patrimonial', status: 'ready' },
        { name: 'Atestados Técnicos', status: 'pending' },
        { name: 'Proposta Comercial', status: 'preparing' }
      ]
    },
    {
      id: '2',
      title: 'Licitação Estado - Eventos Culturais',
      entity: 'Secretaria de Cultura',
      type: 'Concorrência',
      number: 'CC 008/2024',
      value: 450000,
      deadline: '2024-03-01',
      status: 'submitted',
      requirements: 18,
      competitors: 8,
      winChance: 60,
      documents: [
        { name: 'Certidão Negativa', status: 'ready' },
        { name: 'Balanço Patrimonial', status: 'ready' },
        { name: 'Atestados Técnicos', status: 'ready' },
        { name: 'Proposta Comercial', status: 'ready' }
      ]
    },
    {
      id: '3',
      title: 'Licitação SESC - Eventos 2024',
      entity: 'SESC Regional',
      type: 'Tomada de Preços',
      number: 'TP 015/2024',
      value: 180000,
      deadline: '2024-02-25',
      status: 'won',
      requirements: 10,
      competitors: 3,
      winChance: 100,
      documents: [
        { name: 'Certidão Negativa', status: 'ready' },
        { name: 'Balanço Patrimonial', status: 'ready' },
        { name: 'Atestados Técnicos', status: 'ready' },
        { name: 'Proposta Comercial', status: 'ready' }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'won':
      case 'ready':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'pending':
      case 'preparing':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'negotiation':
      case 'submitted':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'rejected':
      case 'lost':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado'
      case 'pending': return 'Pendente'
      case 'negotiation': return 'Em Negociação'
      case 'rejected': return 'Rejeitado'
      case 'preparing': return 'Preparando'
      case 'submitted': return 'Enviado'
      case 'won': return 'Ganho'
      case 'lost': return 'Perdido'
      case 'ready': return 'Pronto'
      default: return status
    }
  }

  const getDocumentIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />
      case 'preparing': return <AlertTriangle className="w-4 h-4 text-blue-600" />
      default: return <XCircle className="w-4 h-4 text-red-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-1 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button
            onClick={() => setActiveTab('budgets')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'budgets'
                ? 'bg-green-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Calculator className="w-5 h-5" />
            Orçamentos
          </button>
          <button
            onClick={() => setActiveTab('bids')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'bids'
                ? 'bg-green-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-5 h-5" />
            Licitações
          </button>
        </div>
      </div>

      {/* Conteúdo dos Orçamentos */}
      {activeTab === 'budgets' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Orçamentos de Eventos
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium"
            >
              <Plus className="w-4 h-4" />
              Novo Orçamento
            </motion.button>
          </div>

          {/* Lista de Orçamentos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {budgets.map((budget, index) => (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">{budget.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{budget.client}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(budget.status)}`}>
                      {getStatusLabel(budget.status)}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Valor Total</span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        R$ {budget.value.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Margem de Lucro</span>
                      <span className="text-lg font-semibold text-green-600">{budget.margin}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Validade</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {new Date(budget.validity).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Breakdown por categoria */}
                  <div className="space-y-2 mb-4">
                    {budget.details.slice(0, 3).map((detail) => (
                      <div key={detail.category} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{detail.category}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            R$ {detail.value.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">({detail.margin}%)</span>
                        </div>
                      </div>
                    ))}
                    {budget.details.length > 3 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{budget.details.length - 3} categorias
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Visualizar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Editar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Conteúdo das Licitações */}
      {activeTab === 'bids' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Licitações e Concorrências
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium"
            >
              <Plus className="w-4 h-4" />
              Nova Licitação
            </motion.button>
          </div>

          {/* Lista de Licitações */}
          <div className="space-y-6">
            {bids.map((bid, index) => (
              <motion.div
                key={bid.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Building2 className="w-5 h-5 text-gray-600" />
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{bid.title}</h4>
                        {bid.status === 'won' && <Trophy className="w-5 h-5 text-yellow-500" />}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{bid.entity}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{bid.type}</span>
                        <span>•</span>
                        <span>{bid.number}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}>
                      {getStatusLabel(bid.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Valor Estimado</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        R$ {(bid.value / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Prazo</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(bid.deadline).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Concorrentes</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {bid.competitors} empresas
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Chance de Vitória</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${bid.winChance >= 70 ? 'bg-green-500' : bid.winChance >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${bid.winChance}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{bid.winChance}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Documentos */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Documentação</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {bid.documents.map((doc) => (
                        <div key={doc.name} className="flex items-center gap-2">
                          {getDocumentIcon(doc.status)}
                          <span className="text-xs text-gray-600 dark:text-gray-400">{doc.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Ver Edital
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Preparar Proposta
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
