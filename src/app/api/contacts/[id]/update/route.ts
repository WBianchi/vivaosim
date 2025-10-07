import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      name, 
      email, 
      phone,
      document,
      city, 
      state, 
      address,
      zipCode,
      neighborhood,
      number,
      complement,
      password,
      status,
      notes,
      avatar,
      assignedToId
    } = body

    // Verificar se contato existe
    const contact = await prisma.contact.findUnique({
      where: { id: params.id },
      include: { user: true }
    })

    if (!contact) {
      return NextResponse.json({ error: 'Contato não encontrado' }, { status: 404 })
    }

    // Se tem senha, criar ou atualizar User
    let userId = contact.userId

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)

      if (contact.user) {
        // Atualizar User existente
        await prisma.user.update({
          where: { id: contact.user.id },
          data: {
            password: hashedPassword,
            ...(name && { name }),
            ...(email && { email })
          }
        })
      } else {
        // Criar novo User para o cliente
        const newUser = await prisma.user.create({
          data: {
            name: name || contact.name,
            email: email || contact.email,
            password: hashedPassword,
            role: 'CLIENTE',
            status: 'ATIVO'
          }
        })
        userId = newUser.id
      }
    }

    // Atualizar contato
    const updatedContact = await prisma.contact.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(document !== undefined && { document }),
        ...(city && { city }),
        ...(state && { state }),
        ...(address && { address }),
        ...(zipCode !== undefined && { zipCode }),
        ...(neighborhood !== undefined && { neighborhood }),
        ...(number !== undefined && { number }),
        ...(complement !== undefined && { complement }),
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(avatar !== undefined && { avatar }),
        ...(userId && { userId }),
        ...(assignedToId !== undefined && { assignedToId })
      }
    })

    return NextResponse.json({
      success: true,
      contact: updatedContact
    })
  } catch (error) {
    console.error('Erro ao atualizar contato:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar contato' },
      { status: 500 }
    )
  }
}
