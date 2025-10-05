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
  const [showFilters, setShowFilters] = useState(false)
  const [attendants, setAttendants] = useState<any[]>([])
  const [filters, setFilters] = useState({
    status: 'all',
    onlineStatus: 'all',
    department: 'all',
    performance: 'all',
    workload: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  // Calcular estatísticas
  const stats = {
    totalAttendants: attendants.length,
    onlineAttendants: attendants.filter(a => a.onlineStatus === 'online').length,
    activeChats: attendants.reduce((sum, a) => sum + (a.activeChats || 0), 0),
    avgResponseTime: attendants.reduce((sum, a) => sum + (a.metrics?.avgResponseTime || 0), 0) / attendants.length || 0,
    avgRating: attendants.reduce((sum, a) => sum + (a.rating || 0), 0) / attendants.length || 0,
    totalTickets: attendants.reduce((sum, a) => sum + (a.openTickets || 0) + (a.inProgressTickets || 0), 0),
    resolvedToday: attendants.reduce((sum, a) => sum + (a.metrics?.resolvedTickets || 0), 0),
    pendingTickets: attendants.reduce((sum, a) => sum + (a.openTickets || 0), 0)
  }

  const handleAttendantSelect = (attendant: any) => {
    setSelectedAttendant(attendant)
    setShowDetailsModal(true)
  }

  const handleCreateAttendant = () => {
    setShowCreateModal(true)
  }

  const handleSaveAttendant = async (attendantData: any) => {
    console.log('💾 Salvando atendente:', attendantData)
    
    try {
      const isEditing = !!selectedAttendant?.id
      const payload = {
        name: attendantData.name,
        email: attendantData.email,
        phone: attendantData.phone,
        password: attendantData.password || undefined,
        avatar: attendantData.avatar || null
      }
      
      // Remove password se estiver vazio na edição
      if (isEditing && !payload.password) {
        delete payload.password
      }
      
      console.log(`📤 Enviando ${isEditing ? 'PUT' : 'POST'} para /api/attendants:`, payload)
      
      const url = isEditing ? `/api/attendants/${selectedAttendant.id}` : '/api/attendants'
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      console.log('📥 Response status:', response.status)
      const data = await response.json()
      console.log('📥 Response data:', data)

      if (data.success) {
        alert(`✅ Atendente ${isEditing ? 'atualizado' : 'criado'} com sucesso!`)
        setShowCreateModal(false)
        setSelectedAttendant(null)
        // Recarregar lista
        window.location.reload()
      } else {
        alert('❌ Erro: ' + data.error)
      }
    } catch (error) {
      console.error('❌ Erro ao salvar atendente:', error)
      alert('❌ Erro ao salvar atendente')
    }
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
        onToggleFilters={() => setShowFilters(!showFilters)}
        stats={stats}
      />

      {showFilters && (
        <AttendantsFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      )}

      <AttendantsList
        filters={filters}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onAttendantSelect={handleAttendantSelect}
        onEdit={(attendant) => {
          setSelectedAttendant(attendant)
          setShowCreateModal(true)
        }}
        onAttendantsLoad={setAttendants}
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
