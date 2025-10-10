import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
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

    // Buscar TODOS os chats (incluindo os que podem estar marcados incorretamente como grupo)
    const allChats = await prisma.whatsAppChat.findMany({
      include: {
        contact: true
      },
      orderBy: {
        lastMessageAt: 'desc'
      },
      take: 200 // Aumentar limite
    })

    console.log(`📋 Total de chats encontrados: ${allChats.length}`)
    
    // Filtrar apenas conversas individuais (chatId termina com @c.us ou @s.whatsapp.net)
    const chats = allChats.filter(chat => {
      const isIndividual = chat.chatId.includes('@c.us') || chat.chatId.includes('@s.whatsapp.net')
      const isNotGroup = !chat.chatId.includes('@g.us')
      return isIndividual && isNotGroup
    })

    console.log(`📋 Chats individuais filtrados: ${chats.length}`)
    console.log(`📋 Primeiros 5 chats:`, chats.slice(0, 5).map(c => ({
      id: c.id,
      chatId: c.chatId,
      name: c.name,
      isGroup: c.isGroup,
      hasContact: !!c.contact
    })))

    // Buscar contagens separadamente para cada chat
    const contacts = await Promise.all(
      chats.map(async (chat) => {
        // Extrair telefone do chatId (formato: 5511999999999@c.us)
        const rawPhone = chat.chatId.split('@')[0]
        
        // Formatar telefone para exibição (55 18 99720-0106)
        const formatPhone = (phone: string) => {
          // Remove tudo que não é número
          const numbers = phone.replace(/\D/g, '')
          
          // Se tem 13 dígitos (55 + DDD + número)
          if (numbers.length === 13) {
            const country = numbers.substring(0, 2)
            const ddd = numbers.substring(2, 4)
            const firstPart = numbers.substring(4, 9)
            const secondPart = numbers.substring(9, 13)
            return `+${country} (${ddd}) ${firstPart}-${secondPart}`
          }
          
          // Se tem 12 dígitos (55 + DDD + número sem 9)
          if (numbers.length === 12) {
            const country = numbers.substring(0, 2)
            const ddd = numbers.substring(2, 4)
            const firstPart = numbers.substring(4, 8)
            const secondPart = numbers.substring(8, 12)
            return `+${country} (${ddd}) ${firstPart}-${secondPart}`
          }
          
          return phone
        }
        
        // Buscar se já existe um Contact vinculado
        let contactId: string | null = null
        let quotesCount = 0
        let schedulesCount = 0
        let contractsCount = 0
        let notesCount = 0

        if (chat.contact) {
          contactId = chat.contact.id
          // Buscar contagens
          ;[quotesCount, schedulesCount, contractsCount, notesCount] = await Promise.all([
            prisma.quote.count({ where: { contactId } }).catch(() => 0),
            prisma.schedule.count({ where: { contactId } }).catch(() => 0),
            prisma.contract.count({ where: { contactId } }).catch(() => 0),
            prisma.note.count({ where: { contactId } }).catch(() => 0)
          ])
        }

        // Buscar tickets do chat
        const ticketsCount = await prisma.whatsAppTicket.count({ 
          where: { chatId: chat.id } 
        }).catch(() => 0)

        return {
          id: chat.id,
          name: chat.name || formatPhone(rawPhone),
          phone: formatPhone(rawPhone),
          rawPhone: rawPhone, // Manter o telefone sem formatação para busca
          profilePicture: undefined,
          lastMessage: chat.lastMessage || '',
          unreadCount: chat.unreadCount || 0,
          quotesCount,
          schedulesCount,
          contractsCount,
          ticketsCount,
          tags: []
        }
      })
    )

    return NextResponse.json({
      success: true,
      contacts
    })
  } catch (error) {
    console.error('Erro ao buscar contatos com dados:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar contatos' },
      { status: 500 }
    )
  }
}
