'use client'

import { useState } from 'react'
import { FinancialHeader } from '@/components/financial/FinancialHeader'
import { FinancialMetrics } from '@/components/financial/FinancialMetrics'
import { FinancialCharts } from '@/components/financial/FinancialCharts'
import { FinancialEvents } from '@/components/financial/FinancialEvents'
import { FinancialExpenses } from '@/components/financial/FinancialExpenses'
import { FinancialBudget } from '@/components/financial/FinancialBudget'

export default function FinanceiroPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'overview' | 'events' | 'expenses' | 'budget'>('overview')

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <FinancialHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Métricas Principais */}
      <FinancialMetrics
        period={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      {/* Conteúdo baseado no modo de visualização */}
      {viewMode === 'overview' && (
        <>
          {/* Gráficos Financeiros */}
          <FinancialCharts period={selectedPeriod} />
        </>
      )}

      {viewMode === 'events' && (
        <>
          {/* Controle Financeiro de Eventos */}
          <FinancialEvents
            selectedEvent={selectedEvent}
            onSelectEvent={setSelectedEvent}
          />
        </>
      )}

      {viewMode === 'expenses' && (
        <>
          {/* Despesas e Custos */}
          <FinancialExpenses period={selectedPeriod} />
        </>
      )}

      {viewMode === 'budget' && (
        <>
          {/* Orçamentos e Licitações */}
          <FinancialBudget />
        </>
      )}
    </div>
  )
}
