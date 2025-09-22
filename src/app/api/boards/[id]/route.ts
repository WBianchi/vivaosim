import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateBoardSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  color: z.string().optional()
})

// GET - Buscar board específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    if (!board) {
      return NextResponse.json(
        { error: 'Board não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ board })
  } catch (error) {
    console.error('❌ Erro ao buscar board:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar board
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const data = updateBoardSchema.parse(body)

    const board = await prisma.kanbanBoard.update({
      where: { id: params.id },
      data,
      include: {
        columns: {
          orderBy: { position: 'asc' }
        }
      }
    })

    console.log('✅ Board atualizado:', board.name)
    return NextResponse.json({ board })
  } catch (error) {
    console.error('❌ Erro ao atualizar board:', error)
    
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

// DELETE - Deletar board
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.kanbanBoard.delete({
      where: { id: params.id }
    })

    console.log('✅ Board deletado:', params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Erro ao deletar board:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
