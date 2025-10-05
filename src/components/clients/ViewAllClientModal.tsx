'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  X, Globe, Users, FileText, Calendar, MessageSquare, 
  DollarSign, Tag, UserCheck, Gift, CreditCard, Package, Receipt
} from 'lucide-react'

interface ViewAllClientModalProps {
  clientId: string
  clientName: string
  onClose: () => void
}

export function ViewAllClientModal({ clientId, clientName, onClose }: ViewAllClientModalProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      const response = await fetch(`/api/contacts/${clientId}/full`)
      const result = await response.json()
      if (result.success) {
        setData(result.contact)
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-center">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Todos os Dados - {clientName}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Site do Cliente */}
          <Section
            icon={<Globe className="w-5 h-5 text-blue-600" />}
            title="Site do Evento"
            count={data?.clientSite ? 1 : 0}
          >
            {data?.clientSite ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <InfoItem label="Nome do Evento" value={data.clientSite.nomeEvento} />
                  <InfoItem label="Subdomínio" value={data.clientSite.subdominio} />
                  <InfoItem label="Status" value={data.clientSite.status} />
                  <InfoItem label="Visualizações" value={data.clientSite.visualizacoes} />
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nenhum site criado</p>
            )}
          </Section>

          {/* Convidados */}
          <Section
            icon={<Users className="w-5 h-5 text-green-600" />}
            title="Convidados"
            count={data?.clientSite?.convidados?.length || 0}
          >
            {data?.clientSite?.convidados?.length > 0 ? (
              <div className="space-y-2">
                {data.clientSite.convidados.slice(0, 5).map((conv: any) => (
                  <div key={conv.id} className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <span className="font-medium">{conv.nome}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      conv.confirmado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {conv.confirmado ? 'Confirmado' : 'Pendente'}
                    </span>
                  </div>
                ))}
                {data.clientSite.convidados.length > 5 && (
                  <p className="text-sm text-gray-500">+ {data.clientSite.convidados.length - 5} convidados</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nenhum convidado cadastrado</p>
            )}
          </Section>

          {/* Presentes */}
          <Section
            icon={<Gift className="w-5 h-5 text-purple-600" />}
            title="Presentes"
            count={data?.clientSite?.produtos?.length || 0}
          >
            {data?.clientSite?.produtos?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.clientSite.produtos.map((prod: any) => (
                  <div key={prod.id} className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium">{prod.nome}</p>
                      <p className="text-sm text-gray-600">R$ {Number(prod.preco).toFixed(2)}</p>
                    </div>
                    <span className="text-sm text-gray-600">{prod.vendidos}/{prod.quantidade}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nenhum presente cadastrado</p>
            )}
          </Section>

          {/* Recebimentos */}
          <Section
            icon={<CreditCard className="w-5 h-5 text-orange-600" />}
            title="Recebimentos"
            count={data?.clientSite?.recebimentos?.length || 0}
          >
            {data?.clientSite?.recebimentos?.length > 0 ? (
              <div className="space-y-2">
                {data.clientSite.recebimentos.map((rec: any) => (
                  <div key={rec.id} className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium">R$ {Number(rec.valor).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{rec.metodoPagamento}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      rec.status === 'PAGO' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {rec.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nenhum recebimento registrado</p>
            )}
          </Section>

          {/* Despesas e Custos */}
          <Section
            icon={<Receipt className="w-5 h-5 text-yellow-600" />}
            title="Despesas e Custos"
            count={data?.clientSite?.custosDespesas?.length || 0}
          >
            {data?.clientSite?.custosDespesas?.length > 0 ? (
              <div className="space-y-2">
                {data.clientSite.custosDespesas.map((desp: any) => (
                  <div key={desp.id} className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{desp.descricao}</p>
                        <p className="text-xs text-gray-600">{desp.categoria}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-yellow-700">R$ {Number(desp.valor).toFixed(2)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          desp.status === 'PAGO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {desp.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nenhuma despesa registrada</p>
            )}
          </Section>

          {/* Orçamentos */}
          <Section
            icon={<FileText className="w-5 h-5 text-indigo-600" />}
            title="Orçamentos"
            count={data?.orcamentos?.length || 0}
          >
            {data?.orcamentos?.length > 0 ? (
              <div className="space-y-2">
                {data.orcamentos.map((orc: any) => (
                  <div key={orc.id} className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{orc.titulo || 'Orçamento'}</span>
                      <span className="text-sm font-bold">R$ {Number(orc.valor).toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Status: {orc.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nenhum orçamento</p>
            )}
          </Section>

          {/* Agendamentos */}
          <Section
            icon={<Calendar className="w-5 h-5 text-cyan-600" />}
            title="Agendamentos"
            count={data?.agendamentos?.length || 0}
          >
            {data?.agendamentos?.length > 0 ? (
              <div className="space-y-2">
                {data.agendamentos.map((agend: any) => (
                  <div key={agend.id} className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg">
                    <p className="font-medium">{agend.titulo}</p>
                    <p className="text-sm text-gray-600">{new Date(agend.dataHora).toLocaleString('pt-BR')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nenhum agendamento</p>
            )}
          </Section>

          {/* Tickets */}
          <Section
            icon={<MessageSquare className="w-5 h-5 text-red-600" />}
            title="Tickets de Suporte"
            count={data?.tickets?.length || 0}
          >
            {data?.tickets?.length > 0 ? (
              <div className="space-y-2">
                {data.tickets.map((ticket: any) => (
                  <div key={ticket.id} className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{ticket.assunto || 'Ticket'}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        ticket.status === 'RESOLVIDO' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nenhum ticket</p>
            )}
          </Section>

          {/* Contratos */}
          <Section
            icon={<Package className="w-5 h-5 text-teal-600" />}
            title="Contratos"
            count={data?.contracts?.length || 0}
          >
            {data?.contracts?.length > 0 ? (
              <div className="space-y-2">
                {data.contracts.map((contract: any) => (
                  <div key={contract.id} className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{contract.titulo || 'Contrato'}</span>
                      <span className="text-sm font-bold">R$ {Number(contract.valor || 0).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nenhum contrato</p>
            )}
          </Section>

          {/* Tags */}
          <Section
            icon={<Tag className="w-5 h-5 text-pink-600" />}
            title="Tags"
            count={data?.tags?.length || 0}
          >
            {data?.tags?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag: any) => (
                  <span key={tag.id} className="px-3 py-1 bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 rounded-full text-sm">
                    {tag.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nenhuma tag</p>
            )}
          </Section>

          {/* Atendente Responsável */}
          {data?.kanbanColumn && (
            <Section
              icon={<UserCheck className="w-5 h-5 text-gray-600" />}
              title="Atendente Responsável"
              count={1}
            >
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="font-medium">Coluna: {data.kanbanColumn.title}</p>
              </div>
            </Section>
          )}

          {/* WhatsApp Chat */}
          {data?.whatsappChat && (
            <Section
              icon={<MessageSquare className="w-5 h-5 text-green-600" />}
              title="Chat WhatsApp"
              count={data?.messages?.length || 0}
            >
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="font-medium">Chat ID: {data.whatsappChat.chatId}</p>
                <p className="text-sm text-gray-600">{data.messages?.length || 0} mensagens</p>
              </div>
            </Section>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function Section({ icon, title, count, children }: any) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-semibold">{title}</h3>
        </div>
        <span className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
          {count}
        </span>
      </div>
      {children}
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
      <p className="font-medium">{value || '-'}</p>
    </div>
  )
}
