import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Verificar autenticação
async function verifyAuth(request: NextRequest) {
  const headersList = headers()
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

// GET - Buscar estatísticas dos tickets
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Total de tickets
    const totalTickets = await prisma.ticket.count()

    // Tickets urgentes
    const urgentTickets = await prisma.ticket.count({
      where: {
        priority: 'urgent'
      }
    })

    // Tickets em andamento
    const inProgressTickets = await prisma.ticket.count({
      where: {
        status: 'in_progress'
      }
    })

    // Tickets resolvidos
    const resolvedTickets = await prisma.ticket.count({
      where: {
        status: 'resolved'
      }
    })

    // Calcular mudanças da semana (comparar com semana anterior)
    const now = new Date()
    const firstDayThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    const firstDayLastWeek = new Date(firstDayThisWeek)
    firstDayLastWeek.setDate(firstDayLastWeek.getDate() - 7)

    const ticketsThisWeek = await prisma.ticket.count({
      where: {
        createdAt: {
          gte: firstDayThisWeek
        }
      }
    })

    const ticketsLastWeek = await prisma.ticket.count({
      where: {
        createdAt: {
          gte: firstDayLastWeek,
          lt: firstDayThisWeek
        }
      }
    })

    const urgentThisWeek = await prisma.ticket.count({
      where: {
        priority: 'urgent',
        createdAt: {
          gte: firstDayThisWeek
        }
      }
    })

    const urgentLastWeek = await prisma.ticket.count({
      where: {
        priority: 'urgent',
        createdAt: {
          gte: firstDayLastWeek,
          lt: firstDayThisWeek
        }
      }
    })

    const inProgressThisWeek = await prisma.ticket.count({
      where: {
        status: 'in_progress',
        updatedAt: {
          gte: firstDayThisWeek
        }
      }
    })

    const inProgressLastWeek = await prisma.ticket.count({
      where: {
        status: 'in_progress',
        updatedAt: {
          gte: firstDayLastWeek,
          lt: firstDayThisWeek
        }
      }
    })

    const resolvedThisWeek = await prisma.ticket.count({
      where: {
        status: 'resolved',
        updatedAt: {
          gte: firstDayThisWeek
        }
      }
    })

    const resolvedLastWeek = await prisma.ticket.count({
      where: {
        status: 'resolved',
        updatedAt: {
          gte: firstDayLastWeek,
          lt: firstDayThisWeek
        }
      }
    })

    const stats = {
      totalTickets: {
        value: totalTickets,
        change: ticketsThisWeek - ticketsLastWeek
      },
      urgentTickets: {
        value: urgentTickets,
        change: urgentThisWeek - urgentLastWeek
      },
      inProgressTickets: {
        value: inProgressTickets,
        change: inProgressThisWeek - inProgressLastWeek
      },
      resolvedTickets: {
        value: resolvedTickets,
        change: resolvedThisWeek - resolvedLastWeek
      }
    }

    return NextResponse.json({ stats })

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
