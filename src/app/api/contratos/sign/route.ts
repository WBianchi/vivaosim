import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
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

    const { contractId, signature } = await request.json()

    if (!contractId || !signature) {
      return NextResponse.json({ 
        error: 'Dados incompletos' 
      }, { status: 400 })
    }

    // Verificar se o contrato pertence ao cliente
    const contract = await prisma.contract.findFirst({
      where: {
        id: contractId,
        contactId: payload.contactId
      }
    })

    if (!contract) {
      return NextResponse.json({ 
        error: 'Contrato não encontrado' 
      }, { status: 404 })
    }

    // Salvar assinatura do cliente
    const updatedContract = await prisma.contract.update({
      where: { id: contractId },
      data: {
        clientSignature: signature,
        clientSignedAt: new Date(),
        signedAt: new Date(), // Data da primeira assinatura
        status: contract.providerSignature ? 'active' : contract.status // Se ambos assinaram, ativa
      }
    })

    return NextResponse.json({
      success: true,
      contract: updatedContract,
      message: 'Assinatura salva com sucesso!'
    })

  } catch (error: any) {
    console.error('Erro ao salvar assinatura:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}
