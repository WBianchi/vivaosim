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

  return (
    <div className="flex-1 space-y-6 p-6">
      <SalesHeader
        onCreateSale={handleCreateSale}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <SalesFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <SalesList
        filters={filters}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onSaleSelect={handleSaleSelect}
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
