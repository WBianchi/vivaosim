import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt é obrigatório' },
        { status: 400 }
      )
    }

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      console.error('❌ [AI/DEEPSEEK] API Key não configurada')
      return NextResponse.json(
        { error: 'DEEPSEEK_API_KEY não configurada' },
        { status: 500 }
      )
    }

    console.log('🤖 [AI/DEEPSEEK] Gerando conteúdo...')

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [AI/DEEPSEEK] Erro na API:', response.status, errorText)
      return NextResponse.json(
        { error: 'Erro na API DeepSeek', details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      console.error('❌ [AI/DEEPSEEK] Resposta vazia')
      return NextResponse.json(
        { error: 'Resposta vazia da IA' },
        { status: 500 }
      )
    }

    console.log('✅ [AI/DEEPSEEK] Conteúdo gerado com sucesso')

    return NextResponse.json({
      content,
      usage: data.usage
    })

  } catch (error) {
    console.error('❌ [AI/DEEPSEEK] Erro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
