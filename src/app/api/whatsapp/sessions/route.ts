import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Tipos para WAHA API
interface WAHASession {
  name: string
  status: 'STARTING' | 'SCAN_QR_CODE' | 'WORKING' | 'FAILED' | 'STOPPED'
  config?: {
    proxy?: string
    webhooks?: {
      url: string
      events: string[]
      hmac?: {
        key: string
      }
    }[]
  }
}

interface WAHAQRCode {
  qr: string // Base64 QR Code
}

const WAHA_BASE_URL = process.env.WAHA_API_URL || 'http://159.65.34.199:3001'
const WAHA_API_KEY = process.env.WAHA_API_KEY || 'tappyone-waha-2024-secretkey'
const WEBHOOK_BASE_URL = process.env.WEBHOOK_BASE_URL || 'http://159.65.34.199:8081'
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

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

// GET - Listar sessões do usuário
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('📋 Buscando todas as sessões do WAHA...')

    // Buscar TODAS as sessões do WAHA
    const wahaResponse = await fetch(`${WAHA_BASE_URL}/api/sessions/`, {
      method: 'GET',
      headers: {
        'X-Api-Key': WAHA_API_KEY,
      }
    })

    if (!wahaResponse.ok) {
      console.error('❌ Erro ao buscar sessões WAHA:', wahaResponse.status)
      return NextResponse.json({ sessions: [] })
    }

    const wahaSessions = await wahaResponse.json()
    console.log('📊 Sessões WAHA encontradas:', wahaSessions.length)

    // Buscar todas as sessões do banco para fazer merge
    const dbSessions = await prisma.whatsAppSession.findMany({
      where: {
        userId: user.userId
      }
    })
    
    const dbSessionsMap = new Map(dbSessions.map(s => [s.sessionId, s]))
    console.log('💾 Sessões no banco:', dbSessions.length)

    // Mapear sessões WAHA para nosso formato
    const sessions = await Promise.all(
      wahaSessions.map(async (wahaSession: any) => {
        let profileData = null
        
        // Se estiver conectado, buscar dados do perfil
        if (wahaSession.status === 'WORKING') {
          try {
            const meResponse = await fetch(`${WAHA_BASE_URL}/api/sessions/${wahaSession.name}/me`, {
              method: 'GET',
              headers: {
                'X-Api-Key': WAHA_API_KEY,
              }
            })
            
            if (meResponse.ok) {
              profileData = await meResponse.json()
            }
          } catch (err) {
            console.error('Erro ao buscar perfil:', err)
          }
        }

        // Verificar se existe no banco
        const dbSession = dbSessionsMap.get(wahaSession.name) as any
        const isInDatabase = !!dbSession

        return {
          id: dbSession?.id || wahaSession.name,
          sessionId: wahaSession.name,
          name: dbSession?.name || wahaSession.name,
          status: wahaSession.status,
          phoneNumber: profileData?.id || dbSession?.phoneNumber || null,
          profileName: profileData?.pushname || profileData?.name || dbSession?.profileName || null,
          profilePicture: profileData?.profilePictureUrl || dbSession?.profilePicture || null,
          connectedAt: wahaSession.status === 'WORKING' ? new Date() : null,
          lastSeen: new Date(),
          isInDatabase // Flag para saber se está no banco
        }
      })
    )

    console.log('✅ Sessões mapeadas:', sessions.length)
    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ sessions: [] })
  }
}

// POST - Criar nova sessão WhatsApp
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name } = await request.json()
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Verificar se já existe uma sessão recente (criada há menos de 10 segundos)
    const recentSession = await prisma.whatsAppSession.findFirst({
      where: {
        userId: user.userId,
        createdAt: {
          gte: new Date(Date.now() - 10000) // 10 segundos atrás
        }
      }
    })

    if (recentSession) {
      console.log('⚠️ Sessão recente já existe, retornando a existente:', recentSession.sessionId)
      return NextResponse.json({ 
        success: true,
        session: {
          id: recentSession.id,
          sessionId: recentSession.sessionId,
          name: recentSession.name,
          status: recentSession.status,
          webhookUrl: recentSession.webhookUrl,
          userId: recentSession.userId,
          createdAt: recentSession.createdAt
        },
        message: 'Using existing recent session'
      })
    }

    // Gerar ID único para a sessão
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const webhookUrl = `${WEBHOOK_BASE_URL}/webhooks/whatsapp`

    console.log('🆔 SessionId gerado:', sessionId)

    // Configuração da sessão WAHA
    const wahaConfig: WAHASession = {
      name: sessionId,
      status: 'STARTING',
      config: {
        webhooks: [
          {
            url: webhookUrl,
            events: [
              'message',
              'message.any',
              'state.change',
              'group.join',
              'group.leave',
              'presence.update'
            ],
            hmac: {
              key: process.env.WEBHOOK_SECRET || 'webhook-secret'
            }
          }
        ]
      }
    }

    // Criar sessão no WAHA
    const wahaResponse = await fetch(`${WAHA_BASE_URL}/api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': WAHA_API_KEY,
      },
      body: JSON.stringify(wahaConfig)
    })

    if (!wahaResponse.ok) {
      const error = await wahaResponse.text()
      console.error('WAHA API Error:', error)
      return NextResponse.json({ 
        error: 'Failed to create session in WAHA',
        details: error 
      }, { status: 500 })
    }

    // Salvar no banco de dados
    console.log('💾 Salvando sessão no banco de dados...')
    const session = await prisma.whatsAppSession.create({
      data: {
        sessionId,
        name,
        status: 'STARTING',
        webhookUrl,
        userId: user.userId,
        phoneNumber: null,
        profileName: null,
        profilePicture: null
      }
    })
    console.log('✅ Sessão salva no banco:', session.id)

    // Iniciar sessão para gerar QR Code
    try {
      console.log('🚀 Iniciando sessão WAHA:', sessionId)
      const startResponse = await fetch(`${WAHA_BASE_URL}/api/sessions/${sessionId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': WAHA_API_KEY,
        }
      })
      
      if (startResponse.ok) {
        console.log('✅ Sessão WAHA iniciada com sucesso')
        // Atualizar status no banco
        await prisma.whatsAppSession.update({
          where: { id: session.id },
          data: { status: 'SCAN_QR_CODE' }
        })
      } else {
        console.error('❌ Erro ao iniciar sessão WAHA:', await startResponse.text())
      }
    } catch (startError) {
      console.error('❌ Session start error:', startError)
    }

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
      message: 'Session created successfully'
    })

  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Deletar sessão
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    console.log('🗑️ Deletando sessão do site:', sessionId)

    // IMPORTANTE: NÃO deletar do WAHA, apenas do banco de dados do site
    // O WAHA deve manter a sessão ativa
    
    // Deletar apenas do banco de dados
    try {
      console.log('🗄️ Deletando sessão do banco de dados...')
      const deletedSession = await prisma.whatsAppSession.delete({ 
        where: { sessionId } 
      })
      console.log('✅ Sessão deletada do banco:', deletedSession.id)
      console.log('ℹ️ A sessão continua ativa no WAHA')
    } catch (dbError: any) {
      console.error('❌ Erro ao deletar do banco:', dbError)
      // Se não encontrar no banco, não é erro crítico
      if (dbError.code !== 'P2025') { // P2025 = Record not found
        throw dbError
      }
      console.log('⚠️ Sessão não encontrada no banco de dados')
    }

    return NextResponse.json({ 
      success: true,
      message: 'Session deleted successfully from database (WAHA session remains active)'
    })

  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
