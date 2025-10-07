'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  Image,
  FileText,
  MapPin,
  Camera,
  Video,
  Contact,
  Plus,
  X,
  Tag,
  Ticket,
  Users,
  User,
  CircleDot,
  FileSignature,
  DollarSign,
  Calendar,
  Settings,
  Bot,
  Cpu,
  Zap,
  BarChart3,
  Globe,
  Gift,
  ShoppingCart,
  ArrowRightLeft,
  List as ListIcon,
  CalendarDays,
  ClipboardList
} from 'lucide-react'
import { CreateClientSheet } from './bottom-sheets/CreateClientSheet'
import { EditClientSheet } from './bottom-sheets/EditClientSheet'
import { CreateTicketSheet } from './bottom-sheets/CreateTicketSheet'
import { CreateScheduleSheet } from './bottom-sheets/CreateScheduleSheet'
import { CreateQuoteSheet } from './bottom-sheets/CreateQuoteSheet'
import { ManageTagsSheet } from './bottom-sheets/ManageTagsSheet'
import { CreateContractSheet } from './bottom-sheets/CreateContractSheet'
import { QuoteSidebar } from './sidebars/QuoteSidebar'
import { TagSidebar } from './sidebars/TagSidebar'
import { ContractSidebar } from './sidebars/ContractSidebar'
import { ClientProfileSidebar } from './ClientProfileSidebar'
import { ChangeQueueSheet } from './bottom-sheets/ChangeQueueSheet'
import { AIMessageModal } from './modals/AIMessageModal'
import { ScheduleSendModal } from './modals/ScheduleSendModal'
import { AssignAgentSheet } from './bottom-sheets/AssignAgentSheet'
import { ChangeStatusSheet } from './bottom-sheets/ChangeStatusSheet'
import { SendPollModal } from './modals/SendPollModal'
import { SendListModal } from './modals/SendListModal'
import { SendEventModal } from './modals/SendEventModal'
import { SendAudioModal } from './modals/SendAudioModal'
import { SendImageModal } from './modals/SendImageModal'
import { SendVideoModal } from './modals/SendVideoModal'
import { SendDocumentModal } from './modals/SendDocumentModal'
import { AgentSelectionModal } from './modals/AgentSelectionModal'
import { SendLocationModal } from './modals/SendLocationModal'
import { SendContactModal } from './modals/SendContactModal'
import { EmojiPicker } from './modals/EmojiPicker'
import { Chat } from '@/types/chat'
import { cn } from '@/lib/utils'
import { getAuthToken } from '@/lib/auth-token'
import type { SidebarType } from '@/app/chat/page'

interface FooterChatAreaProps {
  chat: Chat
  onSidebarToggle?: (sidebar: SidebarType) => void
}

export const FooterChatArea: React.FC<FooterChatAreaProps> = ({ chat, onSidebarToggle }) => {
  const [message, setMessage] = useState('')
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const [showActionsMenu, setShowActionsMenu] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [bottomSheetType, setBottomSheetType] = useState<string>('')
  const [clientExists, setClientExists] = useState<boolean | null>(null) // null = não verificado, true = existe, false = não existe
  const [clientData, setClientData] = useState<any>(null)
  const [showQuoteSidebar, setShowQuoteSidebar] = useState(false)
  const [showTagSidebar, setShowTagSidebar] = useState(false)
  const [showContractSidebar, setShowContractSidebar] = useState(false)
  const [showProfileSidebar, setShowProfileSidebar] = useState(false)
  const [showSalesModal, setShowSalesModal] = useState(false)
  const [isAgentActive, setIsAgentActive] = useState<boolean>(true) // Status do agente
  const [aiMode, setAiMode] = useState<'manual' | 'assistant' | 'auto'>('manual') // Modo da IA
  const [showAgentModal, setShowAgentModal] = useState(false)
  const [currentAgent, setCurrentAgent] = useState<any>(null)

  // Buscar agente atual do chat
  useEffect(() => {
    const fetchChatAgent = async () => {
      try {
        const token = getAuthToken()
        if (!token) return

        const response = await fetch(`/api/chats/${chat.id}/agent`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()

        if (data.success && data.agent) {
          setCurrentAgent(data.agent)
          setAiMode('auto') // Se tem agente, ativa modo auto
          setIsAgentActive(true)
          console.log(`🤖 Agente do chat: ${data.agent.name}`)
        } else {
          setCurrentAgent(null)
          setAiMode('manual')
          setIsAgentActive(false)
        }
      } catch (error) {
        console.error('❌ Erro ao buscar agente do chat:', error)
      }
    }

    fetchChatAgent()
  }, [chat.id])

  const [showPollModal, setShowPollModal] = useState(false)
  const [showListModal, setShowListModal] = useState(false)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showAudioModal, setShowAudioModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight
      const maxHeight = 120 // 5 linhas aproximadamente
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
    }
  }, [])

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setMessage(value)
    adjustTextareaHeight()
    
    // Indicador de digitação (simular)
    if (value.length > 0 && !isTyping) {
      setIsTyping(true)
      // Simular parar de digitar após 2 segundos
      setTimeout(() => setIsTyping(false), 2000)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const messageToSend = message.trim()
    setMessage('')
    
    // Reset textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      console.log('📤 Enviando mensagem:', messageToSend, 'para:', chat.id)
      
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId: chat.id,
          message: messageToSend,
          type: 'text'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const result = await response.json()
      console.log('✅ Mensagem enviada:', result.messageId)
      
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error)
      // Restaurar mensagem em caso de erro
      setMessage(messageToSend)
      alert('Erro ao enviar mensagem. Tente novamente.')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleBusinessAction = async (actionId: string) => {
    setShowActionsMenu(false)
    
    console.log('🔄 Ação business:', actionId, 'para chat:', chat.id)
    
    try {
      // Verificar se chatId já tem cliente no banco
      const response = await fetch(`/api/contacts/check-chat?chatId=${encodeURIComponent(chat.id)}`)
      const { exists, contact, isLeadFresco } = await response.json()
      
      // Atualizar estado do cliente
      setClientExists(!isLeadFresco)
      setClientData(contact)
      
      if (isLeadFresco) {
        // Lead fresco → Precisa converter para cliente primeiro
        console.log('💡 Lead fresco detectado - convertendo para cliente...')
        handleCreateClient(actionId)
      } else {
        // Cliente já existe → Executar ação diretamente
        console.log('✅ Cliente existente encontrado:', contact.name)
        console.log('📋 Resumo do cliente:', contact.summary || 'Sem resumo')
        handleClientAction(actionId, contact)
      }
    } catch (error) {
      console.error('❌ Erro ao verificar cliente:', error)
      // Em caso de erro, assume que é lead fresco
      handleCreateClient(actionId)
    }
  }

  const handleCreateClient = (nextAction: string) => {
    console.log('👤 Criando cliente a partir do chat:', chat.id)
    console.log('🎯 Próxima ação após criar cliente:', nextAction)
    
    // Abrir bottom sheet de criação de cliente
    setBottomSheetType('create-client')
    setShowBottomSheet(true)
    
    // TODO: Passar nextAction via contexto/state
    // Para executar após criar cliente
  }

  const handleClientAction = (actionId: string, contact?: any) => {
    console.log('⚡ Executando ação para cliente existente:', actionId)
    console.log('📋 Dados do cliente:', contact?.name || 'Desconhecido')
    
    // Abrir bottom sheet específico baseado na ação
    switch (actionId) {
      case 'convert':
        console.log('👤 Forçando conversão para cliente (já é cliente)')
        handleCreateClient('') // Força abertura do formulário
        break
      case 'edit-profile':
        console.log('✏️ Abrindo sidebar de perfil do cliente')
        setShowProfileSidebar(true)
        break
      case 'tag':
        console.log('🏷️ Abrindo sidebar para gerenciar tags')
        setShowTagSidebar(true)
        break
      case 'ticket':
        console.log('🎫 Abrindo bottom sheet para criar ticket')
        setBottomSheetType('create-ticket')
        setShowBottomSheet(true)
        break
      case 'queue':
        console.log('👥 Abrindo bottom sheet para alterar fila')
        setBottomSheetType('queue')
        setShowBottomSheet(true)
        break
      case 'agent':
        console.log('👤 Abrindo bottom sheet para atribuir atendente')
        setBottomSheetType('agent')
        setShowBottomSheet(true)
        break
      case 'status':
        console.log('🔘 Abrindo bottom sheet para alterar status')
        setBottomSheetType('status')
        setShowBottomSheet(true)
        break
      case 'contract':
        console.log('📋 Abrindo bottom sheet para criar contrato')
        setBottomSheetType('create-contract')
        setShowBottomSheet(true)
        break
      case 'quote':
      case 'create-quote':
        console.log('💰 Abrindo sidebar para criar orçamento')
        setShowQuoteSidebar(true)
        break
      case 'schedule':
        console.log('📅 Abrindo sidebar de agendamentos')
        onSidebarToggle?.('schedule')
        break
      case 'create-contract':
        console.log('📋 Abrindo sidebar para criar contrato')
        setShowContractSidebar(true)
        break
      case 'manage-tags':
        console.log('🏷️ Abrindo sidebar para gerenciar tags')
        onSidebarToggle?.('tag')
        break
      case 'create-ticket':
        console.log('🎫 Abrindo sidebar de tickets')
        onSidebarToggle?.('ticket')
        break
      case 'schedule-meeting':
        console.log('📅 Abrindo sidebar de agendamentos')
        onSidebarToggle?.('schedule')
        break
      case 'manage-costs':
        console.log('💰 Abrindo sidebar de custos e despesas')
        onSidebarToggle?.('expenses')
        break
      case 'client-site':
        console.log('🌐 Abrindo sidebar de site do cliente')
        onSidebarToggle?.('site')
        break
      case 'guest-list':
        console.log('👥 Abrindo sidebar de lista de convidados')
        onSidebarToggle?.('guests')
        break
      case 'gifts':
        console.log('🎁 Abrindo sidebar de presentes')
        onSidebarToggle?.('gifts')
        break
      case 'gift-sales':
        console.log('🛒 Abrindo sidebar de vendas de presentes')
        onSidebarToggle?.('gift-sales')
        break
      case 'notes':
        console.log('📝 Abrindo sidebar de anotações')
        onSidebarToggle?.('notes')
        break
      default:
        console.log('❌ Ação não implementada:', actionId)
    }
  }

  const handleFileUpload = (type: string) => {
    setShowAttachMenu(false)
    
    // Abrir modais para tipos especiais (sem arquivo)
  switch (type) {
      case 'poll':
        setShowPollModal(true)
        return
      case 'list':
        setShowListModal(true)
        return
      case 'event':
        setShowEventModal(true)
        return
      case 'audio':
        setShowAudioModal(true)
        return
      case 'location':
        setShowLocationModal(true)
        return
      case 'contact':
        setShowContactModal(true)
        return
      case 'image':
        setSelectedFile(null)
        setShowImageModal(true)
        return
      case 'video':
        setSelectedFile(null)
        setShowVideoModal(true)
        return
      case 'document':
        setSelectedFile(null)
        setShowDocumentModal(true)
        return
    }
    
    // Configurar input file baseado no tipo e abrir seletor
    const input = fileInputRef.current
    if (input) {
      // Armazenar tipo para usar no handleFileSelected
      input.dataset.fileType = type
      input.removeAttribute('capture')
      
      switch (type) {
        case 'image':
        case 'camera':
          input.accept = 'image/*'
          if (type === 'camera') {
            input.setAttribute('capture', 'environment')
          }
          break
        case 'video':
          input.accept = 'video/*'
          break
        case 'document':
          input.accept = '.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx'
          break
        default:
          input.accept = '*/*'
      }
      input.click()
    }
  }

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileType = e.target.dataset.fileType || ''
    console.log('📎 Arquivo selecionado:', file.name, file.size, file.type, 'Tipo:', fileType)

    // Armazenar arquivo e abrir modal apropriado
    setSelectedFile(file)

    // Determinar qual modal abrir baseado no tipo
    if (file.type.startsWith('image/')) {
      setShowImageModal(true)
    } else if (file.type.startsWith('video/')) {
      setShowVideoModal(true)
    } else {
      setShowDocumentModal(true)
    }

    // Limpar input
    e.target.value = ''
  }

  // Função auxiliar para enviar arquivo com upload
  const sendFileWithUpload = async (file: File, caption: string = '') => {
    try {
      // 1. Upload do arquivo
      const formData = new FormData()
      formData.append('file', file)
      formData.append('chatId', chat.id)

      console.log('⬆️ Fazendo upload do arquivo...')
      const uploadResponse = await fetch('/api/messages/upload', {
        method: 'POST',
        body: formData
      })

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json()
        throw new Error(error.error || 'Erro ao fazer upload')
      }

      const uploadResult = await uploadResponse.json()
      console.log('✅ Upload concluído:', uploadResult.data)

      // 2. Enviar via WAHA
      const { fileUrl, mediaType, fileName } = uploadResult.data

      console.log('📤 Enviando via WAHA...')
      const sendResponse = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId: chat.id,
          message: caption || fileName,
          type: mediaType,
          mediaUrl: fileUrl,
          fileName: fileName,
          caption: caption
        })
      })

      if (!sendResponse.ok) {
        throw new Error('Erro ao enviar mensagem')
      }

      const sendResult = await sendResponse.json()
      console.log('✅ Arquivo enviado com sucesso:', sendResult.messageId)
      
      alert(`✅ ${mediaType === 'image' ? 'Imagem' : mediaType === 'video' ? 'Vídeo' : mediaType === 'audio' ? 'Áudio' : 'Documento'} enviado com sucesso!`)

    } catch (error) {
      console.error('❌ Erro ao enviar arquivo:', error)
      alert(`Erro ao enviar arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  // Ações para LEAD FRESCO (não é cliente ainda)
  const leadActions = [
    {
      id: 'convert',
      icon: User,
      label: 'Converter Lead',
      color: 'text-emerald-500',
      bg: 'bg-emerald-100 dark:bg-emerald-900/30'
    }
  ]

  // Ações para CLIENTE EXISTENTE
  const clientActions = [
    {
      id: 'edit-profile',
      icon: User,
      label: 'Editar Perfil',
      color: 'text-emerald-500',
      bg: 'bg-emerald-100 dark:bg-emerald-900/30'
    },
    {
      id: 'tag',
      icon: Tag,
      label: 'Gerenciar Tags',
      color: 'text-orange-500',
      bg: 'bg-orange-100 dark:bg-orange-900/30'
    },
    {
      id: 'ticket',
      icon: Ticket,
      label: 'Criar Ticket',
      color: 'text-red-500',
      bg: 'bg-red-100 dark:bg-red-900/30'
    },
    {
      id: 'schedule',
      icon: Calendar,
      label: 'Agendar Reunião',
      color: 'text-cyan-500',
      bg: 'bg-cyan-100 dark:bg-cyan-900/30'
    },
    {
      id: 'quote',
      icon: DollarSign,
      label: 'Criar Orçamento',
      color: 'text-yellow-500',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
      id: 'contract',
      icon: FileSignature,
      label: 'Criar Contrato',
      color: 'text-indigo-500',
      bg: 'bg-indigo-100 dark:bg-indigo-900/30'
    },
    {
      id: 'queue',
      icon: Users,
      label: 'Alterar Fila',
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      id: 'agent',
      icon: User,
      label: 'Atribuir Atendente',
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      id: 'status',
      icon: CircleDot,
      label: 'Alterar Status',
      color: 'text-purple-500',
      bg: 'bg-purple-100 dark:bg-purple-900/30'
    }
  ]

  // Selecionar ações com base no estado do cliente
  const businessActions = clientExists === true ? clientActions : leadActions

  const attachmentOptions = [
    {
      id: 'image',
      icon: Image,
      label: 'Foto',
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      id: 'camera',
      icon: Camera,
      label: 'Câmera',
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      id: 'video',
      icon: Video,
      label: 'Vídeo',
      color: 'text-purple-500',
      bg: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      id: 'audio',
      icon: Mic,
      label: 'Áudio',
      color: 'text-red-500',
      bg: 'bg-red-100 dark:bg-red-900/30'
    },
    {
      id: 'document',
      icon: FileText,
      label: 'Documento',
      color: 'text-orange-500',
      bg: 'bg-orange-100 dark:bg-orange-900/30'
    },
    {
      id: 'location',
      icon: MapPin,
      label: 'Local',
      color: 'text-yellow-500',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
      id: 'contact',
      icon: Contact,
      label: 'Contato',
      color: 'text-indigo-500',
      bg: 'bg-indigo-100 dark:bg-indigo-900/30'
    },
    {
      id: 'poll',
      icon: BarChart3,
      label: 'Enquete',
      color: 'text-pink-500',
      bg: 'bg-pink-100 dark:bg-pink-900/30'
    },
    {
      id: 'list',
      icon: ListIcon,
      label: 'Lista',
      color: 'text-cyan-500',
      bg: 'bg-cyan-100 dark:bg-cyan-900/30'
    },
    {
      id: 'event',
      icon: CalendarDays,
      label: 'Evento',
      color: 'text-rose-500',
      bg: 'bg-rose-100 dark:bg-rose-900/30'
    }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
      {/* Menu de Anexos */}
      {showAttachMenu && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Paperclip className="w-4 h-4" />
              Anexar arquivo
            </h3>
            <button
              onClick={() => setShowAttachMenu(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {attachmentOptions.map((option) => {
              const Icon = option.icon
              return (
                <motion.button
                  key={option.id}
                  onClick={() => handleFileUpload(option.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-2.5 rounded-lg transition-all border border-transparent hover:border-gray-300 dark:hover:border-gray-600',
                    option.bg
                  )}
                >
                  <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', option.bg)}>
                    <Icon className={cn('w-4 h-4', option.color)} />
                  </div>
                  <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                    {option.label}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Menu de Ações Business */}
      {showActionsMenu && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="mb-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden"
        >
          {/* Header Minimalista */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
              Ações Rápidas
            </h3>
            <button
              onClick={() => setShowActionsMenu(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Grid de Ações - 6 colunas compactas */}
          <div className="grid grid-cols-6 gap-1 p-2">
            {/* Editar Perfil */}
            <motion.button
              onClick={() => handleBusinessAction('edit-profile')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              title="Editar Perfil"
            >
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-1 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                Perfil
              </span>
            </motion.button>

            {/* Gerenciar Tags */}
            <motion.button
              onClick={() => handleBusinessAction('manage-tags')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              title="Gerenciar Tags"
            >
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-1 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                Tags
              </span>
            </motion.button>

            {/* Criar Ticket */}
            <motion.button
              onClick={() => handleBusinessAction('create-ticket')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              title="Criar Ticket"
            >
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-1 group-hover:bg-red-200 dark:group-hover:bg-red-800/50 transition-colors">
                <Ticket className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                Ticket
              </span>
            </motion.button>

            {/* Agendar Reunião */}
            <motion.button
              onClick={() => handleBusinessAction('schedule-meeting')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              title="Agendar Reunião"
            >
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-1 group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
                <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                Reunião
              </span>
            </motion.button>

            {/* Criar Orçamento */}
            <motion.button
              onClick={() => handleBusinessAction('create-quote')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              title="Criar Orçamento"
            >
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-1 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800/50 transition-colors">
                <FileText className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                Orçamento
              </span>
            </motion.button>

            {/* Criar Contrato */}
            <motion.button
              onClick={() => handleBusinessAction('create-contract')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              title="Criar Contrato"
            >
              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-1 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-colors">
                <FileSignature className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                Contrato
              </span>
            </motion.button>

            {/* Custos/Despesas */}
            <motion.button
              onClick={() => handleBusinessAction('manage-costs')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              title="Custos e Despesas"
            >
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-1 group-hover:bg-orange-200 dark:group-hover:bg-orange-800/50 transition-colors">
                <DollarSign className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                Custos
              </span>
            </motion.button>

            {/* Site do Cliente */}
            <motion.button
              onClick={() => handleBusinessAction('client-site')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              title="Site do Cliente"
            >
              <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-1 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800/50 transition-colors">
                <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                Site
              </span>
            </motion.button>

            {/* Lista de Convidados */}
            <motion.button
              onClick={() => handleBusinessAction('guest-list')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              title="Lista de Convidados"
            >
              <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mb-1 group-hover:bg-pink-200 dark:group-hover:bg-pink-800/50 transition-colors">
                <Users className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              </div>
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                Convidados
              </span>
            </motion.button>

            {/* Presentes */}
            <motion.button
              onClick={() => handleBusinessAction('gifts')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              title="Lista de Presentes"
            >
              <div className="w-8 h-8 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center mb-1 group-hover:bg-rose-200 dark:group-hover:bg-rose-800/50 transition-colors">
                <Gift className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              </div>
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                Presentes
              </span>
            </motion.button>

            {/* Venda de Presentes */}
            <motion.button
              onClick={() => handleBusinessAction('gift-sales')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              title="Venda de Presentes"
            >
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-1 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition-colors">
                <ShoppingCart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                Vendas
              </span>
            </motion.button>

            {/* Anotações */}
            <motion.button
              onClick={() => handleBusinessAction('notes')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              title="Anotações"
            >
              <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-1 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800/50 transition-colors">
                <ClipboardList className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                Anotações
              </span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Área de Input */}
      <div className="flex items-end space-x-3">
        {/* Botão de Anexos */}
        <motion.button
          onClick={() => {
            setShowAttachMenu(!showAttachMenu)
            if (showActionsMenu) setShowActionsMenu(false)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'p-3 rounded-full transition-colors',
            showAttachMenu
              ? 'bg-orange-500 text-white'
              : 'bg-orange-50/50 dark:bg-orange-900/10 text-orange-400/70 hover:text-orange-600 dark:text-orange-400/60 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20'
          )}
          title="Anexar arquivo"
        >
          {showAttachMenu ? (
            <X className="w-5 h-5" />
          ) : (
            <Paperclip className="w-5 h-5" />
          )}
        </motion.button>

        {/* Botão de Ações Business */}
        <motion.button
          onClick={() => {
            setShowActionsMenu(!showActionsMenu)
            if (showAttachMenu) setShowAttachMenu(false)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'p-3 rounded-full transition-colors',
            showActionsMenu
              ? 'bg-purple-500 text-white'
              : 'bg-purple-50/50 dark:bg-purple-900/10 text-purple-400/70 hover:text-purple-600 dark:text-purple-400/60 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
          )}
          title="Ações business"
        >
          {showActionsMenu ? (
            <X className="w-5 h-5" />
          ) : (
            <Settings className="w-5 h-5" />
          )}
        </motion.button>

        {/* Botão Enviar com I.A */}
        <motion.button
          onClick={() => setShowAIModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-blue-50/50 dark:bg-blue-900/10 text-blue-400/70 hover:text-blue-600 dark:text-blue-400/60 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors relative group"
          title="Enviar com I.A"
        >
          <Bot className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        </motion.button>

        {/* Botão Agendar Envio */}
        <motion.button
          onClick={() => setShowScheduleModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-green-50/50 dark:bg-green-900/10 text-green-400/70 hover:text-green-600 dark:text-green-400/60 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors relative group"
          title="Agendar envio"
        >
          <CalendarDays className="w-5 h-5" />
        </motion.button>

        {/* Input de Mensagem */}
        <div className="flex-1 relative">
          <div className="flex items-end bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleMessageChange}
              onKeyPress={handleKeyPress}
              placeholder="Digite uma mensagem..."
              className="flex-1 bg-transparent border-0 outline-none resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm leading-5 py-1.5 max-h-[120px] overflow-y-auto"
              rows={1}
              style={{ minHeight: '24px' }}
            />

            {/* Emoji */}
            <div className="relative">
              <motion.button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "p-1 transition-colors ml-2",
                  showEmojiPicker 
                    ? "text-blue-500" 
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                )}
              >
                <Smile className="w-5 h-5" />
              </motion.button>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <EmojiPicker
                  isOpen={showEmojiPicker}
                  onClose={() => setShowEmojiPicker(false)}
                  onSelect={(emoji) => {
                    setMessage(prev => prev + emoji)
                    // Focar no textarea após inserir emoji
                    setTimeout(() => textareaRef.current?.focus(), 0)
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Botão de Gravação de Áudio */}
        <motion.button
          onClick={() => setShowAudioModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          title="Enviar áudio"
        >
          <Mic className="w-5 h-5" />
        </motion.button>

        {/* Botão de IA/Agente */}
        <motion.button
          onClick={() => setShowAgentModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'relative p-3 rounded-full transition-colors',
            currentAgent ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700' : 'bg-gray-500 text-white hover:bg-gray-600'
          )}
          title={currentAgent ? `🤖 Agente: ${currentAgent.name}` : "🧑 Modo Manual - Clique para selecionar agente"}
        >
          {/* Ícone baseado no agente */}
          {currentAgent ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
          
          {/* Pin indicador verde quando tem agente */}
          {currentAgent && (
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white bg-green-500 animate-pulse" />
          )}
        </motion.button>

        {/* Botão de Envio de Mensagem */}
        <motion.button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          whileHover={{ scale: message.trim() ? 1.05 : 1 }}
          whileTap={{ scale: message.trim() ? 0.95 : 1 }}
          className={cn(
            'p-3 rounded-full transition-colors',
            message.trim()
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          )}
          title={message.trim() ? "Enviar mensagem" : "Digite algo para enviar"}
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Input file escondido */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelected}
        className="hidden"
      />
      
      {/* Status de digitação do outro usuário */}
      {chat.contact?.isOnline && isTyping && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-4 mb-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400"
        >
          {chat.name} está digitando...
        </motion.div>
      )}

      {/* Bottom Sheet Overlay */}
      {showBottomSheet && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => setShowBottomSheet(false)}
        >
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Bottom Sheet */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {bottomSheetType === 'create-client' && 'Converter Lead para Cliente'}
                  {bottomSheetType === 'edit-client' && 'Editar Perfil do Cliente'}
                  {bottomSheetType === 'create-ticket' && 'Criar Ticket'}
                  {bottomSheetType === 'create-schedule' && 'Agendar Reunião'}
                  {bottomSheetType === 'create-quote' && 'Criar Orçamento'}
                  {bottomSheetType === 'add-tag' && 'Gerenciar Tags'}
                  {bottomSheetType === 'create-contract' && 'Criar Contrato'}
                  {bottomSheetType === 'queue' && 'Alterar Fila'}
                  {bottomSheetType === 'agent' && 'Atribuir Atendente'}
                  {bottomSheetType === 'status' && 'Alterar Status'}
                </h2>
                <button
                  onClick={() => setShowBottomSheet(false)}
                  className="p-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Drag handle */}
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-2"></div>
            </div>

            {/* Conteúdo do Bottom Sheet */}
            <div className="p-6">
              {bottomSheetType === 'create-client' ? (
                <CreateClientSheet 
                  chat={chat} 
                  onClose={() => setShowBottomSheet(false)} 
                />
              
              ) : bottomSheetType === 'edit-client' ? (
                <EditClientSheet 
                  chat={chat} 
                  clientData={clientData}
                  onClose={() => setShowBottomSheet(false)} 
                />

              ) : bottomSheetType === 'create-ticket' ? (
                <CreateTicketSheet 
                  chat={chat} 
                  clientData={clientData}
                  onClose={() => setShowBottomSheet(false)} 
                />

              ) : bottomSheetType === 'create-schedule' ? (
                <CreateScheduleSheet 
                  chat={chat} 
                  clientData={clientData}
                  onClose={() => setShowBottomSheet(false)} 
                />

              ) : bottomSheetType === 'create-quote' ? (
                <CreateQuoteSheet 
                  chat={chat} 
                  clientData={clientData}
                  onClose={() => setShowBottomSheet(false)} 
                />

              ) : bottomSheetType === 'add-tag' ? (
                <ManageTagsSheet 
                  chat={chat} 
                  clientData={clientData}
                  onClose={() => setShowBottomSheet(false)} 
                />

              ) : bottomSheetType === 'create-contract' ? (
                <CreateContractSheet 
                  chat={chat} 
                  clientData={clientData}
                  onClose={() => setShowBottomSheet(false)} 
                />

              ) : bottomSheetType === 'queue' ? (
                <ChangeQueueSheet 
                  chat={chat} 
                  clientData={clientData}
                  onClose={() => setShowBottomSheet(false)} 
                />

              ) : bottomSheetType === 'agent' ? (
                <AssignAgentSheet 
                  chat={chat} 
                  clientData={clientData}
                  onClose={() => setShowBottomSheet(false)} 
                />

              ) : bottomSheetType === 'status' ? (
                <ChangeStatusSheet 
                  chat={chat} 
                  clientData={clientData}
                  onClose={() => setShowBottomSheet(false)} 
                />

              // ========================================
              // ⚠️ FALLBACK PARA OUTROS CASOS
              // ========================================
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Funcionalidade em Desenvolvimento
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    Tipo: {bottomSheetType}
                  </p>
                  <button
                    onClick={() => setShowBottomSheet(false)}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              )}

              {/* CÓDIGO ANTIGO REMOVIDO - AGORA SÃO COMPONENTES SEPARADOS */}
              {false && bottomSheetType === 'OLD-create-ticket' ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Ticket className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Criar Ticket de Suporte
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Abra um ticket para acompanhar este atendimento
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Título do Ticket *
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Ex: Problema com produto X"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Prioridade
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white">
                          <option value="low">Baixa</option>
                          <option value="normal" selected>Normal</option>
                          <option value="high">Alta</option>
                          <option value="urgent">Urgente</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Categoria
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white">
                          <option value="">Selecionar...</option>
                          <option value="technical">Técnico</option>
                          <option value="billing">Financeiro</option>
                          <option value="general">Geral</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Descrição
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Descreva o problema ou solicitação..."
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setShowBottomSheet(false)}
                      className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        console.log('🎫 Criando ticket...')
                        setShowBottomSheet(false)
                        // TODO: Implementar criação de ticket
                      }}
                      className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      Criar Ticket
                    </button>
                  </div>
                </div>

              // ========================================
              // 📅 CRIAR AGENDAMENTO
              // ========================================
              ) : bottomSheetType === 'create-schedule' ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Agendar Reunião
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Marque um horário para conversar com este contato
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Título *
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Ex: Reunião de briefing"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Data *
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Horário *
                        </label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Duração (min)
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                          <option value="30">30 min</option>
                          <option value="60" selected>1 hora</option>
                          <option value="90">1h 30min</option>
                          <option value="120">2 horas</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Local/Link
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Endereço ou link da reunião"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setShowBottomSheet(false)}
                      className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        console.log('📅 Criando agendamento...')
                        setShowBottomSheet(false)
                        // TODO: Implementar criação de agendamento
                      }}
                      className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      Agendar
                    </button>
                  </div>
                </div>

              // ========================================
              // 💰 CRIAR ORÇAMENTO
              // ========================================
              ) : bottomSheetType === 'create-quote' ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Criar Orçamento
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Prepare uma proposta comercial para este cliente
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Título do Orçamento *
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Ex: Decoração Casamento"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Valor (R$) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Válido até
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Descrição dos Serviços
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Descreva os serviços inclusos no orçamento..."
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setShowBottomSheet(false)}
                      className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        console.log('💰 Criando orçamento...')
                        setShowBottomSheet(false)
                        // TODO: Implementar criação de orçamento
                      }}
                      className="flex-1 px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                    >
                      Criar Orçamento
                    </button>
                  </div>
                </div>

              // ========================================
              // 🏷️ ADICIONAR TAG
              // ========================================
              ) : bottomSheetType === 'add-tag' ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Tag className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Adicionar Tags
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Organize e categorize este contato com tags
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tags Sugeridas
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['VIP', 'Interessado', 'Casamento', 'Formatura', 'Corporativo', 'Urgente'].map(tag => (
                          <button
                            key={tag}
                            className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 transition-colors border border-orange-200"
                          >
                            + {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nova Tag
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Digite o nome da tag..."
                        />
                        <input
                          type="color"
                          defaultValue="#f97316"
                          className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tags Atuais
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                          WhatsApp <X className="w-3 h-3 ml-1 cursor-pointer hover:text-blue-600" />
                        </span>
                        <span className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                          Lead Qualificado <X className="w-3 h-3 ml-1 cursor-pointer hover:text-green-600" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setShowBottomSheet(false)}
                      className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        console.log('🏷️ Salvando tags...')
                        setShowBottomSheet(false)
                        // TODO: Implementar adição de tags
                      }}
                      className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                      Salvar Tags
                    </button>
                  </div>
                </div>

              // ========================================
              // ✏️ EDITAR PERFIL DO CLIENTE
              // ========================================
              ) : bottomSheetType === 'edit-client' ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Editar Perfil do Cliente
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Atualize as informações do cliente {clientData?.name || 'desconhecido'}
                    </p>
                  </div>

                  {/* Status atual do cliente */}
                  {clientData && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                        📊 Status Atual
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="font-medium">Status:</span> {clientData.status}</div>
                        <div><span className="font-medium">Criado:</span> {new Date(clientData.createdAt).toLocaleDateString('pt-BR')}</div>
                      </div>
                    </div>
                  )}

                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          name="name"
                          defaultValue={clientData?.name || ''}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          defaultValue={clientData?.email || ''}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          CPF/CNPJ
                        </label>
                        <input
                          type="text"
                          name="document"
                          defaultValue={clientData?.document || ''}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Empresa
                        </label>
                        <input
                          type="text"
                          name="company"
                          defaultValue={clientData?.company || ''}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Observações
                      </label>
                      <textarea
                        rows={3}
                        name="notes"
                        defaultValue={clientData?.notes || ''}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Anotações sobre o cliente..."
                      />
                    </div>
                  </form>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setShowBottomSheet(false)}
                      className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        console.log('💾 Salvando alterações do cliente...')
                        setShowBottomSheet(false)
                        alert('✅ Perfil atualizado com sucesso!')
                        // TODO: Implementar API de atualização
                      }}
                      className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </div>

              // ========================================
              // 🎯 OUTROS BOTTOM SHEETS
              // ========================================  
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {bottomSheetType === 'change-queue' && 'Alterar Fila'}
                    {bottomSheetType === 'assign-agent' && 'Atribuir Agente'}
                    {bottomSheetType === 'change-status' && 'Alterar Status'}
                    {bottomSheetType === 'create-contract' && 'Criar Contrato'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    Funcionalidade em desenvolvimento
                  </p>
                  <button
                    onClick={() => setShowBottomSheet(false)}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modais de Envio */}
      <SendPollModal
        isOpen={showPollModal}
        onClose={() => setShowPollModal(false)}
        onSend={async (pollData) => {
          console.log('📊 Enviando enquete:', pollData)
          
          try {
            const response = await fetch('/api/messages/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chatId: chat.id,
                message: pollData.question,
                type: 'poll',
                pollData: pollData
              })
            })

            if (!response.ok) throw new Error('Erro ao enviar enquete')
            
            alert('✅ Enquete enviada com sucesso!')
          } catch (error) {
            console.error('Erro ao enviar enquete:', error)
            alert('Erro ao enviar enquete')
          }
        }}
        chatName={chat.name}
      />

      <SendListModal
        isOpen={showListModal}
        onClose={() => setShowListModal(false)}
        onSend={async (listData) => {
          console.log('📋 Enviando lista:', listData)
          
          try {
            const response = await fetch('/api/messages/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chatId: chat.id,
                message: listData.title || 'Lista',
                type: 'list',
                listData: listData
              })
            })

            if (!response.ok) throw new Error('Erro ao enviar lista')
            
            alert('✅ Lista enviada com sucesso!')
          } catch (error) {
            console.error('Erro ao enviar lista:', error)
            alert('Erro ao enviar lista')
          }
        }}
        chatName={chat.name}
      />

      <SendEventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSend={async (eventData) => {
          console.log('📅 Enviando evento:', eventData)
          
          try {
            const response = await fetch('/api/messages/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chatId: chat.id,
                message: eventData.title || 'Evento',
                type: 'event',
                eventData: eventData
              })
            })

            if (!response.ok) throw new Error('Erro ao enviar evento')
            
            alert('✅ Evento enviado com sucesso!')
          } catch (error) {
            console.error('Erro ao enviar evento:', error)
            alert('Erro ao enviar evento')
          }
        }}
        chatName={chat.name}
      />

      <SendAudioModal
        isOpen={showAudioModal}
        onClose={() => setShowAudioModal(false)}
        onSend={async (audioBlob, duration) => {
          console.log('🎤 Enviando áudio:', { size: audioBlob.size, duration })
          
          try {
            // Converter blob para file
            const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' })
            await sendFileWithUpload(audioFile, '')
          } catch (error) {
            console.error('Erro ao enviar áudio:', error)
            alert('Erro ao enviar áudio')
          }
        }}
        chatName={chat.name}
      />

      {/* Modais de Arquivo com Preview */}
      <SendImageModal
        isOpen={showImageModal}
        onClose={() => {
          setShowImageModal(false)
          setSelectedFile(null)
        }}
        onSend={async (file, caption) => {
          await sendFileWithUpload(file, caption)
          setSelectedFile(null)
        }}
        file={selectedFile}
        chatName={chat.name}
        onFileChange={setSelectedFile}
      />

      <SendVideoModal
        isOpen={showVideoModal}
        onClose={() => {
          setShowVideoModal(false)
          setSelectedFile(null)
        }}
        onSend={async (file, caption) => {
          await sendFileWithUpload(file, caption)
          setSelectedFile(null)
        }}
        file={selectedFile}
        chatName={chat.name}
        onFileChange={setSelectedFile}
      />

      <SendDocumentModal
        isOpen={showDocumentModal}
        onClose={() => {
          setShowDocumentModal(false)
          setSelectedFile(null)
        }}
        onSend={async (file, caption) => {
          await sendFileWithUpload(file, caption)
          setSelectedFile(null)
        }}
        file={selectedFile}
        chatName={chat.name}
        onFileChange={setSelectedFile}
      />

      {/* Modais de Localização e Contato */}
      <SendLocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSend={async (locationData) => {
          console.log('📍 Enviando localização:', locationData)
          
          try {
            const response = await fetch('/api/messages/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chatId: chat.id,
                message: locationData.name || 'Localização',
                type: 'location',
                latitude: locationData.latitude,
                longitude: locationData.longitude
              })
            })

            if (!response.ok) throw new Error('Erro ao enviar localização')
            
            alert('✅ Localização enviada com sucesso!')
          } catch (error) {
            console.error('Erro ao enviar localização:', error)
            alert('Erro ao enviar localização')
          }
        }}
        chatName={chat.name}
      />

      <SendContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSend={async (contactData) => {
          console.log('👤 Enviando contato:', contactData)
          
          try {
            const response = await fetch('/api/messages/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chatId: chat.id,
                message: contactData.name,
                type: 'contact',
                contactName: contactData.name,
                contactPhone: contactData.phone
              })
            })

            if (!response.ok) throw new Error('Erro ao enviar contato')
            
            alert('✅ Contato enviado com sucesso!')
          } catch (error) {
            console.error('Erro ao enviar contato:', error)
            alert('Erro ao enviar contato')
          }
        }}
        chatName={chat.name}
      />

      {/* Quote Sidebar */}
      <QuoteSidebar
        isOpen={showQuoteSidebar}
        onClose={() => setShowQuoteSidebar(false)}
        chatId={chat.id}
        contactId={clientData?.id}
        contactName={clientData?.name || chat.name}
      />

      {/* Tag Sidebar */}
      <TagSidebar
        isOpen={showTagSidebar}
        onClose={() => setShowTagSidebar(false)}
        chatId={chat.id}
        contactId={clientData?.id}
        contactName={clientData?.name || chat.name}
      />

      {/* Contract Sidebar */}
      <ContractSidebar
        isOpen={showContractSidebar}
        onClose={() => setShowContractSidebar(false)}
        chatId={chat.id}
        contactId={clientData?.id}
        contactName={clientData?.name || chat.name}
      />

      {/* Client Profile Sidebar */}
      <ClientProfileSidebar
        isOpen={showProfileSidebar}
        onClose={() => setShowProfileSidebar(false)}
        chatId={chat.id}
        contactName={chat.name}
        contactPhone={chat.id}
      />

      {/* Agent Selection Modal */}
      <AgentSelectionModal
        isOpen={showAgentModal}
        onClose={() => setShowAgentModal(false)}
        onSelect={(agent) => {
          setCurrentAgent(agent)
          if (agent) {
            setAiMode('auto')
            setIsAgentActive(true)
          } else {
            setAiMode('manual')
            setIsAgentActive(false)
          }
        }}
        currentAgent={currentAgent}
        chatId={chat.id}
      />

      {/* AI Message Modal */}
      <AIMessageModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onSend={(aiMessage) => {
          setMessage(aiMessage)
          setShowAIModal(false)
        }}
        initialMessage={message}
        contactName={chat.name}
      />

      {/* Schedule Send Modal */}
      <ScheduleSendModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={(date, time, items) => {
          console.log('Agendamento:', { date, time, items })
          alert(`Envio agendado para ${date} às ${time} com ${items.length} itens`)
          setShowScheduleModal(false)
        }}
        contactName={chat.name}
      />

    </div>
  )
}
