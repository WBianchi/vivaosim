import { NextRequest, NextResponse } from 'next/server'

const WAHA_BASE_URL = process.env.WAHA_API_URL || 'http://159.65.34.199:3001'
const WAHA_API_KEY = process.env.WAHA_API_KEY || 'tappyone-waha-2024-secretkey'

interface SendMessageRequest {
  chatId: string
  sessionId?: string
  message: string
  type?: 'text' | 'image' | 'video' | 'audio' | 'document' | 'location' | 'contact'
  mediaUrl?: string
  fileName?: string
  caption?: string
  latitude?: number
  longitude?: number
  contactName?: string
  contactPhone?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: SendMessageRequest = await request.json()
    const { chatId, sessionId, message, type = 'text', mediaUrl, fileName, caption, latitude, longitude, contactName, contactPhone } = body

    if (!chatId || !message) {
      return NextResponse.json(
        { error: 'chatId and message are required' },
        { status: 400 }
      )
    }

    // Buscar sessão ativa se não foi fornecida
    let finalSessionId = sessionId
    if (!finalSessionId) {
      const sessionsResponse = await fetch(`${WAHA_BASE_URL}/api/sessions`, {
        headers: {
          'X-Api-Key': WAHA_API_KEY
        }
      })

      if (!sessionsResponse.ok) {
        throw new Error('Failed to fetch sessions')
      }

      const sessions = await sessionsResponse.json()
      const activeSession = sessions.find((s: any) => s.status === 'WORKING')
      
      if (!activeSession) {
        return NextResponse.json(
          { error: 'No active WhatsApp session found' },
          { status: 503 }
        )
      }

      finalSessionId = activeSession.name
    }

    console.log('📤 Enviando mensagem:', {
      session: finalSessionId,
      chatId,
      type,
      message: message.substring(0, 50) + '...'
    })

    // Preparar payload baseado no tipo
    let payload: any = {
      chatId,
      text: message
    }

    // Adicionar campos específicos por tipo
    switch (type) {
      case 'image':
      case 'video':
      case 'audio':
      case 'document':
        if (mediaUrl) {
          payload.file = {
            url: mediaUrl,
            filename: fileName
          }
          if (caption) payload.caption = caption
        }
        break
      
      case 'location':
        if (latitude && longitude) {
          payload.latitude = latitude
          payload.longitude = longitude
        }
        break
      
      case 'contact':
        if (contactName && contactPhone) {
          payload.contact = {
            name: contactName,
            phone: contactPhone
          }
        }
        break
    }

    // Enviar mensagem via WAHA
    // Endpoint correto: /api/sendText para texto
    let endpoint = `${WAHA_BASE_URL}/api/sendText`
    
    // Ajustar endpoint e payload baseado no tipo
    switch (type) {
      case 'text':
        endpoint = `${WAHA_BASE_URL}/api/sendText`
        payload = {
          session: finalSessionId,
          chatId,
          text: message
        }
        break
      case 'image':
        endpoint = `${WAHA_BASE_URL}/api/sendImage`
        payload = {
          session: finalSessionId,
          chatId,
          file: { url: mediaUrl, filename: fileName },
          caption: caption || ''
        }
        break
      case 'video':
        endpoint = `${WAHA_BASE_URL}/api/sendVideo`
        payload = {
          session: finalSessionId,
          chatId,
          file: { url: mediaUrl, filename: fileName },
          caption: caption || ''
        }
        break
      case 'audio':
        endpoint = `${WAHA_BASE_URL}/api/sendVoice`
        payload = {
          session: finalSessionId,
          chatId,
          file: { url: mediaUrl, filename: fileName }
        }
        break
      case 'document':
        endpoint = `${WAHA_BASE_URL}/api/sendFile`
        payload = {
          session: finalSessionId,
          chatId,
          file: { url: mediaUrl, filename: fileName },
          caption: caption || ''
        }
        break
      case 'location':
        endpoint = `${WAHA_BASE_URL}/api/sendLocation`
        payload = {
          session: finalSessionId,
          chatId,
          latitude,
          longitude
        }
        break
      case 'contact':
        endpoint = `${WAHA_BASE_URL}/api/sendContact`
        payload = {
          session: finalSessionId,
          chatId,
          contactId: contactPhone,
          name: contactName
        }
        break
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': WAHA_API_KEY
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      let errorDetails = response.statusText
      try {
        const errorData = await response.json()
        errorDetails = JSON.stringify(errorData)
      } catch {
        errorDetails = await response.text()
      }
      console.error('❌ Erro WAHA:', {
        status: response.status,
        statusText: response.statusText,
        details: errorDetails,
        endpoint,
        payload
      })
      throw new Error(`WAHA API error: ${response.statusText} - ${errorDetails}`)
    }

    const result = await response.json()
    console.log('✅ Mensagem enviada com sucesso:', result.id)

    return NextResponse.json({
      success: true,
      messageId: result.id,
      timestamp: result.timestamp
    })

  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
