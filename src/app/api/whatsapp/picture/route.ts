import { NextRequest, NextResponse } from 'next/server'

const WAHA_BASE_URL = process.env.WAHA_API_URL || 'http://159.65.34.199:3001'
const WAHA_API_KEY = process.env.WAHA_API_KEY || 'tappyone-waha-2024-secretkey'

export async function GET(request: NextRequest) {
  console.log('🎯 Proxy chamado!')
  
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    console.log('📥 URL recebida:', url)

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      )
    }

    // Buscar URL da imagem da WAHA (retorna JSON)
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': WAHA_API_KEY
      }
    })

    if (!response.ok) {
      // Retornar avatar padrão ao invés de 404
      const fallbackUrl = `https://ui-avatars.com/api/?name=User&background=F97316&color=ffffff&size=48`
      const fallbackResponse = await fetch(fallbackUrl)
      const fallbackBuffer = await fallbackResponse.arrayBuffer()
      
      return new NextResponse(fallbackBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=3600'
        }
      })
    }

    // WAHA retorna JSON com a URL da imagem
    const data = await response.json()
    
    console.log('📸 WAHA response:', data)
    
    if (!data.url) {
      console.log('⚠️ Sem URL na resposta WAHA')
      // Se não tem URL, retornar avatar padrão
      const fallbackUrl = `https://ui-avatars.com/api/?name=User&background=F97316&color=ffffff&size=48`
      const fallbackResponse = await fetch(fallbackUrl)
      const fallbackBuffer = await fallbackResponse.arrayBuffer()
      
      return new NextResponse(fallbackBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=3600'
        }
      })
    }

    console.log('🌐 Buscando imagem do WhatsApp:', data.url)
    
    // Buscar a imagem real do WhatsApp
    const imageResponse = await fetch(data.url)
    
    console.log('✅ Status da imagem WhatsApp:', imageResponse.status)
    
    if (!imageResponse.ok) {
      // Se falhar, retornar avatar padrão
      const fallbackUrl = `https://ui-avatars.com/api/?name=User&background=F97316&color=ffffff&size=48`
      const fallbackResponse = await fetch(fallbackUrl)
      const fallbackBuffer = await fallbackResponse.arrayBuffer()
      
      return new NextResponse(fallbackBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=3600'
        }
      })
    }

    // Obter o buffer da imagem
    const imageBuffer = await imageResponse.arrayBuffer()
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'

    // Retornar a imagem com headers apropriados
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400' // Cache por 24 horas
      }
    })
  } catch (error) {
    console.error('Erro ao buscar imagem:', error)
    return new NextResponse(null, { status: 500 })
  }
}
