'use client'

import { useState } from 'react'

export type SidebarType = 
  | 'view-client'
  | 'view-item'
  | 'edit-client'
  | 'all-tags'
  | 'all-notes'
  | 'all-tickets'
  | 'all-schedules'
  | 'all-quotes'
  | 'all-contracts'
  | 'create-ticket'
  | 'create-schedule'
  | 'create-quote'
  | 'create-contract'
  | 'assign-agent'
  | 'change-status'
  | null

export const useKanbanActions = () => {
  const [sidebarType, setSidebarType] = useState<SidebarType>(null)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [selectedItemType, setSelectedItemType] = useState<string>('')
  const [refreshCallback, setRefreshCallback] = useState<(() => void) | null>(null)

  const openSidebar = (type: SidebarType, client: any, item?: any, itemType?: string) => {
    console.log(`🔄 Abrindo sidebar ${type} para cliente:`, client.name)
    setSelectedClient(client)
    setSelectedItem(item || null)
    setSelectedItemType(itemType || '')
    setSidebarType(type)
  }

  const closeSidebar = () => {
    setSidebarType(null)
    setSelectedClient(null)
    setSelectedItem(null)
    setSelectedItemType('')
  }

  const handleViewItem = (client: any, itemType: string, item: any) => {
    openSidebar('view-item', client, item, itemType)
  }

  const handleViewClient = (client: any) => {
    openSidebar('view-client', client)
  }

  const handleEditClient = (client: any) => {
    openSidebar('edit-client', client)
  }

  const handleManageTags = (client: any) => {
    openSidebar('all-tags', client)
  }

  const handleManageNotes = (client: any) => {
    openSidebar('all-notes', client)
  }

  const handleAssignAgent = (client: any) => {
    openSidebar('assign-agent', client)
  }

  const handleCreateTicket = (client: any) => {
    openSidebar('create-ticket', client)
  }

  const handleCreateSchedule = (client: any) => {
    openSidebar('create-schedule', client)
  }

  const handleCreateQuote = (client: any) => {
    openSidebar('create-quote', client)
  }

  const handleCreateContract = (client: any) => {
    openSidebar('create-contract', client)
  }

  const handleDeleteClient = async (client: any) => {
    if (!confirm(`Remover ${client.name} do Kanban?\n\nO cliente e seus dados (orçamentos, agendamentos, etc) serão mantidos, apenas será removido desta coluna.`)) {
      return
    }

    try {
      console.log('🗑️ Removendo cliente do Kanban:', client.id)
      
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1]

      // Apenas remove do Kanban (seta kanbanColumnId como null)
      const response = await fetch(`/api/contacts/${client.id}/remove-from-kanban`, {
        method: 'PATCH',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })

      const data = await response.json()

      if (response.ok && data.success) {
        alert('✅ Cliente removido do Kanban!')
        // Recarregar a página para atualizar o Kanban
        window.location.reload()
      } else {
        throw new Error(data.error || 'Erro ao remover cliente')
      }
    } catch (error) {
      console.error('❌ Erro ao remover cliente:', error)
      alert('❌ Erro ao remover cliente: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
    }
  }

  return {
    sidebarType,
    selectedClient,
    selectedItem,
    selectedItemType,
    closeSidebar,
    handleViewClient,
    handleViewItem,
    handleEditClient,
    handleManageTags,
    handleManageNotes,
    handleAssignAgent,
    handleCreateTicket,
    handleCreateSchedule,
    handleCreateQuote,
    handleCreateContract,
    handleDeleteClient
  }
}
