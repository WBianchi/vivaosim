'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SchedulesHeader } from '@/components/schedules/SchedulesHeader'
import { SchedulesFilters } from '@/components/schedules/SchedulesFilters'
import { SchedulesList } from '@/components/schedules/SchedulesList'
import { ScheduleDetailsModal } from '@/components/schedules/ScheduleDetailsModal'
import { CreateScheduleModal } from '@/components/schedules/CreateScheduleModal'

export default function AgendamentosPage() {
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    client: '',
    agent: 'all',
    type: 'all',
    format: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'calendar'>('grid')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full p-8">
        {/* Header */}
        <SchedulesHeader 
          onCreateSchedule={() => setShowCreateModal(true)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Filtros */}
        <SchedulesFilters 
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Lista de Agendamentos */}
        <SchedulesList 
          filters={filters}
          searchTerm={searchTerm}
          viewMode={viewMode}
          onScheduleSelect={setSelectedSchedule}
        />

        {/* Modal de Detalhes */}
        {selectedSchedule && (
          <ScheduleDetailsModal
            schedule={selectedSchedule}
            onClose={() => setSelectedSchedule(null)}
            onEdit={() => {
              console.log('🔄 Editar agendamento:', selectedSchedule.id)
              setSelectedSchedule(null)
            }}
          />
        )}

        {/* Modal de Criação */}
        {showCreateModal && (
          <CreateScheduleModal
            onClose={() => setShowCreateModal(false)}
            onSave={(scheduleData) => {
              console.log('💾 Salvando agendamento:', scheduleData)
              setShowCreateModal(false)
            }}
          />
        )}
      </div>
    </div>
  )
}
