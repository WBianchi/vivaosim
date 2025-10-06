import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_API_BASE_URL = process.env.DEEPSEEK_API_BASE_URL || 'https://api.deepseek.com/v1'
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat'

// Verificar autenticação
async function verifyAuth(request: NextRequest) {
  const headersList = await headers()
  const authorization = headersList.get('authorization')

  if (!authorization?.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authorization.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'API Key do DeepSeek não configurada' },
        { status: 500 }
      )
    }

    const { prompt, field } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt é obrigatório' },
        { status: 400 }
      )
    }

    console.log(`🤖 Gerando conteúdo para campo: ${field}`)
    console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`)

    // Chamar API do DeepSeek
    const deepseekResponse = await fetch(`${DEEPSEEK_API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente especializado em criação de conteúdo para blogs. Seja criativo, direto e profissional. Responda APENAS com o conteúdo solicitado, sem explicações adicionais.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: field === 'content' ? 2000 : 500,
        stream: false
      })
    })

    if (!deepseekResponse.ok) {
      const errorData = await deepseekResponse.json().catch(() => ({}))
      console.error('❌ Erro DeepSeek:', errorData)
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Erro na API do DeepSeek: ${deepseekResponse.statusText}` 
        },
        { status: 500 }
      )
    }

    const data = await deepseekResponse.json()
    const generatedContent = data.choices?.[0]?.message?.content?.trim()

    if (!generatedContent) {
      return NextResponse.json(
        { success: false, error: 'Nenhum conteúdo gerado' },
        { status: 500 }
      )
    }

    console.log(`✅ Conteúdo gerado com sucesso! (${generatedContent.length} chars)`)

    return NextResponse.json({
      success: true,
      content: generatedContent,
      field,
      tokens: data.usage
    })

  } catch (error) {
    console.error('❌ Erro ao gerar conteúdo com IA:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno ao gerar conteúdo' },
      { status: 500 }
    )
  }
}
