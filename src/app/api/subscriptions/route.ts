import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar assinaturas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const where: any = {}
    if (userId) {
      where.userId = userId
    }

    const subscriptions = await prisma.planSubscription.findMany({
      where,
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            price: true,
            period: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: subscriptions
    })
  } catch (error) {
    console.error('Erro ao buscar assinaturas:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar assinaturas' },
      { status: 500 }
    )
  }
}

// POST - Criar assinatura
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, planId, paymentMethod, discount, notes } = body

    console.log('📝 Criando assinatura:', { userId, planId, paymentMethod })

    // Verificar se usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se plano existe
    const plan = await prisma.plan.findUnique({
      where: { id: planId }
    })

    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Plano não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se já tem assinatura ativa
    const existingSubscription = await prisma.planSubscription.findFirst({
      where: {
        userId,
        status: 'active'
      }
    })

    if (existingSubscription) {
      return NextResponse.json(
        { success: false, error: 'Usuário já possui uma assinatura ativa' },
        { status: 400 }
      )
    }

    // Calcular datas baseado no período do plano
    const startDate = new Date()
    let endDate = new Date()

    switch (plan.period) {
      case 'MONTHLY':
        endDate.setMonth(endDate.getMonth() + 1)
        break
      case 'QUARTERLY':
        endDate.setMonth(endDate.getMonth() + 3)
        break
      case 'SEMIANNUAL':
        endDate.setMonth(endDate.getMonth() + 6)
        break
      case 'ANNUAL':
        endDate.setFullYear(endDate.getFullYear() + 1)
        break
      case 'LIFETIME':
        endDate.setFullYear(endDate.getFullYear() + 100)
        break
    }

    // Criar assinatura
    const subscription = await prisma.planSubscription.create({
      data: {
        userId,
        planId,
        status: 'active',
        startDate,
        endDate,
        paymentMethod: paymentMethod || 'credit_card',
        lastPayment: new Date()
      }
    })

    console.log('✅ Assinatura criada:', subscription.id)

    return NextResponse.json({
      success: true,
      data: subscription
    })
  } catch (error) {
    console.error('Erro ao criar assinatura:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao criar assinatura' },
      { status: 500 }
    )
  }
}
