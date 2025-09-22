'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ContractsHeader } from '@/components/contracts/ContractsHeader'
import { ContractsFilters } from '@/components/contracts/ContractsFilters'
import { ContractsList } from '@/components/contracts/ContractsList'
import { ContractDetailsModal } from '@/components/contracts/ContractDetailsModal'
import { CreateContractModal } from '@/components/contracts/CreateContractModal'
import { SignatureModal } from '@/components/contracts/SignatureModal'

export default function ContratosPage() {
  const [selectedContract, setSelectedContract] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [signatureContract, setSignatureContract] = useState<any>(null)
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    client: '',
    agent: 'all',
    signatureProvider: 'all',
    minValue: '',
    maxValue: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const handleSignature = (contract: any) => {
    setSignatureContract(contract)
    setShowSignatureModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full p-8">
        {/* Header */}
        <ContractsHeader 
          onCreateContract={() => setShowCreateModal(true)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Filtros */}
        <ContractsFilters 
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Lista de Contratos */}
        <ContractsList 
          filters={filters}
          searchTerm={searchTerm}
          viewMode={viewMode}
          onContractSelect={setSelectedContract}
          onSignatureRequest={handleSignature}
        />

        {/* Modal de Detalhes */}
        {selectedContract && (
          <ContractDetailsModal
            contract={selectedContract}
            onClose={() => setSelectedContract(null)}
            onEdit={() => {
              console.log('🔄 Editar contrato:', selectedContract.id)
              setSelectedContract(null)
            }}
            onSignature={() => handleSignature(selectedContract)}
          />
        )}

        {/* Modal de Criação */}
        {showCreateModal && (
          <CreateContractModal
            onClose={() => setShowCreateModal(false)}
            onSave={(contractData) => {
              console.log('💾 Salvando contrato:', contractData)
              setShowCreateModal(false)
            }}
          />
        )}

        {/* Modal de Assinatura */}
        {showSignatureModal && signatureContract && (
          <SignatureModal
            contract={signatureContract}
            onClose={() => {
              setShowSignatureModal(false)
              setSignatureContract(null)
            }}
            onSign={(signatureData) => {
              console.log('✍️ Assinando contrato:', signatureData)
              setShowSignatureModal(false)
              setSignatureContract(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
