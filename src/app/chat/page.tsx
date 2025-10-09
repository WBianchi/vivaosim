'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

// Componentes do Chat
import { TopbarChat } from '@/components/chat/TopbarChat'
import { ChatArea } from '@/components/chat/ChatArea'
import { FooterChatArea } from '@/components/chat/FooterChatArea'
import { SideChat } from '@/components/chat/SideChat'
import { AllQuotesSidebar } from '@/components/chat/sidebars/AllQuotesSidebar'
import { TagSidebar } from '@/components/chat/sidebars/TagSidebar'
import { AllContractsSidebar } from '@/components/chat/sidebars/AllContractsSidebar'
import { AllTicketsSidebar } from '@/components/chat/sidebars/AllTicketsSidebar'
import { AllSchedulesSidebar } from '@/components/chat/sidebars/AllSchedulesSidebar'
import { AllGuestsSidebar } from '@/components/chat/sidebars/AllGuestsSidebar'
import { AllExpensesSidebar } from '@/components/chat/sidebars/AllExpensesSidebar'
import { AllSitesSidebar } from '@/components/chat/sidebars/AllSitesSidebar'
import { AllNotesSidebar } from '@/components/chat/sidebars/AllNotesSidebar'
import { SearchSidebar } from '@/components/chat/sidebars/SearchSidebar'
import { AllGiftsSidebar } from '@/components/chat/sidebars/AllGiftsSidebar'
import { AllGiftSalesSidebar } from '@/components/chat/sidebars/AllGiftSalesSidebar'

// Tipos
import { Chat, Message, Contact, ChatAssignmentMeta } from '@/types/chat'

export type SidebarType = 'schedule' | 'quote' | 'tag' | 'contract' | 'contact' | 'ticket' | 'guests' | 'site' | 'expenses' | 'notes' | 'search' | 'gifts' | 'gift-sales' | null

interface ChatPageState {
  activeChat: Chat | null
  activeSidebar: SidebarType
  isConnected: boolean
  unreadCount: number
}

export default function ChatPage() {
  const { user, loading } = useAuth()
  const isAuthenticated = !!user
  const router = useRouter()

  // Estados principais
  const [state, setState] = useState<ChatPageState>({
    activeChat: null,
    activeSidebar: null,
    isConnected: false,
    unreadCount: 0
  })

  const [chatContractCount, setChatContractCount] = useState(0)
  const [chatQuoteCount, setChatQuoteCount] = useState(0)
  const [chatScheduleCount, setChatScheduleCount] = useState(0)
  const [chatMeta, setChatMeta] = useState<Record<string, ChatAssignmentMeta>>({})
  const [aiResponseText, setAiResponseText] = useState('')
  const [translateText, setTranslateText] = useState('')
  const [replyToMessage, setReplyToMessage] = useState<any>(null)
  const [forwardMessageId, setForwardMessageId] = useState('')

  // Buscar contagens do chat ativo
  useEffect(() => {
    const fetchChatCounts = async () => {
      if (!state.activeChat) {
        setChatContractCount(0)
        setChatQuoteCount(0)
        setChatScheduleCount(0)
        return
      }

      try {
        // Buscar contratos
        const contractsRes = await fetch(`/api/contracts?chatId=${state.activeChat.id}`)
        const contractsData = await contractsRes.json()
        if (contractsData.contracts) {
          setChatContractCount(contractsData.contracts.length)
        }

        // Buscar orçamentos
        const quotesRes = await fetch(`/api/quotes/by-chats?chatIds=${state.activeChat.id}`)
        const quotesData = await quotesRes.json()
        if (quotesData.success && quotesData.quotes) {
          setChatQuoteCount(quotesData.quotes.length)
        }

        // Buscar agendamentos
        const contactRes = await fetch(`/api/contacts/check-chat?chatId=${state.activeChat.id}`)
        const contactData = await contactRes.json()
        if (contactData.exists && contactData.contact) {
          const schedulesRes = await fetch(`/api/schedules?contactId=${contactData.contact.id}`)
          const schedulesData = await schedulesRes.json()
          const schedulesList = Array.isArray(schedulesData) ? schedulesData : (schedulesData.schedules || [])
          setChatScheduleCount(schedulesList.length)
        }
      } catch (error) {
        console.error('Erro ao buscar contagens do chat:', error)
      }
    }

    fetchChatCounts()
  }, [state.activeChat])

  // Verificar autenticação (só redireciona se não está carregando)
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, loading, router])

  // Funções de controle
  const handleChatSelect = (chat: Chat) => {
    setState(prev => ({ ...prev, activeChat: chat, activeSidebar: null }))
  }

  const handleMetaReplace = React.useCallback((metaMap: Record<string, ChatAssignmentMeta>) => {
    setChatMeta(prev => ({ ...prev, ...metaMap }))
  }, [])

  const handleMetaMerge = React.useCallback((chatId: string, patch: Partial<ChatAssignmentMeta>) => {
    setChatMeta(prev => {
      const existing = prev[chatId] || {}
      const next: ChatAssignmentMeta = { ...existing }

      Object.entries(patch).forEach(([key, value]) => {
        ;(next as any)[key] = value
      })

      return {
        ...prev,
        [chatId]: next
      }
    })
  }, [])

  const handleSidebarToggle = (sidebar: SidebarType) => {
    setState(prev => ({ 
      ...prev, 
      activeSidebar: prev.activeSidebar === sidebar ? null : sidebar 
    }))
  }

  const handleCloseSidebar = () => {
    setState(prev => ({ ...prev, activeSidebar: null }))
  }

  const handleConnectionChange = (connected: boolean) => {
    setState(prev => ({ ...prev, isConnected: connected }))
  }

  if (loading || (!isAuthenticated || !user)) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* TopBar no topo */}
      <TopbarChat 
        user={user}
        isConnected={state.isConnected}
        unreadCount={state.unreadCount}
        activeChat={state.activeChat}
        onSidebarToggle={handleSidebarToggle}
        activeSidebar={state.activeSidebar}
      />

      {/* Área Principal - Horizontal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar de Conversas - Largura Fixa */}
        <SideChat
          onChatSelect={handleChatSelect}
          activeChat={state.activeChat}
          onConnectionChange={handleConnectionChange}
          chatMeta={chatMeta}
          onMetaMerge={handleMetaMerge}
          onMetaReplace={handleMetaReplace}
        />

        {/* Área do Chat - Flex restante */}
        <div className="flex-1 flex min-w-0 overflow-hidden">
          {/* Chat Principal */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {state.activeChat ? (
              <>
                {/* Área de Mensagens */}
                <div className="flex-1 overflow-hidden">
                  <ChatArea 
                    chat={state.activeChat}
                    onSidebarToggle={handleSidebarToggle}
                    chatContractCount={chatContractCount}
                    chatQuoteCount={chatQuoteCount}
                    chatScheduleCount={chatScheduleCount}
                    meta={state.activeChat ? chatMeta[state.activeChat.id] : undefined}
                    onAIResponse={setAiResponseText}
                    onTranslate={setTranslateText}
                    onReply={setReplyToMessage}
                    onForward={setForwardMessageId}
                  />
                </div>
                
                {/* Footer de Input */}
                <div className="flex-shrink-0">
                  <FooterChatArea 
                    chat={state.activeChat}
                    onSidebarToggle={handleSidebarToggle}
                    aiResponseText={aiResponseText}
                    translateText={translateText}
                    replyToMessage={replyToMessage}
                    onAIModalClose={() => setAiResponseText('')}
                    onTranslateModalClose={() => setTranslateText('')}
                    onReplyClose={() => setReplyToMessage(null)}
                  />
                </div>
              </>
            ) : (
            /* Tela de Boas-vindas */
            <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
              <div className="text-center max-w-md">
                <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Bem-vindo ao Viva o Sim Chat
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Selecione uma conversa para começar a atender seus clientes com excelência
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="font-semibold text-green-700 dark:text-green-400">Em Tempo Real</div>
                    <div className="text-green-600 dark:text-green-300">Mensagens instantâneas</div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="font-semibold text-blue-700 dark:text-blue-400">Organizado</div>
                    <div className="text-blue-600 dark:text-blue-300">Tickets e agendamentos</div>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>

        </div>
      </div>

      {/* Sidebars como Dialog/Sheet */}
      <AllQuotesSidebar
        isOpen={state.activeSidebar === 'quote'}
        onClose={() => handleSidebarToggle(null)}
        chatId={state.activeChat?.id}
      />

      <TagSidebar
        isOpen={state.activeSidebar === 'tag'}
        onClose={() => handleSidebarToggle(null)}
        chatId={state.activeChat?.id || ''}
        contactId={state.activeChat?.contact?.id}
        contactName={state.activeChat?.contact?.name}
      />

      <AllContractsSidebar
        isOpen={state.activeSidebar === 'contract'}
        onClose={() => handleSidebarToggle(null)}
        chatId={state.activeChat?.id}
      />

      <AllTicketsSidebar
        isOpen={state.activeSidebar === 'ticket'}
        onClose={() => handleSidebarToggle(null)}
        chatId={state.activeChat?.id}
        contactId={state.activeChat?.contact?.id}
      />

      <AllSchedulesSidebar
        isOpen={state.activeSidebar === 'schedule'}
        onClose={() => handleSidebarToggle(null)}
        chatId={state.activeChat?.id}
      />

      <AllGuestsSidebar
        isOpen={state.activeSidebar === 'guests'}
        onClose={() => handleSidebarToggle(null)}
        chatId={state.activeChat?.id}
      />

      <AllExpensesSidebar
        isOpen={state.activeSidebar === 'expenses'}
        onClose={() => handleSidebarToggle(null)}
        chatId={state.activeChat?.id}
      />

      <AllSitesSidebar
        isOpen={state.activeSidebar === 'site'}
        onClose={() => handleSidebarToggle(null)}
        chatId={state.activeChat?.id}
      />

      <AllNotesSidebar
        isOpen={state.activeSidebar === 'notes'}
        onClose={() => handleSidebarToggle(null)}
        chatId={state.activeChat?.id}
      />

      <SearchSidebar
        isOpen={state.activeSidebar === 'search'}
        onClose={() => handleSidebarToggle(null)}
        chatId={state.activeChat?.id}
      />

      <AllGiftsSidebar
        isOpen={state.activeSidebar === 'gifts'}
        onClose={() => handleSidebarToggle(null)}
        chatId={state.activeChat?.id}
      />

      <AllGiftSalesSidebar
        isOpen={state.activeSidebar === 'gift-sales'}
        onClose={() => handleSidebarToggle(null)}
        chatId={state.activeChat?.id}
      />

    </div>
  )
}
