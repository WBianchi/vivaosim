import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar todos os atendentes com métricas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {
      role: 'ATENDENTE'
    }

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Buscar atendentes básicos primeiro
    const attendants = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        phone: true,
        status: true,
        createdAt: true,
        lastLoginAt: true
      },
      orderBy: { name: 'asc' }
    })

    // Retornar dados básicos por enquanto (até regenerar Prisma Client)
    const attendantsWithStats = attendants.map(attendant => ({
      id: attendant.id,
      name: attendant.name,
      email: attendant.email,
      avatar: attendant.avatar,
      phone: attendant.phone,
      status: attendant.status,
      createdAt: attendant.createdAt,
      lastLoginAt: attendant.lastLoginAt,
      
      // Estatísticas mockadas temporariamente
      activeChats: 0,
      unreadMessages: 0,
      activeContacts: 0,
      openTickets: 0,
      inProgressTickets: 0,
      activeAttendances: 0,
      waitingAttendances: 0,
      metrics: null
    }))

    return NextResponse.json({
      success: true,
      data: attendantsWithStats,
      total: attendantsWithStats.length
    })
  } catch (error) {
    console.error('Erro ao buscar atendentes:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar atendentes' },
      { status: 500 }
    )
  }
}

// POST - Criar novo atendente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, phone, avatar } = body

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Criar atendente
    const attendant = await prisma.user.create({
      data: {
        name,
        email,
        password, // TODO: Hash password
        phone,
        avatar,
        role: 'ATENDENTE',
        status: 'ATIVO'
      }
    })

    // TODO: Criar métrica inicial após regenerar Prisma Client
    // await prisma.attendantMetrics.create({
    //   data: {
    //     attendantId: attendant.id,
    //     date: new Date()
    //   }
    // })

    return NextResponse.json({
      success: true,
      data: attendant
    })
  } catch (error) {
    console.error('Erro ao criar atendente:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao criar atendente' },
      { status: 500 }
    )
  }
}
