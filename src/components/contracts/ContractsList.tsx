'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ContractCard } from './ContractCard'
import { ContractsTable } from './ContractsTable'
import { EmptyState } from './EmptyState'
import { getAuthToken } from '@/lib/auth-token'

interface ContractsListProps {
  filters: any
  searchTerm: string
  viewMode: 'grid' | 'table'
  onContractSelect: (contract: any) => void
  onSignatureRequest: (contract: any) => void
  onEdit?: (contract: any) => void
  onDelete?: (contractId: string) => void
}

const mockContracts = [
  {
    id: '1',
    title: 'Contrato de Desenvolvimento Web',
    description: 'Desenvolvimento de plataforma e-commerce completa',
    client: {
      id: 'c1',
      name: 'TechCorp Soluções',
      email: 'contrato@techcorp.com',
      document: '12.345.678/0001-90',
      avatar: null
    },
    agent: {
      id: 'a1',
      name: 'João Silva',
      avatar: null
    },
    value: 45000,
    status: 'pending_signature',
    signatureProvider: 'docusign',
    signatureUrl: 'https://docusign.com/contract/123456',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    signedAt: null,
    expiresAt: '2024-02-15T23:59:59Z',
    terms: {
      duration: '6 meses',
      paymentTerms: '50% entrada, 50% na entrega',
      deliveryDate: '2024-07-15'
    },
    attachments: [
      { name: 'Especificações Técnicas.pdf', size: '2.4 MB', type: 'pdf' },
      { name: 'Wireframes.zip', size: '15.8 MB', type: 'zip' }
    ],
    signatures: [
      {
        party: 'client',
        name: 'Maria Santos - TechCorp',
        email: 'maria@techcorp.com',
        status: 'pending',
        signedAt: null
      },
      {
        party: 'company',
        name: 'João Silva - VivaOSim',
        email: 'joao@vivaosim.com',
        status: 'signed',
        signedAt: '2024-01-20T14:30:00Z'
      }
    ],
    tags: ['Desenvolvimento', 'E-commerce', 'Urgente']
  },
  {
    id: '2',
    title: 'Prestação de Serviços de Marketing',
    description: 'Campanha digital completa para lançamento de produto',
    client: {
      id: 'c2',
      name: 'Inovação Brasil LTDA',
      email: 'juridico@inovacaobrasil.com',
      document: '98.765.432/0001-10',
      avatar: null
    },
    agent: {
      id: 'a2',
      name: 'Maria Santos',
      avatar: null
    },
    value: 25000,
    status: 'signed',
    signatureProvider: 'clicksign',
    signatureUrl: 'https://clicksign.com/contract/789012',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:00:00Z',
    signedAt: '2024-01-18T16:00:00Z',
    expiresAt: '2024-06-10T23:59:59Z',
    terms: {
      duration: '3 meses',
      paymentTerms: 'Pagamento mensal',
      deliveryDate: '2024-04-10'
    },
    attachments: [
      { name: 'Briefing de Marketing.pdf', size: '1.2 MB', type: 'pdf' },
      { name: 'Cronograma.xlsx', size: '0.8 MB', type: 'excel' }
    ],
    signatures: [
      {
        party: 'client',
        name: 'Carlos Mendes - Inovação Brasil',
        email: 'carlos@inovacaobrasil.com',
        status: 'signed',
        signedAt: '2024-01-18T10:30:00Z'
      },
      {
        party: 'company',
        name: 'Maria Santos - VivaOSim',
        email: 'maria@vivaosim.com',
        status: 'signed',
        signedAt: '2024-01-18T16:00:00Z'
      }
    ],
    tags: ['Marketing', 'Digital', 'Concluído']
  },
  {
    id: '3',
    title: 'Contrato de Consultoria em TI',
    description: 'Consultoria para migração de sistemas legados',
    client: {
      id: 'c3',
      name: 'Industrias Reunidas S.A.',
      email: 'ti@industriasreunidas.com',
      document: '11.222.333/0001-44',
      avatar: null
    },
    agent: {
      id: 'a3',
      name: 'Pedro Costa',
      avatar: null
    },
    value: 75000,
    status: 'draft',
    signatureProvider: 'internal',
    signatureUrl: null,
    createdAt: '2024-01-22T11:00:00Z',
    updatedAt: '2024-01-24T09:15:00Z',
    signedAt: null,
    expiresAt: '2024-03-22T23:59:59Z',
    terms: {
      duration: '12 meses',
      paymentTerms: 'Faturamento mensal',
      deliveryDate: '2025-01-22'
    },
    attachments: [
      { name: 'Análise Atual.pdf', size: '5.2 MB', type: 'pdf' },
      { name: 'Proposta Técnica.docx', size: '3.1 MB', type: 'word' }
    ],
    signatures: [
      {
        party: 'client',
        name: 'Ana Paula - Industrias Reunidas',
        email: 'ana@industriasreunidas.com',
        status: 'pending',
        signedAt: null
      },
      {
        party: 'company',
        name: 'Pedro Costa - VivaOSim',
        email: 'pedro@vivaosim.com',
        status: 'pending',
        signedAt: null
      }
    ],
    tags: ['Consultoria', 'TI', 'Longo Prazo']
  },
  {
    id: '4',
    title: 'Licença de Software',
    description: 'Licenciamento de plataforma de gestão customizada',
    client: {
      id: 'c4',
      name: 'StartupTech Inc.',
      email: 'legal@startuptech.com',
      document: '55.666.777/0001-88',
      avatar: null
    },
    agent: {
      id: 'a4',
      name: 'Ana Lima',
      avatar: null
    },
    value: 18000,
    status: 'rejected',
    signatureProvider: 'docusign',
    signatureUrl: 'https://docusign.com/contract/345678',
    createdAt: '2024-01-08T14:00:00Z',
    updatedAt: '2024-01-25T11:30:00Z',
    signedAt: null,
    expiresAt: '2024-02-08T23:59:59Z',
    terms: {
      duration: '24 meses',
      paymentTerms: 'Anual antecipado',
      deliveryDate: '2024-02-01'
    },
    attachments: [
      { name: 'Termos de Licença.pdf', size: '0.9 MB', type: 'pdf' }
    ],
    signatures: [
      {
        party: 'client',
        name: 'Roberto Silva - StartupTech',
        email: 'roberto@startuptech.com',
        status: 'rejected',
        signedAt: null,
        rejectedAt: '2024-01-25T11:30:00Z',
        rejectionReason: 'Necessária revisão de cláusulas de SLA'
      },
      {
        party: 'company',
        name: 'Ana Lima - VivaOSim',
        email: 'ana@vivaosim.com',
        status: 'signed',
        signedAt: '2024-01-15T09:00:00Z'
      }
    ],
    tags: ['Licença', 'Software', 'Rejeitado']
  },
  {
    id: '5',
    title: 'Manutenção de Sistemas',
    description: 'Contrato de manutenção e suporte técnico anual',
    client: {
      id: 'c5',
      name: 'Comercial Santos LTDA',
      email: 'suporte@comercialsantos.com',
      document: '33.444.555/0001-22',
      avatar: null
    },
    agent: {
      id: 'a1',
      name: 'João Silva',
      avatar: null
    },
    value: 36000,
    status: 'expired',
    signatureProvider: 'physical',
    signatureUrl: null,
    createdAt: '2023-12-15T10:00:00Z',
    updatedAt: '2024-01-10T16:00:00Z',
    signedAt: null,
    expiresAt: '2024-01-15T23:59:59Z',
    terms: {
      duration: '12 meses',
      paymentTerms: 'Trimestral',
      deliveryDate: 'Contínuo'
    },
    attachments: [
      { name: 'SLA Detalhado.pdf', size: '1.8 MB', type: 'pdf' },
      { name: 'Escopo de Manutenção.pdf', size: '2.2 MB', type: 'pdf' }
    ],
    signatures: [
      {
        party: 'client',
        name: 'Fernanda Costa - Comercial Santos',
        email: 'fernanda@comercialsantos.com',
        status: 'pending',
        signedAt: null
      },
      {
        party: 'company',
        name: 'João Silva - VivaOSim',
        email: 'joao@vivaosim.com',
        status: 'pending',
        signedAt: null
      }
    ],
    tags: ['Manutenção', 'Suporte', 'Expirado']
  }
]

export const ContractsList: React.FC<ContractsListProps> = ({
  filters,
  searchTerm,
  viewMode,
  onContractSelect,
  onSignatureRequest,
  onEdit,
  onDelete
}) => {
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const handleDelete = async (contractId: string) => {
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch(`/api/contracts?id=${contractId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setContracts(prev => prev.filter(c => c.id !== contractId))
        onDelete?.(contractId)
      }
    } catch (error) {
      console.error('Erro ao excluir contrato:', error)
    }
  }

  // Buscar contratos da API
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true)
        const token = getAuthToken()
        
        if (!token) {
          console.error('Token não encontrado')
          setContracts([])
          return
        }

        const params = new URLSearchParams()
        if (filters.status && filters.status !== 'all') params.append('status', filters.status)

        const response = await fetch(`/api/contracts?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          const transformedContracts = data.contracts.map((contract: any) => ({
            id: contract.id,
            title: contract.title,
            description: contract.description,
            client: contract.contact || { id: '', name: 'Sem cliente', email: '' },
            agent: contract.createdBy || { id: '', name: 'Não atribuído' },
            value: parseFloat(contract.amount),
            status: contract.status,
            signatureProvider: 'docusign',
            signatureUrl: null,
            createdAt: contract.createdAt,
            updatedAt: contract.updatedAt,
            signedAt: contract.signedAt,
            expiresAt: contract.endDate,
            terms: {
              duration: contract.startDate && contract.endDate ? 'Período definido' : 'Não definido',
              paymentTerms: 'A combinar',
              deliveryDate: contract.endDate
            },
            attachments: [],
            signatures: [],
            tags: []
          }))
          setContracts(transformedContracts)
        } else {
          console.error('Erro ao buscar contratos')
          setContracts([])
        }
      } catch (error) {
        console.error('Erro ao buscar contratos:', error)
        setContracts([])
      } finally {
        setLoading(false)
      }
    }

    fetchContracts()
  }, [filters.status])

  // Filtros locais
  const filteredContracts = contracts.filter((contract) => {
    // Filtro por status
    if (filters.status !== 'all' && contract.status !== filters.status) {
      return false
    }

    // Filtro por agente  
    if (filters.agent !== 'all' && contract.agent.id !== filters.agent) {
      return false
    }

    // Filtro por provedor de assinatura
    if (filters.signatureProvider !== 'all' && contract.signatureProvider !== filters.signatureProvider) {
      return false
    }

    // Filtro por cliente (busca no nome)
    if (filters.client && !contract.client.name.toLowerCase().includes(filters.client.toLowerCase())) {
      return false
    }

    // Filtro por valor mínimo
    if (filters.minValue && contract.value < parseFloat(filters.minValue)) {
      return false
    }

    // Filtro por valor máximo
    if (filters.maxValue && contract.value > parseFloat(filters.maxValue)) {
      return false
    }

    // Busca geral
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesTitle = contract.title.toLowerCase().includes(searchLower)
      const matchesClient = contract.client.name.toLowerCase().includes(searchLower)
      const matchesDescription = contract.description.toLowerCase().includes(searchLower)
      
      if (!matchesTitle && !matchesClient && !matchesDescription) {
        return false
      }
    }

    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (filteredContracts.length === 0) {
    return <EmptyState filters={filters} searchTerm={searchTerm} />
  }

  return (
    <div>
      {/* Contador de resultados */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredContracts.length} contrato{filteredContracts.length !== 1 ? 's' : ''} encontrado{filteredContracts.length !== 1 ? 's' : ''}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Ordenar por:</span>
          <select className="bg-transparent border-none text-orange-600 font-medium focus:ring-0">
            <option value="recent">Mais recentes</option>
            <option value="value-desc">Maior valor</option>
            <option value="value-asc">Menor valor</option>
            <option value="client">Cliente A-Z</option>
            <option value="status">Status</option>
            <option value="expires">Vencimento</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredContracts.map((contract, index) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                index={index}
                onClick={() => onContractSelect(contract)}
                onSignatureRequest={() => onSignatureRequest(contract)}
                onEdit={() => onEdit(contract)}
                onDelete={async () => {
                  try {
                    const response = await fetch(`/api/contracts/${contract.id}`, {
                      method: 'DELETE'
                    })
                    const data = await response.json()
                    if (data.success) {
                      alert('✅ Contrato excluído com sucesso!')
                      onDelete()
                    } else {
                      alert('❌ ' + data.error)
                    }
                  } catch (error) {
                    alert('❌ Erro ao excluir contrato')
                  }
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <ContractsTable
          contracts={filteredContracts}
          onContractSelect={onContractSelect}
          onSignatureRequest={onSignatureRequest}
        />
      )}
    </div>
  )
}
