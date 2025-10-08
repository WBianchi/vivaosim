import { NextRequest, NextResponse } from 'next/server'

const WAHA_URL = process.env.WAHA_URL || 'http://159.65.34.199:3001'

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string; filename: string } }
) {
  try {
    const { sessionId, filename } = params
    
    console.log(`📥 Proxy de arquivo: ${sessionId}/${filename}`)
    
    // Buscar arquivo do WAHA
    const wahaFileUrl = `${WAHA_URL}/api/files/${sessionId}/${filename}`
    console.log(`🔗 URL WAHA: ${wahaFileUrl}`)
    
    const response = await fetch(wahaFileUrl)
    
    if (!response.ok) {
      console.error(`❌ Erro ao buscar arquivo: ${response.status}`)
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }
    
    // Pegar o blob da imagem
    const blob = await response.blob()
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    
    console.log(`✅ Arquivo servido: ${filename} (${contentType})`)
    
    // Retornar a imagem com headers corretos
    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    })
    
  } catch (error) {
    console.error('❌ Erro no proxy de arquivo:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
