'use client'

import { useState } from 'react'

export type SidebarType = 
  | 'view-client'
  | 'view-item'
  | 'edit-client'
  | 'tag'
  | 'ticket'
  | 'schedule'
  | 'quote'
  | 'contract'
  | 'change-queue'
  | 'assign-agent'
  | 'change-status'
  | null

export const useKanbanActions = () => {
  const [sidebarType, setSidebarType] = useState<SidebarType>(null)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [selectedItemType, setSelectedItemType] = useState<string>('')

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
    openSidebar('tag', client)
  }

  const handleCreateTicket = (client: any) => {
    openSidebar('ticket', client)
  }

  const handleCreateSchedule = (client: any) => {
    openSidebar('schedule', client)
  }

  const handleCreateQuote = (client: any) => {
    openSidebar('quote', client)
  }

  const handleCreateContract = (client: any) => {
    openSidebar('contract', client)
  }

  const handleChangeQueue = (client: any) => {
    openSidebar('change-queue', client)
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
    handleCreateTicket,
    handleCreateSchedule,
    handleCreateQuote,
    handleCreateContract,
    handleChangeQueue,
    handleDeleteClient
  }
}
