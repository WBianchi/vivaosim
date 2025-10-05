'use client'

import { useState } from 'react'
import { AttendantsHeader } from '@/components/attendants/AttendantsHeader'
import { AttendantsFilters } from '@/components/attendants/AttendantsFilters'
import { AttendantsList } from '@/components/attendants/AttendantsList'
import { CreateAttendantModal } from '@/components/attendants/CreateAttendantModal'
import { AttendantDetailsModal } from '@/components/attendants/AttendantDetailsModal'

export default function AttendantsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedAttendant, setSelectedAttendant] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [filters, setFilters] = useState({
    status: 'all',
    onlineStatus: 'all',
    department: 'all',
    performance: 'all',
    workload: 'all'
  })

  const handleCreateAttendant = async (attendantData: any) => {
    console.log('🚀 handleCreateAttendant chamado com:', attendantData)
    
    try {
      const payload = {
        name: attendantData.name,
        email: attendantData.email,
        phone: attendantData.phone,
        password: attendantData.password || 'senha123',
        avatar: attendantData.avatar || null
      }
      
      console.log('📤 Enviando POST para /api/attendants:', payload)
      
      const response = await fetch('/api/attendants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      console.log('📥 Response status:', response.status)
      const data = await response.json()
      console.log('📥 Response data:', data)

      if (data.success) {
        alert('✅ Atendente criado com sucesso!')
        setShowCreateModal(false)
        // Recarregar lista
        window.location.reload()
      } else {
        alert('❌ Erro: ' + data.error)
      }
    } catch (error) {
      console.error('❌ Erro ao criar atendente:', error)
      alert('❌ Erro ao criar atendente')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8">
        
        {/* Header */}
        <AttendantsHeader
          onCreateAttendant={() => setShowCreateModal(true)}
          onSearchChange={setSearchTerm}
          searchTerm={searchTerm}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {/* Filtros (Colapsável) */}
        {showFilters && (
          <div className="mt-6">
            <AttendantsFilters
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
        )}

        {/* Lista */}
        <div className="mt-6">
          <AttendantsList
            filters={filters}
            searchTerm={searchTerm}
            viewMode={viewMode}
            onAttendantSelect={setSelectedAttendant}
          />
        </div>

        {/* Modal Criar/Editar */}
        {showCreateModal && (
          <CreateAttendantModal
            onClose={() => setShowCreateModal(false)}
            onSave={handleCreateAttendant}
          />
        )}

        {/* Modal Detalhes */}
        {selectedAttendant && (
          <AttendantDetailsModal
            attendant={selectedAttendant}
            onClose={() => setSelectedAttendant(null)}
            onEdit={() => {
              setShowCreateModal(true)
              setSelectedAttendant(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
