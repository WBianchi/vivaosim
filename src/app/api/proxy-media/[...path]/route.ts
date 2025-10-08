import { NextRequest, NextResponse } from 'next/server'

const WAHA_URL = process.env.WAHA_URL || 'http://159.65.34.199:3001'
const WAHA_API_KEY = process.env.WAHA_API_KEY || 'tappyone-waha-2024-secretkey'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = params.path.join('/')
    
    // Buscar arquivo do WAHA
    const wahaFileUrl = `${WAHA_URL}/api/files/${filePath}`
    
    const response = await fetch(wahaFileUrl, {
      headers: {
        'X-Api-Key': WAHA_API_KEY
      }
    })
    
    if (!response.ok) {
      console.error(`❌ Erro ao buscar arquivo: ${response.status}`)
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }
    
    // Pegar o blob da mídia
    const blob = await response.blob()
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    
    // Retornar a mídia com headers corretos
    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*'
      }
    })
    
  } catch (error) {
    console.error('❌ Erro no proxy de mídia:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
