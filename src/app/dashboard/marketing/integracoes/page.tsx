'use client'

import { useState } from 'react'
import { IntegrationsHeader } from '@/components/marketing/integrations/IntegrationsHeader'
import { IntegrationsGrid } from '@/components/marketing/integrations/IntegrationsGrid'
import { IntegrationsFilters } from '@/components/marketing/integrations/IntegrationsFilters'

export default function IntegracoesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeIntegrations, setActiveIntegrations] = useState<string[]>([])

  const handleToggleIntegration = (id: string) => {
    setActiveIntegrations(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <IntegrationsHeader />

      {/* Filtros */}
      <IntegrationsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Grid de Integrações */}
      <IntegrationsGrid
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        activeIntegrations={activeIntegrations}
        onToggleIntegration={handleToggleIntegration}
      />
    </div>
  )
}
