// Tipos base para o sistema de chat integrado com WAHA

export interface Contact {
  id: string
  name?: string
  firstName?: string
  lastName?: string
  phone: string
  profilePicture?: string
  isBlocked: boolean
  isBusiness: boolean
  isEnterprise: boolean
  isGroup: boolean
  isMyContact: boolean
  pushName?: string
  shortName?: string
  tags: string[]
  notes: string
  lastSeen?: Date
  isOnline: boolean
}

export interface Message {
  id: string
  chatId: string
  from: string
  to: string
  body?: string
  type: MessageType
  timestamp: Date
  hasMedia: boolean
  mediaUrl?: string
  mimeType?: string
  fileName?: string
  isForwarded: boolean
  isFromMe: boolean
  isGif: boolean
  isStarred: boolean
  location?: {
    latitude: number
    longitude: number
    description?: string
  }
  vcard?: string
  quotedMessage?: {
    id: string
    body?: string
    from: string
  }
  reactions?: MessageReaction[]
  ack: MessageAck
  editedTimestamp?: Date
  revokedTimestamp?: Date
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  VOICE = 'ptt',
  DOCUMENT = 'document',
  STICKER = 'sticker',
  LOCATION = 'location',
  CONTACT = 'vcard',
  POLL = 'poll',
  SYSTEM = 'system',
  UNKNOWN = 'unknown'
}

export enum MessageAck {
  PENDING = 'pending',
  SERVER = 'server', 
  DEVICE = 'device',
  READ = 'read',
  PLAYED = 'played'
}

export interface MessageReaction {
  id: string
  emoji: string
  from: string
  timestamp: Date
}

export interface Chat {
  id: string
  name: string
  contact?: Contact
  isGroup: boolean
  isArchived: boolean
  isMuted: boolean
  isPinned: boolean
  unreadCount: number
  lastMessage?: Message
  lastMessageTimestamp?: Date
  profilePicture?: string
  participants?: Contact[] // Para grupos
  description?: string
  groupMetadata?: {
    owner: string
    admins: string[]
    createdAt: Date
    subject: string
    description?: string
    inviteCode?: string
  }
  labels: string[]
  ticket?: Ticket
}

export interface Ticket {
  id: string
  chatId: string
  contactId: string
  status: TicketStatus
  priority: TicketPriority
  category: string
  subject: string
  description?: string
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
  closedAt?: Date
  tags: string[]
  customFields: Record<string, any>
}

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress', 
  WAITING = 'waiting',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum TicketPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface Schedule {
  id: string
  contactId: string
  chatId: string
  title: string
  description?: string
  dateTime: Date
  duration: number // em minutos
  location?: string
  status: ScheduleStatus
  type: ScheduleType
  reminderMinutes?: number
  attendees: string[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export enum ScheduleStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export enum ScheduleType {
  MEETING = 'meeting',
  CALL = 'call',
  VISIT = 'visit',
  DELIVERY = 'delivery',
  SERVICE = 'service',
  OTHER = 'other'
}

export interface Quote {
  id: string
  contactId: string
  chatId: string
  number: string
  title: string
  description?: string
  items: QuoteItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  currency: string
  status: QuoteStatus
  validUntil?: Date
  terms?: string
  notes?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  sentAt?: Date
  acceptedAt?: Date
  rejectedAt?: Date
}

export interface QuoteItem {
  id: string
  description: string
  quantity: number
  price: number
  total: number
  unit?: string
  category?: string
}

export enum QuoteStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  VIEWED = 'viewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export interface Contract {
  id: string
  contactId: string
  chatId: string
  number: string
  title: string
  description?: string
  type: ContractType
  status: ContractStatus
  value: number
  currency: string
  startDate: Date
  endDate?: Date
  terms: string
  clauses: ContractClause[]
  attachments: ContractAttachment[]
  signatures: ContractSignature[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
  signedAt?: Date
  cancelledAt?: Date
}

export interface ContractClause {
  id: string
  title: string
  content: string
  order: number
  required: boolean
}

export interface ContractAttachment {
  id: string
  fileName: string
  fileUrl: string
  mimeType: string
  size: number
  uploadedAt: Date
  uploadedBy: string
}

export interface ContractSignature {
  id: string
  signerName: string
  signerEmail?: string
  signerPhone?: string
  signatureUrl: string
  ipAddress: string
  userAgent: string
  signedAt: Date
}

export enum ContractType {
  SERVICE = 'service',
  PRODUCT = 'product',
  SUBSCRIPTION = 'subscription',
  RENTAL = 'rental',
  PARTNERSHIP = 'partnership',
  OTHER = 'other'
}

export enum ContractStatus {
  DRAFT = 'draft',
  PENDING_SIGNATURE = 'pending_signature',
  SIGNED = 'signed',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  TERMINATED = 'terminated'
}

// Estados da conexão WhatsApp
export interface WhatsAppConnection {
  sessionId: string
  status: WhatsAppStatus
  qrCode?: string
  isConnected: boolean
  lastSeen?: Date
  phone?: string
  name?: string
  profilePicture?: string
}

export enum WhatsAppStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  QR_SCAN = 'qr_scan',
  CONNECTED = 'connected',
  FAILED = 'failed'
}

// Filtros e buscas
export interface ChatFilter {
  search?: string
  status?: 'all' | 'unread' | 'archived' | 'pinned'
  labels?: string[]
  hasTicket?: boolean
  ticketStatus?: TicketStatus
  dateFrom?: Date
  dateTo?: Date
}

export interface MessageFilter {
  search?: string
  type?: MessageType
  hasMedia?: boolean
  isStarred?: boolean
  dateFrom?: Date
  dateTo?: Date
}

// Eventos em tempo real
export interface ChatEvent {
  type: ChatEventType
  chatId: string
  data: any
  timestamp: Date
}

export enum ChatEventType {
  NEW_MESSAGE = 'new_message',
  MESSAGE_UPDATE = 'message_update',
  MESSAGE_DELETE = 'message_delete',
  MESSAGE_REACTION = 'message_reaction',
  CHAT_UPDATE = 'chat_update',
  CONTACT_UPDATE = 'contact_update',
  TYPING_START = 'typing_start',
  TYPING_STOP = 'typing_stop',
  PRESENCE_UPDATE = 'presence_update',
  CONNECTION_UPDATE = 'connection_update'
}

// Estatísticas
export interface ChatStats {
  totalChats: number
  unreadChats: number
  totalMessages: number
  messagesPerDay: { date: string; count: number }[]
  responseTime: {
    average: number
    median: number
    p95: number
  }
  ticketStats: {
    open: number
    inProgress: number
    resolved: number
    closed: number
  }
}

// Configurações do chat
export interface ChatSettings {
  notifications: {
    sound: boolean
    desktop: boolean
    email: boolean
  }
  appearance: {
    theme: 'light' | 'dark' | 'auto'
    fontSize: 'small' | 'medium' | 'large'
    bubbleStyle: 'modern' | 'classic'
  }
  privacy: {
    readReceipts: boolean
    onlineStatus: boolean
    lastSeen: boolean
  }
  shortcuts: Record<string, string>
  autoResponses: {
    enabled: boolean
    rules: AutoResponseRule[]
  }
}

export interface AutoResponseRule {
  id: string
  name: string
  trigger: {
    type: 'keyword' | 'time' | 'first_message'
    value: string
  }
  response: {
    type: 'text' | 'template'
    content: string
  }
  conditions: {
    businessHours?: boolean
    chatLabels?: string[]
    contactTags?: string[]
  }
  enabled: boolean
}
