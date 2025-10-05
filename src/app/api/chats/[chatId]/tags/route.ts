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

// PUT /api/chats/[chatId]/tags - Atualizar tags do chat
export async function PUT(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log(`👤 User autenticado:`, user)

    const { chatId } = params
    const body = await request.json()
    const { tagIds } = body

    console.log(`🔍 Atualizando tags do chat: ${chatId}`)
    console.log(`📋 Tags selecionadas:`, tagIds)

    if (!Array.isArray(tagIds)) {
      return NextResponse.json({ error: 'tagIds must be an array' }, { status: 400 })
    }

    // Remover todas as tags atuais do chat (usar chatId diretamente como string)
    await prisma.whatsAppChatTag.deleteMany({
      where: {
        chatId: chatId, // WhatsApp ID como string
        tag: {
          userId: user.userId
        }
      }
    })

    // Adicionar as novas tags
    if (tagIds.length > 0) {
      await prisma.whatsAppChatTag.createMany({
        data: tagIds.map(tagId => ({
          chatId: chatId, // WhatsApp ID como string
          tagId
        })),
        skipDuplicates: true
      })
      console.log(`✅ ${tagIds.length} tags adicionadas`)
    }

    // Buscar as tags atualizadas para retornar
    const updatedTags = await prisma.whatsAppChatTag.findMany({
      where: {
        chatId: chatId, // WhatsApp ID como string
        tag: {
          userId: user.userId
        }
      },
      include: {
        tag: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      tags: updatedTags.map(ct => ct.tag)
    })
  } catch (error) {
    console.error('Erro ao atualizar tags do chat:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar tags' },
      { status: 500 }
    )
  }
}

// GET /api/chats/[chatId]/tags - Buscar tags do chat
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

    const chatTags = await prisma.whatsAppChatTag.findMany({
      where: {
        chatId,
        tag: {
          userId: user.userId
        }
      },
      include: {
        tag: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      tags: chatTags.map(ct => ct.tag)
    })
  } catch (error) {
    console.error('Erro ao buscar tags do chat:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar tags' },
      { status: 500 }
    )
  }
}
