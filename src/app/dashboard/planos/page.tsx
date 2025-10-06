'use client'

import { useState } from 'react'
import { PlansHeader } from '@/components/plans/PlansHeader'
import { PlansFilters } from '@/components/plans/PlansFilters'
import { PlansList } from '@/components/plans/PlansList'
import { PlanDetailsModal } from '@/components/plans/PlanDetailsModal'
import { CreatePlanModal } from '@/components/plans/CreatePlanModal'

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    period: 'all',
    priceRange: 'all',
    category: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan)
    setShowDetailsModal(true)
  }

  const handleCreatePlan = () => {
    setShowCreateModal(true)
  }

  const [refreshKey, setRefreshKey] = useState(0)

  const handleSavePlan = () => {
    setShowCreateModal(false)
    setSelectedPlan(null)
    setRefreshKey(prev => prev + 1)
  }

  const handleEditPlan = (plan: any) => {
    setSelectedPlan(plan)
    setShowCreateModal(true)
  }

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Tem certeza que deseja excluir este plano?')) return

    try {
      const token = localStorage.getItem('accessToken') || 
                   document.cookie.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1]

      const response = await fetch(`/api/plans?id=${planId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setRefreshKey(prev => prev + 1)
        alert('✅ Plano excluído com sucesso!')
      } else {
        const data = await response.json()
        alert(`❌ Erro ao excluir plano: ${data.error || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Erro ao excluir plano:', error)
      alert('❌ Erro ao excluir plano')
    }
  }

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <PlansHeader
        onCreatePlan={handleCreatePlan}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {showFilters && (
        <PlansFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      )}

      <PlansList
        key={refreshKey}
        filters={filters}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onPlanSelect={handlePlanSelect}
        onEdit={handleEditPlan}
        onDelete={handleDeletePlan}
      />

      {/* Modals */}
      {showDetailsModal && selectedPlan && (
        <PlanDetailsModal
          plan={selectedPlan}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            setShowDetailsModal(false)
            setShowCreateModal(true)
          }}
        />
      )}

      {showCreateModal && (
        <CreatePlanModal
          onClose={() => {
            setShowCreateModal(false)
            setSelectedPlan(null)
          }}
          onSave={handleSavePlan}
          plan={selectedPlan}
        />
      )}
    </div>
  )
}
