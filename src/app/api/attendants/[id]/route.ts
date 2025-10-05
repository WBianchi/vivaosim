import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar atendente específico com detalhes completos
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const attendant = await prisma.user.findUnique({
      where: { 
        id: params.id,
        role: 'ATENDENTE'
      },
      include: {
        assignedChats: {
          include: {
            contact: true,
            messages: {
              orderBy: { timestamp: 'desc' },
              take: 1
            }
          }
        },
        assignedContacts: {
          include: {
            quotes: true,
            contracts: true,
            tickets: true
          }
        },
        assignedTickets: {
          include: {
            contact: true
          },
          orderBy: { createdAt: 'desc' }
        },
        attendantMetrics: {
          orderBy: { date: 'desc' },
          take: 30 // Últimos 30 dias
        },
        attendances: {
          include: {
            contact: true
          },
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      }
    })

    if (!attendant) {
      return NextResponse.json(
        { success: false, error: 'Atendente não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: attendant
    })
  } catch (error) {
    console.error('Erro ao buscar atendente:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar atendente' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar atendente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, phone, avatar, status, password } = body

    // Preparar dados para atualização
    const updateData: any = {
      name,
      phone,
      avatar,
      status
    }

    // Só atualiza senha se foi fornecida
    if (password) {
      updateData.password = password // TODO: Hash password
    }

    const attendant = await prisma.user.update({
      where: { 
        id: params.id,
        role: 'ATENDENTE'
      },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: attendant
    })
  } catch (error) {
    console.error('Erro ao atualizar atendente:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar atendente' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar atendente (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Soft delete - apenas inativa o atendente
    const attendant = await prisma.user.update({
      where: { 
        id: params.id,
        role: 'ATENDENTE'
      },
      data: {
        status: 'INATIVO'
      }
    })

    return NextResponse.json({
      success: true,
      data: attendant
    })
  } catch (error) {
    console.error('Erro ao deletar atendente:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar atendente' },
      { status: 500 }
    )
  }
}
