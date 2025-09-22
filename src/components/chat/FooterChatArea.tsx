'use client'

import React, { useState, useRef, useCallback } from 'react'
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
  Zap
} from 'lucide-react'
import { CreateClientSheet } from './bottom-sheets/CreateClientSheet'
import { EditClientSheet } from './bottom-sheets/EditClientSheet'
import { CreateTicketSheet } from './bottom-sheets/CreateTicketSheet'
import { CreateScheduleSheet } from './bottom-sheets/CreateScheduleSheet'
import { CreateQuoteSheet } from './bottom-sheets/CreateQuoteSheet'
import { ManageTagsSheet } from './bottom-sheets/ManageTagsSheet'
import { CreateContractSheet } from './bottom-sheets/CreateContractSheet'
import { ChangeQueueSheet } from './bottom-sheets/ChangeQueueSheet'
import { AssignAgentSheet } from './bottom-sheets/AssignAgentSheet'
import { ChangeStatusSheet } from './bottom-sheets/ChangeStatusSheet'
import { Chat } from '@/types/chat'
import { cn } from '@/lib/utils'

interface FooterChatAreaProps {
  chat: Chat
}

export const FooterChatArea: React.FC<FooterChatAreaProps> = ({ chat }) => {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const [showActionsMenu, setShowActionsMenu] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [bottomSheetType, setBottomSheetType] = useState<string>('')
  const [clientExists, setClientExists] = useState<boolean | null>(null) // null = não verificado, true = existe, false = não existe
  const [clientData, setClientData] = useState<any>(null)
  const [isAgentActive, setIsAgentActive] = useState<boolean>(true) // Status do agente
  const [aiMode, setAiMode] = useState<'manual' | 'assistant' | 'auto'>('manual') // Modo da IA
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
      // Aqui integrará com WAHA
      console.log('Enviando mensagem:', messageToSend, 'para:', chat.id)
      
      // Simular envio
      // await sendMessage(chat.id, messageToSend)
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      // Restaurar mensagem em caso de erro
      setMessage(messageToSend)
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
        console.log('✏️ Abrindo edição de perfil do cliente')
        setBottomSheetType('edit-client')
        setShowBottomSheet(true)
        break
      case 'tag':
        console.log('🏷️ Abrindo bottom sheet para adicionar tag')
        setBottomSheetType('add-tag')
        setShowBottomSheet(true)
        break
      case 'ticket':
        console.log('🎫 Abrindo bottom sheet para criar ticket')
        setBottomSheetType('create-ticket')
        setShowBottomSheet(true)
        break
      case 'queue':
        console.log('👥 Abrindo bottom sheet para alterar fila')
        setBottomSheetType('change-queue')
        setShowBottomSheet(true)
        break
      case 'agent':
        console.log('👤 Abrindo bottom sheet para atribuir atendente')
        setBottomSheetType('assign-agent')
        setShowBottomSheet(true)
        break
      case 'status':
        console.log('🔘 Abrindo bottom sheet para alterar status')
        setBottomSheetType('change-status')
        setShowBottomSheet(true)
        break
      case 'contract':
        console.log('📋 Abrindo bottom sheet para criar contrato')
        setBottomSheetType('create-contract')
        setShowBottomSheet(true)
        break
      case 'quote':
        console.log('💰 Abrindo bottom sheet para criar orçamento')
        setBottomSheetType('create-quote')
        setShowBottomSheet(true)
        break
      case 'schedule':
        console.log('📅 Abrindo bottom sheet para agendar')
        setBottomSheetType('create-schedule')
        setShowBottomSheet(true)
        break
      default:
        console.log('❌ Ação não implementada:', actionId)
    }
  }

  const handleFileUpload = (type: string) => {
    setShowAttachMenu(false)
    
    // Configurar input file baseado no tipo
    const input = fileInputRef.current
    if (input) {
      switch (type) {
        case 'image':
          input.accept = 'image/*'
          break
        case 'video':
          input.accept = 'video/*'
          break
        case 'audio':
          input.accept = 'audio/*'
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
    if (file) {
      console.log('Arquivo selecionado:', file.name, file.size, file.type)
      // Aqui processaria o arquivo e enviaria via WAHA
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    console.log('Iniciando gravação de áudio...')
    // Implementar gravação de áudio
  }

  const stopRecording = () => {
    setIsRecording(false)
    console.log('Parando gravação de áudio...')
    // Implementar parar gravação
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
      color: 'text-red-500',
      bg: 'bg-red-100 dark:bg-red-900/30'
    },
    {
      id: 'contact',
      icon: Contact,
      label: 'Contato',
      color: 'text-indigo-500',
      bg: 'bg-indigo-100 dark:bg-indigo-900/30'
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
          className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Anexar arquivo
            </h3>
            <button
              onClick={() => setShowAttachMenu(false)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {attachmentOptions.map((option) => {
              const Icon = option.icon
              return (
                <motion.button
                  key={option.id}
                  onClick={() => handleFileUpload(option.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'flex flex-col items-center p-3 rounded-xl transition-colors hover:bg-white dark:hover:bg-gray-600',
                    option.bg
                  )}
                >
                  <Icon className={cn('w-6 h-6 mb-2', option.color)} />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
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
          className="mb-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl border border-purple-200 dark:border-purple-700"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Ações Business
            </h3>
            <button
              onClick={() => setShowActionsMenu(false)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {businessActions.map((action) => {
              const Icon = action.icon
              return (
                <motion.button
                  key={action.id}
                  onClick={() => handleBusinessAction(action.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'flex flex-col items-center p-3 rounded-xl transition-colors hover:bg-white dark:hover:bg-gray-600',
                    action.bg
                  )}
                >
                  <Icon className={cn('w-6 h-6 mb-2', action.color)} />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                    {action.label}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Área de Input */}
      <div className="flex items-end space-x-3">
        {/* Botão de Anexo */}
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
              ? 'bg-blue-500 text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
          onClick={async () => {
            console.log('🔍 Verificando status do cliente...')
            
            // Verificar status do cliente antes de mostrar menu
            try {
              const response = await fetch(`/api/contacts/check-chat?chatId=${encodeURIComponent(chat.id)}`)
              const { exists, contact, isLeadFresco } = await response.json()
              
              // Atualizar estado
              setClientExists(!isLeadFresco)
              setClientData(contact)
              
              console.log('📊 Status:', isLeadFresco ? 'Lead Fresco' : 'Cliente Existente')
              if (!isLeadFresco && contact) {
                console.log('👤 Cliente:', contact.name)
                console.log('📋 Status:', contact.status)
              }
            } catch (error) {
              console.error('❌ Erro ao verificar cliente:', error)
              setClientExists(false) // Assume lead fresco em caso de erro
            }
            
            setShowActionsMenu(!showActionsMenu)
            if (showAttachMenu) setShowAttachMenu(false)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'p-3 rounded-full transition-colors',
            showActionsMenu
              ? 'bg-purple-500 text-white'
              : 'text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
          )}
          title="Ações business"
        >
          {showActionsMenu ? (
            <X className="w-5 h-5" />
          ) : (
            <Settings className="w-5 h-5" />
          )}
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
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors ml-2"
            >
              <Smile className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Botão de Gravação de Áudio */}
        <motion.button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onMouseLeave={stopRecording}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'p-3 rounded-full transition-colors',
            isRecording
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-500'
          )}
          title="Gravar áudio (segure para gravar)"
        >
          <Mic className="w-5 h-5" />
        </motion.button>

        {/* Botão de IA/Agente */}
        <motion.button
          onClick={() => {
            // Cicla entre os modos: manual → assistant → auto → manual
            const modes: Array<'manual' | 'assistant' | 'auto'> = ['manual', 'assistant', 'auto']
            const currentIndex = modes.indexOf(aiMode)
            const nextMode = modes[(currentIndex + 1) % modes.length]
            
            setAiMode(nextMode)
            
            // Atualiza status do agente baseado no modo
            const isActive = nextMode !== 'manual'
            setIsAgentActive(isActive)
            
            console.log('🤖 Modo IA alterado:', {
              modo: nextMode,
              status: isActive ? 'ATIVO ✅' : 'MANUAL 👤',
              descrição: {
                manual: 'Atendimento manual apenas',
                assistant: 'IA assistente (sugere respostas)',
                auto: 'IA automática (responde sozinha)'
              }[nextMode]
            })
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'relative p-3 rounded-full transition-colors',
            aiMode === 'manual' && 'bg-gray-500 text-white hover:bg-gray-600',
            aiMode === 'assistant' && 'bg-blue-500 text-white hover:bg-blue-600',
            aiMode === 'auto' && 'bg-purple-500 text-white hover:bg-purple-600'
          )}
          title={
            aiMode === 'manual' ? "🧑 Modo Manual - Clique para IA Assistente" :
            aiMode === 'assistant' ? "🤖 IA Assistente - Clique para IA Automática" :
            "⚡ IA Automática - Clique para Modo Manual"
          }
        >
          {/* Ícone baseado no modo */}
          {aiMode === 'manual' && <User className="w-5 h-5" />}
          {aiMode === 'assistant' && <Bot className="w-5 h-5" />}
          {aiMode === 'auto' && <Zap className="w-5 h-5" />}
          
          {/* Pin indicador */}
          <div 
            className={cn(
              'absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white',
              aiMode === 'manual' && 'bg-gray-400',
              aiMode === 'assistant' && 'bg-blue-400',
              aiMode === 'auto' && 'bg-purple-400 animate-pulse'
            )}
          />
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

      {/* Indicador de Status da IA/Agente */}
      {aiMode !== 'manual' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={cn(
            "mb-2 px-4 py-2 border rounded-lg",
            aiMode === 'assistant' && "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700",
            aiMode === 'auto' && "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700"
          )}
        >
          <div className="flex items-center space-x-2">
            <div 
              className={cn(
                "w-2 h-2 rounded-full",
                aiMode === 'assistant' && "bg-blue-500 animate-pulse",
                aiMode === 'auto' && "bg-purple-500 animate-pulse"
              )}
            />
            <span 
              className={cn(
                "text-sm font-medium",
                aiMode === 'assistant' && "text-blue-700 dark:text-blue-300",
                aiMode === 'auto' && "text-purple-700 dark:text-purple-300"
              )}
            >
              {aiMode === 'assistant' && '🤖 IA Assistente Ativa'}
              {aiMode === 'auto' && '⚡ IA Automática Ativa'}
            </span>
            <span 
              className={cn(
                "text-xs",
                aiMode === 'assistant' && "text-blue-600 dark:text-blue-400",
                aiMode === 'auto' && "text-purple-600 dark:text-purple-400"
              )}
            >
              {aiMode === 'assistant' && '• Sugerindo respostas inteligentes'}
              {aiMode === 'auto' && '• Respondendo automaticamente'}
            </span>
          </div>
        </motion.div>
      )}

      {/* Indicadores */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mt-3 text-red-500 text-sm"
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
          Gravando áudio... Solte para enviar
        </motion.div>
      )}

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
                  {bottomSheetType === 'create-client' ? 'Converter Lead para Cliente' : 'Ação Business'}
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
    </div>
  )
}
