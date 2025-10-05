import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Decodificar token para pegar email
    const payload = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString())
    const userEmail = payload.email

    // Buscar usuário completo
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        cpf: true,
        address: true,
        city: true,
        state: true,
        avatar: true,
        role: true,
        status: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dados do usuário' },
      { status: 500 }
    )
  }
}
