'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ContractsHeader } from '@/components/contracts/ContractsHeader'
import { ContractsStats } from '@/components/contracts/ContractsStats'
import { ContractsFilters } from '@/components/contracts/ContractsFilters'
import { ContractsList } from '@/components/contracts/ContractsList'
import { ContractDetailsModal } from '@/components/contracts/ContractDetailsModal'
import { CreateContractModal } from '@/components/contracts/CreateContractModal'
import { SignatureModal } from '@/components/contracts/SignatureModal'
import EditContractModal from '@/components/contracts/EditContractModal'

export default function ContratosPage() {
  const [selectedContract, setSelectedContract] = useState<any>(null)
  const [editingContract, setEditingContract] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [signatureContract, setSignatureContract] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)
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

  const handleEdit = (contract: any) => {
    setEditingContract(contract)
  }

  const handleDelete = () => {
    setRefreshKey(prev => prev + 1)
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

        {/* Estatísticas */}
        <ContractsStats refreshTrigger={refreshKey} />

        {/* Filtros */}
        <ContractsFilters 
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Lista de Contratos */}
        <ContractsList 
          key={refreshKey}
          filters={filters}
          searchTerm={searchTerm}
          viewMode={viewMode}
          onContractSelect={setSelectedContract}
          onSignatureRequest={handleSignature}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Modal de Detalhes */}
        {selectedContract && (
          <ContractDetailsModal
            contract={selectedContract}
            onClose={() => setSelectedContract(null)}
            onEdit={() => {
              handleEdit(selectedContract)
              setSelectedContract(null)
            }}
            onSignatureRequest={() => handleSignature(selectedContract)}
          />
        )}

        {/* Modal de Edição */}
        {editingContract && (
          <EditContractModal
            contract={editingContract}
            onClose={() => setEditingContract(null)}
            onSave={() => {
              setEditingContract(null)
              setRefreshKey(prev => prev + 1)
            }}
          />
        )}

        {/* Modal de Criação */}
        {showCreateModal && (
          <CreateContractModal
            onClose={() => setShowCreateModal(false)}
            onSave={() => {
              setShowCreateModal(false)
              setRefreshKey(prev => prev + 1)
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
            onSave={() => {
              setShowSignatureModal(false)
              setSignatureContract(null)
              setRefreshKey(prev => prev + 1)
            }}
          />
        )}
      </div>
    </div>
  )
}
