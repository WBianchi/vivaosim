import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

async function verifyAuth(request: NextRequest) {
  const authorization = request.headers.get('authorization')
  if (!authorization?.startsWith('Bearer ')) return null

  try {
    const token = authorization.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch {
    return null
  }
}

// PUT - Atualizar agendamento
export async function PUT(
  request: NextRequest,
  { params }: { params: { scheduleId: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { scheduleId } = params
    const body = await request.json()

    const schedule = await prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        title: body.title,
        description: body.description,
        datetime: body.datetime,
        duration: body.duration,
        location: body.location,
        status: body.status
      },
      include: {
        contact: {
          select: {
            id: true,
            name: true,
            phone: true,
            whatsappNumber: true
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

    return NextResponse.json({
      success: true,
      schedule
    })

  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error)
    return NextResponse.json({
      error: 'Erro ao atualizar agendamento',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE - Excluir agendamento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { scheduleId: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { scheduleId } = params

    await prisma.schedule.delete({
      where: { id: scheduleId }
    })

    return NextResponse.json({
      success: true,
      message: 'Agendamento excluído com sucesso'
    })

  } catch (error) {
    console.error('Erro ao excluir agendamento:', error)
    return NextResponse.json({
      error: 'Erro ao excluir agendamento',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
