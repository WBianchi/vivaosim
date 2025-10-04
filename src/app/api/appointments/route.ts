import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

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

const createAppointmentSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().nullish(),
  startDateTime: z.string().datetime(),
  endDateTime: z.string().datetime(),
  duration: z.number().optional(),
  allDay: z.boolean().default(false),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED', 'NO_SHOW']).default('SCHEDULED'),
  type: z.enum(['MEETING', 'VISIT', 'CALL', 'VIDEO_CALL', 'EVENT', 'TASK', 'OTHER']).default('MEETING'),
  location: z.string().nullish(),
  isOnline: z.boolean().default(false),
  meetingUrl: z.string().nullish(),
  clientId: z.string().nullish(),
  assignedToId: z.string().nullish(),
  sendReminder: z.boolean().default(true),
  reminderMinutes: z.number().default(30),
  notes: z.string().nullish(),
  color: z.string().default('#3b82f6')
})

// GET - Listar agendamentos
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const clientId = searchParams.get('clientId')
    const assignedToId = searchParams.get('assignedToId')

    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (type && type !== 'all') {
      where.type = type
    }
    
    if (startDate && endDate) {
      where.startDateTime = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }
    
    if (clientId) {
      where.clientId = clientId
    }
    
    if (assignedToId && assignedToId !== 'all') {
      where.assignedToId = assignedToId
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { startDateTime: 'asc' },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST - Criar agendamento
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createAppointmentSchema.parse(body)
    
    const appointment = await prisma.appointment.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        startDateTime: new Date(validatedData.startDateTime),
        endDateTime: new Date(validatedData.endDateTime),
        duration: validatedData.duration,
        allDay: validatedData.allDay,
        status: validatedData.status,
        type: validatedData.type,
        location: validatedData.location,
        isOnline: validatedData.isOnline,
        meetingUrl: validatedData.meetingUrl,
        clientId: validatedData.clientId,
        assignedToId: validatedData.assignedToId,
        sendReminder: validatedData.sendReminder,
        reminderMinutes: validatedData.reminderMinutes,
        notes: validatedData.notes,
        color: validatedData.color,
        createdById: user.userId
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({ appointment }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    
    console.error('Erro ao criar agendamento:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// PATCH - Atualizar agendamento
export async function PATCH(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json({ error: 'ID do agendamento é obrigatório' }, { status: 400 })
    }

    const existingAppointment = await prisma.appointment.findUnique({ where: { id } })

    if (!existingAppointment) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 })
    }
    
    const dataToUpdate: any = { ...updateData }
    if (updateData.startDateTime) {
      dataToUpdate.startDateTime = new Date(updateData.startDateTime)
    }
    if (updateData.endDateTime) {
      dataToUpdate.endDateTime = new Date(updateData.endDateTime)
    }
    
    const appointment = await prisma.appointment.update({
      where: { id },
      data: dataToUpdate,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// DELETE - Deletar agendamento
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID do agendamento é obrigatório' }, { status: 400 })
    }

    const existingAppointment = await prisma.appointment.findUnique({ where: { id } })

    if (!existingAppointment) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 })
    }

    await prisma.appointment.delete({ where: { id } })

    return NextResponse.json({ message: 'Agendamento deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
