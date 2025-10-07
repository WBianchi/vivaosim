import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// PATCH - Atualizar cliente
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, email, phone, company, type, status, priority, source, address, documents, tags, notes, password } = body

    console.log('📝 Atualizando cliente no modelo Contact:', id, { name, email, hasPassword: !!password })

    // Se tem senha E email, criar/atualizar User
    let user = null
    if (password && email) {
      console.log('🔐 Processando senha para usuário...')
      
      // Verificar se já existe um User com esse email
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      const hashedPassword = await bcrypt.hash(password, 10)

      if (existingUser) {
        // Atualizar senha do usuário existente
        user = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            password: hashedPassword,
            name: name || existingUser.name,
            phone: phone || existingUser.phone,
            status: 'ATIVO',
            role: 'CLIENTE'
          }
        })
        console.log('✅ User atualizado com nova senha:', user.email)
      } else {
        // Criar novo User
        user = await prisma.user.create({
          data: {
            name: name || 'Cliente',
            email: email,
            password: hashedPassword,
            phone: phone || undefined,
            role: 'CLIENTE',
            status: 'ATIVO',
            emailVerified: new Date() // Auto-verificar email
          }
        })
        console.log('✅ Novo User criado:', user.email)
      }
    }

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
        // Vincular ao User se foi criado
        userId: user?.id || undefined
      }
    })

    console.log('✅ Cliente atualizado:', contact.name, 'Email:', contact.email, 'UserId:', contact.userId)

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
