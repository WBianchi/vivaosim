import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // TODO: Adicionar autenticação quando necessário
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    // }

    // Buscar dados do mês atual
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    // Mês anterior para comparação
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // 1. Total de Contatos/Clientes Ativos
    const totalContacts = await prisma.contact.count({
      where: {
        status: {
          in: ['LEAD_QUALIFICADO', 'PROSPECT', 'CLIENTE']
        }
      }
    })

    const lastMonthContacts = await prisma.contact.count({
      where: {
        status: {
          in: ['LEAD_QUALIFICADO', 'PROSPECT', 'CLIENTE']
        },
        createdAt: {
          gte: firstDayOfLastMonth,
          lte: lastDayOfLastMonth
        }
      }
    })

    const contactsChange = lastMonthContacts > 0 
      ? (((totalContacts - lastMonthContacts) / lastMonthContacts) * 100).toFixed(1)
      : '0'

    // 2. Eventos do Mês
    const eventsThisMonth = await prisma.event.count({
      where: {
        eventDate: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth
        }
      }
    })

    const eventsLastMonth = await prisma.event.count({
      where: {
        eventDate: {
          gte: firstDayOfLastMonth,
          lte: lastDayOfLastMonth
        }
      }
    })

    const eventsChange = eventsLastMonth > 0
      ? (((eventsThisMonth - eventsLastMonth) / eventsLastMonth) * 100).toFixed(1)
      : '0'

    // 3. Receita do Mês (Pagamentos pagos)
    const paymentsThisMonth = await prisma.payment.aggregate({
      where: {
        status: 'PAGO',
        paidDate: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth
        }
      },
      _sum: {
        amount: true
      }
    })

    const paymentsLastMonth = await prisma.payment.aggregate({
      where: {
        status: 'PAGO',
        paidDate: {
          gte: firstDayOfLastMonth,
          lte: lastDayOfLastMonth
        }
      },
      _sum: {
        amount: true
      }
    })

    const revenueThisMonth = Number(paymentsThisMonth._sum.amount || 0)
    const revenueLastMonth = Number(paymentsLastMonth._sum.amount || 0)
    
    const revenueChange = revenueLastMonth > 0
      ? (((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100).toFixed(1)
      : '0'

    // 4. Orçamentos Aprovados (Total)
    const approvedQuotes = await prisma.quote.aggregate({
      where: {
        status: 'approved'
      },
      _sum: {
        amount: true
      }
    })

    const approvedQuotesLastMonth = await prisma.quote.aggregate({
      where: {
        status: 'approved',
        updatedAt: {
          gte: firstDayOfLastMonth,
          lte: lastDayOfLastMonth
        }
      },
      _sum: {
        amount: true
      }
    })

    const quotesTotal = Number(approvedQuotes._sum.amount || 0)
    const quotesLastMonth = Number(approvedQuotesLastMonth._sum.amount || 0)
    
    const quotesChange = quotesLastMonth > 0
      ? (((quotesTotal - quotesLastMonth) / quotesLastMonth) * 100).toFixed(1)
      : '0'

    // 5. Atividades Recentes
    const recentActivities = await prisma.contactActivity.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        contact: {
          select: {
            name: true
          }
        },
        user: {
          select: {
            name: true
          }
        }
      }
    })

    const formattedActivities = recentActivities.map(activity => {
      const contactName = activity.contact.name
      const userName = activity.user.name
      
      let description = ''
      switch (activity.type) {
        case 'conversion':
          description = `${contactName} foi convertido em cliente`
          break
        case 'call':
          description = `${userName} realizou ligação com ${contactName}`
          break
        case 'meeting':
          description = `Reunião agendada com ${contactName}`
          break
        case 'email':
          description = `Email enviado para ${contactName}`
          break
        case 'note':
          description = `Nova nota adicionada para ${contactName}`
          break
        case 'status_change':
          description = `Status de ${contactName} foi atualizado`
          break
        default:
          description = activity.title || `Atividade com ${contactName}`
      }
      
      return {
        id: activity.id,
        description,
        createdAt: activity.createdAt
      }
    })

    // 6. Agendamentos Hoje
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todaySchedules = await prisma.schedule.count({
      where: {
        datetime: {
          gte: today,
          lt: tomorrow
        },
        status: 'scheduled'
      }
    })

    return NextResponse.json({
      stats: {
        contacts: {
          value: totalContacts,
          change: contactsChange,
          trend: Number(contactsChange) >= 0 ? 'up' : 'down'
        },
        events: {
          value: eventsThisMonth,
          change: eventsChange,
          trend: Number(eventsChange) >= 0 ? 'up' : 'down'
        },
        revenue: {
          value: Number(revenueThisMonth),
          change: revenueChange,
          trend: Number(revenueChange) >= 0 ? 'up' : 'down'
        },
        quotes: {
          value: Number(quotesTotal),
          change: quotesChange,
          trend: Number(quotesChange) >= 0 ? 'up' : 'down'
        },
        todaySchedules
      },
      activities: formattedActivities
    })

  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}
