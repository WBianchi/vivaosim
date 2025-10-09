import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

async function verifyAuth(request: NextRequest) {
  const headersList = await headers()
  const authorization = headersList.get('authorization')

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null
  }

  const token = authorization.substring(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }
}

// GET /api/quotes/by-chats?chatIds=xxx,yyy,zzz - Busca orçamentos de múltiplos chats (BATCH)
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const chatIdsParam = searchParams.get('chatIds')

    if (!chatIdsParam) {
      return NextResponse.json({ error: 'chatIds parameter is required' }, { status: 400 })
    }

    // Converter string separada por vírgula em array
    const chatIds = chatIdsParam.split(',').filter(Boolean)

    if (chatIds.length === 0) {
      return NextResponse.json({ success: true, quotes: [] })
    }

    // Buscar todos orçamentos dos chats de uma vez (BATCH)
    const quotes = await prisma.quote.findMany({
      where: {
        chatId: {
          in: chatIds
        },
        contact: {
          userId: user.id
        }
      },
      select: {
        id: true,
        chatId: true,
        title: true,
        description: true,
        total: true,
        discount: true,
        validUntil: true,
        status: true,
        createdAt: true,
        contact: {
          select: {
            id: true,
            name: true
          }
        },
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      quotes
    })
  } catch (error) {
    console.error('Erro ao buscar orçamentos por chats:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar orçamentos' },
      { status: 500 }
    )
  }
}
