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

// Schema de validação
const createNoteSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  content: z.string().optional().nullable(),
  category: z.enum(['general', 'important', 'todo', 'idea', 'contact']).optional().default('general'),
  isPinned: z.boolean().optional().default(false),
  contactId: z.string().optional().nullable(),
  chatId: z.string().optional().nullable()
})

// GET - Listar anotações
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const chatId = searchParams.get('chatId')
    const contactId = searchParams.get('contactId')
    const category = searchParams.get('category')
    const isPinned = searchParams.get('isPinned')

    // Filtros
    const where: any = {}
    
    if (chatId) where.chatId = chatId
    if (contactId) where.contactId = contactId
    if (category) where.category = category
    if (isPinned === 'true') where.isPinned = true

    const notes = await prisma.note.findMany({
      where,
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        contact: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      anotacoes: notes,
      total: notes.length
    })
  } catch (error) {
    console.error('Erro ao buscar anotações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar nova anotação
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createNoteSchema.parse(body)

    const note = await prisma.note.create({
      data: {
        title: validatedData.title,
        content: validatedData.content || null,
        category: validatedData.category,
        isPinned: validatedData.isPinned,
        contactId: validatedData.contactId || null,
        chatId: validatedData.chatId || null,
        createdById: user.userId
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      note
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao criar anotação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
