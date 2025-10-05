import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// GET - Listar convidados do site do cliente
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Decodificar token
    const payload = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString())
    const userEmail = payload.email

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Se for CLIENTE, buscar site vinculado ao contato
    let siteId: string | null = null

    if (user.role === 'CLIENTE') {
      // Buscar contato do usuário
      const contact = await prisma.contact.findFirst({
        where: { email: userEmail },
        include: { clientSite: true }
      })

      console.log('📋 Contact encontrado:', contact)

      if (!contact || !contact.clientSite) {
        return NextResponse.json({ 
          success: true, 
          convidados: [],
          stats: {
            total: 0,
            confirmados: 0,
            pendentes: 0,
            recusados: 0,
            totalConvites: 0,
            presentes: 0
          },
          message: 'Cliente ainda não possui site vinculado' 
        })
      }

      siteId = contact.clientSite.id
    } else {
      // Se for ASSINANTE/ADMIN, pode ter parâmetro de siteId
      const { searchParams } = new URL(request.url)
      siteId = searchParams.get('siteId')

      if (!siteId) {
        return NextResponse.json({ 
          error: 'siteId é obrigatório para este tipo de usuário' 
        }, { status: 400 })
      }
    }

    // Buscar convidados
    const convidados = await prisma.convidadoCliente.findMany({
      where: { siteId },
      orderBy: { createdAt: 'desc' }
    })

    // Estatísticas
    const stats = {
      total: convidados.length,
      confirmados: convidados.filter(c => c.status === 'CONFIRMADO').length,
      pendentes: convidados.filter(c => c.status === 'PENDENTE').length,
      recusados: convidados.filter(c => c.status === 'RECUSADO').length,
      totalConvites: convidados.reduce((sum, c) => sum + c.numeroConvites, 0),
      presentes: convidados.filter(c => c.presenteEvento).length
    }

    return NextResponse.json({
      success: true,
      convidados,
      stats
    })
  } catch (error) {
    console.error('Erro ao buscar convidados:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar convidados' },
      { status: 500 }
    )
  }
}

// POST - Adicionar novo convidado
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

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const body = await request.json()
    const { siteId, nome, email, telefone, numeroConvites, observacoes } = body

    // Validações
    if (!siteId || !nome) {
      return NextResponse.json(
        { error: 'siteId e nome são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o site existe
    const site = await prisma.clientSite.findUnique({
      where: { id: siteId }
    })

    if (!site) {
      return NextResponse.json(
        { error: 'Site não encontrado' },
        { status: 404 }
      )
    }

    // Criar convidado
    const convidado = await prisma.convidadoCliente.create({
      data: {
        siteId,
        nome,
        email: email || null,
        telefone: telefone || null,
        numeroConvites: numeroConvites || 1,
        observacoes: observacoes || null
      }
    })

    return NextResponse.json({
      success: true,
      convidado
    })
  } catch (error) {
    console.error('Erro ao criar convidado:', error)
    return NextResponse.json(
      { error: 'Erro ao criar convidado' },
      { status: 500 }
    )
  }
}
