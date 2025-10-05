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

    // Buscar contato com TODOS os relacionamentos
    const contact = await prisma.contact.findUnique({
      where: { id: params.id },
      include: {
        // Site do cliente
        clientSite: {
          include: {
            produtos: true,
            convidados: true,
            custosDespesas: true,
            recebimentos: true,
            recebimentoPresente: true
          }
        },
        // Orçamentos
        orcamentos: {
          orderBy: { createdAt: 'desc' }
        },
        // Agendamentos
        agendamentos: {
          orderBy: { dataHora: 'desc' }
        },
        // Tickets
        tickets: {
          orderBy: { createdAt: 'desc' }
        },
        // Contratos
        contracts: {
          orderBy: { createdAt: 'desc' }
        },
        // Tags
        tags: true,
        // Kanban Column
        kanbanColumn: true,
        // Mensagens do WhatsApp
        messages: {
          take: 50,
          orderBy: { timestamp: 'desc' }
        },
        // Chat do WhatsApp
        whatsappChat: true
      }
    })

    if (!contact) {
      return NextResponse.json({ error: 'Contato não encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      contact
    })
  } catch (error) {
    console.error('Erro ao buscar contato completo:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar contato' },
      { status: 500 }
    )
  }
}
