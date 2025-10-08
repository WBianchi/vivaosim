import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
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

// Buscar sessão ativa VINCULADA ao banco de dados
async function findActiveSession(userId: string) {
  try {
    console.log('🔍 Buscando sessões vinculadas do usuário...')
    
    // Buscar apenas sessões vinculadas ao banco de dados do usuário
    const dbSessions = await prisma.whatsAppSession.findMany({
      where: {
        userId: userId,
        status: 'WORKING'
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
    
    console.log('📋 Sessões vinculadas encontradas:', dbSessions.length)
    
    if (dbSessions.length === 0) {
      console.log('⚠️ Nenhuma sessão vinculada e ativa encontrada')
      return null
    }
    
    // Usar a primeira sessão WORKING vinculada
    const session = dbSessions[0]
    
    // Verificar se ainda está WORKING no WAHA
    const activeSession = { name: session.sessionId, status: 'WORKING' as const }
    
    if (activeSession) {
      console.log('✅ Sessão ativa encontrada:', activeSession.name)
      return activeSession
    }
    
    console.log('⚠️ Nenhuma sessão WORKING encontrada')
    return null
    
  } catch (error) {
    console.error('❌ Erro ao buscar sessões ativas:', error)
    return null
  }
}

// GET - Buscar mensagens do chat
export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { chatId } = params
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId') || `session-${user.id}`
    const limit = parseInt(searchParams.get('limit') || '50')
    const downloadMedia = searchParams.get('downloadMedia') === 'true'

    console.log('💬 Buscando mensagens - ChatId:', chatId, 'SessionId:', sessionId)

    // Encontrar sessão ativa vinculada ao usuário
    const session = await findActiveSession(user.userId)
    if (!session || session.status !== 'WORKING') {
      return NextResponse.json({
        error: 'WhatsApp session not connected',
        code: 'SESSION_NOT_CONNECTED',
        messages: []
      })
    }

    const finalSessionId = session.name

    // Buscar mensagens na WAHA
    const wahaUrl = `${WAHA_BASE_URL}/api/${finalSessionId}/chats/${chatId}/messages?limit=${limit}&downloadMedia=${downloadMedia}`
    console.log('🔗 WAHA URL:', wahaUrl)

    const response = await fetch(wahaUrl, {
      method: 'GET',
      headers: {
        'X-Api-Key': WAHA_API_KEY,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('❌ Erro WAHA mensagens:', response.status, response.statusText)
      
      if (response.status === 404) {
        return NextResponse.json({
          error: 'Chat not found',
          code: 'CHAT_NOT_FOUND',
          messages: []
        })
      }
      
      return NextResponse.json({ 
        error: 'Failed to fetch messages',
        wahaError: response.statusText,
        code: 'WAHA_API_ERROR'
      }, { status: response.status })
    }

    const wahaMessages = await response.json()
    console.log(`✅ WAHA retornou ${wahaMessages.length} mensagens`)
    
    // 🐛 DEBUG: Ver estrutura das mensagens do WAHA
    if (wahaMessages.length > 0) {
      console.log('🐛 [DEBUG] Primeira mensagem do WAHA:', JSON.stringify(wahaMessages[0], null, 2))
    }

    // Transformar mensagens WAHA para nosso formato
    const messages = wahaMessages.map((wahaMsg: any) => {
      // 🎯 Detectar tipo correto baseado em hasMedia e mimetype
      let messageType = 'text'
      
      if (wahaMsg.hasMedia && wahaMsg.media) {
        const mimetype = wahaMsg.media.mimetype || ''
        
        if (mimetype.startsWith('image/')) {
          messageType = 'image'
        } else if (mimetype.startsWith('video/')) {
          messageType = 'video'
        } else if (mimetype.startsWith('audio/') || mimetype.includes('ogg')) {
          messageType = 'audio'
        } else {
          messageType = 'document'
        }
      } else if (wahaMsg.location) {
        messageType = 'location'
      } else if (wahaMsg.vcard) {
        messageType = 'contact'
      }
      
      // 🐛 DEBUG: Log de cada mensagem
      if (wahaMsg.hasMedia || messageType !== 'text') {
        console.log('🐛 [DEBUG] Mensagem processada:', {
          id: wahaMsg.id,
          typeOriginal: wahaMsg.type,
          typeDetectado: messageType,
          hasMedia: wahaMsg.hasMedia,
          mimetype: wahaMsg.media?.mimetype,
          mediaUrl: wahaMsg.mediaUrl || wahaMsg.media?.url
        })
      }
      
      // 🔧 Corrigir URL da mídia (substituir localhost pela URL da app)
      let mediaUrl = wahaMsg.mediaUrl || wahaMsg.media?.url
      if (mediaUrl && mediaUrl.includes('localhost:3000')) {
        // Substituir localhost pela URL da aplicação
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vivaosim.vercel.app'
        mediaUrl = mediaUrl.replace('http://localhost:3000', appUrl)
      }
      
      return ({
      id: wahaMsg.id,
      chatId: chatId,
      from: wahaMsg.from,
      to: wahaMsg.to,
      body: wahaMsg.body || wahaMsg.caption || '',
      type: messageType,
      timestamp: new Date(wahaMsg.timestamp * 1000),
      hasMedia: wahaMsg.hasMedia || false,
      mediaUrl: mediaUrl,
      mimeType: wahaMsg.media?.mimetype,
      fileName: wahaMsg.media?.filename,
      isForwarded: wahaMsg.isForwarded || false,
      isFromMe: wahaMsg.fromMe || false,
      isGif: wahaMsg.isGif || false,
      isStarred: wahaMsg.isStarred || false,
      location: wahaMsg.location ? {
        latitude: wahaMsg.location.latitude,
        longitude: wahaMsg.location.longitude,
        description: wahaMsg.location.description
      } : undefined,
      vcard: wahaMsg.vcard,
      quotedMessage: wahaMsg.quotedMessage ? {
        id: wahaMsg.quotedMessage.id,
        body: wahaMsg.quotedMessage.body,
        from: wahaMsg.quotedMessage.from
      } : undefined,
      reactions: wahaMsg.reactions || [],
      ack: wahaMsg.ack || 0,
      editedTimestamp: wahaMsg.editedTimestamp ? new Date(wahaMsg.editedTimestamp * 1000) : undefined,
      revokedTimestamp: wahaMsg.revokedTimestamp ? new Date(wahaMsg.revokedTimestamp * 1000) : undefined
      })
    })

    return NextResponse.json({
      success: true,
      messages,
      total: messages.length,
      chatId,
      sessionId: finalSessionId
    })

  } catch (error) {
    console.error('❌ Erro interno ao buscar mensagens:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
