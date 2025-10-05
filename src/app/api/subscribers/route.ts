import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar assinantes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {
      role: 'ASSINANTE'
    }

    if (status && status !== 'ALL') {
      where.status = status
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const subscribers = await prisma.user.findMany({
      where,
      include: {
        subscriptions: {
          include: {
            plan: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Formatar dados
    const formattedSubscribers = subscribers.map(sub => {
      const subscription = sub.subscriptions[0]
      return {
        id: sub.id,
        name: sub.name,
        email: sub.email,
        phone: sub.phone,
        avatar: sub.avatar,
        status: sub.status.toLowerCase(),
        createdAt: sub.createdAt,
        updatedAt: sub.updatedAt,
        subdomain: (sub as any).subdomain,
        subscription: subscription ? {
          id: subscription.id,
          status: subscription.status,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          autoRenewal: true
        } : null,
        plan: subscription?.plan ? {
          id: subscription.plan.id,
          name: subscription.plan.name,
          price: Number(subscription.plan.price),
          period: subscription.plan.period.toLowerCase()
        } : null,
        payment: subscription ? {
          status: 'paid',
          method: subscription.paymentMethod || 'credit_card',
          lastPayment: subscription.lastPayment,
          totalPaid: Number(subscription.plan?.price || 0)
        } : null,
        lastLogin: sub.lastLoginAt,
        metrics: {
          totalQuotes: 0,
          totalContracts: 0,
          totalSchedules: 0,
          totalRevenue: 0
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: formattedSubscribers
    })
  } catch (error) {
    console.error('Erro ao buscar assinantes:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar assinantes' },
      { status: 500 }
    )
  }
}

// POST - Criar assinante
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, password, planId, subdomain, document, company, avatar, affiliateCode } = body

    console.log('📝 Dados recebidos:', { name, email, phone, planId, subdomain, document, company, affiliateCode })

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Verificar se subdomínio já existe
    if (subdomain) {
      const existingSubdomain = await prisma.user.findFirst({
        where: { subdomain: subdomain } as any
      })

      if (existingSubdomain) {
        return NextResponse.json(
          { success: false, error: 'Subdomínio já está em uso' },
          { status: 400 }
        )
      }
    }

    // Criar usuário assinante
    const subscriber = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password, // TODO: Hash password
        role: 'ASSINANTE',
        status: 'ATIVO',
        subdomain: subdomain || `${name.toLowerCase().replace(/\s+/g, '')}-${Date.now()}`,
        cpf: document && document.replace(/\D/g, '').length === 11 ? document : null,
        cnpj: document && document.replace(/\D/g, '').length === 14 ? document : null,
        avatar: avatar || null
      } as any
    })

    console.log('✅ Usuário criado:', subscriber.id)
    console.log('📋 CPF salvo:', (subscriber as any).cpf)
    console.log('📋 CNPJ salvo:', (subscriber as any).cnpj)
    console.log('🌐 Subdomain salvo:', (subscriber as any).subdomain)

    let subscriptionCreated = null

    // Criar assinatura se planId foi fornecido
    if (planId && planId !== '') {
      console.log('📦 Criando assinatura para plano:', planId)
      
      try {
        const subscription = await prisma.planSubscription.create({
          data: {
            userId: subscriber.id,
            planId,
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
            paymentMethod: 'credit_card'
          }
        })
        
        subscriptionCreated = subscription
        console.log('✅ Assinatura criada:', subscription.id)

        // Se veio de afiliado, criar referral
        if (affiliateCode) {
          try {
            const affiliate = await prisma.affiliate.findUnique({
              where: { code: affiliateCode }
            })

            if (affiliate) {
              const plan = await prisma.plan.findUnique({
                where: { id: planId }
              })

              if (plan) {
                const saleValue = Number(plan.price)
                const commission = saleValue * Number(affiliate.commissionRate)

                await prisma.affiliateReferral.create({
                  data: {
                    affiliateId: affiliate.id,
                    referredId: subscriber.id,
                    saleValue,
                    commission,
                    isPaid: false
                  }
                })

                // Atualizar total de ganhos do afiliado
                await prisma.affiliate.update({
                  where: { id: affiliate.id },
                  data: {
                    totalEarnings: { increment: commission }
                  }
                })

                console.log('✅ Referral criado! Comissão:', commission)
              }
            }
          } catch (refError) {
            console.error('❌ Erro ao criar referral:', refError)
          }
        }
      } catch (subError: any) {
        console.error('❌ Erro ao criar assinatura:', subError)
        console.error('❌ Detalhes do erro:', subError.message)
      }
    } else {
      console.log('⚠️ Nenhum plano fornecido, planId:', planId)
    }

    return NextResponse.json({
      success: true,
      data: {
        ...subscriber,
        subscriptionCreated: !!subscriptionCreated
      }
    })
  } catch (error) {
    console.error('Erro ao criar assinante:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao criar assinante' },
      { status: 500 }
    )
  }
}
