import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkWhatsAppData() {
  console.log('🔍 Verificando dados do WhatsApp...\n')

  // Verificar sessões
  const sessions = await prisma.whatsAppSession.count()
  console.log(`📱 Sessões WhatsApp: ${sessions}`)

  // Verificar contatos
  const contacts = await prisma.whatsAppContact.count()
  console.log(`👥 Contatos WhatsApp: ${contacts}`)

  // Verificar chats
  const chats = await prisma.whatsAppChat.count()
  console.log(`💬 Chats WhatsApp: ${chats}`)

  // Verificar chats com contatos vinculados
  const chatsWithContacts = await prisma.whatsAppChat.count({
    where: {
      contactId: {
        not: null
      }
    }
  })
  console.log(`✅ Chats com contatos vinculados: ${chatsWithContacts}`)

  // Listar alguns chats
  console.log('\n📋 Últimos 5 chats:')
  const recentChats = await prisma.whatsAppChat.findMany({
    take: 5,
    orderBy: {
      lastMessageAt: 'desc'
    },
    include: {
      contact: true
    }
  })

  for (const chat of recentChats) {
    console.log(`\n  💬 Chat: ${chat.name || 'Sem nome'}`)
    console.log(`     ID: ${chat.id}`)
    console.log(`     ChatId: ${chat.chatId}`)
    console.log(`     Contato vinculado: ${chat.contact ? chat.contact.name : '❌ Não vinculado'}`)
    console.log(`     Última mensagem: ${chat.lastMessage || 'N/A'}`)
  }

  await prisma.$disconnect()
}

checkWhatsAppData()
  .catch((error) => {
    console.error('❌ Erro:', error)
    process.exit(1)
  })
