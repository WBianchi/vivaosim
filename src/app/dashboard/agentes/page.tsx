'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AgentsHeader } from '@/components/agents/AgentsHeader'
import { AgentsFilters } from '@/components/agents/AgentsFilters'
import { AgentsList } from '@/components/agents/AgentsList'
import { AgentDetailsModal } from '@/components/agents/AgentDetailsModal'
import { CreateAgentModal } from '@/components/agents/CreateAgentModal'
import { AgentActivationModal } from '@/components/agents/AgentActivationModal'

export default function AgentesPage() {
  const [selectedAgent, setSelectedAgent] = useState<any>(null)
  const [editingAgent, setEditingAgent] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showActivationModal, setShowActivationModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [activationAgent, setActivationAgent] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [filters, setFilters] = useState({
    status: 'all',
    model: 'all',
    niche: 'all',
    role: 'all',
    userType: 'all',
    activationMode: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const handleActivation = (agent: any) => {
    setActivationAgent(agent)
    setShowActivationModal(true)
  }

  const handleEditAgent = (agent: any) => {
    setEditingAgent(agent)
    setShowCreateModal(true)
  }

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este agente?')) return

    try {
      const token = localStorage.getItem('accessToken') || 
                   document.cookie.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1]

      const response = await fetch(`/api/agents?id=${agentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setRefreshKey(prev => prev + 1)
        alert('✅ Agente excluído com sucesso!')
      } else {
        const data = await response.json()
        alert(`❌ Erro ao excluir agente: ${data.error || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Erro ao excluir agente:', error)
      alert('❌ Erro ao excluir agente')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full p-8">
        {/* Header */}
        <AgentsHeader 
          onCreateAgent={() => setShowCreateModal(true)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {/* Filtros */}
        {showFilters && (
          <AgentsFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
        )}

        {/* Lista de Agentes */}
        <AgentsList 
          key={refreshKey}
          filters={filters}
          searchTerm={searchTerm}
          viewMode={viewMode}
          onAgentSelect={setSelectedAgent}
          onActivationRequest={handleActivation}
          onEdit={handleEditAgent}
          onDelete={handleDeleteAgent}
        />

        {/* Modal de Detalhes */}
        {selectedAgent && (
          <AgentDetailsModal
            agent={selectedAgent}
            onClose={() => setSelectedAgent(null)}
            onEdit={() => {
              console.log('🔄 Editar agente:', selectedAgent.id)
              setSelectedAgent(null)
            }}
            onActivation={() => handleActivation(selectedAgent)}
          />
        )}

        {/* Modal de Criação */}
        {showCreateModal && (
          <CreateAgentModal
            agent={editingAgent}
            onClose={() => {
              setShowCreateModal(false)
              setEditingAgent(null)
            }}
            onSave={(agentData) => {
              console.log('💾 Agente salvo:', agentData)
              setShowCreateModal(false)
              setEditingAgent(null)
              setRefreshKey(prev => prev + 1) // Recarrega a lista
            }}
          />
        )}

        {/* Modal de Ativação */}
        {showActivationModal && activationAgent && (
          <AgentActivationModal
            agent={activationAgent}
            onClose={() => {
              setShowActivationModal(false)
              setActivationAgent(null)
            }}
            onActivate={(activationData) => {
              console.log('🚀 Ativando agente:', activationData)
              setShowActivationModal(false)
              setActivationAgent(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
