import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PATCH - Atualizar cliente
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, email, phone, company, type, status, priority, source, address, documents, tags, notes } = body

    console.log('📝 Atualizando cliente no modelo Contact:', id, { name, email })

    // Atualizar contato no modelo Contact
    const contact = await prisma.contact.update({
      where: { id },
      data: {
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
        company: company || undefined,
        address: address?.street || undefined,
        city: address?.city || undefined,
        state: address?.state || undefined,
        zipCode: address?.zipCode || undefined,
        document: documents?.cpf || undefined,
        notes: notes || undefined,
        // status e priority podem ser atualizados se necessário
      }
    })

    console.log('✅ Cliente atualizado:', contact.name, 'Email:', contact.email)

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
      tags: tags || [],
      notes: contact.notes || '',
      whatsappChatId: contact.whatsappChatId,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt
    })

  } catch (error) {
    console.error('❌ Erro ao atualizar cliente:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET - Buscar cliente específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        tags: true,
        assignedTo: true
      }
    })

    if (!contact) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
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
      whatsappChatId: contact.whatsappChatId,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt
    })

  } catch (error) {
    console.error('❌ Erro ao buscar cliente:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar cliente
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.contact.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('❌ Erro ao deletar cliente:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
