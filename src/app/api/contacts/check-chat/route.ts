import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Verificar se existe contato para um chatId específico
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Iniciando verificação de contato...')
    console.log('Prisma disponível:', !!prisma)
    console.log('Modelo contact disponível:', !!prisma?.contact)
    
    const { searchParams } = new URL(request.url)
    const chatId = searchParams.get('chatId')
    
    console.log('ChatId recebido:', chatId)

    if (!chatId) {
      return NextResponse.json(
        { error: 'chatId é obrigatório' },
        { status: 400 }
      )
    }

    // Busca simplificada primeiro
    console.log('🔎 Buscando contato por whatsappChatId:', chatId)
    const contact = await prisma.contact.findUnique({
      where: { whatsappChatId: chatId }
    })
    
    console.log('Contato encontrado:', !!contact)
    
    if (!contact) {
      console.log('❌ Nenhum contato encontrado para chatId:', chatId)
      return NextResponse.json({
        exists: false,
        contact: null,
        isLeadFresco: true
      })
    }

    // Se encontrou, buscar dados completos
    console.log('✅ Contato encontrado, buscando dados completos...')
    const fullContact = await prisma.contact.findUnique({
      where: { id: contact.id },
      include: {
        queue: true,
        assignedTo: { select: { id: true, name: true, email: true } },
        tags: true,
        _count: {
          select: {
            schedules: true,
            quotes: true,
            contracts: true,
            tickets: true,
            activities: true
          }
        }
      }
    })

    if (!contact) {
      return NextResponse.json({
        exists: false,
        contact: null,
        isLeadFresco: true
      })
    }

    return NextResponse.json({
      exists: true,
      contact: fullContact,
      isLeadFresco: false,
      summary: {
        hasOpenTickets: (fullContact?._count?.tickets || 0) > 0,
        hasUpcomingSchedules: (fullContact?._count?.schedules || 0) > 0,
        hasQuotes: (fullContact?._count?.quotes || 0) > 0,
        hasContracts: (fullContact?._count?.contracts || 0) > 0,
        totalActivities: fullContact?._count?.activities || 0,
        status: fullContact?.status || 'LEAD_FRESCO',
        queue: fullContact?.queue?.name || 'Sem fila',
        assignedAgent: fullContact?.assignedTo?.name || 'Não atribuído'
      }
    })
  } catch (error) {
    console.error('Erro ao verificar contato:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
