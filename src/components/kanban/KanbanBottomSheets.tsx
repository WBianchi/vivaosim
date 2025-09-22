'use client'

import { ViewClientDetailsSheet } from '@/components/chat/bottom-sheets/ViewClientDetailsSheet'
import { ViewItemDetailsSheet } from '@/components/chat/bottom-sheets/ViewItemDetailsSheet'
import { CreateScheduleSheet } from '@/components/chat/bottom-sheets/CreateScheduleSheet'
import { EditClientSheet } from '@/components/chat/bottom-sheets/EditClientSheet'
import { CreateTicketSheet } from '@/components/chat/bottom-sheets/CreateTicketSheet'
import { CreateQuoteSheet } from '@/components/chat/bottom-sheets/CreateQuoteSheet'
import { ManageTagsSheet } from '@/components/chat/bottom-sheets/ManageTagsSheet'
import { CreateContractSheet } from '@/components/chat/bottom-sheets/CreateContractSheet'
import { ChangeQueueSheet } from '@/components/chat/bottom-sheets/ChangeQueueSheet'
import { ChangeStatusSheet } from '@/components/chat/bottom-sheets/ChangeStatusSheet'
import { AssignAgentSheet } from '@/components/chat/bottom-sheets/AssignAgentSheet'
import { BottomSheetType } from '@/hooks/useKanbanActions'

interface KanbanBottomSheetsProps {
  bottomSheetType: BottomSheetType
  selectedClient: any
  selectedItem?: any
  selectedItemType?: string
  onClose: () => void
}

export const KanbanBottomSheets: React.FC<KanbanBottomSheetsProps> = ({
  bottomSheetType,
  selectedClient,
  selectedItem,
  selectedItemType,
  onClose
}) => {
  if (!bottomSheetType || !selectedClient) return null

  // Criar um chat mock para compatibilidade com os bottom-sheets
  const mockChat = {
    id: `kanban-${selectedClient.id}`,
    whatsappChatId: selectedClient.whatsappChatId || `kanban-${selectedClient.id}`,
    name: selectedClient.name,
    lastMessage: null,
    unreadCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const commonProps = {
    chat: mockChat,
    clientData: selectedClient,
    onClose
  }

  switch (bottomSheetType) {
    case 'view-client':
      return <ViewClientDetailsSheet {...commonProps} />
      
    case 'view-item':
      return (
        <ViewItemDetailsSheet
          itemType={selectedItemType || ''}
          itemData={selectedItem}
          onClose={onClose}
          onEdit={() => {
            // Aqui pode trocar para modo de edição
            console.log('🔄 Mudando para edição do item')
          }}
        />
      )
      
    case 'edit-client':
      return <EditClientSheet {...commonProps} />
      
    case 'add-tag':
      return <ManageTagsSheet {...commonProps} />
      
    case 'create-ticket':
      return <CreateTicketSheet {...commonProps} />
      
    case 'create-schedule':
      return <CreateScheduleSheet {...commonProps} />
      
    case 'create-quote':
      return <CreateQuoteSheet {...commonProps} />
      
    case 'create-contract':
      return <CreateContractSheet {...commonProps} />
      
    case 'change-queue':
      return <ChangeQueueSheet {...commonProps} />
      
    case 'change-status':
      return <ChangeStatusSheet {...commonProps} />
      
    case 'assign-agent':
      return <AssignAgentSheet {...commonProps} />
      
    default:
      return null
  }
}
