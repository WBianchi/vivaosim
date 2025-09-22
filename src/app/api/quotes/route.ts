import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createQuoteSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  amount: z.number().positive('Valor deve ser positivo'),
  validUntil: z.string().datetime().optional(),
  contactId: z.string(),
  createdById: z.string()
})

// GET - Listar orçamentos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get('contactId')
    const status = searchParams.get('status')

    const where: any = {}
    
    if (contactId) where.contactId = contactId
    if (status) where.status = status

    const quotes = await prisma.quote.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        contact: { select: { id: true, name: true, phone: true, whatsappNumber: true } },
        createdBy: { select: { id: true, name: true, email: true } }
      }
    })

    return NextResponse.json(quotes)
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
    const body = await request.json()
    const validatedData = createQuoteSchema.parse(body)
    
    const quote = await prisma.quote.create({
      data: validatedData,
      include: {
        contact: { select: { id: true, name: true, phone: true, whatsappNumber: true } },
        createdBy: { select: { id: true, name: true, email: true } }
      }
    })

    // Log de atividade
    await prisma.contactActivity.create({
      data: {
        type: 'quote',
        title: `Orçamento criado: ${quote.title}`,
        description: `Orçamento de R$ ${quote.amount.toFixed(2)} criado`,
        contactId: quote.contactId,
        userId: quote.createdById,
        metadata: {
          quoteId: quote.id,
          amount: quote.amount,
          validUntil: quote.validUntil
        }
      }
    })

    return NextResponse.json(quote, { status: 201 })
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
