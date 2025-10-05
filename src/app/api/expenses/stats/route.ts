import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'

async function verifyAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('accessToken')?.value

    if (!token) return null

    const payload = verifyAccessToken(token)
    return payload
  } catch (error) {
    return null
  }
}

// GET - Estatísticas financeiras
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const siteId = searchParams.get('siteId')
    const contractId = searchParams.get('contractId')

    const where: any = {}
    if (siteId) where.siteId = siteId
    if (contractId) where.contractId = contractId

    // Total de despesas
    const totalExpenses = await prisma.expense.count({ where })

    // Soma dos valores
    const amountStats = await prisma.expense.aggregate({
      where,
      _sum: {
        amount: true,
        paidAmount: true
      }
    })

    // Despesas por status
    const byStatus = await prisma.expense.groupBy({
      by: ['status'],
      where,
      _count: true,
      _sum: {
        amount: true,
        paidAmount: true
      }
    })

    // Despesas por categoria
    const byCategory = await prisma.expense.groupBy({
      by: ['category'],
      where,
      _count: true,
      _sum: {
        amount: true,
        paidAmount: true
      },
      orderBy: {
        _sum: {
          amount: 'desc'
        }
      }
    })

    // Despesas atrasadas
    const overdue = await prisma.expense.count({
      where: {
        ...where,
        status: 'ATRASADO'
      }
    })

    // Próximas a vencer (7 dias)
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

    const upcoming = await prisma.expense.count({
      where: {
        ...where,
        status: 'PENDENTE',
        dueDate: {
          lte: sevenDaysFromNow,
          gte: new Date()
        }
      }
    })

    return NextResponse.json({
      success: true,
      stats: {
        total: totalExpenses,
        totalAmount: Number(amountStats._sum.amount || 0),
        totalPaid: Number(amountStats._sum.paidAmount || 0),
        totalPending: Number(amountStats._sum.amount || 0) - Number(amountStats._sum.paidAmount || 0),
        overdue,
        upcoming,
        byStatus,
        byCategory
      }
    })

  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}
