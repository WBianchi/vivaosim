import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteSession() {
  try {
    const sessionId = process.argv[2]

    if (!sessionId) {
      console.log('\n❌ Erro: Você precisa fornecer o sessionId')
      console.log('💡 Uso: npx tsx scripts/delete-session.ts <sessionId>\n')
      console.log('Para ver todas as sessões, execute:')
      console.log('   npx tsx scripts/list-sessions.ts\n')
      return
    }

    console.log(`\n🔍 Procurando sessão: ${sessionId}...\n`)

    const session = await prisma.whatsAppSession.findUnique({
      where: { sessionId },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!session) {
      console.log('❌ Sessão não encontrada no banco de dados\n')
      return
    }

    console.log('📱 Sessão encontrada:')
    console.log(`   ID: ${session.id}`)
    console.log(`   Session ID: ${session.sessionId}`)
    console.log(`   Nome: ${session.name}`)
    console.log(`   Status: ${session.status}`)
    console.log(`   Usuário: ${session.user.name} (${session.user.email})`)
    console.log(`   Criado em: ${session.createdAt.toLocaleString('pt-BR')}`)

    // Confirmar exclusão
    const readline = require('readline')
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question('\n⚠️  Deseja realmente DELETAR esta sessão? (sim/não): ', async (answer: string) => {
      if (answer.toLowerCase() === 'sim' || answer.toLowerCase() === 's') {
        console.log('\n🗑️  Deletando sessão...')
        
        await prisma.whatsAppSession.delete({
          where: { sessionId }
        })

        console.log('✅ Sessão deletada com sucesso!')
        console.log('ℹ️  Nota: A sessão continua ativa no WAHA\n')
      } else {
        console.log('\n❌ Operação cancelada\n')
      }

      rl.close()
      await prisma.$disconnect()
    })
  } catch (error: any) {
    console.error('\n❌ Erro ao deletar sessão:', error.message)
    await prisma.$disconnect()
  }
}

deleteSession()
