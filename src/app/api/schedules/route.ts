import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createScheduleSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  datetime: z.string().datetime('Data/hora inválida'),
  duration: z.number().min(15).max(480).default(60), // 15min a 8h
  location: z.string().optional(),
  meetingLink: z.string().url().optional(),
  contactId: z.string(),
  createdById: z.string()
})

// GET - Listar agendamentos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get('contactId')
    const date = searchParams.get('date') // YYYY-MM-DD
    const status = searchParams.get('status')

    const where: any = {}
    
    if (contactId) where.contactId = contactId
    if (status) where.status = status
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      
      where.datetime = {
        gte: startDate,
        lt: endDate
      }
    }

    const schedules = await prisma.schedule.findMany({
      where,
      orderBy: { datetime: 'asc' },
      include: {
        contact: { select: { id: true, name: true, phone: true, whatsappNumber: true } },
        createdBy: { select: { id: true, name: true, email: true } }
      }
    })

    return NextResponse.json(schedules)
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar agendamento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createScheduleSchema.parse(body)
    
    // Verificar se o contato existe
    const contact = await prisma.contact.findUnique({
      where: { id: validatedData.contactId }
    })
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contato não encontrado' },
        { status: 404 }
      )
    }

    const schedule = await prisma.schedule.create({
      data: validatedData,
      include: {
        contact: { select: { id: true, name: true, phone: true, whatsappNumber: true } },
        createdBy: { select: { id: true, name: true, email: true } }
      }
    })

    // Log de atividade
    await prisma.contactActivity.create({
      data: {
        type: 'meeting',
        title: `Agendamento criado: ${schedule.title}`,
        description: `Reunião agendada para ${new Date(schedule.datetime).toLocaleString('pt-BR')}`,
        contactId: schedule.contactId,
        userId: schedule.createdById,
        metadata: {
          scheduleId: schedule.id,
          datetime: schedule.datetime,
          duration: schedule.duration
        }
      }
    })

    return NextResponse.json(schedule, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erro ao criar agendamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
