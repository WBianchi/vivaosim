'use client'

import { ViewClientSidebar } from '@/components/chat/sidebars/ViewClientSidebar'
import { EditClientSidebar } from '@/components/chat/sidebars/EditClientSidebar'
import { AssignAgentSidebar } from '@/components/chat/sidebars/AssignAgentSidebar'
import { ChangeStatusSidebar } from '@/components/chat/sidebars/ChangeStatusSidebar'
import { AllNotesSidebar } from '@/components/chat/sidebars/AllNotesSidebar'
import { CreateTicketModal } from '@/components/tickets/CreateTicketModal'
import { CreateScheduleModal } from '@/components/schedules/CreateScheduleModal'
import { CreateQuoteModal } from '@/components/quotes/CreateQuoteModal'
import { CreateContractModal } from '@/components/contracts/CreateContractModal'
import { CreateTagModal } from '@/components/tags/CreateTagModal'
import { SidebarType } from '@/hooks/useKanbanActions'

interface KanbanSidebarsProps {
  sidebarType: SidebarType
  selectedClient: any
  selectedItem?: any
  selectedItemType?: string
  onClose: () => void
  onRefresh?: () => void
}

export const KanbanSidebars: React.FC<KanbanSidebarsProps> = ({
  sidebarType,
  selectedClient,
  onClose,
  onRefresh
}) => {
  if (!sidebarType || !selectedClient) return null

  const mockChatId = selectedClient.whatsappChatId || `kanban-${selectedClient.id}`

  const handleSave = () => {
    console.log('✅ Item salvo com sucesso')
    onClose()
    // Refresh do Kanban para atualizar badges
    if (onRefresh) {
      setTimeout(() => {
        onRefresh()
      }, 500)
    }
  }

  switch (sidebarType) {
    // Modais de criação
    case 'create-ticket':
      return (
        <CreateTicketModal
          onClose={onClose}
          onSave={handleSave}
          ticket={null}
        />
      )

    case 'create-schedule':
      return (
        <CreateScheduleModal
          onClose={onClose}
          onSave={handleSave}
          schedule={null}
        />
      )

    case 'create-quote':
      return (
        <CreateQuoteModal
          onClose={onClose}
          onSave={handleSave}
          quote={null}
        />
      )

    case 'create-contract':
      return (
        <CreateContractModal
          onClose={onClose}
          onSave={handleSave}
        />
      )

    case 'all-tags':
      return (
        <CreateTagModal
          onClose={onClose}
          onSave={handleSave}
          tag={null}
        />
      )

    case 'all-notes':
      return (
        <AllNotesSidebar
          isOpen={true}
          onClose={onClose}
          chatId={selectedClient.id}
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
