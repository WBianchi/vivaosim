import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔍 Testando Prisma...')
    console.log('Prisma object:', prisma)
    console.log('Prisma contact model:', prisma.contact)
    
    // Teste básico - contar usuários
    const userCount = await prisma.user.count()
    console.log('✅ Prisma funcionando! Usuários no banco:', userCount)
    
    return NextResponse.json({
      success: true,
      message: 'Prisma está funcionando',
      userCount,
      prismaModels: Object.keys(prisma).filter(key => 
        typeof (prisma as any)[key] === 'object' && 
        (prisma as any)[key]?.findMany
      )
    })
  } catch (error) {
    console.error('❌ Erro no Prisma:', error)
    return NextResponse.json(
      { 
        error: 'Erro no Prisma', 
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
