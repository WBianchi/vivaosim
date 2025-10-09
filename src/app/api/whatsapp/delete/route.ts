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

    const { messageId, chatId } = await request.json()

    if (!messageId || !chatId) {
      return NextResponse.json(
        { error: 'messageId e chatId são obrigatórios' },
        { status: 400 }
      )
    }

    // Deletar mensagem via WAHA
    // https://waha.devlike.pro/docs/how-to/send-messages/#delete-message
    const response = await fetch(`${WAHA_URL}/api/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': WAHA_API_KEY || ''
      },
      body: JSON.stringify({
        session: 'default',
        chatId: chatId
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Erro WAHA ao deletar:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar mensagem' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Mensagem deletada com sucesso'
    })
  } catch (error) {
    console.error('Erro ao deletar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar mensagem' },
      { status: 500 }
    )
  }
}
