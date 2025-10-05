'use client'

import { useState } from 'react'
import { SalesHeader } from '@/components/sales/SalesHeader'
import { SalesFilters } from '@/components/sales/SalesFilters'
import { SalesList } from '@/components/sales/SalesList'
import { SaleDetailsModal } from '@/components/sales/SaleDetailsModal'
import { CreateSaleModal } from '@/components/sales/CreateSaleModal'

export default function SalesPage() {
  const [selectedSale, setSelectedSale] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    plan: 'all',
    paymentMethod: 'all',
    paymentStatus: 'all',
    dateRange: 'all',
    priceRange: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')

  const handleSaleSelect = (sale: any) => {
    setSelectedSale(sale)
    setShowDetailsModal(true)
  }

  const handleCreateSale = () => {
    setShowCreateModal(true)
  }

  const handleSaveSale = (saleData: any) => {
    console.log('💾 Salvando venda:', saleData)
    // Aqui você faria a chamada para a API
  }

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  const handlePauseSale = async (sale: any) => {
    try {
      const response = await fetch(`/api/subscriptions/${sale.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paused' })
      })

      const data = await response.json()

      if (data.success) {
        console.log('✅ Assinatura pausada!')
        setTimeout(() => window.location.reload(), 1000)
      } else {
        alert('❌ Erro: ' + data.error)
      }
    } catch (error) {
      console.error('❌ Erro ao pausar:', error)
      alert('❌ Erro ao pausar assinatura')
    }
  }

  const handleActivateSale = async (sale: any) => {
    try {
      const response = await fetch(`/api/subscriptions/${sale.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' })
      })

      const data = await response.json()

      if (data.success) {
        console.log('✅ Assinatura ativada!')
        setTimeout(() => window.location.reload(), 1000)
      } else {
        alert('❌ Erro: ' + data.error)
      }
    } catch (error) {
      console.error('❌ Erro ao ativar:', error)
      alert('❌ Erro ao ativar assinatura')
    }
  }

  const handleArchiveSale = async (sale: any) => {
    try {
      const response = await fetch(`/api/subscriptions/${sale.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived' })
      })

      const data = await response.json()

      if (data.success) {
        console.log('✅ Venda arquivada!')
        setTimeout(() => window.location.reload(), 1000)
      } else {
        alert('❌ Erro: ' + data.error)
      }
    } catch (error) {
      console.error('❌ Erro ao arquivar:', error)
      alert('❌ Erro ao arquivar venda')
    }
  }

  const handleDeleteSale = async (sale: any) => {
    try {
      const response = await fetch(`/api/subscriptions/${sale.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        console.log('✅ Venda excluída!')
        setTimeout(() => window.location.reload(), 1000)
      } else {
        alert('❌ Erro: ' + data.error)
      }
    } catch (error) {
      console.error('❌ Erro ao excluir:', error)
      alert('❌ Erro ao excluir venda')
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <SalesHeader
        onCreateSale={handleCreateSale}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {showFilters && (
        <SalesFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      )}

      <SalesList
        filters={filters}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onSaleSelect={handleSaleSelect}
        onPause={handlePauseSale}
        onActivate={handleActivateSale}
        onArchive={handleArchiveSale}
        onDelete={handleDeleteSale}
      />

      {/* Modals */}
      {showDetailsModal && selectedSale && (
        <SaleDetailsModal
          sale={selectedSale}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            setShowDetailsModal(false)
            setSelectedSale(selectedSale)
            setShowCreateModal(true)
          }}
        />
      )}

      {showCreateModal && (
        <CreateSaleModal
          onClose={() => {
            setShowCreateModal(false)
            setSelectedSale(null)
          }}
          onSave={handleSaveSale}
          sale={selectedSale}
        />
      )}
    </div>
  )
}
