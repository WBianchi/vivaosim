import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Decodificar token para pegar email
    const payload = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString())
    const userEmail = payload.email

    const body = await request.json()
    const { name, phone, address, city, state, cpf, avatar } = body

    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(address && { address }),
        ...(city && { city }),
        ...(state && { state }),
        ...(cpf && { cpf }),
        ...(avatar && { avatar }),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        city: updatedUser.city,
        state: updatedUser.state,
        cpf: updatedUser.cpf,
        avatar: updatedUser.avatar,
        role: updatedUser.role
      }
    })
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar perfil' },
      { status: 500 }
    )
  }
}
