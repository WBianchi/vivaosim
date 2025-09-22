'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Bot, Sparkles, Wrench, Globe, MessageCircle, Zap,
  GitBranch, Clock, Database, Webhook, Send, Image, FileText,
  Mic, Video, Menu, Users, Calendar, Receipt, Tag, UserPlus,
  HeadphonesIcon, Play, Pause, Save, Settings, Plus, Trash2,
  Copy, Eye, Code, Phone, Mail, Filter, CheckCircle, XCircle,
  AlertTriangle, Info, DollarSign, Package, ShoppingCart,
  CreditCard, FileSignature, Megaphone, BarChart, PieChart,
  TrendingUp, Activity, Wifi, WifiOff, Link, Unlink, Shield,
  Lock, Unlock, Key, UserCheck, UserX, LogIn, LogOut, RefreshCw,
  RotateCw, Download, Upload, Share2, Edit, Layers, Grid,
  List, MoreVertical, ChevronDown, ChevronRight, Bell, X,
  Minus, Undo2, Redo2, Sun, Moon, Heart, Star, Smile,
  Crown, UserMinus, PhoneCall, PhoneOff, Archive, ArchiveRestore,
  Vote, MousePointer, PenTool, Ticket, Kanban, ArrowRight,
  GitMerge
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeProvider'

// Tipos de nodes
type NodeType = {
  id: string
  type: string
  position: { x: number; y: number }
  data: any
  category: string
}

// Tipos de conexões
type Edge = {
  id: string
  source: string
  target: string
  label?: string
}

export default function FluxogramaPage() {
  const router = useRouter()
  const { isDarkMode, toggleTheme } = useTheme()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedType, setSelectedType] = useState('')
  const [selectedPurpose, setSelectedPurpose] = useState('')
  const [nodes, setNodes] = useState<NodeType[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState('triggers')
  const canvasRef = useRef<HTMLDivElement>(null)
  const [draggedNode, setDraggedNode] = useState<any>(null)
  const [showConfigPanel, setShowConfigPanel] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [copiedNode, setCopiedNode] = useState<NodeType | null>(null)
  const [flowHistory, setFlowHistory] = useState<any[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isDraggingNode, setIsDraggingNode] = useState(false)
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null)
  const [dragNodeOffset, setDragNodeOffset] = useState({ x: 0, y: 0 })
  const [hoveredConnectionPoint, setHoveredConnectionPoint] = useState<string | null>(null)

  // Todas as funções com useCallback DEVEM estar aqui no topo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const state = flowHistory[newIndex]
      setNodes(state.nodes)
      setEdges(state.edges)
      setHistoryIndex(newIndex)
    }
  }, [historyIndex, flowHistory])

  const handleRedo = useCallback(() => {
    if (historyIndex < flowHistory.length - 1) {
      const newIndex = historyIndex + 1
      const state = flowHistory[newIndex]
      setNodes(state.nodes)
      setEdges(state.edges)
      setHistoryIndex(newIndex)
    }
  }, [historyIndex, flowHistory])

  const saveToHistory = useCallback(() => {
    const newHistory = flowHistory.slice(0, historyIndex + 1)
    newHistory.push({ nodes: [...nodes], edges: [...edges] })
    setFlowHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [flowHistory, historyIndex, nodes, edges])

  const handlePaste = useCallback(() => {
    if (!copiedNode) return
    const newNode: NodeType = {
      ...copiedNode,
      id: `node-${Date.now()}`,
      position: {
        x: copiedNode.position.x + 50,
        y: copiedNode.position.y + 50
      }
    }
    setNodes([...nodes, newNode])
    saveToHistory()
  }, [copiedNode, nodes, saveToHistory])

  const deleteNode = useCallback((nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId))
    setEdges(edges.filter(e => e.source !== nodeId && e.target !== nodeId))
    setSelectedNode(null)
  }, [nodes, edges])

  // Funções para arrastar nodes
  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    if (e.button !== 0) return // Só botão esquerdo
    e.stopPropagation()
    
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return

    setIsDraggingNode(true)
    setDraggedNodeId(nodeId)
    
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      const x = (e.clientX - rect.left - panOffset.x) / zoom
      const y = (e.clientY - rect.top - panOffset.y) / zoom
      setDragNodeOffset({
        x: x - node.position.x,
        y: y - node.position.y
      })
    }
  }, [nodes, panOffset, zoom])

  const handleNodeMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingNode || !draggedNodeId || !canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - panOffset.x) / zoom - dragNodeOffset.x
    const y = (e.clientY - rect.top - panOffset.y) / zoom - dragNodeOffset.y
    
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === draggedNodeId 
          ? { ...node, position: { x: Math.max(0, x), y: Math.max(0, y) } }
          : node
      )
    )
  }, [isDraggingNode, draggedNodeId, panOffset, zoom, dragNodeOffset])

  const handleNodeMouseUp = useCallback(() => {
    if (isDraggingNode) {
      setIsDraggingNode(false)
      setDraggedNodeId(null)
      saveToHistory()
    }
  }, [isDraggingNode, saveToHistory])

  // Funções para conexões estilo N8N
  const handleConnectionStart = useCallback((e: React.MouseEvent, nodeId: string, connectionType: 'output' | 'input') => {
    e.stopPropagation()
    if (connectionType === 'output') {
      setIsConnecting(true)
      setConnectingFrom(nodeId)
    }
  }, [])

  const handleConnectionEnd = useCallback((nodeId: string, connectionType: 'output' | 'input') => {
    if (isConnecting && connectingFrom && connectionType === 'input' && connectingFrom !== nodeId) {
      const newEdge: Edge = {
        id: `edge-${Date.now()}`,
        source: connectingFrom,
        target: nodeId
      }
      setEdges(prevEdges => [...prevEdges, newEdge])
      setIsConnecting(false)
      setConnectingFrom(null)
      saveToHistory()
    }
  }, [isConnecting, connectingFrom, saveToHistory])

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z - Desfazer
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        handleUndo()
      }
      // Ctrl+Shift+Z ou Ctrl+Y - Refazer
      if ((e.ctrlKey && e.shiftKey && e.key === 'z') || (e.ctrlKey && e.key === 'y')) {
        handleRedo()
      }
      // Ctrl+C - Copiar
      if (e.ctrlKey && e.key === 'c' && selectedNode) {
        setCopiedNode(selectedNode)
      }
      // Ctrl+V - Colar
      if (e.ctrlKey && e.key === 'v' && copiedNode) {
        handlePaste()
      }
      // Delete - Deletar
      if (e.key === 'Delete' && selectedNode) {
        deleteNode(selectedNode.id)
      }
      // Escape - Cancelar conexão
      if (e.key === 'Escape') {
        setIsConnecting(false)
        setConnectingFrom(null)
        setShowConfigPanel(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNode, copiedNode, handleUndo, handleRedo, handlePaste, deleteNode])

  // GATILHOS DISPONÍVEIS (EXPANDIDOS COM WAHA + DB)
  const triggers = {
    whatsapp: [
      // Mensagens Básicas
      { id: 'msg_received', name: 'Nova Mensagem', icon: MessageCircle, color: 'green' },
      { id: 'msg_sent', name: 'Mensagem Enviada', icon: Send, color: 'blue' },
      { id: 'msg_read', name: 'Mensagem Lida', icon: CheckCircle, color: 'teal' },
      { id: 'msg_delivered', name: 'Mensagem Entregue', icon: CheckCircle, color: 'indigo' },
      { id: 'msg_reaction', name: 'Reação na Mensagem', icon: Heart, color: 'pink' },
      { id: 'msg_revoked', name: 'Mensagem Apagada', icon: Trash2, color: 'red' },
      { id: 'msg_edited', name: 'Mensagem Editada', icon: Edit, color: 'yellow' },
      { id: 'msg_starred', name: 'Mensagem Favoritada', icon: Star, color: 'yellow' },
      { id: 'msg_forwarded', name: 'Mensagem Encaminhada', icon: Share2, color: 'blue' },
      
      // Mídias
      { id: 'media_received', name: 'Mídia Recebida', icon: Image, color: 'purple' },
      { id: 'audio_received', name: 'Áudio Recebido', icon: Mic, color: 'pink' },
      { id: 'video_received', name: 'Vídeo Recebido', icon: Video, color: 'red' },
      { id: 'document_received', name: 'Documento Recebido', icon: FileText, color: 'blue' },
      { id: 'sticker_received', name: 'Sticker Recebido', icon: Smile, color: 'yellow' },
      { id: 'location_received', name: 'Localização Recebida', icon: Globe, color: 'orange' },
      { id: 'contact_received', name: 'Contato Recebido', icon: Users, color: 'cyan' },
      
      // Grupos
      { id: 'group_created', name: 'Grupo Criado', icon: Users, color: 'green' },
      { id: 'group_join', name: 'Entrou no Grupo', icon: UserPlus, color: 'blue' },
      { id: 'group_leave', name: 'Saiu do Grupo', icon: UserX, color: 'red' },
      { id: 'group_update', name: 'Grupo Atualizado', icon: Settings, color: 'gray' },
      { id: 'group_participants', name: 'Participantes Alterados', icon: Users, color: 'blue' },
      { id: 'group_admin_promote', name: 'Promovido a Admin', icon: Crown, color: 'gold' },
      { id: 'group_admin_demote', name: 'Removido de Admin', icon: UserMinus, color: 'orange' },
      
      // Status/Presença
      { id: 'presence_online', name: 'Ficou Online', icon: Wifi, color: 'green' },
      { id: 'presence_offline', name: 'Ficou Offline', icon: WifiOff, color: 'red' },
      { id: 'presence_typing', name: 'Digitando', icon: MoreVertical, color: 'blue' },
      { id: 'presence_recording', name: 'Gravando Áudio', icon: Mic, color: 'red' },
      
      // Chamadas
      { id: 'call_received', name: 'Chamada Recebida', icon: Phone, color: 'green' },
      { id: 'call_accepted', name: 'Chamada Aceita', icon: PhoneCall, color: 'blue' },
      { id: 'call_rejected', name: 'Chamada Rejeitada', icon: PhoneOff, color: 'red' },
      
      // Chat/Labels
      { id: 'chat_archived', name: 'Chat Arquivado', icon: Archive, color: 'gray' },
      { id: 'chat_unarchived', name: 'Chat Desarquivado', icon: ArchiveRestore, color: 'blue' },
      { id: 'label_added', name: 'Label Adicionada', icon: Tag, color: 'purple' },
      { id: 'label_removed', name: 'Label Removida', icon: X, color: 'red' },
      
      // Enquetes/Eventos
      { id: 'poll_vote', name: 'Voto em Enquete', icon: Vote, color: 'blue' },
      { id: 'event_response', name: 'Resposta de Evento', icon: Calendar, color: 'green' },
      
      // Botões/Listas
      { id: 'button_clicked', name: 'Botão Clicado', icon: MousePointer, color: 'blue' },
      { id: 'list_selected', name: 'Item da Lista Selecionado', icon: List, color: 'green' },
    ],
    platform: [
      // Leads/Clientes
      { id: 'new_lead', name: 'Novo Lead', icon: UserPlus, color: 'blue' },
      { id: 'lead_qualified', name: 'Lead Qualificado', icon: UserCheck, color: 'green' },
      { id: 'lead_converted', name: 'Lead Convertido', icon: TrendingUp, color: 'green' },
      { id: 'new_client', name: 'Novo Cliente', icon: UserCheck, color: 'green' },
      { id: 'client_inactive', name: 'Cliente Inativo', icon: UserX, color: 'red' },
      
      // Contratos/Orçamentos
      { id: 'new_budget', name: 'Novo Orçamento', icon: Receipt, color: 'blue' },
      { id: 'budget_approved', name: 'Orçamento Aprovado', icon: CheckCircle, color: 'green' },
      { id: 'budget_rejected', name: 'Orçamento Rejeitado', icon: XCircle, color: 'red' },
      { id: 'budget_expired', name: 'Orçamento Expirado', icon: Clock, color: 'orange' },
      { id: 'new_contract', name: 'Novo Contrato', icon: FileSignature, color: 'purple' },
      { id: 'contract_signed', name: 'Contrato Assinado', icon: PenTool, color: 'green' },
      { id: 'contract_expired', name: 'Contrato Expirado', icon: AlertTriangle, color: 'red' },
      
      // Pagamentos
      { id: 'new_payment', name: 'Novo Pagamento', icon: DollarSign, color: 'green' },
      { id: 'payment_overdue', name: 'Pagamento Atrasado', icon: AlertTriangle, color: 'red' },
      { id: 'payment_received', name: 'Pagamento Recebido', icon: CheckCircle, color: 'green' },
      { id: 'payment_failed', name: 'Pagamento Falhou', icon: XCircle, color: 'red' },
      
      // Eventos/Agendamentos
      { id: 'new_event', name: 'Novo Evento', icon: Calendar, color: 'orange' },
      { id: 'event_started', name: 'Evento Iniciado', icon: Play, color: 'green' },
      { id: 'event_finished', name: 'Evento Finalizado', icon: CheckCircle, color: 'blue' },
      { id: 'event_cancelled', name: 'Evento Cancelado', icon: XCircle, color: 'red' },
      { id: 'new_appointment', name: 'Novo Agendamento', icon: Calendar, color: 'blue' },
      { id: 'appointment_confirmed', name: 'Agendamento Confirmado', icon: CheckCircle, color: 'green' },
      { id: 'appointment_cancelled', name: 'Agendamento Cancelado', icon: XCircle, color: 'red' },
      { id: 'appointment_no_show', name: 'Cliente Não Compareceu', icon: UserX, color: 'orange' },
      
      // Tarefas
      { id: 'new_task', name: 'Nova Tarefa', icon: CheckCircle, color: 'blue' },
      { id: 'task_completed', name: 'Tarefa Concluída', icon: CheckCircle, color: 'green' },
      { id: 'task_overdue', name: 'Tarefa Atrasada', icon: AlertTriangle, color: 'red' },
      { id: 'task_assigned', name: 'Tarefa Atribuída', icon: UserPlus, color: 'blue' },
      
      // Tickets/Suporte
      { id: 'new_ticket', name: 'Novo Ticket', icon: Ticket, color: 'blue' },
      { id: 'ticket_resolved', name: 'Ticket Resolvido', icon: CheckCircle, color: 'green' },
      { id: 'ticket_closed', name: 'Ticket Fechado', icon: XCircle, color: 'gray' },
      { id: 'ticket_escalated', name: 'Ticket Escalado', icon: TrendingUp, color: 'red' },
      
      // Kanban/Status
      { id: 'kanban_created', name: 'Kanban Criado', icon: Kanban, color: 'blue' },
      { id: 'kanban_moved', name: 'Card Movido no Kanban', icon: ArrowRight, color: 'green' },
      { id: 'status_changed', name: 'Status Alterado', icon: RefreshCw, color: 'yellow' },
      
      // Tags/Labels
      { id: 'tag_added', name: 'Tag Adicionada', icon: Tag, color: 'purple' },
      { id: 'tag_removed', name: 'Tag Removida', icon: X, color: 'red' },
      
      // Sistema
      { id: 'form_submitted', name: 'Formulário Enviado', icon: FileText, color: 'indigo' },
      { id: 'webhook_received', name: 'Webhook Recebido', icon: Webhook, color: 'orange' },
      { id: 'api_called', name: 'API Chamada', icon: Globe, color: 'cyan' },
      { id: 'schedule_time', name: 'Horário Agendado', icon: Clock, color: 'purple' },
      { id: 'user_login', name: 'Usuário Logou', icon: LogIn, color: 'green' },
      { id: 'user_logout', name: 'Usuário Deslogou', icon: LogOut, color: 'red' },
    ]
  }

  // CONDIÇÕES DISPONÍVEIS
  const conditions = [
    { id: 'if_else', name: 'Se/Então', icon: GitBranch, color: 'yellow' },
    { id: 'switch_case', name: 'Múltipla Escolha', icon: Filter, color: 'pink' },
    { id: 'time_condition', name: 'Condição de Tempo', icon: Clock, color: 'cyan' },
    { id: 'date_condition', name: 'Condição de Data', icon: Calendar, color: 'blue' },
    { id: 'contains_text', name: 'Contém Texto', icon: FileText, color: 'green' },
    { id: 'regex_match', name: 'Regex Match', icon: Code, color: 'purple' },
    { id: 'number_compare', name: 'Comparar Número', icon: BarChart, color: 'orange' },
    { id: 'boolean_check', name: 'Verificar Booleano', icon: CheckCircle, color: 'teal' },
    { id: 'list_contains', name: 'Lista Contém', icon: List, color: 'indigo' },
    { id: 'user_role', name: 'Papel do Usuário', icon: Shield, color: 'red' },
    { id: 'business_hours', name: 'Horário Comercial', icon: Clock, color: 'green' },
    { id: 'weekend_check', name: 'Final de Semana', icon: Calendar, color: 'blue' },
  ]

  // AÇÕES DISPONÍVEIS (EXPANDIDAS COM WAHA + DB)
  const actions = {
    whatsapp: [
      // Mensagens Básicas
      { id: 'send_text', name: 'Enviar Texto', icon: Send, color: 'green' },
      { id: 'send_image', name: 'Enviar Imagem', icon: Image, color: 'blue' },
      { id: 'send_video', name: 'Enviar Vídeo', icon: Video, color: 'red' },
      { id: 'send_audio', name: 'Enviar Áudio', icon: Mic, color: 'purple' },
      { id: 'send_voice', name: 'Enviar Voice', icon: Mic, color: 'pink' },
      { id: 'send_document', name: 'Enviar Documento', icon: FileText, color: 'orange' },
      { id: 'send_file', name: 'Enviar Arquivo', icon: Upload, color: 'blue' },
      { id: 'send_sticker', name: 'Enviar Sticker', icon: Smile, color: 'yellow' },
      { id: 'send_location', name: 'Enviar Localização', icon: Globe, color: 'cyan' },
      { id: 'send_contact', name: 'Enviar Contato', icon: Users, color: 'pink' },
      { id: 'send_vcard', name: 'Enviar VCard', icon: Users, color: 'indigo' },
      
      // Mensagens Interativas
      { id: 'send_buttons', name: 'Enviar Botões', icon: Menu, color: 'indigo' },
      { id: 'send_list', name: 'Enviar Lista', icon: List, color: 'yellow' },
      { id: 'send_poll', name: 'Enviar Enquete', icon: Vote, color: 'blue' },
      { id: 'vote_poll', name: 'Votar em Enquete', icon: CheckCircle, color: 'green' },
      { id: 'reply_button', name: 'Responder Botão', icon: MousePointer, color: 'blue' },
      
      // Link e Preview
      { id: 'send_link_preview', name: 'Enviar Link com Preview', icon: Link, color: 'blue' },
      { id: 'send_custom_preview', name: 'Preview Customizado', icon: Eye, color: 'purple' },
      
      // Ações de Chat
      { id: 'mark_read', name: 'Marcar como Lida', icon: CheckCircle, color: 'green' },
      { id: 'start_typing', name: 'Iniciar Digitando', icon: MoreVertical, color: 'gray' },
      { id: 'stop_typing', name: 'Parar Digitando', icon: Pause, color: 'gray' },
      { id: 'forward_message', name: 'Encaminhar Mensagem', icon: Share2, color: 'blue' },
      { id: 'react_message', name: 'Reagir à Mensagem', icon: Heart, color: 'pink' },
      { id: 'star_message', name: 'Favoritar Mensagem', icon: Star, color: 'yellow' },
      { id: 'pin_message', name: 'Fixar Mensagem', icon: Star, color: 'blue' },
      { id: 'unpin_message', name: 'Desfixar Mensagem', icon: X, color: 'gray' },
      { id: 'delete_message', name: 'Deletar Mensagem', icon: Trash2, color: 'red' },
      { id: 'edit_message', name: 'Editar Mensagem', icon: Edit, color: 'yellow' },
      
      // Gerenciamento de Chat
      { id: 'archive_chat', name: 'Arquivar Chat', icon: Archive, color: 'gray' },
      { id: 'unarchive_chat', name: 'Desarquivar Chat', icon: ArchiveRestore, color: 'blue' },
      { id: 'clear_chat', name: 'Limpar Chat', icon: Trash2, color: 'red' },
      { id: 'block_contact', name: 'Bloquear Contato', icon: Shield, color: 'red' },
      { id: 'unblock_contact', name: 'Desbloquear Contato', icon: Unlock, color: 'green' },
      
      // Grupos
      { id: 'create_group', name: 'Criar Grupo', icon: Users, color: 'green' },
      { id: 'add_participant', name: 'Adicionar Participante', icon: UserPlus, color: 'blue' },
      { id: 'remove_participant', name: 'Remover Participante', icon: UserMinus, color: 'red' },
      { id: 'promote_admin', name: 'Promover Admin', icon: Crown, color: 'gold' },
      { id: 'demote_admin', name: 'Rebaixar Admin', icon: UserMinus, color: 'orange' },
      { id: 'leave_group', name: 'Sair do Grupo', icon: LogOut, color: 'red' },
      { id: 'update_group_name', name: 'Alterar Nome do Grupo', icon: Edit, color: 'blue' },
      { id: 'update_group_desc', name: 'Alterar Descrição', icon: FileText, color: 'gray' },
      { id: 'set_group_picture', name: 'Definir Foto do Grupo', icon: Image, color: 'purple' },
      
      // Labels/Tags
      { id: 'add_label', name: 'Adicionar Label', icon: Tag, color: 'purple' },
      { id: 'remove_label', name: 'Remover Label', icon: X, color: 'red' },
      
      // Status/Stories
      { id: 'send_text_status', name: 'Enviar Status Texto', icon: FileText, color: 'green' },
      { id: 'send_image_status', name: 'Enviar Status Imagem', icon: Image, color: 'blue' },
      { id: 'send_video_status', name: 'Enviar Status Vídeo', icon: Video, color: 'red' },
      { id: 'send_voice_status', name: 'Enviar Status Áudio', icon: Mic, color: 'purple' },
      { id: 'delete_status', name: 'Deletar Status', icon: Trash2, color: 'red' },
      
      // Presença
      { id: 'set_presence', name: 'Definir Presença', icon: Wifi, color: 'green' },
      { id: 'subscribe_presence', name: 'Monitorar Presença', icon: Eye, color: 'blue' },
      
      // IA e Automação
      { id: 'ai_response', name: 'Resposta com IA', icon: Sparkles, color: 'purple' },
      { id: 'ai_analyze', name: 'Analisar com IA', icon: Sparkles, color: 'pink' },
      { id: 'chatbot_response', name: 'Resposta Chatbot', icon: Bot, color: 'blue' },
      { id: 'auto_response_text', name: 'Auto Resposta Texto', icon: MessageCircle, color: 'green' },
      { id: 'auto_response_flow', name: 'Auto Resposta Fluxo', icon: GitBranch, color: 'blue' },
      { id: 'smart_reply', name: 'Resposta Inteligente', icon: Zap, color: 'purple' },
      { id: 'template_response', name: 'Resposta Template', icon: FileText, color: 'orange' },
    ],
    platform: [
      // Leads e Clientes
      { id: 'create_lead', name: 'Criar Lead', icon: UserPlus, color: 'blue' },
      { id: 'update_lead', name: 'Atualizar Lead', icon: RefreshCw, color: 'yellow' },
      { id: 'convert_lead', name: 'Converter Lead', icon: TrendingUp, color: 'green' },
      { id: 'create_client', name: 'Criar Cliente', icon: UserCheck, color: 'green' },
      { id: 'update_client', name: 'Atualizar Cliente', icon: Edit, color: 'blue' },
      { id: 'deactivate_client', name: 'Desativar Cliente', icon: UserX, color: 'red' },
      
      // Contatos
      { id: 'create_contact', name: 'Criar Contato', icon: UserPlus, color: 'blue' },
      { id: 'update_contact', name: 'Atualizar Contato', icon: Edit, color: 'yellow' },
      { id: 'merge_contacts', name: 'Mesclar Contatos', icon: GitMerge, color: 'purple' },
      { id: 'assign_contact', name: 'Atribuir Contato', icon: UserCheck, color: 'green' },
      
      // Orçamentos
      { id: 'create_budget', name: 'Criar Orçamento', icon: Receipt, color: 'blue' },
      { id: 'update_budget', name: 'Atualizar Orçamento', icon: Edit, color: 'yellow' },
      { id: 'send_budget', name: 'Enviar Orçamento', icon: Send, color: 'green' },
      { id: 'approve_budget', name: 'Aprovar Orçamento', icon: CheckCircle, color: 'green' },
      { id: 'reject_budget', name: 'Rejeitar Orçamento', icon: XCircle, color: 'red' },
      { id: 'duplicate_budget', name: 'Duplicar Orçamento', icon: Copy, color: 'blue' },
      
      // Contratos
      { id: 'create_contract', name: 'Criar Contrato', icon: FileSignature, color: 'purple' },
      { id: 'send_contract', name: 'Enviar Contrato', icon: Send, color: 'blue' },
      { id: 'sign_contract', name: 'Assinar Contrato', icon: PenTool, color: 'green' },
      { id: 'cancel_contract', name: 'Cancelar Contrato', icon: XCircle, color: 'red' },
      
      // Pagamentos
      { id: 'create_payment', name: 'Criar Pagamento', icon: DollarSign, color: 'green' },
      { id: 'process_payment', name: 'Processar Pagamento', icon: CreditCard, color: 'blue' },
      { id: 'refund_payment', name: 'Estornar Pagamento', icon: RefreshCw, color: 'red' },
      { id: 'send_invoice', name: 'Enviar Fatura', icon: Receipt, color: 'orange' },
      { id: 'send_reminder', name: 'Enviar Lembrete', icon: Bell, color: 'yellow' },
      
      // Eventos
      { id: 'create_event', name: 'Criar Evento', icon: Calendar, color: 'red' },
      { id: 'update_event', name: 'Atualizar Evento', icon: Edit, color: 'yellow' },
      { id: 'start_event', name: 'Iniciar Evento', icon: Play, color: 'green' },
      { id: 'finish_event', name: 'Finalizar Evento', icon: CheckCircle, color: 'blue' },
      { id: 'cancel_event', name: 'Cancelar Evento', icon: XCircle, color: 'red' },
      
      // Agendamentos
      { id: 'create_appointment', name: 'Criar Agendamento', icon: Calendar, color: 'blue' },
      { id: 'confirm_appointment', name: 'Confirmar Agendamento', icon: CheckCircle, color: 'green' },
      { id: 'reschedule_appointment', name: 'Reagendar', icon: RefreshCw, color: 'yellow' },
      { id: 'cancel_appointment', name: 'Cancelar Agendamento', icon: XCircle, color: 'red' },
      { id: 'send_appointment_reminder', name: 'Lembrete de Agendamento', icon: Bell, color: 'orange' },
      
      // Tarefas
      { id: 'create_task', name: 'Criar Tarefa', icon: CheckCircle, color: 'blue' },
      { id: 'assign_task', name: 'Atribuir Tarefa', icon: UserPlus, color: 'green' },
      { id: 'complete_task', name: 'Concluir Tarefa', icon: CheckCircle, color: 'green' },
      { id: 'update_task_priority', name: 'Alterar Prioridade', icon: AlertTriangle, color: 'orange' },
      
      // Tickets
      { id: 'create_ticket', name: 'Criar Ticket', icon: Ticket, color: 'blue' },
      { id: 'assign_ticket', name: 'Atribuir Ticket', icon: UserCheck, color: 'green' },
      { id: 'resolve_ticket', name: 'Resolver Ticket', icon: CheckCircle, color: 'green' },
      { id: 'escalate_ticket', name: 'Escalar Ticket', icon: TrendingUp, color: 'red' },
      { id: 'close_ticket', name: 'Fechar Ticket', icon: XCircle, color: 'gray' },
      
      // Kanban
      { id: 'create_kanban_board', name: 'Criar Quadro Kanban', icon: Kanban, color: 'blue' },
      { id: 'move_kanban_card', name: 'Mover Card', icon: ArrowRight, color: 'green' },
      { id: 'create_kanban_column', name: 'Criar Coluna', icon: Plus, color: 'blue' },
      
      // Tags e Labels
      { id: 'add_tag', name: 'Adicionar Tag', icon: Tag, color: 'purple' },
      { id: 'remove_tag', name: 'Remover Tag', icon: X, color: 'red' },
      { id: 'create_tag', name: 'Criar Tag', icon: Plus, color: 'blue' },
      
      // Filas
      { id: 'create_queue', name: 'Criar Fila', icon: List, color: 'blue' },
      { id: 'assign_to_queue', name: 'Atribuir à Fila', icon: ArrowRight, color: 'green' },
      { id: 'move_queue', name: 'Mover de Fila', icon: RefreshCw, color: 'yellow' },
      
      // Comunicação
      { id: 'send_email', name: 'Enviar Email', icon: Mail, color: 'blue' },
      { id: 'send_sms', name: 'Enviar SMS', icon: Phone, color: 'purple' },
      { id: 'send_notification', name: 'Enviar Notificação', icon: Bell, color: 'orange' },
      { id: 'create_activity_log', name: 'Registrar Atividade', icon: FileText, color: 'gray' },
      
      // Sistema
      { id: 'call_webhook', name: 'Chamar Webhook', icon: Webhook, color: 'cyan' },
      { id: 'call_api', name: 'Chamar API', icon: Globe, color: 'indigo' },
      { id: 'database_query', name: 'Consultar Banco', icon: Database, color: 'green' },
      { id: 'database_insert', name: 'Inserir no Banco', icon: Database, color: 'blue' },
      { id: 'database_update', name: 'Atualizar Banco', icon: Database, color: 'yellow' },
      { id: 'database_delete', name: 'Deletar do Banco', icon: Database, color: 'red' },
      { id: 'generate_report', name: 'Gerar Relatório', icon: BarChart, color: 'blue' },
      { id: 'export_data', name: 'Exportar Dados', icon: Download, color: 'green' },
      { id: 'import_data', name: 'Importar Dados', icon: Upload, color: 'blue' },
      
      // Automação
      { id: 'delay_action', name: 'Aguardar Tempo', icon: Clock, color: 'purple' },
      { id: 'schedule_action', name: 'Agendar Ação', icon: Calendar, color: 'blue' },
      { id: 'conditional_action', name: 'Ação Condicional', icon: GitBranch, color: 'yellow' },
      { id: 'loop_action', name: 'Repetir Ação', icon: RotateCw, color: 'green' },
    ],
    integrations: [
      // Google Workspace
      { id: 'google_sheets_read', name: 'Ler Google Sheets', icon: Grid, color: 'green' },
      { id: 'google_sheets_write', name: 'Escrever Google Sheets', icon: Edit, color: 'green' },
      { id: 'google_calendar_create', name: 'Criar Evento Google Calendar', icon: Calendar, color: 'blue' },
      { id: 'google_calendar_update', name: 'Atualizar Google Calendar', icon: RefreshCw, color: 'blue' },
      { id: 'google_drive_upload', name: 'Upload Google Drive', icon: Upload, color: 'yellow' },
      { id: 'google_drive_download', name: 'Download Google Drive', icon: Download, color: 'yellow' },
      { id: 'gmail_send', name: 'Enviar Gmail', icon: Mail, color: 'red' },
      
      // Mensageiros
      { id: 'slack_message', name: 'Mensagem Slack', icon: MessageCircle, color: 'purple' },
      { id: 'discord_message', name: 'Mensagem Discord', icon: MessageCircle, color: 'indigo' },
      { id: 'telegram_message', name: 'Mensagem Telegram', icon: Send, color: 'blue' },
      { id: 'teams_message', name: 'Mensagem Teams', icon: Users, color: 'blue' },
      
      // Pagamentos
      { id: 'stripe_payment', name: 'Pagamento Stripe', icon: CreditCard, color: 'purple' },
      { id: 'mercadopago_payment', name: 'Pagamento MercadoPago', icon: DollarSign, color: 'blue' },
      { id: 'pix_payment', name: 'Pagamento PIX', icon: Zap, color: 'green' },
      { id: 'paypal_payment', name: 'Pagamento PayPal', icon: DollarSign, color: 'blue' },
      
      // CRM/ERP
      { id: 'hubspot_sync', name: 'Sincronizar HubSpot', icon: RefreshCw, color: 'orange' },
      { id: 'salesforce_sync', name: 'Sincronizar Salesforce', icon: RefreshCw, color: 'blue' },
      { id: 'pipedrive_sync', name: 'Sincronizar Pipedrive', icon: TrendingUp, color: 'green' },
      
      // E-commerce
      { id: 'shopify_order', name: 'Pedido Shopify', icon: ShoppingCart, color: 'green' },
      { id: 'woocommerce_order', name: 'Pedido WooCommerce', icon: Package, color: 'purple' },
      
      // Redes Sociais
      { id: 'facebook_post', name: 'Postar Facebook', icon: Share2, color: 'blue' },
      { id: 'instagram_post', name: 'Postar Instagram', icon: Image, color: 'pink' },
      { id: 'twitter_post', name: 'Postar Twitter', icon: MessageCircle, color: 'blue' },
      { id: 'linkedin_post', name: 'Postar LinkedIn', icon: Users, color: 'blue' },
      
      // Ferramentas
      { id: 'zapier_trigger', name: 'Trigger Zapier', icon: Zap, color: 'orange' },
      { id: 'make_scenario', name: 'Cenário Make.com', icon: Settings, color: 'purple' },
      { id: 'n8n_workflow', name: 'Workflow N8N', icon: GitBranch, color: 'pink' },
    ]
  }

  // PASSO 1: Escolher tipo (IA ou Manual)
  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <button 
          onClick={() => router.push('/dashboard')}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-orange-500"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Criar Fluxograma</h1>
          <p className="text-center text-gray-600 mb-12">Como você quer criar?</p>
          
          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => {
                setSelectedType('ai')
                setCurrentStep(2)
              }}
              className="p-8 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 hover:border-orange-500 transition-all"
            >
              <Sparkles className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Com IA</h3>
              <p className="text-gray-600">Deixe a IA criar para você</p>
            </button>

            <button
              onClick={() => {
                setSelectedType('manual')
                setCurrentStep(2)
              }}
              className="p-8 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 hover:border-orange-500 transition-all"
            >
              <Wrench className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Manual</h3>
              <p className="text-gray-600">Crie você mesmo</p>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // PASSO 2: Escolher finalidade
  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <button 
          onClick={() => setCurrentStep(1)}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-orange-500"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Onde será usado?</h1>
          <p className="text-center text-gray-600 mb-12">Escolha a finalidade do fluxo</p>
          
          <div className="grid grid-cols-3 gap-6">
            <button
              onClick={() => {
                setSelectedPurpose('platform')
                setCurrentStep(3)
              }}
              className="p-8 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 hover:border-orange-500 transition-all"
            >
              <Globe className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Plataforma</h3>
              <p className="text-gray-600">Automações internas</p>
            </button>

            <button
              onClick={() => {
                setSelectedPurpose('whatsapp')
                setCurrentStep(3)
              }}
              className="p-8 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 hover:border-green-500 transition-all"
            >
              <MessageCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
              <p className="text-gray-600">Chatbot e respostas</p>
            </button>

            <button
              onClick={() => {
                setSelectedPurpose('both')
                setCurrentStep(3)
              }}
              className="p-8 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 hover:border-purple-500 transition-all"
            >
              <Zap className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Ambos</h3>
              <p className="text-gray-600">Integração completa</p>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Funções auxiliares
  const handleDragStart = (e: React.DragEvent, nodeData: any) => {
    console.log('Drag start:', nodeData)
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('text/plain', JSON.stringify(nodeData))
    setDraggedNode(nodeData)
  }

  // Zoom e Pan
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      setZoom(prev => Math.min(Math.max(prev * delta, 0.1), 3))
    }
  }

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) { // Middle click ou Shift+Click
      setIsDraggingCanvas(true)
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCanvas) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    } else if (isDraggingNode) {
      handleNodeMouseMove(e)
    }
  }

  const handleCanvasMouseUp = () => {
    setIsDraggingCanvas(false)
    handleNodeMouseUp()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    console.log('Drop event:', { draggedNode, canvasRef: !!canvasRef.current })
    
    if (!draggedNode || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    // Ajustar posição considerando zoom e pan
    const x = (e.clientX - rect.left - panOffset.x) / zoom
    const y = (e.clientY - rect.top - panOffset.y) / zoom

    const newNode: NodeType = {
      id: `node-${Date.now()}`,
      type: draggedNode.id,
      position: { x: Math.max(0, x), y: Math.max(0, y) },
      data: { ...draggedNode, label: draggedNode.name },
      category: draggedNode.category || activeTab
    }

    console.log('Creating node:', newNode)
    setNodes(prevNodes => [...prevNodes, newNode])
    setDraggedNode(null)
    saveToHistory()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleNodeClick = (node: NodeType) => {
    if (isConnecting && connectingFrom) {
      // Criar conexão
      const newEdge: Edge = {
        id: `edge-${Date.now()}`,
        source: connectingFrom,
        target: node.id
      }
      setEdges([...edges, newEdge])
      setIsConnecting(false)
      setConnectingFrom(null)
    } else {
      setSelectedNode(node)
      setShowConfigPanel(true)
    }
  }

  const startConnecting = (nodeId: string) => {
    setIsConnecting(true)
    setConnectingFrom(nodeId)
    setShowConfigPanel(false)
  }


  // Obter elementos baseado na seleção
  const getElements = () => {
    if (activeTab === 'triggers') {
      if (selectedPurpose === 'whatsapp') return triggers.whatsapp
      if (selectedPurpose === 'platform') return triggers.platform
      return [...triggers.whatsapp, ...triggers.platform]
    }
    if (activeTab === 'conditions') return conditions
    if (activeTab === 'actions') {
      if (selectedPurpose === 'whatsapp') return actions.whatsapp
      if (selectedPurpose === 'platform') return actions.platform
      return [...actions.whatsapp, ...actions.platform]
    }
    if (activeTab === 'integrations') return actions.integrations
    return []
  }

  // PASSO 3: Builder Completo
  if (currentStep === 3) {
    return (
      <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        {/* Header Aprimorado */}
        <div className="h-16 bg-white dark:bg-gray-800 border-b px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedType === 'ai' ? 'bg-orange-100' : 'bg-gray-100'
              }`}>
                {selectedType === 'ai' ? (
                  <Sparkles className="w-5 h-5 text-orange-500" />
                ) : (
                  <Wrench className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Fluxo {selectedType === 'ai' ? 'com IA' : 'Manual'}
                </h2>
                <p className="text-xs text-gray-500">
                  {selectedPurpose === 'platform' ? 'Plataforma' : selectedPurpose === 'whatsapp' ? 'WhatsApp' : 'Integrado'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Controles de Zoom */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button 
                onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.1))}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Zoom Out"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-2 text-sm font-medium min-w-[50px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button 
                onClick={() => setZoom(prev => Math.min(prev + 0.1, 3))}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Zoom In"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setZoom(1)}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Reset Zoom"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Undo/Redo */}
            <div className="flex items-center gap-1">
              <button 
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                title="Desfazer (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button 
                onClick={handleRedo}
                disabled={historyIndex >= flowHistory.length - 1}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                title="Refazer (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </motion.button>

            {isConnecting && (
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium animate-pulse">
                  Clique no ponto de entrada de outro node
                </div>
                <button 
                  onClick={() => {
                    setIsConnecting(false)
                    setConnectingFrom(null)
                  }}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            )}

            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                isRunning 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  Parar
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Testar
                </>
              )}
            </button>

            <button 
              onClick={() => {
                // Exportar como JSON
                const flowData = { nodes, edges, metadata: { type: selectedType, purpose: selectedPurpose } }
                const blob = new Blob([JSON.stringify(flowData, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `fluxograma-${Date.now()}.json`
                a.click()
              }}
              className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="Exportar"
            >
              <Download className="w-4 h-4" />
            </button>

            <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2 transition-colors">
              <Save className="w-4 h-4" />
              Salvar
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Aprimorada */}
          <div className="w-80 bg-white dark:bg-gray-800 border-r flex flex-col">
            {/* Tabs */}
            <div className="flex border-b">
              {['triggers', 'conditions', 'actions', 'integrations'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-3 py-3 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  {tab === 'triggers' && 'Gatilhos'}
                  {tab === 'conditions' && 'Condições'}
                  {tab === 'actions' && 'Ações'}
                  {tab === 'integrations' && 'Integrações'}
                </button>
              ))}
            </div>

            {/* Elements List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {getElements().map((element) => {
                  const Icon = element.icon
                  return (
                    <motion.div
                      key={element.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e as any, { ...element, category: activeTab })}
                      onDragEnd={() => setDraggedNode(null)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-lg cursor-move transition-all border ${
                        draggedNode?.id === element.id 
                          ? 'bg-orange-100 border-orange-400 dark:bg-orange-900/30 dark:border-orange-600' 
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-${element.color}-100 dark:bg-${element.color}-900/30 flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 text-${element.color}-600`} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {element.name}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Canvas Aprimorado */}
          <div 
            ref={canvasRef}
            className={`flex-1 relative bg-gray-50 dark:bg-gray-950 overflow-hidden transition-colors ${
              draggedNode ? 'bg-orange-50 dark:bg-orange-950/20' : ''
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onWheel={handleWheel}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            style={{ cursor: isDraggingCanvas ? 'grabbing' : draggedNode ? 'copy' : 'default' }}
          >
            {/* Container com Zoom e Pan */}
            <div
              className="absolute inset-0"
              style={{
                transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                transformOrigin: '0 0',
                transition: isDraggingCanvas ? 'none' : 'transform 0.1s ease-out'
              }}
            >
            {/* Grid Background */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-200 dark:text-gray-800" opacity="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Linhas de Conexão Estilo N8N */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
              {edges.map((edge) => {
                const sourceNode = nodes.find(n => n.id === edge.source)
                const targetNode = nodes.find(n => n.id === edge.target)
                if (!sourceNode || !targetNode) return null

                // Posições dos pontos de conexão
                const x1 = sourceNode.position.x + 75  // Ponto de saída (direita do node)
                const y1 = sourceNode.position.y
                const x2 = targetNode.position.x - 75  // Ponto de entrada (esquerda do node)
                const y2 = targetNode.position.y

                // Criar curva Bézier estilo N8N
                const dx = x2 - x1
                const controlOffset = Math.abs(dx) * 0.5
                const cx1 = x1 + controlOffset
                const cx2 = x2 - controlOffset

                const pathData = `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`

                return (
                  <g key={edge.id}>
                    {/* Linha de fundo para melhor visibilidade */}
                    <path
                      d={pathData}
                      stroke="rgba(0,0,0,0.1)"
                      strokeWidth="5"
                      fill="none"
                    />
                    {/* Linha principal */}
                    <path
                      d={pathData}
                      stroke="#f97316"
                      strokeWidth="3"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                      className="drop-shadow-sm"
                    />
                    {/* Botão para deletar conexão */}
                    <circle
                      cx={(x1 + x2) / 2}
                      cy={(y1 + y2) / 2}
                      r="8"
                      fill="white"
                      stroke="#f97316"
                      strokeWidth="2"
                      className="cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setEdges(prevEdges => prevEdges.filter(e => e.id !== edge.id))
                        saveToHistory()
                      }}
                    />
                    <text
                      x={(x1 + x2) / 2}
                      y={(y1 + y2) / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="10"
                      fill="#f97316"
                      className="cursor-pointer opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                    >
                      ×
                    </text>
                  </g>
                )
              })}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  fill="#f97316"
                >
                  <polygon points="0 0, 10 3, 0 6" />
                </marker>
              </defs>
            </svg>

            {/* Nodes */}
            {nodes.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Canvas Vazio</p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">Arraste elementos da barra lateral</p>
                </div>
              </div>
            ) : (
              <div className="relative z-10">
                {nodes.map((node) => {
                  // Buscar elemento em TODAS as categorias, não só na ativa
                  let element = null
                  
                  // Buscar em gatilhos
                  if (!element) {
                    element = [...triggers.whatsapp, ...triggers.platform].find(el => el.id === node.type)
                  }
                  
                  // Buscar em condições
                  if (!element) {
                    element = conditions.find(el => el.id === node.type)
                  }
                  
                  // Buscar em ações
                  if (!element) {
                    element = [...actions.whatsapp, ...actions.platform, ...actions.integrations].find(el => el.id === node.type)
                  }
                  
                  if (!element) return null
                  const Icon = element.icon
                  
                  return (
                    <motion.div
                      key={node.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 transition-all group ${
                        isDraggingNode && draggedNodeId === node.id
                          ? 'border-orange-500 shadow-2xl cursor-grabbing scale-105'
                          : isConnecting && connectingFrom === node.id 
                          ? 'border-orange-500 ring-4 ring-orange-200' 
                          : isConnecting && connectingFrom !== node.id
                          ? 'border-green-500 hover:border-green-600'
                          : 'border-gray-200 dark:border-gray-700 hover:shadow-xl cursor-grab'
                      }`}
                      style={{ 
                        left: node.position.x - 75, 
                        top: node.position.y - 30,
                        zIndex: isDraggingNode && draggedNodeId === node.id ? 1000 : 1
                      }}
                      onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                      onClick={() => handleNodeClick(node)}
                    >
                      {/* Ponto de Conexão de Entrada (Esquerda) */}
                      <div
                        className={`absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all ${
                          isConnecting && connectingFrom !== node.id
                            ? 'bg-green-500 border-green-600 scale-125 shadow-lg cursor-pointer'
                            : hoveredConnectionPoint === `${node.id}-input`
                            ? 'bg-blue-500 border-blue-600 scale-110'
                            : 'bg-gray-300 border-gray-400 opacity-0 group-hover:opacity-100'
                        }`}
                        onMouseEnter={() => setHoveredConnectionPoint(`${node.id}-input`)}
                        onMouseLeave={() => setHoveredConnectionPoint(null)}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleConnectionEnd(node.id, 'input')
                        }}
                        title="Ponto de entrada"
                      />

                      {/* Conteúdo do Node */}
                      <div className="flex items-center gap-3 p-4">
                        <div className={`w-10 h-10 rounded-lg bg-${element.color}-100 dark:bg-${element.color}-900/30 flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 text-${element.color}-600`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {node.data.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {node.category}
                          </p>
                        </div>
                      </div>

                      {/* Ponto de Conexão de Saída (Direita) */}
                      <div
                        className={`absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all ${
                          isConnecting && connectingFrom === node.id
                            ? 'bg-orange-500 border-orange-600 scale-125 shadow-lg'
                            : hoveredConnectionPoint === `${node.id}-output`
                            ? 'bg-orange-500 border-orange-600 scale-110 cursor-pointer'
                            : 'bg-gray-300 border-gray-400 opacity-0 group-hover:opacity-100 cursor-pointer'
                        }`}
                        onMouseEnter={() => setHoveredConnectionPoint(`${node.id}-output`)}
                        onMouseLeave={() => setHoveredConnectionPoint(null)}
                        onClick={(e) => handleConnectionStart(e, node.id, 'output')}
                        title="Ponto de saída"
                      />
                    </motion.div>
                  )
                })}
              </div>
            )}
            </div>
          </div>

          {/* Config Panel */}
          <AnimatePresence>
            {showConfigPanel && selectedNode && (
              <motion.div
                initial={{ x: 320 }}
                animate={{ x: 0 }}
                exit={{ x: 320 }}
                className="w-80 bg-white dark:bg-gray-800 border-l p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configurações</h3>
                  <button
                    onClick={() => setShowConfigPanel(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome do Nó
                    </label>
                    <input
                      type="text"
                      value={selectedNode.data.label}
                      onChange={(e) => {
                        const updatedNodes = nodes.map(n => 
                          n.id === selectedNode.id 
                            ? { ...n, data: { ...n.data, label: e.target.value } }
                            : n
                        )
                        setNodes(updatedNodes)
                        setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, label: e.target.value } })
                      }}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tipo
                    </label>
                    <p className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {selectedNode.category}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteNode(selectedNode.id)}
                    className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Deletar Nó
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return null
}
