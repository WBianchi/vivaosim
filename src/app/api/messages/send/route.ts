import { NextRequest, NextResponse } from 'next/server'

const WAHA_BASE_URL = process.env.WAHA_API_URL || 'http://159.65.34.199:3001'
const WAHA_API_KEY = process.env.WAHA_API_KEY || 'tappyone-waha-2024-secretkey'

interface SendMessageRequest {
  chatId: string
  sessionId?: string
  message: string
  type?: 'text' | 'image' | 'video' | 'audio' | 'document' | 'location' | 'contact' | 'poll' | 'list' | 'event'
  mediaUrl?: string
  fileName?: string
  mimeType?: string
  caption?: string
  latitude?: number
  longitude?: number
  contactName?: string
  contactPhone?: string
  pollData?: any
  listData?: any
  eventData?: any
}

export async function POST(request: NextRequest) {
  try {
    const body: SendMessageRequest = await request.json()
    const { chatId, sessionId, message, type = 'text', mediaUrl, fileName, mimeType, caption, latitude, longitude, contactName, contactPhone, pollData, listData, eventData } = body

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
          file: { 
            url: mediaUrl, 
            filename: fileName,
            mimetype: mimeType || 'image/jpeg'
          },
          caption: caption || ''
        }
        break
      case 'video':
        endpoint = `${WAHA_BASE_URL}/api/sendVideo`
        payload = {
          session: finalSessionId,
          chatId,
          file: { 
            url: mediaUrl, 
            filename: fileName,
            mimetype: mimeType || 'video/mp4'
          },
          caption: caption || ''
        }
        break
      case 'audio':
        endpoint = `${WAHA_BASE_URL}/api/sendVoice`
        payload = {
          session: finalSessionId,
          chatId,
          file: { 
            url: mediaUrl, 
            filename: fileName,
            mimetype: mimeType || 'audio/ogg'
          }
        }
        break
      case 'document':
        endpoint = `${WAHA_BASE_URL}/api/sendFile`
        payload = {
          session: finalSessionId,
          chatId,
          file: { 
            url: mediaUrl, 
            filename: fileName,
            mimetype: mimeType || 'application/pdf'
          },
          caption: caption || ''
        }
        break
      case 'location':
        endpoint = `${WAHA_BASE_URL}/api/sendLocation`
        payload = {
          session: finalSessionId,
          chatId,
          latitude: parseFloat(latitude as any),
          longitude: parseFloat(longitude as any),
          title: message || 'Localização'
        }
        break
      case 'contact':
        endpoint = `${WAHA_BASE_URL}/api/sendContactVcard`
        payload = {
          session: finalSessionId,
          chatId,
          contacts: [
            {
              fullName: contactName,
              phoneNumber: contactPhone,
              whatsappId: contactPhone.replace(/[^0-9]/g, '') // Apenas números, sem @c.us
            }
          ]
        }
        break
      case 'poll':
        endpoint = `${WAHA_BASE_URL}/api/sendPoll`
        payload = {
          session: finalSessionId,
          chatId,
          poll: {
            name: pollData.question,
            options: pollData.options,
            multipleAnswers: pollData.allowMultipleAnswers || false
          }
        }
        break
      case 'list':
        endpoint = `${WAHA_BASE_URL}/api/sendList`
        // Ajustar formato: buttonText -> button e adicionar rowId
        const formattedSections = listData.sections.map((section: any) => ({
          ...section,
          rows: section.rows.map((row: any, index: number) => ({
            title: row.title,
            rowId: row.rowId || `row_${index}`,
            description: row.description || null
          }))
        }))
        
        payload = {
          session: finalSessionId,
          chatId,
          reply_to: null,
          message: {
            title: listData.title,
            description: listData.description,
            button: listData.buttonText || 'Ver opções',
            sections: formattedSections
          }
        }
        break
      case 'event':
        endpoint = `${WAHA_BASE_URL}/api/${finalSessionId}/events`
        // Converter para formato Unix timestamp
        const startDateTime = `${eventData.startDate}T${eventData.startTime}:00`
        const startTime = Math.floor(new Date(startDateTime).getTime() / 1000)
        
        payload = {
          chatId,
          event: {
            name: eventData.title,
            startTime: startTime,
            isCanceled: false,
            extraGuestsAllowed: true
          }
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
