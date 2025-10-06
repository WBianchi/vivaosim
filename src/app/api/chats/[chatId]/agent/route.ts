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

// POST - Atribuir agente ao chat
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { chatId } = await params
    const body = await request.json()
    const { agentId } = body

    console.log(`🤖 Atribuindo agente ${agentId} ao chat ${chatId}`)

    // Verificar se o agente existe
    const agent = await prisma.agent.findUnique({
      where: { id: agentId }
    })

    if (!agent) {
      return NextResponse.json({ error: 'Agente não encontrado' }, { status: 404 })
    }

    // Atualizar o agente com o chatId
    await prisma.agent.update({
      where: { id: agentId },
      data: {
        chatId: chatId
      }
    })

    console.log(`✅ Agente ${agent.name} atribuído ao chat ${chatId}`)

    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        name: agent.name,
        model: agent.model
      }
    })
  } catch (error) {
    console.error('Erro ao atribuir agente:', error)
    return NextResponse.json(
      { error: 'Erro ao atribuir agente' },
      { status: 500 }
    )
  }
}

// DELETE - Remover agente do chat
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { chatId } = await params

    console.log(`🤖 Removendo agente do chat ${chatId}`)

    // Remover chatId de todos os agentes desse chat
    await prisma.agent.updateMany({
      where: { chatId: chatId },
      data: { chatId: null }
    })

    console.log(`✅ Agente removido do chat ${chatId}`)

    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error('Erro ao remover agente:', error)
    return NextResponse.json(
      { error: 'Erro ao remover agente' },
      { status: 500 }
    )
  }
}

// GET - Buscar agente do chat
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { chatId } = await params

    console.log(`🤖 Buscando agente do chat ${chatId}`)

    // Buscar agente atribuído a este chat
    const agent = await prisma.agent.findFirst({
      where: { chatId: chatId }
    })

    if (!agent) {
      return NextResponse.json({
        success: true,
        agent: null
      })
    }

    console.log(`✅ Agente encontrado: ${agent.name}`)

    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        name: agent.name,
        description: agent.description,
        model: agent.model,
        niche: agent.niche,
        status: agent.status
      }
    })
  } catch (error) {
    console.error('Erro ao buscar agente:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar agente' },
      { status: 500 }
    )
  }
}
