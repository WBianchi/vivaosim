import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const payload = verifyAccessToken(accessToken)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 403 })
    }

    const { chatId } = params

    // Buscar chat
    const chat = await prisma.whatsAppChat.findUnique({
      where: { id: chatId }
    })

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat não encontrado' },
        { status: 404 }
      )
    }

    // Extrair telefone
    const phone = chat.chatId.split('@')[0]

    // Buscar contato vinculado ao telefone
    const contact = await prisma.contact.findFirst({
      where: {
        phone: phone,
        kanbanColumnId: {
          not: null
        }
      },
      include: {
        kanbanColumn: {
          include: {
            board: true
          }
        }
      }
    })

    if (!contact || !contact.kanbanColumn) {
      return NextResponse.json({
        success: false,
        position: null
      })
    }

    return NextResponse.json({
      success: true,
      position: {
        boardName: contact.kanbanColumn.board.name,
        columnName: contact.kanbanColumn.title,
        columnColor: contact.kanbanColumn.color || '#6B7280'
      }
    })
  } catch (error) {
    console.error('Erro ao buscar posição no Kanban:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar posição no Kanban' },
      { status: 500 }
    )
  }
}
