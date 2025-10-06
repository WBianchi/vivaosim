import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar usuários
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')

    const where: any = {}
    
    // Suportar múltiplos roles separados por vírgula
    if (role) {
      const roles = role.split(',').map(r => r.trim())
      where.role = { in: roles }
    }

    // Suportar múltiplos status separados por vírgula
    if (status) {
      const statuses = status.split(',').map(s => s.trim())
      where.status = { in: statuses }
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
        name: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      users: users
    })
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar usuários' },
      { status: 500 }
    )
  }
}
