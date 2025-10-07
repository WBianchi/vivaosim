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
    if (confirm(`Deseja excluir o cliente ${client.name}?`)) {
      try {
        console.log('🗑️ Excluindo cliente:', client.id)
        // TODO: Implementar API de exclusão
        alert('🚧 Exclusão em desenvolvimento')
      } catch (error) {
        console.error('❌ Erro ao excluir cliente:', error)
        alert('❌ Erro ao excluir cliente')
      }
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
