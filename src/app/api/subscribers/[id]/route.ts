import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar assinante por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subscriber = await prisma.user.findFirst({
      where: {
        id: params.id,
        role: 'ASSINANTE'
      },
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
      }
    })

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: 'Assinante não encontrado' },
        { status: 404 }
      )
    }

    // Formatar dados
    const subscription = subscriber.subscriptions[0]
    const formattedSubscriber = {
      id: subscriber.id,
      name: subscriber.name,
      email: subscriber.email,
      phone: subscriber.phone,
      avatar: subscriber.avatar,
      status: subscriber.status,
      cpf: (subscriber as any).cpf,
      cnpj: (subscriber as any).cnpj,
      subdomain: (subscriber as any).subdomain,
      company: subscriber.address,
      subscription: subscription ? {
        id: subscription.id,
        planId: subscription.planId,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate
      } : null,
      plan: subscription?.plan ? {
        id: subscription.plan.id,
        name: subscription.plan.name,
        price: Number(subscription.plan.price),
        period: subscription.plan.period
      } : null
    }

    return NextResponse.json({
      success: true,
      data: formattedSubscriber
    })
  } catch (error) {
    console.error('Erro ao buscar assinante:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar assinante' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar assinante
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, phone, avatar, status, password, subdomain, document, company, planId } = body

    console.log('📝 Atualizando assinante:', params.id, body)

    const updateData: any = {
      name,
      phone,
      avatar,
      status: status?.toUpperCase() || 'ATIVO'
    }

    // Atualizar subdomain se fornecido
    if (subdomain) {
      updateData.subdomain = subdomain
    }

    // Atualizar CPF/CNPJ
    if (document) {
      const numbers = document.replace(/\D/g, '')
      console.log('📋 Documento:', document, '| Números:', numbers, '| Length:', numbers.length)
      
      if (numbers.length === 11) {
        updateData.cpf = document
        updateData.cnpj = null
        console.log('✅ Salvando como CPF')
      } else if (numbers.length === 14) {
        updateData.cnpj = document
        updateData.cpf = null
        console.log('✅ Salvando como CNPJ')
      }
    }

    // Só atualiza senha se foi fornecida
    if (password) {
      updateData.password = password // TODO: Hash password
    }

    const updatedSubscriber = await prisma.user.update({
      where: { 
        id: params.id
      },
      data: updateData as any
    })

    console.log('✅ Assinante atualizado:', updatedSubscriber.id)

    // Atualizar plano se fornecido
    if (planId) {
      console.log('📦 Atualizando plano para:', planId)
      
      try {
        // Verificar se já tem assinatura
        const existingSubscription = await prisma.planSubscription.findFirst({
          where: { userId: params.id }
        })

        if (existingSubscription) {
          // Atualizar assinatura existente
          await prisma.planSubscription.update({
            where: { id: existingSubscription.id },
            data: {
              planId,
              updatedAt: new Date()
            }
          })
          console.log('✅ Assinatura atualizada')
        } else {
          // Criar nova assinatura
          await prisma.planSubscription.create({
            data: {
              userId: params.id,
              planId,
              status: 'active',
              startDate: new Date(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              paymentMethod: 'credit_card'
            }
          })
          console.log('✅ Nova assinatura criada')
        }
      } catch (planError: any) {
        console.error('❌ Erro ao atualizar plano:', planError.message)
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedSubscriber
    })
  } catch (error) {
    console.error('Erro ao atualizar assinante:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar assinante' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar assinante
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: {
        id: params.id,
        role: 'ASSINANTE'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Assinante deletado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao deletar assinante:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar assinante' },
      { status: 500 }
    )
  }
}
