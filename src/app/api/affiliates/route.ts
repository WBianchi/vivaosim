import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar todos afiliados
export async function GET(request: NextRequest) {
  try {
    const affiliates = await prisma.user.findMany({
      where: {
        role: 'AFILIADO'
      },
      include: {
        affiliateProfile: {
          include: {
            referrals: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedAffiliates = affiliates.map(aff => {
      const profile = aff.affiliateProfile
      const totalClicks = profile?.totalClicks || 0
      const totalConversions = profile?.totalConversions || 0
      const conversionRate = totalClicks > 0 ? Number((totalConversions / totalClicks * 100).toFixed(1)) : 0
      
      // Calcular performance baseado na taxa de conversão
      let performance = 'poor'
      if (conversionRate >= 30) performance = 'excellent'
      else if (conversionRate >= 20) performance = 'good'
      else if (conversionRate >= 10) performance = 'average'

      return {
        id: aff.id,
        name: aff.name,
        email: aff.email,
        phone: aff.phone,
        avatar: aff.avatar,
        status: aff.status.toLowerCase(),
        createdAt: aff.createdAt,
        affiliateProfile: profile ? {
          code: profile.code,
          commissionRate: Number(profile.commissionRate) * 100, // Converter para %
          totalEarnings: Number(profile.totalEarnings),
          totalClicks: profile.totalClicks,
          totalViews: profile.totalViews,
          totalConversions: profile.totalConversions,
          isActive: profile.isActive
        } : null,
        shareableLink: profile ? 
          `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/afiliado/${profile.code}/planos` : null,
        salesCount: profile?.referrals.length || 0,
        totalCommissions: Number(profile?.totalEarnings || 0),
        monthlyCommissions: 0, // TODO: Calcular do mês atual
        conversionRate,
        commissionRate: profile ? Number(profile.commissionRate) * 100 : 0,
        performance,
        paymentStatus: 'pending', // TODO: Implementar lógica de pagamento
        lastSale: profile?.referrals[0]?.createdAt || null
      }
    })

    return NextResponse.json({
      success: true,
      data: formattedAffiliates
    })
  } catch (error) {
    console.error('Erro ao buscar afiliados:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar afiliados' },
      { status: 500 }
    )
  }
}

// POST - Criar afiliado
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, password, commissionRate, pixKey, plans, code } = body

    console.log('📝 Criando afiliado:', { name, email, code })

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

    // Verificar se código já existe
    const existingCode = await prisma.affiliate.findUnique({
      where: { code }
    })

    if (existingCode) {
      return NextResponse.json(
        { success: false, error: 'Código de afiliado já existe' },
        { status: 400 }
      )
    }

    // Criar usuário afiliado
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password, // TODO: Hash password
        role: 'AFILIADO',
        status: 'ATIVO'
      }
    })

    console.log('✅ Usuário criado:', user.id)

    // Criar perfil de afiliado
    const affiliate = await prisma.affiliate.create({
      data: {
        userId: user.id,
        code,
        commissionRate: commissionRate / 100, // Converter % para decimal
        isActive: true
      }
    })

    console.log('✅ Perfil de afiliado criado:', affiliate.id)
    console.log('🔗 Link:', `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/afiliado/${code}/planos`)

    return NextResponse.json({
      success: true,
      data: {
        user,
        affiliate,
        shareableLink: `/afiliado/${code}/planos`
      }
    })
  } catch (error: any) {
    console.error('Erro ao criar afiliado:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao criar afiliado' },
      { status: 500 }
    )
  }
}
