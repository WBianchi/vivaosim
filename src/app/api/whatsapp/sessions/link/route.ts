import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const WEBHOOK_BASE_URL = process.env.WEBHOOK_BASE_URL || 'http://159.65.34.199:8081'
const WAHA_BASE_URL = process.env.WAHA_API_URL || 'http://159.65.34.199:3001'
const WAHA_API_KEY = process.env.WAHA_API_KEY || 'tappyone-waha-2024-secretkey'

// Verificar autenticação
async function verifyAuth(request: NextRequest) {
  const headersList = headers()
  const authorization = headersList.get('authorization')

  if (!authorization?.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authorization.replace('Bearer ', '')
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }
}

// POST - Vincular sessão existente do WAHA ao banco de dados
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { sessionId, name, phoneNumber, profileName, profilePicture } = body
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    console.log('🔗 Vinculando sessão existente:', sessionId)

    // Verificar se já existe no banco
    const existingSession = await prisma.whatsAppSession.findUnique({
      where: { sessionId }
    })

    if (existingSession) {
      console.log('⚠️ Sessão já está vinculada')
      return NextResponse.json({ 
        error: 'Esta sessão já está vinculada ao sistema' 
      }, { status: 400 })
    }

    // Buscar status real da sessão no WAHA
    let sessionStatus: 'STARTING' | 'SCAN_QR_CODE' | 'WORKING' | 'FAILED' | 'STOPPED' = 'WORKING' // default
    try {
      const wahaResponse = await fetch(`${WAHA_BASE_URL}/api/sessions/${sessionId}`, {
        method: 'GET',
        headers: {
          'X-Api-Key': WAHA_API_KEY,
        }
      })
      
      if (wahaResponse.ok) {
        const wahaSession = await wahaResponse.json()
        sessionStatus = wahaSession.status as 'STARTING' | 'SCAN_QR_CODE' | 'WORKING' | 'FAILED' | 'STOPPED'
        console.log(`📊 Status real da sessão no WAHA: ${sessionStatus}`)
      }
    } catch (err) {
      console.error('⚠️ Erro ao buscar status do WAHA, usando WORKING como padrão:', err)
    }

    // Criar registro no banco com o status real
    const webhookUrl = `${WEBHOOK_BASE_URL}/webhooks/whatsapp`
    const session = await prisma.whatsAppSession.create({
      data: {
        sessionId,
        name: name || sessionId,
        status: sessionStatus,
        webhookUrl,
        userId: user.userId,
        phoneNumber: phoneNumber || null,
        profileName: profileName || null,
        profilePicture: profilePicture || null
      }
    })

    console.log('✅ Sessão vinculada ao banco:', session.id)

    return NextResponse.json({ 
      success: true,
      session: {
        id: session.id,
        sessionId: session.sessionId,
        name: session.name,
        status: session.status,
        webhookUrl: session.webhookUrl,
        userId: session.userId,
        createdAt: session.createdAt
      },
      message: 'Session linked successfully'
    })

  } catch (error) {
    console.error('Error linking session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
