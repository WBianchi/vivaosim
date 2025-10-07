import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearAllSessions() {
  try {
    console.log('\n⚠️  ATENÇÃO: Esta operação irá deletar TODAS as sessões do banco de dados!\n')

    const sessions = await prisma.whatsAppSession.findMany({
      select: {
        id: true,
        sessionId: true,
        name: true
      }
    })

    if (sessions.length === 0) {
      console.log('✅ Não há sessões para deletar\n')
      return
    }

    console.log(`📊 Total de sessões que serão deletadas: ${sessions.length}`)
    sessions.forEach((session, index) => {
      console.log(`   ${index + 1}. ${session.name} (${session.sessionId})`)
    })

    const readline = require('readline')
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question('\n⚠️  Confirma a EXCLUSÃO DE TODAS as sessões? (sim/não): ', async (answer: string) => {
      if (answer.toLowerCase() === 'sim' || answer.toLowerCase() === 's') {
        console.log('\n🗑️  Deletando todas as sessões...')
        
        const result = await prisma.whatsAppSession.deleteMany({})

        console.log(`✅ ${result.count} sessões deletadas com sucesso!`)
        console.log('ℹ️  Nota: As sessões continuam ativas no WAHA\n')
      } else {
        console.log('\n❌ Operação cancelada\n')
      }

      rl.close()
      await prisma.$disconnect()
    })
  } catch (error: any) {
    console.error('\n❌ Erro ao deletar sessões:', error.message)
    await prisma.$disconnect()
  }
}

clearAllSessions()
