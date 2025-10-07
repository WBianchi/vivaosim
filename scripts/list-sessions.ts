import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listSessions() {
  try {
    console.log('\n🔍 Listando todas as sessões do banco de dados...\n')
    
    const sessions = await prisma.whatsAppSession.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (sessions.length === 0) {
      console.log('❌ Nenhuma sessão encontrada no banco de dados')
      return
    }

    console.log(`✅ Total de sessões: ${sessions.length}\n`)
    console.log('─'.repeat(100))

    sessions.forEach((session, index) => {
      console.log(`\n📱 Sessão ${index + 1}:`)
      console.log(`   ID: ${session.id}`)
      console.log(`   Session ID: ${session.sessionId}`)
      console.log(`   Nome: ${session.name}`)
      console.log(`   Status: ${session.status}`)
      console.log(`   Telefone: ${session.phoneNumber || 'N/A'}`)
      console.log(`   Profile: ${session.profileName || 'N/A'}`)
      console.log(`   Usuário: ${session.user.name} (${session.user.email})`)
      console.log(`   Criado em: ${session.createdAt.toLocaleString('pt-BR')}`)
      console.log(`   Atualizado em: ${session.updatedAt.toLocaleString('pt-BR')}`)
    })

    console.log('\n' + '─'.repeat(100))
    console.log('\n💡 Para deletar uma sessão específica, use:')
    console.log('   npx tsx scripts/delete-session.ts <sessionId>\n')

  } catch (error) {
    console.error('❌ Erro ao listar sessões:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listSessions()
