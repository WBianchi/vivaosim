import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createTicketSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  category: z.string().optional(),
  contactId: z.string(),
  createdById: z.string(),
  assignedToId: z.string().optional()
})

// GET - Listar tickets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get('contactId')
    const status = searchParams.get('status')
    const assignedToId = searchParams.get('assignedToId')

    const where: any = {}
    
    if (contactId) where.contactId = contactId
    if (status) where.status = status
    if (assignedToId) where.assignedToId = assignedToId

    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        contact: { select: { id: true, name: true, phone: true, whatsappNumber: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } }
      }
    })

    return NextResponse.json(tickets)
  } catch (error) {
    console.error('Erro ao buscar tickets:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createTicketSchema.parse(body)
    
    const ticket = await prisma.ticket.create({
      data: validatedData,
      include: {
        contact: { select: { id: true, name: true, phone: true, whatsappNumber: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } }
      }
    })

    // Log de atividade
    await prisma.contactActivity.create({
      data: {
        type: 'ticket',
        title: `Ticket criado: ${ticket.title}`,
        description: `Ticket de ${ticket.priority} prioridade criado`,
        contactId: ticket.contactId,
        userId: ticket.createdById,
        metadata: {
          ticketId: ticket.id,
          priority: ticket.priority,
          category: ticket.category,
          assignedToId: ticket.assignedToId
        }
      }
    })

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erro ao criar ticket:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
