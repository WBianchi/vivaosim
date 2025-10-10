import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeDuplicateContacts() {
  console.log('🔍 Buscando contatos duplicados...')

  // Buscar todos os contatos
  const contacts = await prisma.contact.findMany({
    orderBy: {
      createdAt: 'asc' // Manter o mais antigo
    }
  })

  // Agrupar por email ou telefone
  const groupedByEmail = new Map<string, typeof contacts>()
  const groupedByPhone = new Map<string, typeof contacts>()

  for (const contact of contacts) {
    if (contact.email) {
      if (!groupedByEmail.has(contact.email)) {
        groupedByEmail.set(contact.email, [])
      }
      groupedByEmail.get(contact.email)!.push(contact)
    }

    if (contact.phone) {
      if (!groupedByPhone.has(contact.phone)) {
        groupedByPhone.set(contact.phone, [])
      }
      groupedByPhone.get(contact.phone)!.push(contact)
    }
  }

  let duplicatesRemoved = 0

  // Remover duplicatas por email
  for (const [email, duplicates] of groupedByEmail.entries()) {
    if (duplicates.length > 1) {
      console.log(`\n📧 Email duplicado: ${email}`)
      console.log(`   ${duplicates.length} contatos encontrados`)
      
      // Manter o primeiro (mais antigo), deletar os outros
      const [keep, ...toDelete] = duplicates
      
      console.log(`   ✅ Mantendo: ${keep.name} (ID: ${keep.id})`)
      
      for (const contact of toDelete) {
        console.log(`   🗑️  Removendo: ${contact.name} (ID: ${contact.id})`)
        
        // Atualizar referências antes de deletar
        await prisma.quote.updateMany({
          where: { contactId: contact.id },
          data: { contactId: keep.id }
        })
        
        await prisma.schedule.updateMany({
          where: { contactId: contact.id },
          data: { contactId: keep.id }
        })
        
        await prisma.contract.updateMany({
          where: { contactId: contact.id },
          data: { contactId: keep.id }
        })
        
        // Deletar o duplicado
        await prisma.contact.delete({
          where: { id: contact.id }
        })
        
        duplicatesRemoved++
      }
    }
  }

  console.log(`\n✅ ${duplicatesRemoved} contatos duplicados removidos!`)
  
  await prisma.$disconnect()
}

removeDuplicateContacts()
  .catch((error) => {
    console.error('❌ Erro:', error)
    process.exit(1)
  })
