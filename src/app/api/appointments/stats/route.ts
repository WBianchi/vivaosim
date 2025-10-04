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
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Total de agendamentos
    const totalAppointments = await prisma.appointment.count()

    // Agendamentos hoje
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const appointmentsToday = await prisma.appointment.count({
      where: {
        startDateTime: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    // Clientes únicos
    const uniqueClients = await prisma.appointment.findMany({
      where: {
        clientId: { not: null }
      },
      select: {
        clientId: true
      },
      distinct: ['clientId']
    })

    // Agendamentos concluídos
    const completedAppointments = await prisma.appointment.count({
      where: { status: 'COMPLETED' }
    })

    // Mudanças do mês
    const now = new Date()
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const appointmentsThisMonth = await prisma.appointment.count({
      where: {
        createdAt: {
          gte: firstDayThisMonth
        }
      }
    })

    const appointmentsLastMonth = await prisma.appointment.count({
      where: {
        createdAt: {
          gte: firstDayLastMonth,
          lt: firstDayThisMonth
        }
      }
    })

    const changePercent = appointmentsLastMonth > 0
      ? Math.round(((appointmentsThisMonth - appointmentsLastMonth) / appointmentsLastMonth) * 100)
      : 0

    const stats = {
      totalAppointments: {
        value: totalAppointments,
        change: changePercent,
        changeText: changePercent > 0 ? `+${changePercent}%` : `${changePercent}%`
      },
      appointmentsToday: {
        value: appointmentsToday,
        change: appointmentsThisMonth - appointmentsLastMonth,
        changeText: `+${appointmentsThisMonth - appointmentsLastMonth}`
      },
      uniqueClients: {
        value: uniqueClients.length,
        change: Math.round(changePercent * 0.5),
        changeText: `+${Math.round(changePercent * 0.5)}%`
      },
      completedAppointments: {
        value: completedAppointments,
        change: Math.round(changePercent * 0.8),
        changeText: `+${Math.round(changePercent * 0.8)}%`
      }
    }

    return NextResponse.json({ stats })

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
