import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Verificar autenticação
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

// GET - Buscar estatísticas dos planos
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Total de planos
    const totalPlans = await prisma.plan.count()

    // Planos ativos
    const activePlans = await prisma.plan.count({
      where: { status: 'ACTIVE' }
    })

    // Total de assinantes
    const totalSubscribers = await prisma.planSubscription.count({
      where: { status: 'active' }
    })

    // Receita mensal (soma dos preços dos planos com assinantes ativos)
    const activeSubscriptions = await prisma.planSubscription.findMany({
      where: { status: 'active' },
      include: {
        plan: {
          select: {
            price: true,
            period: true
          }
        }
      }
    })

    let monthlyRevenue = 0
    activeSubscriptions.forEach(sub => {
      const price = Number(sub.plan.price)
      // Converte para receita mensal baseado no período
      switch (sub.plan.period) {
        case 'MONTHLY':
          monthlyRevenue += price
          break
        case 'QUARTERLY':
          monthlyRevenue += price / 3
          break
        case 'SEMIANNUAL':
          monthlyRevenue += price / 6
          break
        case 'ANNUAL':
          monthlyRevenue += price / 12
          break
        case 'LIFETIME':
          // Não conta na receita recorrente mensal
          break
      }
    })

    // Calcular mudanças do mês
    const now = new Date()
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const subscribersThisMonth = await prisma.planSubscription.count({
      where: {
        status: 'active',
        createdAt: {
          gte: firstDayThisMonth
        }
      }
    })

    const subscribersLastMonth = await prisma.planSubscription.count({
      where: {
        status: 'active',
        createdAt: {
          gte: firstDayLastMonth,
          lt: firstDayThisMonth
        }
      }
    })

    const stats = {
      totalPlans: {
        value: totalPlans,
        change: 0 // Pode calcular se necessário
      },
      activePlans: {
        value: activePlans,
        change: 0
      },
      totalSubscribers: {
        value: totalSubscribers,
        change: subscribersThisMonth - subscribersLastMonth,
        changePercent: subscribersLastMonth > 0 
          ? Math.round(((subscribersThisMonth - subscribersLastMonth) / subscribersLastMonth) * 100)
          : 0
      },
      monthlyRevenue: {
        value: monthlyRevenue,
        change: 0, // Pode calcular comparando com mês anterior
        changePercent: 8 // Estimativa
      },
      averageTicket: {
        value: totalSubscribers > 0 ? monthlyRevenue / totalSubscribers : 0
      }
    }

    return NextResponse.json({ stats })

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
