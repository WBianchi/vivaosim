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

    // Buscar o chat pelo chatId (WhatsApp ID)
    let chat = await prisma.whatsAppChat.findFirst({
      where: { 
        chatId: chatId
      }
    })

    console.log(`📊 Chat encontrado:`, chat ? `ID: ${chat.id}` : 'NÃO ENCONTRADO')

    // Se não existir, criar o chat automaticamente
    if (!chat) {
      console.log(`🔧 Criando chat automaticamente: ${chatId}`)
      
      // Buscar qualquer sessão do usuário
      console.log(`🔍 Buscando sessão para userId: ${user.userId}`)
      
      const session = await prisma.whatsAppSession.findFirst({
        where: {
          userId: user.userId
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      console.log(`📱 Sessão encontrada:`, session ? `${session.name} (${session.id})` : 'NENHUMA')

      if (!session) {
        // Se não encontrou sessão, buscar QUALQUER sessão (fallback)
        const anySession = await prisma.whatsAppSession.findFirst({
          orderBy: {
            createdAt: 'desc'
          }
        })
        
        if (!anySession) {
          return NextResponse.json({ 
            error: 'Nenhuma sessão encontrada no sistema.' 
          }, { status: 404 })
        }
        
        console.log(`⚠️ Usando sessão fallback: ${anySession.name}`)
        
        // Criar o chat com a sessão fallback
        chat = await prisma.whatsAppChat.create({
          data: {
            chatId: chatId,
            name: 'Chat',
            isGroup: false,
            sessionId: anySession.id
          }
        })
      } else {
        console.log(`✅ Usando sessão do usuário: ${session.name}`)
        
        // Criar o chat
        chat = await prisma.whatsAppChat.create({
          data: {
            chatId: chatId,
            name: 'Chat',
            isGroup: false,
            sessionId: session.id
          }
        })
      }
      
      console.log(`✅ Chat criado: ${chat.id}`)
    }

    // Remover todas as tags atuais do chat
    await prisma.whatsAppChatTag.deleteMany({
      where: {
        chatId: chat.id, // ID interno do banco
        tag: {
          userId: user.userId
        }
      }
    })

    // Adicionar as novas tags
    if (tagIds.length > 0) {
      await prisma.whatsAppChatTag.createMany({
        data: tagIds.map(tagId => ({
          chatId: chat.id, // ID interno do banco
          tagId
        })),
        skipDuplicates: true
      })
      console.log(`✅ ${tagIds.length} tags adicionadas`)
    }

    // Buscar as tags atualizadas para retornar
    const updatedTags = await prisma.whatsAppChatTag.findMany({
      where: {
        chatId: chat.id, // ID interno do banco
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
