import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

async function verifyAuth(request: NextRequest) {
  const authorization = request.headers.get('authorization')
  if (!authorization?.startsWith('Bearer ')) return null

  try {
    const token = authorization.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch {
    return null
  }
}

// PUT - Atualizar contrato
export async function PUT(
  request: NextRequest,
  { params }: { params: { contractId: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { contractId } = params
    const body = await request.json()

    const contract = await prisma.contract.update({
      where: { id: contractId },
      data: {
        title: body.title,
        description: body.description,
        amount: body.amount,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        status: body.status,
        providerSignature: body.providerSignature,
        clientSignature: body.clientSignature
      },
      include: {
        contact: true,
        createdBy: true
      }
    })

    return NextResponse.json({
      success: true,
      contract
    })

  } catch (error) {
    console.error('Erro ao atualizar contrato:', error)
    return NextResponse.json({
      error: 'Erro ao atualizar contrato',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE - Excluir contrato
export async function DELETE(
  request: NextRequest,
  { params }: { params: { contractId: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { contractId } = params

    await prisma.contract.delete({
      where: { id: contractId }
    })

    return NextResponse.json({
      success: true,
      message: 'Contrato excluído com sucesso'
    })

  } catch (error) {
    console.error('Erro ao excluir contrato:', error)
    return NextResponse.json({
      error: 'Erro ao excluir contrato',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
