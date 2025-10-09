import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixSiteContact() {
  try {
    // Atualizar o site para o contato correto
    const result = await prisma.clientSite.update({
      where: { id: 'cmgcg32io0001ltf8pyiuocn5' },
      data: { contactId: 'cmggh4zei0002i04549ztbwcg' }
    })

    console.log('✅ Site atualizado!')
    console.log('Site ID:', result.id)
    console.log('Novo contactId:', result.contactId)
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixSiteContact()
