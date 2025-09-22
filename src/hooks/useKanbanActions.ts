'use client'

import { useState } from 'react'

export type BottomSheetType = 
  | 'view-client'
  | 'view-item'
  | 'edit-client'
  | 'add-tag'
  | 'create-ticket'
  | 'create-schedule'
  | 'create-quote'
  | 'create-contract'
  | 'change-queue'
  | 'assign-agent'
  | 'change-status'
  | null

export const useKanbanActions = () => {
  const [bottomSheetType, setBottomSheetType] = useState<BottomSheetType>(null)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [selectedItemType, setSelectedItemType] = useState<string>('')

  const openBottomSheet = (type: BottomSheetType, client: any, item?: any, itemType?: string) => {
    console.log(`🔄 Abrindo ${type} para cliente:`, client.name)
    setSelectedClient(client)
    setSelectedItem(item || null)
    setSelectedItemType(itemType || '')
    setBottomSheetType(type)
  }

  const closeBottomSheet = () => {
    setBottomSheetType(null)
    setSelectedClient(null)
    setSelectedItem(null)
    setSelectedItemType('')
  }

  const handleViewItem = (client: any, itemType: string, item: any) => {
    openBottomSheet('view-item', client, item, itemType)
  }

  const handleViewClient = (client: any) => {
    openBottomSheet('view-client', client)
  }

  const handleEditClient = (client: any) => {
    openBottomSheet('edit-client', client)
  }

  const handleManageTags = (client: any) => {
    openBottomSheet('add-tag', client)
  }

  const handleCreateTicket = (client: any) => {
    openBottomSheet('create-ticket', client)
  }

  const handleCreateSchedule = (client: any) => {
    openBottomSheet('create-schedule', client)
  }

  const handleCreateQuote = (client: any) => {
    openBottomSheet('create-quote', client)
  }

  const handleCreateContract = (client: any) => {
    openBottomSheet('create-contract', client)
  }

  const handleChangeQueue = (client: any) => {
    openBottomSheet('change-queue', client)
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
    bottomSheetType,
    selectedClient,
    selectedItem,
    selectedItemType,
    closeBottomSheet,
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
