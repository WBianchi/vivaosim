import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''
const WAHA_URL = process.env.WAHA_URL || 'http://159.65.34.199:3000'
const WAHA_API_KEY = process.env.WAHA_API_KEY || 'tappyone-waha-2024-secretkey'

interface WAHAMessagePayload {
  id: string
  timestamp: number
  from: string
  fromMe: boolean
  to: string
  body?: string
  type: 'text' | 'image' | 'audio' | 'video' | 'document'
}

interface WAHAWebhookPayload {
  event: string
  session: string
  payload?: any
}

// POST - Receber webhooks do WAHA
export async function POST(request: NextRequest) {
  try {
    const webhookData: WAHAWebhookPayload = await request.json()

    console.log('📨 Webhook recebido em /webhooks/whatsapp:', {
      event: webhookData.event,
      session: webhookData.session,
      from: webhookData.payload?.from,
      fromMe: webhookData.payload?.fromMe
    })

    // Processar apenas mensagens de entrada
    if ((webhookData.event === 'message' || webhookData.event === 'message.any') && !webhookData.payload?.fromMe) {
      await handleMessage(webhookData)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Webhook processed'
    })

  } catch (error: any) {
    console.error('❌ Erro no webhook:', error)
    return NextResponse.json({ 
      error: 'Internal error',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}

// Processar mensagens
async function handleMessage(webhook: WAHAWebhookPayload) {
  try {
    const { session, payload } = webhook
    const messageData = payload as WAHAMessagePayload
    
    console.log(`📨 Nova mensagem:`, {
      from: messageData.from,
      fromMe: messageData.fromMe,
      body: messageData.body?.substring(0, 50)
    })

    // Só processar mensagens de entrada com texto
    if (!messageData.fromMe && messageData.body) {
      const chatId = messageData.from
      
      // Buscar agente ativo para este chat
      const agent = await prisma.agent.findFirst({
        where: { 
          chatId: chatId,
          status: 'ACTIVE'
        }
      })

      if (agent) {
        console.log(`🤖 Agente encontrado: ${agent.name} (${agent.model})`)
        
        // Gerar resposta com IA
        const aiResponse = await generateAIResponse(
          messageData.body,
          agent.prompt,
          agent.temperature || 0.7
        )

        if (aiResponse) {
          // Enviar resposta
          await sendAutoReply(session, chatId, aiResponse)
          
          // Atualizar stats
          await prisma.agent.update({
            where: { id: agent.id },
            data: {
              totalInteractions: { increment: 1 },
              lastUsed: new Date()
            }
          })
        }
      } else {
        console.log(`👤 Sem agente ativo para ${chatId}`)
      }
    }

  } catch (error) {
    console.error('❌ Erro ao processar mensagem:', error)
  }
}

// Gerar resposta com DeepSeek
async function generateAIResponse(
  userMessage: string,
  systemPrompt: string,
  temperature: number
): Promise<string | null> {
  try {
    console.log(`🧠 Gerando resposta com DeepSeek...`)
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: temperature,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      console.error(`❌ DeepSeek error: ${response.status}`)
      return null
    }

    const data = await response.json()
    const aiMessage = data.choices[0]?.message?.content

    if (aiMessage) {
      console.log(`✅ Resposta: ${aiMessage.substring(0, 100)}...`)
      return aiMessage
    }

    return null
  } catch (error) {
    console.error('❌ Erro DeepSeek:', error)
    return null
  }
}

// Enviar resposta via WAHA
async function sendAutoReply(
  sessionId: string,
  chatId: string,
  message: string
): Promise<boolean> {
  try {
    console.log(`📤 Enviando auto-resposta para ${chatId}...`)
    
    const response = await fetch(`${WAHA_URL}/api/sendText`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Api-Key': WAHA_API_KEY
      },
      body: JSON.stringify({
        session: sessionId,
        chatId: chatId,
        text: message
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Erro ao enviar (${response.status}): ${errorText}`)
      return false
    }

    const data = await response.json()
    console.log(`✅ Auto-resposta enviada: ${data.id}`)
    return true
  } catch (error) {
    console.error('❌ Erro ao enviar auto-resposta:', error)
    return false
  }
}

// GET - Health check
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Webhook ativo',
    timestamp: new Date().toISOString()
  })
}
