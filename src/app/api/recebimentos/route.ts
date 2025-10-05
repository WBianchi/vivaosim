import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('accessToken')?.value

    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    const payload = verifyAccessToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 403 })
    }

    // Buscar o site do cliente
    const site = await prisma.clientSite.findFirst({
      where: { clientId: payload.contactId }
    })

    if (!site) {
      return NextResponse.json({ 
        success: true,
        recebimentos: [],
        stats: {
          totalReceived: 0,
          pending: 0,
          processing: 0,
          failed: 0,
          thisMonth: 0,
          lastMonth: 0,
          growth: 0
        }
      })
    }

    // Buscar todos os recebimentos (compras de presentes)
    // TODO: Implementar quando o modelo RecebimentoPresente estiver no Prisma Client
    const recebimentos: any[] = []

    // Calcular estatísticas
    const now = new Date()
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const totalReceived = recebimentos
      .filter(r => r.status === 'PAGO')
      .reduce((sum, r) => sum + Number(r.valor), 0)

    const pending = recebimentos
      .filter(r => r.status === 'PENDENTE')
      .reduce((sum, r) => sum + Number(r.valor), 0)

    const processing = recebimentos
      .filter(r => r.status === 'PROCESSANDO')
      .reduce((sum, r) => sum + Number(r.valor), 0)

    const failed = recebimentos
      .filter(r => r.status === 'FALHOU')
      .reduce((sum, r) => sum + Number(r.valor), 0)

    const thisMonth = recebimentos
      .filter(r => r.createdAt >= firstDayThisMonth && r.status === 'PAGO')
      .reduce((sum, r) => sum + Number(r.valor), 0)

    const lastMonth = recebimentos
      .filter(r => 
        r.createdAt >= firstDayLastMonth && 
        r.createdAt <= lastDayLastMonth && 
        r.status === 'PAGO'
      )
      .reduce((sum, r) => sum + Number(r.valor), 0)

    const growth = lastMonth > 0 
      ? ((thisMonth - lastMonth) / lastMonth) * 100 
      : thisMonth > 0 ? 100 : 0

    // Formatar recebimentos para o frontend
    const recebimentosFormatados = recebimentos.map(r => ({
      id: r.id,
      item: r.produto.nome,
      buyer: r.comprador.name,
      buyerEmail: r.comprador.email,
      buyerPhone: r.comprador.phone,
      value: Number(r.valor),
      date: r.createdAt.toISOString(),
      status: r.status.toLowerCase(),
      payment: r.metodoPagamento,
      transactionId: r.transactionId,
      mensagem: r.mensagem
    }))

    return NextResponse.json({
      success: true,
      recebimentos: recebimentosFormatados,
      stats: {
        totalReceived,
        pending,
        processing,
        failed,
        thisMonth,
        lastMonth,
        growth: Number(growth.toFixed(1))
      }
    })

  } catch (error: any) {
    console.error('Erro ao buscar recebimentos:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}
