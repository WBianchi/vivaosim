import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateColumnSchema = z.object({
  title: z.string().min(1).optional(),
  color: z.string().optional(),
  order: z.number().optional(),
  agentId: z.string().optional().nullable()
})

// PATCH - Atualizar coluna
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; columnId: string } }
) {
  try {
    const body = await request.json()
    const updates = updateColumnSchema.parse(body)

    const column = await prisma.kanbanColumn.update({
      where: { id: params.columnId },
      data: updates
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

// DELETE - Excluir coluna
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; columnId: string } }
) {
  try {
    await prisma.kanbanColumn.delete({
      where: { id: params.columnId }
    })

    console.log('✅ Coluna excluída')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Erro ao excluir coluna:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
