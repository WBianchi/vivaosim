'use client'

import { useState } from 'react'
import { AutomationsHeader } from '@/components/marketing/automations/AutomationsHeader'
import { AutomationsCanvas } from '@/components/marketing/automations/AutomationsCanvas'
import { AutomationsSidebar } from '@/components/marketing/automations/AutomationsSidebar'
import { AutomationsToolbar } from '@/components/marketing/automations/AutomationsToolbar'

export default function AutomacoesPage() {
  const [selectedAutomation, setSelectedAutomation] = useState<any>(null)
  const [nodes, setNodes] = useState<any[]>([])
  const [edges, setEdges] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar com triggers e ações */}
      <AutomationsSidebar />

      {/* Área principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AutomationsHeader
          selectedAutomation={selectedAutomation}
          isRunning={isRunning}
          onToggleRun={() => setIsRunning(!isRunning)}
        />

        {/* Toolbar */}
        <AutomationsToolbar
          onSave={() => console.log('💾 Salvando automação')}
          onTest={() => console.log('🧪 Testando automação')}
          onDuplicate={() => console.log('📋 Duplicando automação')}
        />

        {/* Canvas */}
        <AutomationsCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={setNodes}
          onEdgesChange={setEdges}
        />
      </div>
    </div>
  )
}
