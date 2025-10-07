import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

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

const quoteItemSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().nullish(),
  quantity: z.number().int().positive().default(1),
  unitPrice: z.number().positive('Preço unitário deve ser positivo'),
  total: z.number().positive()
})

const createQuoteSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().nullish(),
  discount: z.number().nullish(),
  validUntil: z.string().datetime().nullish(),
  contactId: z.string(),
  chatId: z.string().nullish(),
  items: z.array(quoteItemSchema).min(1, 'Adicione pelo menos um item')
})

const updateQuoteSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Título é obrigatório').optional(),
  description: z.string().nullish(),
  discount: z.number().nullish(),
  validUntil: z.string().datetime().nullish(),
  status: z.string().optional(),
  chatId: z.string().nullish(),
  items: z.array(quoteItemSchema).optional()
})

// GET - Listar orçamentos
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get('contactId')
    const status = searchParams.get('status')

    const where: any = {}
    
    if (contactId) where.contactId = contactId
    if (status && status !== 'all') where.status = status

    const quotes = await prisma.quote.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        contact: { 
          select: { 
            id: true, 
            name: true, 
            phone: true, 
            whatsappNumber: true,
            email: true 
          } 
        },
        createdBy: { 
          select: { 
            id: true, 
            name: true, 
            email: true 
          } 
        },
        items: true
      }
    })

    return NextResponse.json({ success: true, quotes })
  } catch (error) {
    console.error('Erro ao buscar orçamentos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar orçamento
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createQuoteSchema.parse(body)
    
    // Calcular totais
    const amount = validatedData.items.reduce((sum, item) => sum + item.total, 0)
    const discount = validatedData.discount || 0
    const total = amount - discount
    
    const quote = await prisma.quote.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        amount,
        discount,
        total,
        validUntil: validatedData.validUntil ? new Date(validatedData.validUntil) : null,
        chatId: validatedData.chatId,
        contactId: validatedData.contactId,
        createdById: user.userId,
        items: {
          create: validatedData.items as any
        }
      },
      include: {
        contact: { 
          select: { 
            id: true, 
            name: true, 
            phone: true, 
            whatsappNumber: true,
            email: true 
          } 
        },
        createdBy: { 
          select: { 
            id: true, 
            name: true, 
            email: true 
          } 
        },
        items: true
      }
    })

    // Log de atividade
    await prisma.contactActivity.create({
      data: {
        type: 'quote',
        title: `Orçamento criado: ${quote.title}`,
        description: `Orçamento de R$ ${quote.total.toFixed(2)} criado`,
        contactId: quote.contactId,
        userId: user.userId,
        metadata: {
          quoteId: quote.id,
          amount: quote.amount,
          total: quote.total,
          validUntil: quote.validUntil
        }
      }
    })

    return NextResponse.json({ quote }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erro ao criar orçamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar orçamento
export async function PATCH(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateQuoteSchema.parse(body)
    const { id, items, ...updateData } = validatedData

    // Calcular totais se itens foram fornecidos
    let amount, discount, total
    if (items && items.length > 0) {
      amount = items.reduce((sum, item) => sum + item.total, 0)
      discount = updateData.discount || 0
      total = amount - discount
    }

    // Preparar dados de atualização
    const updateDataPrisma: any = {
      title: updateData.title,
      description: updateData.description,
      validUntil: updateData.validUntil ? new Date(updateData.validUntil) : undefined,
      chatId: updateData.chatId,
      status: updateData.status
    }

    if (amount !== undefined) updateDataPrisma.amount = amount
    if (discount !== undefined) updateDataPrisma.discount = discount
    if (total !== undefined) updateDataPrisma.total = total
    
    if (items && items.length > 0) {
      updateDataPrisma.items = {
        deleteMany: {},
        create: items
      }
    }

    // Deletar itens existentes e criar novos
    const quote = await prisma.quote.update({
      where: { id },
      data: updateDataPrisma,
      include: {
        contact: { 
          select: { 
            id: true, 
            name: true, 
            phone: true, 
            whatsappNumber: true,
            email: true 
          } 
        },
        createdBy: { 
          select: { 
            id: true, 
            name: true, 
            email: true 
          } 
        },
        items: true
      }
    })

    // Log de atividade
    await prisma.contactActivity.create({
      data: {
        type: 'quote',
        title: `Orçamento atualizado: ${quote.title}`,
        description: `Orçamento de R$ ${quote.total.toFixed(2)} atualizado`,
        contactId: quote.contactId,
        userId: user.userId,
        metadata: {
          quoteId: quote.id,
          amount: quote.amount,
          total: quote.total,
          changes: updateData
        }
      }
    })

    return NextResponse.json({ quote })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erro ao atualizar orçamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar orçamento
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    await prisma.quote.delete({ where: { id } })

    return NextResponse.json({ message: 'Orçamento deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar orçamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
