import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

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
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Senha atual e nova senha são obrigatórias' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'A nova senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      )
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar senha atual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Senha atual incorreta' },
        { status: 401 }
      )
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Atualizar senha
    await prisma.user.update({
      where: { email: userEmail },
      data: {
        password: hashedPassword,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Senha alterada com sucesso'
    })
  } catch (error) {
    console.error('Erro ao alterar senha:', error)
    return NextResponse.json(
      { error: 'Erro ao alterar senha' },
      { status: 500 }
    )
  }
}
