import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST - Criar novo cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, company, type, status, priority, source, whatsappChatId } = body

    console.log('📝 Criando novo cliente no modelo Contact:', { name, email, whatsappChatId })

    // Verificar se já existe
    let contact = await prisma.contact.findFirst({
      where: {
        whatsappChatId: whatsappChatId
      }
    })

    if (!contact) {
      // Criar novo contato no modelo Contact
      contact = await prisma.contact.create({
        data: {
          whatsappChatId: whatsappChatId,
          whatsappNumber: whatsappChatId,
          name: name || 'Cliente WhatsApp',
          email: email || null,
          phone: phone || whatsappChatId,
          company: company || null,
          status: 'LEAD_FRESCO',
          source: 'WHATSAPP',
          createdFrom: 'chat-conversion',
          priority: priority || 1
        }
      })
      console.log('✅ Cliente criado:', contact.name)
    } else {
      // Atualizar dados do contato existente
      contact = await prisma.contact.update({
        where: { id: contact.id },
        data: {
          name: name || contact.name,
          email: email || contact.email,
          phone: phone || contact.phone,
          company: company || contact.company
        }
      })
      console.log('✅ Cliente atualizado:', contact.name)
    }

    return NextResponse.json({
      id: contact.id,
      name: contact.name,
      phone: contact.phone || contact.whatsappNumber,
      email: contact.email || '',
      company: contact.company || '',
      type: 'individual',
      status: contact.status,
      priority: contact.priority,
      source: contact.source,
      whatsappChatId,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt
    })

  } catch (error) {
    console.error('❌ Erro ao criar cliente:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET - Listar clientes
export async function GET(request: NextRequest) {
  try {
    const contacts = await prisma.contact.findMany({
      include: {
        tags: true,
        assignedTo: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const clients = contacts.map(contact => ({
      id: contact.id,
      name: contact.name || 'Cliente',
      phone: contact.phone || contact.whatsappNumber || '',
      email: contact.email || '',
      company: contact.company || '',
      type: 'individual',
      status: contact.status,
      priority: contact.priority,
      source: contact.source,
      whatsappChatId: contact.whatsappChatId,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt
    }))

    return NextResponse.json(clients)

  } catch (error) {
    console.error('❌ Erro ao listar clientes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
