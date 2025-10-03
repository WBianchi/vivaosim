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

// GET - Buscar estatísticas dos agentes
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Total de agentes
    const totalAgents = await prisma.agent.count()

    // Agentes ativos
    const activeAgents = await prisma.agent.count({
      where: {
        status: 'ACTIVE'
      }
    })

    // Agentes em uso (com integrations ativas)
    const agentsInUse = await prisma.agent.count({
      where: {
        OR: [
          { totalInteractions: { gt: 0 } },
          { lastUsed: { not: null } }
        ]
      }
    })

    // Usuários que criaram agentes (únicos)
    const uniqueCreators = await prisma.agent.findMany({
      select: {
        createdById: true
      },
      distinct: ['createdById']
    })

    // Calcular mudanças do mês (comparar com mês anterior)
    const now = new Date()
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const agentsThisMonth = await prisma.agent.count({
      where: {
        createdAt: {
          gte: firstDayThisMonth
        }
      }
    })

    const agentsLastMonth = await prisma.agent.count({
      where: {
        createdAt: {
          gte: firstDayLastMonth,
          lt: firstDayThisMonth
        }
      }
    })

    const activeThisMonth = await prisma.agent.count({
      where: {
        status: 'ACTIVE',
        updatedAt: {
          gte: firstDayThisMonth
        }
      }
    })

    const activeLastMonth = await prisma.agent.count({
      where: {
        status: 'ACTIVE',
        updatedAt: {
          gte: firstDayLastMonth,
          lt: firstDayThisMonth
        }
      }
    })

    // Total de interações no mês
    const agentsWithInteractions = await prisma.agent.findMany({
      where: {
        lastUsed: {
          gte: firstDayThisMonth
        }
      }
    })

    const usedThisMonth = agentsWithInteractions.length

    const stats = {
      totalAgents: {
        value: totalAgents,
        change: agentsThisMonth - agentsLastMonth
      },
      activeAgents: {
        value: activeAgents,
        change: activeThisMonth - activeLastMonth
      },
      agentsInUse: {
        value: agentsInUse,
        change: usedThisMonth
      },
      uniqueUsers: {
        value: uniqueCreators.length,
        change: uniqueCreators.length > 0 ? Math.floor(uniqueCreators.length * 0.15) : 0 // Estimativa
      }
    }

    return NextResponse.json({ stats })

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
