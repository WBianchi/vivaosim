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

// Buscar sessão ativa (mesma lógica da overview)
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

    // Encontrar sessão ativa
    const session = await findActiveSession()
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

    // Transformar mensagens WAHA para nosso formato
    const messages = wahaMessages.map((wahaMsg: any) => ({
      id: wahaMsg.id,
      chatId: chatId,
      from: wahaMsg.from,
      to: wahaMsg.to,
      body: wahaMsg.body || wahaMsg.caption || '',
      type: wahaMsg.type || 'text',
      timestamp: new Date(wahaMsg.timestamp * 1000),
      hasMedia: wahaMsg.hasMedia || false,
      mediaUrl: wahaMsg.mediaUrl || wahaMsg.media?.url,
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
    }))

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
