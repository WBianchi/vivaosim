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

    // Decodificar token para pegar email
    const payload = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString())
    const userEmail = payload.email

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    console.log('👤 Usuário:', user.email, user.role)

    // Verificar se é CLIENTE
    if (user.role !== 'CLIENTE') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Buscar contato do usuário pelo email
    const contact = await prisma.contact.findFirst({
      where: { email: userEmail }
    })

    console.log('📋 Contact:', contact)

    if (!contact) {
      return NextResponse.json({ 
        success: true, 
        site: null,
        message: 'Cliente ainda não possui contato vinculado' 
      })
    }

    // Buscar site vinculado ao contato
    const site = await prisma.clientSite.findFirst({
      where: { contactId: contact.id },
      include: {
        contact: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        atendente: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        produtos: {
          select: {
            id: true,
            nome: true,
            preco: true,
            imagem: true,
            ativo: true
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
      }
    })

    if (!site) {
      return NextResponse.json({ 
        success: true, 
        site: null,
        message: 'Site ainda não foi criado' 
      })
    }

    return NextResponse.json({ success: true, site })
  } catch (error) {
    console.error('Erro ao buscar site do cliente:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar site do cliente' },
      { status: 500 }
    )
  }
}
