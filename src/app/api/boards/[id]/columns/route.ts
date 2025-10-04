import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createColumnSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  color: z.string().default('#6B7280'),
  position: z.number().optional()
})

// GET - Listar colunas do board
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const columns = await prisma.kanbanColumn.findMany({
      where: { boardId: params.id },
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
        },
        _count: {
          select: { clients: true }
        }
      }
    })

    return NextResponse.json({ columns })
  } catch (error) {
    console.error('❌ Erro ao listar colunas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar nova coluna
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, color, position } = createColumnSchema.parse(body)

    // Se não especificar posição, colocar no final
    const finalPosition = position ?? (await prisma.kanbanColumn.count({
      where: { boardId: params.id }
    }))

    const column = await prisma.kanbanColumn.create({
      data: {
        title,
        color,
        position: finalPosition,
        boardId: params.id
      }
    })

    console.log('✅ Coluna criada:', column.title)
    return NextResponse.json({ column }, { status: 201 })
  } catch (error) {
    console.error('❌ Erro ao criar coluna:', error)
    
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
