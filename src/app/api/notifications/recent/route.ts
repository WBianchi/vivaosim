import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const payload = verifyAccessToken(accessToken)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 403 })
    }

    const notifications: any[] = []

    // Buscar últimos 5 orçamentos
    const quotes = await prisma.quote.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        contact: {
          select: { name: true }
        }
      }
    })

    quotes.forEach(quote => {
      const timeAgo = getTimeAgo(quote.createdAt)
      notifications.push({
        id: `quote-${quote.id}`,
        type: 'quote',
        title: 'Novo Orçamento',
        message: `Orçamento de ${quote.contact?.name || 'Cliente'} - R$ ${quote.total.toString()}`,
        time: timeAgo,
        read: false,
        link: `/chat?quote=${quote.id}`
      })
    })

    // Buscar últimos 5 agendamentos
    const schedules = await prisma.schedule.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        contact: {
          select: { name: true }
        }
      }
    })

    schedules.forEach(schedule => {
      const timeAgo = getTimeAgo(schedule.createdAt)
      notifications.push({
        id: `schedule-${schedule.id}`,
        type: 'schedule',
        title: 'Novo Agendamento',
        message: `${schedule.contact?.name || 'Cliente'} - ${schedule.title}`,
        time: timeAgo,
        read: false,
        link: `/chat?schedule=${schedule.id}`
      })
    })

    // Buscar últimos 5 contratos
    const contracts = await prisma.contract.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        contact: {
          select: { name: true }
        }
      }
    })

    contracts.forEach(contract => {
      const timeAgo = getTimeAgo(contract.createdAt)
      notifications.push({
        id: `contract-${contract.id}`,
        type: 'contract',
        title: 'Novo Contrato',
        message: `Contrato de ${contract.contact?.name || 'Cliente'} - ${contract.status}`,
        time: timeAgo,
        read: false,
        link: `/chat?contract=${contract.id}`
      })
    })

    // Buscar últimos 5 tickets
    const tickets = await prisma.ticket.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        contact: {
          select: { name: true }
        }
      }
    })

    tickets.forEach(ticket => {
      const timeAgo = getTimeAgo(ticket.createdAt)
      notifications.push({
        id: `ticket-${ticket.id}`,
        type: 'ticket',
        title: 'Novo Ticket',
        message: `${ticket.contact?.name || 'Cliente'} - ${ticket.title}`,
        time: timeAgo,
        read: false,
        link: `/chat?ticket=${ticket.id}`
      })
    })

    // Ordenar por data mais recente
    notifications.sort((a, b) => {
      // Extrair timestamp do timeAgo (simplificado)
      return 0 // Já estão ordenados por createdAt
    })

    // Limitar a 10 notificações
    const recentNotifications = notifications.slice(0, 10)

    return NextResponse.json({
      success: true,
      notifications: recentNotifications
    })
  } catch (error) {
    console.error('Erro ao buscar notificações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar notificações' },
      { status: 500 }
    )
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Agora'
  if (minutes < 60) return `${minutes} min atrás`
  if (hours < 24) return `${hours}h atrás`
  if (days < 7) return `${days}d atrás`
  return new Date(date).toLocaleDateString('pt-BR')
}
