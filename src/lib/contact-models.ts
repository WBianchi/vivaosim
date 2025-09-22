// Modelos de Contact e relacionados para integração WhatsApp + Business

export interface Contact {
  id: string
  
  // Dados do WhatsApp (sincronizados)
  chatId: string // ID do chat no WhatsApp/WAHA
  whatsappNumber: string // Número do WhatsApp
  name: string
  profilePictureUrl?: string
  isGroup: boolean
  isOnline?: boolean
  lastSeen?: Date
  
  // Dados Business (nossos)
  firstName?: string
  lastName?: string
  email?: string
  document?: string // CPF/CNPJ
  company?: string
  position?: string
  notes?: string
  
  // Status de Atendimento
  status: ContactStatus
  priority: ContactPriority
  source: ContactSource
  
  // Relacionamentos
  assignedToUserId?: string // Atendente responsável
  tags: ContactTag[]
  customFields: Record<string, any>
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  lastInteractionAt?: Date
}

export enum ContactStatus {
  NOVO = 'NOVO',           // Primeiro contato
  EM_ATENDIMENTO = 'EM_ATENDIMENTO',  // Sendo atendido
  AGUARDANDO = 'AGUARDANDO',          // Aguardando resposta do cliente
  RESOLVIDO = 'RESOLVIDO',            // Atendimento finalizado
  ARQUIVADO = 'ARQUIVADO'             // Arquivado
}

export enum ContactPriority {
  BAIXA = 'BAIXA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE'
}

export enum ContactSource {
  WHATSAPP = 'WHATSAPP',
  SITE = 'SITE',
  INDICACAO = 'INDICACAO',
  REDES_SOCIAIS = 'REDES_SOCIAIS',
  OUTROS = 'OUTROS'
}

export interface ContactTag {
  id: string
  name: string
  color: string
  category: TagCategory
}

export enum TagCategory {
  STATUS = 'STATUS',
  SERVICO = 'SERVICO',
  SEGMENTO = 'SEGMENTO',
  ORIGEM = 'ORIGEM',
  PERSONALIZADO = 'PERSONALIZADO'
}

// Agendamentos
export interface Schedule {
  id: string
  contactId: string
  title: string
  description?: string
  scheduledAt: Date
  duration: number // minutos
  status: ScheduleStatus
  type: ScheduleType
  location?: string
  meetingUrl?: string
  reminderSent: boolean
  createdByUserId: string
  createdAt: Date
  updatedAt: Date
}

export enum ScheduleStatus {
  AGENDADO = 'AGENDADO',
  CONFIRMADO = 'CONFIRMADO',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  FINALIZADO = 'FINALIZADO',
  CANCELADO = 'CANCELADO',
  NAO_COMPARECEU = 'NAO_COMPARECEU'
}

export enum ScheduleType {
  REUNIAO = 'REUNIAO',
  LIGACAO = 'LIGACAO',
  VISITA = 'VISITA',
  APRESENTACAO = 'APRESENTACAO',
  OUTROS = 'OUTROS'
}

// Orçamentos
export interface Quote {
  id: string
  contactId: string
  number: string // Número sequencial
  title: string
  description?: string
  items: QuoteItem[]
  subtotal: number
  discount: number
  taxes: number
  total: number
  validUntil: Date
  status: QuoteStatus
  terms?: string
  notes?: string
  createdByUserId: string
  createdAt: Date
  updatedAt: Date
  sentAt?: Date
  viewedAt?: Date
  acceptedAt?: Date
}

export interface QuoteItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export enum QuoteStatus {
  RASCUNHO = 'RASCUNHO',
  ENVIADO = 'ENVIADO',
  VISUALIZADO = 'VISUALIZADO',
  ACEITO = 'ACEITO',
  RECUSADO = 'RECUSADO',
  EXPIRADO = 'EXPIRADO'
}

// Contratos
export interface Contract {
  id: string
  contactId: string
  quoteId?: string
  number: string
  title: string
  description?: string
  value: number
  startDate: Date
  endDate?: Date
  status: ContractStatus
  terms: string
  attachments: ContractAttachment[]
  signatures: ContractSignature[]
  createdByUserId: string
  createdAt: Date
  updatedAt: Date
  signedAt?: Date
}

export interface ContractAttachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export interface ContractSignature {
  id: string
  signerName: string
  signerEmail?: string
  signedAt: Date
  ipAddress: string
  signatureUrl: string
}

export enum ContractStatus {
  RASCUNHO = 'RASCUNHO',
  ENVIADO = 'ENVIADO',
  ASSINADO = 'ASSINADO',
  ATIVO = 'ATIVO',
  FINALIZADO = 'FINALIZADO',
  CANCELADO = 'CANCELADO'
}

// Tickets
export interface Ticket {
  id: string
  contactId: string
  number: string
  title: string
  description?: string
  status: TicketStatus
  priority: TicketPriority
  category: TicketCategory
  assignedToUserId?: string
  tags: string[]
  customFields: Record<string, any>
  
  // SLA
  createdAt: Date
  updatedAt: Date
  firstResponseAt?: Date
  resolvedAt?: Date
  closedAt?: Date
  
  // Relacionamentos
  messages: TicketMessage[]
  timeEntries: TicketTimeEntry[]
}

export interface TicketMessage {
  id: string
  ticketId: string
  fromUserId?: string
  fromContact: boolean
  content: string
  attachments: string[]
  createdAt: Date
}

export interface TicketTimeEntry {
  id: string
  ticketId: string
  userId: string
  description: string
  minutes: number
  date: Date
}

export enum TicketStatus {
  NOVO = 'NOVO',
  ABERTO = 'ABERTO',
  EM_PROGRESSO = 'EM_PROGRESSO',
  AGUARDANDO_CLIENTE = 'AGUARDANDO_CLIENTE',
  RESOLVIDO = 'RESOLVIDO',
  FECHADO = 'FECHADO'
}

export enum TicketPriority {
  BAIXA = 'BAIXA',
  NORMAL = 'NORMAL',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE'
}

export enum TicketCategory {
  SUPORTE = 'SUPORTE',
  BUG = 'BUG',
  DUVIDA = 'DUVIDA',
  SOLICITACAO = 'SOLICITACAO',
  RECLAMACAO = 'RECLAMACAO'
}

// Tipos para UI
export interface ContactWithRelations extends Contact {
  assignedUser?: {
    id: string
    name: string
    avatar?: string
  }
  schedules?: Schedule[]
  quotes?: Quote[]
  contracts?: Contract[]
  tickets?: Ticket[]
  messageCount?: number
  lastMessage?: {
    content: string
    timestamp: Date
    fromContact: boolean
  }
}

export interface ContactStats {
  totalContacts: number
  newContacts: number
  activeChats: number
  pendingTickets: number
  schedulesToday: number
  openQuotes: number
  activeContracts: number
}
