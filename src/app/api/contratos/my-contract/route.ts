import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('accessToken')?.value

    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    const payload = verifyAccessToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 403 })
    }

    // Buscar contrato do cliente
    const contract = await prisma.contract.findFirst({
      where: {
        contactId: payload.contactId,
        status: { in: ['active', 'draft'] }
      },
      include: {
        contact: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        createdBy: {
          select: {
            name: true,
            email: true
          }
        },
        assignedTo: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!contract) {
      return NextResponse.json({
        success: true,
        contract: null,
        message: 'Nenhum contrato encontrado'
      })
    }

    return NextResponse.json({
      success: true,
      contract: {
        ...contract,
        amount: Number(contract.amount)
      }
    })

  } catch (error: any) {
    console.error('Erro ao buscar contrato:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}
