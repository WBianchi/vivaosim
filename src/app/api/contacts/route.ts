import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validação para criação de contato
const createContactSchema = z.object({
  // Dados básicos
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  additionalPhone: z.string().optional(),
  document: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  notes: z.string().optional(),
  
  // Dados WhatsApp
  whatsappChatId: z.string().optional(),
  whatsappNumber: z.string().optional(),
  whatsappName: z.string().optional(),
  whatsappIsGroup: z.boolean().default(false),
  whatsappProfilePic: z.string().optional(),
  
  // Classificação
  source: z.enum(['WHATSAPP', 'WEBSITE', 'REFERRAL', 'SOCIAL_MEDIA', 'PHONE_CALL', 'EMAIL', 'OTHER']).default('WHATSAPP'),
  createdFrom: z.string().optional(),
  priority: z.number().min(1).max(5).default(1),
  
  // Relacionamentos
  queueId: z.string().optional(),
  assignedToId: z.string().optional(),
  
  // Tags iniciais
  tags: z.array(z.string()).optional()
})

// GET - Listar contatos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const queueId = searchParams.get('queueId')
    const status = searchParams.get('status')
    const assignedToId = searchParams.get('assignedToId')

    const skip = (page - 1) * limit

    // Filtros
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { whatsappNumber: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (queueId) where.queueId = queueId
    if (status) where.status = status
    if (assignedToId) where.assignedToId = assignedToId

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          queue: true,
          assignedTo: { select: { id: true, name: true, email: true } },
          tags: true,
          schedules: { take: 3, orderBy: { datetime: 'desc' } },
          tickets: { take: 3, orderBy: { createdAt: 'desc' } },
          _count: {
            select: {
              schedules: true,
              quotes: true,
              contracts: true,
              tickets: true
            }
          }
        }
      }),
      prisma.contact.count({ where })
    ])

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar contatos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar contato
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createContactSchema.parse(body)
    
    // Verificar se já existe contato com este whatsappChatId
    if (validatedData.whatsappChatId) {
      const existingContact = await prisma.contact.findUnique({
        where: { whatsappChatId: validatedData.whatsappChatId }
      })
      
      if (existingContact) {
        return NextResponse.json(
          { error: 'Já existe um contato vinculado a este chat do WhatsApp' },
          { status: 409 }
        )
      }
    }

    const { tags, ...contactData } = validatedData

    // Criar contato
    const contact = await prisma.contact.create({
      data: {
        ...contactData as any,
        // Criar tags se fornecidas
        tags: tags ? {
          create: tags.map(tagName => ({
            name: tagName,
            color: '#3B82F6', // Cor padrão
            createdById: (contactData as any).createdById || contactData.assignedToId
          })).filter(tag => tag.createdById) // Remove tags sem createdById
        } : undefined
      },
      include: {
        queue: true,
        assignedTo: { select: { id: true, name: true, email: true } },
        tags: true,
        createdBy: { select: { id: true, name: true, email: true } }
      }
    })

    // Log de atividade
    if ((contactData as any).createdById) {
      await prisma.contactActivity.create({
        data: {
          type: 'conversion',
          title: 'Contato criado a partir do WhatsApp',
          description: `Lead convertido do chat ${validatedData.whatsappChatId || 'desconhecido'}`,
          contactId: contact.id,
          userId: (contactData as any).createdById,
          metadata: {
            source: validatedData.source,
            createdFrom: validatedData.createdFrom,
            whatsappData: {
              chatId: validatedData.whatsappChatId,
              number: validatedData.whatsappNumber,
              name: validatedData.whatsappName
            }
          }
        }
      })
    }

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erro ao criar contato:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
