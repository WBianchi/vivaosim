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

// GET /api/contracts/stats
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log(`📊 Buscando estatísticas de contratos para userId: ${user.userId}`)

    // Contar total de contratos do usuário
    const total = await prisma.contract.count({
      where: {
        createdById: user.userId
      }
    })

    // Contar por status
    const byStatus = await prisma.contract.groupBy({
      by: ['status'],
      where: {
        createdById: user.userId
      },
      _count: {
        id: true
      }
    })

    console.log(`✅ Total de contratos: ${total}`)

    return NextResponse.json({
      success: true,
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item._count.id
        return acc
      }, {} as Record<string, number>)
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas de contratos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}
