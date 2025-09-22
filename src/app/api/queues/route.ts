import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createQueueSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve ser um hex válido').default('#3B82F6'),
  priority: z.number().min(1).default(1),
  maxContacts: z.number().min(1).optional(),
  autoAssignment: z.boolean().default(false),
  businessHours: z.object({
    monday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }),
    tuesday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }),
    wednesday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }),
    thursday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }),
    friday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }),
    saturday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }),
    sunday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() })
  }).optional(),
  createdById: z.string(),
  agents: z.array(z.object({
    agentId: z.string(),
    priority: z.number().default(1),
    isDefault: z.boolean().default(false)
  })).optional()
})

// GET - Listar filas
export async function GET() {
  try {
    const queues = await prisma.queue.findMany({
      where: { isActive: true },
      orderBy: { priority: 'asc' },
      include: {
        agents: {
          include: {
            agent: { select: { id: true, name: true, email: true, avatar: true } }
          }
        },
        _count: {
          select: { contacts: true }
        }
      }
    })

    return NextResponse.json(queues)
  } catch (error) {
    console.error('Erro ao buscar filas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar fila
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createQueueSchema.parse(body)
    
    const { agents, ...queueData } = validatedData

    const queue = await prisma.queue.create({
      data: {
        ...queueData,
        agents: agents ? {
          create: agents.map(agent => ({
            agentId: agent.agentId,
            priority: agent.priority,
            isDefault: agent.isDefault,
            isActive: true
          }))
        } : undefined
      },
      include: {
        agents: {
          include: {
            agent: { select: { id: true, name: true, email: true, avatar: true } }
          }
        },
        createdBy: { select: { id: true, name: true, email: true } }
      }
    })

    return NextResponse.json(queue, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erro ao criar fila:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
