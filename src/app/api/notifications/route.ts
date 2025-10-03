import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const WAHA_BASE_URL = process.env.WAHA_API_URL || 'http://159.65.34.199:3001'
const WAHA_API_KEY = process.env.WAHA_API_KEY || 'tappyone-waha-2024-secretkey'

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

// GET - Buscar notificações
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const notifications = []

    // 1. Notificações do Sistema (Prisma)
    const systemNotifications = await prisma.notification.findMany({
      where: {
        userId: user.userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    notifications.push(...systemNotifications.map(notif => ({
      id: notif.id,
      type: notif.type as 'message' | 'appointment' | 'budget' | 'system',
      title: notif.title,
      message: notif.message,
      time: getTimeAgo(notif.createdAt),
      isRead: notif.read,
      createdAt: notif.createdAt,
      source: 'system'
    })))

    // 2. Atividades Recentes do Sistema
    const recentActivities = await prisma.contactActivity.findMany({
      where: {
        userId: user.userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
      include: {
        contact: {
          select: {
            name: true
          }
        }
      }
    })

    notifications.push(...recentActivities.map(activity => ({
      id: `activity-${activity.id}`,
      type: 'system' as const,
      title: activity.title,
      message: `${activity.contact.name}: ${activity.description || ''}`,
      time: getTimeAgo(activity.createdAt),
      isRead: true,
      createdAt: activity.createdAt,
      source: 'activity'
    })))

    // 3. Agendamentos Próximos
    const upcomingSchedules = await prisma.schedule.findMany({
      where: {
        createdById: user.userId,
        datetime: {
          gte: new Date(),
          lte: new Date(Date.now() + 24 * 60 * 60 * 1000) // Próximas 24h
        },
        status: 'scheduled'
      },
      include: {
        contact: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        datetime: 'asc'
      },
      take: 3
    })

    notifications.push(...upcomingSchedules.map(schedule => ({
      id: `schedule-${schedule.id}`,
      type: 'appointment' as const,
      title: 'Agendamento Próximo',
      message: `${schedule.title} com ${schedule.contact.name}`,
      time: getTimeAgo(schedule.datetime),
      isRead: false,
      createdAt: schedule.datetime,
      source: 'schedule'
    })))

    // 4. Orçamentos Recentes
    const recentQuotes = await prisma.quote.findMany({
      where: {
        createdById: user.userId,
        status: {
          in: ['sent', 'approved']
        }
      },
      include: {
        contact: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 3
    })

    notifications.push(...recentQuotes.map(quote => ({
      id: `quote-${quote.id}`,
      type: 'budget' as const,
      title: quote.status === 'approved' ? 'Orçamento Aprovado' : 'Orçamento Enviado',
      message: `${quote.contact.name} - R$ ${Number(quote.amount).toFixed(2)}`,
      time: getTimeAgo(quote.updatedAt),
      isRead: quote.status === 'approved' ? false : true,
      createdAt: quote.updatedAt,
      source: 'quote'
    })))

    // Ordenar por data (mais recente primeiro)
    notifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Limitar a 15 notificações
    const limitedNotifications = notifications.slice(0, 15)

    return NextResponse.json({
      notifications: limitedNotifications,
      unreadCount: limitedNotifications.filter(n => !n.isRead).length
    })

  } catch (error) {
    console.error('Erro ao buscar notificações:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Função auxiliar para calcular tempo relativo
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'agora'
  if (diffMins < 60) return `${diffMins}min`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

// PUT - Marcar notificação como lida
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { notificationId } = await request.json()

    await prisma.notification.update({
      where: {
        id: notificationId,
        userId: user.userId
      },
      data: {
        read: true
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erro ao marcar notificação:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
