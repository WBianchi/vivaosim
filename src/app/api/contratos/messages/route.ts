import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('accessToken')?.value

    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    const payload = verifyAccessToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 403 })
    }

    // Buscar contrato do cliente para pegar o chatId
    const contract = await prisma.contract.findFirst({
      where: {
        contactId: payload.contactId,
        status: { in: ['active', 'draft'] }
      },
      select: {
        chatId: true
      }
    })

    if (!contract?.chatId) {
      return NextResponse.json({
        success: true,
        messages: [],
        message: 'Nenhuma conversa vinculada ao contrato'
      })
    }

    // Buscar mensagens do chat
    const messages = await prisma.message.findMany({
      where: {
        chatId: contract.chatId
      },
      orderBy: {
        timestamp: 'asc'
      },
      take: 500 // Limitar a 500 mensagens mais recentes
    })

    return NextResponse.json({
      success: true,
      messages: messages.map(msg => ({
        id: msg.id,
        body: msg.body,
        fromMe: msg.fromMe,
        senderName: msg.senderName,
        timestamp: msg.timestamp,
        mediaUrl: msg.mediaUrl,
        messageType: msg.messageType
      }))
    })

  } catch (error: any) {
    console.error('Erro ao buscar mensagens:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}
