import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'

const WAHA_BASE_URL = process.env.WAHA_API_URL || 'http://159.65.34.199:3001'
const WAHA_API_KEY = process.env.WAHA_API_KEY || 'tappyone-waha-2024-secretkey'
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Verificar autenticação
async function verifyAuth(request: NextRequest) {
  const headersList = headers()
  const authorization = headersList.get('authorization')

  if (!authorization?.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authorization.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch {
    return null
  }
}

// Interface para os dados do chat da WAHA
interface WAHAChat {
  id: string
  name?: string
  isGroup: boolean
  timestamp?: number
  archived?: boolean
  pinned?: boolean
  muteExpiration?: number
  lastMessage?: {
    id: string
    from: string
    to: string
    body?: string
    timestamp: number
    fromMe: boolean
    hasMedia: boolean
    type: string
    ack?: number
  }
  contact?: {
    id: string
    name?: string
    pushName?: string
    shortName?: string
    profilePictureUrl?: string
    isBlocked: boolean
    isBusiness: boolean
    isEnterprise: boolean
    isGroup: boolean
    isMyContact: boolean
  }
}

// Buscar sessão ativa (WORKING) na WAHA
async function findActiveSession() {
  try {
    console.log('🔍 Buscando sessões ativas na WAHA...')
    
    const response = await fetch(`${WAHA_BASE_URL}/api/sessions`, {
      method: 'GET',
      headers: {
        'X-Api-Key': WAHA_API_KEY,
      }
    })
    
    if (!response.ok) {
      console.error('❌ Erro ao listar sessões WAHA:', response.status)
      return null
    }
    
    const sessions = await response.json()
    console.log('📋 Sessões encontradas:', sessions.length)
    
    // Procurar por sessão WORKING
    const activeSession = sessions.find((session: any) => session.status === 'WORKING')
    
    if (activeSession) {
      console.log('✅ Sessão ativa encontrada:', activeSession.name, 'Status:', activeSession.status)
      return activeSession
    }
    
    console.log('⚠️ Nenhuma sessão WORKING encontrada')
    return null
    
  } catch (error) {
    console.error('❌ Erro ao buscar sessões ativas:', error)
    return null
  }
}

// Verificar se sessão específica existe na WAHA
async function checkSessionStatus(sessionId: string) {
  try {
    const response = await fetch(`${WAHA_BASE_URL}/api/sessions/${sessionId}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': WAHA_API_KEY,
      }
    })
    
    if (response.ok) {
      const session = await response.json()
      console.log('📊 Status da sessão WAHA:', session.status)
      return session
    } else {
      console.log('⚠️ Sessão não encontrada na WAHA:', sessionId)
      return null
    }
  } catch (error) {
    console.error('❌ Erro ao verificar sessão:', error)
    return null
  }
}

// Criar sessão na WAHA se não existir
async function createSessionIfNeeded(sessionId: string) {
  try {
    console.log('🔄 Criando sessão WAHA:', sessionId)
    
    const response = await fetch(`${WAHA_BASE_URL}/api/sessions`, {
      method: 'POST',
      headers: {
        'X-Api-Key': WAHA_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: sessionId,
        config: {
          webhooks: [],
          proxy: null
        }
      })
    })
    
    if (response.ok) {
      const session = await response.json()
      console.log('✅ Sessão WAHA criada:', session)
      return session
    } else {
      console.error('❌ Erro ao criar sessão WAHA:', response.status, await response.text())
      return null
    }
  } catch (error) {
    console.error('❌ Erro ao criar sessão WAHA:', error)
    return null
  }
}

// GET - Buscar overview dos chats
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId') || `session-${user.userId}`
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    console.log('📱 Buscando chats overview - SessionId solicitado:', sessionId)

    // Primeiro tentar encontrar qualquer sessão ativa
    let session = await findActiveSession()
    let finalSessionId = sessionId
    
    if (session) {
      // Usar a sessão ativa encontrada
      finalSessionId = session.name
      console.log('🎯 Usando sessão ativa:', finalSessionId)
    } else {
      // Se não encontrou sessão ativa, verificar a específica
      session = await checkSessionStatus(sessionId)
      
      // Se não existe, criar sessão
      if (!session) {
        session = await createSessionIfNeeded(sessionId)
        if (!session) {
          return NextResponse.json({ 
            error: 'Failed to create WhatsApp session',
            code: 'SESSION_CREATION_FAILED'
          }, { status: 500 })
        }
      }
    }

    // Verificar se sessão está conectada
    if (session.status !== 'WORKING') {
      console.log('⚠️ Sessão não está conectada. Status:', session.status)
      return NextResponse.json({
        error: 'WhatsApp session not connected',
        sessionStatus: session.status,
        code: 'SESSION_NOT_CONNECTED',
        chats: [], // Retorna lista vazia mas não erro para não quebrar UI
        total: 0,
        limit,
        offset,
        sessionId: finalSessionId
      })
    }

    // Buscar chats na WAHA usando a sessão correta
    const response = await fetch(`${WAHA_BASE_URL}/api/${finalSessionId}/chats/overview`, {
      method: 'GET',
      headers: {
        'X-Api-Key': WAHA_API_KEY,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('❌ Erro WAHA chats overview:', response.status, response.statusText)
      
      // Se 422, provavelmente a sessão precisa ser recriada
      if (response.status === 422) {
        console.log('🔄 Tentando recriar sessão devido a erro 422...')
        const newSession = await createSessionIfNeeded(sessionId)
        if (newSession) {
          return NextResponse.json({
            error: 'Session recreated, please scan QR code',
            sessionStatus: 'SCAN_QR_CODE',
            code: 'SESSION_RECREATED',
            chats: [],
            total: 0,
            limit,
            offset,
            sessionId
          })
        }
      }
      
      return NextResponse.json({ 
        error: 'Failed to fetch chats',
        wahaError: response.statusText,
        code: 'WAHA_API_ERROR'
      }, { status: response.status })
    }

    const wahaChats: WAHAChat[] = await response.json()
    console.log(`✅ WAHA retornou ${wahaChats.length} chats`)

    // Transformar dados WAHA para nosso formato
    const chats = await Promise.all(wahaChats.map(async (wahaChat) => {
      // Buscar URL real da foto diretamente da WAHA
      let profilePictureUrl: string | undefined
      
      try {
        const pictureResponse = await fetch(
          `${WAHA_BASE_URL}/api/${finalSessionId}/chats/${wahaChat.id}/picture`,
          {
            headers: {
              'X-Api-Key': WAHA_API_KEY
            }
          }
        )
        
        if (pictureResponse.ok) {
          const pictureData = await pictureResponse.json()
          profilePictureUrl = pictureData.url
        }
      } catch (error) {
        console.log('⚠️ Erro ao buscar foto:', wahaChat.id)
      }
      
      return {
      id: wahaChat.id,
      name: wahaChat.name || wahaChat.contact?.name || wahaChat.contact?.pushName || wahaChat.id,
      contact: wahaChat.contact ? {
        id: wahaChat.contact.id,
        name: wahaChat.contact.name || wahaChat.contact.pushName,
        firstName: wahaChat.contact.name?.split(' ')[0],
        lastName: wahaChat.contact.name?.split(' ').slice(1).join(' '),
        phone: wahaChat.contact.id.replace('@c.us', ''),
        profilePicture: profilePictureUrl,
        isBlocked: wahaChat.contact.isBlocked,
        isBusiness: wahaChat.contact.isBusiness,
        isEnterprise: wahaChat.contact.isEnterprise,
        isGroup: wahaChat.contact.isGroup,
        isMyContact: wahaChat.contact.isMyContact,
        tags: [], // TODO: implementar tags
        notes: '', // TODO: implementar notes
        isOnline: false, // TODO: buscar status de presença
        lastSeen: undefined
      } : undefined,
      isGroup: wahaChat.isGroup,
      isArchived: wahaChat.archived || false,
      isMuted: wahaChat.muteExpiration ? wahaChat.muteExpiration > Date.now() : false,
      isPinned: wahaChat.pinned || false,
      unreadCount: 0, // TODO: calcular mensagens não lidas
      lastMessage: wahaChat.lastMessage ? {
        id: wahaChat.lastMessage.id,
        chatId: wahaChat.id,
        from: wahaChat.lastMessage.from,
        to: wahaChat.lastMessage.to,
        body: wahaChat.lastMessage.body,
        type: wahaChat.lastMessage.type as any,
        timestamp: new Date(wahaChat.lastMessage.timestamp * 1000),
        hasMedia: wahaChat.lastMessage.hasMedia,
        isForwarded: false,
        isFromMe: wahaChat.lastMessage.fromMe,
        isGif: false,
        isStarred: false,
        ack: wahaChat.lastMessage.ack as any
      } : undefined,
      lastMessageTimestamp: wahaChat.lastMessage ? 
        new Date(wahaChat.lastMessage.timestamp * 1000) : 
        wahaChat.timestamp ? new Date(wahaChat.timestamp * 1000) : undefined,
      profilePicture: profilePictureUrl,
      participants: wahaChat.isGroup ? [] : undefined, // TODO: buscar participantes para grupos
      description: undefined, // TODO: buscar descrição do grupo
      groupMetadata: wahaChat.isGroup ? {
        owner: '',
        admins: [],
        createdAt: new Date(),
        subject: wahaChat.name || '',
        description: undefined,
        inviteCode: undefined
      } : undefined,
      labels: [], // TODO: implementar labels
      ticket: undefined // TODO: buscar tickets associados
      }
    }))

    // Aplicar paginação
    const paginatedChats = chats.slice(offset, offset + limit)

    // Ordenar por última mensagem
    paginatedChats.sort((a, b) => {
      // Pinados primeiro
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      
      // Depois por timestamp
      const timeA = a.lastMessageTimestamp?.getTime() || 0
      const timeB = b.lastMessageTimestamp?.getTime() || 0
      return timeB - timeA
    })

    return NextResponse.json({
      success: true,
      chats: paginatedChats,
      total: chats.length,
      limit,
      offset,
      sessionId: finalSessionId
    })

  } catch (error) {
    console.error('❌ Erro interno ao buscar chats:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST - Buscar chats com filtros avançados
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      sessionId = `session-${user.userId}`,
      ids = [],
      limit = 50,
      offset = 0,
      filters = {}
    } = body

    console.log('📱 Buscando chats com filtros:', { sessionId, filters, limit, offset })

    // Se temos IDs específicos, usar POST da WAHA
    if (ids.length > 0) {
      const response = await fetch(`${WAHA_BASE_URL}/api/${sessionId}/chats/overview`, {
        method: 'POST',
        headers: {
          'X-Api-Key': WAHA_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids })
      })

      if (!response.ok) {
        console.error('❌ Erro WAHA chats overview POST:', response.status)
        return NextResponse.json({ 
          error: 'Failed to fetch chats',
          wahaError: response.statusText 
        }, { status: response.status })
      }

      const wahaChats = await response.json()
      console.log(`✅ WAHA retornou ${wahaChats.length} chats filtrados`)

      // Transformar e retornar (mesmo código do GET)
      // ... (mesma lógica de transformação)
      
      return NextResponse.json({
        success: true,
        chats: wahaChats, // TODO: aplicar mesma transformação
        total: wahaChats.length,
        limit,
        offset,
        sessionId
      })
    } else {
      // Fallback para GET se não há IDs específicos
      return GET(request)
    }

  } catch (error) {
    console.error('❌ Erro interno ao buscar chats (POST):', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
