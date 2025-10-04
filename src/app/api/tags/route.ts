import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Verificar autenticação
async function verifyAuth(request: NextRequest) {
  const headersList = await headers()
  const authorization = headersList.get('authorization')

  if (!authorization?.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authorization.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }
}

const createTagSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  color: z.string().default('#3b82f6'),
  chatId: z.string().optional()
})

const updateTagSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  chatId: z.string().optional()
})

// GET - Listar tags
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const where: any = {
      userId: user.userId
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const tags = await prisma.whatsAppTag.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        chatTags: {
          include: {
            chat: {
              select: {
                id: true,
                name: true,
                chatId: true
              }
            }
          }
        }
      }
    })

    // Formatar resposta com contagem de uso
    const formattedTags = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      description: tag.description,
      color: tag.color,
      chatId: tag.chatId,
      usageCount: tag.chatTags.length,
      createdAt: tag.createdAt.toISOString(),
      updatedAt: tag.updatedAt.toISOString(),
      createdBy: tag.user,
      chats: tag.chatTags.map(ct => ct.chat)
    }))

    return NextResponse.json({ tags: formattedTags })
  } catch (error) {
    console.error('Erro ao buscar tags:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar tag
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createTagSchema.parse(body)
    
    const tag = await prisma.whatsAppTag.create({
      data: {
        ...validatedData,
        userId: user.userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    const formattedTag = {
      id: tag.id,
      name: tag.name,
      description: tag.description,
      color: tag.color,
      chatId: tag.chatId,
      usageCount: 0,
      createdAt: tag.createdAt.toISOString(),
      updatedAt: tag.updatedAt.toISOString(),
      createdBy: tag.user,
      chats: []
    }

    return NextResponse.json({ tag: formattedTag }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erro ao criar tag:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar tag
export async function PATCH(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID da tag é obrigatório' },
        { status: 400 }
      )
    }

    const validatedData = updateTagSchema.parse(updateData)
    
    // Verificar se a tag pertence ao usuário
    const existingTag = await prisma.whatsAppTag.findUnique({
      where: { id }
    })

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag não encontrada' },
        { status: 404 }
      )
    }

    if (existingTag.userId !== user.userId) {
      return NextResponse.json(
        { error: 'Sem permissão para editar esta tag' },
        { status: 403 }
      )
    }
    
    const tag = await prisma.whatsAppTag.update({
      where: { id },
      data: validatedData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        chatTags: {
          include: {
            chat: {
              select: {
                id: true,
                name: true,
                chatId: true
              }
            }
          }
        }
      }
    })

    const formattedTag = {
      id: tag.id,
      name: tag.name,
      description: tag.description,
      color: tag.color,
      chatId: tag.chatId,
      usageCount: tag.chatTags.length,
      createdAt: tag.createdAt.toISOString(),
      updatedAt: tag.updatedAt.toISOString(),
      createdBy: tag.user,
      chats: tag.chatTags.map(ct => ct.chat)
    }

    return NextResponse.json({ tag: formattedTag })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erro ao atualizar tag:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar tag
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID da tag é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se a tag pertence ao usuário
    const existingTag = await prisma.whatsAppTag.findUnique({
      where: { id }
    })

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag não encontrada' },
        { status: 404 }
      )
    }

    if (existingTag.userId !== user.userId) {
      return NextResponse.json(
        { error: 'Sem permissão para deletar esta tag' },
        { status: 403 }
      )
    }

    await prisma.whatsAppTag.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Tag deletada com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar tag:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
