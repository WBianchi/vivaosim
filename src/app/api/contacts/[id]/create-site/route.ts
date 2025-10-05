import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// Função para gerar subdomínio a partir do nome
function generateSubdomain(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD') // Remove acentos
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .substring(0, 30) // Limita tamanho
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

    // Buscar o contato
    const contact = await prisma.contact.findUnique({
      where: { id: params.id },
      include: { clientSite: true }
    })

    if (!contact) {
      return NextResponse.json({ error: 'Contato não encontrado' }, { status: 404 })
    }

    // Verificar se já tem site
    if (contact.clientSite) {
      return NextResponse.json({ 
        error: 'Cliente já possui um site',
        site: contact.clientSite 
      }, { status: 400 })
    }

    // Gerar subdomínio base
    let baseSubdomain = generateSubdomain(contact.name)
    let subdomain = baseSubdomain
    let counter = 1

    // Verificar se subdomínio já existe e gerar alternativas
    while (true) {
      const existing = await prisma.clientSite.findUnique({
        where: { subdominio: subdomain }
      })

      if (!existing) break

      // Se existe, adiciona número ao final
      subdomain = `${baseSubdomain}-${counter}`
      counter++
    }

    // Pegar dados do body se fornecidos
    const body = await request.json().catch(() => ({}))
    const { 
      nomeEvento,
      tipoEvento = 'CASAMENTO',
      dataEvento 
    } = body

    // Criar o site
    const site = await prisma.clientSite.create({
      data: {
        contactId: contact.id,
        subdominio: subdomain,
        nomeEvento: nomeEvento || contact.name,
        tipoEvento,
        dataEvento: dataEvento ? new Date(dataEvento) : null,
        status: 'RASCUNHO',
        template: 'classic',
        
        // Cores padrão
        corPrimaria: '#2C3E50',
        corSecundaria: '#E67E22',
        corDestaque: '#E74C3C',
        
        // Fontes padrão
        fontePrimaria: 'Inter, sans-serif',
        fonteSecundaria: 'Playfair Display, serif',
        
        // Roundness padrão
        roundButtons: 8,
        roundColunas: 12,
        roundInputs: 8,
        
        visualizacoes: 0
      },
      include: {
        produtos: true,
        convidados: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Site criado com sucesso!',
      site,
      url: `https://${subdomain}.vivaosim.com.br`
    })
  } catch (error) {
    console.error('Erro ao criar site:', error)
    return NextResponse.json(
      { error: 'Erro ao criar site do cliente' },
      { status: 500 }
    )
  }
}
