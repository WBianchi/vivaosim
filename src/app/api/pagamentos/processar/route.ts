import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { siteId, produtoId, metodo, compradorNome, compradorEmail, compradorTelefone } = body

    // Validações
    if (!siteId || !produtoId || !metodo) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    // Buscar produto
    const produto = await prisma.produtoCliente.findUnique({
      where: { id: produtoId },
      include: { site: true }
    })

    if (!produto || !produto.disponivel) {
      return NextResponse.json(
        { error: 'Produto não disponível' },
        { status: 400 }
      )
    }

    // Criar recebimento (registrar a intenção de compra)
    const recebimento = await prisma.recebimentoPresente.create({
      data: {
        siteId,
        produtoId,
        valor: produto.preco,
        status: 'PENDENTE',
        metodoPagamento: metodo.toUpperCase(),
        compradorNome: compradorNome || 'Anônimo',
        compradorEmail: compradorEmail || null,
        compradorTelefone: compradorTelefone || null
      }
    })

    // Aqui você integraria com gateway de pagamento real (Mercado Pago, Stripe, etc)
    // Por enquanto, vamos simular um pagamento pendente

    if (metodo === 'pix') {
      // Gerar QR Code PIX (simulado)
      const pixCode = `00020126580014br.gov.bcb.pix0136${recebimento.id}5204000053039865802BR5925VIVAOSIM6009SAOPAULO62070503***6304${Math.random().toString().slice(2, 6)}`
      
      return NextResponse.json({
        success: true,
        recebimento: {
          id: recebimento.id,
          valor: recebimento.valor,
          status: 'PENDENTE'
        },
        pagamento: {
          metodo: 'pix',
          pixCode,
          pixQrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`
        }
      })
    } else if (metodo === 'card') {
      // Redirecionar para página de checkout de cartão
      return NextResponse.json({
        success: true,
        recebimento: {
          id: recebimento.id,
          valor: recebimento.valor,
          status: 'PENDENTE'
        },
        pagamento: {
          metodo: 'card',
          checkoutUrl: `/checkout/${recebimento.id}`
        }
      })
    }

    return NextResponse.json({
      success: true,
      recebimento
    })
  } catch (error) {
    console.error('Erro ao processar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao processar pagamento' },
      { status: 500 }
    )
  }
}
