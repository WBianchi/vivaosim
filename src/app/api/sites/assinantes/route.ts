import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar sites dos assinantes
export async function GET(request: NextRequest) {
  try {
    const sites = await prisma.subscriberSite.findMany({
      include: {
        subscriber: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        plan: {
          select: {
            id: true,
            name: true,
            price: true
          }
        },
        subscription: {
          select: {
            id: true,
            status: true,
            startDate: true,
            endDate: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedSites = sites.map(site => ({
      id: site.id,
      subscriberId: site.subscriberId,
      subscriberName: site.subscriber.name,
      subscriberEmail: site.subscriber.email,
      domain: site.domain,
      customDomain: site.customDomain,
      status: site.status.toLowerCase(),
      plan: site.plan.name,
      planId: site.planId,
      subscription: site.subscription.status,
      subscriptionId: site.subscriptionId,
      createdAt: site.createdAt,
      activatedAt: site.activatedAt,
      expiresAt: site.expiresAt,
      suspendedAt: site.suspendedAt,
      suspendedReason: site.suspendedReason,
      configType: site.configType,
      primaryColor: site.primaryColor,
      secondaryColor: site.secondaryColor,
      segment: site.segment,
      serverType: site.serverType,
      serverUrl: site.serverUrl,
      visitors: site.totalVisitors,
      conversions: site.totalConversions,
      settings: site.settings
    }))

    // Calcular estatísticas
    const stats = {
      totalSites: sites.length,
      activeSites: sites.filter(s => s.status === 'ACTIVE').length,
      expiredSites: sites.filter(s => s.status === 'EXPIRED').length,
      suspendedSites: sites.filter(s => s.status === 'SUSPENDED').length,
      totalVisitors: sites.reduce((acc, s) => acc + s.totalVisitors, 0),
      totalConversions: sites.reduce((acc, s) => acc + s.totalConversions, 0)
    }

    return NextResponse.json({
      success: true,
      data: formattedSites,
      stats
    })
  } catch (error) {
    console.error('Erro ao buscar sites:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar sites' },
      { status: 500 }
    )
  }
}

// POST - Criar novo site de assinante
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      subscriberId,
      planId,
      subscriptionId,
      domain,
      customDomain,
      configType,
      primaryColor,
      secondaryColor,
      segment,
      serverType,
      serverUrl
    } = body

    // Verificar se domínio já existe
    const existingDomain = await prisma.subscriberSite.findUnique({
      where: { domain }
    })

    if (existingDomain) {
      return NextResponse.json(
        { success: false, error: 'Domínio já está em uso' },
        { status: 400 }
      )
    }

    // Verificar domínio personalizado se fornecido
    if (customDomain) {
      const existingCustomDomain = await prisma.subscriberSite.findUnique({
        where: { customDomain }
      })

      if (existingCustomDomain) {
        return NextResponse.json(
          { success: false, error: 'Domínio personalizado já está em uso' },
          { status: 400 }
        )
      }
    }

    // Buscar assinatura para pegar data de expiração
    const subscription = await prisma.planSubscription.findUnique({
      where: { id: subscriptionId }
    })

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'Assinatura não encontrada' },
        { status: 404 }
      )
    }

    // Criar site
    const site = await prisma.subscriberSite.create({
      data: {
        subscriberId,
        planId,
        subscriptionId,
        domain,
        customDomain,
        status: 'PENDING',
        configType: configType || 'MANUAL',
        primaryColor: primaryColor || '#FF6B35',
        secondaryColor: secondaryColor || '#004E89',
        segment,
        serverType: serverType || 'VIVAOSIM',
        serverUrl,
        expiresAt: subscription.endDate
      },
      include: {
        subscriber: true,
        plan: true,
        subscription: true
      }
    })

    return NextResponse.json({
      success: true,
      data: site,
      message: 'Site criado com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao criar site:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao criar site' },
      { status: 500 }
    )
  }
}
