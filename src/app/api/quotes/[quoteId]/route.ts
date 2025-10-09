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

// DELETE - Excluir orçamento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { quoteId: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { quoteId } = params

    await prisma.quote.delete({
      where: { id: quoteId }
    })

    return NextResponse.json({
      success: true,
      message: 'Orçamento excluído com sucesso'
    })

  } catch (error) {
    console.error('Erro ao excluir orçamento:', error)
    return NextResponse.json({
      error: 'Erro ao excluir orçamento',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
