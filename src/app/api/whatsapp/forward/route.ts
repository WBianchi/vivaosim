import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/jwt'

const WAHA_URL = process.env.WAHA_URL || 'http://localhost:3000'
const WAHA_API_KEY = process.env.WAHA_API_KEY

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const payload = verifyAccessToken(accessToken)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 403 })
    }

    const { messageId, chatId, toChatId } = await request.json()

    if (!messageId || !chatId) {
      return NextResponse.json(
        { error: 'messageId e chatId são obrigatórios' },
        { status: 400 }
      )
    }

    // Encaminhar mensagem via WAHA
    // https://waha.devlike.pro/docs/how-to/send-messages/#forward-message
    const response = await fetch(`${WAHA_URL}/api/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': WAHA_API_KEY || ''
      },
      body: JSON.stringify({
        session: 'default',
        chatId: toChatId || chatId,
        forward: {
          messageId: messageId,
          fromChatId: chatId
        }
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Erro WAHA ao encaminhar:', error)
      return NextResponse.json(
        { error: 'Erro ao encaminhar mensagem' },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      message: 'Mensagem encaminhada com sucesso',
      data
    })
  } catch (error) {
    console.error('Erro ao encaminhar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro ao encaminhar mensagem' },
      { status: 500 }
    )
  }
}
