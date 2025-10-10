import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
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

    const { chatId, columnId, boardId } = await request.json()

    if (!chatId || !columnId || !boardId) {
      return NextResponse.json(
        { error: 'chatId, columnId e boardId são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar chat
    const chat = await prisma.whatsAppChat.findUnique({
      where: { id: chatId },
      include: {
        contact: true
      }
    })

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat não encontrado' },
        { status: 404 }
      )
    }

    // Extrair telefone do chatId (formato: 5511999999999@c.us)
    const phone = chat.chatId.split('@')[0]
    const name = chat.name || phone

    // Buscar contato existente (melhorado)
    let contact: any = await prisma.contact.findFirst({
      where: {
        OR: [
          { phone: phone },
          { whatsappNumber: phone },
          { phone: { contains: phone.slice(-8) } }, // Últimos 8 dígitos
          { whatsappNumber: { contains: phone.slice(-8) } }
        ]
      },
      include: {
        _count: {
          select: {
            quotes: true,
            schedules: true,
            contracts: true,
            tickets: true,
            tags: true
          }
        }
      }
    })

    console.log(`📞 Buscando contato com telefone: ${phone}`)
    console.log(`✅ Contato encontrado:`, contact ? {
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      whatsappNumber: contact.whatsappNumber,
      quotes: contact._count.quotes,
      schedules: contact._count.schedules,
      contracts: contact._count.contracts,
      tickets: contact._count.tickets,
      tags: contact._count.tags
    } : 'NENHUM')

    // Se não existir, criar o contato
    if (!contact) {
      console.log(`🆕 Criando novo contato: ${name}`)
      contact = await prisma.contact.create({
        data: {
          name: name,
          phone: phone,
          whatsappNumber: phone,
          email: `${phone}@whatsapp.com`, // Email temporário
          kanbanColumnId: columnId
        }
      })
    } else {
      // Se já existe, apenas associar à coluna do Kanban
      console.log(`🔗 Vinculando contato existente ao Kanban: ${contact.name}`)
      contact = await prisma.contact.update({
        where: { id: contact.id },
        data: {
          kanbanColumnId: columnId
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Cliente importado com sucesso',
      contact: contact
    })
  } catch (error) {
    console.error('Erro ao importar cliente do chat:', error)
    return NextResponse.json(
      { error: 'Erro ao importar cliente' },
      { status: 500 }
    )
  }
}
