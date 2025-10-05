import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

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

    // Buscar site do cliente
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

    // Validar se tem informações mínimas para publicar
    if (!site.nomeEvento || !site.dataEvento) {
      return NextResponse.json(
        { error: 'Complete as informações básicas do evento antes de publicar' },
        { status: 400 }
      )
    }

    // Publicar site
    const updatedSite = await prisma.clientSite.update({
      where: { id: site.id },
      data: {
        status: 'PUBLICADO',
        publicadoEm: new Date()
      }
    })

    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${site.subdominio}`

    return NextResponse.json({
      success: true,
      site: updatedSite,
      url
    })
  } catch (error) {
    console.error('Erro ao publicar site:', error)
    return NextResponse.json(
      { error: 'Erro ao publicar site' },
      { status: 500 }
    )
  }
}
