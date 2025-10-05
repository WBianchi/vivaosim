import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

async function verifyAuth(request: NextRequest) {
  const headersList = await headers()
  const authorization = headersList.get('authorization')

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null
  }

  const token = authorization.substring(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }
}

// GET /api/contracts/by-chats?chatIds=id1,id2,id3
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const chatIdsParam = searchParams.get('chatIds')

    if (!chatIdsParam) {
      return NextResponse.json({ error: 'chatIds parameter is required' }, { status: 400 })
    }

    const chatIds = chatIdsParam.split(',').filter(id => id.trim())

    if (chatIds.length === 0) {
      return NextResponse.json({ 
        success: true, 
        contracts: [],
        contractsByChat: {}
      })
    }

    console.log(`📋 Buscando contratos para ${chatIds.length} chats...`)

    // Buscar todos os contratos desses chats
    const contracts = await prisma.contract.findMany({
      where: {
        chatId: {
          in: chatIds
        }
      },
      select: {
        id: true,
        title: true,
        amount: true,
        status: true,
        chatId: true,
        startDate: true,
        endDate: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`✅ ${contracts.length} contratos encontrados`)

    // Agrupar por chatId
    const contractsByChat: Record<string, any[]> = {}
    
    contracts.forEach(contract => {
      if (!contractsByChat[contract.chatId]) {
        contractsByChat[contract.chatId] = []
      }
      contractsByChat[contract.chatId].push(contract)
    })

    return NextResponse.json({
      success: true,
      contracts,
      contractsByChat
    })
  } catch (error) {
    console.error('Erro ao buscar contratos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar contratos' },
      { status: 500 }
    )
  }
}
