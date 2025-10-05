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

// GET /api/tags/by-chats?chatIds=xxx,yyy,zzz - Busca tags de múltiplos chats (BATCH)
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
      return NextResponse.json({ success: true, tags: [] })
    }

    // Buscar todas as tags dos chats de uma vez (BATCH)
    const chatTags = await prisma.whatsAppChatTag.findMany({
      where: {
        chatId: {
          in: chatIds
        },
        tag: {
          userId: user.userId
        }
      },
      include: {
        tag: true
      }
    })

    // Agrupar por chatId
    const tagsByChat = chatTags.reduce((acc: any, chatTag: any) => {
      if (!acc[chatTag.chatId]) {
        acc[chatTag.chatId] = []
      }
      acc[chatTag.chatId].push({
        id: chatTag.tag.id,
        name: chatTag.tag.name,
        color: chatTag.tag.color
      })
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      tagsByChat
    })
  } catch (error) {
    console.error('Erro ao buscar tags por chats:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar tags' },
      { status: 500 }
    )
  }
}
