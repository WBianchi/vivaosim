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
  const [editingSchedule, setEditingSchedule] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    client: '',
    agent: 'all',
    type: 'all',
    format: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'calendar'>('calendar')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full p-8">
        {/* Header */}
        <SchedulesHeader 
          onCreateSchedule={() => {
            setEditingSchedule(null)
            setShowCreateModal(true)
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onToggleFilters={() => setShowFilters(!showFilters)}
          showFilters={showFilters}
        />

        {/* Filtros Colapsáveis */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SchedulesFilters 
              filters={filters}
              onFiltersChange={setFilters}
            />
          </motion.div>
        )}

        {/* Lista de Agendamentos */}
        <SchedulesList 
          key={refreshKey}
          filters={filters}
          searchTerm={searchTerm}
          viewMode={viewMode}
          onScheduleSelect={setSelectedSchedule}
          onScheduleUpdate={() => setRefreshKey(prev => prev + 1)}
        />

        {/* Modal de Detalhes */}
        {selectedSchedule && (
          <ScheduleDetailsModal
            schedule={selectedSchedule}
            onClose={() => setSelectedSchedule(null)}
            onEdit={() => {
              setEditingSchedule(selectedSchedule)
              setShowCreateModal(true)
              setSelectedSchedule(null)
            }}
          />
        )}

        {/* Modal de Criação/Edição */}
        {showCreateModal && (
          <CreateScheduleModal
            schedule={editingSchedule}
            onClose={() => {
              setShowCreateModal(false)
              setEditingSchedule(null)
            }}
            onSave={() => {
              setShowCreateModal(false)
              setEditingSchedule(null)
              setRefreshKey(prev => prev + 1)
            }}
          />
        )}
      </div>
    </div>
  )
}
