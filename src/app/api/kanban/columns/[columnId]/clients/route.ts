import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { columnId: string } }
) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const payload = verifyAccessToken(accessToken)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 403 })
    }

    const { columnId } = params

    // Buscar todos os contatos da coluna
    const contacts = await prisma.contact.findMany({
      where: {
        kanbanColumnId: columnId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`📋 Buscando dados para ${contacts.length} contatos da coluna ${columnId}`)

    // Para cada contato, buscar as contagens
    const clientsWithCounts = await Promise.all(
      contacts.map(async (contact) => {
        console.log(`\n👤 Processando contato: ${contact.name} (${contact.id})`)
        console.log(`   📞 Telefone: ${contact.phone}`)
        console.log(`   📧 Email: ${contact.email}`)

        // Buscar chat associado - melhorado
        const chat = await prisma.whatsAppChat.findFirst({
          where: {
            OR: [
              { chatId: contact.whatsappChatId || '' },
              { chatId: { contains: contact.phone?.replace(/\D/g, '').slice(-8) || '' } }
            ]
          }
        })

        console.log(`   💬 Chat encontrado: ${chat ? 'SIM' : 'NÃO'}`)
        if (chat) {
          console.log(`      Chat ID: ${chat.chatId}`)
        }

        // Buscar contagens
        const [quotesCount, schedulesCount, contractsCount, ticketsCount, notesCount, tagsCount] = await Promise.all([
          prisma.quote.count({ where: { contactId: contact.id } }),
          prisma.schedule.count({ where: { contactId: contact.id } }),
          prisma.contract.count({ where: { contactId: contact.id } }),
          chat ? prisma.whatsAppTicket.count({ where: { chatId: chat.id } }) : 0,
          prisma.note.count({ where: { contactId: contact.id } }),
          prisma.contactTag.count({ where: { contactId: contact.id } })
        ])

        console.log(`   📊 Contagens:`)
        console.log(`      💰 Orçamentos: ${quotesCount}`)
        console.log(`      📅 Agendamentos: ${schedulesCount}`)
        console.log(`      📝 Contratos: ${contractsCount}`)
        console.log(`      🎫 Tickets: ${ticketsCount}`)
        console.log(`      📄 Notas: ${notesCount}`)
        console.log(`      🏷️  Tags: ${tagsCount}`)

        // Buscar tags reais
        const contactTags = await prisma.contactTag.findMany({
          where: { contactId: contact.id }
        })
        const tags = contactTags.map(ct => ct.name)

        // Calcular valor total dos orçamentos
        const quotesSum = await prisma.quote.aggregate({
          where: { contactId: contact.id },
          _sum: { total: true }
        })
        const totalValue = quotesSum._sum.total || 0

        console.log(`   💵 Valor total: R$ ${totalValue}`)

        return {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          company: contact.company || undefined,
          status: contact.status || 'LEAD_FRESCO',
          value: Number(totalValue),
          priority: 'medium' as const,
          tags: tags,
          assignedTo: contact.assignedToId || undefined,
          avatar: contact.avatar || undefined,
          notes: notesCount,
          tickets: ticketsCount,
          contracts: contractsCount,
          quotes: quotesCount,
          quotesCount: quotesCount,
          schedules: schedulesCount,
          agent: null // TODO: buscar agente se necessário
        }
      })
    )

    console.log(`\n✅ Total de clientes processados: ${clientsWithCounts.length}`)

    return NextResponse.json({
      success: true,
      clients: clientsWithCounts
    })
  } catch (error) {
    console.error('Erro ao buscar clientes da coluna:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar clientes' },
      { status: 500 }
    )
  }
}
