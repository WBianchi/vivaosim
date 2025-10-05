import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const site = await prisma.clienteSite.findUnique({
      where: { id: params.id },
      include: {
        contact: true,
        atendente: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        produtos: {
          include: {
            _count: {
              select: {
                recebimentos: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        convidados: {
          orderBy: { nome: 'asc' }
        },
        custosDespesas: {
          include: {
            lancadoPor: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        recebimentos: {
          include: {
            produto: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!site) {
      return NextResponse.json(
        { success: false, error: 'Site não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      site
    })
  } catch (error) {
    console.error('Erro ao buscar site:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar site' },
      { status: 500 }
    )
  }
}

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

    const site = await prisma.clienteSite.update({
      where: { id: params.id },
      data: {
        ...body,
        dataEvento: body.dataEvento ? new Date(body.dataEvento) : undefined
      },
      include: {
        contact: true,
        atendente: true
      }
    })

    return NextResponse.json({
      success: true,
      site
    })
  } catch (error) {
    console.error('Erro ao atualizar site:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar site' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await prisma.clienteSite.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error('Erro ao excluir site:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao excluir site' },
      { status: 500 }
    )
  }
}
