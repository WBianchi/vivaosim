import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

async function verifyAuth(request: NextRequest) {
  const headersList = await headers()
  const authorization = headersList.get('authorization')

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null
  }

  const token = authorization.substring(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }
}

// POST - Desvincular sessão da plataforma (não deleta do WAHA)
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'SessionId é obrigatório' },
        { status: 400 }
      )
    }

    console.log(`🔗 [UNLINK] Desvinculando sessão da plataforma: ${sessionId}`)

    // Deletar apenas do banco de dados, não do WAHA
    const deletedSession = await prisma.whatsAppSession.delete({
      where: {
        sessionId: sessionId
      }
    })

    console.log(`✅ [UNLINK] Sessão desvinculada com sucesso: ${sessionId}`)
    console.log(`📝 [UNLINK] A sessão continua ativa no WAHA`)

    return NextResponse.json({
      success: true,
      message: 'Sessão desvinculada da plataforma',
      sessionId: deletedSession.sessionId
    })
  } catch (error) {
    console.error('❌ [UNLINK] Erro ao desvincular sessão:', error)
    return NextResponse.json(
      { error: 'Erro ao desvincular sessão' },
      { status: 500 }
    )
  }
}
