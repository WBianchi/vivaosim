'use client'

import { useState } from 'react'
import { KanbanBoardList } from '@/components/kanban/KanbanBoardList'
import { CreateBoardModal } from '@/components/kanban/boards/CreateBoardModal'
import { KanbanHeader } from '@/components/kanban/KanbanHeader'
import { KanbanSidebars } from '@/components/kanban/KanbanSidebars'
import { useKanbanActions } from '@/hooks/useKanbanActions'

export default function KanbanPage() {
  const [showCreateBoard, setShowCreateBoard] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  
  // Hook para gerenciar ações do Kanban e sidebars
  const kanbanActions = useKanbanActions()

  const handleBoardCreated = () => {
    setRefreshTrigger(prev => prev + 1) // Trigger refresh na lista
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="w-full p-8">
        <KanbanHeader onCreateBoard={() => setShowCreateBoard(true)} />
        <KanbanBoardList 
          key={refreshTrigger} 
          kanbanActions={kanbanActions}
          onCreateBoard={() => setShowCreateBoard(true)}
        />
        
        {showCreateBoard && (
          <CreateBoardModal 
            onClose={() => setShowCreateBoard(false)}
            onBoardCreated={handleBoardCreated}
          />
        )}

        {/* Sidebars Integradas */}
        <KanbanSidebars
          sidebarType={kanbanActions.sidebarType}
          selectedClient={kanbanActions.selectedClient}
          selectedItem={kanbanActions.selectedItem}
          selectedItemType={kanbanActions.selectedItemType}
          onClose={kanbanActions.closeSidebar}
          onRefresh={() => setRefreshTrigger(prev => prev + 1)}
        />
      </div>
    </div>
  )
}
