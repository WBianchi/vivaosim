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

// GET - Listar chats de uma sessão
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId } = params

    console.log('📋 Buscando chats da sessão:', sessionId)

    // Buscar chats do WAHA
    const chatsResponse = await fetch(`${WAHA_BASE_URL}/api/${sessionId}/chats`, {
      method: 'GET',
      headers: {
        'X-Api-Key': WAHA_API_KEY,
      }
    })

    if (!chatsResponse.ok) {
      console.log('❌ Erro ao buscar chats:', chatsResponse.status)
      return NextResponse.json({ error: 'Failed to fetch chats' }, { status: chatsResponse.status })
    }

    const chats = await chatsResponse.json()
    console.log('✅ Chats encontrados:', chats.length)

    return NextResponse.json(chats)

  } catch (error) {
    console.error('Error fetching chats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
