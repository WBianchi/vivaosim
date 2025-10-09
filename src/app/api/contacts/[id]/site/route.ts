import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar site do cliente
    const site = await prisma.clientSite.findUnique({
      where: { contactId: params.id },
      include: {
        produtos: true,
        convidados: true
      }
    })

    return NextResponse.json({
      success: true,
      site
    })
  } catch (error) {
    console.error('Erro ao buscar site:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar site' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { subdomain, title, description, theme, primaryColor, status } = body

    // Verificar se já existe site para este contato
    const existingSite = await prisma.clientSite.findFirst({
      where: { contactId: params.id }
    })

    if (existingSite) {
      return NextResponse.json(
        { error: 'Cliente já possui um site' },
        { status: 400 }
      )
    }

    // Verificar se subdomain já existe
    const existingSubdomain = await prisma.clientSite.findFirst({
      where: { subdominio: subdomain }
    })

    if (existingSubdomain) {
      return NextResponse.json(
        { error: 'Subdomínio já está em uso' },
        { status: 400 }
      )
    }

    // Criar site
    const site = await prisma.clientSite.create({
      data: {
        contactId: params.id,
        subdominio: subdomain,
        nomeEvento: title,
        descricaoEvento: description,
        tipoEvento: 'CASAMENTO',
        dataEvento: new Date(),
        localEvento: '',
        corPrimaria: primaryColor || '#FF6B35',
        corSecundaria: '#004E89',
        corDestaque: '#FFC857',
        fontePrimaria: 'Inter',
        fonteSecundaria: 'Playfair Display',
        roundButtons: 8,
        roundSessoes: 12,
        roundColunas: 8,
        status: 'RASCUNHO',
        configuracoes: {
          template: theme || 'romantic',
          banner: [],
          galeria: []
        }
      }
    })

    return NextResponse.json({
      success: true,
      site
    })
  } catch (error) {
    console.error('Erro ao criar site:', error)
    return NextResponse.json(
      { error: 'Erro ao criar site' },
      { status: 500 }
    )
  }
}
