import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const moveClientSchema = z.object({
  columnId: z.string(),
  order: z.number().optional()
})

// PATCH - Mover cliente entre colunas
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string, clientId: string } }
) {
  try {
    const body = await request.json()
    const { columnId, order } = moveClientSchema.parse(body)

    console.log(`🔄 Movendo cliente ${params.clientId} para coluna ${columnId} (ordem: ${order})`)

    // Atualizar a coluna do cliente
    const updatedClient = await prisma.contact.update({
      where: { id: params.clientId },
      data: {
        kanbanColumnId: columnId
      }
    })

    console.log(`✅ Cliente ${params.clientId} movido com sucesso para coluna ${columnId}`)

    return NextResponse.json({ 
      success: true,
      client: updatedClient 
    })
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
