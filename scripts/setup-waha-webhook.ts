import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const WAHA_URL = process.env.WAHA_API_URL || 'http://159.65.34.199:3001'
const WAHA_API_KEY = process.env.WAHA_API_KEY || 'tappyone-waha-2024-secretkey'

async function setupWebhook() {
  console.log('🔗 CONFIGURANDO WEBHOOK NO WAHA\n')
  console.log('='.repeat(80))

  // Usar WHATSAPP_HOOK_URL como prioridade
  const webhookUrl = process.env.WHATSAPP_HOOK_URL || process.env.WEBHOOK_URL || process.env.NEXT_PUBLIC_APP_URL + '/api/webhooks/whatsapp'
  
  console.log(`\n📍 URL do Webhook: ${webhookUrl}`)
  console.log(`📍 WAHA URL: ${WAHA_URL}`)

  // Buscar todas as sessões
  const sessions = await prisma.whatsAppSession.findMany({
    where: { status: 'WORKING' },
    select: { sessionId: true, name: true }
  })

  if (sessions.length === 0) {
    console.log('\n❌ Nenhuma sessão WhatsApp conectada!')
    await prisma.$disconnect()
    return
  }

  console.log(`\n📱 Sessões encontradas: ${sessions.length}`)

  // Configurar webhook para cada sessão
  for (const session of sessions) {
    console.log(`\n🔧 Configurando webhook para: ${session.name}`)
    
    try {
      const response = await fetch(`${WAHA_URL}/api/${session.sessionId}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': WAHA_API_KEY
        },
        body: JSON.stringify({
          webhooks: [
            {
              url: webhookUrl,
              events: [
                'message',
                'message.any',
                'session.status',
                'state.change'
              ],
              hmac: {
                key: process.env.WEBHOOK_SECRET || 'webhook-secret'
              }
            }
          ]
        })
      })

      if (response.ok) {
        console.log(`   ✅ Webhook configurado com sucesso!`)
      } else {
        const error = await response.text()
        console.log(`   ❌ Erro: ${response.status} - ${error}`)
      }
    } catch (error) {
      console.log(`   ❌ Erro ao configurar: ${error}`)
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('\n✅ Configuração concluída!')
  console.log('\n💡 TESTE AGORA:')
  console.log('   1. Envie uma mensagem para um dos chats com agente')
  console.log('   2. Verifique os logs do Next.js')
  console.log('   3. O agente deve responder automaticamente!\n')

  await prisma.$disconnect()
}

setupWebhook().catch(console.error)
