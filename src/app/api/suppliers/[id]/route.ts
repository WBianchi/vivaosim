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

// GET - Buscar fornecedor individual
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supplier = await prisma.supplier.findUnique({
      where: { id: params.id },
      include: {
        expenses: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: { expenses: true }
        }
      }
    })

    if (!supplier) {
      return NextResponse.json({ error: 'Fornecedor não encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      supplier
    })

  } catch (error: any) {
    console.error('Erro ao buscar fornecedor:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// PATCH - Atualizar fornecedor
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

    const supplier = await prisma.supplier.update({
      where: { id: params.id },
      data: body
    })

    return NextResponse.json({
      success: true,
      supplier
    })

  } catch (error: any) {
    console.error('Erro ao atualizar fornecedor:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// DELETE - Deletar fornecedor
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.supplier.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Fornecedor deletado com sucesso'
    })

  } catch (error: any) {
    console.error('Erro ao deletar fornecedor:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}
