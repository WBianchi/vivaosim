import { NextRequest, NextResponse } from 'next/server'

const WAHA_BASE_URL = process.env.WAHA_API_URL || 'http://159.65.34.199:3001'
const WAHA_API_KEY = process.env.WAHA_API_KEY || 'tappyone-waha-2024-secretkey'

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

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

    console.log('📱 Buscando contatos da sessão:', finalSessionId)

    // Buscar contatos do WhatsApp via WAHA
    const response = await fetch(`${WAHA_BASE_URL}/api/contacts/all?session=${finalSessionId}`, {
      headers: {
        'X-Api-Key': WAHA_API_KEY
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch contacts')
    }

    const contacts = await response.json()
    
    // Formatar contatos
    const formattedContacts = contacts.map((contact: any) => ({
      id: contact.id,
      name: contact.name || contact.notify || contact.pushname,
      pushname: contact.pushname,
      number: contact.id.replace('@c.us', '').replace('@s.whatsapp.net', ''),
      isBusiness: contact.isBusiness || false
    })).filter((c: any) => !c.id.includes('@g.us')) // Remover grupos

    console.log(`✅ ${formattedContacts.length} contatos encontrados`)

    return NextResponse.json({
      success: true,
      contacts: formattedContacts
    })

  } catch (error) {
    console.error('❌ Erro ao buscar contatos:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch contacts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
