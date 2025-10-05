import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Rastrear clique/visita do afiliado
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, page, action, planId } = body

    console.log('📊 Tracking:', { code, page, action, planId })

    // Buscar afiliado
    const affiliate = await prisma.affiliate.findUnique({
      where: { code }
    })

    if (!affiliate) {
      return NextResponse.json(
        { success: false, error: 'Afiliado não encontrado' },
        { status: 404 }
      )
    }

    // Obter dados da requisição
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || 'direct'

    // Criar registro de clique
    const click = await prisma.affiliateClick.create({
      data: {
        affiliateId: affiliate.id,
        ipAddress,
        userAgent,
        referer,
        page,
        converted: false
      }
    })

    // Atualizar métricas do afiliado
    if (action === 'view') {
      await prisma.affiliate.update({
        where: { id: affiliate.id },
        data: {
          totalViews: { increment: 1 }
        }
      })
    } else if (action === 'click') {
      await prisma.affiliate.update({
        where: { id: affiliate.id },
        data: {
          totalClicks: { increment: 1 }
        }
      })
    }

    console.log('✅ Tracking registrado:', click.id)

    return NextResponse.json({
      success: true,
      data: click
    })
  } catch (error) {
    console.error('Erro ao rastrear:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao rastrear' },
      { status: 500 }
    )
  }
}
