import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH - Marcar mensagens como lidas
export async function PATCH(
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
        { error: 'Sem permissão para marcar mensagens neste chat' },
        { status: 403 }
      )
    }

    // Marcar todas as mensagens não lidas como lidas
    await prisma.internalMessage.updateMany({
      where: {
        chatId,
        senderId: { not: userId }, // Mensagens do outro usuário
        status: { not: 'READ' }
      },
      data: {
        status: 'READ',
        readAt: new Date()
      }
    })

    // Zerar contador de não lidas
    const isUser1 = chat.user1Id === userId
    await prisma.internalChat.update({
      where: { id: chatId },
      data: isUser1 ? { user1UnreadCount: 0 } : { user2UnreadCount: 0 }
    })

    console.log('✅ Mensagens marcadas como lidas no chat:', chatId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Erro ao marcar mensagens como lidas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
