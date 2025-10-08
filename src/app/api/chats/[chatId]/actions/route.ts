import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const WAHA_BASE_URL = process.env.WAHA_API_URL || 'http://159.65.34.199:3001'
const WAHA_API_KEY = process.env.WAHA_API_KEY || 'tappyone-waha-2024-secretkey'

interface DecodedToken {
  userId: string
  [key: string]: unknown
}

async function verifyAuth(): Promise<DecodedToken | null> {
  const headersList = headers()
  const authorization = headersList.get('authorization')

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null
  }

  const token = authorization.substring(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken
    return decoded
  } catch (error) {
    console.error('❌ Erro ao verificar token:', error)
    return null
  }
}

// POST - Executar ações no chat (favorite, archive, delete)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const user = await verifyAuth()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { chatId } = await params
    const decodedChatId = decodeURIComponent(chatId)

    const body = await request.json()
    const { action } = body as { action: 'favorite' | 'unfavorite' | 'archive' | 'unarchive' | 'delete' }

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 })
    }

    console.log(`🎯 Executando ação "${action}" no chat: ${decodedChatId}`)

    // Buscar sessão ativa do usuário
    const session = await prisma.whatsAppSession.findFirst({
      where: {
        userId: user.userId,
        status: 'WORKING'
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    if (!session) {
      return NextResponse.json({ 
        error: 'Nenhuma sessão WhatsApp ativa encontrada' 
      }, { status: 400 })
    }

    // Buscar ou criar registro do chat no banco
    let whatsappChat = await prisma.whatsAppChat.findUnique({
      where: {
        sessionId_chatId: {
          sessionId: session.id,
          chatId: decodedChatId
        }
      }
    })

    // Se não existe, criar
    if (!whatsappChat) {
      whatsappChat = await prisma.whatsAppChat.create({
        data: {
          chatId: decodedChatId,
          sessionId: session.id,
          name: decodedChatId,
          isGroup: false,
          archived: false,
          pinned: false
        }
      })
    }

    // Executar ação
    switch (action) {
      case 'favorite':
        whatsappChat = await prisma.whatsAppChat.update({
          where: { id: whatsappChat.id },
          data: { pinned: true }
        })
        console.log('⭐ Chat favoritado (pinned)')
        break

      case 'unfavorite':
        whatsappChat = await prisma.whatsAppChat.update({
          where: { id: whatsappChat.id },
          data: { pinned: false }
        })
        console.log('📌 Chat desfavoritado (unpinned)')
        break

      case 'archive':
        // Atualizar no banco
        whatsappChat = await prisma.whatsAppChat.update({
          where: { id: whatsappChat.id },
          data: { archived: true }
        })

        // Tentar arquivar no WAHA também
        try {
          const wahaResponse = await fetch(
            `${WAHA_BASE_URL}/api/${session.sessionId}/chats/${decodedChatId}/archive`,
            {
              method: 'POST',
              headers: {
                'X-Api-Key': WAHA_API_KEY,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ archive: true })
            }
          )

          if (wahaResponse.ok) {
            console.log('📦 Chat arquivado no WAHA também')
          } else {
            console.warn('⚠️ Não foi possível arquivar no WAHA, mas foi arquivado localmente')
          }
        } catch (err) {
          console.warn('⚠️ Erro ao arquivar no WAHA:', err)
        }

        console.log('📦 Chat arquivado')
        break

      case 'unarchive':
        // Atualizar no banco
        whatsappChat = await prisma.whatsAppChat.update({
          where: { id: whatsappChat.id },
          data: { archived: false }
        })

        // Tentar desarquivar no WAHA também
        try {
          const wahaResponse = await fetch(
            `${WAHA_BASE_URL}/api/${session.sessionId}/chats/${decodedChatId}/archive`,
            {
              method: 'POST',
              headers: {
                'X-Api-Key': WAHA_API_KEY,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ archive: false })
            }
          )

          if (wahaResponse.ok) {
            console.log('📂 Chat desarquivado no WAHA também')
          }
        } catch (err) {
          console.warn('⚠️ Erro ao desarquivar no WAHA:', err)
        }

        console.log('📂 Chat desarquivado')
        break

      case 'delete':
        // Deletar do banco (soft delete mantendo histórico)
        await prisma.whatsAppChat.delete({
          where: { id: whatsappChat.id }
        })

        // Tentar deletar no WAHA também
        try {
          const wahaResponse = await fetch(
            `${WAHA_BASE_URL}/api/${session.sessionId}/chats/${decodedChatId}`,
            {
              method: 'DELETE',
              headers: {
                'X-Api-Key': WAHA_API_KEY
              }
            }
          )

          if (wahaResponse.ok) {
            console.log('🗑️ Chat deletado no WAHA também')
          } else {
            console.warn('⚠️ Não foi possível deletar no WAHA')
          }
        } catch (err) {
          console.warn('⚠️ Erro ao deletar no WAHA:', err)
        }

        console.log('🗑️ Chat deletado')
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      action,
      chat: {
        id: whatsappChat.id,
        chatId: whatsappChat.chatId,
        archived: whatsappChat.archived,
        pinned: whatsappChat.pinned
      }
    })

  } catch (error) {
    console.error('❌ Erro ao executar ação no chat:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
