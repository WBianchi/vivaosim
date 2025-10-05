import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar estatísticas de afiliados
export async function GET(request: NextRequest) {
  try {
    // Total de afiliados
    const totalAffiliates = await prisma.affiliate.count()

    // Afiliados ativos
    const activeAffiliates = await prisma.affiliate.count({
      where: { isActive: true }
    })

    // Buscar todos afiliados para calcular métricas
    const affiliates = await prisma.affiliate.findMany({
      include: {
        referrals: true
      }
    })

    // Total de comissões
    const totalCommissions = affiliates.reduce((sum, aff) => 
      sum + Number(aff.totalEarnings), 0
    )

    // Média de comissões
    const avgCommission = totalAffiliates > 0 ? totalCommissions / totalAffiliates : 0

    // Top performer (maior comissão)
    const topPerformer = affiliates.length > 0 
      ? Math.max(...affiliates.map(aff => Number(aff.totalEarnings)))
      : 0

    // Taxa de conversão média
    const totalClicks = affiliates.reduce((sum, aff) => sum + aff.totalClicks, 0)
    const totalConversions = affiliates.reduce((sum, aff) => sum + aff.totalConversions, 0)
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100) : 0

    const stats = {
      totalAffiliates,
      activeAffiliates,
      totalCommissions,
      avgCommission,
      topPerformer,
      conversionRate: Number(conversionRate.toFixed(1))
    }

    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}
