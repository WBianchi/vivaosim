import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateColumnSchema = z.object({
  title: z.string().min(1).optional(),
  color: z.string().optional(),
  position: z.number().optional()
})

// PATCH - Atualizar coluna
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const data = updateColumnSchema.parse(body)

    const column = await prisma.kanbanColumn.update({
      where: { id: params.id },
      data
    })

    console.log('✅ Coluna atualizada:', column.title)
    return NextResponse.json({ column })
  } catch (error) {
    console.error('❌ Erro ao atualizar coluna:', error)
    
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

// DELETE - Deletar coluna
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se a coluna tem clientes
    const column = await prisma.kanbanColumn.findUnique({
      where: { id: params.id },
      include: { _count: { select: { clients: true } } }
    })

    if (!column) {
      return NextResponse.json(
        { error: 'Coluna não encontrada' },
        { status: 404 }
      )
    }

    if (column._count.clients > 0) {
      return NextResponse.json(
        { error: 'Não é possível deletar coluna com clientes' },
        { status: 400 }
      )
    }

    await prisma.kanbanColumn.delete({
      where: { id: params.id }
    })

    console.log('✅ Coluna deletada:', params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Erro ao deletar coluna:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
