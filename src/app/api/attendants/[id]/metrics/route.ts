import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar métricas do atendente por período
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const period = searchParams.get('period') || '30' // dias

    const where: any = {
      attendantId: params.id
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    } else {
      // Últimos X dias
      const days = parseInt(period)
      where.date = {
        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      }
    }

    const metrics = await prisma.attendantMetrics.findMany({
      where,
      orderBy: { date: 'desc' }
    })

    // Calcular totais e médias
    const totals = metrics.reduce((acc, m) => ({
      totalChats: acc.totalChats + m.totalChats,
      totalMessages: acc.totalMessages + m.totalMessages,
      totalLeads: acc.totalLeads + m.totalLeads,
      convertedLeads: acc.convertedLeads + m.convertedLeads,
      totalQuotes: acc.totalQuotes + m.totalQuotes,
      approvedQuotes: acc.approvedQuotes + m.approvedQuotes,
      totalContracts: acc.totalContracts + m.totalContracts,
      totalRevenue: acc.totalRevenue + Number(m.totalRevenue),
      totalTickets: acc.totalTickets + m.totalTickets,
      resolvedTickets: acc.resolvedTickets + m.resolvedTickets,
      totalSchedules: acc.totalSchedules + m.totalSchedules,
      completedSchedules: acc.completedSchedules + m.completedSchedules
    }), {
      totalChats: 0,
      totalMessages: 0,
      totalLeads: 0,
      convertedLeads: 0,
      totalQuotes: 0,
      approvedQuotes: 0,
      totalContracts: 0,
      totalRevenue: 0,
      totalTickets: 0,
      resolvedTickets: 0,
      totalSchedules: 0,
      completedSchedules: 0
    })

    const averages = {
      avgResponseTime: metrics.reduce((sum, m) => sum + m.avgResponseTime, 0) / metrics.length || 0,
      avgResolutionTime: metrics.reduce((sum, m) => sum + m.avgResolutionTime, 0) / metrics.length || 0,
      avgSatisfactionScore: metrics.reduce((sum, m) => sum + m.satisfactionScore, 0) / metrics.length || 0,
      avgConversionRate: totals.totalLeads > 0 ? (totals.convertedLeads / totals.totalLeads) * 100 : 0
    }

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        totals,
        averages,
        period: metrics.length
      }
    })
  } catch (error) {
    console.error('Erro ao buscar métricas:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar métricas' },
      { status: 500 }
    )
  }
}

// POST - Atualizar métricas do dia
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Buscar ou criar métrica do dia
    const existingMetric = await prisma.attendantMetrics.findUnique({
      where: {
        attendantId_date: {
          attendantId: params.id,
          date: today
        }
      }
    })

    let metric
    if (existingMetric) {
      metric = await prisma.attendantMetrics.update({
        where: { id: existingMetric.id },
        data: body
      })
    } else {
      metric = await prisma.attendantMetrics.create({
        data: {
          ...body,
          attendantId: params.id,
          date: today
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: metric
    })
  } catch (error) {
    console.error('Erro ao atualizar métricas:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar métricas' },
      { status: 500 }
    )
  }
}
