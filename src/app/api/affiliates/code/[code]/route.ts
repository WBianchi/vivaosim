import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar planos do afiliado por código
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params

    // Buscar afiliado
    const affiliate = await prisma.affiliate.findUnique({
      where: { code },
      include: {
        user: true
      }
    })

    if (!affiliate) {
      return NextResponse.json(
        { success: false, error: 'Afiliado não encontrado' },
        { status: 404 }
      )
    }

    if (!affiliate.isActive) {
      return NextResponse.json(
        { success: false, error: 'Afiliado inativo' },
        { status: 403 }
      )
    }

    // Buscar todos os planos ativos
    const plans = await prisma.plan.findMany({
      where: {
        status: 'ACTIVE'
      },
      orderBy: {
        displayOrder: 'asc'
      }
    })

    const formattedPlans = plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: Number(plan.price),
      period: plan.period,
      features: plan.features,
      maxUsers: plan.maxUsers,
      isPopular: plan.isPopular,
      isFeatured: plan.isFeatured
    }))

    return NextResponse.json({
      success: true,
      plans: formattedPlans,
      affiliate: {
        name: affiliate.user.name,
        code: affiliate.code
      }
    })
  } catch (error) {
    console.error('Erro ao buscar planos do afiliado:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar planos' },
      { status: 500 }
    )
  }
}
