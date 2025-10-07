'use client'

import { AllTicketsSidebar } from '@/components/chat/sidebars/AllTicketsSidebar'
import { AllSchedulesSidebar } from '@/components/chat/sidebars/AllSchedulesSidebar'
import { AllContractsSidebar } from '@/components/chat/sidebars/AllContractsSidebar'
import { AllQuotesSidebar } from '@/components/chat/sidebars/AllQuotesSidebar'
import { AllTagsSidebar } from '@/components/chat/sidebars/AllTagsSidebar'
import { ViewClientSidebar } from '@/components/chat/sidebars/ViewClientSidebar'
import { EditClientSidebar } from '@/components/chat/sidebars/EditClientSidebar'
import { AssignAgentSidebar } from '@/components/chat/sidebars/AssignAgentSidebar'
import { ChangeStatusSidebar } from '@/components/chat/sidebars/ChangeStatusSidebar'
import { SidebarType } from '@/hooks/useKanbanActions'

interface KanbanSidebarsProps {
  sidebarType: SidebarType
  selectedClient: any
  selectedItem?: any
  selectedItemType?: string
  onClose: () => void
}

export const KanbanSidebars: React.FC<KanbanSidebarsProps> = ({
  sidebarType,
  selectedClient,
  selectedItem,
  selectedItemType,
  onClose
}) => {
  if (!sidebarType || !selectedClient) return null

  // Criar um chatId mock para compatibilidade com as sidebars
  const mockChatId = selectedClient.whatsappChatId || `kanban-${selectedClient.id}`

  switch (sidebarType) {
    case 'ticket':
      return (
        <AllTicketsSidebar
          isOpen={true}
          onClose={onClose}
          chatId={mockChatId}
        />
      )
      
    case 'schedule':
      return (
        <AllSchedulesSidebar
          isOpen={true}
          onClose={onClose}
          chatId={mockChatId}
        />
      )
      
    case 'quote':
      return (
        <AllQuotesSidebar
          isOpen={true}
          onClose={onClose}
          chatId={mockChatId}
        />
      )
      
    case 'contract':
      return (
        <AllContractsSidebar
          isOpen={true}
          onClose={onClose}
          chatId={mockChatId}
        />
      )
      
    case 'tag':
      return (
        <AllTagsSidebar
          isOpen={true}
          onClose={onClose}
          chatId={mockChatId}
        />
      )
      
    case 'view-client':
      return (
        <ViewClientSidebar
          isOpen={true}
          onClose={onClose}
          chatId={mockChatId}
          clientData={selectedClient}
        />
      )
      
    case 'edit-client':
      return (
        <EditClientSidebar
          isOpen={true}
          onClose={onClose}
          chatId={mockChatId}
          clientData={selectedClient}
        />
      )
      
    case 'view-item':
      // TODO: Criar ViewItemSidebar específica
      return null
      
    case 'assign-agent':
      return (
        <AssignAgentSidebar
          isOpen={true}
          onClose={onClose}
          chatId={mockChatId}
          clientData={selectedClient}
        />
      )
      
    case 'change-status':
      return (
        <ChangeStatusSidebar
          isOpen={true}
          onClose={onClose}
          chatId={mockChatId}
          clientData={selectedClient}
        />
      )
      
    default:
      return null
  }
}
