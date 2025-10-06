import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar mensagens do chat
export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const { chatId } = params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const before = searchParams.get('before') // ID da mensagem para paginação

    // Verificar se o usuário faz parte do chat
    const chat = await prisma.internalChat.findUnique({
      where: { id: chatId }
    })

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat não encontrado' },
        { status: 404 }
      )
    }

    if (chat.user1Id !== userId && chat.user2Id !== userId) {
      return NextResponse.json(
        { error: 'Sem permissão para acessar este chat' },
        { status: 403 }
      )
    }

    // Buscar mensagens
    const messages = await prisma.internalMessage.findMany({
      where: {
        chatId,
        deleted: false,
        ...(before ? { id: { lt: before } } : {})
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        chat: {
          select: {
            user1Id: true,
            user2Id: true
          }
        }
      }
    })

    // Buscar informações dos usuários
    const userIds = [chat.user1Id, chat.user2Id]
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true
      }
    })

    const usersMap = users.reduce((acc, user) => {
      acc[user.id] = user
      return acc
    }, {} as Record<string, any>)

    // Mapear mensagens com informações do sender
    const messagesWithSender = messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      messageType: msg.messageType,
      mediaUrl: msg.mediaUrl,
      mediaFilename: msg.mediaFilename,
      mediaMimeType: msg.mediaMimeType,
      mediaSize: msg.mediaSize,
      senderId: msg.senderId,
      sender: usersMap[msg.senderId],
      status: msg.status,
      readAt: msg.readAt,
      edited: msg.edited,
      replyToId: msg.replyToId,
      isForwarded: msg.isForwarded,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt
    })).reverse() // Inverter para ordem cronológica

    return NextResponse.json({ messages: messagesWithSender })
  } catch (error) {
    console.error('❌ Erro ao buscar mensagens:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Enviar mensagem
export async function POST(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const { chatId } = params
    const body = await request.json()
    const { 
      content, 
      messageType = 'TEXT',
      mediaUrl,
      mediaFilename,
      mediaMimeType,
      mediaSize,
      replyToId
    } = body

    // Validar conteúdo
    if (!content && !mediaUrl) {
      return NextResponse.json(
        { error: 'Conteúdo ou mídia é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o usuário faz parte do chat
    const chat = await prisma.internalChat.findUnique({
      where: { id: chatId }
    })

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat não encontrado' },
        { status: 404 }
      )
    }

    if (chat.user1Id !== userId && chat.user2Id !== userId) {
      return NextResponse.json(
        { error: 'Sem permissão para enviar mensagem neste chat' },
        { status: 403 }
      )
    }

    // Criar mensagem
    const message = await prisma.internalMessage.create({
      data: {
        chatId,
        senderId: userId,
        content,
        messageType,
        mediaUrl,
        mediaFilename,
        mediaMimeType,
        mediaSize,
        replyToId,
        status: 'SENT'
      }
    })

    // Atualizar chat com última mensagem e incrementar contador de não lidas
    const isUser1 = chat.user1Id === userId
    const updateData: any = {
      lastMessage: content || `[${messageType}]`,
      lastMessageAt: new Date()
    }

    // Incrementar unread do outro usuário
    if (isUser1) {
      updateData.user2UnreadCount = { increment: 1 }
    } else {
      updateData.user1UnreadCount = { increment: 1 }
    }

    await prisma.internalChat.update({
      where: { id: chatId },
      data: updateData
    })

    // Buscar sender info
    const sender = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true
      }
    })

    console.log('✅ Mensagem enviada:', message.id)
    
    return NextResponse.json({
      message: {
        ...message,
        sender
      }
    }, { status: 201 })
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
