import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAgent() {
  const chatId = '5518997200106@c.us'
  
  console.log('🔍 Verificando agente para chat:', chatId)
  
  const agent = await prisma.agent.findFirst({
    where: { chatId: chatId }
  })
  
  if (agent) {
    console.log('✅ Agente encontrado:')
    console.log('  - ID:', agent.id)
    console.log('  - Nome:', agent.name)
    console.log('  - Status:', agent.status)
    console.log('  - ChatId:', agent.chatId)
    console.log('  - Modelo:', agent.model)
  } else {
    console.log('❌ Nenhum agente encontrado para este chat')
    
    // Listar todos os agentes
    const allAgents = await prisma.agent.findMany()
    console.log('\n📋 Agentes no banco:', allAgents.length)
    allAgents.forEach(a => {
      console.log(`  - ${a.name} (${a.status}) - chatId: ${a.chatId || 'NULL'}`)
    })
  }
  
  await prisma.$disconnect()
}

checkAgent()
