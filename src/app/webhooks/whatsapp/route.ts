import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''
const WAHA_URL = process.env.WAHA_URL || 'http://159.65.34.199:3001'  // ✅ PORTA CORRETA
const WAHA_API_KEY = process.env.WAHA_API_KEY || 'tappyone-waha-2024-secretkey'

// 🚫 Sistema de deduplicação
const processedMessages = new Set<string>()
const CLEANUP_INTERVAL = 60000 // Limpar a cada 1 minuto

// Limpar mensagens antigas
setInterval(() => {
  if (processedMessages.size > 1000) {
    processedMessages.clear()
    console.log('🧹 Cache de mensagens limpo')
  }
}, CLEANUP_INTERVAL)

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
    console.log('🔔 WEBHOOK CHAMADO em /webhooks/whatsapp')
    console.log('📍 Headers:', Object.fromEntries(request.headers.entries()))
    
    const rawBody = await request.text()
    console.log('📦 Raw body:', rawBody)
    
    const webhookData: WAHAWebhookPayload = JSON.parse(rawBody)

    console.log('📨 Webhook recebido em /webhooks/whatsapp:', {
      event: webhookData.event,
      session: webhookData.session,
      from: webhookData.payload?.from,
      fromMe: webhookData.payload?.fromMe,
      body: webhookData.payload?.body?.substring(0, 50)
    })

    // Processar apenas mensagens de entrada - APENAS 'message.any' para evitar duplicatas
    if (webhookData.event === 'message.any' && !webhookData.payload?.fromMe) {
      // 🚫 Verificar duplicação usando ID da mensagem
      const messageId = webhookData.payload?.id || `${webhookData.payload?.from}-${webhookData.payload?.timestamp}`
      
      if (processedMessages.has(messageId)) {
        console.log(`🚫 Mensagem duplicada bloqueada: ${messageId}`)
        return NextResponse.json({ 
          success: true,
          message: 'Duplicata bloqueada'
        })
      }
      
      // Registrar mensagem como processada
      processedMessages.add(messageId)
      console.log(`✅ Mensagem registrada: ${messageId}`)
      
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
      
      console.log(`🔍 Buscando agente para sessão: ${session}`)
      
      // 🎯 CORREÇÃO: Buscar agente pela SESSÃO, não pelo chatId específico
      // Primeiro, buscar a sessão WhatsApp no banco
      const whatsappSession = await prisma.whatsAppSession.findFirst({
        where: { 
          sessionId: session,
          status: 'WORKING'
        },
        include: {
          user: true
        }
      })

      if (!whatsappSession) {
        console.log(`❌ Sessão ${session} não encontrada no banco`)
        return
      }

      console.log(`✅ Sessão encontrada: ${whatsappSession.name} (User: ${whatsappSession.user?.name})`)
      
      // 🎯 Buscar QUALQUER agente ATIVO (não vinculado a chat específico)
      const agent = await prisma.agent.findFirst({
        where: { 
          status: 'ACTIVE'
        },
        orderBy: {
          lastUsed: 'desc' // Pegar o mais recentemente usado
        }
      })

      console.log(`🔎 Resultado da busca:`, agent ? `Agente ${agent.name} encontrado` : 'NENHUM agente encontrado')

      if (agent) {
        console.log(`🤖 Agente ATIVO encontrado: ${agent.name} (${agent.model})`)
        console.log(`📝 Prompt: ${agent.prompt?.substring(0, 100)}...`)
        
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

// Enviar resposta via WAHA com anti-bloqueio
async function sendAutoReply(
  sessionId: string,
  chatId: string,
  message: string
): Promise<boolean> {
  try {
    console.log(`📤 Enviando auto-resposta para ${chatId}...`)
    
    // 1️⃣ Enviar "visto" (seen)
    console.log('👁️ Enviando "visto"...')
    await fetch(`${WAHA_URL}/api/sendSeen`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Api-Key': WAHA_API_KEY
      },
      body: JSON.stringify({
        session: sessionId,
        chatId: chatId
      })
    })
    
    // 2️⃣ Iniciar digitação
    console.log('⌨️ Iniciando digitação...')
    await fetch(`${WAHA_URL}/api/startTyping`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Api-Key': WAHA_API_KEY
      },
      body: JSON.stringify({
        session: sessionId,
        chatId: chatId
      })
    })
    
    // 3️⃣ Aguardar tempo aleatório baseado no tamanho da mensagem
    const typingTime = Math.min(Math.max(message.length * 50, 1000), 5000) // Entre 1-5 segundos
    console.log(`⏳ Aguardando ${typingTime}ms (simulando digitação)...`)
    await new Promise(resolve => setTimeout(resolve, typingTime))
    
    // 4️⃣ Parar digitação
    console.log('🛑 Parando digitação...')
    await fetch(`${WAHA_URL}/api/stopTyping`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Api-Key': WAHA_API_KEY
      },
      body: JSON.stringify({
        session: sessionId,
        chatId: chatId
      })
    })
    
    // 5️⃣ Enviar mensagem
    console.log('📨 Enviando mensagem...')
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
