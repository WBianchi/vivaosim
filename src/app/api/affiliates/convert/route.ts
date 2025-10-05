import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Registrar conversão do afiliado
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, planId, userId } = body

    console.log('💰 Registrando conversão:', { code, planId, userId })

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

    // Buscar último clique do afiliado (últimas 24h)
    const lastClick = await prisma.affiliateClick.findFirst({
      where: {
        affiliateId: affiliate.id,
        converted: false,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Últimas 24h
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (lastClick) {
      // Marcar clique como convertido
      await prisma.affiliateClick.update({
        where: { id: lastClick.id },
        data: {
          converted: true,
          convertedAt: new Date()
        }
      })
    }

    // Atualizar métricas do afiliado
    await prisma.affiliate.update({
      where: { id: affiliate.id },
      data: {
        totalConversions: { increment: 1 }
      }
    })

    console.log('✅ Conversão registrada!')

    return NextResponse.json({
      success: true,
      message: 'Conversão registrada com sucesso'
    })
  } catch (error) {
    console.error('Erro ao registrar conversão:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao registrar conversão' },
      { status: 500 }
    )
  }
}
