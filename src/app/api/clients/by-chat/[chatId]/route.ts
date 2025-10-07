import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = params

    console.log('🔍 Buscando cliente por whatsappChatId:', chatId)

    // Buscar no modelo Contact usando whatsappChatId
    const contact = await prisma.contact.findFirst({
      where: {
        whatsappChatId: chatId
      },
      include: {
        tags: true,
        assignedTo: true
      }
    })

    if (!contact) {
      console.log('❌ Contato não encontrado para chatId:', chatId)
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    // Retornar dados completos do contato
    const clientData = {
      id: contact.id,
      name: contact.name || 'Cliente WhatsApp',
      email: contact.email || '',
      phone: contact.phone || contact.whatsappNumber || '',
      company: contact.company || '',
      type: 'individual',
      status: contact.status || 'LEAD_FRESCO',
      priority: contact.priority || 1,
      source: contact.source || 'WHATSAPP',
      attendant: contact.assignedToId || '',
      address: {
        street: contact.address || '',
        city: contact.city || '',
        state: contact.state || '',
        zipCode: contact.zipCode || ''
      },
      documents: {
        cpf: contact.document || '',
        cnpj: ''
      },
      tags: contact.tags.map(t => t.name) || [],
      notes: contact.notes || '',
      whatsappChatId: chatId,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt
    }

    console.log('✅ Cliente encontrado:', clientData.name, 'Email:', clientData.email)
    return NextResponse.json(clientData)

  } catch (error) {
    console.error('❌ Erro ao buscar cliente:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
