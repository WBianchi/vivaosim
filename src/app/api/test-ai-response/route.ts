import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { chatId, message } = body

    console.log('=' .repeat(80))
    console.log('🧪 [TEST] Iniciando teste de auto-resposta')
    console.log('🔍 [TEST] ChatId:', chatId)
    console.log('💬 [TEST] Mensagem:', message)
    console.log('=' .repeat(80))

    // 1. Buscar agente
    const agent = await prisma.agent.findFirst({
      where: { chatId: chatId }
    })

    console.log('\n📋 [TEST] Busca no banco:')
    if (agent) {
      console.log('✅ [TEST] Agente encontrado!')
      console.log('  - ID:', agent.id)
      console.log('  - Nome:', agent.name)
      console.log('  - Status:', agent.status)
      console.log('  - Modelo:', agent.model)
      console.log('  - Prompt:', agent.prompt?.substring(0, 100) + '...')
    } else {
      console.log('❌ [TEST] Nenhum agente encontrado')
      
      const allAgents = await prisma.agent.findMany()
      console.log('\n📋 [TEST] Todos os agentes:')
      allAgents.forEach(a => {
        console.log(`  - ${a.name} (${a.status}) - chatId: ${a.chatId || 'NULL'}`)
      })
      
      return NextResponse.json({ 
        error: 'Agente não encontrado',
        allAgents: allAgents.map(a => ({ name: a.name, chatId: a.chatId, status: a.status }))
      }, { status: 404 })
    }

    if (agent.status !== 'ACTIVE') {
      console.log('⚠️ [TEST] Agente não está ATIVO')
      return NextResponse.json({ 
        error: 'Agente não está ativo',
        agent: { name: agent.name, status: agent.status }
      }, { status: 400 })
    }

    // 2. Gerar resposta com DeepSeek
    console.log('\n🤖 [TEST] Chamando API DeepSeek...')
    console.log('  - API Key:', DEEPSEEK_API_KEY ? `${DEEPSEEK_API_KEY.substring(0, 10)}...` : 'NÃO CONFIGURADA')
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: agent.prompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: agent.temperature || 0.7,
        max_tokens: 500
      })
    })

    console.log('  - Status HTTP:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log('❌ [TEST] Erro na API DeepSeek:', errorText)
      return NextResponse.json({ 
        error: 'Erro na API DeepSeek',
        status: response.status,
        details: errorText
      }, { status: 500 })
    }

    const data = await response.json()
    const aiMessage = data.choices[0]?.message?.content

    if (aiMessage) {
      console.log('\n✅ [TEST] Resposta gerada com sucesso!')
      console.log('📝 [TEST] Resposta:', aiMessage)
      console.log('📊 [TEST] Tokens usados:', data.usage)
      console.log('=' .repeat(80))
      
      return NextResponse.json({
        success: true,
        agent: {
          name: agent.name,
          status: agent.status
        },
        response: aiMessage,
        usage: data.usage
      })
    } else {
      console.log('❌ [TEST] Resposta vazia da IA')
      return NextResponse.json({ error: 'Resposta vazia da IA' }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ [TEST] Erro:', error)
    return NextResponse.json({ 
      error: 'Erro interno',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
