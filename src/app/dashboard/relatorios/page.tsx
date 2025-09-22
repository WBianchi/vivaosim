'use client'

import { useState } from 'react'
import { ReportsHeader } from '@/components/reports/ReportsHeader'
import { ReportsMetrics } from '@/components/reports/ReportsMetrics'
import { ReportsCharts } from '@/components/reports/ReportsCharts'
import { ReportsFilters } from '@/components/reports/ReportsFilters'
import { ReportsTable } from '@/components/reports/ReportsTable'
import { ReportsExport } from '@/components/reports/ReportsExport'

export default function RelatoriosPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedReport, setSelectedReport] = useState('overview')
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    type: 'all',
    status: 'all',
    channel: 'all'
  })

  return (
    <div className="p-6 space-y-6">
        {/* Header com título e ações */}
        <ReportsHeader 
          selectedReport={selectedReport}
          onReportChange={setSelectedReport}
        />

        {/* Filtros */}
        <ReportsFilters
          filters={filters}
          onFiltersChange={setFilters}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />

        {/* Métricas em Cards */}
        <ReportsMetrics 
          period={selectedPeriod}
          filters={filters}
        />

        {/* Gráficos */}
        <ReportsCharts
          period={selectedPeriod}
          filters={filters}
          reportType={selectedReport}
        />

        {/* Tabela de Dados */}
        <ReportsTable
          period={selectedPeriod}
          filters={filters}
          reportType={selectedReport}
        />

        {/* Exportar Relatório */}
        <ReportsExport
          data={{
            period: selectedPeriod,
            filters,
            reportType: selectedReport
          }}
        />
      </div>
  )
}