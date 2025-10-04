import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        affiliateProfile: {
          include: {
            referrals: true
          }
        },
        subscriptions: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    let stats: any = {}

    // Estatísticas baseadas no role
    switch (user.role) {
      case 'ADMINISTRADOR':
        // Admin vê tudo
        const [totalUsers, totalLeads, totalClients, totalRevenue, totalTickets] = await Promise.all([
          prisma.user.count(),
          prisma.lead.count(),
          prisma.contact.count({ where: { status: 'CLIENTE' } }),
          prisma.payment.aggregate({
            where: { status: 'PAGO' },
            _sum: { amount: true }
          }),
          prisma.ticket.count({ where: { status: 'open' } })
        ])

        stats = {
          totalUsers,
          totalLeads,
          totalClients,
          totalRevenue: totalRevenue._sum.amount || 0,
          totalTickets,
          totalContracts: await prisma.contract.count(),
          totalQuotes: await prisma.quote.count(),
          conversionRate: totalLeads > 0 ? Math.round((totalClients / totalLeads) * 100) : 0,
          avgResponseTime: '2.5min',
          satisfaction: 95
        }
        break

      case 'ATENDENTE':
        // Atendente vê seus atendimentos
        const [myChats, myTickets, myContacts] = await Promise.all([
          prisma.whatsAppChat.count({
            where: { assignedToId: user.id }
          }),
          prisma.ticket.count({
            where: { assignedToId: user.id }
          }),
          prisma.contact.count({
            where: { assignedToId: user.id }
          })
        ])

        stats = {
          totalChats: myChats,
          totalTickets: myTickets,
          totalClients: myContacts,
          totalLeads: await prisma.lead.count({ where: { assignedToId: user.id } }),
          avgResponseTime: '1.8min',
          satisfaction: 92,
          resolvedTickets: await prisma.ticket.count({
            where: { assignedToId: user.id, status: 'resolved' }
          })
        }
        break

      case 'ASSINANTE':
        // Assinante vê seus eventos e orçamentos
        const [myEvents, myQuotes, myContracts, myPayments] = await Promise.all([
          prisma.event.count({
            where: { createdById: user.id }
          }),
          prisma.quote.count({
            where: { createdById: user.id }
          }),
          prisma.contract.count({
            where: { createdById: user.id }
          }),
          prisma.payment.aggregate({
            where: { clientId: user.id, status: 'PAGO' },
            _sum: { amount: true }
          })
        ])

        stats = {
          totalEvents: myEvents,
          totalQuotes: myQuotes,
          totalContracts: myContracts,
          totalSpent: myPayments._sum.amount || 0,
          activeEvents: await prisma.event.count({
            where: { createdById: user.id, status: 'EM_ANDAMENTO' }
          }),
          completedEvents: await prisma.event.count({
            where: { createdById: user.id, status: 'FINALIZADO' }
          })
        }
        break

      case 'AFILIADO':
        // Afiliado vê suas comissões
        if (user.affiliateProfile) {
          const referrals = user.affiliateProfile.referrals
          const totalReferrals = referrals.length
          const paidCommissions = referrals.filter(r => r.isPaid).length
          const pendingCommissions = referrals.filter(r => !r.isPaid).length
          
          const totalEarned = referrals
            .filter(r => r.isPaid)
            .reduce((sum, r) => sum + Number(r.commission), 0)
          
          const pendingEarnings = referrals
            .filter(r => !r.isPaid)
            .reduce((sum, r) => sum + Number(r.commission), 0)

          stats = {
            totalReferrals,
            paidCommissions,
            pendingCommissions,
            totalEarned,
            pendingEarnings,
            commissionRate: user.affiliateProfile.commissionRate,
            conversionRate: totalReferrals > 0 ? Math.round((paidCommissions / totalReferrals) * 100) : 0
          }
        }
        break

      case 'CLIENTE':
        // Cliente vê seus eventos e pagamentos
        const [clientEvents, clientPayments, clientQuotes] = await Promise.all([
          prisma.event.count({
            where: { 
              OR: [
                { createdById: user.id },
                { lead: { email: user.email } }
              ]
            }
          }),
          prisma.payment.aggregate({
            where: { clientId: user.id },
            _sum: { amount: true }
          }),
          prisma.quote.count({
            where: { contact: { email: user.email } }
          })
        ])

        stats = {
          totalEvents: clientEvents,
          totalQuotes: clientQuotes,
          totalPaid: clientPayments._sum.amount || 0,
          pendingPayments: await prisma.payment.count({
            where: { clientId: user.id, status: 'PENDENTE' }
          })
        }
        break
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}
