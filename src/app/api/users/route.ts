import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar usuários
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    const where: any = {}
    if (role) {
      where.role = role
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: users
    })
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar usuários' },
      { status: 500 }
    )
  }
}
