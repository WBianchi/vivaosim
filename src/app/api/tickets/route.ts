import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Verificar autenticação
async function verifyAuth(request: NextRequest) {
  const headersList = await headers()
  const authorization = headersList.get('authorization')

  if (!authorization?.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authorization.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }
}

const createTicketSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  category: z.string().optional(),
  contactId: z.string(),
  assignedToId: z.string().optional(),
  chatId: z.string().optional()
})

const updateTicketSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  category: z.string().optional(),
  assignedToId: z.string().optional(),
  chatId: z.string().optional()
})

// GET - Listar tickets
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get('contactId')
    const chatId = searchParams.get('chatId')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const category = searchParams.get('category')
    const assignedToId = searchParams.get('assignedToId')

    const where: any = {}
    
    if (contactId) where.contactId = contactId
    if (chatId) where.chatId = chatId
    if (status && status !== 'all') where.status = status
    if (priority && priority !== 'all') where.priority = priority
    if (category && category !== 'all') where.category = category
    if (assignedToId) {
      if (assignedToId === 'unassigned') {
        where.assignedToId = null
      } else {
        where.assignedToId = assignedToId
      }
    }

    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        contact: { 
          select: { 
            id: true, 
            name: true, 
            email: true,
            phone: true, 
            whatsappNumber: true 
          } 
        },
        createdBy: { 
          select: { 
            id: true, 
            name: true, 
            email: true,
            avatar: true 
          } 
        },
        assignedTo: { 
          select: { 
            id: true, 
            name: true, 
            email: true,
            avatar: true 
          } 
        }
      }
    })

    return NextResponse.json({ tickets })
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
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createTicketSchema.parse(body)
    
    const ticket = await prisma.ticket.create({
      data: {
        ...validatedData,
        createdById: user.userId
      },
      include: {
        contact: { 
          select: { 
            id: true, 
            name: true, 
            email: true,
            phone: true, 
            whatsappNumber: true 
          } 
        },
        createdBy: { 
          select: { 
            id: true, 
            name: true, 
            email: true,
            avatar: true 
          } 
        },
        assignedTo: { 
          select: { 
            id: true, 
            name: true, 
            email: true,
            avatar: true 
          } 
        }
      }
    })

    // Log de atividade
    await prisma.contactActivity.create({
      data: {
        type: 'ticket',
        title: `Ticket criado: ${ticket.title}`,
        description: `Ticket de ${ticket.priority} prioridade criado`,
        contactId: ticket.contactId,
        userId: user.userId,
        metadata: {
          ticketId: ticket.id,
          priority: ticket.priority,
          category: ticket.category,
          assignedToId: ticket.assignedToId
        }
      }
    })

    return NextResponse.json({ ticket }, { status: 201 })
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

// PATCH - Atualizar ticket
export async function PATCH(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do ticket é obrigatório' },
        { status: 400 }
      )
    }

    const validatedData = updateTicketSchema.parse(updateData)
    
    const ticket = await prisma.ticket.update({
      where: { id },
      data: validatedData,
      include: {
        contact: { 
          select: { 
            id: true, 
            name: true, 
            email: true,
            phone: true, 
            whatsappNumber: true 
          } 
        },
        createdBy: { 
          select: { 
            id: true, 
            name: true, 
            email: true,
            avatar: true 
          } 
        },
        assignedTo: { 
          select: { 
            id: true, 
            name: true, 
            email: true,
            avatar: true 
          } 
        }
      }
    })

    // Log de atividade
    await prisma.contactActivity.create({
      data: {
        type: 'ticket',
        title: `Ticket atualizado: ${ticket.title}`,
        description: `Ticket atualizado`,
        contactId: ticket.contactId,
        userId: user.userId,
        metadata: {
          ticketId: ticket.id,
          changes: validatedData
        }
      }
    })

    return NextResponse.json({ ticket })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erro ao atualizar ticket:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar ticket
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do ticket é obrigatório' },
        { status: 400 }
      )
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id }
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket não encontrado' },
        { status: 404 }
      )
    }

    await prisma.ticket.delete({
      where: { id }
    })

    // Log de atividade
    await prisma.contactActivity.create({
      data: {
        type: 'ticket',
        title: `Ticket deletado: ${ticket.title}`,
        description: `Ticket foi removido do sistema`,
        contactId: ticket.contactId,
        userId: user.userId,
        metadata: {
          ticketId: ticket.id
        }
      }
    })

    return NextResponse.json({ message: 'Ticket deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar ticket:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
