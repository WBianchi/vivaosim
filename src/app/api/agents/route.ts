import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Verificar autenticação
async function verifyAuth(request: NextRequest) {
  const headersList = headers()
  const authorization = headersList.get('authorization')

  if (!authorization?.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authorization.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch {
    return null
  }
}

// GET - Listar agentes
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const model = searchParams.get('model')
    const niche = searchParams.get('niche')

    const where: any = {}

    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }

    if (model && model !== 'all') {
      where.model = model
    }

    if (niche && niche !== 'all') {
      where.niche = niche
    }

    const agents = await prisma.agent.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transformar para o formato esperado pelos componentes
    const formattedAgents = agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      model: agent.model,
      niche: agent.niche,
      role: agent.role,
      status: agent.status.toLowerCase(),
      userTypes: Array.isArray(agent.userTypes) ? agent.userTypes : [],
      activationModes: Array.isArray(agent.activationModes) ? agent.activationModes : [],
      prompt: agent.prompt,
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString(),
      createdBy: agent.createdBy,
      usage: {
        totalInteractions: agent.totalInteractions,
        successRate: agent.successRate,
        avgResponseTime: agent.avgResponseTime,
        lastUsed: agent.lastUsed?.toISOString() || null
      },
      integrations: agent.integrations || {
        chat: { active: false, config: {} },
        kanban: { active: false, config: {} },
        columns: { active: false, config: {} }
      }
    }))

    return NextResponse.json({ agents: formattedAgents })

  } catch (error) {
    console.error('Erro ao buscar agentes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Criar agente
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const agent = await prisma.agent.create({
      data: {
        name: data.name,
        description: data.description,
        model: data.model,
        niche: data.niche,
        role: data.role,
        status: data.status?.toUpperCase() || 'ACTIVE',
        prompt: data.prompt || '',
        temperature: data.temperature || 0.7,
        maxTokens: data.maxTokens || 2000,
        userTypes: data.userTypes || [],
        activationModes: data.activationModes || [],
        integrations: data.integrations || {},
        createdById: user.userId
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    // Formatar resposta
    const formattedAgent = {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      model: agent.model,
      niche: agent.niche,
      role: agent.role,
      status: agent.status.toLowerCase(),
      userTypes: Array.isArray(agent.userTypes) ? agent.userTypes : [],
      activationModes: Array.isArray(agent.activationModes) ? agent.activationModes : [],
      prompt: agent.prompt,
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString(),
      createdBy: agent.createdBy,
      usage: {
        totalInteractions: agent.totalInteractions,
        successRate: agent.successRate,
        avgResponseTime: agent.avgResponseTime,
        lastUsed: agent.lastUsed?.toISOString() || null
      },
      integrations: agent.integrations || {
        chat: { active: false, config: {} },
        kanban: { active: false, config: {} },
        columns: { active: false, config: {} }
      }
    }

    return NextResponse.json({ agent: formattedAgent })

  } catch (error) {
    console.error('Erro ao criar agente:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Atualizar agente
export async function PATCH(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json({ error: 'ID do agente é obrigatório' }, { status: 400 })
    }

    // Verificar se o agente existe
    const existingAgent = await prisma.agent.findUnique({
      where: { id }
    })

    if (!existingAgent) {
      return NextResponse.json({ error: 'Agente não encontrado' }, { status: 404 })
    }

    // Atualizar agente
    const agent = await prisma.agent.update({
      where: { id },
      data: {
        name: updateData.name,
        description: updateData.description,
        model: updateData.model,
        niche: updateData.niche,
        role: updateData.role,
        status: updateData.status?.toUpperCase(),
        prompt: updateData.prompt,
        temperature: updateData.temperature,
        maxTokens: updateData.maxTokens,
        userTypes: updateData.userTypes,
        activationModes: updateData.activationModes,
        integrations: updateData.integrations
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    // Formatar resposta
    const formattedAgent = {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      model: agent.model,
      niche: agent.niche,
      role: agent.role,
      status: agent.status.toLowerCase(),
      userTypes: Array.isArray(agent.userTypes) ? agent.userTypes : [],
      activationModes: Array.isArray(agent.activationModes) ? agent.activationModes : [],
      prompt: agent.prompt,
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString(),
      createdBy: agent.createdBy,
      usage: {
        totalInteractions: agent.totalInteractions,
        successRate: agent.successRate,
        avgResponseTime: agent.avgResponseTime,
        lastUsed: agent.lastUsed?.toISOString() || null
      },
      integrations: agent.integrations || {
        chat: { active: false, config: {} },
        kanban: { active: false, config: {} },
        columns: { active: false, config: {} }
      }
    }

    return NextResponse.json({ agent: formattedAgent })

  } catch (error) {
    console.error('Erro ao atualizar agente:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Deletar agente
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID do agente é obrigatório' }, { status: 400 })
    }

    // Verificar se o agente existe
    const existingAgent = await prisma.agent.findUnique({
      where: { id }
    })

    if (!existingAgent) {
      return NextResponse.json({ error: 'Agente não encontrado' }, { status: 404 })
    }

    // Deletar agente
    await prisma.agent.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Agente deletado com sucesso' })

  } catch (error) {
    console.error('Erro ao deletar agente:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
