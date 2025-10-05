import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Decodificar token
    const payload = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString())
    
    // Buscar sites dos clientes
    const sites = await prisma.clientSite.findMany({
      include: {
        contact: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            whatsappNumber: true,
            status: true
          }
        },
        atendente: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        _count: {
          select: {
            produtos: true,
            convidados: true,
            custosDespesas: true,
            recebimentos: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calcular estatísticas
    const stats = {
      totalSites: sites.length,
      publicados: sites.filter(s => s.status === 'PUBLICADO').length,
      rascunhos: sites.filter(s => s.status === 'RASCUNHO').length,
      expirados: sites.filter(s => s.status === 'EXPIRADO').length,
      totalProdutos: sites.reduce((sum, s) => sum + s._count.produtos, 0),
      totalConvidados: sites.reduce((sum, s) => sum + s._count.convidados, 0),
      totalRecebimentos: sites.reduce((sum, s) => sum + s._count.recebimentos, 0)
    }

    return NextResponse.json({
      success: true,
      sites,
      stats
    })
  } catch (error) {
    console.error('Erro ao buscar sites dos clientes:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar sites' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const payload = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString())
    const body = await request.json()

    const {
      contactId,
      tipoEvento,
      nomeEvento,
      dataEvento,
      localEvento,
      descricaoEvento,
      subdominio,
      corPrimaria,
      corSecundaria,
      corDestaque
    } = body

    // Verificar se o contact existe
    const contact = await prisma.contact.findUnique({
      where: { id: contactId }
    })

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contato não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se já existe site para este contato
    const existingSite = await prisma.clientSite.findUnique({
      where: { contactId }
    })

    if (existingSite) {
      return NextResponse.json(
        { success: false, error: 'Este contato já possui um site' },
        { status: 400 }
      )
    }

    // Criar site
    const site = await prisma.clientSite.create({
      data: {
        contactId,
        atendenteId: payload.userId,
        tipoEvento,
        nomeEvento,
        dataEvento: new Date(dataEvento),
        localEvento,
        descricaoEvento,
        subdominio: subdominio.toLowerCase().replace(/[^a-z0-9-]/g, ''),
        corPrimaria: corPrimaria || '#FF6B35',
        corSecundaria: corSecundaria || '#004E89',
        corDestaque: corDestaque || '#FFC857',
        status: 'RASCUNHO'
      },
      include: {
        contact: true,
        atendente: true
      }
    })

    return NextResponse.json({
      success: true,
      site
    })
  } catch (error: any) {
    console.error('Erro ao criar site:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Subdomínio já está em uso' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Erro ao criar site' },
      { status: 500 }
    )
  }
}
