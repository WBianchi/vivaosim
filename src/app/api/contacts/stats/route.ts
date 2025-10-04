import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Total de clientes
    const totalClients = await prisma.contact.count()

    // Clientes ativos (com status diferente de INATIVO)
    const activeClients = await prisma.contact.count({
      where: {
        status: {
          not: 'INATIVO'
        }
      }
    })

    // Novos este mês
    const firstDayOfMonth = new Date()
    firstDayOfMonth.setDate(1)
    firstDayOfMonth.setHours(0, 0, 0, 0)

    const newThisMonth = await prisma.contact.count({
      where: {
        createdAt: {
          gte: firstDayOfMonth
        }
      }
    })

    // Contratos ativos
    const activeContracts = await prisma.contract.count({
      where: {
        status: 'ATIVO'
      }
    })

    // Orçamentos pendentes
    const pendingQuotes = await prisma.quote.count({
      where: {
        status: 'PENDENTE'
      }
    })

    // Tickets abertos
    const openTickets = await prisma.ticket.count({
      where: {
        status: {
          in: ['ABERTO', 'EM_ANDAMENTO']
        }
      }
    })

    // Agendamentos futuros
    const scheduledMeetings = await prisma.appointment.count({
      where: {
        startDateTime: {
          gte: new Date()
        },
        status: 'SCHEDULED'
      }
    })

    // Receita total (soma dos contratos ativos)
    const contractsRevenue = await prisma.contract.aggregate({
      where: {
        status: 'ATIVO'
      },
      _sum: {
        amount: true
      }
    })

    const totalRevenue = contractsRevenue._sum.amount || 0

    // Ticket médio
    const avgTicketValue = activeContracts > 0 
      ? Number(totalRevenue) / activeContracts 
      : 0

    // Taxa de conversão (clientes ativos / total)
    const conversionRate = totalClients > 0 
      ? (activeClients / totalClients) * 100 
      : 0

    const stats = {
      totalClients,
      activeClients,
      newThisMonth,
      totalRevenue: Number(totalRevenue),
      avgTicketValue,
      activeContracts,
      pendingQuotes,
      openTickets,
      scheduledMeetings,
      conversionRate
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
