import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testAgentWebhook() {
  console.log('🔍 DIAGNÓSTICO DO SISTEMA DE AGENTES\n')
  console.log('='.repeat(80))

  // 1. Verificar agentes no banco
  console.log('\n📋 1. AGENTES NO BANCO DE DADOS:')
  const agents = await prisma.agent.findMany({
    select: {
      id: true,
      name: true,
      chatId: true,
      status: true,
      model: true,
      prompt: true
    }
  })

  if (agents.length === 0) {
    console.log('❌ NENHUM agente encontrado no banco!')
  } else {
    agents.forEach(agent => {
      console.log(`\n  🤖 ${agent.name}`)
      console.log(`     - ID: ${agent.id}`)
      console.log(`     - Chat ID: ${agent.chatId || 'NÃO ATRIBUÍDO'}`)
      console.log(`     - Status: ${agent.status}`)
      console.log(`     - Model: ${agent.model}`)
      console.log(`     - Prompt: ${agent.prompt?.substring(0, 50)}...`)
    })
  }

  // 2. Verificar sessões WhatsApp
  console.log('\n\n📱 2. SESSÕES WHATSAPP:')
  const sessions = await prisma.whatsAppSession.findMany({
    select: {
      id: true,
      sessionId: true,
      status: true,
      name: true
    }
  })

  if (sessions.length === 0) {
    console.log('❌ NENHUMA sessão WhatsApp encontrada!')
  } else {
    sessions.forEach(session => {
      console.log(`\n  📲 ${session.name}`)
      console.log(`     - Session ID: ${session.sessionId}`)
      console.log(`     - Status: ${session.status}`)
    })
  }

  // 3. Verificar configuração do webhook
  console.log('\n\n🔗 3. CONFIGURAÇÃO DO WEBHOOK:')
  console.log(`   URL esperada: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/whatsapp`)
  console.log(`   WAHA URL: ${process.env.WAHA_URL || 'http://159.65.34.199:3000'}`)
  console.log(`   DeepSeek API Key: ${process.env.DEEPSEEK_API_KEY ? '✅ Configurada' : '❌ NÃO configurada'}`)

  // 4. Testar conexão com DeepSeek
  console.log('\n\n🧠 4. TESTE DE CONEXÃO COM DEEPSEEK:')
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'Você é um assistente útil.' },
          { role: 'user', content: 'Olá, teste de conexão.' }
        ],
        max_tokens: 50,
        temperature: 0.7
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ DeepSeek API funcionando!')
      console.log(`   Resposta: ${data.choices[0].message.content}`)
    } else {
      console.log(`❌ Erro na API DeepSeek: ${response.status}`)
      const error = await response.text()
      console.log(`   Detalhes: ${error}`)
    }
  } catch (error) {
    console.log('❌ Erro ao conectar com DeepSeek:', error)
  }

  // 5. Resumo e Checklist
  console.log('\n\n' + '='.repeat(80))
  console.log('📝 CHECKLIST:')
  console.log(`   ${agents.length > 0 ? '✅' : '❌'} Agentes cadastrados`)
  console.log(`   ${agents.some(a => a.status === 'ACTIVE') ? '✅' : '❌'} Agente com status ACTIVE`)
  console.log(`   ${agents.some(a => a.chatId) ? '✅' : '❌'} Agente atribuído a um chat`)
  console.log(`   ${sessions.length > 0 ? '✅' : '❌'} Sessão WhatsApp configurada`)
  console.log(`   ${sessions.some(s => s.status === 'WORKING') ? '✅' : '❌'} Sessão WhatsApp conectada`)
  console.log(`   ${process.env.DEEPSEEK_API_KEY ? '✅' : '❌'} DeepSeek API Key configurada`)

  console.log('\n\n💡 PRÓXIMOS PASSOS:')
  
  if (!agents.some(a => a.chatId)) {
    console.log('   1. ⚠️  Atribua um agente a um chat específico')
  }
  
  if (!agents.some(a => a.status === 'ACTIVE')) {
    console.log('   2. ⚠️  Ative o agente (status = ACTIVE)')
  }
  
  if (!sessions.some(s => s.status === 'WORKING')) {
    console.log('   3. ⚠️  Conecte a sessão WhatsApp')
  }

  console.log('\n   4. 📨 Envie uma mensagem para o chat com agente atribuído')
  console.log('   5. 🔍 Verifique os logs do servidor Next.js')
  console.log('   6. 🔗 Verifique se o webhook está configurado no WAHA')

  console.log('\n' + '='.repeat(80))
  console.log('\n✅ Diagnóstico concluído!\n')

  await prisma.$disconnect()
}

testAgentWebhook().catch(console.error)
