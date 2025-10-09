import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

async function verifyAuth(request: NextRequest) {
  const authorization = request.headers.get('authorization')
  if (!authorization?.startsWith('Bearer ')) return null

  try {
    const token = authorization.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch {
    return null
  }
}

// GET - Buscar chat por ID
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

    // Buscar chat no banco de dados
    const chat = await prisma.whatsAppChat.findUnique({
      where: { id: chatId },
      include: {
        contact: true
      }
    })

    if (!chat) {
      return NextResponse.json({ 
        error: 'Chat not found',
        chat: null 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      chat 
    })

  } catch (error) {
    console.error('Erro ao buscar chat:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
