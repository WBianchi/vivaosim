import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'

const WAHA_BASE_URL = process.env.WAHA_API_URL || 'http://159.65.34.199:3001'
const WAHA_API_KEY = process.env.WAHA_API_KEY || 'tappyone-waha-2024-secretkey'
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Verificar autenticação
async function verifyAuth(request: NextRequest) {
  const headersList = headers()
  const authorization = headersList.get('authorization')

  if (!authorization?.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authorization.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch {
    return null
  }
}

// GET - Verificar status da sessão
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId } = params

    console.log('🔍 Verificando status da sessão WAHA:', sessionId)

    // Buscar status da sessão no WAHA
    const statusResponse = await fetch(`${WAHA_BASE_URL}/api/sessions/${sessionId}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': WAHA_API_KEY,
      }
    })

    if (!statusResponse.ok) {
      console.log('❌ Sessão não encontrada no WAHA:', statusResponse.status)
      return NextResponse.json({ 
        error: 'Session not found',
        sessionId 
      }, { status: 404 })
    }

    const sessionData = await statusResponse.json()
    console.log('📊 Status WAHA:', sessionData.status)

    // Buscar informações do perfil se estiver conectado
    let profileData = null
    if (sessionData.status === 'WORKING') {
      try {
        const meResponse = await fetch(`${WAHA_BASE_URL}/api/sessions/${sessionId}/me`, {
          method: 'GET',
          headers: {
            'X-Api-Key': WAHA_API_KEY,
          }
        })
        
        if (meResponse.ok) {
          profileData = await meResponse.json()
          console.log('👤 Dados do perfil:', profileData)
        }
      } catch (err) {
        console.error('Erro ao buscar dados do perfil:', err)
      }
    }

    return NextResponse.json({
      success: true,
      sessionId: sessionId,
      status: sessionData.status,
      phoneNumber: profileData?.id || null,
      profileName: profileData?.pushname || profileData?.name || null,
      profilePicture: profileData?.profilePictureUrl || null,
      wahaData: sessionData
    })

  } catch (error) {
    console.error('Error checking session status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
