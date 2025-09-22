import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema para criação de board
const createBoardSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  color: z.string().default('from-blue-500 to-cyan-500'),
  template: z.string().optional(),
  columns: z.array(z.object({
    title: z.string(),
    color: z.string(),
    position: z.number()
  })).optional()
})

// GET - Listar boards
export async function GET(request: NextRequest) {
  try {
    const boards = await prisma.kanbanBoard.findMany({
      include: {
        createdBy: {
          select: { name: true, email: true }
        },
        columns: {
          orderBy: { position: 'asc' },
          include: {
            _count: {
              select: { clients: true }
            }
          }
        },
        _count: {
          select: { 
            columns: true,
            clients: true 
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ boards })
  } catch (error) {
    console.error('❌ Erro ao listar boards:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar board
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, color, template, columns } = createBoardSchema.parse(body)

    // Templates predefinidos
    const templates: Record<string, Array<{title: string, color: string, position: number}>> = {
      sales: [
        { title: 'Novos Leads', color: 'from-blue-500 to-cyan-500', position: 0 },
        { title: 'Qualificados', color: 'from-green-500 to-emerald-500', position: 1 },
        { title: 'Proposta', color: 'from-yellow-500 to-orange-500', position: 2 },
        { title: 'Negociação', color: 'from-purple-500 to-pink-500', position: 3 },
        { title: 'Fechados', color: 'from-emerald-500 to-green-600', position: 4 }
      ],
      ecommerce: [
        { title: 'Carrinho Abandonado', color: 'from-red-500 to-pink-500', position: 0 },
        { title: 'Pedido Confirmado', color: 'from-blue-500 to-cyan-500', position: 1 },
        { title: 'Em Produção', color: 'from-yellow-500 to-orange-500', position: 2 },
        { title: 'Enviado', color: 'from-purple-500 to-pink-500', position: 3 },
        { title: 'Entregue', color: 'from-green-500 to-emerald-500', position: 4 }
      ],
      support: [
        { title: 'Novo Ticket', color: 'from-gray-500 to-slate-500', position: 0 },
        { title: 'Em Análise', color: 'from-blue-500 to-cyan-500', position: 1 },
        { title: 'Aguardando Cliente', color: 'from-yellow-500 to-orange-500', position: 2 },
        { title: 'Em Resolução', color: 'from-purple-500 to-pink-500', position: 3 },
        { title: 'Resolvido', color: 'from-green-500 to-emerald-500', position: 4 }
      ]
    }

    // Criar board
    const board = await prisma.kanbanBoard.create({
      data: {
        name,
        description,
        color,
        columns: {
          create: (columns || templates[template || 'sales'] || templates.sales) as any
        }
      },
      include: {
        columns: {
          orderBy: { position: 'asc' }
        }
      }
    })

    console.log('✅ Board criado:', board.name)
    return NextResponse.json({ board }, { status: 201 })
  } catch (error) {
    console.error('❌ Erro ao criar board:', error)
    
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
