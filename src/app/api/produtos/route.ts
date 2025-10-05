import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// GET - Listar produtos do site do cliente
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const payload = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString())
    const userEmail = payload.email

    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user || user.role !== 'CLIENTE') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Buscar site do cliente
    const contact = await prisma.contact.findFirst({
      where: { email: userEmail }
    })

    if (!contact) {
      return NextResponse.json({ 
        success: true, 
        produtos: [],
        stats: { total: 0, ativos: 0, vendidos: 0, totalArrecadado: 0 },
        message: 'Contato não encontrado' 
      })
    }

    const site = await prisma.clientSite.findFirst({
      where: { contactId: contact.id }
    })

    if (!site) {
      return NextResponse.json({ 
        success: true, 
        produtos: [],
        stats: { total: 0, ativos: 0, vendidos: 0, totalArrecadado: 0 },
        message: 'Site não encontrado' 
      })
    }

    // Buscar produtos
    const produtos = await prisma.produtoCliente.findMany({
      where: { siteId: site.id },
      orderBy: { createdAt: 'desc' }
    })

    // Estatísticas
    const stats = {
      total: produtos.length,
      ativos: produtos.filter(p => p.ativo).length,
      vendidos: produtos.reduce((sum, p) => sum + p.vendidos, 0),
      totalArrecadado: produtos.reduce((sum, p) => sum + (Number(p.preco) * p.vendidos), 0)
    }

    return NextResponse.json({
      success: true,
      produtos,
      stats
    })
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    )
  }
}

// POST - Adicionar novo produto
export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const payload = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString())
    const userEmail = payload.email

    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user || user.role !== 'CLIENTE') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const body = await request.json()
    const { nome, descricao, imagem, preco, quantidade, categoria } = body

    // Validações
    if (!nome || !preco) {
      return NextResponse.json(
        { error: 'Nome e preço são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar site
    const contact = await prisma.contact.findFirst({
      where: { email: userEmail }
    })

    if (!contact) {
      return NextResponse.json({ error: 'Contato não encontrado' }, { status: 404 })
    }

    const site = await prisma.clientSite.findFirst({
      where: { contactId: contact.id }
    })

    if (!site) {
      return NextResponse.json({ error: 'Site não encontrado' }, { status: 404 })
    }

    // Criar produto
    const produto = await prisma.produtoCliente.create({
      data: {
        siteId: site.id,
        nome,
        descricao: descricao || null,
        imagem: imagem || null,
        preco: Number(preco),
        quantidade: quantidade || 1,
        categoria: categoria || null
      }
    })

    return NextResponse.json({
      success: true,
      produto
    })
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    )
  }
}
