'use client'

import { useState } from 'react'
import { FunnelHeader } from '@/components/marketing/funnel/FunnelHeader'
import { FunnelStages } from '@/components/marketing/funnel/FunnelStages'
import { FunnelMetrics } from '@/components/marketing/funnel/FunnelMetrics'
import { FunnelKanban } from '@/components/marketing/funnel/FunnelKanban'

export default function FunilPage() {
  const [viewMode, setViewMode] = useState<'funnel' | 'kanban'>('funnel')
  const [selectedStage, setSelectedStage] = useState<string | null>(null)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <FunnelHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Métricas */}
      <FunnelMetrics />

      {/* Visualização do Funil ou Kanban */}
      {viewMode === 'funnel' ? (
        <FunnelStages
          selectedStage={selectedStage}
          onSelectStage={setSelectedStage}
        />
      ) : (
        <FunnelKanban />
      )}
    </div>
  )
}
