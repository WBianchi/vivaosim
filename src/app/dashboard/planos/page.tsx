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
      />

      <PlansFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <PlansList
        key={refreshKey}
        filters={filters}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onPlanSelect={handlePlanSelect}
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
          onClose={() => setShowCreateModal(false)}
          onSave={handleSavePlan}
          plan={selectedPlan}
        />
      )}
    </div>
  )
}
