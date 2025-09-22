'use client'

import { useState } from 'react'
import { AttendantsHeader } from '@/components/attendants/AttendantsHeader'
import { AttendantsFilters } from '@/components/attendants/AttendantsFilters'
import { AttendantsList } from '@/components/attendants/AttendantsList'
import { AttendantDetailsModal } from '@/components/attendants/AttendantDetailsModal'
import { CreateAttendantModal } from '@/components/attendants/CreateAttendantModal'

export default function AttendantsPage() {
  const [selectedAttendant, setSelectedAttendant] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    onlineStatus: 'all',
    department: 'all',
    performance: 'all',
    workload: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const handleAttendantSelect = (attendant: any) => {
    setSelectedAttendant(attendant)
    setShowDetailsModal(true)
  }

  const handleCreateAttendant = () => {
    setShowCreateModal(true)
  }

  const handleSaveAttendant = (attendantData: any) => {
    console.log('💾 Salvando atendente:', attendantData)
    // Aqui você faria a chamada para a API
  }

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <AttendantsHeader
        onCreateAttendant={handleCreateAttendant}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <AttendantsFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <AttendantsList
        filters={filters}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onAttendantSelect={handleAttendantSelect}
      />

      {/* Modals */}
      {showDetailsModal && selectedAttendant && (
        <AttendantDetailsModal
          attendant={selectedAttendant}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            setShowDetailsModal(false)
            setSelectedAttendant(selectedAttendant)
            setShowCreateModal(true)
          }}
        />
      )}

      {showCreateModal && (
        <CreateAttendantModal
          onClose={() => {
            setShowCreateModal(false)
            setSelectedAttendant(null)
          }}
          onSave={handleSaveAttendant}
          attendant={selectedAttendant}
        />
      )}
    </div>
  )
}
