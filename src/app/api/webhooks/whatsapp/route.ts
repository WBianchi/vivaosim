import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'webhook-secret'
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''
const WAHA_URL = process.env.WAHA_URL || 'http://159.65.34.199:3000'

// Tipos para webhooks do WAHA
interface WAHAWebhookPayload {
  event: string
  session: string
  me?: {
    id: string
    pushName: string
  }
  payload?: any
}

interface WAHAMessagePayload {
  id: string
  timestamp: number
  from: string
  fromMe: boolean
  to: string
  body?: string
  hasMedia?: boolean
  media?: {
    url: string
    mimetype: string
    filename: string
    size: number
  }
  type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'sticker'
  ack?: number
  location?: {
    latitude: number
    longitude: number
    description?: string
  }
}

interface WAHAStateChangePayload {
  state: 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'DESTROYED'
}

// Verificar assinatura HMAC do webhook
function verifyHMACSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  } catch (error) {
    console.error('HMAC verification error:', error)
    return false
  }
}

// POST - Receber webhooks do WAHA
export async function POST(request: NextRequest) {
  try {
    // Ler o payload
    const payload = await request.text()
    
    // Verificar assinatura HMAC (se configurada)
    const signature = request.headers.get('X-Webhook-Signature') || 
                     request.headers.get('x-hub-signature-256')
    
    if (signature && WEBHOOK_SECRET) {
      const cleanSignature = signature.replace('sha256=', '')
      if (!verifyHMACSignature(payload, cleanSignature, WEBHOOK_SECRET)) {
        console.error('Invalid webhook signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    // Parse do JSON
    let webhookData: WAHAWebhookPayload
    try {
      webhookData = JSON.parse(payload)
    } catch (parseError) {
      console.error('Invalid JSON payload:', parseError)
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    console.log('Received webhook:', {
      event: webhookData.event,
      session: webhookData.session,
      timestamp: new Date().toISOString()
    })

    // Processar diferentes tipos de eventos
    switch (webhookData.event) {
      case 'session.status':
      case 'state.change':
        await handleStateChange(webhookData)
        break
      
      case 'message':
      case 'message.any':
        await handleMessage(webhookData)
        break
      
      case 'group.join':
      case 'group.leave':
        await handleGroupEvent(webhookData)
        break
      
      case 'presence.update':
        await handlePresenceUpdate(webhookData)
        break
      
      default:
        console.log('Unhandled webhook event:', webhookData.event)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Webhook processed successfully'
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

// Processar mudanças de estado da sessão
async function handleStateChange(webhook: WAHAWebhookPayload) {
  try {
    const { session, payload } = webhook
    const stateData = payload as WAHAStateChangePayload
    
    console.log(`Session ${session} state changed to: ${stateData.state}`)
    
    // Atualizar status no banco de dados
    let newStatus: string
    switch (stateData.state) {
      case 'CONNECTING':
        newStatus = 'STARTING'
        break
      case 'CONNECTED':
        newStatus = 'WORKING'
        break
      case 'DISCONNECTED':
      case 'DESTROYED':
        newStatus = 'STOPPED'
        break
      default:
        newStatus = 'FAILED'
    }

    // Mock update - implementar com Prisma
    console.log(`Updating session ${session} status to: ${newStatus}`)
    
    // await prisma.whatsAppSession.update({
    //   where: { sessionId: session },
    //   data: { 
    //     status: newStatus,
    //     connectedAt: stateData.state === 'CONNECTED' ? new Date() : undefined,
    //     lastSeen: new Date()
    //   }
    // })

  } catch (error) {
    console.error('Error handling state change:', error)
  }
}

// Processar mensagens recebidas
async function handleMessage(webhook: WAHAWebhookPayload) {
  try {
    const { session, payload } = webhook
    const messageData = payload as WAHAMessagePayload
    
    console.log('\n' + '='.repeat(80))
    console.log(`📨 [WEBHOOK] Nova mensagem na sessão ${session}:`)
    console.log(`  - ID: ${messageData.id}`)
    console.log(`  - From: ${messageData.from}`)
    console.log(`  - FromMe: ${messageData.fromMe}`)
    console.log(`  - Type: ${messageData.type}`)
    console.log(`  - Body: ${messageData.body?.substring(0, 100)}`)
    console.log('='.repeat(80) + '\n')

    // Verificar se é uma mensagem de entrada (não nossa)
    if (!messageData.fromMe && messageData.body) {
      const chatId = messageData.from
      
      console.log(`🔍 [WEBHOOK] Verificando agente para chat: ${chatId}`)
      console.log(`🔍 [WEBHOOK] Tipo do chatId:`, typeof chatId, `Valor:`, chatId)
      
      // Buscar TODOS os agentes ativos para debug
      const allAgents = await prisma.agent.findMany({
        where: { 
          status: 'ACTIVE',
          chatId: { not: null }
        },
        select: {
          id: true,
          name: true,
          chatId: true,
          status: true
        }
      })
      
      console.log(`📋 [WEBHOOK] Total de agentes ativos com chatId:`, allAgents.length)
      allAgents.forEach(a => {
        console.log(`  - ${a.name}: chatId="${a.chatId}" (match: ${a.chatId === chatId})`)
      })
      
      // Verificar se o chat tem um agente IA ativo
      const agent = await prisma.agent.findFirst({
        where: { 
          chatId: chatId,
          status: 'ACTIVE'
        }
      })

      console.log(`🔍 [WEBHOOK] Agente encontrado:`, agent ? `${agent.name} (status: ${agent.status})` : 'NENHUM')

      if (agent && agent.status === 'ACTIVE') {
        console.log(`🤖 [WEBHOOK] Agente ATIVO: ${agent.name} (${agent.model})`)
        console.log(`📝 [WEBHOOK] Prompt: ${agent.prompt?.substring(0, 100)}...`)
        
        // Gerar resposta com IA
        const aiResponse = await generateAIResponse(
          messageData.body,
          agent.prompt,
          agent.model,
          agent.temperature || 0.7
        )

        if (aiResponse) {
          console.log(`✅ [WEBHOOK] Resposta gerada: ${aiResponse.substring(0, 100)}...`)
          
          // Enviar resposta automática
          await sendAutoReply(session, chatId, aiResponse)
          
          // Atualizar estatísticas do agente
          await prisma.agent.update({
            where: { id: agent.id },
            data: {
              totalInteractions: { increment: 1 },
              lastUsed: new Date()
            }
          })
        } else {
          console.log(`❌ [WEBHOOK] Falha ao gerar resposta com IA`)
        }
      } else {
        console.log(`👤 [WEBHOOK] Nenhum agente ATIVO para o chat ${chatId}`)
      }
      
      // Processar contato se não existe
      await processContact(session, messageData.from, messageData)
      
      // Processar chat se não existe  
      await processChat(session, messageData.from, messageData)
      
      // Salvar mensagem
      await saveMessage(session, messageData)
      
      // Trigger automações se configuradas
      await triggerAutomations(session, messageData)
    }

  } catch (error) {
    console.error('❌ Erro ao processar mensagem:', error)
  }
}

// Processar eventos de grupo
async function handleGroupEvent(webhook: WAHAWebhookPayload) {
  try {
    const { session, event, payload } = webhook
    console.log(`Group event ${event} in session ${session}:`, payload)
    
    // Implementar lógica de grupos se necessário
    
  } catch (error) {
    console.error('Error handling group event:', error)
  }
}

// Processar updates de presença
async function handlePresenceUpdate(webhook: WAHAWebhookPayload) {
  try {
    const { session, payload } = webhook
    console.log(`Presence update in session ${session}:`, payload)
    
    // Implementar lógica de presença se necessário
    
  } catch (error) {
    console.error('Error handling presence update:', error)
  }
}

// Funções auxiliares (implementar com Prisma)
async function processContact(sessionId: string, contactId: string, messageData: WAHAMessagePayload) {
  // Mock - implementar com Prisma
  console.log(`Processing contact ${contactId} for session ${sessionId}`)
}

async function processChat(sessionId: string, chatId: string, messageData: WAHAMessagePayload) {
  // Mock - implementar com Prisma
  console.log(`Processing chat ${chatId} for session ${sessionId}`)
}

async function saveMessage(sessionId: string, messageData: WAHAMessagePayload) {
  // Mock - implementar com Prisma
  console.log(`Saving message ${messageData.id} for session ${sessionId}`)
}

async function triggerAutomations(sessionId: string, messageData: WAHAMessagePayload) {
  // Mock - implementar automações
  console.log(`Checking automations for session ${sessionId}`)
}

// Gerar resposta com IA (DeepSeek)
async function generateAIResponse(
  userMessage: string,
  systemPrompt: string,
  model: string,
  temperature: number
): Promise<string | null> {
  try {
    console.log(`🧠 Gerando resposta com ${model}...`)
    
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
            content: systemPrompt
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: temperature,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      console.error(`❌ Erro na API DeepSeek: ${response.status}`)
      return null
    }

    const data = await response.json()
    const aiMessage = data.choices[0]?.message?.content

    if (aiMessage) {
      console.log(`✅ Resposta gerada: ${aiMessage.substring(0, 100)}...`)
      return aiMessage
    }

    return null
  } catch (error) {
    console.error('❌ Erro ao gerar resposta com IA:', error)
    return null
  }
}

// Enviar resposta automática via WAHA
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        session: sessionId,
        chatId: chatId,
        text: message
      })
    })

    if (!response.ok) {
      console.error(`❌ Erro ao enviar mensagem: ${response.status}`)
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

// GET - Health check do webhook
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    status: 'ok',
    message: 'WhatsApp webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}
