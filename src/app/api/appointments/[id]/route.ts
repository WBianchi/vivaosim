import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'

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

// PATCH - Atualizar agendamento específico
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()

    // Atualizar apenas os campos fornecidos
    const updateData: any = {}
    
    if (body.title) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.startDateTime) {
      updateData.startDateTime = new Date(body.startDateTime)
      // Se forneceu startDateTime mas não endDateTime, calcular baseado na duração
      if (!body.endDateTime && body.duration) {
        const start = new Date(body.startDateTime)
        const end = new Date(start.getTime() + body.duration * 60000)
        updateData.endDateTime = end
      }
    }
    if (body.endDateTime) updateData.endDateTime = new Date(body.endDateTime)
    if (body.duration !== undefined) updateData.duration = body.duration
    if (body.allDay !== undefined) updateData.allDay = body.allDay
    if (body.status) updateData.status = body.status
    if (body.type) updateData.type = body.type
    if (body.location !== undefined) updateData.location = body.location
    if (body.isOnline !== undefined) updateData.isOnline = body.isOnline
    if (body.meetingUrl !== undefined) updateData.meetingUrl = body.meetingUrl
    if (body.clientId !== undefined) updateData.clientId = body.clientId
    if (body.assignedToId !== undefined) updateData.assignedToId = body.assignedToId
    if (body.sendReminder !== undefined) updateData.sendReminder = body.sendReminder
    if (body.reminderMinutes !== undefined) updateData.reminderMinutes = body.reminderMinutes
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.color) updateData.color = body.color

    const appointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
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
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar agendamento específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    await prisma.appointment.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Agendamento deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
