import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contactId = params.id

    console.log('📊 API Kanban: Buscando posição do contato:', contactId)

    // Buscar o contato e sua posição no Kanban
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: {
        kanbanCard: {
          include: {
            column: {
              include: {
                board: true
              }
            }
          }
        }
      }
    })

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contato não encontrado' },
        { status: 404 }
      )
    }

    // Se não tiver card no Kanban
    if (!contact.kanbanCard) {
      console.log('⚠️ API Kanban: Contato não está em nenhum quadro')
      return NextResponse.json({
        success: true,
        position: null
      })
    }

    const position = {
      boardId: contact.kanbanCard.column.board.id,
      boardName: contact.kanbanCard.column.board.name,
      columnId: contact.kanbanCard.column.id,
      columnName: contact.kanbanCard.column.title,
      columnColor: contact.kanbanCard.column.color || '#3B82F6',
      cardId: contact.kanbanCard.id
    }

    console.log('✅ API Kanban: Posição encontrada:', position)

    return NextResponse.json({
      success: true,
      position
    })

  } catch (error) {
    console.error('❌ API Kanban: Erro:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar posição no Kanban' },
      { status: 500 }
    )
  }
}
