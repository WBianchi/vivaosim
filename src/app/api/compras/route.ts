import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const chatId = searchParams.get('chatId')

    console.log('🎁 API Compras: Buscando presentes...', { chatId })

    // Se tiver chatId, buscar o contato primeiro
    let where: any = {}
    
    if (chatId) {
      const contact = await prisma.contact.findUnique({
        where: { whatsappChatId: chatId },
        include: { clientSite: true }
      })
      
      console.log('📱 Contato encontrado:', contact ? 'Sim' : 'Não')
      console.log('📱 Contato completo:', JSON.stringify(contact, null, 2))
      
      if (contact?.clientSite) {
        where.siteId = contact.clientSite.id
        console.log('🎯 Filtrando por siteId:', contact.clientSite.id)
      } else {
        console.log('⚠️ Contato não tem clientSite vinculado!')
        // Se não tiver site vinculado, retornar vazio
        return NextResponse.json({
          success: true,
          compras: [],
          message: 'Contato não possui site de presentes vinculado'
        })
      }
    }
    
    const compras = await prisma.recebimentoPresente.findMany({
      where,
      include: {
        produto: true,
        site: {
          include: {
            contact: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`✅ API Compras: ${compras.length} presentes encontrados`)

    // Formatar resposta
    const formattedCompras = compras.map(compra => ({
      id: compra.id,
      name: compra.produto?.nome || 'Presente',
      description: compra.produto?.descricao || '',
      price: compra.valor,
      image: compra.produto?.imagem || null,
      status: compra.statusPagamento === 'PAGO' ? 'purchased' : 'available',
      quantity: 1,
      purchasedBy: {
        name: compra.nomeComprador,
        email: compra.emailComprador,
        phone: compra.telefoneComprador
      },
      paymentMethod: compra.metodoPagamento,
      message: compra.mensagem,
      createdAt: compra.createdAt,
      updatedAt: compra.updatedAt,
      paidAt: compra.pagoEm
    }))

    return NextResponse.json({
      success: true,
      compras: formattedCompras
    })

  } catch (error) {
    console.error('❌ API Compras: Erro:', error)
    return NextResponse.json(
      { error: 'Internal server error', compras: [] },
      { status: 500 }
    )
  }
}
