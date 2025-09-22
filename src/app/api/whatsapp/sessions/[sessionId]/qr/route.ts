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
    const token = authorization.replace('Bearer ', '')
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }
}

// GET - Obter QR Code da sessão
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

    // Buscar QR Code no WAHA - tentar diferentes endpoints
    console.log('🔍 Buscando QR Code para sessão:', sessionId)
    
    let qrResponse: Response | null = null
    
    // Tentar endpoint 1: /api/{sessionId}/auth/qr (retorna imagem PNG)
    try {
      qrResponse = await fetch(`${WAHA_BASE_URL}/api/${sessionId}/auth/qr`, {
        method: 'GET',
        headers: {
          'Accept': 'image/png',
          'X-Api-Key': WAHA_API_KEY,
        }
      })
      console.log('📡 Endpoint 1 response status:', qrResponse.status)
      
      if (qrResponse.ok) {
        // Converter imagem para base64
        const imageBuffer = await qrResponse.arrayBuffer()
        const base64QR = Buffer.from(imageBuffer).toString('base64')
        console.log('✅ QR Code obtido como imagem PNG, convertido para base64')
        
        return NextResponse.json({
          success: true,
          sessionId: sessionId,
          qr: base64QR,
          message: 'Scan the QR code with your WhatsApp mobile app'
        })
      }
    } catch (e) {
      console.log('❌ Endpoint 1 falhou:', e)
    }

    // Se chegou até aqui, não funcionou
    console.log('❌ QR Code não disponível para sessão:', sessionId)
    return NextResponse.json({ 
      error: 'QR Code not available',
      message: 'Session may not be in QR_SCAN state or may have expired',
      sessionId
    }, { status: 404 })

  } catch (error) {
    console.error('Error getting QR code:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
