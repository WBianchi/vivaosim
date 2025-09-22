'use client'

import { useState } from 'react'
import { ChatSidebar } from '@/components/internal-chat/ChatSidebar'
import { ChatArea } from '@/components/internal-chat/ChatArea'
import { ChatTopBar } from '@/components/internal-chat/ChatTopBar'
import { ChatFilters } from '@/components/internal-chat/ChatFilters'

export default function ChatInternoPage() {
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'attendants' | 'clients'>('all')
  const [isTyping, setIsTyping] = useState(false)
  const [onlineStatus, setOnlineStatus] = useState<'online' | 'away' | 'busy' | 'offline'>('online')

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar com lista de chats */}
      <ChatSidebar
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
        searchTerm={searchTerm}
        filterType={filterType}
      />

      {/* Área principal do chat */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar com informações e ações */}
        <ChatTopBar
          selectedChat={selectedChat}
          onlineStatus={onlineStatus}
          onStatusChange={setOnlineStatus}
        />

        {/* Filtros do chat */}
        <ChatFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterType={filterType}
          onFilterChange={setFilterType}
        />

        {/* Área de mensagens */}
        <ChatArea
          selectedChat={selectedChat}
          isTyping={isTyping}
          onTypingChange={setIsTyping}
        />
      </div>
    </div>
  )
}
