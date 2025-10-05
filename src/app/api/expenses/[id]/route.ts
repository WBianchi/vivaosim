import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'

async function verifyAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('accessToken')?.value

    if (!token) return null

    const payload = verifyAccessToken(token)
    return payload
  } catch (error) {
    return null
  }
}

// GET - Buscar despesa individual
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const expense = await prisma.expense.findUnique({
      where: { id: params.id },
      include: {
        supplier: true,
        contract: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!expense) {
      return NextResponse.json({ error: 'Despesa não encontrada' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      expense
    })

  } catch (error: any) {
    console.error('Erro ao buscar despesa:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// PATCH - Atualizar despesa
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Converter datas se necessário
    if (body.dueDate) body.dueDate = new Date(body.dueDate)
    if (body.paidDate) body.paidDate = new Date(body.paidDate)

    const expense = await prisma.expense.update({
      where: { id: params.id },
      data: body,
      include: {
        supplier: true,
        contract: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      expense
    })

  } catch (error: any) {
    console.error('Erro ao atualizar despesa:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// DELETE - Deletar despesa
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.expense.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Despesa deletada com sucesso'
    })

  } catch (error: any) {
    console.error('Erro ao deletar despesa:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}
