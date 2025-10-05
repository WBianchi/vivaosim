import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

async function verifyAuth(request: NextRequest) {
  const headersList = await headers()
  const authorization = headersList.get('authorization')

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null
  }

  const token = authorization.substring(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }
}

// GET /api/quotes/stats - Estatísticas gerais de orçamentos
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Contar total de orçamentos do usuário
    const total = await prisma.quote.count({
      where: {
        contact: {
          userId: user.id
        }
      }
    })

    // Estatísticas adicionais
    const stats = await prisma.quote.groupBy({
      by: ['status'],
      where: {
        contact: {
          userId: user.id
        }
      },
      _count: true,
      _sum: {
        total: true
      }
    })

    return NextResponse.json({
      success: true,
      total,
      stats: stats.map(s => ({
        status: s.status,
        count: s._count,
        totalValue: s._sum.total || 0
      }))
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}
