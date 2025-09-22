import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const moveClientSchema = z.object({
  clientId: z.string(),
  sourceColumnId: z.string(),
  destinationColumnId: z.string(),
  newPosition: z.number()
})

// PATCH - Mover cliente entre colunas
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { clientId, sourceColumnId, destinationColumnId, newPosition } = moveClientSchema.parse(body)

    // Atualizar a coluna do cliente
    await prisma.contact.update({
      where: { id: clientId },
      data: {
        kanbanColumnId: destinationColumnId
      }
    })

    // Log da movimentação
    console.log(`🔄 Cliente ${clientId} movido de ${sourceColumnId} para ${destinationColumnId}`)

    // Buscar dados atualizados do board
    const board = await prisma.kanbanBoard.findUnique({
      where: { id: params.id },
      include: {
        columns: {
          orderBy: { position: 'asc' },
          include: {
            clients: {
              include: {
                tags: true,
                assignedTo: true,
                _count: {
                  select: {
                    tickets: true,
                    contracts: true,
                    quotes: true
                  }
                }
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ board })
  } catch (error) {
    console.error('❌ Erro ao mover cliente:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
