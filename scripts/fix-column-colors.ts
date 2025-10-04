import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const defaultColors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#EF4444', '#06B6D4', '#F59E0B', '#6366F1', '#6B7280']

async function fixColumnColors() {
  try {
    console.log('🔧 Atualizando cores das colunas...')
    
    // Buscar todas as colunas
    const columns = await prisma.kanbanColumn.findMany({
      orderBy: { createdAt: 'asc' }
    })
    
    console.log(`📊 Encontradas ${columns.length} colunas`)
    
    // Atualizar cada coluna
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i]
      
      // Se a cor for um gradiente antigo, atualizar para hex
      if (column.color.includes('from-') || column.color.includes('to-')) {
        const newColor = defaultColors[i % defaultColors.length]
        
        await prisma.kanbanColumn.update({
          where: { id: column.id },
          data: { color: newColor }
        })
        
        console.log(`✅ Coluna "${column.title}" atualizada: ${column.color} → ${newColor}`)
      } else {
        console.log(`⏭️  Coluna "${column.title}" já tem cor hex: ${column.color}`)
      }
    }
    
    console.log('🎉 Todas as colunas foram atualizadas!')
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixColumnColors()
