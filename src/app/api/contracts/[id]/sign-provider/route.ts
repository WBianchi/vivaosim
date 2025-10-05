import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { signature } = await request.json()

    if (!signature) {
      return NextResponse.json({ 
        error: 'Assinatura não fornecida' 
      }, { status: 400 })
    }

    // Buscar contrato
    const contract = await prisma.contract.findUnique({
      where: { id: params.id }
    })

    if (!contract) {
      return NextResponse.json({ 
        error: 'Contrato não encontrado' 
      }, { status: 404 })
    }

    // Salvar assinatura do prestador
    const updatedContract = await prisma.contract.update({
      where: { id: params.id },
      data: {
        providerSignature: signature,
        providerSignedAt: new Date(),
        // Se cliente já assinou, marca como ativo
        status: contract.clientSignature ? 'active' : contract.status
      },
      include: {
        contact: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignedTo: {
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
      contract: updatedContract,
      message: 'Assinatura do prestador salva com sucesso!'
    })

  } catch (error: any) {
    console.error('Erro ao salvar assinatura do prestador:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}
