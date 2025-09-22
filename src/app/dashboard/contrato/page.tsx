'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, Calendar, DollarSign, MessageCircle, 
  CheckCircle, Clock, AlertTriangle, Download,
  Eye, Edit3, Send, Phone, Mail, MapPin
} from 'lucide-react'

export default function ContratoClientePage() {
  const [activeTab, setActiveTab] = useState<'contrato' | 'conversas' | 'orcamento' | 'agendamento'>('contrato')

  const contractInfo = {
    numero: 'CTR-2024-0156',
    status: 'active',
    cliente: 'João Silva',
    evento: 'Casamento Silva & Costa',
    data: '2024-06-15',
    local: 'Espaço Celebration',
    convidados: 150,
    valor: 45000,
    entrada: 15000,
    parcelas: 6,
    valorParcela: 5000
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Baixar PDF
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
          <button
            onClick={() => setActiveTab('contrato')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'contrato'
                ? 'bg-white dark:bg-gray-600 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Contrato
          </button>
          <button
            onClick={() => setActiveTab('conversas')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'conversas'
                ? 'bg-white dark:bg-gray-600 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Conversas
          </button>
          <button
            onClick={() => setActiveTab('orcamento')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'orcamento'
                ? 'bg-white dark:bg-gray-600 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Orçamento
          </button>
          <button
            onClick={() => setActiveTab('agendamento')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'agendamento'
                ? 'bg-white dark:bg-gray-600 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Agendamento
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'contrato' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Principais */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Informações do Contrato</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Número do Contrato</span>
                <span className="font-semibold text-gray-900 dark:text-white">{contractInfo.numero}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Evento</span>
                <span className="font-semibold text-gray-900 dark:text-white">{contractInfo.evento}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Data do Evento</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {new Date(contractInfo.data).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Local</span>
                <span className="font-semibold text-gray-900 dark:text-white">{contractInfo.local}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Número de Convidados</span>
                <span className="font-semibold text-gray-900 dark:text-white">{contractInfo.convidados}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                  Ativo
                </span>
              </div>
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Resumo Financeiro</h3>
            
            <div className="space-y-4">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  R$ {contractInfo.valor.toLocaleString('pt-BR')}
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Entrada</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    R$ {contractInfo.entrada.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Parcelas</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {contractInfo.parcelas}x de R$ {contractInfo.valorParcela.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Próximo Vencimento</span>
                  <span className="font-medium text-orange-600">15/02/2024</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium"
              >
                Ver Detalhes Financeiros
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'conversas' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Histórico de Conversas</h3>
          <div className="space-y-4">
            {/* Lista de conversas */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Atendente Maria</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Olá! Confirmamos a reserva do espaço para 15/06</p>
                  <p className="text-xs text-gray-500 mt-1">Há 2 dias</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orcamento' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Detalhamento do Orçamento</h3>
            
            <div className="space-y-4">
              {[
                { categoria: 'Decoração', fornecedor: 'Decor Plus', valor: 8000, status: 'approved', pago: 6500 },
                { categoria: 'Buffet', fornecedor: 'Sabor & Arte', valor: 15000, status: 'approved', pago: 7500 },
                { categoria: 'Som/Iluminação', fornecedor: 'Pro Audio', valor: 5000, status: 'approved', pago: 5000 },
                { categoria: 'Fotografia', fornecedor: 'Studio Memories', valor: 3500, status: 'pending', pago: 1000 },
                { categoria: 'Flores', fornecedor: 'Floricultura Primavera', valor: 4000, status: 'pending', pago: 0 },
                { categoria: 'Convites', fornecedor: 'Papelaria Fina', valor: 1500, status: 'approved', pago: 1500 },
                { categoria: 'Doces', fornecedor: 'Doce Momento', valor: 3000, status: 'approved', pago: 0 },
                { categoria: 'Bebidas', fornecedor: 'Adega Premium', valor: 5000, status: 'pending', pago: 0 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-medium text-gray-900 dark:text-white">{item.categoria}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'approved' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {item.status === 'approved' ? 'Aprovado' : 'Pendente'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.fornecedor}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      R$ {item.valor.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-xs text-gray-500">
                      Pago: R$ {item.pago.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span className="text-gray-900 dark:text-white">Total do Orçamento</span>
                <span className="text-gray-900 dark:text-white">R$ 45.000,00</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Resumo</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Aprovado</p>
                <p className="text-2xl font-bold text-blue-600">R$ 32.500</p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pendente Aprovação</p>
                <p className="text-2xl font-bold text-yellow-600">R$ 12.500</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Pago</p>
                <p className="text-2xl font-bold text-green-600">R$ 21.500</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'agendamento' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Agenda de Reuniões e Compromissos</h3>
          
          <div className="space-y-4">
            {[
              { 
                data: '2024-02-10', 
                hora: '14:00', 
                tipo: 'Degustação', 
                local: 'Sabor & Arte Buffet',
                status: 'confirmed',
                descricao: 'Degustação do cardápio do casamento'
              },
              { 
                data: '2024-02-15', 
                hora: '10:00', 
                tipo: 'Reunião Decoração', 
                local: 'Escritório Decor Plus',
                status: 'confirmed',
                descricao: 'Definir detalhes da decoração da festa'
              },
              { 
                data: '2024-03-01', 
                hora: '16:00', 
                tipo: 'Prova do Vestido', 
                local: 'Atelier Noivas',
                status: 'pending',
                descricao: 'Segunda prova do vestido de noiva'
              },
              { 
                data: '2024-03-10', 
                hora: '19:00', 
                tipo: 'Reunião com DJ', 
                local: 'Online',
                status: 'confirmed',
                descricao: 'Definir playlist e cronograma musical'
              },
              { 
                data: '2024-04-20', 
                hora: '15:00', 
                tipo: 'Visita ao Local', 
                local: 'Espaço Celebration',
                status: 'pending',
                descricao: 'Visita técnica com fornecedores'
              },
              { 
                data: '2024-06-10', 
                hora: '18:00', 
                tipo: 'Ensaio Geral', 
                local: 'Espaço Celebration',
                status: 'pending',
                descricao: 'Ensaio da cerimônia com padrinhos'
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{item.tipo}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.descricao}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.data).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.hora}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item.local}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'confirmed'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {item.status === 'confirmed' ? 'Confirmado' : 'A Confirmar'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
